/**
 * 2018/01/23
 * author: zxy
 * 表格组件
 */

function GridTable(params) {
    // 检查参数有效性
    if (!$.isValidObject(params)) {
        return;
    }

    /**
     * 表格所在容器ID
     */
    // this.canvasId = params.canvasId;

    /**
     * 表格所在容器jQuery对象
     */
    this.canvas = {};

    /**
     * 表格元素ID
     */
    this.tableId = params.tableId;

    /**
     * 表格元素jQuery对象
     */
    this.table = {};

    /**
     * 表格元素PagerID
     */
    this.pagerId = params.pagerId;

    /**
     * 表格jqGrid对象
     */
    this.gridTableObject = {};

    /**
     * 列所有名称
     */
    this.colNames = params.colNames;

    /**
     * 列属性
     */
    this.colModel = params.colModel;

    /**
     * 列属性模板
     */
    this.cmTemplate = params.cmTemplate;

    /**
     * 列显示提示信息
     */
    this.colTitle = params.colTitle;

    /**
     * 列样式配置
     */
    this.colStyle = params.colStyle;

    /**
     * 列编辑开放配置
     */
    this.colEdit = params.colEdit;

    /**
     * 列操作权限
     */
    this.colAuthority = params.colAuthority;

    /**
     * 列操作url
     */
    this.colCollaborateUrl = params.colCollaborateUrl;

    /**
     * 列数据转换工具
     */
    this.colConverter = params.colConverter;

    /**
     * jqGrid表格原生配置项
     */
    this.params = params.params;

    /**
     * 数据-原始数据
     */
    this.data = {};

    /**
     * 数据-表格显示数据（Array）
     */
    this.tableData = [];

    /**
     * 数据-表格显示数据（Map）
     */
    this.tableDataMap = {};


    /**
     * 回调方法-选中单行
     */
    this.onSelectRow = params.onSelectRow;

    /**
     * 回调方法-更新单个数据
     */
    this.afterCollaborate = params.afterCollaborate;

    /**
     * 数据-基础数据：如列操作需要的数据
     */
    this.baseData = params.baseData;

    /**
     * 冻结列高度（用以处理冻结列和滚动条中间缝隙）
     */
    this.frozenHeight = 0;
}


/**
 * 常量-当前选择单元格类名
 */
GridTable.SELECTED_CELL_CLASS = 'grid-table-current-select-cell';

/**
 * 常量-协调元素类名
 */
GridTable.COLLABORATE_DOM_CLASS = 'grid-table-collaborate-container';



