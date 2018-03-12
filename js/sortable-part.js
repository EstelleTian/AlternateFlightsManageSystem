/**
 * 拖动排序组件
 */
function SortablePart(params) {
    // 检查参数有效性
    if (!$.isValidObject(params)) {
        return;
    }
    //拖动排序元素 jQ对象
    this.selector = params.selector;
    // 保存按钮
    this.saveBtn = params.saveBtn;
    // 序号
    this.order = params.order;
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
    // 是否可编辑 默认为false
    this.isEdit  = false;
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
        disabled: true // 初始化设置为不可用
    }).disableSelection();
    // 记录初始化时的id顺序，即原始id集合
    thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 默认设置排序后的id集合与原始id集合一致
    thisProxy.sortedIds= thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 绑定事件
    thisProxy.initEvent();
};

SortablePart.prototype.initEvent = function () {
    var thisProxy = this;



    // 添加机位
    $('.add-position .position-header').on('click',function () {
        if(!thisProxy.isEdit){
            alert('请先开启编辑再新建机位');
        }else if(thisProxy.sorted){
            alert('排序有变更,请先保存排序后再新建机位');
        }else {
            // todo
            // 添加机位
            thisProxy.addPosition()
        }
    });

    // 删除/修改机位
    $(thisProxy.selector).on('click','.position .position-header',function (e) {
        var event = e || event;
        var $target = $(e.target);
        var opt = {
            id : $target.attr('pos-id'),
            key : $target.attr('pos-key')
        }

        // 删除机位
        if($target.hasClass('glyphicon-trash')){
            // todo
            thisProxy.deletePosition(opt);

        }else if($target.hasClass('glyphicon-edit')){ // 修改机位
            thisProxy.updatePosition(opt);
        }


    });


    /*$('.position-header .icon.glyphicon-edit',thisProxy.selector).on('click',function () {
        var $that = $(this);
        if(!thisProxy.isEdit){
            alert('请先开启编辑再修改');
        }else if(thisProxy.sorted){
            alert('排序有变更,请先保存排序后再修改');
        }else {
            // todo
            // 编辑机位
        }
    });
    $('.position-header .icon.glyphicon-trash',thisProxy.selector).on('click',function () {
        if(!thisProxy.isEdit){
            alert('请先开启编辑再删除');
        }else if(thisProxy.sorted){
            alert('排序有变更,请先保存排序后再删除');
        }else {
            // todo
            // 编辑机位
        }
    });
    $('.item .icon.glyphicon-edit',thisProxy.selector).on('click',function () {
        if(!thisProxy.isEdit){
            alert('请先开启编辑再修改');
        }else if(thisProxy.sorted){
            alert('排序有变更,请先保存排序后再修改');
        }else {
            // todo
            // 编辑机型
        }
    });
    $('.item .icon.glyphicon-trash',thisProxy.selector).on('click',function () {
        if(!thisProxy.isEdit){
            alert('请先开启编辑再删除');
        }else if(thisProxy.sorted){
            alert('排序有变更,请先保存排序后再删除');
        }else {
            // todo
            // 编辑机型
        }
    })*/
    //保存排序
    thisProxy.saveBtn.on('click',function () {
        if(thisProxy.isEdit && thisProxy.sorted){
            var text = "<p class='modal-text'>确定保存当前排序吗？</p>";
            thisProxy.confirmSaveSort(text);
        }
    })

};
SortablePart.prototype.enableEdit = function () {
    var thisProxy = this;
    thisProxy.selector.sortable('enable');
    thisProxy.isEdit = true;
};

