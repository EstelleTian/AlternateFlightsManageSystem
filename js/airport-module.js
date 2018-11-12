
/**
 * 备降机场管理模块
 *
 *
 *
 * */
var airportModule = function () {

    var xhr = null;
    // 类型
    var type = '';

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
     * 初始化类型列表
     *
     * */
    var initTypeList = function (data) {

        var form  = $('.airport-module .form-panel');

        // 获取列表容器
        var $menu = $('.form-item .dropdown-menu', form);
        // 创建一个空串
        var con = '';
        con += '<li><a href="javascript:;" class="type-item"  data-val="0" >全部</a></li>';
        data.map(function (item, index, arr) {
            // 拼接html结构串
            var node = '<li><a href="javascript:;" class="type-item" '+ 'data-val="'+ item.value + '"' + '>' + item.text +'</a></li>';
            // 追加串
            con += node;
        });
        // 清空列表容器并把新列表html串追加到列表容器
        $menu.empty().append(con);
        // 设置默认选中项
        setDefaultType();

        // 绑定类型切换事件
        changeType();
    };

    /**
     * 设置默认选类型
     * */
    var setDefaultType = function () {
        //
        var form  = $('.airport-module .form-panel');
        // 取得范围列表项自定义居属性值为1的项
        var $default = $('.form-item .dropdown-menu a[data-val="0"]', form);
        // 取得范围按钮
        var $btn = $('.form-item .dropdown-toggle', form);
        // 取得默认选项的自定义属性data-val的值,用于记录范围标识码
        var val = $default.attr('data-val');
        // 取得默认选项的节点内容,用于更新到范围按钮
        var valCN = $default.html();
        // 更新范围按钮内容
        $btn.html( valCN +'<span class="caret"></span>');
        // 更新范围标识码
        type = val;
    };

    /**
     *  绑定类型切换事件
     * */
    var changeType = function () {
        //
        var form  = $('.airport-module .form-panel');
        // 获取列表容器
        var $menu = $('.form-item .dropdown-menu', form);
        // 取得范围按钮
        var $btn = $('.form-item .dropdown-toggle', form);

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
            type = val;
            openRequest();
        });
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
            data: {
                type: type // 类型码
            },
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

                    //转换数据
                    var dataset = converData(data);
                    // 绘制出机场列表
                    drawList(dataset);
                    // 绑定拖动排序
                    bindSortable(dataset);
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

    var converData = function (data) {
        //检测数据是否有效
        if(!$.isValidObject(data.airports)) {
            return;
        }
        // 机场数据
        var airports = data.airports;
        // 拷贝数据
        var result = JSON.parse(JSON.stringify(airports));
        var len = result.length;
        // 机场类型参数集合
        var airportType = app.airportType;

        for(var j=0; j<len; j++) {
            var airport = result[j];
            var type = airport.type;
            if($.isValidObject(airportType[type])){
                result[j].typeZh = airportType[type].text || ''; // 取对应text字段值
            }
        }


        return result;
    };

    /**
     * 绘制出机场列表
     * */
    var drawList = function (dataset) {
        //检测数据是否有效
        if(!$.isValidObject(dataset)) {
            return;
        }

        // 封装数据
        var data = {
            code : userProperty, // 用户权限
            airports : dataset
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

        //检测机场数据是否有效
        if(!$.isValidObject(dataset)) {
            return;
        }

        var datas = {};
        var len = dataset.length;
        for(var i=0; i<len; i++){
            var d = dataset[i];
            var id = d.id;
            datas[id] = d;
        }

        // 配置初始化参数
        var sort = new AirportSortable({
            data : datas,
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
                setActive : setActive,
                initTypeList : initTypeList,
            }
        }
    }

}();