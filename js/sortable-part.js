/**
 * 拖动排序组件
 */
function SortablePart(params) {
    // 检查参数有效性
    if (!$.isValidObject(params)) {
        return;
    }
    // 数据集合
    this.data = params.data;
    //拖动排序元素 jQ对象
    this.selector = params.selector;
    // 添加按钮
    this.addBtn = params.addBtn;
    // 还原按钮
    this.revertBtn = params.revertBtn;
    // 保存按钮
    this.saveBtn = params.saveBtn;
    // 机型集合
    this.items = [];
    // 原始id集合
    this.ids = [];
    // 排序后的id集合
    this.sortedIds = [];
    // 是否已经排序标识
    this.sorted = false;
    //限制排序开始点击指定的元素 字符串 如:'.position-header'
    this.handle = params.handle; // ".position-header",
    // 指定占位元素class 字符串
    this.placeholder = params.placeholder //'sortable-placeholder position',
}

/**
 * 初始化
 * */
SortablePart.prototype.init = function () {
    // 当前对象this代理
    var thisProxy = this;
    thisProxy.selector.sortable({
        items: "> li.position", //指定元素内的哪些项目应该可排序
        handle: ".position-header", //限制排序开始点击指定的元素
        placeholder : 'sortable-placeholder position',
        helper: "clone", //params
        tolerance: "pointer", // 设置当鼠标指针与其他项目重叠时，被移动的项目悬停在另一个项目上
        stop : function (event,ui) {
            // 更新当前排序后的各id顺序,即排序后的id集合
            thisProxy.sortedIds = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
            // 更新排序标识
            thisProxy.isSorted();
            // 更新保存按钮是否可用
            thisProxy.toggleButtonEnable();
        },
        // disabled: true // 初始化设置为不可用
    }).disableSelection();
    // 记录初始化时的id顺序，即原始id集合
    thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 默认设置排序后的id集合与原始id集合一致
    thisProxy.sortedIds= thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新保存按钮是否可用
    thisProxy.toggleButtonEnable();
    // 绑定事件
    thisProxy.initEvent();
};
/**
 * 绑定事件
 * */
SortablePart.prototype.initEvent = function () {
    var thisProxy = this;

    // 添加机位分类
    thisProxy.addBtn.on('click',function () {
        if(thisProxy.sorted){
            var text = '排序有变更,请先保存排序后再添加机位分类';
            thisProxy.alertDialog(text)
        }else {
            // todo
            // 添加机位分类
            thisProxy.addPosition()
        }
    });
    //还原排序
    thisProxy.revertBtn.on('click',function () {
        if(thisProxy.sorted){
            // 还原排序确认框
            var text = "<p class='modal-text'>确定还原排序吗？</p>";
            thisProxy.confirmRevertDialog(text);
        }
    });
    //保存排序
    thisProxy.saveBtn.on('click',function () {
        if(thisProxy.sorted){
            // 保存排序排序确认框
            var text = "确定保存当前排序吗？";
            thisProxy.confirmSaveDialog(text);
        }
    })

    // 删除/修改机位分类
    $(thisProxy.selector).on('click','.position .position-header',function (e) {
        var event = e || event;
        // 事件源jQ对象
        var $target = $(e.target);
        // 事件源jQ对象data-event属性
        var mark = $target.attr('data-event');
        // 获取事件源自定义属性，用于操作时获取对应数据
        var opt = {
            id : $target.attr('pos-id'),
            key : $target.attr('pos-key')
        }
        // 删除机位分类
        if(mark== 'delete'){
            // todo
            thisProxy.deletePosition(opt);

        }else if(mark == 'edit'){ // 修改机位分类
            thisProxy.updatePosition(opt);
        }
    });

};
SortablePart.prototype.enableEdit = function () {
    var thisProxy = this;
    thisProxy.selector.sortable('enable');
};

SortablePart.prototype.disableEdit = function () {
    var thisProxy = this;
    if(thisProxy.sorted){
        var text = "<p class='modal-text'>排序有变更,是否保存当前排序？</p>";
        thisProxy.confirmSaveSort(text);
        thisProxy.selector.sortable('disable');

    }else {
        thisProxy.selector.sortable('disable');
    }
};

/**
 * 判断是否发生排序
 *
 * 条件: 初始化id数组与排序后的id数组是否一致，一致则没有发生排序，不一致则为发生排序
 * */