GridTable.prototype.initGridTableObject = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 表格jQuery对象
    thisProxy.table = $('#' + thisProxy.tableId);
    // 容器jQuery对象
    thisProxy.canvas = thisProxy.table.parent();
    // 初始化jqGrid默认参数
    var gridTableOptions = {
        // 单独使用bootstrap样式，或通过全局设置$.jgrid.defaults.styleUI = 'Bootstrap';
        styleUI: 'Bootstrap',
        // 列名称
        colNames: thisProxy.colNames,
        // 列Model
        colModel: thisProxy.colModel,
        // 列Model模板
        cmTemplate: thisProxy.cmTemplate,
        // 列标题
        colTitle: thisProxy.colTitle,
        // 数据类型
        datatype: 'local',
        // 单次显示数据行数
        rowNum: 999999999,
        // 是否显示行号
        rownumbers: true,
        // 行号列宽(px)
        //rownumWidth: 25,
        // 是否显示表头信息
        headertitles: true,
        // 是否初始化时自适应容器宽度
        //autowidth: true,
        // 是否列宽根据所在容器宽度自适应
        shrinkToFit: false,
        // 定义工具栏，须是有效的html元素
        pager: '#' + this.pagerId,
        // 定义工具栏是否显示翻页键
        pgbuttons: false,
        // 定义工具栏是否显示页数输入框
        pginput: false,
        // 定义导航栏是否显示记录数
        viewrecords: true,
        // 是否支持通过checkbox进行行多选（默认不支持多选）
        multiselect: false,
        // 是否限制仅通过checkbox进行行多选（在“伪”关闭多选模式时开启，默认“伪”关闭）
        multiboxonly: false,
        // 绑定左键单击事件
        onCellSelect: function (rowid, iCol, cellcontent, e) {
            thisProxy.onCellSelect(rowid, iCol, cellcontent, e);
        },
        // 绑定左键选中行事件
        onSelectRow: function (rowid, status, e) {
            if (undefined != thisProxy.onSelectRow && typeof(thisProxy.onSelectRow) == 'function') {
                //若选中多选框，阻止冒泡
                if( $(e.target).hasClass("cbox") ){
                    e.stopPropagation();
                }else{
                    thisProxy.onSelectRow(rowid, status, e);
                }

            }
        },
        // 绑定右键单击事件
        onRightClickRow: function (rowid, iRow, iCol, e) {
            thisProxy.onRightClickRow(rowid, iRow, iCol, e);
        },
        //　绑定排序事件
        // 当点击排序列但是数据还未进行变化时触发此事件
        onSortCol : function (index, iCol, sortorder ) {
            thisProxy.onSortCol(index, iCol, sortorder);
        }
    };
    // 追加jqGrid自定义参数
    if (thisProxy.params != undefined && thisProxy.params != null) {
        for (var key in thisProxy.params) {
            gridTableOptions[key] = thisProxy.params[key];
        }
    }
    // 初始化jqGrid
    thisProxy.gridTableObject = thisProxy.table.jqGrid(gridTableOptions);

    // 初始化jqGrid Pager
    thisProxy.gridTableObject.jqGrid('navGrid', '#' + thisProxy.pagerId, {
        add: false,
        edit: false,
        view: false,
        del: false,
        search: false,
        refresh: false
    });

    // 绑定Canvas事件，屏蔽表格区域内浏览器右键菜单
    thisProxy.canvas.on('mouseenter', function () {
        document.oncontextmenu = function () {
            return false;
        };
    }).on('mouseleave', function () {
        document.oncontextmenu = function () {
            return true;
        };
    }).on('mouseover', function () {
        document.oncontextmenu = function () {
            return false;
        };
    });
    // 绑定右键协调窗口事件,用于显隐菜单层级效果
    thisProxy.canvas.on('mouseover', '.grid-table-collaborate-container li', function (event) {
        $that = $(this);
        // 添加class 若有子菜单则子菜单会显示
        $that.addClass('hover');
        // 子菜单
        var $sub = $($that).children('.collaborate-menu');
        // 若有子菜单则定位子菜单,解决某些情况下因菜单高度将表格高度撑高引起的表格滚动条跳动问题
        if($sub.length > 0){
            $sub.position({
                of: $that,
                my: 'left top',
                at: 'right top',
                collision : "fit"
            });
        }
    }).on('mouseout', '.grid-table-collaborate-container li', function () {
        // 移除class 若有子菜单则子菜单会隐藏
        $(this).removeClass('hover');

    });

    // 绑定Window事件，窗口变化时重新调整表格大小
    $(window).resize(function () {
        if( thisProxy.gridTableObject.parents('section').is(":visible") ){
            thisProxy.gridTableObject.jqGrid('resizeSize')
            thisProxy.frozenHeight = $('#'+thisProxy.tableId+'_frozen').parent().height();
            thisProxy.resizeFrozenTable();
        }

    });
    //清除冻结列
    thisProxy.gridTableObject.jqGrid("destroyFrozenColumns");
    thisProxy.gridTableObject.jqGrid("setFrozenColumns");

    // 初始化完成时，使按照所在容器调整表格大小
    thisProxy.resizeToFitContainer();
};


/**
 * 调整表格大小以适应所在容器
 */
GridTable.prototype.resizeToFitContainer = function () {
    var thisProxy = this;
    GridTableUtil.resizeToFitContainer(thisProxy.tableId);
};

/**
 *
 * */
GridTable.prototype.fireTableDataChange = function (dataObj) {
    // 当前对象this代理
    var thisProxy = this;
    // 校验数据是否有效
    if(!$.isValidObject(dataObj) || !$.isValidObject(dataObj.flights)){
        return;
    }
    // deep copy 保存源数据
    // thisProxy.data = $.extend(true, {}, dataObj);
    // 取得航班集合
    var data = dataObj.flights;
    thisProxy.tableDataMap = {};
    thisProxy.tableData = {};
    var tableData = [];
    var tableMap = {};
    for (var index in data) {
        // 取得单个航班数据并转换
        var d = thisProxy.convertData(data[index]);
        var id = d.id;
        tableData.push(d);
        tableMap[id] = d;
    }
    thisProxy.tableDataMap = tableMap;
    thisProxy.tableData = tableData;

    // 绘制表格数据
    thisProxy.drawGridTableData();
    // 调整表格大小以适应所在容器
    thisProxy.gridTableObject.jqGrid('resizeSize')
    // thisProxy.resizeToFitContainer();
};



