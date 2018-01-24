
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
     * 布尔－是否开启过滤条件 默认为false
     *
     * */
    this.filter = false;
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

    // 切换过滤条件开关
    thisProxy.changeFilter();

    //初始化查询按钮loading
    thisProxy.initLoading();

    //初始化数据查询
    thisProxy.initInquireData();

    // 绑定窗口调整时
    $(window).resize(function () {
     // 使窗口调整时表格容器大小自适应
     thisProxy.resizeTableContainer();
     });

};

/**
 * 计算表格容器大小,使其大小自适应
 *
 * **/
HistoryFormModule.prototype.resizeTableContainer = function () {
    // 当前对象this代理
    var thisProxy = this;

    // 模块内的表单栏
    var $form = $('.form-panel', thisProxy.canvas);
    // 模块内的当前查询条件栏
    var $condition = $('.condition-panel', thisProxy.canvas);
    // 模块内数据结果可视化区
    var $result = $('.result-panel', thisProxy.canvas);
    // 求得模块内数据结果可视化区高度:(模块高度-模块内的表单栏-模块内的当前查询条件栏)
    var h =thisProxy.canvas.outerHeight() - $form.outerHeight() - $condition.outerHeight();

    var w = thisProxy.canvas.outerWidth();

    // 设置模块内数据结果可视化区高度
    $result.height(h).width(w);
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
HistoryFormModule.prototype.formaterGenerateTimeTime = function (time) {
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
 * 初始化数据查询
 * */

HistoryFormModule.prototype.initInquireData = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 查询按钮绑定事件
    $('.inquire', thisProxy.canvas).on('click',function () {
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
            // 更新当前查询条件
            thisProxy.updateCondition();
            // 计算表格容器大小,使其大小自适应
            // (因为更新显示了模块内当前查询条件栏内容，所以重新计算表格容器的高度)
            thisProxy.resizeTableContainer();
            // 查询数据
            thisProxy.inquireData();
        }else {
            // 启用表单事件
            thisProxy.desabledForm(false);
            // 关闭loading动画
            thisProxy.loading.stop();
        }
    });


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
    // 若范围无效则提示
    if(!s){
        // 展示提示
        thisProxy.showMsg('danger','开始日期无效');
        return false;
    }else if($.trim(thisProxy.end) != '' && !regexp.test(thisProxy.end)) {
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
                thisProxy.showMsg('danger','请求接口错误');
            };
            // 成功
            if (data.status == 200) {
                /****todo***/
                // 取得数据生成时间
                thisProxy.generateTime = data.generateTime;
                // 更新数据生成时间并显示
                thisProxy.updateTime();
                // 初始化表格
                thisProxy.initTable(data);
            } else if (data.status == 400) {
                // 展示提示
                thisProxy.showMsg('danger','data.error');
            } else if (data.status == 500) {
                // 展示提示
                thisProxy.showMsg('danger','data.error');
            };
        },
        error: function ( status, error) {
            // 启用表单事件
            thisProxy.desabledForm(false);
            // 停止按钮loading动画
            thisProxy.loading.stop();
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
 * 清空
 *
 * */
HistoryFormModule.prototype.clear = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 当前查询条件栏
    var $condition = $('.condition-panel', thisProxy.canvas);
    // 数据生成时间
    var $time = $('.time', $condition);
    // 数据生成时间提示
    var $tip = $('.time-tip', $condition);
    // 起止日期
    var $Date = $('.date-scope', $condition);
    // 提示信息
    var $err = $('.alert',thisProxy.canvas);
    // 清空数据生成时间
    $time.html('').removeAttr('title').addClass('hidden');
    $tip.addClass('hidden');
    $Date.addClass('hidden');
    // 隐藏当前查询条件栏
    $condition.addClass('hidden');
    // 清空提示
    $err.html('').removeClass('active');

    // 若表格已经存在，则清空表格头及表格数据
    if ($.isValidObject(thisProxy.table)) {
        $.jgrid.gridUnload(thisProxy.tableId);
    }
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
 * 初始化表格
 * */
HistoryFormModule.prototype.initTable = function (data) {
    // 当前对象this代理
    var thisProxy = this;
    // 校验自定义的initGridTable方法是否有效
    if($.isValidVariable(thisProxy.initGridTable) && typeof thisProxy.initGridTable == 'function'){
        // 调用initGridTable方法
        thisProxy.initGridTable(data,thisProxy.table);
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
        var $node = $('.condition-panel .time', thisProxy.canvas);
        var $tip = $('.condition-panel .time-tip', thisProxy.canvas);
        // 格式化处理时间
        var time = thisProxy.formaterGenerateTimeTime(thisProxy.generateTime);
        // 显示数据生成时间
        $node.text(time).attr('title','数据生成时间: '+time).removeClass('hidden');
        var $tip = $('.condition-panel .time-tip', thisProxy.canvas).removeClass('hidden');
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
        endDate: '-1d', //可选日期最后日期
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
    var preDay =$.addStringTime(now + '0000', 3600 * 1000 * 24 * -1);
    // 设置默认选中日期
    $start.datepicker('setDate', $.parseFullTime(preDay));
    $end.datepicker('setDate', $.parseFullTime(preDay));
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