SortablePart.prototype.isSorted = function () {
    var thisProxy = this;
    var id = thisProxy.ids.toString();
    var sortId = thisProxy.sortedIds.toString();
    if(id === sortId){
        thisProxy.sorted = false;
    }else {
        thisProxy.sorted = true;
    }
    return thisProxy.sorted;
};

SortablePart.prototype.toggleButtonEnable = function (ele) {
    var thisProxy = this;
    if(thisProxy.sorted){
        thisProxy.saveBtn.attr('disabled',false);
        thisProxy.revertBtn.attr('disabled',false);
        thisProxy.addBtn.attr('disabled',true);
    }else {
        thisProxy.saveBtn.attr('disabled',true);
        thisProxy.revertBtn.attr('disabled',true);
        thisProxy.addBtn.attr('disabled',false);
    }
};

/**
 * 还原排序
 *
 * */
SortablePart.prototype.revert = function () {
    var thisProxy = this;
    // 按原id顺序遍历
    thisProxy.ids.map(function (val, index, arr) {
        // index 为下标

        // 获取当前元素
        var $item = $('li.position[data-id="'+ val +'"]',thisProxy.selector);
        // 获取当前位于此下标的目标元素
        var $target = $('li.position',thisProxy.selector)[index];
        // 当前元素相对于同胞元素的位置
        var at = $item.index();
        // 若当前元素位置 和原id中下标一致，则当前元素没有移动位置
        if(at == index){
            return
        }else { // 反之，则将当前元素插入到目标元素之前
            $item.insertBefore($target);
        }
    });
    // 还原排序完成后再次更新排序后的id集合
    thisProxy.sortedIds= thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序标识
    thisProxy.isSorted();
    // 更新保存按钮是否可用
    thisProxy.toggleButtonEnable();
};

/**
 * 保存排序排序确认框
 * text 弹框内容
 * */