/**
 * 绘制表格数据
 */
GridTable.prototype.drawGridTableData = function () {
    var thisProxy = this;
    // 清空表格数据
    thisProxy.gridTableObject.jqGrid('clearGridData');
    // 更新表格数据
    var params = {data: this.tableData, srcoll: 1};
    this.gridTableObject.jqGrid('setGridParam', params).trigger('reloadGrid');

    // this.frozenHeight = $('#'+thisProxy.tableId+'_frozen').parent().height();
    // this.resizeFrozenTable();
};

/**
 * 左键单击事件
 *
 * @param rowid
 * @param iCol
 * @param cellcontent
 * @param e
 */
GridTable.prototype.onCellSelect = function (rowid, iCol, cellcontent, e) {
    // 代理
    var thisProxy = this;
    // 清除单元格样式
    thisProxy.clearCollaborateContainer();
    // 调整冻结列高度
    thisProxy.resizeFrozenTable();
};


/**
 * 右键单击事件
 *
 * @param rowid
 * @param iRow
 * @param iCol
 * @param e
 */
GridTable.prototype.onRightClickRow = function (rowid, iRow, iCol, e) {
    // 代理
    var thisProxy = this;

    // 清除单元格样式
    this.clearCollaborateContainer();
    // 获取单元格colModel对象
    var colModel = this.gridTableObject.jqGrid('getGridParam')['colModel'][iCol];
    // 获取触发事件的单元格对象
    var cellObj = $(e.target);
    // 记录当前选中的单元格对象
    cellObj.addClass(GridTable.SELECTED_CELL_CLASS);

    // 获取计划航班数据
    var flight = this.tableDataMap[rowid];
    if(!flight){
        return null;
    }
    // 可交互标记
    // var collaborateFlag = true;

    // // 计划批号协调
    // if (colModel.name == 'flightDataId') {
    //     this.collaborateFlightDataId(rowid, iRow, iCol, cellObj, collaborateFlag);
    // }

    // 屏蔽协调窗口的右键操作
    if ($('.' + GridTable.COLLABORATE_DOM_CLASS)[0] != null) {
        $('.' + GridTable.COLLABORATE_DOM_CLASS)[0].oncontextmenu = function (e) {
            return false;
        };
    }
    // 参数汇总
    var opt = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol,
        flight : flight,
        cellObj : cellObj
    };
    // 获取表格id
    var tableId = thisProxy.tableId;
    // 依据表格id 区分模块
    if(tableId == 'arr-table'){
        // 进港计划模块
        thisProxy.collaborateArr(opt);
    }else if(tableId == 'alternate-table'){
        // 备降计划模块
        thisProxy.collaborateAlternate(opt);

    }else if(tableId == 'over-table'){
        // 疆内飞越模块
        thisProxy.collaborateOver(opt);

    }else if(tableId == 'dep-table'){
        // 出港计划模块
        thisProxy.collaborateDep(opt);
    }

};


/**
 *  列排序事件
 * */
GridTable.prototype.onSortCol = function (index, iCol, sortorder) {
    // 代理
    var thisProxy = this;
    // 清除协调窗口
    thisProxy.clearCollaborateContainer();
};

/**
 * 清除协调窗口
 */
GridTable.prototype.clearCollaborateContainer = function () {
    // 代理
    var thisProxy = this;
    // 清理
    // 取得对应表格的冻结列表格
    // 将协调窗口的被选菜单的class名 hover 去掉
    $('.grid-table-collaborate-container li.hover', thisProxy.canvas).removeClass('hover');
    var $frozenTable  = $('#'+thisProxy.tableId+'_frozen', thisProxy.canvas);
    // 移除表格中被选中单元格的特殊class
    $('.' + GridTable.SELECTED_CELL_CLASS, thisProxy.table).removeClass(GridTable.SELECTED_CELL_CLASS);
    // 移除表格中的协调窗口
    $('.' + GridTable.COLLABORATE_DOM_CLASS, thisProxy.table).remove();
    // 移除冻结列表格中被选中单元格的特殊class
    $('.' + GridTable.SELECTED_CELL_CLASS, $frozenTable).removeClass(GridTable.SELECTED_CELL_CLASS);
    // 移除冻结列表格中的协调窗口
    $('.' + GridTable.COLLABORATE_DOM_CLASS, $frozenTable).remove();
    if ('auto' == thisProxy.canvas.css('overflow')) {
        thisProxy.canvas.css('overflow', 'hidden');
    }
    /*// 清理popover窗口
    $('.popover').popover("hide");*/
};

