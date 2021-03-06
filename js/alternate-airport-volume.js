/**
 * Created by caowei on 2018/1/16.
 */
var alternateAirport = function () {
    var xhr = null;
    //备降场表格对象
    var airVolumeTable = '';
    //备降场表格原始数据
    var tableData = '';
    //备降场表格列配置
    // var dataColConfig = '';
    //表格配置源数据
    var originAirportConfig = '';
    //备降场表格配置
    var tableConfig = {
        colName: ['备降场 ', '合计可用 '],
        colTitle: {
            airport: '备降场 ',
            total: '合计可用 ',
        },
        colModel: [{
            name: 'airport',
            index: 'airport',
        }, {
            name: 'total',
            index: 'total',
        }],
        data: [],
        typeArr: []
    }
    //定时器总开关
    var isRefresh = true;
    // 定时器
    var timer = null;

    //当前选中单元格对象
    var cellObj = '';
    //定时刷新时间
    var refreshTime = 1000 * 30;
    //机场分类
    var airportType = 0;
    //是否开启修改容量
    var isOpenChangeCapacity = false;
    //初始化机场分类
    var initConpoments = function () {
        // 表格绑定清除右键协调操作
        $('.alter_volume').on('click', function (event) {
            if ($('.flight-grid-table-collaborate-container').is(':visible')) {
                clearCollaborateContainer()
            }
        })
        //开启修改容量模式点击事件绑定
        if($.isValidObject(userProperty.id_4340)){
            $('.capacity-model-option').find('.change-capacity-label').html(userProperty.id_4340.name);
        }else{
            if($.isValidObject(userProperty.id_4340)) {
                setTimeout(function () {
                    $('.capacity-model-option').find('.change-capacity-label').html(userProperty.id_4340.name);
                },500)
            }
        }
        $('.capacity-model-option').off('click').on('click',function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isCheck = $('.capacity-model-option').find('input').prop("checked");
            changeCapacityModelDialog(!isCheck)
        })
    }
    var initCapacityTypeConpoments = function (apType) {
        //获取容量分类container
        var $menu = $('.sub_title').find('.dropdown-menu');
        // 创建一个空串
        var con = '<li><a href="javascript:;" class="scope-item" '+ 'data-val="0"' + '>全部</a></li>';
        $.each(apType,function (key,value) {
            var node = '<li><a href="javascript:;" class="scope-item" '+ 'data-val="'+ value.value + '"' + '>' + value.text +'</a></li>';
            // 追加串
            con += node;
        })
        // 清空列表容器并把新列表html串追加到列表容器
        $menu.empty().append(con);
        var $btn = $('.sub_title').find('.dropdown-toggle')
        //绑定点击事件
        $menu.on('click','a.scope-item',function (e) {
            // 取得当前点击目标源
            var $that = $(this);
            // 取当前点击选中的范围列表项的自定义属性data-val的值,用于记录范围标识码
            var val = $that.attr('data-val');
            // 取得当前点击选中的范围列表项的节点内容,用于更新到范围按钮
            var valCN = $that.html();
            // 更新范围按钮内容
            $btn.html( valCN +'<span class="caret"></span>');
            // 更新机场类别
            airportType = val;
            //重新获取数据
            getTableData()
        })
    }
    /**
     * 切换修改模式提示
     * @param status 容量修改模式状态 true:开启  false:关闭
     *
     * */
    var changeCapacityModelDialog = function (status) {

        var title = status ? '开启机位容量维护' : '关闭机位容量维护';
        var options = {
            title : title,
            content : '<p class="modal-text">确定'+title+'?</p>',
            status: 1,// 1:正常 2:警告 3:危险 不填:默认情况
            width : 400,
            mtop: 200,
            showCancelBtn: false,
            buttons: [
                {
                    name : "确认",
                    status :1 ,
                    isHidden : false,
                    callback : function(){
                        var btn = this;
                        // 切换容量修改模式开启/关闭
                        getChangeCapacityAuthority(status,btn);
                    }
                },{
                    name : "取消",
                    status :-1 ,
                    callback : function(){ }
                }
            ]
        };
        BootstrapDialogFactory.dialog(options);
    };
    /**
     *设置表格下方文本
     * @param textObj
     */
    var setDownText = function (textObj) {
        $('.position-air').empty();
        $.each(textObj.postionCategoryAirtype, function (i, e) {
            var str = '<p><span class="total_count">' + e.text + '：</span><span>' + e.value + '</span></p>';
            str = $(str);
            $('.position-air').append(str[0]);
        })
    }

    /**
     * 获取表格数据
     * @param tableConfig
     * @param isRefresh
     */
    var getTableData = function (isRefresh) {
        // 开启定时器总开关
        var url = ipHost + 'airport/retrieveAirport?type='+ airportType;
        xhr = $.ajax({
            type: "GET",
            url: url,
            data: "",
            dataType: "JSON",
            // async: false,
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {
                    // 配置不同重新渲染表格
                    //卸载表格
                    $.jgrid.gridUnload('alernate_flight_grid_table');
                    //重置表格配置
                    tableConfig = {
                        colName: ['备降场 ', '合计可用 '],
                        colTitle: {
                            airport: '备降场 ',
                            total: '合计可用 ',
                        },
                        colModel: [{
                            name: 'airport',
                            index: 'airport',
                        }, {
                            name: 'total',
                            index: 'total',
                        }],
                        data: [],
                        typeArr: []
                    }
                    //复制配置数据
                    originAirportConfig = data;
                    //是否开启机位容量维护
                    isOpenChangeCapacity = data.capacityJurisdiction;
                    //初始化机位容量
                    $('.capacity-model-option').find('input').prop("checked",isOpenChangeCapacity);
                    //列配置转换
                    tableConfig = colConfigConvert(originAirportConfig.airportConfig)
                    if ($.isValidObject(originAirportConfig.airportConfig)) {
                        //表格下部分文字显示
                        $('.des').show()
                        //表格下部文字设置
                        setDownText(originAirportConfig.airportConfig)
                    } else {
                        //表格下部文字隐藏
                        $('.des').hide()
                    }
                    //获取表格数据
                    if (tableConfig.colModel.length > 3) {
                        $('.error_tip').hide();
                        tableData = data;
                        var generateTime = data.generateTime
                        $('.alter_volume_time').text('数据生成时间: ' + formatterTime(generateTime))
                        //合计可用
                        $('.available_capacity').text(data.availableCapacity).attr('title', data.availableCapacity)
                        //data转换
                        tableConfig = dataConfigConvert(data.airportMessage, tableConfig)
                        // 初始化表格
                        if (tableConfig.colModel.length > 3) {
                            initGridTable(tableConfig, 'alernate_flight_grid_table', 'ale-datas-pager')
                        }
                        //当右键协调显示时  刷新当前选中单元格 以及position方法
                        if ($.isValidObject(cellObj) && $('.flight-grid-table-collaborate-container').is(':visible')) {
                            var currnetCellObj = getCellObject(cellObj.rowid, cellObj.iRow, cellObj.iCol)
                            currnetCellObj.addClass('selected-cell');
                            $('.flight-grid-table-collaborate-container').position({
                                of: currnetCellObj,
                                my: 'left top',
                                at: 'right top',
                                collision: 'flipfit',
                            });
                            followTargetPosition($('.flight-grid-table-collaborate-container'), currnetCellObj)
                        }
                        //定时器
                        if (isRefresh) {
                            startTimer(getTableData, isRefresh, refreshTime);
                        }
                    }

                } else if (data.status == 500) {
                    console.warn(data.error.message)
                }
            },
            error: function (xhr, status, error) {
                $('.error_tip').show();
                $('.error_tip').text('访问接口失败，请等待.....');
                setTimeout(getTableData(false), 1000 * 30 * 5);
                console.warn(error)
            }
        });
    }
    /**
     * 校准数据
     */
    var correctData = function () {
        //校验码
        if ($.isValidObject(userProperty.id_4320)) {
            $('.correct').show();
            $('.correct').find('.ladda-label').html(userProperty.id_4320.name)
        }
        //绑定点击事件
        $('.correct').on('click', function () {
            //提示信息显示
            if ($('.error_tip').is(":visible")) {
                $('.error_tip').hide();
            }
            //加载动画
            var correctLoading = Ladda.create($('.correct')[0]);
            correctLoading.start();
            var url = ipHost + 'airport/checkPositionCapacity';
            //在次验证校验码
            if ($.isValidObject(userProperty.id_4320)) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: "",
                    dataType: "JSON",
                    success: function (data) {
                        if ($.isValidObject(data) && data.status == 200) {
                            correctLoading.stop();
                            getTableData(false);
                        } else if (data.status == 500) {
                            correctLoading.stop();
                            $('.error_tip').show();
                            $('.error_tip').html(data.error.message);
                            console.warn(data.error.message)
                        }
                    },
                    error: function (xhr, status, error) {
                        $('.error_tip').show();
                        correctLoading.stop();
                        setTimeout(getTableData(false), 1000 * 30 * 5);
                        console.warn(error)
                    }
                });
            } else {
                correctLoading.stop();
            }
        })
    }
    /**
     * 修改机场容量qtip提示
     * @param opt
     * @param state
     * @param message
     */
    var showQtip = function (opt, state, message) {
        var styleClasses = 'qtip-green';
        var tipMesssage = ' '
        if (state) {
            styleClasses = 'qtip-green-custom qtip-rounded';
            tipMesssage = '修改成功'
        } else {
            tipMesssage = message;
            styleClasses = 'qtip-red-custom qtip-rounded';
        }
        opt.cellObj.qtip({
            content: {
                text: tipMesssage,
            },
            position: {
                my: 'bottom center', // 同jQueryUI Position
                at: 'top center',
                collision: 'flipfit flipfit',
                viewport: true, // 显示区域
                container: opt.positionContainer,
                adjust: {
                    resize: true,
                    scroll: true,
                    method: 'flip flip'
                },
            },
            style: {
                classes: styleClasses
            },
            // 显示配置
            show: {
                delay: 0,
                target: opt.cellObj,
                ready: true, // 初始化完成后马上显示
                effect: function () {
                    $(this).fadeIn(); // 显示动画
                }
            },
            // 隐藏配置
            hide: {
                target: opt.positionContainer, // 触发下面event的元素
                event: 'unfocus  click', // 失去焦点时隐藏
                effect: function () {
                    $(this).fadeOut(); // 隐藏动画
                },
            },
            events: {
                hide: function (event, api) {
                    api.destroy(true); // 销毁提示信息
                }
            }
        })
    }
    /**
     * 阻止右键点击默认事件
     */
    var preventDefaultEvent = function () {
        var canvas = $('.alter_volume');
        // 绑定Canvas事件，屏蔽表格区域内浏览器右键菜单
        canvas.bind('mouseenter', function () {
            document.oncontextmenu = function () {
                return false;
            };
        }).bind('mouseleave', function () {
            document.oncontextmenu = function () {
                return false;
            };
        }).bind('mouseover', function () {
            document.oncontextmenu = function () {
                return false;
            };
        });
    };

    /**
     *@method initGridTable 初始化页面主表
     * @param config 对应表格配置
     * @param tableId 表格的tableId
     * @param pagerId 表格统计条数的pagerId
     */
    var initGridTable = function (config, tableId, pagerId) {
        airVolumeTable = new GridTable({
            canvasId: "alernate_gird_container",
            tableId: tableId,
            pagerId: pagerId,
            colNames: config.colName,
            colModel: config.colModel,
            cmTemplate: {
                align: 'center',
                resize: false,
                cellattr: setTableColor,
                width: 120,
                sortfunc: sortNum
            },
            colTitle: config.colTitle,
            params: {
                shrinkToFit: true,
                showQuickFilter: false,
                pagerId: pagerId,
                onRightClickRow: function (rowid, iRow, iCol, e) {
                    var colName = airVolumeTable.colModel[iCol - 1].name;
                    // 当前行数据
                    var rowData = airVolumeTable.tableData[ rowid - 1 ];
                    var currentVal = rowData[colName];
                    //修改容量
                    if (colName.indexOf('total') > 0 ) {
                        // 获取触发事件的单元格对象
                        var type = colName.split('total');
                        var opt = {
                            rowid: rowid,
                            iRow: iRow,
                            iCol: iCol,
                            tableId: tableId,
                            airport: rowData.airport,
                            type: type[0],
                            cellObj: $(e.target),
                            currentVal: currentVal,
                            positionContainer: $(".table-contianer .ui-jqgrid-bdiv")
                        }
                        cellObj = opt;
                        volumeOnRightClickRow(opt)
                    }
                    //协调记录
                    if (colName == 'airport') {
                        var opt = {
                            rowid: rowid,
                            iRow: iRow,
                            iCol: iCol,
                            tableId: tableId,
                            airport: rowData.airport,
                            type: 'flightId',
                            cellObj: $(e.target),
                            currentVal: currentVal,
                            positionContainer: $(".table-contianer .ui-jqgrid-bdiv")
                        }
                        cellObj = opt;
                        flightOnRightClickRow(opt)
                    }
                }
            }
        })
        airVolumeTable.initGridTableObject();
        //数据填充
        airVolumeTable.tableData = config.data,
        airVolumeTable.drawGridTableData();
        airVolumeTable.resizeToFitContainer();
    };

    $(window).resize(function () {
        if ($('.alter_volume').is(':visible')) {
            if ($.isValidObject(airVolumeTable)) {
                airVolumeTable.resizeToFitContainer();
            }
        }
    })
    /**
     * 表格配置以及参数数据转换
     * @param dataObj
     * @param config
     * @returns {*}
     */
    var dataConfigConvert = function (dataObj, config) {
        config.data = [];
        //多条颜色数据转换
        if ($.isArray(dataObj)) {
            //data数据填充
            $.each(dataObj, function (i, e) {
                var obj = {};
                obj['airport'] = e.airport;
                obj['airport_title'] = e.airport + '-' + e.text;
                obj['total'] = e.available;
                obj['remark'] = e.remark;
                $.each(e.positionCapInfo, function (index, ele) {
                    $.each(config.typeArr, function (j, m) {
                        if (m == ele.positionType) {
                            obj[m + 'total'] = ele.capacity;
                            obj[m + 'total_style'] = 'background:#badcad;color:#000';
                            obj[m + 'available'] = ele.available;
                            obj[m + 'occupy'] = ele.occupy;
                        }
                    })


                })
                config.data.push(obj);
            })
        } else {
            // 单条数据转换
            var obj = {};
            obj['airport'] = e.airport;
            obj['total'] = dataObj.available;
            obj['remark'] = dataObj.remark;
            $.each(dataObj.positionCapInfo, function (index, ele) {
                $.each(config.typeArr, function (j, m) {
                    if (m == ele.positionType) {
                        obj[m + 'total'] = ele.capacity;
                        obj[m + 'total_style'] = 'background:#badcad;color:#000';
                        obj[m + 'available'] = ele.available;
                        obj[m + 'occupy'] = ele.occupy;
                    }
                })
            })
            config.data.push(obj);
        }
        // 表格样式转化
        $.each(config.data, function (i, e) {
            if (parseInt(e.total) > 3) {
                // e['total_style'] = 'background:#fff;color:#000'
            } else if (parseInt(e.total) <= 3 && parseInt(config.data.total) != 0) {
                e['total_style'] = 'background:#ee7948;color:#fff'
            } else if (parseInt(e.total) == 0) {
                // e['total_style'] = 'background:#ee7948;color:#000'
            }
            // e['C2total_style'] = 'background:#dff0d8;color:#000'
            // e['C1total_style'] = 'background:#dff0d8;color:#000'
            // e['DEavailable_style'] = 'background:#dff0d8;color:#000'
        })
        return config;
    }
    /**
     * 表格列配置转换
     * @param colObj
     * @param config
     */
    var colConfigConvert = function (colObj) {
        var config = {
            colName: ['备降场 ', '合计可用 '],
            colTitle: {
                airport: '备降场 ',
                total: '合计可用 ',
            },
            colModel: [{
                name: 'airport',
                index: 'airport',
            }, {
                name: 'total',
                index: 'total',
            }],
            data: [],
            typeArr: []
        }
        //colModel,colTitle,colName 转换
        $.each(colObj.postionCap, function (index, ele) {
            var obj = {};
            var titleObj = {};
            obj['index'] = ele.key;
            obj['name'] = ele.key;
            config.colModel.push(obj);
            config.typeArr.push(ele.value);
            config.colTitle[ele.key] = ele.text;
            config.colName.push(ele.text);
        })
        var remark = {
            index: 'remark',
            name: 'remark',
        };
        config.colModel.push(remark);
        config.colTitle['remark'] = '机位备注';
        config.colName.push('机位备注');
        return config;
    }

    /**
     *表格容量右键协调操作
     * @param opt
     */
    var volumeOnRightClickRow = function (opt) {
        // 清除协调窗口
        clearCollaborateContainer();
        // 记录当前选中的单元格对象
        opt.cellObj.addClass('selected-cell');
        // 是否有权限
        if (!$.isValidObject(userProperty.id_4310)) {
            return
        }
        //是否开启容量修改
        if(!isOpenChangeCapacity){
            return
        }
        //修改容量值
        if ($('.alter_volume').is(":visible")) {
            collaborateAlter(opt);
        }
    };
    /**
     * 表格航班右键右键协调记录
     * @param opt
     */
    var flightOnRightClickRow = function (opt) {
// 清除协调窗口
        clearCollaborateContainer();
        // 记录当前选中的单元格对象
        opt.cellObj.addClass('selected-cell');
        // 是否有权限
        if (!$.isValidObject(userProperty.id_4330)) {
            return
        }
        //查看协调记录
        if ($('.alter_volume').is(":visible")) {
            addRecordeDom(opt);
        }

    }
    /**
     *添加右键协调操作DOM
     * @param opt
     */
    var collaborateAlter = function (opt) {
        // 获取协调DOM元素
        var dom = GridTableCollaborateDom.CAPACITY;
        if (!$.isValidVariable(dom)) {
            return;
        }

        //验证用户权限，如果是分支机场，只能修改自己的
        if ($.isValidObject(userProperty.id_4310)) {
            // 是否为支线机场用户 true:支线用户  false:不是支线用户
            var useBranch = userProperty.useBranch;
            //true 分支机场  false 总机场（全显）
            if (useBranch == true) {
                var userAirport = userProperty.airport;
                var curAirport = opt.airport;
                //若不想的
                if (userAirport != curAirport) {
                    return;
                }
            }
            var collaboratorDom = $(dom);
            //表单验证绑定
            var form = collaboratorDom.find('form');
            form.find('input').val(opt.currentVal);
            form.bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    flightId: {
                        validators: {
                            notEmpty: {},
                            onlyNumber: {},
                            hunEffectiveNumber: {},
                        }
                    }
                }
            });
            $('#gbox_' + opt.tableId).append(collaboratorDom);
            $('.alter_volume .flight-grid-table-collaborate-container').on('click', function (e) {
                e.stopPropagation();
            })
            $('#flightId').focus().select()
            // 定位协调DOM
            collaboratorDom.position({
                of: opt.cellObj,
                my: 'left top',
                at: 'right top',
                collision: 'flipfit',
            });
            followTargetPosition(collaboratorDom, opt.cellObj)
            $('#modificate_volume').on('click', function () {
                //获取验证结果
                var bootstrapValidator = form.data('bootstrapValidator');
                var capacity = form.find('#flightId').val();
                //手动再次触发验证
                bootstrapValidator.validate();
                if (bootstrapValidator.isValid()) {
                    getNewVolume(capacity, opt)
                }
            })
            $('#cancale').on('click', function () {
                clearCollaborateContainer();
            })
            $('.modal-close-btn').on('click', function () {
                clearCollaborateContainer();
            })
        }


    };

    /**
     * 添加右键协调操作DOM
     * @param opt
     */
    var addRecordeDom = function (opt) {
        // 获取协调DOM元素
        var dom = GridTableCollaborateDom.collaborateContainer;
        var record = GridTableCollaborateDom.collaborateRecordLi;
        dom = dom.replace( /{child}/,  record)
        if (!$.isValidVariable(dom)) {
            return;
        }
        var collaboratorDom = $(dom);
        $('#gbox_' + opt.tableId).append(collaboratorDom);
        collaboratorDom.find('.collaborate-record').on('click',function () {
            //根据机场获取协调记录
            if($.isValidVariable(opt.airport)){
                //清除协调窗口
                clearCollaborateContainer();
                getRecordByAirport(opt.airport)
            }
        })
        collaboratorDom.position({
            of: opt.cellObj,
            my: 'left top',
            at: 'right top',
            collision: 'flipfit',
        });
        followTargetPosition(collaboratorDom, opt.cellObj)
    }
    /**
     * 获取机场协调记录
     * @param airport
     */
    var getRecordByAirport = function (airport) {
        var winTitle = airport + "备降场容量协调记录";
        var dialogId = 'detail' + new Date().getTime();
        var param = "moduleName=record&airport=" + airport;
        var winUrl = 'airport-coordination-record.html?' + param;
        var winParams = {
            id: dialogId,
            width: 1240,
            height: 600,
            center: true,
            move: true
        };
        var winObj = DhxIframeDialog.create(winTitle, winUrl, winParams)
    }
    /**
     * 修改当前容量值
     * @param capacity
     * @param opt
     */
    function getNewVolume(capacity, opt) {
        var loading = Ladda.create($('.collaborate-content-level')[0])
        loading.start();
        var url = ipHost + 'airport/updatePositionCap'
        $.ajax({
            type: "POST",
            url: url,
            data: {
                airport: opt.airport,
                capacity: capacity,
                type: opt.type,
            },
            dataType: "JSON",
            // async: false,
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {
                    var generateTime = data.generateTime
                    $('.alter_volume_time').text('数据生成时间:' + formatterTime(generateTime))
                    $('.available_capacity').text(data.availableCapacity)
                    loading.stop();
                    var singleData = {
                        data: [],
                        typeArr: tableConfig.typeArr
                    };
                    singleData = dataConfigConvert(data.airportMessage, singleData);
                    fireSingleDataChange(airVolumeTable, opt, singleData)
                } else {
                    clearCollaborateContainer()
                    showQtip(opt, false, data.error.message);
                }
            },
            error: function (xhr, status, error) {
                clearCollaborateContainer()
                showQtip(opt, false, "接口访问失败");
            }
        });
    }

    /**
     *清除协调窗口
     */
    var clearCollaborateContainer = function () {
        $('.selected-cell').removeClass('selected-cell');
        $('.flight-grid-table-collaborate-container').remove();
        $('.grid-table-collaborate-container').remove();
    }

    /**
     * 列排序规则
     * @param a
     * @param b
     * @param direction
     * @returns {number}
     */
    function sortNum(a, b, direction) {
        // 若为升序排序，空值转换为最大的值进行比较
        // 保证排序过程中，空值始终在最下方
        // 若为升序排序，空值转换为最大的值进行比较
        // 保证排序过程中，空值始终在最下方
        if (isNaN(a * 1) && isNaN(b * 1)) {
            // 字符串类型
            var maxStr = 'ZZZZZZZZZZZZ';
            if (!$.isValidVariable(a)) {
                if (direction > 0) {
                    a = maxStr;
                } else {
                    a = '';
                }
            }
            if (!$.isValidVariable(b)) {
                if (direction > 0) {
                    b = maxStr;
                } else {
                    b = '';
                }
            }
            return a.localeCompare(b) * direction;
        } else {
            // 数字类型
            a = a * 1;
            b = b * 1;
            var maxNum = Number.MAX_VALUE;
            if (!$.isValidVariable(a) || a < 0) {
                if (direction > 0) {
                    a = maxNum;
                }
            }
            if (!$.isValidVariable(b) || b < 0) {
                if (direction > 0) {
                    b = maxNum;
                }
            }
            return (a > b ? 1 : -1) * direction;
        }
    }


    /**
     *设置表格样式
     * @param rowId
     * @param value
     * @param rowObject
     * @param colModel
     * @param arrData
     * @returns {string}
     */
    function setTableColor(rowId, value, rowObject, colModel, arrData) {
        // 需要赋予表格的属性
        var attrs = '';

        // 无效数值不做处理
        if (!$.isValidVariable(value)) {
            return attrs;
        }

        var title = null;
        if ($.isValidVariable(rowObject[colModel.name + '_title'])) {
            title = rowObject[colModel.name + '_title'];
        } else {
            title = rowObject[colModel.name];
        }

        if (!$.isValidVariable(title)) {
            title = '';
        }
        attrs = attrs + ' title="' + title + '"';

        // 显示style
        var style = rowObject[colModel.name + '_style'];
        if ($.isValidVariable(style)) {
            attrs = attrs + ' style="' + style + '"';
        } else {
            attrs = attrs + ' style="' + rowObject['default_style'] + '"';
        }

        return attrs;
    }

    /**
     * 定时器
     * @param func
     * @param instance
     * @param isNext
     * @param time
     */
    var startTimer = function (func, isNext, time) {
        // 清除定时器
        clearTimeout(timer);
        if (typeof func == "function") {
            timer = setTimeout(function () {
                func(isNext);
            }, time);
        }
    };
    /**
     * 表格单条数据更新
     * @param tableObj
     * @param opt
     * @param rowData
     */
    var fireSingleDataChange = function (tableObj, opt, rowData) {
        // 表格数据ID集合
        var ids = tableObj.table.jqGrid('getDataIDs');
        // 当前所在行序列
        var index = tableObj.table.jqGrid('getInd', opt.rowid);
        var f = tableObj.table.jqGrid('delRowData', opt.rowid);
        if (f) {
            // 再原数据的前一位之后插入新数据
            if (index >= 2) {
                tableObj.table.jqGrid('addRowData', opt.rowid, rowData.data[0], 'after', ids[index - 2]);
                clearCollaborateContainer()
                var newCellObj = getCellObject(opt.rowid, opt.iRow, opt.iCol)
                opt.cellObj = newCellObj;
                showQtip(opt, true)
            } else {
                tableObj.table.jqGrid('addRowData', opt.rowid, rowData.data[0], 'first');
                clearCollaborateContainer()
                var newCellObj = getCellObject(opt.rowid, opt.iRow, opt.iCol)
                opt.cellObj = newCellObj;
                showQtip(opt, true)
            }
        }

    }
    /**
     * 时间格式化
     * @param time
     * @returns {string}
     */
    var formatterTime = function (time) {
        if ($.isValidVariable(time)) {
            var year = time.substring(0, 4);
            var mon = time.substring(4, 6);
            var date = time.substring(6, 8);
            var hour = time.substring(8, 10);
            var min = time.substring(10, 12);
            var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
            return str;
        }
    }
    /**
     * 获取单元格对象
     * @param rowid
     * @param iRow
     * @param iCol
     * @returns {*}
     */
    var getCellObject = function (rowid, iRow, iCol) {
        if ($.type(iCol) === 'string') {
            // 字符类型，计算列名在表格中的列index值
            var colModel = airVolumeTable.jqGrid('getGridParam', 'colModel');
            var colIndex = null;
            for (var index in colModel) {
                if (colModel[index].name == iCol) {
                    colIndex = index;
                    break;
                }
            }
            return airVolumeTable.table.find('tr#' + rowid).find('td').eq(colIndex);
        } else {
            return airVolumeTable.table.find('tr#' + rowid).find('td').eq(iCol);
        }
    };
    /**
     * 格滚动时协调DOM位置跟随目标单元格
     * @param collaboratorDom
     * @param cellObj
     */
    var followTargetPosition = function (collaboratorDom, cellObj) {
        function position() {
            collaboratorDom.position({
                of: cellObj,
                my: 'left top',
                at: 'right top',
                collision: 'flipfit',
            });
        }

        airVolumeTable.table.parents(".ui-jqgrid-bdiv").off('scroll', position).on('scroll', position);
    };

    /**
     * 切换修改容量权限
     * @param isCheck
     */
    var getChangeCapacityAuthority = function (isCheck,btn){
        // 启用loading动画
        var loading = Ladda.create(btn);
        loading.start();
        //禁用头部关闭按钮
        $('#bootstrap-modal-dialog .close').attr('disabled',true);
        //禁用底部所有操作按钮
        $('#bootstrap-modal-dialog #bootstrap-modal-dialog-footer button').attr('disabled',true);
        // 提示信息绑定对象
        var $selector = $('.capacity-model-option');
        var url = ipHost + 'airport/changeCapacityModel';
        var param = {
            isCheck:isCheck
        }
        $.ajax({
            type: "POST",
            url: url,
            data:param,
            dataType: "JSON",
            success: function (data) {
                destroyDialog();
                isOpenChangeCapacity = isCheck;
                handleChangeWeatherModel($selector,isCheck,data);

            },
            error: function (xhr, status, error) {
                destroyDialog();
                var content = isCheck ? '开启修改容量模式' : '关闭修改容量模式';
                var opt ={
                    cellObj:$selector
                }
                showQtip(opt,'FAIL', content+'失败');
                console.error('ajax requset  fail, error:');

            }
        })
    }

    /**
     * 切换复杂天气模式 回调方法
     *
     * @param selector 提示信息绑定对象
     * @param modelStatus 杂天气模式状态 true:开启  false:关闭
     * @param data 结果数据
     *
     * */
    var handleChangeWeatherModel = function (selector, modelStatus, data) {
        var $box = $('.capacity-model-option input#change-capacity-model');
        var content = modelStatus ? '开启修改容量模式' : '关闭修改容量模式';
        var opt = {
            cellObj:selector
        }

        if (!$.isValidObject(data)) { // 数据无效
            showQtip(opt,'FAIL', content+'失败');

        } else {
            if (data.status == 200 && $.isValidObject(data.configs)) { // 成功
                showQtip(opt,'SUCCESS', content+'成功');
                $.each(data.configs,function (key,obj) {
                    if(obj.key == 'complexCapacity'){
                        if($.isValidVariable(obj.value)){
                            if(obj.value =="true"){
                                $box.prop('checked', modelStatus);
                            }else{
                                $box.prop('checked', modelStatus);
                            }
                        }
                    }

                })
            } else { // 失败
                showQtip(opt,'FAIL', content+'失败');
            }
        }
    };

    /**
     *  设置当前模块为活动模块
     *  bool true 设置为活动模块 fale 取消当前模块为活动模块
     *
     * */
    var setActive = function (bool) {
        if (bool) {
            // 开启定时器总
            isRefresh = true;
            // 开启请求,获取表格数据
            getTableData(isRefresh);
        } else {
            // 中止请求
            abortRequest();
        }
    };

    /**
     *
     * 中止请求
     * */
    var abortRequest = function () {
        if (xhr) {
            // 取消掉已经发出的ajax请求
            xhr.abort();
            xhr = null;
        }
        clearTimeout(timer);
        // 开启定时器总关闭
        isRefresh = false;
    };
    /**
     * 注销模态框
     *
     * */
    var destroyDialog = function () {
        $('#bootstrap-modal-dialog').remove();
        $('.modal-backdrop').remove();
    }

    return {
        init: function () {
            initConpoments()
            //阻止右键点击默认事件
            preventDefaultEvent();
            //校验数据绑定
            correctData();
            return {
                setActive: setActive,
            }
        },
        initCapacityTypeConpoments:initCapacityTypeConpoments
    }

}();
