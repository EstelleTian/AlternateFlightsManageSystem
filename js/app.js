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
    // 航班状态码
    var statusCode = {};

    // 表格右键可交互标记（进港和疆内飞越表格右键是否可交的限制条件依据）
    var collaborateFlag = false;

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

    // 各模块对象集合
    var moduleObjs = [];

    // 定时器时间,用于设置每个模块定时间隔时间 ms
    var interval = 1000*60*3;
    // 活动模块所在模块下标
    var index = 0;

    /** 设置默认活动模块
     *
     *  确保第一个模块为活动模块
     * */
    var initDefaultActiveModule = function () {
        $('.menu-bar li:first').addClass('active');
        $('.main-area section:first').addClass('active');
        // 下标大于0的移除active class
        $('.menu-bar li:gt(0)').removeClass('active');
        $('.main-area section:gt(0)').removeClass('active');

    };

    // 初始化模块
    var initModule = function () {
        // 进港计划模块
        arrObj = new FormModule({
            // 容器ID
            canvasId: 'arr-module',
            // 表格ID
            tableId: 'arr-table',
            // 数据查询请求地址
            url : DataUrl.ARR,
            // 定时器时间
            interval : interval,
            // 自定义定时器时间 (用于开启复杂天气模式),数字 毫秒
            customeInterval : 1000*60*1,
            // 默认选中的范围值
            defaultScope : '2',
            // 初始化表格
            initGridTable : function (table) {
                var opt = {
                    moduleObj : arrObj, // 表格所在模块对象
                    tableId: 'arr-table',
                    pagerId: 'arr-table-pager',
                    colNames: GridTableConfig.common.colName,
                    colModel: GridTableConfig.common.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.common.colTitle,
                    colCollaborateUrl: CellOpreationUrl,
                    params: {
                        sortname: 'peta',
                        shrinkToFit: true,
                        sortorder: 'asc'
                    }
                    // colConverter: FlightGridTableDataUtil,
                    // params: {
                    //  // scorll: true,
                    //  // shrinkToFit: false,
                    //  // rowNum: 999999,

                    //  },

                    // afterCollaborate: fireAreaFlightSingleDataChange
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                // table.gridTableObject.jqGrid("destroyFrozenColumns");
                return table;
            }
        });
        arrObj.initFormModuleObject();
        moduleObjs.push(arrObj);

        // 备降计划模块
        alternateObj = new FormModule({
            canvasId: 'alternate-module',
            tableId: 'alternate-table',
            url : DataUrl.ALTERNATE,
            // 定时器时间
            interval : interval,
            // 默认选中的范围值
            defaultScope : 'ALL',
            initGridTable : function (table) {
                var opt = {
                    moduleObj : alternateObj, // 表格所在模块对象
                    tableId: 'alternate-table',
                    pagerId: 'alternate-table-pager',
                    colNames: GridTableConfig.alertnate.colName,
                    colModel: GridTableConfig.alertnate.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.alertnate.colTitle,
                    colCollaborateUrl: CellOpreationUrl,
                    params: {
                        // sortname: 'executeDate',
                        // sortorder: 'asc'
                    }
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                return table;
            }
        });
        alternateObj.initFormModuleObject();
        moduleObjs.push(alternateObj);
        // 疆内飞越模块
        overObj = new FormModule({
            canvasId: 'over-module',
            tableId: 'over-table',
            url : DataUrl.OVER,
            // 定时器时间
            interval : interval,
            // 默认选中的范围值
            defaultScope : '2',
            initGridTable : function (table) {
                var opt = {
                    moduleObj : overObj, // 表格所在模块对象
                    tableId: 'over-table',
                    pagerId: 'over-table-pager',
                    colNames: GridTableConfig.common.colName,
                    colModel: GridTableConfig.common.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.common.colTitle,
                    colCollaborateUrl: CellOpreationUrl,
                    params: {
                        sortname: 'peta',
                        shrinkToFit: true,
                        sortorder: 'asc'
                    }
                };
                table = new GridTable(opt);
                table.initGridTableObject();
                // table.gridTableObject.jqGrid("destroyFrozenColumns");
                return table;
            }
        });
        overObj.initFormModuleObject();
        moduleObjs.push(overObj);
        /*// 出港计划模块
        depObj = new FormModule({
            canvasId: 'dep-module',
            tableId: 'dep-table',
            url : DataUrl.DEP,
            // 定时器时间
            interval : interval,
            // 默认选中的范围值
            defaultScope : '2',
            initGridTable : function (table) {
                var opt = {
                    tableId: 'dep-table',
                    pagerId: 'dep-table-pager',
                    colNames: GridTableConfig.common.colName,
                    colModel: isHiddenCol(GridTableConfig.common.colModel,['position'], false) ,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.common.colTitle,
                    colCollaborateUrl: CellOpreationUrl,
                    params: {
                        sortname: 'detd',
                        shrinkToFit: true,
                        sortorder: 'asc'
                    }

                };
                table = new GridTable(opt);
                table.initGridTableObject();
                table.gridTableObject.jqGrid("destroyFrozenColumns");
                return table;
            }
        });
        depObj.initFormModuleObject();
        moduleObjs.push(depObj);*/
    };


    /**
     *  绑定菜单栏事件，切换模块显隐及活动模块
     * */
    var initActiveModule = function () {

        $('.menu-bar li').on('click',function () {
            // 取得当前点击对象
            var $that = $(this);

            var i = $that.index();
            if(index == i){
                return;
            }
            index = i;
            // 切换活动模块
            activeModuleToggle(index);
            $('.menu-bar li').removeClass('active');
            $('.main-area section').removeClass('active');
            $that.addClass('active');
            $('.main-area section').eq(index).addClass('active');
            //处理表格自适应TODO
            $(window).trigger('resize')
        });
    };
    /**
     * 切换活动模块
     * */
    var activeModuleToggle = function (index) {
        var len = moduleObjs.length;
        // 校验点击模块
        if(index > len-1){
            return
        }

        // 取消所有模块活动
        moduleObjs.map(function (item, index, arr) {
            item.setActive(false);
        });
        // 设置当前活动
        moduleObjs[index].setActive(true);
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
        var str = '<div class="alternate-history-module"><ul class="form-panel" ><li class="form-item"><label>开始日期</label><input type="text" class="start-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><label>结束日期</label><input type="text" class="end-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><button class="atfm-btn atfm-btn-blue ladda-button inquire" data-style="zoom-out"> <span class="ladda-label">查询</span> </button></li><li class="form-item"><span class="alert"></span></li><li class="form-item time"></ul> <ul class="condition-panel hidden"> <li class="form-item"> 当前查询条件: </li> <li class="form-item date-scope hidden"></li> </ul><div class="result-panel"> <table id="alternate-history-table"></table> <div id="alternate-history-table-pager"></div> </div></div>';
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
            url: DataUrl.ALTERNATE_HISTORY,
            initGridTable: function (table) {
                var opt = {
                    tableId: 'alternate-history-table',
                    pagerId: 'alternate-history-table-pager',
                    colNames: GridTableConfig.alertnate.colName,
                    colModel: GridTableConfig.alertnate.colModel,
                    cmTemplate: GridTableConfig.colModelTemplate,
                    colTitle: GridTableConfig.alertnate.colTitle,
                    colCollaborateUrl: CellOpreationUrl,
                    params: {
                        // sortname: 'executeDate',
                        // sortorder: 'asc'
                    }
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
        var url = ipHost + 'airport/retrieveAirportConfig'
        $.ajax({
            type: "GET",
            url: url,
            data: "",
            dataType: "JSON",
            // async: false,
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {
                    basicData = data;
                } else if (data.status == 500) {
                    console.warn(data.error.message)
                } else {
                    console.warn('获取机场配置为空')
                }
            },
            error: function (xhr, status, error) {
                console.error(error)
            }
        });

        // 若数据有效则更新各模块范围列表项，
        if($.isValidObject(basicData) && $.isValidObject(basicData.airportConfig) && $.isValidObject(basicData.alternateAirport)){
            // scopeListData  = basicData.airportConfig;
            subCollaborateDomData = basicData.alternateAirport;
            // 更新各模块范围列表项
            setScopeList();
            // 拼接各模块协调窗口列表项
            concatCollaborateDom();
            // 更新状态列数值参数
            setStatusCode();
            // 开启各模块定时刷新数据(按各自指定的默认范围为查询条件)
            // InquireDataByTimeInterval();//初始化活动模块
            // 获取活动模块下标
            index = $('.main-area section.active').index();
            // 切换活动模块
            activeModuleToggle(index);
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
        var scopeListData = basicData.airportConfig;

        // 进港计划模块
        var arrFlightsScope = scopeListData.arrFlightsScope;
        if ($.isValidObject(arrFlightsScope)) {
            arrObj.setScope(arrFlightsScope);
        }

        // 疆内飞越模块
        var overFlightsScope = scopeListData.overFlightsScope;
        if ($.isValidObject(overFlightsScope)) {
            overObj.setScope(overFlightsScope);
        }
        // 出港计划模块
        /* var depFlightsScope = scopeListData.depFlightsScope;
         if ($.isValidObject(depFlightsScope)) {
         depObj.setScope(depFlightsScope);
         }*/

        // 备降计划模块
        if ($.isValidObject(basicData.alternateAirport)) {
            var alternateFlightsScope = basicData.alternateAirport;
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
            // var name = item.name;
            var name = item.text;
            var node = '<li data-val="'+ value +'" class="'+ value +'"><a href="javascript:; " >'+ name+'</a></li>';

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
        $('.complex', GridTableCollaborateDom.LEVEL2).append(GridTableCollaborateDom.COMPLEX);
        // 拼接其它子菜单
        GridTableCollaborateDom.OTHER.append(other);
        // 追加到二级菜单中的其它菜单项下
        $('.other', GridTableCollaborateDom.LEVEL2).append(GridTableCollaborateDom.OTHER);
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

        // 疆内飞越计划模块 预选备降项
        cloneCollaborateDom($('.pre-alternate',GridTableCollaborateDom.OVER_DOM), GridTableCollaborateDom.LEVEL2);
        // 疆内飞越计划模块 确定备降项
        cloneCollaborateDom($('.confirm-alternate',GridTableCollaborateDom.OVER_DOM), GridTableCollaborateDom.LEVEL2);
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
        $dom.append($node);
    };

    /**
     * 开启各模块定时刷新数据
     * (按各自指定的默认范围为查询条件)
     * */
    var InquireDataByTimeInterval = function () {
        // 进港计划模块
        // arrObj.initInquireData(true); // true 开启下一次定时刷新
        // 备降计划模块
        // alternateObj.initInquireData(true);
        // 疆内飞越模块
        // overObj.initInquireData(true);
        // 出港计划模块
        // depObj.initInquireData(true);
    };

    /**
     * 更新状态列数值参数
     * */
    var setStatusCode = function () {
        if($.isValidObject(basicData.airportConfig) && $.isValidObject(basicData.airportConfig.alternateStatus)){
            var alternateStatus = basicData.airportConfig.alternateStatus;
            statusCode = {};
            alternateStatus.map(function (item, index, arr) {
                var val = item.value;
                statusCode[val] = item;
            });
            app.statusCode = statusCode;
        }
    };

    /**
     * 设置colModel指定项是否隐藏
     *
     * @data colModel arr
     *
     * @ 指定项 arr
     *
     * @ bool 是否隐藏
     * */
    var isHiddenCol = function (data,name,bool) {
        if($.isValidObject(data) && $.isValidObject(name)){
            name.map(function (i, index, arr) {

                data.map(function (item, p2, p3) {
                    if(item.name == i){
                        item.hidden = bool;
                    }
                })
            })

        }
        return data;
    };

    /**
     * 绑定进港计划模块切换复杂天气模式关联疆内飞越模块表格右键可交互标记
     * */
    var changeCollaborateFlag = function () {
        // 取得checkbox
        var $box = $('input#change-weather-model', '.arr-module');
        // checkbox绑定点击事件
        $box.on('click',function () {
            // 取得checkbox勾选状态
            var bool = $box.prop('checked');
            // 若勾选
            if(bool){
                // 更新表格右键可交互标记
                collaborateFlag = true;
                app.collaborateFlag = true;
            }else {
                // 更新表格右键可交互标记
                collaborateFlag = false;
                app.collaborateFlag = false;
                // 清除进港表格协调菜单
                if($.isValidObject(arrObj.table) && $.isValidVariable(arrObj.table.clearCollaborateContainer)){
                    arrObj.table.clearCollaborateContainer();
                }
                // 清除飞越表格协调菜单
                if($.isValidObject(overObj.table) && $.isValidVariable(overObj.table.clearCollaborateContainer)){
                    overObj.table.clearCollaborateContainer();
                }
            }
        });
    };

    /**
     * 初始化机位管理模块
     * */
    var initPostionModule = function () {

        $('.position-config').on('click',function () {
            // 获取机位分类数据
            getPostionDatas();
        })
    }
    /**
     * 获取机位分类数据
     * */
    var getPostionDatas = function () {
        // 清除提示信息
        $('.position-module .alert').html('').removeClass('alert-danger active');
        //ajax请求获取数据
        $.ajax({
            url:DataUrl.POSTION_LIST,
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                // 数据无效
                if (!data) {
                    // 显示提示信息
                    $('.position-module .alert').html('暂无数据').addClass('alert-danger active')
                };
                // 成功
                if (data.status == 200) {
                    // 更新数据生成时间
                    if($.isValidVariable(data.generateTime)){
                        var time = '数据生成时间: '+ formaterGenerateTime( data.generateTime);
                        $('.position-module .time').text(time)
                    }

                    // 绘制出机位列表
                    drawPostion(data);
                    // 绑定拖动排序
                    bindSortable(data);
                }
            },
            error: function ( status, error) {
                console.error('ajax requset  fail, error:');
                console.error(error);
            }
        });
    };

    /**
     * 格式化数据生成时间
     * */
    var formaterGenerateTime = function (time) {
        var str = '';
        if(time.length == 12){
            var year = time.substring(0, 4);
            var mon = time.substring(4, 6);
            var date = time.substring(6, 8);
            var hour = time.substring(8, 10);
            var min = time.substring(10, 12);
            str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
        }

        return str;
    };
    var drawPostion = function (data) {
        //检测数据是否有效
        if(!$.isValidObject(data.configs)) {
            return;
        }
        //取得机位配置数据
        var  config = data.configs;
        // 将机位内部的机型字段值转为数组
        config.map(function (item, index, arr) {
                item.value = item.value.split(',');
        });
        // 利用Handlebars模版生成对应HTML结构
        var myTemplate = Handlebars.compile($("#template").html());
        $('#position-box').html(myTemplate(config));
    };

    var bindSortable = function (data) {
        // 对应数据集合
        var obj = {};
        if($.isValidObject(data.configs)){
            //取得机位配置数据
            var  config = data.configs;
            // 将机位内部的机型字段值转为数组
            config.map(function (item, index, arr) {
                obj[item.id] = $.extend(true,{},item)
            });
        }

        // 配置初始化参数
        var sort = new SortablePart({
            data : obj,
            selector : $('#position-box'),
            addBtn : $('.add-btn'),
            revertBtn : $('.revert-btn'),
            saveBtn : $('.save-btn'),
            handle: ".position-header", //限制排序开始点击指定的元素
            placeholder : 'sortable-placeholder position'
        })
        //初始化
        sort.init();
    }

    return {
        statusCode : statusCode,
        collaborateFlag : collaborateFlag,
        init : function () {
            // 设置默认活动模块
            initDefaultActiveModule();
            // 初始化模块
            initModule();
            // 初始化备降历史数据查询模块
            initHistory();
            // 初始化所需各项基本参数
            initBasicData(1000);
            // 绑定菜单栏事件，切换模块显隐及活动模块
            initActiveModule();
            // 绑定进港计划模块切换复杂天气模式关联疆内飞越模块表格右键可交互标记
            changeCollaborateFlag();
            //机位管理模块
            initPostionModule();
        }
    }
}();

$(document).ready(function () {
    app.init();
});
