/**
 * 2018/01/23
 * author: zxy
 * 数据查询模块表单组件
 */


var FormModule = function (params) {
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
FormModule.prototype.initFormModuleObject = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 容器jQuery对象
    thisProxy.canvas = $('.' + thisProxy.canvasId);
    // 表格jQuery对象
    thisProxy.table = $('#' + thisProxy.tableId);

    // 表格容器大小自适应
    thisProxy.resizeTableContainer();

    // 绑定范围选择切换
    thisProxy.changeScope();

    // 绑定关键字录入
    thisProxy.changeKeyword();

    //  切换复杂天气模式
    thisProxy.changeWeatherModel();

    // 切换过滤条件(任务类型为X)
    thisProxy.changeFilter();

    //初始化查询按钮loading
    thisProxy.initLoading();

    //绑定查询按钮事件
    thisProxy.bindEventOnButton();

    // 绑定窗口调整时
    // $(window).resize(function () {
    //     // 使窗口调整时表格容器大小自适应
    //     thisProxy.resizeTableContainer();
    // });

};

/**
 * 计算表格容器大小,使其大小自适应
 *
 * **/
FormModule.prototype.resizeTableContainer = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 容器
    var $container = $('.app-transition');
    // 导航栏
    var $nav = $('.navbar',$container);
    // 菜单栏
    var $menu = $('.menu-bar', $container);
    // 主显示区
    var $main = $('.main-area');
    // 模块头部
    var $head = $('.panel-heading',thisProxy.canvas);
    // 模块体
    var $body = $('.panel-body', thisProxy.canvas);
    // 模块内的表单栏
    var $form = $('.form-panel', thisProxy.canvas);
    // 模块内的当前查询条件栏
    var $condition = $('.condition-panel', thisProxy.canvas);
    // 模块内数据结果可视化区
    var $result = $('.result-panel', thisProxy.canvas);
    // 求得主显示区高度:(总高度-导航栏-菜单栏-主显示区外边距)
    var mainHeight = $container.outerHeight() - $nav.outerHeight(true) -$menu.outerHeight(true) - $main.css('marginTop').replace('px', '')*1- $main.css('marginBottom').replace('px', '')*1;
    // 求得模块体高度:(主显示区高度-模块体内边距)
    var bodyHeight = mainHeight - $body.css('paddingTop').replace('px', '')*1 - $body.css('paddingBottom').replace('px', '')*1;
    // 求得模块内数据结果可视化区高度:(模块体高度-模块头-模块内的表单栏-模块内的当前查询条件栏)
    var h =bodyHeight - $head.outerHeight() - $form.outerHeight() - $condition .outerHeight();
    // 设置模块内数据结果可视化区高度
    // $result.height(h);
};

/**
 * 设置默认选中的范围选项:范围列表项自定义属性值为1的项为默认选中项,备降模块取自定义属性值为ALL的为默认选中项
 * */
FormModule.prototype.setDefaultScope = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 取得默认选中的范围选项值
    var defaultVal = thisProxy.defaultScope;
    // 取得默认选中范围选项
    var $default = $('.form-panel .dropdown-menu a[data-val="'+ defaultVal +'"]', thisProxy.canvas);

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
 *  绑定范围选择切换
 * */
FormModule.prototype.changeScope = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 范围列表容器
    var $menu = $('.form-panel .dropdown-menu', thisProxy.canvas);
    // 取得范围按钮
    var $btn =  $('.form-panel .dropdown-toggle', thisProxy.canvas);
    // 范围列表容器绑定点击事件(因为范围列表动态追加的，所有要用事件委托，把事件绑定在范围列表容器上)
    $menu.on('click',function (e) {
        // 取得当前点击目标源
        var $that = $(e.target);
        // 取得源 className
        var thatClassName = $.trim($that.attr('class'));
        // 若className 不等于'scope-item',则目标源不是范围列表,直接跳出，
        // 反之，取得相关属性数据并更新到范围按钮和范围标识码上
        if(!thatClassName =='scope-item'){
            return;
        }
        // 取当前点击选中的范围列表项的自定义属性data-val的值,用于记录范围标识码
        var val = $that.attr('data-val');
        // 取得当前点击选中的范围列表项的节点内容,用于更新到范围按钮
        var valCN = $that.html();
        // 更新范围按钮内容
        $btn.html( valCN +'<span class="caret"></span>');
        // 更新范围标识码
        thisProxy.scope = val;
    })
};

