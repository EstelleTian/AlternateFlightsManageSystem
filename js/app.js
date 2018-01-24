/**
 *
 */


var app = function () {
    /*// 模块 class 名称
    var moduleClass = ['arr-module','alternate-module','over-module','dep-module'];
    // 模块内表格ID
    var tableIDs = ['arr-table','alternate-table','over-table','dep-table'];
    // 模块内表格pagerID
    var pagerIDs = ['arr-table-pager','alternate-table-pager','over-table-pager','dep-table-pager'];*/

    var socpeList = {
        arrObj : {

        }
    };

    var arrObj = {};
    var alternateObj= {};
    var alternateHistoryObj= {};
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
            initGridTable : function (data,table) {
                var opt = {
                    tableId: 'arr-table',
                    pagerId: 'arr-table-pager',
                    colNames: GridTableConfig.common.colName,
                    colModel: GridTableConfig.common.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.common.colTitle,

                    // colCollaborateUrl: CellOpreationUrl,
                    // colConverter: FlightGridTableDataUtil,
                    // params: {
                    //  // scorll: true,
                    //  // shrinkToFit: false,
                    //  // rowNum: 999999,
                    //  // sortname: 'FLOWCONTROL_POINT_PASSTIME',
                    //  // sortorder: 'asc'
                    //  },

                    // afterCollaborate: fireAreaFlightSingleDataChange
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                // 更新表格数据
                 table.fireTableDataChange(data);
            }

        });
        arrObj.initFormModuleObject();

        // 备降计划模块
        alternateObj = new FormModule({
            canvasId: 'alternate-module',
            tableId: 'alternate-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveAlternateFlights',
            initGridTable : function (data,table) {
                var opt = {
                    tableId: 'alternate-table',
                    pagerId: 'alternate-table-pager',
                    colNames: GridTableConfig.alertnate.colName,
                    colModel: GridTableConfig.alertnate.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.alertnate.colTitle
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                // 更新表格数据
                table.fireTableDataChange(data);
            }
        });
        alternateObj.initFormModuleObject();

        // 疆内飞越模块
        overObj = new FormModule({
            canvasId: 'over-module',
            tableId: 'over-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveOverFlights',
            initGridTable : function (data,table) {
                var opt = {
                    tableId: 'over-table',
                    pagerId: 'over-table-pager',
                    colNames: GridTableConfig.common.colName,
                    colModel: GridTableConfig.common.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.common.colTitle
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                // 更新表格数据
                table.fireTableDataChange(data);
            }
        });
        overObj.initFormModuleObject();

        // 出港计划模块
        depObj = new FormModule({
            canvasId: 'dep-module',
            tableId: 'dep-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveDepFlights',
            initGridTable : function (data,table) {
                var opt = {
                    tableId: 'dep-table',
                    pagerId: 'dep-table-pager',
                    colNames: GridTableConfig.common.colName,
                    colModel: GridTableConfig.common.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.common.colTitle
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                // 更新表格数据
                table.fireTableDataChange(data);
            }
        });
        depObj.initFormModuleObject();
    };

    /**
     * 初始化index，绑定菜单栏点击更新index
     * */
    var initIndex = function () {
        index = $('.main-area section.active').index();
        app.index = index;
        $('.menu-bar li').on('click',function () {
            index = $('.main-area section.active').index();
            app.index = index;
        });
    };


    var initHistory = function () {
        $('.history-inquire').on('click',function () {
            createModal();
            initHistoryModule();
        })
    };
    /**
     * 创建模态框并绘制模态框内容html结构
     * */
    var createModal = function () {
        var str = '<div class="alternate-history-module"><ul class="form-panel" ><li class="form-item"><label>开始日期</label><input type="text" class="start-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><label>结束日期</label><input type="text" class="end-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><button class="atfm-btn atfm-btn-blue ladda-button inquire" data-style="zoom-out"> <span class="ladda-label">查询</span> </button></li><li class="form-item"><span class="alert"></span></li></ul> <ul class="condition-panel hidden"> <li class="form-item"> 当前查询条件: </li> <li class="form-item date-scope hidden"></li><li class="form-item time-tip hidden"> 数据生成时间: </li>  <li class="form-item time hidden"> </ul><div class="result-panel"> <table id="alternate-history-table"></table> <div id="alternate-history-table-pager"></div> </div></div>';
        var options = {
            title: '查询历史',
            content: str,
            status: 1, /* 1:正常 2:警告 3:危险 不填:默认情况*/
            width: 1280,
            mtop : 160,
            showCancelBtn: false,
            isIcon : false
        };
        BootstrapDialogFactory.dialog(options);
        // 移除模态框footer
        $('#bootstrap-modal-dialog-footer').remove();
    };

    /**
     * 初始化备降历史数据查询模块
     *
     * */
    var initHistoryModule = function () {
        alternateHistoryObj = new HistoryFormModule({
            canvasId: 'alternate-history-module',
            tableId: 'alternate-history-table',
            url: 'http://192.168.243.104:8085/altf/airport/retrieveAlternateHistory',
            initGridTable: function (data, table) {
                var opt = {
                    tableId: 'alternate-history-table',
                    pagerId: 'alternate-history-table-pager',
                    colNames: GridTableConfig.alertnate.colName,
                    colModel: GridTableConfig.alertnate.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.alertnate.colTitle
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                // 更新表格数据
                table.fireTableDataChange(data);
            }

        });
        alternateHistoryObj.initHistoryFormModuleObject();
    };

    /**
     *  初始化各模块范围列表项
     *
     *  @param time 定时间隔 ms
     *
     *  因为范围列表项从后端请求，所以定时刷新校验数据有效性
     *
     * */

    var initScopeList = function (time) {
          var timer = setTimeout(function () {
              if($.isValidVariable(alternateAirport.airportConfig)){
                  clearTimeout(timer);
                  console.log(alternateAirport.airportConfig);
              }else {
                  initScopeList(time);
              }
          },time);
    };

    return {
        index : index,
        init : function () {
            initIndex();
            initModule();
            initHistory();
            initScopeList(1000);
        }
    }
}();

$(document).ready(function () {
    app.init();
});
