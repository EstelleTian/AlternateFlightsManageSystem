/**
 *
 */


var App = function () {
    /*// 模块 class 名称
    var moduleClass = ['arr-module','alternate-module','over-module','dep-module'];
    // 模块内表格ID
    var tableIDs = ['arr-table','alternate-table','over-table','dep-table'];
    // 模块内表格pagerID
    var pagerIDs = ['arr-table-pager','alternate-table-pager','over-table-pager','dep-table-pager'];*/

    var arrObj = {};
    var alternateObj= {};
    var overObj = {};
    var depObj = {};
   /* // 模块对象
    var moduleObj = [arrObj,alternateObj,overObj,depObj];*/
    // 活动模块所在模块下标
    var index = 0;

    // 初始化模块
    var initModule = function () {
        // 进港计划模块
        arrObj = new FormModule({
            canvasId: 'arr-module',
            tableId: 'arr-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveArrFlights',
            initGridTable : function (table) {
                var opt = {
                    canvasId: 'arr-module',
                    tableId: 'arr-table',
                    pagerId: 'arr-table-pager'
                };
                initCommonTable(table, opt);
            }

        });
        arrObj.initFormModuleObject();

        // 备降计划模块
        alternateObj = new FormModule({
            canvasId: 'alternate-module',
            tableId: 'alternate-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveAlternateFlights',
            initGridTable : function (table) {
                console.log(table);
            }
        });
        alternateObj.initFormModuleObject();

        // 疆内飞越模块
        overObj = new FormModule({
            canvasId: 'over-module',
            tableId: 'over-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveOverFlights',
            initGridTable : function (table) {
                console.log(table);
            }
        });
        overObj.initFormModuleObject();

        // 出港计划模块
        depObj = new FormModule({
            canvasId: 'dep-module',
            tableId: 'dep-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveDepFlights',
            initGridTable : function (table) {
                console.log(table);
            }
        });
        depObj.initFormModuleObject();
    };

    /**
     * 初始化index，绑定菜单栏点击更新index
     * */
    var initIndex = function () {
        index = $('.main-area section.active').index();
        $('.menu-bar li').on('click',function () {
            index = $('.main-area section.active').index();
        });
    };
    
    /**
     * 初始化通用表格
     * */
    var initCommonTable = function (table,params) {
        var opt = {
            colNames: GridTableConfig.common.colName,
            colModel: GridTableConfig.common.colModel,
            cmTemplate: GridTableConfig.colModelTemplate,
            // colDisplay: flight_single_impact_grid_table_column_display,
            // colStyle: GridTableConfig,
            colTitle: GridTableConfig.common.colTitle,
            // colEdit: flight_single_impact_grid_table_column_edit,
            // colAuthority: user_authritys,
            // colCollaborateUrl: CellOpreationUrl,
            // colConverter: FlightGridTableDataUtil,
            /*params: {
             scorll: true,
             shrinkToFit: false,
             rowNum: 999999,
             // sortname: 'FLOWCONTROL_POINT_PASSTIME',
             sortorder: 'asc'
             },*/
            // baseData: {
            //     airportConfigs: airport_configuration,
            //     deiceGroups: user.deiceGroupName
            // },
            // autoScroll: 'FLOWCONTROL_POINT_PASSTIME',
            // onSelectRow: highlightCaculateFlight,
            // afterCollaborate: fireAreaFlightSingleDataChange
        };
        // 追加附加属性
        if($.isValidObject(params)){
            for(var i in params){
                opt[i] = params[i];
            }
        }
        table = new GridTable(opt);
        table.initGridTableObject();

    };
    
    var initAlertnate = function () {
        table = new GridTable({

        });
    }


    return {

        init : function () {
            initIndex();
            initModule();
        }
    }
}();

$(document).ready(function () {
    App.init();
});