/**
 * 绑定关键字录入
 *
 * */
FormModule.prototype.changeKeyword = function () {
    // 当前对象this代理
    var thisProxy = this;
    var $input = $('.form-panel .key', thisProxy.canvas);

    $input.on('keyup', function () {
        // 当前输入框值
        var val = $(this).val();
        // 转换为大写
        var upperCaseVal = val.toUpperCase();
        // 设置值为大写值
        $(this).val(upperCaseVal);
        // $(this).change();
        // 保存到关键字标识
        thisProxy.keyword = upperCaseVal;
    });
};


/**
 * 格式化数据生成时间
 * */
FormModule.prototype.formaterGenerateTime = function (time) {
    var year = time.substring(0, 4);
    var mon = time.substring(4, 6);
    var date = time.substring(6, 8);
    var hour = time.substring(8, 10);
    var min = time.substring(10, 12);
    var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
    return str;
};


/**
 * 切换复杂天气模式
 * */
FormModule.prototype.changeWeatherModel = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 取得checkbox
    var $box = $('input#change-weather-model', thisProxy.canvas);

    if($.isValidVariable($box) && $box.length < 1){
        return;
    }
    // checkbox绑定点击事件
    $box.on('click',function () {
        // 取得checkbox勾选状态
        var bool = $box.prop('checked');
        // 若勾选
        if(bool){
            // 启用自定义定时器时间
            thisProxy.enableCustomeIntervalFlag = true;
        }else {
            // 关闭自定义定时器时间
            thisProxy.enableCustomeIntervalFlag = false;
        }
        // 清除定时器
        clearTimeout(thisProxy.timer);
        // 初始化数据查询并开启定时器(将会按指定的自定义定时器时间间隔进行)
        thisProxy.initInquireData(true);
        // 向后端提交此次天气模式的切换
        var url = DataUrl.WEATHER_MODEL;
        if(!$.isValidVariable(url)){
            return;
        }
        url = url + '?isCheck='+ bool;

        $.ajax({
            url:url,
            type: 'POST',
            dataType: 'json',
            success: function (data) {

                // 数据无效
                if (!data) {

                };
                // 成功
                if (data.status == 200) {

                }
            },
            error: function ( status, error) {
                console.error('ajax requset  fail, error:');
                console.error(error);
            }
        });


    });

};

/**
 * 切换复杂天气模式
 * */
FormModule.prototype.changeFilter = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 取得checkbox
    var $box = $('input#set-filter', thisProxy.canvas);

    if($.isValidVariable($box) && $box.length < 1){
        return;
    }
    // checkbox绑定点击事件
    $box.on('click',function () {
        // 取得checkbox勾选状态
        var bool = $box.prop('checked');
        // 若勾选
        if (bool) {
            // 标记过滤是否开启
            thisProxy.filter = true;
        } else {
            // 标记过滤是否开启
            thisProxy.filter = false;
        }
        // 清除定时器
        clearTimeout(thisProxy.timer);
        // 初始化数据查询并开启定时器(将会按指定的自定义定时器时间间隔进行)
        thisProxy.initInquireData(true);
    })

};



/**
 *  绑定查询按钮事件
 *
 * */
FormModule.prototype.bindEventOnButton = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 查询按钮绑定事件
    $('.inquire', thisProxy.canvas).on('click',function () {
        // 清除定时器
        clearTimeout(thisProxy.timer);
        // 初始化数据查询并开启定时器(将会按指定的自定义定时器时间间隔进行)
        thisProxy.initInquireData(true);
    });
};

/**
 * 初始化数据查询
 * */

