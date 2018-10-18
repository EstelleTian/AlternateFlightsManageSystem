/**
 * Created by caowei on 2018/10/18.
 */


/**
 * 查看协调记录
 * */
var FlightCoordinationRecordObj = function () {
    var table = null;
    // 航班号
    var airport = '';
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
            colNames: AirportCoordinationRecordConfig.colName,
            colModel: AirportCoordinationRecordConfig.colModel,
            cmTemplate: AirportCoordinationRecordConfig.colModelTemplate,
            colTitle: AirportCoordinationRecordConfig.colTitle,
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
                table.export(airport + '备降场容量协调记录');
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
        // 机场
        airport = ModuleLoader.data.airport;
        var url = ipHost + 'airport/retrievePositionCapacityRecords?airport='+airport;
        $.ajax({
            type: "GET",
            url: url,
            // data: "",
            dataType: "JSON",
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {

                    if($.isValidObject(data.altfPositionCapacityRecods)){
                        // 更新协调类型集合
                        recordType = convertTypeData(data.altfPositionCapacityRecods);
                        // 初始化表格
                        initTable();
                        // 绘制表格数据
                        fireDataChange(data);
                    }else{
                        $('.record-table-container').html('<h2 class="text-center mt200">暂无协调记录</h2>');
                        return
                    }

                } else if (data.status == 500) {
                    console.warn(data.error.message);
                    Common.timeoutCallback(initUserAuthority,time);
                } else {
                    $('.record-table-container').html('<h2 class="text-center mt200">暂无协调记录</h2>');
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
        var typeCode = {};
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
        if(!$.isValidObject(data) || !$.isValidObject(data.altfPositionCapacityRecods)){
            // 清空表格数据
            table.gridTableObject.jqGrid('clearGridData');
            return;
        }
        // 取得协调记录集合
        var records = data.altfPositionCapacityRecods;
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
        init: function () {
            // 获取数据
            retrieveData(1000*2);
        }
    }
}();
$(document).ready(function () {
    FlightCoordinationRecordObj.init();
});