SortablePart.prototype.disableEdit = function () {
    var thisProxy = this;
    if(thisProxy.sorted){
        // alert('排序有变更,是否保存当前排序？')
        var text = "<p class='modal-text'>排序有变更,是否保存当前排序？</p>";
        thisProxy.confirmSaveSort(text);
        thisProxy.selector.sortable('disable');
        thisProxy.isEdit = false;

    }else {
        thisProxy.selector.sortable('disable');
        thisProxy.isEdit = false;
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
        thisProxy.saveBtn.show().attr('disabled',false);
    }else {
        thisProxy.saveBtn.hide().attr('disabled',false);
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
    // 禁用保存按钮
    thisProxy.saveBtn.hide().attr('disabled',false);

};

SortablePart.prototype.confirmSaveSort =function(text){
    var thisProxy = this;
    var options = {
        title : "保存",
        content : text,
        status: 2,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            },{
                name : "还原",
                status :1 ,
                callback : function(){
                    thisProxy.revert();
                }
            },{
                name : "保存",
                status :1 ,
                // isHidden : false,
                callback : function(){
                    var btn = $(this);
                    thisProxy.saveSort(btn);
                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
};

SortablePart.prototype.saveSort = function (btn) {
    var thisProxy = this;
    // 禁用弹框关闭按钮
    // $('#bootstrap-modal-dialog .close').hide();
    // // 启用loading动画
    // var loading = Ladda.create(btn[0]);
    // loading.start();
    console.log(thisProxy.sortedIds);
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
                alert('提交排序失败')
            };
            // 成功
            if (data.status == 200) {

                alert('提交排序成功');
                // 更新原始id集合
                thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
                // 更新排序标识
                thisProxy.isSorted();
                // 更新保存按钮是否可用
                thisProxy.toggleButtonEnable();

            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    alert(data.error.message);
                }else {
                    alert('提交排序失败');
                }
            }
        },
        error: function ( status, error) {
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });

};

SortablePart.prototype.addPosition = function () {
    var thisProxy = this;
    thisProxy.addPositionDialog();
};