/**
 * 进港模块协调
 *
 * @param opt 参数
 *
 */
GridTable.prototype.collaborateArr = function (opt) {
    // 代理
    var thisProxy = this;
    // 获取协调DOM元素
    var collaboratorDom = GridTableCollaborateDom.ARR_DOM;
    // 校验DOM元素是否有效
    if(!$.isValidVariable(collaboratorDom)){
        return
    }
    // 追加协调DOM至容器
    thisProxy.table.append(collaboratorDom);
    // thisProxy.canvas.append(collaboratorDom);

    // 定位协调DOM
    collaboratorDom.position({
        of: opt.cellObj,
        my: 'left top',
        at: 'right top',
        collision : "fit"
    });
    // 预选备降协调菜单
    var $preAlternate = $('.pre-alternate', collaboratorDom);
    // 采用事件委托，在该菜单上绑定事件，
    // 并过滤触发事件的元素为只有data-val属性的菜单项,
    // 这样该菜单下的复合菜单项就不会被绑定点击事件了
    $preAlternate.on('click', 'li[data-val]', function (event) {
        // 阻止事件冒泡
        event.stopPropagation();
        // 当前点击的菜单项
        var $that = $(this);
        // 获取data-val属性值,此值对应该菜单的code(备降机场四字码)
        var altAirport = $that.attr('data-val');
        // 校验code 是否有效，无效则不作任何操作
        if(!$.isValidVariable(altAirport)){
            return;
        }
        // 计划批号
        var flightDataId = opt.flight.flightDataId;
        // 校验code 是否有效，无效则不作任何操作
        if(!$.isValidVariable(flightDataId)){
            return;
        }
        // 备降计划
        var altId = opt.flight.altId || '';
        // 操作请求地址
        var submiturl = thisProxy.colCollaborateUrl.PRE_ALTERNATE;
        // 校验操作请求地址是否有效，无效则不作任何操作
        if(!$.isValidVariable(submiturl)){
            return;
        }
        submiturl = submiturl +'?flightDataId=' + flightDataId +'&altAirport=' + altAirport + '&altId='+ altId;
        // ajax提交请求
        $.ajax({
            url:submiturl ,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // 清除协调窗口
                thisProxy.clearCollaborateContainer();
                // 若数据无效
                if (!$.isValidVariable(data)) {
                    thisProxy.showTableCellTipMessage(opt, "FAIL", "预选备降提交失败，请稍后重试");
                };
                //成功
                if (data.status == 200) {
                    // 取数据的altfFlights值
                    var altfFlights = data.altfFlights;
                    // 数据有效则更新单个数据
                    if($.isValidObject(altfFlights)){
                        thisProxy.fireSingleDataChange(altfFlights);
                        thisProxy.showTableCellTipMessage(opt, 'SUCCESS', '预选备降已提交成功');
                    }
                } else if (data.status == 202) { // 失败
                    thisProxy.showTableCellTipMessage(opt, "FAIL", data.error.message)
                } else if (data.status == 500) { // 失败
                    thisProxy.showTableCellTipMessage(opt, "FAIL", data.error.message)
                };
            },
            error: function ( status, error) {
                console.error('ajax requset  fail, error:');
                console.error(error);
            }
        })

    });

    // 确定备降协调菜单
    var $conAlternate = $('.confirm-alternate', collaboratorDom);
    // 采用事件委托，在该菜单上绑定事件，
    // 并过滤触发事件的元素为只有data-val属性的菜单项,
    // 这样该菜单下的复合菜单项就不会被绑定点击事件了
    $conAlternate.on('click', 'li[data-val]', function (event) {
        // 阻止事件冒泡
        event.stopPropagation();
        // 当前点击的菜单项
        var $that = $(this);
        // 获取data-val属性值,此值对应该菜单的code(备降机场四字码)
        var altAirport = $that.attr('data-val');
        // 校验code 是否有效，无效则不作任何操作
        if(!$.isValidVariable(altAirport)){
            return;
        }
        // 计划批号
        var flightDataId = opt.flight.flightDataId;
        // 校验code 是否有效，无效则不作任何操作
        if(!$.isValidVariable(flightDataId)){
            return;
        }
        // 备降计划
        var altId = opt.flight.altId || '';
        // 操作请求地址
        var submiturl = thisProxy.colCollaborateUrl.CONFIRM_ALTERNATE;
        // 校验操作请求地址是否有效，无效则不作任何操作
        if(!$.isValidVariable(submiturl)){
            return;
        }
        submiturl = submiturl +'?flightDataId=' + flightDataId +'&altAirport=' + altAirport + '&altId='+ altId;
        // ajax提交请求
        $.ajax({
            url:submiturl ,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // 清除协调窗口
                thisProxy.clearCollaborateContainer();
                // 若数据无效
                if (!$.isValidVariable(data)) {
                    thisProxy.showTableCellTipMessage(opt, "FAIL", "确定备降提交失败，请稍后重试");
                };
                //成功
                if (data.status == 200) {
                    // 取数据的altfFlights值
                    var altfFlights = data.altfFlights;
                    // 数据有效则更新单个数据
                    if($.isValidObject(altfFlights)){
                        thisProxy.fireSingleDataChange(altfFlights);
                        thisProxy.showTableCellTipMessage(opt, 'SUCCESS', '确定备降已提交成功');
                    }
                } else if (data.status == 202) { // 失败
                    thisProxy.showTableCellTipMessage(opt, "FAIL", data.error.message)
                } else if (data.status == 500) { // 失败
                    thisProxy.showTableCellTipMessage(opt, "FAIL", data.error.message)
                };
            },
            error: function ( status, error) {
                console.error('ajax requset  fail, error:');
                console.error(error);
            }
        })

    });

};


