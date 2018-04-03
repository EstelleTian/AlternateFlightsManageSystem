
/**
 * 2018/01/24
 * author: zxy
 * 历史数据查询模块表单组件
 */


var HistoryFormModule = function (params) {
    // 检查参数有效性
    if (!$.isValidObject(params)) {
        return;
    }

    /**
     * 模块ID
     */
    this.canvasId = params.canvasId;

    /**
     * 模块jQuery对象
     */
    this.canvas = {};


    /**
     * 模块内部表格元素ID
     */
    this.tableId = params.tableId;

    /**
     * 模块内部表格元素jQuery对象
     */
    this.table = {};

    /**
     * 数据查询请求地址
     * */
    this.url = params.url;

    /*
     * 初始化表格
     * */
    this.initGridTable = params.initGridTable;

    /**
     *  起始日期
     * */
    this.start = '';

    /**
     *  终止日期
     * */
    this.end = '';

    /**
     *  范围标识码
     * */
    this.scope = '';


    /**
     *  关键字
     * */
    this.keyword = '';

    /**
     * 布尔－是否开启过滤条件 默认为false
     *
     * */
    this.filter = false;

    /**
     * 定时器总开关 默认开启 true
     * */

    this.timerValve = true;

    /**
     *  定时器
     * */
    this.timer = null;

    /**
     *  定时器时间
     * */

    this.interval = params.interval;

    /**
     *  自定义定时器时间
     * */
    this.customeInterval = params.customeInterval;


    /**
     *  是否启用自定义定时器时间
     *  默认不开启
     * */
    this.enableCustomeIntervalFlag = false;

    /**
     * ajax请求
     * */
    this.xhr = null;

    /**
     * 默认选中的范围值
     * */
    this.defaultScope  = params.defaultScope

};

/**
 * 初始化表单组件
 *
 * */
HistoryFormModule.prototype.initHistoryFormModuleObject = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 容器jQuery对象
    thisProxy.canvas = $('.' + thisProxy.canvasId);
    // 表格jQuery对象
    thisProxy.table = $('#' + thisProxy.tableId);
    // 初始化日期插件并绑定日期变更时更新start、end的值
    thisProxy.initDatePicker();

    // 绑定输入框数值变更监听
    thisProxy.changeDate();

    // 绑定范围选择切换
    // thisProxy.changeScope();

    // 绑定关键字录入
    // thisProxy.changeKeyword();

    //  切换复杂天气模式
    // thisProxy.changeWeatherModel();

    // 切换过滤条件开关
    thisProxy.changeFilter();

    //初始化查询按钮loading
    thisProxy.initLoading();


    //绑定查询按钮事件
    thisProxy.bindEventOnButton();
    // 调用initGridTable方法,初始化表格
    // thisProxy.table = thisProxy.initGridTable(thisProxy.table);
};

/**
 *  绑定范围选择切换
 * */
HistoryFormModule.prototype.changeScope = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 范围列表容器
    var $menu = $('.form-panel .dropdown-menu', thisProxy.canvas);
    // 取得范围按钮
    var $btn =  $('.form-panel .dropdown-toggle', thisProxy.canvas);
    // 范围列表容器绑定点击事件(因为范围列表动态追加的，所有要用事件委托，把事件绑定在范围列表容器上)
    $menu.on('click','a.scope-item',function (e) {
        // 取得当前点击目标源
        var $that = $(this);
        // 取当前点击选中的范围列表项的自定义属性data-val的值,用于记录范围标识码
        var val = $that.attr('data-val');
        // 取得当前点击选中的范围列表项的节点内容,用于更新到范围按钮
        var valCN = $that.html();
        // 更新范围按钮内容
        $btn.html( valCN +'<span class="caret"></span>');
        // 更新范围标识码
        thisProxy.scope = val;
        thisProxy.abortRequest(true);
        thisProxy.openRequest(true);
    })
};

/**
 * 绑定关键字录入
 *
 * */
