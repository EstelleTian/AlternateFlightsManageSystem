/**
 * 机场拖动排序组件
 */
function AirportSortable(params) {
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

    this.items = params.items //"> li.airport",
    // 选中的类型
    this.selectedTpye = '';
}

/**
 * 初始化
 * */
AirportSortable.prototype.init = function () {
    // 当前对象this代理
    var thisProxy = this;
    var _items = thisProxy.items;
    var _handle = thisProxy.handle;
    var _placeholder = thisProxy.placeholder;
    thisProxy.selector.sortable({
        items: _items, //指定元素内的哪些项目应该可排序
        handle: _handle , //限制排序开始点击指定的元素
        placeholder : _placeholder,
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
        disabled: true // 初始化设置为不可用
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
AirportSortable.prototype.initEvent = function () {
    var thisProxy = this;

    // 添加机场
    thisProxy.addBtn.on('click',function () {
        // 是否有权限
        if(!$.isValidObject(userProperty.id_4410)){
            return;
        }
        if(thisProxy.sorted){
            var text = '排序有变更,请先保存排序后再添加机场';
            thisProxy.alertDialog(text)
        }else {
            // todo
            // 添加机场
            thisProxy.addPosition()
        }
    });
    //还原排序
    thisProxy.revertBtn.on('click',function () {
        // 是否有权限
        if(!$.isValidObject(userProperty.id_4440)){
            return;
        }
        if(thisProxy.sorted){
            // 还原排序确认框
            var text = "<p class='modal-text'>确定还原排序吗？</p>";
            thisProxy.confirmRevertDialog(text);
        }
    });
    //保存排序
    thisProxy.saveBtn.on('click',function () {
        // 是否有权限
        if(!$.isValidObject(userProperty.id_4440)){
            return;
        }
        if(thisProxy.sorted){
            // 保存排序排序确认框
            var text = "确定保存当前排序吗？";
            thisProxy.confirmSaveDialog(text);
        }
    })

    // 删除/修改机场
    $(thisProxy.selector).on('click','.airport .airport-header',function (e) {
        var event = e || event;
        // 事件源jQ对象
        var $target = $(e.target);
        // 事件源jQ对象data-event属性
        var mark = $target.attr('data-event');
        // 获取事件源自定义属性，用于操作时获取对应数据
        var opt = {
            id : $target.attr('airport-id'),
            code : $target.attr('airport-code')
        }
        // 删除机场
        if(mark== 'delete'){
            // todo
            thisProxy.deletePosition(opt);

        }else if(mark == 'edit'){ // 修改机场
            thisProxy.updatePosition(opt);
        }
    });

};
AirportSortable.prototype.enableEdit = function () {
    var thisProxy = this;
    thisProxy.selector.sortable('enable');
};

AirportSortable.prototype.disableEdit = function () {
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
AirportSortable.prototype.isSorted = function () {
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

AirportSortable.prototype.toggleButtonEnable = function (ele) {
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
AirportSortable.prototype.revert = function () {
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
AirportSortable.prototype.confirmSaveDialog =function(text){
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
AirportSortable.prototype.confirmRevertDialog =function(text){
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

AirportSortable.prototype.saveSort = function (btn) {
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
                thisProxy.alertDialog('提交排序失败');
                return;
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
            }else if(data.status == 203){ // 无权限
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    var mess =data.error.message;
                    thisProxy.alertDialog(mess)
                }else {
                    thisProxy.alertDialog('提交排序失败')
                }
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
 * 添加机场
 *
 * */
AirportSortable.prototype.addPosition = function () {
    var thisProxy = this;
    // 添加机场表单框
    thisProxy.addPositionDialog();
};
/**
 * 添加机场表单弹框
 *
 *
 * */
AirportSortable.prototype.addPositionDialog = function () {
    var thisProxy = this;
    // 创建一个空数据
    var data = {};
    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#airport-form-template").html());
    var content = myTemplate(data);
    var options = {
        title : "添加机场",
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
                        // 添加机场表单提交
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
 * 添加机场表单提交
 *
 * */
AirportSortable.prototype.addPositionSubmit = function () {
    var thisProxy = this;
    var newData = thisProxy.getSinglePositionData();

    $.ajax({
        url:DataUrl.AIRPORT_ADD,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data :newData,
        success: function (data) {
            // 数据无效
            if (!data) {
                thisProxy.alertDialog('添加机场失败');
                return;
            };
            // 成功
            if (data.status == 200) {
                // 追加单个新的机场列表
                thisProxy.appendSinglePositin(data);
                // 刷新
                thisProxy.refresh();
                // 弹框提示成功
                thisProxy.tipDialog('添加机场成功');
            }else if(data.status == 203){ //  无权限
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    var mess = data.error.message
                    thisProxy.alertDialog(mess)
                }else {
                    thisProxy.alertDialog('添加机场失败');
                }
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    var mess = data.error.message
                    thisProxy.alertDialog(mess)
                }else {
                    thisProxy.alertDialog('添加机场失败');
                }
            }
        },
        error: function ( status, error) {
            thisProxy.alertDialog('添加机场失败');
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};

/**
 * 追加单个新的机场列表
 *
 * */
AirportSortable.prototype.appendSinglePositin = function(datas){
    var thisProxy = this;
    //检测数据是否有效
    if(!$.isValidObject(datas.airports)) {
        return;
    }
    // 机场数据
    var airports = datas.airports;
    // 拷贝数据
    var result = JSON.parse(JSON.stringify(airports));
    var len = result.length;
    // 机场类型参数集合
    var airportType = app.airportType;

    for(var j=0; j<len; j++) {
        var airport = result[j];
        var type = airport.type;
        var id = airport.id;
        if($.isValidObject(airportType[type])){
            result[j].typeZh = airportType[type].text || ''; // 取对应text字段值
        }
        // 更新到数据集合
        thisProxy.data[id] = airport;
    }

    // 封装数据
    var data = {
        code : userProperty, // 用户权限
        airports : result
    };

    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#airport-template").html());
    // 注册一个比较是否相等的Helper,判断v1是否等于v2
    Handlebars.registerHelper("compare",function(v1,v2,options){
        if(v1 == v2){
            //满足添加继续执行
            return options.fn(this);
        }else {
            //不满足条件执行{{else}}部分
            return options.inverse(this);
        }
    });
    var nodes = myTemplate(data);
    // 追加到列表
    $(nodes).appendTo(thisProxy.selector);
};

/**
 * 删除机场列表
 *
 * opt 机场列表参数
 *
 * */

AirportSortable.prototype.deletePosition  = function (opt) {
    var thisProxy = this;
    // 是否有权限
    if(!$.isValidObject(userProperty.id_4430)){
        return;
    }
    // 若当前发生排序了
    if(thisProxy.sorted){
        var text = '排序有变更,请先保存排序后再删除机场';
        thisProxy.alertDialog(text)
    }else {
        // todo
        // 删除机场弹框
        thisProxy.deletePositionDialog(opt);
    }
};
/**
 * 删除机场列表确认框
 * opt 机场列表参数
 * */
AirportSortable.prototype.deletePositionDialog = function (opt) {
    var thisProxy = this;
    var options = {
        title : "删除机场",
        content : '<p class="modal-text">确定删除'+ opt.code +'机场吗？</p>',
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
 * 删除机场列表提交
 * opt 机场列表参数
 *  
 * */

AirportSortable.prototype.deletePositionSubmit = function (opt) {
    var thisProxy = this;
    var id = opt.id;
    $.ajax({
        url:DataUrl.AIRPORT_DEL,
        type: 'GET',
        dataType: 'json',
        traditional: true,
        data : {
            id : id,
        },
        success: function (data) {
            // 数据无效
            if (!data) {
                thisProxy.alertDialog('删除机场'+ opt.code+'失败');
                return;
            };
            // 成功
            if (data.status == 200) {
                thisProxy.deleteSinglePositin(opt);
                // 同步删除数据集合中对应数据
                delete thisProxy.data[id];
                // 刷新
                thisProxy.refresh();

                thisProxy.tipDialog('删除机场'+ opt.code+'成功')
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('删除机场'+ opt.code+'失败:'+data.error.message);
                }else {
                    thisProxy.alertDialog('删除机场'+ opt.code+'失败')
                }
            }else if(data.status == 202){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('删除机场'+ opt.code+'失败:' +data.error.message);
                }else {
                    thisProxy.alertDialog('删除机场'+ opt.code+'失败')
                }

            }else if(data.status == 203){ //  无权限
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('删除机场'+ opt.code+'失败:' +data.error.message);
                }else {
                    thisProxy.alertDialog('删除机场'+ opt.code+'失败');
                }
            }
        },
        error: function ( status, error) {
            thisProxy.alertDialog('删除机场'+ opt.code+'失败')
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};
/**
 * 删除机场列表节点
 * opt 机场列表参数
 * */

AirportSortable.prototype.deleteSinglePositin = function(opt){
    var thisProxy = this;
    var id = opt.id
    // 删除机场html节点
    $('.airport[data-id="'+ id+'"]',thisProxy.selector).remove();
};
/**
 *  修改机场列表
 *
 * */
AirportSortable.prototype.updatePosition  = function (opt) {

    var thisProxy = this;
    // 是否有权限
    if(!$.isValidObject(userProperty.id_4420)){
        return;
    }
    if(thisProxy.sorted){
        var text = '排序有变更,请先保存排序后再修改机场';
        thisProxy.alertDialog(text)
    }else {
        // todo
        // 修改机场表单弹框
        thisProxy.updatePositionDialog(opt);
    }
};
/**
 * 修改机场列表
 * opt 所选机场列表相关参数
 * */
AirportSortable.prototype.updatePositionDialog = function (opt) {
    var thisProxy = this;
    var id = opt.id;
    // 取相应数据
    var data = thisProxy.data[id];
    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#airport-form-template").html());
    var content = myTemplate(data);

    var options = {
        title : "修改机场",
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
                        thisProxy.updatePositionSubmit(data);
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
    thisProxy.initForm(data);
};
/**
 * 提交修改
 * */
AirportSortable.prototype.updatePositionSubmit = function (oldData) {
    var thisProxy = this;
    var newData = thisProxy.getSinglePositionData();
    $.ajax({
        url:DataUrl.AIRPORT_UPDATE,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data : newData,
        success: function (data) {

            // 数据无效
            if (!data) {
                thisProxy.alertDialog('修改机场'+ oldData.code+'失败');
                return;
            };
            // 成功
            if (data.status == 200) {
                //更新单个机场列表
                thisProxy.updateSinglePositin(data);
                // 刷新
                thisProxy.refresh();
                thisProxy.tipDialog('修改机场'+oldData.code+'成功');
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('修改机场'+ oldData.code+'失败:'+data.error.message);
                }else {
                    thisProxy.alertDialog('修改机场'+ oldData.code+'失败')
                }
            }else if(data.status == 202){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('修改机场'+ oldData.code+'失败:' +data.error.message);
                }else {
                    thisProxy.alertDialog('修改机场'+ oldData.code+'失败')
                }

            }else if(data.status == 203){ // 无权限
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    thisProxy.alertDialog('修改机场'+ oldData.code+'失败:' +data.error.message);
                }else {
                    thisProxy.alertDialog('修改机场'+ oldData.code+'失败')
                }
            }
        },
        error: function ( status, error) {
            thisProxy.alertDialog('修改机场'+ oldData.code+'失败')
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};
/**
 * 更新单个机场列表
 *
 * */
AirportSortable.prototype.updateSinglePositin = function(datas){
    var thisProxy = this;
    // 追加新机场html节点
   var airport = thisProxy.converData(datas);
    // 封装数据
    var data = {
        code : userProperty, // 用户权限
        airports : airport
    };

    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#airport-template").html());
    // 注册一个比较是否相等的Helper,判断v1是否等于v2
    Handlebars.registerHelper("compare",function(v1,v2,options){
        if(v1 == v2){
            //满足添加继续执行
            return options.fn(this);
        }else {
            //不满足条件执行{{else}}部分
            return options.inverse(this);
        }
    });
    var nodes = myTemplate(data);
    var oldNodes = $('.airport[data-id="'+ airport[0].id+'"]',thisProxy.selector);
    // 追加到列表
    $(nodes).insertBefore(oldNodes);

    // 删除旧机场html节点
    oldNodes.remove();
};

/**
 * 禁用弹框关闭
 * */
AirportSortable.prototype.disabledCloseDialog = function (dialog,btn) {
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
AirportSortable.prototype.enabledCloseDialog = function () {
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
AirportSortable.prototype.alertDialog = function (text) {
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
AirportSortable.prototype.tipDialog = function (text) {
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
AirportSortable.prototype.refresh = function (text) {
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
 * data 当前操作的机场数据
 *
 * */
AirportSortable.prototype.initForm = function (data) {
    var thisProxy = this;
    var $form = $('#bootstrap-modal-dialog #form-airport');
    // 校验初始化
    thisProxy.initValidator($form);
    // 多值输入初始化
    thisProxy.initManifest($form);
    // 填充类型列表
    thisProxy.setTypeList(app.airportType);
    // 设置选中项
    thisProxy.setSelected(data);
    // 绑定列表切换事件
    thisProxy.changeSelected();
}

/**
 * 表单校验初始化
 * $form 表单jQ对象
 * */
AirportSortable.prototype.initValidator = function ($form) {
    var thisProxy = this;
    $form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            'airport-code': {// 机场四字码
                validators: {
                    word4: {}
                }
            },
            'airport-name': {// 机场名称
                validators: {
                    notEmpty: {}
                }
            },
            'airport-place': {// 区域
                validators: {
                    notEmpty: {}
                }
            },
        }
    })
}
/**
 * 多值输入初始化
 * $form 表单jQ对象
 *
 * */

AirportSortable.prototype.initManifest = function ($form) {
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
AirportSortable.prototype.isValid = function () {
    var thisProxy = this;
    var $form = $('#bootstrap-modal-dialog #form-airport');
    // 全局校验
    $form.bootstrapValidator("validate");
    var valid = $form.data('bootstrapValidator').isValid();
    return valid;
}
/**
 * 获取单个表单数据
 *
 * */
AirportSortable.prototype.getSinglePositionData = function () {
    var thisProxy = this;
    var opt = {};
    var $from = $('#form-airport');
    var id = $from.attr('data-id');
    var code = $('.airport-code',$from).val().toUpperCase();
    var name = $('.airport-name',$from).val();
    var place = $('.airport-place',$from).val();
    var type = thisProxy.selectedTpye;
    if($.isValidVariable(id)){
        opt.id = id;
    }
    if(!$.isValidVariable(id)){
        opt.code = code;
    }else {
        opt.id = id;
    }
    opt.name = name;
    opt.place = place;
    opt.type = type;
    return opt;
};
/**
 * 填充类型下拉列表项
 *
 * */
AirportSortable.prototype.setTypeList = function (data) {
    // 当前对象this代理
    var thisProxy = this;
    // 获取列表容器
    var $menu = $('.type-list .dropdown-menu');
    // 创建一个空串
    var con = '';

    for(var i in data){
        var item = data[i];
        // 拼接html结构串
        var node = '<li><a href="javascript:;" class="type-item" ' + 'data-val="' + item.value + '"' + '>' + item.text + '</a></li>';
        // 追加串
        con += node;
    }

    // 清空列表容器并把新列表html串追加到列表容器
    $menu.empty().append(con);
};

/**
 * 填充类型下拉列表项
 *
 * */
AirportSortable.prototype.setSelected = function (data) {
    thisProxy = this;
    var type = '';
    if($.isValidObject(data)){
        type = data.type;
    }else {
        type = $('.type-list .dropdown-menu a.type-item:first').attr('data-val');
    }

    // 取得默认选中范围选项
    var $default = $('.type-list .dropdown-menu a[data-val="'+ type +'"]');

    // 取得范围按钮
    var $btn = $('.type-list .dropdown-toggle');
    // 取得默认选项的自定义属性data-val的值,用于记录范围标识码
    var val = $default.attr('data-val');
    // 取得默认选项的节点内容,用于更新到范围按钮
    var valCN = $default.html();
    // 更新范围按钮内容
    $btn.html( valCN +'<span class="caret"></span>');
    // 更新选中类型
    thisProxy.selectedTpye = val;
};

/**
 * 机场类型切换选择
 *
 * */
AirportSortable.prototype.changeSelected = function () {
    thisProxy = this;
    // 当前对象this代理
    var thisProxy = this;
    // 范围列表容器
    var $menu = $('.type-list .dropdown-menu');
    // 取得范围按钮
    var $btn = $('.type-list .dropdown-toggle');
    // 范围列表容器绑定点击事件(因为范围列表动态追加的，所有要用事件委托，把事件绑定在范围列表容器上)
    $menu.on('click','a.type-item',function (e) {
        // 取得当前点击目标源
        var $that = $(this);
        // 取当前点击选中的范围列表项的自定义属性data-val的值,用于记录范围标识码
        var val = $that.attr('data-val');
        // 取得当前点击选中的范围列表项的节点内容,用于更新到范围按钮
        var valCN = $that.html();
        // 更新范围按钮内容
        $btn.html( valCN +'<span class="caret"></span>');
        // 更新范围标识码
        thisProxy.selectedTpye= val;
    })

};

/**
 * 转换数据格式
 *
 *
 *
 * */
AirportSortable.prototype.converData = function (data) {
    //检测数据是否有效
    if (!$.isValidObject(data.airport)) {
        return;
    }
    // 机场数据
    var airports = data.airport;
    // 拷贝数据
    var result = JSON.parse(JSON.stringify(airports));
    // 机场类型参数集合
    var airportType = app.airportType;
    if ($.isValidVariable(result.type)) {
        var type = result.type;
        result.typeZh = airportType[type].text || ''; // 取对应text字段值
    }
    // 放入数组中
    var arr = [];
    arr.push(result);
    return arr;
};