SortablePart.prototype.confirmSaveDialog =function(text){
    var thisProxy = this;
    var options = {
        title : "保存排序",
        content : '<p class="modal-text">'+text+'</p>',
        status: 1,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "保存",
                status :1 ,
                isHidden : false,
                callback : function(){
                    var btn = $(this);
                    var dialog = $('#bootstrap-modal-dialog');
                    thisProxy.disabledCloseDialog(dialog,btn);
                    thisProxy.saveSort();
                }
            },{
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
};
/**
 * 还原排序确认框
 * text 弹框内容
 *
 * */
SortablePart.prototype.confirmRevertDialog =function(text){
    var thisProxy = this;
    var options = {
        title : "还原排序",
        content : text,
        status: 2,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "还原",
                status :1 ,
                callback : function(){
                    thisProxy.revert();
                }
            },{
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
};

SortablePart.prototype.saveSort = function (btn) {
    var thisProxy = this;
    // ajax
    $.ajax({
        url:DataUrl.POSTION_ORDER,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data : {
            // sortIds : JSON.stringify(thisProxy.sortedIds),
            sortIds : thisProxy.sortedIds,
        },
        success: function (data) {

            // 数据无效
            if (!data) {
                thisProxy.alertDialog('提交排序失败')
            };
            // 成功
            if (data.status == 200) {

                // 更新原始id集合
                thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
                // 更新排序标识
                thisProxy.isSorted();
                // 更新按钮是否可用
                thisProxy.toggleButtonEnable();
                // 弹框提示操作成功
                thisProxy.tipDialog('提交排序成功');
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    var mess =data.error.message;
                        thisProxy.alertDialog(mess)
                }else {
                    thisProxy.alertDialog('提交排序失败')
                }
            }
        },
        error: function ( status, error) {
            thisProxy.alertDialog('提交排序失败');
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};
/**
 * 添加机位分类
 *
 * */
SortablePart.prototype.addPosition = function () {
    var thisProxy = this;
    // 添加机位分类表单框
    thisProxy.addPositionDialog();
};
/**
 * 添加机位分类表单弹框
 *
 *
 * */
SortablePart.prototype.addPositionDialog = function () {
    var thisProxy = this;
    // 创建一个空数据
    var data = {};
    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#form-template").html());
    var content = myTemplate(data);
    var options = {
        title : "添加机位分类",
        content : content,
        status: 1,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 500,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
           {
                name : "创建",
                status :1 ,
                isHidden : false,
                callback : function(){

                    // 表单校验是否通过
                    var valid = thisProxy.isValid();
                    // 表单校验是否通过
                    if(valid){
                        var btn = $(this);
                        var dialog = $('#bootstrap-modal-dialog');
                        // 禁用弹框关闭
                        thisProxy.disabledCloseDialog(dialog,btn);
                        // 添加机位分类表单提交
                        thisProxy.addPositionSubmit();
                    }
                }
            },
            {
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            },
        ]
    };
    BootstrapDialogFactory.dialog(options);
    // 初始化表单相关处理
    thisProxy.initForm()
}

/**
 * 添加机位分类表单提交
 *
 * */
SortablePart.prototype.addPositionSubmit = function () {
    var thisProxy = this;
    var newData = thisProxy.getSinglePositionData();
    $.ajax({
        url:DataUrl.POSTION_ADD,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data :newData,
        success: function (data) {

            // 数据无效
            if (!data) {
                thisProxy.alertDialog('添加机位分类失败')
            };
            // 成功
            if (data.status == 200) {
                // 追加单个新的机位分类列表
                thisProxy.appendSinglePositin(data);
                // 刷新
                thisProxy.refresh();
                // 弹框提示成功
                thisProxy.tipDialog('添加机位分类成功');
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    var mess = data.error.message
                    thisProxy.alertDialog(mess)
                }else {
                    thisProxy.alertDialog('添加机位分类失败');
                }
            }
        },
        error: function ( status, error) {
            thisProxy.alertDialog('添加机位分类失败');
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};

/**
 * 追加单个新的机位分类列表
 *
 * */
SortablePart.prototype.appendSinglePositin = function(data){
    var thisProxy = this;
    //检测数据是否有效
    if(!$.isValidObject(data.configs)) {
        return;
    }
    //取得机位分类配置数据
    var  config = data.configs;
    // 将机位分类内部的机型字段值转为数组
    config.map(function (item, index, arr) {
        item.value = item.value.split(',');
        // 拷贝
        var obj = $.extend(true,{},item);
        // 更新到数据集合
        thisProxy.data[obj.id] = obj;
    });
    //

    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#template").html());
    var nodes = myTemplate(config);
    // 追加到列表
    $(nodes).appendTo(thisProxy.selector);
};

/**
 * 删除机位分类列表
 *
 * opt 机位分类列表参数
 *
 * */

SortablePart.prototype.deletePosition  = function (opt) {
    var thisProxy = this;
    // 若当前发生排序了
    if(thisProxy.sorted){
        var text = '排序有变更,请先保存排序后再删除机位分类';
        thisProxy.alertDialog(text)
    }else {
        // todo
        // 删除机位分类弹框
        thisProxy.deletePositionDialog(opt);
    }
};
/**
 * 删除机位分类列表确认框
 * opt 机位分类列表参数
 * */
SortablePart.prototype.deletePositionDialog = function (opt) {
    var thisProxy = this;
    var options = {
        title : "删除机位分类",
        content : '<p class="modal-text">确定删除'+ opt.key +'机位分类吗？</p>',
        status: 3,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "删除",
                status :3 ,
                isHidden : false,
                callback : function(){
                    var btn = $(this);
                    var dialog = $('#bootstrap-modal-dialog');
                    thisProxy.disabledCloseDialog(dialog,btn);
                    thisProxy.deletePositionSubmit(opt);
                }
            },
            {
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
};

/**
 * 删除机位分类列表提交
 * opt 机位分类列表参数
 *  
 * */

SortablePart.prototype.deletePositionSubmit = function (opt) {
    var thisProxy = this;
    var id = opt.id;
    $.ajax({
        url:DataUrl.POSTION_DEL,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data : {
            id : id,
        },
        success: function (data) {
            // 数据无效
            if (!data) {
                thisProxy.alertDialog('删除机位分类'+ opt.key+'失败')
            };
            // 成功
            if (data.status == 200) {
                thisProxy.deleteSinglePositin(opt);
                // 同步删除数据集合中对应数据
                delete thisProxy.data[id];
                // 刷新
                thisProxy.refresh();

                thisProxy.tipDialog('删除机位分类'+ opt.key+'成功')
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('删除机位分类'+ opt.key+'失败:'+data.error.message);
                }else {
                    thisProxy.alertDialog('删除机位分类'+ opt.key+'失败')
                }
            }else if(data.status == 202){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('删除机位分类'+ opt.key+'失败:' +data.error.message);
                }else {
                    thisProxy.alertDialog('删除机位分类'+ opt.key+'失败')
                }

            }
        },
        error: function ( status, error) {
            thisProxy.alertDialog('删除机位分类'+ opt.key+'失败')
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};
/**
 * 删除机位分类列表节点
 * opt 机位分类列表参数
 * */

SortablePart.prototype.deleteSinglePositin = function(opt){
    var thisProxy = this;
    var id = opt.id
    // 删除机位分类html节点
    $('.position[data-id="'+ id+'"]',thisProxy.selector).remove();
};
/**
 *  修改机位分类列表
 *
 * */
SortablePart.prototype.updatePosition  = function (opt) {

    var thisProxy = this;
    if(thisProxy.sorted){
        var text = '排序有变更,请先保存排序后再修改机位分类';
        thisProxy.alertDialog(text)
    }else {
        // todo
        // 修改机位分类表单弹框
        thisProxy.updatePositionDialog(opt);
    }
};
/**
 * 修改机位分类列表
 * opt 所选机位分类列表相关参数
 * */
SortablePart.prototype.updatePositionDialog = function (opt) {
    var thisProxy = this;
    var id = opt.id;
    // 取相应数据
    var data = thisProxy.data[id];
    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#form-template").html());
    var content = myTemplate(data);

    var options = {
        title : "修改机位分类",
        content : content,
        status: 1,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 500,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "修改",
                status :1 ,
                isHidden : false,
                callback : function(){
                    // 表单校验是否通过
                    var valid = thisProxy.isValid();
                    // 表单校验是否通过
                    if(valid){
                        var btn = $(this);
                        var dialog = $('#bootstrap-modal-dialog');
                        // 禁用弹框关闭
                        thisProxy.disabledCloseDialog(dialog,btn);
                        // 提交修改
                        thisProxy.updatePositionSubmit();
                    }

                }
            },
            {
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            }
        ]
    };
     BootstrapDialogFactory.dialog(options);
    thisProxy.initForm()
};
/**
 * 提交修改
 * */
SortablePart.prototype.updatePositionSubmit = function () {
    var thisProxy = this;
    var newData = thisProxy.getSinglePositionData();
    $.ajax({
        url:DataUrl.POSTION_UPDATE,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data : newData,
        success: function (data) {

            // 数据无效
            if (!data) {
                thisProxy.alertDialog('修改机位分类'+ opt.key+'失败')
            };
            // 成功
            if (data.status == 200) {
                //更新单个机位分类列表
                thisProxy.updateSinglePositin(data);
                // 刷新
                thisProxy.refresh();
                thisProxy.tipDialog('修改机位分类'+newData.key+'成功');
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('修改机位分类'+ opt.key+'失败:'+data.error.message);
                }else {
                    thisProxy.alertDialog('修改机位分类'+ opt.key+'失败')
                }
            }else if(data.status == 202){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('修改机位分类'+ opt.key+'失败:' +data.error.message);
                }else {
                    thisProxy.alertDialog('修改机位分类'+ opt.key+'失败')
                }

            }
        },
        error: function ( status, error) {
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};
/**
 * 更新单个机位分类列表
 *
 * */
SortablePart.prototype.updateSinglePositin = function(data){
    var thisProxy = this;
    // 追加新机位分类html节点
    //检测数据是否有效
    if(!$.isValidObject(data.configs)) {
        return;
    }
    //取得机位分类配置数据
    var  config = data.configs;
    // 将机位分类内部的机型字段值转为数组
    config.map(function (item, index, arr) {
        item.value = item.value.split(',');
        // 拷贝
        var obj = $.extend(true,{},item);
        // 更新到数据集合
        thisProxy.data[obj.id] = obj;
    });
    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#template").html());
    var nodes = myTemplate(config);
    var oldNodes = $('.position[data-id="'+ config[0].id+'"]',thisProxy.selector);
    // 追加到列表
    $(nodes).insertBefore(oldNodes);

    // 删除旧机位分类html节点
    oldNodes.remove();
};

/**
 * 禁用弹框关闭
 * */
SortablePart.prototype.disabledCloseDialog = function (dialog,btn) {
    var thisProxy = this;
    //禁用头部关闭按钮
    $('.close',dialog).attr('disabled',true);
    // 启用loading动画
    var loading = Ladda.create(btn[0]);
    loading.start();
    //禁用底部所有操作按钮
    $('#bootstrap-modal-dialog-footer button',dialog).attr('disabled',true);
};

/**
 * 启用弹框关闭
 * */
SortablePart.prototype.enabledCloseDialog = function () {
    var thisProxy = this;
    //启用头部关闭按钮
    $('#bootstrap-modal-dialog .modal-header .close').attr('disabled',false);
    //启用底部所有操作按钮
    $('#bootstrap-modal-dialog-footer button').attr('disabled',false);
};


/**
 * 警告框
 *
 * */
SortablePart.prototype.alertDialog = function (text) {
    var thisProxy = this;
    thisProxy.enabledCloseDialog();
    var options = {
        title : "提示",
        content : '<p class="modal-text">'+text+'</p>',
        status: 2,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "关闭",
                status :1 ,
                callback : function(){

                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
}

/**
 * 提示框
 *
 * */
SortablePart.prototype.tipDialog = function (text) {
    var thisProxy = this;
    thisProxy.enabledCloseDialog();
    var options = {
        title : "提示",
        content : '<p class="modal-text">'+text+'</p>',
        status: 1,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "关闭",
                status :1 ,
                callback : function(){

                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
}
/**
 * 刷新相关数据，使与当前视图保持同步
 *
 * */
SortablePart.prototype.refresh = function (text) {
    var thisProxy = this;
    // 更新原始id集合
    thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序后的id集合
    thisProxy.sortedIds= thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序标识
    thisProxy.isSorted();
    // 更新按钮是否可用
    thisProxy.toggleButtonEnable();
}

/**
 * 初始化处理表单
 *
 *
 * */
SortablePart.prototype.initForm = function () {
    var thisProxy = this;
    var $form = $('#bootstrap-modal-dialog #form-position');
    // 校验初始化
    thisProxy.initValidator($form);
    // 多值输入初始化
    thisProxy.initManifest($form);
}

/**
 * 表单校验初始化
 * $form 表单jQ对象
 * */
SortablePart.prototype.initValidator = function ($form) {
    var thisProxy = this;
    $form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            'position-key': {// 机位分类名称
                validators: {
                    // 以字母开头，长度为1~3位的全字母或字母与数字组合
                    wordAndDigit1_3: {}
                }
            },
            'position-text': {// 描述
                validators: {
                    notEmpty: {}
                }
            },
            'position-value': {
                validators: {
                    wordOrDigit1_6 : {},
                    leastOneItem: {// 最少有一个值
                        len: function () {
                            return thisProxy.items.length;
                        }
                    },
                }

            }
        }
    })
}
/**
 * 多值输入初始化
 * $form 表单jQ对象
 *
 * */

SortablePart.prototype.initManifest = function ($form) {
    var thisProxy = this;
    // 清空机型数值集合
    thisProxy.items = [];
    // 表单校验对象
    var validatorObj = $form.data('bootstrapValidator');
    // 初始化多值输入
    $('#position-value').manifest({
        // 格式化数值
        formatValue: function (data,$value,$item,$mpItem){
            return data.toUpperCase();
        },
        // 格式化数值显示
        formatDisplay: function (data, $item, $mpItem) {
            return data.toUpperCase();
        },

        // 添加
        onAdd: function (data, $value, $item, $mpItem) {
            var dataUpper = data.toUpperCase();

            var bool = validatorObj.isValidField("position-value");
            thisProxy.items = $('#position-value').manifest('values');
            if (!bool) {// 校验失败
                validatorObj.resetField("position-value", true);// 重置校验
                return false;// 阻止添加
            } else {
                thisProxy.items.push(dataUpper);
            }

        },
        // 删除
        onRemove: function (data, $item) {
            var dataUpper = data.toUpperCase();
            var index = $item.index();
            thisProxy.items.splice(index,1);
            var len = thisProxy.items.length;
            if (len == 0) {// 如果没有值
                validatorObj.revalidateField("position-value");// 重新校验
            }
        }

    });
};

/**
 * 校验表单是否通过校验规则
 * */
SortablePart.prototype.isValid = function () {
    var thisProxy = this;
    var $form = $('#bootstrap-modal-dialog #form-position');
    // 全局校验
    $form.bootstrapValidator("validate");
    var valid = $form.data('bootstrapValidator').isValid();
    return valid;
}
/**
 * 获取单个表单数据
 *
 * */
SortablePart.prototype.getSinglePositionData = function () {
    var thisProxy = this;
    var opt = {};
    var $from = $('#form-position');
    var id = $from.attr('data-id');
    var key = $('.position-key',$from).val();
    var text = $('.position-text',$from).val();
    var value = thisProxy.items;
    if($.isValidVariable(id)){
        opt.id = id;
    }
    opt.key = key;
    opt.text = text;
    opt.value = value;
    return opt;
}