
/**
 * 查看协调记录
 * */
var FlightCoordinationRecordObj = function () {
    var table = null;
    // 计划批号
    var flightDataId ='';
    // 航班号
    var flightId = '';
    // 协调类型集合
    var recordType = ''

    /**
     * 初始化表格
     * */
    var initTable = function () {
        //
        var pagerId = 'record-table-pager';
        var opt = {
            tableId: 'record-table',
            pagerId: pagerId,
            colNames: FlightCoordinationRecordConfig.colName,
            colModel: FlightCoordinationRecordConfig.colModel,
            cmTemplate: FlightCoordinationRecordConfig.colModelTemplate,
            colTitle: FlightCoordinationRecordConfig.colTitle,
            params: {
                // sortname: 'peta',
                shrinkToFit: true,
                // sortorder: 'asc'
            }
        };

        table = new GridTable(opt);
        table.initGridTableObject();
        // 设置 Pager 按钮
        table.gridTableObject.navButtonAdd('#' + pagerId, {
            caption: "导出",
            title: "导出Excel",
            buttonicon: "glyphicon-export",
            onClickButton: function () {
                table.export(flightId+'('+flightDataId+')'+'协调记录');
            },
            position: "first"
        }).navButtonAdd('#' + pagerId, {
            caption: "快速过滤",
            title: "快速过滤",
            buttonicon: "glyphicon-filter",
            onClickButton: function () {
                //清理协调窗口
                table.clearCollaborateContainer();
                table.showQuickFilter();
            },
            position: "first"
        });
    };
    /**
     * 获取数据
     * */
    var retrieveData = function (time) {
        // 计划批号
        flightDataId = ModuleLoader.data.flightDataId;
        // 航班号
        flightId = ModuleLoader.data.flightId;
        var url = DataUrl.COORDINATION_RECORD+'?flightDataId='+flightDataId;
        $.ajax({
            type: "GET",
            url: url,
            // data: "",
            dataType: "JSON",
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {

                    if($.isValidObject(data.recordType)){
                        // 更新协调类型集合
                        recordType = convertTypeData(data.recordType);
                        FlightCoordinationRecordObj.recordType = recordType;
                        // 初始化表格
                        initTable();
                        // 绘制表格数据
                        fireDataChange(data);
                    }

                } else if (data.status == 500) {
                    console.warn(data.error.message);
                    Common.timeoutCallback(initUserAuthority,time);
                } else {
                    console.warn('获取协调记录为空');
                    Common.timeoutCallback(retrieveData,time);
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
                Common.timeoutCallback(retrieveData,time);
            }
        });
    };


    /**
     * 转换协调类型集合数据
     * */
    var convertTypeData = function (data) {
        typeCode = {};
        if($.isValidObject(data)){

            data.map(function (item, index, arr) {
                var val = item.value;
                typeCode[val] = item;
            });

        }
        return typeCode;
    };

    /**
     * 绘制表格数据
     * */

    var fireDataChange = function (data) {
        // 校验数据是否有效
        if(!$.isValidObject(data) || !$.isValidObject(data.altfCoordinationRecords)){
            // 清空表格数据
            table.gridTableObject.jqGrid('clearGridData');
            return;
        }

        // deep copy 保存源数据
        // thisProxy.data = $.extend(true, {}, dataObj);
        // 取得协调记录集合
        var records = data.altfCoordinationRecords;
        table.tableDataMap = {};
        table.tableData = {};
        var tableData = [];
        var tableMap = {};
        // 遍历 data为数组，采用map遍历不会打乱顺序
        records.map(function (item, index, arr) {
            var id = item.id;
            tableData.push(item);
            tableMap[id] = item;
        })
        table.tableDataMap = tableMap;
        table.tableData = tableData;
        // 绘制表格数据
        table.drawGridTableData();
        // 调整表格大小以适应所在容器
        table.gridTableObject.jqGrid('resizeSize')
        table.resizeToFitContainer();
    };

    return {
        recordType : recordType,
        init: function () {
            // 获取数据
            retrieveData(1000*2);
        }
    }
}();
$(document).ready(function () {
    FlightCoordinationRecordObj.init();
});