HistoryFormModule.prototype.changeKeyword = function () {
    // 当前对象this代理
    var thisProxy = this;
    var $input = $('.form-panel .key', thisProxy.canvas);

    $input.on('keyup', function (event) {
        // 当前输入框值
        var val = $(this).val();
        // 转换为大写
        var upperCaseVal = val.toUpperCase();
        // 设置值为大写值
        $(this).val(upperCaseVal);
        // 保存到关键字标识
        thisProxy.keyword = upperCaseVal;
        // 回车键
        if(event.keyCode == 13){
            // 保存到关键字标识
            thisProxy.keyword = upperCaseVal;
            thisProxy.abortRequest(true);
            thisProxy.openRequest(true);
        }

    });
};

/**
 * 切换复杂天气模式
 * */
HistoryFormModule.prototype.changeWeatherModel = function (bool) {
    // 当前对象this代理
    var thisProxy = this;

    // 若勾选
    if(bool){
        // 启用自定义定时器时间
        thisProxy.enableCustomeIntervalFlag = true;
    }else {
        // 关闭自定义定时器时间
        thisProxy.enableCustomeIntervalFlag = false;
    }
    thisProxy.abortRequest(true);
    // 若当前模块为活动模块
    var active = thisProxy.canvas.hasClass('active');
    if(active){
        thisProxy.openRequest(false);
    }
};

/**
 * 设置默认选中的范围选项:范围列表项自定义居属性值为1的项为默认选中项
 * */
HistoryFormModule.prototype.setDefaultScope = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 取得范围列表项自定义居属性值为1的项
    var $default = $('.form-panel .dropdown-menu a[data-val="1"]', thisProxy.canvas);
    // 取得范围按钮
    var $btn = $('.form-panel .dropdown-toggle', thisProxy.canvas);
    // 取得默认选项的自定义属性data-val的值,用于记录范围标识码
    var val = $default.attr('data-val');
    // 取得默认选项的节点内容,用于更新到范围按钮
    var valCN = $default.html();
    // 更新范围按钮内容
    $btn.html( valCN +'<span class="caret"></span>');
    // 更新范围标识码
    thisProxy.scope = val;
};


/**
 * 格式化数据生成时间
 * */
HistoryFormModule.prototype.formaterGenerateTime = function (time) {
    var year = time.substring(0, 4);
    var mon = time.substring(4, 6);
    var date = time.substring(6, 8);
    var hour = time.substring(8, 10);
    var min = time.substring(10, 12);
    var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
    return str;
};


/**
 * 切换过滤条件开关
 * */
HistoryFormModule.prototype.changeFilter = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 取得过滤html节点
    var $valve = $('.limit-option', thisProxy.canvas);
    // 若节点有效，则绑定点击事件切换过滤开关
    if($.isValidVariable($valve) && $valve.length > 0){
        // 取得checkbox
        var $box = $('input.magic-checkbox', $valve);
        // checkbox绑定点击事件
        $box.on('click',function () {
            // 取得checkbox勾选状态
            var bool = $box.prop('checked');
            // 更新到filter属性，用于查询数据时使用
            thisProxy.filter = bool;
        })
    }

};

/**
 *  绑定查询按钮事件
 *
 * */
HistoryFormModule.prototype.bindEventOnButton = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 查询按钮绑定事件
    $('.inquire', thisProxy.canvas).on('click',function () {
        thisProxy.initInquireData(true);
    });
};

/**
 * 初始化数据查询
 * refresh 是否开启定时
 *
 * */

HistoryFormModule.prototype.initInquireData = function (refresh) {
    // 当前对象this代理
    var thisProxy = this;
    // 禁用表单事件
    thisProxy.desabledForm(true);
    // 启用loading动画
    thisProxy.loading.start();
    // 清除提示、警告、查询条件、数据生成时间等
    thisProxy.clear();

    // 校验表单是否有效
    var valid = thisProxy.validateForm();
    // 若校验通过则查询数据
    if(valid){
        // 查询数据
        thisProxy.inquireData();
    }else {
        // 启用表单事件
        thisProxy.desabledForm(false);
        // 关闭loading动画
        thisProxy.loading.stop();
    }

    //定时刷新
    if (refresh) {
        // 若开启自定义定时刷新时间
        if(thisProxy.enableCustomeIntervalFlag && $.isValidVariable(thisProxy.customeInterval)){
            thisProxy.startTimer(thisProxy.initInquireData, true, thisProxy.customeInterval);
        }else {

            thisProxy.startTimer(thisProxy.initInquireData, true, thisProxy.interval);
        }
    }


};

/**
 * 初始化loading动画
 *
 * */
