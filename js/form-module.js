/**
 * 表单组件
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

    // 设置默认选中的范围选项
    thisProxy.setDefaultScope();

    // 绑定范围选择切换
    thisProxy.changeScope();

    // 绑定关键字录入
    thisProxy.changeKeyword();

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


FormModule.prototype.fn = function () {
    // 当前对象this代理
    var thisProxy = this;
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
    $result.height(h);
};

/**
 * 设置默认选中的范围选项:范围列表项自定义居属性值为1的项为默认选中项
 * */
FormModule.prototype.setDefaultScope = function () {
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
 *  绑定范围选择切换
 * */
FormModule.prototype.changeScope = function () {
    // 当前对象this代理
    var thisProxy = this;
    var $item = $('.form-panel .dropdown-menu a', thisProxy.canvas);

    $item.on('click',function () {
        // 取得当前点击选中的范围列表项
        var $that = $(this);
        // 取得范围按钮
        var $btn = $that.parent().parent().prev();
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
        var val = $(this).val();
        thisProxy.keyword = val;
    });
};


/**
 * 格式化数据生成时间
 * */
FormModule.prototype.formaterGenerateTimeTime = function (time) {
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
FormModule.prototype.changeFilter = function () {
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

FormModule.prototype.initInquireData = function () {
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
    });


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
        //停止按钮loading动画
        thisProxy.loading.stop();
        return;
    }
    // 拼接参数,拼接完整的请求地址
    var url = thisProxy.url + '?scope='+ thisProxy.scope +'&keyWord='+ thisProxy.keyword;
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
 * 清空
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

    // 若表格已经存在，则清空表格头及表格数据
    if ($.isValidObject(thisProxy.table)) {
        $.jgrid.gridUnload(thisProxy.tableId);
    }
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
 * 初始化表格
 * */
FormModule.prototype.initTable = function (data) {
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
FormModule.prototype.updateTime = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 校验时间是否有效
    if($.isValidVariable(thisProxy.generateTime)){
        // 取得数据生成时间节点
        var $node = $('.panel-heading .time', thisProxy.canvas);
        // 格式化处理时间
        var time = thisProxy.formaterGenerateTimeTime(thisProxy.generateTime);
        // 显示数据生成时间
        $node.text('数据更新生成时间: ' + time).attr('title','数据更新生成时间: '+time);
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






