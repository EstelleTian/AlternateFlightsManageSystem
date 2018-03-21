var FlightCoordinationRecordObj = function () {
    var table = null;

    /**
     * 初始化表格
     * */
    var initTable = function () {
        //
        var pagerId = 'arr-table-pager';
        var opt = {
            moduleObj: arrObj, // 表格所在模块对象
            tableId: 'arr-table',
            pagerId: pagerId,
            colNames: FlightCoordinationRecordConfig.colNames,
            colModel: FlightCoordinationRecordConfig.colModel,
            cmTemplate: FlightCoordinationRecordConfig.colModelTemplate,
            colTitle: FlightCoordinationRecordConfig.common.colTitle,
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
    var retrieveData = function () {

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
            retrieveData();
        }
    }
}();
$(document).ready(function () {
    // FlightCoordinationRecordObj.init();
});