

var positionConfig = function () {

    var xhr = null;

    /**
     *  设置当前模块为活动模块
     *  bool true 设置为活动模块 fale 取消当前模块为活动模块
     *
     * */
    var setActive = function (bool) {
        if(bool){
            // 开启请求
            openRequest(true);
        }else {
            // 中止请求
            abortRequest();
        }
    };

    /**
     * 开启请求
     * */
    var openRequest = function () {
        // 清除提示信息
        $('.position-module .alert').html('').removeClass('alert-danger active');
        //ajax请求获取数据
        xhr = $.ajax({
            url: DataUrl.POSTION_LIST,
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                // 数据无效
                if (!data) {
                    // 显示提示信息
                    $('.position-module .alert').html('暂无数据').addClass('alert-danger active');
                    return;
                }
                ;
                // 成功
                if (data.status == 200) {
                    // 更新数据生成时间
                    if ($.isValidVariable(data.generateTime)) {
                        var time = '数据生成时间: ' + Common.formatterTime(data.generateTime);
                        $('.position-module .time').text(time)
                    }

                    // 绘制出机位列表
                    drawPostion(data);
                    // 绑定拖动排序
                    bindSortable(data);
                }
            },
            error: function (status, error) {
                console.error('ajax requset  fail, error:');
                console.error(error);
            }
        });
    };

    /**
     *
     * 中止请求
     * */
    var abortRequest = function () {
        if(xhr){
            // 取消掉已经发出的ajax请求
            xhr.abort();
            xhr = null;
        }
    };

    /**
     * 绘制出机位列表
     * */
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
        // 封装数据
        var data = {
            code : userProperty, // 用户权限
            config : config
        };
        // 利用Handlebars模版生成对应HTML结构
        var myTemplate = Handlebars.compile($("#template").html());
        $('#position-box').html(myTemplate(data));
    };

    /**
     * 绑定拖动排序
     * */
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
        });
        //初始化
        sort.init();
        // 权限校验:无权限则不可拖动
        if(!$.isValidObject(userProperty.id_4440)){
            sort.selector.sortable( "disable" );
        }
    };


    // 暴露方法
    return {
        init : function () {
            return {
                setActive : setActive
            }
        }
    }

}();