HistoryFormModule.prototype.initLoading = function () {
    // 当前对象this代理
    var thisProxy = this;
    thisProxy.loading = Ladda.create($('.inquire', thisProxy.canvas)[0]);
};

/**
 * 校验表单是否有效
 *
 * */
HistoryFormModule.prototype.validateForm = function () {
    // 当前对象this代理
    var thisProxy = this;
    var regexp = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
    //起始日期
    var s = regexp.test(thisProxy.start);
    // 若时间范围无效则提示
    if(!s){
        // 清空相关数据信息
        thisProxy.clear();
        // 展示提示
        thisProxy.showMsg('danger','开始日期无效');
        return false;
    }else if($.trim(thisProxy.end) != '' && !regexp.test(thisProxy.end)) {
        // 清空相关数据信息
        thisProxy.clear();
        // 展示提示
        thisProxy.showMsg('danger','结束日期无效');
        return false;
    }
    return true;

};

/**
 * 查询数据
 *
 * */
HistoryFormModule.prototype.inquireData = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 校验请求地址是否有效
    if(!$.isValidVariable(thisProxy.url)){
        // 清空相关数据信息
        thisProxy.clear();
        thisProxy.showMsg('danger','请求地址无效');
        // 启用表单事件
        thisProxy.desabledForm(false);
        //停止按钮loading动画
        thisProxy.loading.stop();
        return;
    }
    // 拼接参数,拼接完整的请求地址
    var url = thisProxy.url + '?start='+ thisProxy.start +'&end='+ thisProxy.end;
    // 请求获取数据
    $.ajax({
        url:url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // 启用表单事件
            thisProxy.desabledForm(false);
            //停止按钮loading动画
            thisProxy.loading.stop();

            // 数据无效
            if (!data) {
                // 清空相关数据信息
                thisProxy.clear();
                thisProxy.showMsg('danger','请求接口错误');
            };
            // 成功
            if (data.status == 200) {
                /****todo***/
                // 取得数据生成时间
                thisProxy.generateTime = data.generateTime;
                // 更新数据生成时间并显示
                thisProxy.updateTime();
                // 显示表格容器
                thisProxy.isHiddenTableContainer(false);
                // 清除提示信息
                thisProxy.clearMsg();
                if(!$.isValidObject(thisProxy.table.gridTableObject)){
                    // 校验自定义的initGridTable方法是否有效
                    if($.isValidVariable(thisProxy.initGridTable) && typeof thisProxy.initGridTable == 'function'){
                        // 调用initGridTable方法,初始化表格
                        thisProxy.table = thisProxy.initGridTable(thisProxy.table);
                        thisProxy.table.fireTableDataChange(data);
                    }
                }else {
                    // 更新表格数据
                    thisProxy.table.fireTableDataChange(data);
                }

            } else if (data.status == 400) {
                // 清空相关数据信息
                thisProxy.clear();
                // 展示提示
                thisProxy.showMsg('danger','data.error');
            } else if (data.status == 500) {
                // 清空相关数据信息
                thisProxy.clear();
                // 展示提示
                thisProxy.showMsg('danger','data.error');
            };
        },
        error: function ( status, error) {
            // 启用表单事件
            thisProxy.desabledForm(false);
            // 停止按钮loading动画
            thisProxy.loading.stop();
            // 清空相关数据信息
            thisProxy.clear();
            // 展示提示
            thisProxy.showMsg('danger','请求接口错误');
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });

};


/**
 * 展示提示信息
 *@param type 类型 （成功、警告、错误）
 *
 * */
HistoryFormModule.prototype.showMsg = function (type, content, clearTime) {
    // 当前对象this代理
    var thisProxy = this;
    var $err = $('.alert',thisProxy.canvas);
    var cont = '';
    switch (type){
        case 'success' : {
            cont = '成功: ' + content;
            $err.addClass('alert-success');
            break
        }
        case 'warning' : {
            cont = '警告: ' + content;
            $err.addClass('alert-warning');
            break
        }
        case 'danger' : {
            cont = '错误: ' + content;
            $err.addClass('alert-danger');
            break
        }
    }
    $err.html(cont).addClass('active');
    if(clearTime*1){
        setTimeout(function () {
            $err.html('').removeClass('active')
        }, clearTime)
    }

};

/**
 * 清除提示信息
 *
 * */
