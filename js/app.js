/**
 * 2018/01/23
 * author: zxy
 * 模块入口
 *
 */
var userId = null;
// 用户权限
var userProperty = null;

var app = function () {
    // 所需各项基本参数
    var basicData = null;
    // 定时器总开关
    var timerValve = true;
    // 各模块范围列表项数据集合
    var scopeListData = null;
    // 右键协调窗口子菜单项数据集合
    var subCollaborateDomData = null;
    // 航班状态码
    var statusCode = {};
    // 机位状态码
    var positionStatus = {};

    // 机场类型
    var airportType = {};
    // 表格右键可交互标记（进港和疆内飞越表格右键是否可交的限制条件依据）
    var collaborateFlag = false;

    // 各模块对象集合
    var moduleObjs = [];
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
    var interval = 1000*30;
    // 自定义定时器时间 (用于开启复杂天气模式) ms
    var customeInterval = 1000*15;
    // 活动模块所在模块下标
    var index = 0;

    /** 设置默认活动模块
     *
     *  确保第一个模块为活动模块
     * */
    var initDefaultActiveModule = function () {
        $('.menu-list li:first').addClass('active');
        $('.main-area section:first').addClass('active');
        // 下标大于0的移除active class
        $('.menu-list li:gt(0)').removeClass('active');
        $('.main-area section:gt(0)').removeClass('active');

    };

    // 初始化模块
    var initModule = function () {
        if($.isValidObject(userProperty.id_4000)) {
            // 进港计划模块
            arrObj = new FormModule({
                // 容器ID
                canvasId: 'arr-module',
                // 表格ID
                tableId: 'arr-table',
                // 数据查询请求地址
                url: DataUrl.ARR,
                // 定时器时间
                interval: interval,
                // 自定义定时器时间 (用于开启复杂天气模式),数字 毫秒
                customeInterval: customeInterval,
                // 默认选中的范围值
                defaultScope: '2',
                // 初始化表格
                initGridTable: function (table) {
                    var pagerId = 'arr-table-pager';
                    var opt = {
                        moduleObj: arrObj, // 表格所在模块对象
                        tableId: 'arr-table',
                        pagerId: pagerId,
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
                    // 设置 Pager 按钮
                    table.gridTableObject
                        .navButtonAdd('#' + pagerId, {
                            caption: "导出",
                            title: "导出Excel",
                            buttonicon: "glyphicon-export",
                            onClickButton: function () {
                                table.export('arr-table');
                            },
                            position: "first"
                        }) .navButtonAdd('#' + pagerId, {
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
                    return table;
                }
            });
            arrObj.initFormModuleObject();
            moduleObjs.push(arrObj);
        }
        if($.isValidObject(userProperty.id_4100)){
            // 疆内飞越模块
            overObj = new FormModule({
                canvasId: 'over-module',
                tableId: 'over-table',
                url : DataUrl.OVER,
                // 定时器时间
                interval : interval,
                // 自定义定时器时间 (用于开启复杂天气模式),数字 毫秒
                customeInterval: customeInterval,
                // 默认选中的范围值
                defaultScope : '2',
                initGridTable : function (table) {
                    var pagerId = 'over-table-pager';
                    var opt = {
                        moduleObj : overObj, // 表格所在模块对象
                        tableId: 'over-table',
                        pagerId: pagerId,
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
                    // 设置 Pager 按钮
                    table.gridTableObject
                        .navButtonAdd('#' + pagerId, {
                            caption: "导出",
                            title: "导出Excel",
                            buttonicon: "glyphicon-export",
                            onClickButton: function () {
                                table.export('over-table');
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
                    return table;
                }
            });
            overObj.initFormModuleObject();
            moduleObjs.push(overObj);

        }
        if($.isValidObject(userProperty.id_4200)){
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
                    var pagerId = 'alternate-table-pager';
                    var opt = {
                        moduleObj : alternateObj, // 表格所在模块对象
                        tableId: 'alternate-table',
                        pagerId: pagerId,
                        colNames: GridTableConfig.alertnate.colName,
                        colModel: GridTableConfig.alertnate.colModel,
                        cmTemplate: GridTableConfig.alertnate.colModelTemplate,
                        colTitle: GridTableConfig.alertnate.colTitle,
                        colCollaborateUrl: CellOpreationUrl,
                        params: {
                            shrinkToFit: true,
                            // sortname: 'executeDate',
                            // sortorder: 'asc'
                        }
                    };
                    table = new GridTable(opt);
                    table.initGridTableObject();
                    // 设置 Pager 按钮
                    // 备降计划 --- 导出
                    table.gridTableObject
                        .navButtonAdd('#' + pagerId, {
                            caption: "导出",
                            title: "导出Excel",
                            buttonicon: "glyphicon-export",
                            onClickButton: function () {
                                var params = {
                                    scope : alternateObj.scope,
                                    keyWord : alternateObj.keyword
                                }
                                table.exportAlternateToExcel( 'alternate', params);
                            },
                            position: "first"
                        }) .navButtonAdd('#' + pagerId, {
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
                    return table;
                }
            });
            alternateObj.initFormModuleObject();
            moduleObjs.push(alternateObj);

        }
        if($.isValidObject(userProperty.id_4210)){
            // 备降计划历史查询模块
            alternateHistoryObj = new HistoryFormModule({
                canvasId: 'alternate-history-module',
                tableId: 'alternate-history-table',
                url: DataUrl.ALTERNATE_HISTORY,
                // 定时器时间
                interval : interval,
                // 默认选中的范围值
                defaultScope : '',
                initGridTable: function (table) {
                    var pagerId = 'alternate-history-table-pager';
                    var opt = {
                        moduleObj : alternateHistoryObj, // 表格所在模块对象
                        tableId: 'alternate-history-table',
                        pagerId: pagerId,
                        colNames: GridTableConfig.alertnateHistory.colName,
                        colModel: GridTableConfig.alertnateHistory.colModel,
                        cmTemplate: GridTableConfig.colModelTemplate,
                        colTitle: GridTableConfig.alertnateHistory.colTitle,
                        // colCollaborateUrl: CellOpreationUrl,
                        params: {
                            shrinkToFit: true,
                            // sortname: 'executeDate',
                            // sortorder: 'asc'
                        }
                    };
                    table = new GridTable(opt);
                    table.initGridTableObject();
                    // 设置 Pager 按钮
                    table.gridTableObject
                        .navButtonAdd('#' + pagerId, {
                            caption: "导出",
                            title: "导出Excel",
                            buttonicon: "glyphicon-export",
                            onClickButton: function () {
                                var params = {
                                    scope : '',
                                    keyWord : '',
                                    start : alternateHistoryObj.start,
                                    end : alternateHistoryObj.end,
                                    alternateStatus:alternateHistoryObj.scope
                                }
                                table.exportAlternateHistoryToExcel( 'history', params);
                            },
                            position: "first"
                        }) .navButtonAdd('#' + pagerId, {
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

                    return table;
                }
            });
            alternateHistoryObj.initHistoryFormModuleObject();
            moduleObjs.push(alternateHistoryObj);

        }
        if($.isValidObject(userProperty.id_4300)){
            // 备降容量模块
            var capacityObj = alternateAirport.init();
            moduleObjs.push(capacityObj);
        }
        if($.isValidObject(userProperty.id_4400)){
            //机位分类配置模块
            var positionObj = positionModule.init();
            moduleObjs.push(positionObj);
        }
        if($.isValidObject(userProperty.id_4700)){
            //备降场管理模块
            var airportObj = airportModule.init();
            moduleObjs.push(airportObj);
        }
        //容量模块
        initCapacityModule(1000*1);

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
    // 初始化容量模块
    var initCapacityModule = function (time) {
        // 若机场类型参数有效(即成功获取到)
        if($.isValidObject(basicData) &&
            $.isValidObject(basicData.airportConfig) &&
            $.isValidObject(basicData.airportConfig.airportType)){
            // 调用容量模块初始化方法
            alternateAirport.initCapacityTypeConpoments(scopeListData.airportType)
        }else {
            Common.timeoutCallback(initCapacityModule,time);
        }
    };


    /**
     *  绑定菜单栏事件，切换模块显隐及活动模块
     * */
    var initActiveModule = function () {

        $('.menu-list li').on('click',function () {
            // 取得当前点击对象
            var $that = $(this);

            var i = $that.index();
            if(index == i){
                return;
            }
            index = i;

            $('.menu-list li').removeClass('active');
            $('.main-area section').removeClass('active');
            $that.addClass('active');
            $('.main-area > section').eq(index).addClass('active');
            // 切换活动模块
            activeModuleToggle(index);
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
     * 阻止右键点击默认事件
     *
     * */
    var preventContextmenu = function () {
        document.oncontextmenu = function () {
            return false;
        };
    };

    /**
     *初始化用户权限
     *
     * time 若数据无效，指定时间后再次请求一次
     *
     * */
    var initUserAuthority = function (time) {
        userId = sessionStorage.getItem('userId');
        var url = DataUrl.USER_AUTHORITY + userId;
        $.ajax({
            type: "GET",
            url: url,
            data: "",
            dataType: "JSON",
            // async: false,
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {
                    if($.isValidObject(data.userAuthority)){
                        // 数据有效
                        var property = data.userAuthority;
                        // 转换用户权限数据
                        userProperty = convertProperty(property);
                        userProperty.userName = data.userName; // 用户名
                        userProperty.userNameCn = data.userNameCn; // 用户名
                        userProperty.useBranch = data.useBranch; // 是否为支线机场用户 true:支线用户  false:不是支线用户
                        userProperty.airport = data.airport || ""; // 用户自己机场名称
                        // 依据用户权限处理模块显示
                        initModuleLayout();
                        // 设置默认活动模块
                        initDefaultActiveModule();
                        // 初始化模块
                        initModule();
                        // 绑定菜单栏事件，切换模块显隐及活动模块
                        initActiveModule();
                        // 绑定开启复杂天气模式按钮点击事件
                        initChangeWeatherModel();
                        // 初始化显示用户信息
                        initUserInfo();
                    }else{
                        console.warn('获取用户权限为空');
                        Common.timeoutCallback(initUserAuthority,time);
                    }
                } else if (data.status == 500) {
                    console.warn(data.error.message);
                    Common.timeoutCallback(initUserAuthority,time);
                } else {
                    console.warn('获取用户权限为空');
                    Common.timeoutCallback(initUserAuthority,time);
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
                Common.timeoutCallback(initUserAuthority,1000*60);
            }
        });

    }

    /**
     * 初始化所需各项基本参数
     * @param time 定时间隔 ms 指定时间后再次请求一次
     *
     *  定时刷新校验数据有效性
     * */
    var initBasicData = function (time) {
        var url = DataUrl.AIRPORT_CONFIG;
        $.ajax({
            type: "GET",
            url: url,
            data: "",
            dataType: "JSON",
            // async: false,
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200
                    && $.isValidObject(data.airportConfig)
                    && $.isValidObject(data.alternateAirport)
                ) {
                    basicData = data;
                    scopeListData = basicData.airportConfig;
                    app.airportConfig = scopeListData;
                    subCollaborateDomData = basicData.alternateAirport;
                } else if (data.status == 500) {
                    console.warn(data.error.message);
                    Common.timeoutCallback(initBasicData,time);
                } else {
                    console.warn('获取机场配置为空');
                    Common.timeoutCallback(initBasicData,time);
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
                Common.timeoutCallback(initBasicData,1000*60);
            }
        });

    };

    /**
     * 更新各模块范围列表项
     *
     * */
    var setScopeList = function () {
        // var scopeListData = basicData.airportConfig;
        if($.isValidObject(userProperty.id_4000)){
            // 进港计划模块
            var arrFlightsScope = scopeListData.arrFlightsScope;
            if ($.isValidObject(arrFlightsScope)) {
                arrObj.setScope(arrFlightsScope);
            }
        }
        if($.isValidObject(userProperty.id_4100)){
            // 疆内飞越模块
            var overFlightsScope = scopeListData.overFlightsScope;
            if ($.isValidObject(overFlightsScope)) {
                overObj.setScope(overFlightsScope);
            }
        }
        if($.isValidObject(userProperty.id_4200)){
            // 备降计划模块
            if ($.isValidObject(basicData.alternateAirport)) {
                var alternateFlightsScope = basicData.alternateAirport;
                alternateObj.setScope(alternateFlightsScope);
            }
        }
        if($.isValidObject(userProperty.id_4210)){
            // 备降计划历史查询模块
            if($.isValidObject(basicData.airportConfig)){
                var alternateStatus = basicData.airportConfig.alternateStatus;
                alternateHistoryObj.setScope(alternateStatus)
            }
        }
        // 更新容量模块
        alternateAirport.initCapacityTypeConpoments(scopeListData.airportType)


        // 出港计划模块
        /* var depFlightsScope = scopeListData.depFlightsScope;
         if ($.isValidObject(depFlightsScope)) {
         depObj.setScope(depFlightsScope);
         }*/


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
        // 区外
        var outside = '';
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
            }else if(type ==4){
                outside += node;
            }
        });


        //拼接军民合用子菜单
        var LEVEL2 = GridTableCollaborateDom.LEVEL2;

        LEVEL2 = LEVEL2.replace( /{airport}/g, civil );

        var COMPLEX = '<ul class="collaborate-menu collaborate-menu-complex">' + complex + '</ul>';
        var OUTSIDE = '<ul class="collaborate-menu collaborate-menu-outside">' + outside + '</ul>';

        LEVEL2 = LEVEL2.replace( /{complex}/g, COMPLEX );
        LEVEL2 = LEVEL2.replace( /{outside}/g, OUTSIDE );

        // 追加到二级菜单中的军民合用菜单项下

        // 拼接其它子菜单

        var OTHER = '<ul class="collaborate-menu collaborate-menu-other">' + other + '</ul>';

        LEVEL2 = LEVEL2.replace( /{other}/g, OTHER );

        GridTableCollaborateDom.LEVEL2 = LEVEL2;



        /**
         *  克隆二级菜单并追加到相应一级菜单项下
         * */
        // 进港计划模块 预选备降项
        // cloneCollaborateDom($('.pre-alternate',GridTableCollaborateDom.ARR_DOM), GridTableCollaborateDom.LEVEL2);
        // // 进港计划模块 确定备降项
        // cloneCollaborateDom($('.confirm-alternate',GridTableCollaborateDom.ARR_DOM), GridTableCollaborateDom.LEVEL2);
        // // 备降计划模块 更改预选
        // cloneCollaborateDom($('.update-pre-alternate',GridTableCollaborateDom.ALTERNATE_DOM), GridTableCollaborateDom.LEVEL2);
        // // 备降计划模块 更改备降
        // cloneCollaborateDom($('.update-alternate',GridTableCollaborateDom.ALTERNATE_DOM), GridTableCollaborateDom.LEVEL2);
        //
        // // 疆内飞越计划模块 预选备降项
        // cloneCollaborateDom($('.pre-alternate',GridTableCollaborateDom.OVER_DOM), GridTableCollaborateDom.LEVEL2);
        // // 疆内飞越计划模块 确定备降项
        // cloneCollaborateDom($('.confirm-alternate',GridTableCollaborateDom.OVER_DOM), GridTableCollaborateDom.LEVEL2);
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
     * 更新航班状态列数值参数
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
     * 更新机位状态列数值参数
     * */
    var setPositionStatusCode = function () {
        if($.isValidObject(basicData.airportConfig) && $.isValidObject(basicData.airportConfig.positionStatus)){
            var positionStatus = basicData.airportConfig.positionStatus;
            statusCode = {};
            positionStatus.map(function (item, index, arr) {
                var val = item.value;
                statusCode[val] = item;
            });
            app.positionStatus = statusCode;
        }
    };
    /**
     * 更新机场类型参数
     *
     * */
    var setAirportType = function () {
        if($.isValidObject(basicData.airportConfig) && $.isValidObject(basicData.airportConfig.positionStatus)){
            var type = basicData.airportConfig.airportType;
            airportType = {};
            type.map(function (item, index, arr) {
                var val = item.value;
                airportType[val] = item;
            });
            app.airportType = airportType;
        }
    }

    /**
     * 触发开启复杂天气模式勾选状态
     * */
    var triggerChangeWeatherModel = function () {
        if($.isValidObject(basicData.airportConfig) && $.isValidObject(basicData.airportConfig.functionProperty)){
            var functionProperty = basicData.airportConfig.functionProperty;
            var len = functionProperty.length;
            // 开启复杂天气模式勾选状态
            var status = null;
            for(var i=0; i < len; i++){
                // 取complexWeather 值
                if( functionProperty[i].key == 'complexWeather'){
                    status = functionProperty[i].value; // 更新
                    break;
                }
            }
            // 复选框
            var $box = $('.menu-bar input#change-weather-model');
            if(status == 'true'){
                status = true
            }else if(status == 'false'){
                status = false
            }
            // 复选框状态
            $box.prop('checked',status);
            // 更新各模块切换复杂天气模式开启/关闭
            updateModulesWeatherModel(status);
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
     * 绑定开启复杂天气模式按钮点击事件
     * */
    var initChangeWeatherModel = function () {
        // 若有权限
        if($.isValidObject(userProperty.id_4560)){
            // 绑定点击事件
            $('.menu-bar .limit-option').off('click').on('click',function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $checkbox = $('#change-weather-model');
                // 复选按钮勾选状态
                var bool = $checkbox.prop('checked');
                // 切换复杂天气模式开启/关闭
                changeWeatherModelDialog(!bool);
            })
        }

    };

    /**
     * 切换复杂天气模式提示
     * @param status 杂天气模式状态 true:开启  false:关闭
     *
     * */
    var changeWeatherModelDialog = function (status) {

        var title = status ? '开启复杂天气模式' : '关闭复杂天气模式';
        var options = {
            title : title,
            content : '<p class="modal-text">确定'+title+'?</p>',
            status: 1,// 1:正常 2:警告 3:危险 不填:默认情况
            width : 400,
            mtop: 200,
            showCancelBtn: false,
            buttons: [
                {
                    name : "确认",
                    status :1 ,
                    isHidden : false,
                    callback : function(){
                        var btn = this;
                        // 切换复杂天气模式开启/关闭
                        changeWeatherModel(status,btn);
                    }
                },{
                    name : "取消",
                    status :-1 ,
                    callback : function(){ }
                }
            ]
        };
        BootstrapDialogFactory.dialog(options);
    };

    /**
     * 切换复杂天气模式开启/关闭
     *
     * @param modelstatus 杂天气模式状态 true:开启  false:关闭
     *
     * @param btn 模态框确认按钮
     * */
    var changeWeatherModel = function (modelStatus, btn) {

        // 启用loading动画
        var loading = Ladda.create(btn);
        loading.start();
        //禁用头部关闭按钮
        $('#bootstrap-modal-dialog .close').attr('disabled',true);
        //禁用底部所有操作按钮
        $('#bootstrap-modal-dialog #bootstrap-modal-dialog-footer button').attr('disabled',true);
        // 提示信息绑定对象
        var $selector = $('.weather-model-option');
        // 向后端提交此次天气模式的切换
        var url = DataUrl.WEATHER_MODEL;
        url = url + '?isCheck='+ modelStatus;
        $.ajax({
            url:url,
            type: 'POST',
            dataType: 'json',
            success: function (data) { // 成功
                destroyDialog();
                handleChangeWeatherModel($selector,modelStatus,data);
            },
            error: function ( status, error) { // 失败
                destroyDialog();
                var content = modelStatus ? '开启复杂天气模式' : '关闭复杂天气模式';
                showTipMessage($selector,'FAIL', content+'失败');
                console.error('ajax requset  fail, error:');
            }
        });
    };

    /**
     * 切换复杂天气模式 回调方法
     *
     * @param selector 提示信息绑定对象
     * @param modelStatus 杂天气模式状态 true:开启  false:关闭
     * @param data 结果数据
     *
     * */
    var handleChangeWeatherModel = function (selector, modelStatus, data) {
        // 取得开启复杂天气模式复选框
        var $box = $('.menu-bar input#change-weather-model');
        var content = modelStatus ? '开启复杂天气模式' : '关闭复杂天气模式';

        if (!$.isValidObject(data)) { // 数据无效

            showTipMessage(selector,'FAIL', content+'失败');

        } else {
            if (data.status == 200 && $.isValidObject(data.configs)) { // 成功
                // 结果数据配置信息
                var configs = data.configs;
                var len = configs.length;
                // 结果数据开启复杂天气模式勾选状态
                var status = null;
                for(var i=0; i < len; i++){
                    // 取complexWeather 值
                    if( configs[i].key == 'complexWeather'){
                        status = configs[i].value; // 更新
                        break;
                    }
                }
                // 结果数据开启复杂天气模式勾选状态转换为布尔值
                if(status == 'true'){
                    status = true
                }else if(status == 'false'){
                    status = false
                }
                // 若指定的复杂天气模式状态与结果数据的复杂天气模式状态相同，则切换成功
                if(modelStatus === status){
                    // 更新复选框状态
                    $box.prop('checked', modelStatus);
                    showTipMessage(selector,'SUCCESS', content+'成功');
                    updateModulesWeatherModel(modelStatus);
                }else {
                    showTipMessage(selector,'FAIL', content+'失败');
                }

            } else { // 失败
                showTipMessage(selector,'FAIL', content+'失败');
            }
        }
    };

    /**
     * 注销模态框
     *
     * */
    var destroyDialog = function () {
        $('#bootstrap-modal-dialog').remove();
        $('.modal-backdrop').remove();
    }

    /**
     *
     * 显示qtip信息
     *
     * @param obj 选择器对象
     * @param type 信息类型
     * @param content 信息内容
     */

    var showTipMessage = function(obj, type, content) {

        // 确定样式设置
        var styleClasses = 'qtip-green';
        if (type == 'SUCCESS') {
            styleClasses = 'qtip-green-custom qtip-rounded';
        } else if (type == 'FAIL') {
            styleClasses = 'qtip-red-custom qtip-rounded';
        } else if (type == 'WARN') {
            styleClasses = 'qtip-default-custom qtip-rounded';
        }
        // 显示提示信息
        obj.qtip({
            // 内容
            content: {
                text: content // 显示的文本信息
            },
            // 显示配置
            show: {
                delay: 0,
                target: $('body'),
                ready: true, // 初始化完成后马上显示
                effect: function () {
                    $(this).fadeIn(); // 显示动画
                }
            },
            // 隐藏配置
            hide: {
                target: $('body'), // 指定对象
                event: 'unfocus click', // 失去焦点时隐藏
                effect: function () {
                    $(this).fadeOut(); // 隐藏动画
                }
            },
            // 显示位置配置
            position: {
                my: 'bottom center', // 同jQueryUI Position
                at: 'top center',
                viewport: true, // 显示区域
                container: $('body'), // 限制显示容器，以此容器为边界
                adjust: {
                    resize: true, // 窗口改变时，重置位置
                    method: 'shift shift',  //flipinvert/flip(页面变化时，任意位置翻转)  shift(转变) none(无)
                }
            },
            // 样式配置
            style: {
                classes: styleClasses //
            },
            // 事件配置
            events: {
                hide: function (event, api) {
                    api.destroy(true); // 销毁提示信息
                }
            }
        });
    }

    /**
     *
     * 更新各模块切换复杂天气模式
     *
     *  @param modelStatus
     * */

    var updateModulesWeatherModel = function (modelStatus) {
        // 进港计划
        if($.isValidObject(arrObj)){
            // 若表格未初始化
            if(!$.isValidObject(arrObj.table.gridTableObject)){
                // 初始化表格
                arrObj.table = arrObj.initGridTable(arrObj.table);
            }

            // 切换复杂天气模式
            arrObj.changeWeatherModel(modelStatus);
            // 更新进港计划表格右键可交互标记
            if($.isValidObject(arrObj.table)){
                arrObj.table.collaborateFlag = modelStatus;
                // 清除进港表格协调菜单
                if(!modelStatus && $.isValidVariable(arrObj.table.clearCollaborateContainer)){
                    arrObj.table.clearCollaborateContainer();
                }
            }
        }
        // 飞越计划
        if($.isValidObject(overObj)){
            // 若表格未初始化
            if(!$.isValidObject(overObj.table.gridTableObject)){
                // 初始化表格
                overObj.table = overObj.initGridTable(overObj.table);
            }
            // 切换复杂天气模式
            overObj.changeWeatherModel(modelStatus);
            // 更新飞越计划表格右键可交互标记
            if($.isValidObject(overObj.table)){
                overObj.table.collaborateFlag = modelStatus;
                // 清除飞越表格协调菜单
                if(!modelStatus && $.isValidVariable(overObj.table.clearCollaborateContainer)){
                    overObj.table.clearCollaborateContainer();
                }
            }
        }
    };

    /**
     * 转换用户权限数据
     *
     * data 数组
     *
     * */
    var convertProperty = function (data) {
        var dataset = {};
        // 检测参数有效
        if(!$.isValidObject(data)){
            return dataset;
        }
        data.map(function (item, index, arr) {
            var code = 'id_'+item.code+'';
            var obj = $.extend(true,{},item);
            dataset[code] = obj;
        })
        return dataset;
    };


    var initModuleLayout = function () {
        // 顶部导航栏
        var myTemplate = Handlebars.compile($("#menu-template").html());
        $('.menu-list').html(myTemplate(userProperty));

        // 模块内容部分
        var template = Handlebars.compile($("#section-template").html());
        $('.main-area').html(template(userProperty));

        // 模块内容部分
        var temp = Handlebars.compile($("#option-template").html());
        $('.option').html(temp(userProperty));


    };

    /**
     * 初始化用户信息
     * */
    var initUserInfo = function () {
        // 显示用户名
        var userName =  userProperty.userNameCn || userProperty.userName || '';
        $('.user-name').text(userName);
    }

    var initComponents = function (time) {
        if($.isValidObject(userProperty) && $.isValidObject(basicData)
            && $.isValidObject(scopeListData) && $.isValidObject(subCollaborateDomData)){
            // 更新各模块范围列表项
            setScopeList();
            // 拼接各模块协调窗口列表项
            concatCollaborateDom();
            // 更新状态列数值参数
            setStatusCode();
            // 更新机位状态列数值参数
            setPositionStatusCode();
            // 更新机场类型参数
            setAirportType();

            // 获取活动模块下标
            index = $('.main-area section.active').index();
            // 切换活动模块
            activeModuleToggle(index);
            // 触发开启复杂天气模式勾选状态
            triggerChangeWeatherModel();
        }else {
            Common.timeoutCallback(initComponents,time)
        }
    }



    return {
        statusCode : statusCode,// 航班状态码
        positionStatus : positionStatus, // 机位状态码
        airportType : airportType, // 机场类型
        collaborateFlag : collaborateFlag,
        airportConfig : scopeListData,
        init : function () {
            // 阻止右键点击默认事件
            preventContextmenu();
            // 获取用户权限
            initUserAuthority(1000*2);
            // 初始化所需各项基本参数
            initBasicData(1000*2);
            // 初始化组件
            initComponents(1000*1);
        }
    }
}();

$(document).ready(function () {
    app.init();
})

