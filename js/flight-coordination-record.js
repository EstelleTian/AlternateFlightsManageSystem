var FlightCoordinationRecordObj = function () {
    var table = null;

    /**
     * 延时器,在指定的毫秒数后调用函数
     * fn 待执行函数
     * time 毫秒 指定的毫秒数后调用
     * */
    var timer = function (fn,time) {
        setTimeout(function () {
            fn(time)
        },time);
    };

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
                // table.export(opt.name);
            },
            position: "first"
        }).navButtonAdd('#' + pagerId, {
            caption: "高级查询",
            title: "高级查询",
            buttonicon: "glyphicon-search",
            onClickButton: function () {
                table.showAdvanceFilter();
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
        var flightDataId = ModuleLoader.data.id;
        var url = DataUrl.COORDINATION_RECORD;
        $.ajax({
            type: "GET",
            url: url,
            // data: "",
            dataType: "JSON",
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {
                    console.log(data);
                } else if (data.status == 500) {
                    console.warn(data.error.message);
                    timer(initUserAuthority,time);
                } else {
                    console.warn('获取协调记录为空');
                    timer(retrieveData,time);
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
                timer(retrieveData,time);
            }
        });
    };

    /**
     * 绘制表格数据
     * */

    var fireDataChange = function () {

    };

    return {
        init: function () {

            initTable();
            // 获取数据
            // retrieveData(1000*2);
        }
    }
}();
$(document).ready(function () {
    FlightCoordinationRecordObj.init();
});