SortablePart.prototype.addPositionDialog = function () {
    var thisProxy = this;
    var options = {
        title : "新建机位",
        content : '<form class="position-form"  ><input class="position-name form-control"  placeholder="机位名称"><input class="item-name form-control" placeholder="机型名称"></form>',
        status: 2,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            },{
                name : "创建",
                status :1 ,
                // isHidden : false,
                callback : function(){
                    // var btn = $(this);
                    var key = $('.position-form .position-name').val();
                    var value = $('.position-form .item-name').val();
                    var text = value+'机位对应可停飞机';
                    var opt = {
                        key : key,
                        value : value,
                        text : text,
                    }
                    thisProxy.addPositionSubmit(opt);
                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
}

SortablePart.prototype.addPositionSubmit = function (opt) {
    var thisProxy = this;

    $.ajax({
        url:DataUrl.POSTION_ADD,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data : {
            key: opt.key,
            value : opt.value,
            text : opt.text
        },
        success: function (data) {

            // 数据无效
            if (!data) {
                alert('创建失败')
            };
            // 成功
            if (data.status == 200) {
                thisProxy.appendSinglePositin(data);
                alert('创建成功');
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    alert(data.error.message);
                }else {
                    alert('创建失败');
                }
            }
        },
        error: function ( status, error) {
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};

SortablePart.prototype.appendSinglePositin = function(data){
    var thisProxy = this;
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
    //
    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#single-position").html());
    var nodes = myTemplate(config);
    // 追加到列表
    $(nodes).insertBefore($('.locked'));

    // 更新原始id集合
    thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序后的id集合
    thisProxy.sortedIds= thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序标识
    thisProxy.isSorted();
    // 更新保存按钮是否可用
    thisProxy.toggleButtonEnable();
    // $('#position-box').html(myTemplate(config));
};

SortablePart.prototype.deletePosition  = function (opt) {

    var thisProxy = this;
    if(!thisProxy.isEdit){
        alert('请先开启编辑再删除机位');
    }else if(thisProxy.sorted){
        alert('排序有变更,请先保存排序后再删除机位');
    }else {
        // todo
        // 删除机位弹框
        thisProxy.deletePositionDialog(opt);
    }
};
SortablePart.prototype.deletePositionDialog = function (opt) {
    var thisProxy = this;
    var options = {
        title : "删除机位",
        content : '<p class="modal-text">确定删除'+ opt.key +'机位吗？</p>',
        status: 3,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            },{
                name : "删除",
                status :3 ,
                // isHidden : false,
                callback : function(){
                    // var btn = $(this);
                    thisProxy.deletePositionSubmit(opt);
                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
};

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
                alert('删除机位'+ opt.key+'失败')
            };
            // 成功
            if (data.status == 200) {
                thisProxy.deleteSinglePositin(opt);
                alert('删除机位'+ opt.key+'成功');
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    alert('删除机位'+ opt.key+'失败:'+data.error.message);
                }else {
                    alert('删除机位'+ opt.key+'失败');
                }
            }else if(data.status == 202){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    alert('删除机位'+ opt.key+'失败:' +data.error.message);
                }else {
                    alert('删除机位'+ opt.key+'失败');
                }

            }
        },
        error: function ( status, error) {
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};
SortablePart.prototype.deleteSinglePositin = function(opt){
    var thisProxy = this;
    // 删除机位html节点
    $('.position[data-id="'+ opt.id+'"]',thisProxy.selector).remove();

    // 更新原始id集合
    thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序后的id集合
    thisProxy.sortedIds= thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序标识
    thisProxy.isSorted();
    // 更新保存按钮是否可用
    thisProxy.toggleButtonEnable();
    // $('#position-box').html(myTemplate(config));
};

SortablePart.prototype.updatePosition  = function (opt) {

    var thisProxy = this;
    if(!thisProxy.isEdit){
        alert('请先开启编辑再修改机位');
    }else if(thisProxy.sorted){
        alert('排序有变更,请先保存排序后再修改机位');
    }else {
        // todo
        // 修改机位弹框
        thisProxy.updatePositionDialog(opt);
    }
};
SortablePart.prototype.updatePositionDialog = function (opt) {
    var thisProxy = this;
    var options = {
        title : "修改机位",
        content : '<form class="position-form"  ><input class="position-name form-control"  placeholder="机位名称" value="'+ opt.key+'"></form>',
        status: 1,// 1:正常 2:警告 3:危险 不填:默认情况
        width : 400,
        mtop: 200,
        showCancelBtn: false,
        buttons: [
            {
                name : "取消",
                status :-1 ,
                callback : function(){

                }
            },{
                name : "修改",
                status :1 ,
                // isHidden : false,
                callback : function(){
                    // var btn = $(this);
                    var id = opt.id;
                    var key = $('.position-form .position-name').val();
                    var $item = $('.position[data-id="'+ id+'"]',thisProxy.selector);
                    var text = $item.attr('data-text');
                    var value = [];
                    $('.item',$item).each(function (item) {
                        value.push($.trim($(this).text()));
                    });
                    console.log(value);
                    var params = {
                        id : id,
                        key : key,
                        text : text,
                        value : value.join(',')
                    }

                    thisProxy.updatePositionSubmit(params);
                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(options);
};
SortablePart.prototype.updatePositionSubmit = function (opt) {
    var thisProxy = this;

    $.ajax({
        url:DataUrl.POSTION_UPDATE,
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data : opt,
        success: function (data) {

            // 数据无效
            if (!data) {
                alert('修改机位'+ opt.key+'失败')
            };
            // 成功
            if (data.status == 200) {
                thisProxy.updateSinglePositin(data);
                alert('修改机位'+ opt.key+'成功');
            }else if(data.status == 500){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    alert('修改机位'+ opt.key+'失败:'+data.error.message);
                }else {
                    alert('修改机位'+ opt.key+'失败');
                }
            }else if(data.status == 202){
                if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                    alert('修改机位'+ opt.key+'失败:' +data.error.message);
                }else {
                    alert('修改机位'+ opt.key+'失败');
                }

            }
        },
        error: function ( status, error) {
            console.error('ajax requset  fail, error:');
            console.error(error);
        }
    });
};
SortablePart.prototype.updateSinglePositin = function(data){
    var thisProxy = this;
    // 追加新机位html节点
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
    //
    // 利用Handlebars模版生成对应HTML结构
    var myTemplate = Handlebars.compile($("#single-position").html());
    var nodes = myTemplate(config);
    var oldNodes = $('.position[data-id="'+ config[0].id+'"]',thisProxy.selector);
    // 追加到列表
    $(nodes).insertBefore(oldNodes);

    // 删除旧机位html节点
    oldNodes.remove();

    // 更新原始id集合
    thisProxy.ids = thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序后的id集合
    thisProxy.sortedIds= thisProxy.selector.sortable('toArray',{attribute :'data-id'});
    // 更新排序标识
    thisProxy.isSorted();
    // 更新保存按钮是否可用
    thisProxy.toggleButtonEnable();
    // $('#position-box').html(myTemplate(config));
};