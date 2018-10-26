
/**
 * 备降机场管理模块
 *
 *
 *
 * */
var airportModule = function () {

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
        $('.airport-module .alert').html('').removeClass('alert-danger active');
        //ajax请求获取数据
        xhr = $.ajax({
            url: DataUrl.AIRPORT_LIST,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // 数据无效
                if (!data) {
                    // 显示提示信息
                    $('.airport-module .alert').html('暂无数据').addClass('alert-danger active');
                    return;
                }
                ;
                // 成功
                if (data.status == 200) {
                    // 更新数据生成时间
                    if ($.isValidVariable(data.generateTime)) {
                        var time = '数据生成时间: ' + Common.formatterTime(data.generateTime);
                        $('.airport-module .time').text(time)
                    }


                    // 绘制出机场列表
                    drawList(data);
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
     * 绘制出机场列表
     * */
    var drawList = function (dataset) {
        //检测数据是否有效
        if(!$.isValidObject(dataset.airports)) {
            return;
        }
        //取得机场数据
        var  airports = dataset.airports;

        // 封装数据
        var data = {
            code : userProperty, // 用户权限
            airports : airports
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

        $('#airport-box').html(myTemplate(data));
    };

    /**
     * 绑定拖动排序
     * */
    var bindSortable = function (dataset) {

        //检测数据是否有效
        if(!$.isValidObject(dataset.airports)) {
            return;
        }
        //取得机场数据
        var  airports = dataset.airports;

        // 配置初始化参数
        var sort = new AirportSortable({
            data : airports,
            selector : $('#airport-box'),
            addBtn : $('.airport-module .add-btn'),
            revertBtn : $('.airport-module .revert-btn'),
            saveBtn : $('.airport-module .save-btn'),
            items:"> li.airport",
            handle:  ".airport-header", //限制排序开始点击指定的元素
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