/**
 * 备降计划模块协调
 */
GridTable.prototype.collaborateAlternate = function (opt) {
    // 代理
    var thisProxy = this;
    // 获取协调DOM元素
    var collaboratorDom = GridTableCollaborateDom.ALTERNATE_DOM;
    // 校验DOM元素是否有效
    if(!$.isValidVariable(collaboratorDom)){
        return
    }
    // 追加协调DOM至容器
    thisProxy.table.append(collaboratorDom);

    // 定位协调DOM
    collaboratorDom.position({
        of: opt.cellObj,
        my: 'left top',
        at: 'right top'
    });
};


/**
 * 疆内飞越模块协调
 */
GridTable.prototype.collaborateOver = function (opt) {
    // 代理
    var thisProxy = this;
    // 获取协调DOM元素
    var collaboratorDom = GridTableCollaborateDom.OVER_DOM;
    // 校验DOM元素是否有效
    if(!$.isValidVariable(collaboratorDom)){
        return
    }
    // 追加协调DOM至容器
    thisProxy.table.append(collaboratorDom);

    // 定位协调DOM
    collaboratorDom.position({
        of: opt.cellObj,
        my: 'left top',
        at: 'right top'
    });
};


/**
 * 出港模块协调
 */
GridTable.prototype.collaborateDep = function (opt) {
    // 代理
    var thisProxy = this;
    // 获取协调DOM元素
    var collaboratorDom = GridTableCollaborateDom.DEP_DOM;
    // 校验DOM元素是否有效
    if(!$.isValidVariable(collaboratorDom)){
        return
    }
    // 追加协调DOM至容器
    thisProxy.table.append(collaboratorDom);

    // 定位协调DOM
    collaboratorDom.position({
        of: opt.cellObj,
        my: 'left top',
        at: 'right top'
    });
};

/**
 * 显示单元格qtip信息
 *
 * @param cellObject 单元格对象
 * @param type 信息类型
 * @param content 信息内容
 */