FormModule.prototype.initInquireData = function (refresh) {
    // 当前对象this代理
    var thisProxy = this;

    // 禁用表单事件
    thisProxy.desabledForm(true);
    // 启用loading动画
    thisProxy.loading.start();
    // 清空相关数据信息
    // thisProxy.clear();

    // 更新当前查询条件
    thisProxy.updateCondition();
    // 计算表格容器大小,使其大小自适应
    // (因为更新显示了模块内当前查询条件栏内容，所以重新计算表格容器的高度)
    thisProxy.resizeTableContainer();

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
FormModule.prototype.initLoading = function () {
    // 当前对象this代理
    var thisProxy = this;
    thisProxy.loading = Ladda.create($('.inquire', thisProxy.canvas)[0]);
};

/**
 * 校验表单是否有效
 *
 * */
FormModule.prototype.validateForm = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 若范围无效则提示
    if(!$.isValidVariable(thisProxy.scope)){
        //清空相关数据信息
        thisProxy.clear();
        // 展示提示
        thisProxy.showMsg('danger','范围无效,请选择有效的范围选项');
        return false;
    }else {
        return true;
    }

};

/**
 * 查询数据
 *
 * */
FormModule.prototype.inquireData = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 校验请求地址是否有效
    if(!$.isValidVariable(thisProxy.url)){
        thisProxy.showMsg('danger','请求地址无效');
        // 启用表单事件
        thisProxy.desabledForm(false);
        // 停止按钮loading动画
        thisProxy.loading.stop();
        // 清空相关数据信息
        thisProxy.clear();
        return;
    }
    // 拼接参数,拼接完整的请求地址
    var url = thisProxy.url + '?scope='+ thisProxy.scope +'&keyWord='+ thisProxy.keyword;
    // 备降模块无关键字参数
    if(thisProxy.tableId == 'alternate-table'){
        url = thisProxy.url + '?scope='+ thisProxy.scope;
    }else if (thisProxy.tableId == 'over-table'){ // 疆内飞越模块要添加exceptX参数
        // 若filter为true,则是勾选了'任务为X不显示'，exceptX参数值为'1',反之为'0'
        if(thisProxy.filter){
            url = thisProxy.url + '?scope='+ thisProxy.scope +'&keyWord='+ thisProxy.keyword + '&exceptX=' + '1';
        }else {
            url = thisProxy.url + '?scope='+ thisProxy.scope +'&keyWord='+ thisProxy.keyword + '&exceptX=' + '0';
        }
    }
    // 请求获取数据
    thisProxy.xhr = $.ajax({
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
                // 展示提示
                thisProxy.showMsg('danger','请求接口错误');
            };
            // 成功
            if (data.status == 200) {
                /****todo***/
                // 取得数据生成时间
                thisProxy.generateTime = data.generateTime;

                // 显示表格容器
                thisProxy.isHiddenTableContainer(false);
                // 清除提示信息
                thisProxy.clearMsg();
                // 判断表格是否已经初始化
                if(!$.isValidObject(thisProxy.table.gridTableObject)){
                    // 校验自定义的initGridTable方法是否有效
                    if($.isValidVariable(thisProxy.initGridTable) && typeof thisProxy.initGridTable == 'function'){
                        // 调用initGridTable方法,初始化表格
                        thisProxy.table = thisProxy.initGridTable(thisProxy.table);
                        thisProxy.table.fireTableDataChange(data);
                        // 若表格定时器更新数据开关开启则更新数据生成时间，用于表格数据与时间保持一致
                        if(thisProxy.table.fireDataFlag){
                            // 更新数据生成时间并显示
                            thisProxy.updateTime();
                        }
                    }
                }else {
                    // 更新表格数据
                    thisProxy.table.fireTableDataChange(data);
                    // 若表格定时器更新数据开关开启则更新数据生成时间，用于表格数据与时间保持一致
                    if(thisProxy.table.fireDataFlag){
                        // 更新数据生成时间并显示
                        thisProxy.updateTime();
                    }
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
FormModule.prototype.showMsg = function (type, content, clearTime) {
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
FormModule.prototype.clearMsg = function () {
    // 当前对象this代理
    var thisProxy = this;
    var $err = $('.alert',thisProxy.canvas);
    $err.html('').removeClass('active')
};

/**
 * 清空相关数据信息
 *
 *  清除提示、警告、查询条件、数据生成时间等
 *
 * */
FormModule.prototype.clear = function () {
    // 当前对象this代理
    var thisProxy = this;
    //数据生成时间
    var $time = $('.panel-heading .time', thisProxy.canvas);
    // 当前查询条件
    var $condition = $('.condition-panel', thisProxy.canvas);
    // 提示信息
    var $err = $('.alert',thisProxy.canvas);

    // 清空数据生成时间
    $time.html('').removeAttr('title');
    // 隐藏当前查询条件栏
    $condition.addClass('hidden');
    // 清空提示
    $err.html('').removeClass('active');
    // 若表格已经初始化，则清除协调窗口
    if($.isValidObject(thisProxy.table.gridTableObject)){
        // 清除协调窗口
        thisProxy.table.clearCollaborateContainer();
    }

    // 隐藏表格容器
    thisProxy.isHiddenTableContainer(true);
};

/**
 * 禁用或启用表单事件
 *
 * */
FormModule.prototype.desabledForm = function (bool) {
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
FormModule.prototype.updateTime = function () {
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
FormModule.prototype.updateCondition = function () {
    // 当前对象this代理
    var thisProxy = this;
    var scopeText = $('.form-panel .dropdown-toggle', thisProxy.canvas).text();
    var key = thisProxy.keyword;
    $('.condition-panel .scope', thisProxy.canvas).html(scopeText).attr('title','范围:'+ scopeText);
    $('.condition-panel .key', thisProxy.canvas).html(key).attr('title','关键字:'+ key);
    $('.condition-panel',thisProxy.canvas).removeClass('hidden');
};

/**
 * 更新范围列表项
 *
 * @param data 范围列表项集合
 * */
FormModule.prototype.setScope = function (data) {
    // 当前对象this代理
    var thisProxy = this;
    // 获取列表容器
    var $menu = $('.form-panel .dropdown-menu', thisProxy.canvas);
    // 创建一个空串
    var con = '';
    data.map(function (item, index, arr) {
        // 拼接html结构串
        var node = '<li><a href="javascript:;" class="scope-item" '+ 'data-val="'+ item.value + '"' + '>' + item.text +'</a></li>';
        // 追加串
        con += node;
    });
    // 清空列表容器并把新列表html串追加到列表容器
    $menu.empty().append(con);
    // 设置默认选中项
    thisProxy.setDefaultScope();
};


/**
 * 设置模块是否为活动模块
 *
 * @param bool
 * */
FormModule.prototype.setActive = function (bool) {
    // 当前对象this代理
    var thisProxy = this;
    if(bool){
        // 开启表格数据刷新开关
        if($.isValidVariable(thisProxy.table.fireDataFlag)){
            thisProxy.table.fireDataFlag = true;
        }
        // 开启定时总开关
        thisProxy.timerValve = true;
        // 查询数据并开启定时刷新
        thisProxy.initInquireData(true);
    }else {
        if($.isValidVariable(thisProxy.table.fireDataFlag)){
            // 关闭该模块下表格的数据刷新开关
            thisProxy.table.fireDataFlag = false;
        }
        if($.isValidVariable(thisProxy.table.clearCollaborateContainer)){
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
    }
};

/**
 * 定时器
 * @param fn 执行函数
 * @param instance 对象实例
 * @isNext 是否继续定时执行
 * @param time 时间间隔
 * */


FormModule.prototype.startTimer = function (fn, isNext, time) {
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

/**
 * 是否隐藏表格容器
 * @param bool 布尔值  true隐藏 false 不隐藏，即显示
 *
 * */

FormModule.prototype.isHiddenTableContainer = function (bool) {
    // 当前对象this代理
    var thisProxy = this;
    var $tableContainer = $('.result-panel', thisProxy.canvas);
    if(bool){
        $tableContainer.addClass('hidden');
    }else {
        $tableContainer.removeClass('hidden');
    }
}


