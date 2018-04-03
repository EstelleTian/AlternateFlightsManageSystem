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
    var interval = 1000*60*3;
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
                customeInterval: 1000 * 60 * 1,
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
                        }) .navButtonAdd('#' + pagerId, {
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
                initGridTable: function (table) {
                    var pagerId = 'alternate-history-table-pager';
                    var opt = {
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
                                    end : alternateHistoryObj.end
                                }
                                table.exportAlternateHistoryToExcel( 'history', params);
                            },
                            position: "first"
                        }) .navButtonAdd('#' + pagerId, {
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
            var positionObj = positionConfig.init();
            moduleObjs.push(positionObj);
        }


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
            $('.main-area section').eq(index).addClass('active');
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
        userId = sessionStorage.getItem('userId'); // 本地测试专用
        var url = ipHost + 'airport/retrieveUserAuthority?userId=' + userId; // 本地测试专用
        // var url = ipHost + 'airport/retrieveUserAuthority';
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
                        initChangeWeatherModel();
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
                Common.timeoutCallback(initUserAuthority,time);
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
        var url = ipHost + 'airport/retrieveAirportConfig'
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
                Common.timeoutCallback(initBasicData,time);
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
        var LEVEL2 = GridTableCollaborateDom.LEVEL2;

        LEVEL2 = LEVEL2.replace( /{airport}/g, civil );

        var COMPLEX = '<ul class="collaborate-menu collaborate-menu-complex">' + complex + '</ul>';

        LEVEL2 = LEVEL2.replace( /{complex}/g, COMPLEX );

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
            $('.menu-bar .limit-option').off('click').on('click','#change-weather-model',function () {
                // 复选按钮勾选状态
                var bool = $(this).prop('checked');
                // 切换复杂天气模式开启/关闭
                changeWeatherModel(bool);
            })
        }

    };
    /**
     * 切换复杂天气模式开启/关闭
     * */
    var changeWeatherModel = function (bool) {
        // bool true 开启  false 取消天启
        // 清除提示信息
        $('.option .alert').removeClass('alert-danger active').html('');
        // 向后端提交此次天气模式的切换
        var url = DataUrl.WEATHER_MODEL;
        url = url + '?isCheck='+ bool;
        $.ajax({
            url:url,
            type: 'POST',
            dataType: 'json',
            success: function (data) {

                if (!$.isValidObject(data)) { // 数据无效
                    changeWeatherModelFail(bool);
                }else {
                    if(data.status == 200){ // 成功
                        changeWeatherModelSuccess(bool);

                    }else { // 失败
                        changeWeatherModelFail(bool);

                    }
                }
            },
            error: function ( status, error) { // 失败
                changeWeatherModelFail(bool);
                console.error('ajax requset  fail, error:');
                console.error(error);
            }
        });
    };

    /**
     * 提交成功
     * */
    var changeWeatherModelSuccess = function (bool) {
        // 进港计划
        if($.isValidObject(arrObj)){
            // 若表格未初始化
            if(!$.isValidObject(arrObj.table.gridTableObject)){
                // 初始化表格
                arrObj.table = arrObj.initGridTable(arrObj.table);
            }

            // 切换复杂天气模式
            arrObj.changeWeatherModel(bool);
            // 更新进港计划表格右键可交互标记
            if($.isValidObject(arrObj.table)){
                arrObj.table.collaborateFlag = bool;
                // 清除进港表格协调菜单
                if(!bool && $.isValidVariable(arrObj.table.clearCollaborateContainer)){
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
            overObj.changeWeatherModel(bool);
            // 更新飞越计划表格右键可交互标记
            if($.isValidObject(overObj.table)){
                overObj.table.collaborateFlag = bool;
                // 清除飞越表格协调菜单
                if(!bool && $.isValidVariable(overObj.table.clearCollaborateContainer)){
                    overObj.table.clearCollaborateContainer();
                }
            }
        }
    }
    /**
     * 提交失败
     *
     * */
    var changeWeatherModelFail = function (bool) {
        var txt = bool ? '开启复杂天气模式失败' :'取消开启复杂天气模式失败';
        // 取得checkbox
        var $box = $('.menu-bar input#change-weather-model');
        // 反选复选框状态
        $box.prop('checked',!bool);
        // 显示提示内容
        $('.option .alert').html(txt).addClass('active alert-danger');
    }


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
            // 获取活动模块下标
            index = $('.main-area section.active').index();
            // 切换活动模块
            activeModuleToggle(index);
        }else {
            Common.timeoutCallback(initComponents,time)
        }
    }



    return {
        statusCode : statusCode,// 航班状态码
        positionStatus : positionStatus, // 机位状态码
        collaborateFlag : collaborateFlag,
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

