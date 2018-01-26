/**
 * 2018/01/23
 * author: zxy
 * 模块入口
 *
 */


var app = function () {
    /*// 模块 class 名称
    var moduleClass = ['arr-module','alternate-module','over-module','dep-module'];
    // 模块内表格ID
    var tableIDs = ['arr-table','alternate-table','over-table','dep-table'];
    // 模块内表格pagerID
    var pagerIDs = ['arr-table-pager','alternate-table-pager','over-table-pager','dep-table-pager'];*/

    // 所需各项基本参数
    var basicData = null;
    // 各模块范围列表项数据集合
    var scopeListData = null;
    // 右键协调窗口子菜单项数据集合
    var subCollaborateDomData = null;

    /**
     * 各模块对象
     * */
    // 进港计划模块
    var arrObj = {};
    // 备降计划模块
    var alternateObj= {};
    // 备降计划历史查询模块
    var alternateHistoryObj= {};
    // 疆内飞越模块
    var overObj = {};
    // 出港计划模块
    var depObj = {};

    // 定时器时间,用于设置每个模块定时间隔时间 ms
    var timer = 1000*60*0.2;
    // 活动模块所在模块下标
    var index = 0;

    // 初始化模块
    var initModule = function () {
        // 进港计划模块
        arrObj = new FormModule({
            // 容器ID
            canvasId: 'arr-module',
            // 表格ID
            tableId: 'arr-table',
            // 数据查询请求地址
            url : 'http://192.168.243.104:8085/altf/airport/retrieveArrFlights',
            // 定时器时间
            timer : timer,
            // 默认选中的范围值
            defaultScope : '1',
            // 初始化表格
            initGridTable : function (table) {
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
                return table;
            },
            // 自定义过滤规则
            customFilterFunc : function () {
                // 设置定时器时间为1分钟
                this.timer = 1000*60*1;
            }

        });
        arrObj.initFormModuleObject();

        // 备降计划模块
        alternateObj = new FormModule({
            canvasId: 'alternate-module',
            tableId: 'alternate-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveAlternateFlights',
            // 定时器时间
            timer : timer,
            // 默认选中的范围值
            defaultScope : 'ALL',
            initGridTable : function (table) {
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
                return table;
            },
            // 自定义过滤规则
            customFilterFunc : function () {
                // todo
                //
            }
        });
        alternateObj.initFormModuleObject();

        // 疆内飞越模块
        overObj = new FormModule({
            canvasId: 'over-module',
            tableId: 'over-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveOverFlights',
            // 定时器时间
            timer : timer,
            // 默认选中的范围值
            defaultScope : '1',
            initGridTable : function (table) {
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
                return table;
            }
        });
        overObj.initFormModuleObject();

        // 出港计划模块
        depObj = new FormModule({
            canvasId: 'dep-module',
            tableId: 'dep-table',
            url : 'http://192.168.243.104:8085/altf/airport/retrieveDepFlights',
            // 定时器时间
            timer : timer,
            // 默认选中的范围值
            defaultScope : '1',
            initGridTable : function (table) {
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
                return table;
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

    /**
     * 初始化备降历史数据查询
     * */
    var initHistory = function () {
        $('.history-inquire').on('click',function () {
            // 创建模态框
            createModal();
            // 初始化模块
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
        // 备降计划历史查询模块
        alternateHistoryObj = new HistoryFormModule({
            canvasId: 'alternate-history-module',
            tableId: 'alternate-history-table',
            url: 'http://192.168.243.104:8085/altf/airport/retrieveAlternateHistory',
            initGridTable: function (table) {
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
                return table;
            }
        });
        alternateHistoryObj.initHistoryFormModuleObject();
    };


    /**
     * 初始化所需各项基本参数
     * @param time 定时间隔 ms
     *
     *  因为数据从后端请求获取，所以定时刷新校验数据有效性
     * */
    var initBasicData = function (time) {
        // 若数据有效则更新各模块范围列表项，
        if($.isValidObject(alternateAirport.airportConfig) && $.isValidObject(alternateAirport.airportConfig.alternateAirport)){
            basicData  = alternateAirport.airportConfig;
            scopeListData  = alternateAirport.airportConfig;
            subCollaborateDomData = alternateAirport.airportConfig.alternateAirport;
            // 更新各模块范围列表项
            setScopeList();
            // 拼接各模块协调窗口列表项
            concatCollaborateDom();
            // 开启各模块定时刷新数据(按各自指定的默认范围为查询条件)
            InquireDataByTimeInterval();
        }else {
            // 数据无效则开启延时回调自身
            var timer = setTimeout(function () {
                initBasicData(time);
            },time);
        }
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

        // 若数据有效则更新各模块范围列表项，
        if($.isValidObject(alternateAirport.airportConfig) ){
            scopeListData = alternateAirport.airportConfig;
            // 更新各模块范围列表项
            setScopeList();
        }else {
            // 数据无效则开启延时回调自身
            var timer = setTimeout(function () {
                initScopeList(time);
            },time);
        }
    };

    /**
     * 更新各模块范围列表项
     *
     * */
    var setScopeList = function () {

        if($.isValidObject(scopeListData.airportConfig)){

            var airportConfig = scopeListData.airportConfig;
            // 进港计划模块
            var arrFlightsScope = airportConfig.arrFlightsScope;
            if ($.isValidObject(arrFlightsScope)) {
                arrObj.setScope(arrFlightsScope);
            }

            // 疆内飞越模块
            var overFlightsScope = airportConfig.overFlightsScope;
            if ($.isValidObject(overFlightsScope)) {
                overObj.setScope(overFlightsScope);
            }
            // 出港计划模块
            var depFlightsScope = airportConfig.depFlightsScope;
            if ($.isValidObject(depFlightsScope)) {
                depObj.setScope(depFlightsScope);
            }
        }

        // 备降计划模块
        if ($.isValidObject(scopeListData.alternateAirport)) {
            var alternateFlightsScope = scopeListData.alternateAirport;
            alternateObj.setScope(alternateFlightsScope);
        }
    };

    /**
     * 初始化各模块右键协调窗口DOM
     * @param time 定时间隔 ms
     *
     *  因为部分协调窗口列表项从后端请求，所以定时刷新校验数据有效性
     * */
    var initCollaborateDom = function (time) {
        // 若数据有效则更新各模块范围列表项，
        if($.isValidObject(alternateAirport.airportConfig) && $.isValidObject(alternateAirport.airportConfig.alternateAirport)){
            var collaborateDomData  = alternateAirport.airportConfig.alternateAirport;
            // 拼接各模块协调窗口列表项
            concatCollaborateDom(collaborateDomData);
        }else {
            // 数据无效则开启延时回调自身
            var timer = setTimeout(function () {
                initCollaborateDom(time);
            },time);
        }
    };

    /**
     * 拼接各模块协调窗口列表项
     * */
    var concatCollaborateDom = function () {
        /*
        * 1 = 民用机场  2= 军民合用 3=其他
        *
        * */
        var data = subCollaborateDomData;

        // 其它
        var other = '';
        // 军民合用
        var complex = '';
        // 民用
        var civil = '';
        data.map(function (item, index, arr) {
            var type = item.type;
            var value = item.value;
            var name = item.name;
            var node = '<li><a href="javascript:; " data-val="'+ value +'" class="'+ value +'">'+ name+'</a></li>';

            if(type ==1 ){
                civil += node;
            }else if(type ==2){
                complex += node;

            }else if(type ==3){
                other += node;
            }
        });


        //拼接军民合用子菜单
        GridTableCollaborateDom.COMPLEX.append(complex);
        // 追加到二级菜单中的军民合用菜单项下
        $('.complex', GridTableCollaborateDom.LEVEL2).parent().append(GridTableCollaborateDom.COMPLEX);
        // 拼接其它子菜单
        GridTableCollaborateDom.OTHER.append(other);
        // 追加到二级菜单中的其它菜单项下
        $('.other', GridTableCollaborateDom.LEVEL2).parent().append(GridTableCollaborateDom.OTHER);
        // 民用菜单项追加到二级菜单开头
        GridTableCollaborateDom.LEVEL2.prepend(civil);


        /**
         *  克隆二级菜单并追加到相应一级菜单项下
         * */
        // 进港计划模块 预选备降项
        cloneCollaborateDom($('.pre-alternate',GridTableCollaborateDom.ARR_DOM), GridTableCollaborateDom.LEVEL2);
        // 进港计划模块 确定备降项
        cloneCollaborateDom($('.confirm-alternate',GridTableCollaborateDom.ARR_DOM), GridTableCollaborateDom.LEVEL2);
        // 备降计划模块 更改预选
        cloneCollaborateDom($('.update-pre-alternate',GridTableCollaborateDom.ALTERNATE_DOM), GridTableCollaborateDom.LEVEL2);
        // 备降计划模块 更改备降
        cloneCollaborateDom($('.update-alternate',GridTableCollaborateDom.ALTERNATE_DOM), GridTableCollaborateDom.LEVEL2);
        // cloneCollaborateDom(GridTableCollaborateDom.OVER_DOM, GridTableCollaborateDom.LEVEL2);
        // cloneCollaborateDom(GridTableCollaborateDom.ARR_DOM, GridTableCollaborateDom.LEVEL2);
    };

    /**
     * 克隆二级菜单并追加到相应一级菜单项下
     *
     * @param $dom 被选菜单项元素
     * @param $template 被克隆元素(二级菜单)
     * */
    var cloneCollaborateDom = function ($dom,$template) {
        // 克隆
        var $node = $template.clone();
        // 追加到被选菜单项下
        $dom.parent().append($node);
    };

    /**
     * 开启各模块定时刷新数据
     * (按各自指定的默认范围为查询条件)
     * */
    var InquireDataByTimeInterval = function () {
        // 进港计划模块
        arrObj.initInquireData(true); // true 开启下一次定时刷新
        // 备降计划模块
        // alternateObj.initInquireData(true);
        // 疆内飞越模块
        // overObj.initInquireData(true);
        // 出港计划模块
        // depObj.initInquireData(true);
    };

    return {
        index : index,
        init : function () {
            initIndex();
            initModule();
            initHistory();
            /*initScopeList(1000);
            initCollaborateDom(1000);*/
            // 初始化所需各项基本参数
            initBasicData(1000);
        }
    }
}();

$(document).ready(function () {
    app.init();
});