HistoryFormModule.prototype.clearMsg = function () {
    // 当前对象this代理
    var thisProxy = this;
    var $err = $('.alert',thisProxy.canvas);
    $err.html('').removeClass('active')
};

/**
 * 清空
 *
 * */
HistoryFormModule.prototype.clear = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 当前查询条件栏
    var $condition = $('.condition-panel', thisProxy.canvas);
    // 数据生成时间
    var $time = $('.form-panel .time', thisProxy.canvas);
    // 起止日期
    var $Date = $('.date-scope', $condition);
    // 提示信息
    var $err = $('.alert',thisProxy.canvas);
    // 清空数据生成时间
    $time.html('').removeAttr('title');
    $Date.addClass('hidden');
    // 隐藏当前查询条件栏
    $condition.addClass('hidden');
    // 清空提示
    $err.html('').removeClass('active');

    // 隐藏表格容器
    thisProxy.isHiddenTableContainer(true);
};

/**
 * 禁用或启用表单事件
 *
 * */
HistoryFormModule.prototype.desabledForm = function (bool) {
    // 当前对象this代理
    var thisProxy = this;
    // 取得表单容器
    var $form = $('.form-panel',thisProxy.canvas);
    // 真则禁用，假则启用
    if(bool == true){
        $form.addClass('no-event');
    }else if(bool == false){
        $form.removeClass('no-event');
    }
};

/**
 * 更新数据生成时间并显示
 * */
HistoryFormModule.prototype.updateTime = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 校验时间是否有效
    if($.isValidVariable(thisProxy.generateTime)){
        // 取得数据生成时间节点
        var $node = $('.panel-heading .time', thisProxy.canvas);
        // 格式化处理时间
        var time = thisProxy.formaterGenerateTime(thisProxy.generateTime);
        // 显示数据生成时间
        $node.text('数据生成时间: ' + time).attr('title','数据生成时间: '+time);
    }

};

/**
 * 更新当前查询条件
 * */
HistoryFormModule.prototype.updateCondition = function () {
    // 当前对象this代理
    var thisProxy = this;
    var scopeText = thisProxy.start + ' - ' + thisProxy.end;
    $('.condition-panel .date-scope', thisProxy.canvas).html(scopeText).attr('title','起止日期:'+ scopeText).removeClass('hidden');
    $('.condition-panel',thisProxy.canvas).removeClass('hidden');
};
/**
 * 绑定日历插件
 * */
HistoryFormModule.prototype.initDatePicker = function () {
    // 当前对象this代理
    var thisProxy = this;

    var $start = $('.form-item .start-date', thisProxy.canvas);
    var $end = $('.form-item .end-date', thisProxy.canvas);
    // 开始日期
    $start.datepicker({
        language: 'zh-CN',
        // showOnFocus: false, //是否在获取焦点时显示面板 true显示 false不显示 默认true
        autoclose: true, //选择日期后自动关闭面板
        // clearBtn: true, //是否显示清空按钮
        //todayHighlight: true,
        // startDate: '0d', //可选日期的开始日期 0d:当前 -1d:当前的前1天, +1d:当前的后1天
        endDate: '-1d', //可选日期最后日期
        keepEmptyValues: true,
        // forceParse: true,
        //格式化
        format: 'yyyymmdd',
    }).on('changeDate', function () {
        thisProxy.start = $start.val();
    });
    // 结束日期
    $end.datepicker({
        language: 'zh-CN',
        // showOnFocus: false, //是否在获取焦点时显示面板 true显示 false不显示 默认true
        autoclose: true, //选择日期后自动关闭面板
        clearBtn: true, //是否显示清空按钮
        //todayHighlight: true,
        // startDate: '0d', //可选日期的开始日期 0d:当前 -1d:当前的前1天, +1d:当前的后1天
        endDate: '0d', //可选日期最后日期
        keepEmptyValues: true,
        // forceParse: true,
        //格式化
        format: 'yyyymmdd',
    }).on('changeDate', function () {
        thisProxy.end = $end.val();
    });
    // 当前日期
    var now = $.getFullTime(new Date()).substring(0, 8);
    // 当前日期的前一天日期值
    // var preDay =$.addStringTime(now + '0000', 3600 * 1000 * 24 * -1);
    // 当前日期的前3天日期值
    var day3 =$.addStringTime(now + '0000', 3600 * 1000 * 24 * -3);
    // 设置默认选中日期
    $start.datepicker('setDate', $.parseFullTime(day3));
    $end.datepicker('setDate', $.parseFullTime(now +'0000'));
    // 保存默认日期
    thisProxy.start = $start.val();
    thisProxy.end = $end.val();

};