GridTable.prototype.showTableCellTipMessage = function (opts, type, content) {
    var thisProxy = this;
    // 获取单元格对象(因为更新数据是先删除再添加的，所以要重新获取一下新单元格对象)
    var cellObj =  thisProxy.getCellObject(opts.rowid, opts.iRow, opts.iCol);
    // 容器
    $container = $('.ui-jqgrid-bdiv', thisProxy.canvas);
    // 确定样式设置
    var styleClasses = 'qtip-green';
    if (type == 'SUCCESS') {
        styleClasses = 'qtip-green-custom qtip-rounded';
    } else if (type == 'FAIL') {
        styleClasses = 'qtip-red-custom qtip-rounded';
    } else if (type == 'WARN') {
        styleClasses = 'qtip-default-custom qtip-rounded';
    }

    // 显示提示信息
    cellObj.qtip({
        // 内容
        content: {
            text: content // 显示的文本信息
        },
        // 显示配置
        show: {
            delay: 0,
            target: $container,
            ready: true, // 初始化完成后马上显示
            effect: function () {
                $(this).fadeIn(); // 显示动画
            }
        },
        // 隐藏配置
        hide: {
            target: $container, // 指定对象
            event: ' unfocus click', // 失去焦点时隐藏
            effect: function () {
                $(this).fadeOut(); // 隐藏动画
            }
        },
        // 显示位置配置
        position: {
            my: 'bottom center', // 同jQueryUI Position
            at: 'top center',
            viewport: true, // 显示区域
            container:  $container, // 限制显示容器，以此容器为边界
            adjust: {
                resize: true, // 窗口改变时，重置位置
                method: 'shift shift'  //flipinvert/flip(页面变化时，任意位置翻转)  shift(转变) none(无)
            }
        },
        // 样式配置
        style: {
            classes: styleClasses //
        },
        // 事件配置
        events: {
            hide: function (event, api) {
                api.destroy(true); // 销毁提示信息
            }
        }
    });
};
/**
 * 触发表格单个数据更新
 *
 * @param flight
 *
 */
GridTable.prototype.fireSingleDataChange = function (flight) {
    var thisProxy = this;
    // 更新源数据 (注意：源数据是没有id属性的，只有flightDataId属性)
    // todo

    // 转换数据
    var rowData = thisProxy.convertData(flight);
    // 更新数据
    thisProxy.tableDataMap[flight.id] = rowData;
    // 删除原数据行，加入新的数据行
    // 表格数据ID集合
    var ids = thisProxy.gridTableObject.jqGrid('getDataIDs');
    // 当前所在行序列
    var index = thisProxy.gridTableObject.jqGrid('getInd', flight.id, false);
    // 删除原数据
    var f = thisProxy.gridTableObject.jqGrid('delRowData', flight.id);
    if (f) {
        // 再原数据的前一位之后插入新数据
        if (index >= 2) {
            thisProxy.gridTableObject.jqGrid('addRowData', flight.id, rowData, 'after', ids[index - 2]);
        } else {
            thisProxy.gridTableObject.jqGrid('addRowData', flight.id, rowData, 'first');
        }
    }
    thisProxy.resizeFrozenTable();
};


/**
 * 获取单元格对象
 *
 * @param rowid
 * @param iRow
 * @param iCol
 * @returns
 */
GridTable.prototype.getCellObject = function (rowid, iRow, iCol) {
    if ($.type(iCol) === 'string') {
        // 字符类型，计算列名在表格中的列index值
        var colModel = this.gridTableObject.getGridParam('colModel');
        var colIndex = null;
        for (var index in colModel) {
            if (colModel[index].name == iCol) {
                colIndex = index;
                break;
            }
        }
        return this.gridTableObject.find('tr#' + rowid).find('td').eq(colIndex);
    } else {
        return this.gridTableObject.find('tr#' + rowid).find('td').eq(iCol);
    }
};

/**
 * 转换数据
 * @param flight 航班数据
 * 目标：给没有id属性的航班增加id属性，取值为flightDataId属性的值
 */
GridTable.prototype.convertData = function (flight) {
    // 航班数据无id且有flightDataId
    if($.isValidVariable(flight.flightDataId) && !$.isValidVariable(flight.id)){
        // 设置航班id 为 flightDataId, 用于右键协调时获取对应航班数据(rowid值是以id属性值来定义的)
        flight.id = flight.flightDataId
    }
    return flight;
};

//调整冻结列高度
GridTable.prototype.resizeFrozenTable = function(){
    // 代理
    var thisProxy = this;
    var frozenDom = $('#'+thisProxy.tableId+'_frozen').parent();
    frozenDom.height( thisProxy.frozenHeight  + 'px');

};