/**
 * 绑定日期输入框数值变更监听: 失去焦点时获取输入框数值并更新保存到相应字段
 * */
HistoryFormModule.prototype.changeDate = function () {
    // 当前对象this代理
    var thisProxy = this;

    var $start = $('.form-item .start-date', thisProxy.canvas);
    var $end = $('.form-item .end-date', thisProxy.canvas);
    $start.on('blur', function () {
        thisProxy.start = $start.val();
    });
    // 结束日期
    $end.on('blur', function () {
        thisProxy.end = $end.val();
    });
};

/**
 * 是否隐藏表格容器
 * @param bool 布尔值  true隐藏 false 不隐藏，即显示
 *
 * */

HistoryFormModule.prototype.isHiddenTableContainer = function (bool) {
    // 当前对象this代理
    var thisProxy = this;
    var $tableContainer = $('.result-panel', thisProxy.canvas);
    if(bool){
        $tableContainer.addClass('hidden');
    }else {
        $tableContainer.removeClass('hidden');
    }
}


/**
 *
 *
 * */

/**
 * 设置模块是否为活动模块
 *
 * @param bool
 * */
HistoryFormModule.prototype.setActive = function (bool) {
    // 当前对象this代理
    var thisProxy = this;
    if(bool){
        // 开启请求
        thisProxy.openRequest(true);
    }else {
        // 关闭请求
        thisProxy.abortRequest();
    }
};

/**
 * 开启请求
 *  now  是否立即查询数据
 *  true 立即查询数据查询数据并开启定时刷新
 *  false 不立即查询数据查询数据,仅开启定时刷新
 * */
HistoryFormModule.prototype.openRequest = function (now) {
    // 当前对象this代理
    var thisProxy = this;
    // 开启表格数据刷新开关
    if($.isValidVariable(thisProxy.table.fireDataFlag)){
        thisProxy.table.fireDataFlag = true;
    }
    // 开启定时总开关
    thisProxy.timerValve = true;

    // 查询数据并开启定时刷新
    if(now){
        thisProxy.initInquireData(true);
    }else {
        var time = '';
        // 若开启自定义定时刷新时间
        if(thisProxy.enableCustomeIntervalFlag && $.isValidVariable(thisProxy.customeInterval)){
            time = thisProxy.customeInterval;
        }else {
            time = thisProxy.interval;
        }
        setTimeout(function () {
            thisProxy.initInquireData(true);
        }, time)
    }

};

/**
 * 关闭请求
 *
 * clearCollaborate  是否清除表格协调窗口
 * */
HistoryFormModule.prototype.abortRequest = function (clearCollaborate) {
    // 当前对象this代理
    var thisProxy = this;

    if($.isValidVariable(thisProxy.table.fireDataFlag)){
        // 关闭该模块下表格的数据刷新开关
        thisProxy.table.fireDataFlag = false;
    }
    if($.isValidVariable(thisProxy.table.clearCollaborateContainer) && clearCollaborate){
        // 清除协调窗口
        thisProxy.table.clearCollaborateContainer();
    }
    if($.isValidVariable(thisProxy.xhr)){
        // 取消掉已经发出的ajax请求
        thisProxy.xhr.abort();
    }
    // 清除定时器
    clearTimeout(thisProxy.timer);
    // 关闭定时器总开关
    thisProxy.timerValve = false;
};

/**
 * 定时器
 * @param fn 执行函数
 * @param instance 对象实例
 * @isNext 是否继续定时执行
 * @param time 时间间隔
 * */


HistoryFormModule.prototype.startTimer = function (fn, isNext, time) {
    // 当前对象this代理
    var thisProxy = this;
    // 清除定时器
    clearTimeout(thisProxy.timer);
    if (thisProxy.timerValve) { // 定时器开关
        if (typeof fn == 'function') {
            thisProxy.timer =  setTimeout(function () {
                fn.call(thisProxy,isNext);
            }, time)
        }
    }
};




