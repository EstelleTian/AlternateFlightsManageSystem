/**
 *
 */

var Demo = function () {
    var moduleClass = ['arr-plan','pre-landing-plan','area-fly','dep-plan'];
    var tableIDs = ['arr-table','pre-table','area-table','dep-table'];
    var pagerIDs = ['arr-table-pager','pre-table-pager','area-table-pager','dep-table-pager'];
    var $canvas = null;
    var table = null;
    var index = 0;

    var tableId = 'arr-table';
    var pagerId = 'arr-table-pager';

    var tableConfig = {
        colName: ['计划批号','备降场', '状态', '航班号', '机号','机型', '任务', '起飞机场','计划ETD', '动态ETD', 'ATD','计划ETA','降落机场','备注' ],
        colTitle: {
            pid:'计划批号',
            alterPart:'备降场',
            status:'状态',
            flightID:'航班号',
            flightNum:'机号',
            flightType:'机型',
            task:'任务',
            arrPart:'起飞机场',
            pETD:'计划ETD',
            dyETD:'动态ETD',
            ATD:'ATD',
            pETA:'计划ETA',
            depPart:'降落机场',
            commont:'备注'
        },
        colModel: [
            {
                name: 'pid',
                index: 'pid',
                width:120,
                frozen:true
            },{
                name: 'alterPart',
                index: 'alterPart',
                width:120,
                frozen:true
            }, {
                name: 'status',
                index: 'status'
            }, {
                name: 'flightID',
                index: 'flightID'
            }, {
                name: 'flightNum',
                index: 'flightNum'
            }, {
                name: 'flightType',
                index: 'flightType'
            }, {
                name: 'task',
                index: 'task'
            }, {
                name: 'arrPart',
                index: 'arrPart'
            }, {
                name: 'pETD',
                index: 'pETD'
            }, {
                name: 'dyETD',
                index: 'dyETD'
            }, {
                name: 'ATD',
                index: 'ATD'
            }, {
                name: 'pETA',
                index: 'pETA'
            }, {
                name: 'depPart',
                index: 'depPart'
            }, {
                name: 'commont',
                index: 'commont'
            }]
    };
    // 模拟数据
    var result = [
        {
            pid:'2827657',
            alterPart:'ZWTL',
            status:'预选',
            flightID:'CYA8281',
            flightNum:'B5791',
            flightType:'B738',
            task:'S',
            arrPart:'ZBTJ',
            pETD:'10/11:50',
            dyETD:'10/11:50',
            ATD:'10/11:58',
            pETA:'10/16:15',
            depPart:'ZWWW',
            commont:'新增'
        },
        {
            pid:'2828059',
            alterPart:'ZWTL',
            status:'备降',
            flightID:'CSN6920',
            flightNum:'B1736',
            flightType:'B738',
            task:'S',
            arrPart:'ZBHC',
            pED:'10/15:30',
            dyETD:'10/15:30',
            ATD:'10/15:53',
            pETA:'10/20:53',
            depPart:'ZWWW',
            commont:''
        },
        {
            pid:'2827941',
            alterPart:'',
            status:'',
            flightID:'CSZ9779',
            flightNum:'B1479',
            flightType:'B738',
            task:'S',
            arrPart:'ZSCN',
            pETD:'10/14:25',
            dyETD:'10/14:25',
            ATD:'10/14:24',
            pETA:'10/19:21',
            depPart:'ZWWW',
            commont:''
        },
        {
            pid:'2828043',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:20',
            dyETD:'10/15:20',
            ATD:'10/15:36',
            pETA:'10/17:14',
            depPart:'',
            commont:''
        },{
            pid:'2828044',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/16:15',
            dyETD:'10/16:15',
            ATD:'10/16:24',
            pETA:'10/18:53',
            depPart:'',
            commont:''
        },{
            pid:'2828045',
            alterPart:'ZWTK',
            status:'备降',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/19:11',
            dyETD:'10/19:11',
            ATD:'10/19:23',
            pETA:'10/19:59',
            depPart:'',
            commont:''
        },{
            pid:'2828046',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'28270123',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'28263351',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2829108',
            alterPart:'ZWKM',
            status:'备降',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2827777',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2828001',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2825005',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2827114',
            alterPart:'ZWSH',
            status:'备降',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2821222',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2826333',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2820200',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2828888',
            alterPart:'ZWYN',
            status:'备降',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2828043',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2822222',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2824444',
            alterPart:'',
            status:'',
            flightID:'CSN6926',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },{
            pid:'2820000',
            alterPart:'ZWKC',
            status:'备降',
            flightID:'CXS6666',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZUUU',
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
            depPart:'',
            commont:''
        },
    ];

    //
    var preTableConfig = {
        colName: ['计划批号', '航班号', '机号','机型', '机型分类','占用机位','任务', '起飞机场','计划ETD', '动态ETD', 'ATD','计划ETA','降落机场','备降场', '状态','备注' ],
        colTitle: {
            pid:'计划批号',
            flightID:'航班号',
            flightNum:'机号',
            flightType:'机型',
            flightTypeGroup: '机型分类',
            occupationSeat: '占用机位',
            task:'任务',
            arrPart:'起飞机场',
            pETD:'计划ETD',
            dyETD:'动态ETD',
            ATD:'ATD',
            pETA:'计划ETA',
            depPart:'降落机场',
            alterPart:'备降场',
            status:'状态',
            commont:'备注'
        },
        colModel: [
            {
                name: 'pid',
                index: 'pid',
                width:120,
                frozen:true
            }, {
                name: 'flightID',
                index: 'flightID',
                width:120,
                frozen:true
            },{
                name: 'flightNum',
                index: 'flightNum'
            },  {
                name: 'flightType',
                index: 'flightType'
            },{
                name: 'flightTypeGroup',
                index: 'flightTypeGroup'
            }, {
                name: 'occupationSeat',
                index: 'occupationSeat'
            }, {
                name: 'task',
                index: 'task'
            }, {
                name: 'arrPart',
                index: 'arrPart'
            }, {
                name: 'pETD',
                index: 'pETD'
            }, {
                name: 'dyETD',
                index: 'dyETD'
            }, {
                name: 'ATD',
                index: 'ATD'
            }, {
                name: 'pETA',
                index: 'pETA'
            }, {
                name: 'depPart',
                index: 'depPart'
            },  {
                name: 'alterPart',
                index: 'alterPart',
            }, {
                name: 'status',
                index: 'status'
            }, {
                name: 'commont',
                index: 'commont'
            }]
    };
    // 备降模拟数据
    var preData = [
        {
            pid:'2813033',
            flightTypeGroup: 'C2',
            occupationSeat: 'C1',
            flightID:'CSN6973',
            flightNum:'B5762',
            flightType:'B738',
            task:'S',
            arrPart:'ZWKL',
            pETD:'03/09:20',
            dyETD:'03/09:20',
            ATD:'03/09:25',
            pETA:'03/10:00',
            depPart:'ZWWW',
            alterPart:'',
            status:'备降',
            commont:''
        },{
            pid:'2813545',
            flightTypeGroup: 'C2',
            occupationSeat: 'C2',
            flightID:'CSN6069',
            flightNum:'B1782',
            flightType:'B738',
            task:'S',
            arrPart:'ZLLL',
            pETD:'03/14:30',
            dyETD:'03/14:30',
            ATD:'03/14:55',
            pETA:'03/17:10',
            depPart:'ZWWW',
            alterPart:'ZWTL',
            status:'备降',
            commont:''
        },{
            pid:'2813329',
            flightTypeGroup: 'C2',
            occupationSeat: '',
            flightID:'DKH1083',
            flightNum:'B8236',
            flightType:'A320',
            task:'S',
            arrPart:'ZSSS',
            pETD:'03/12:20',
            dyETD:'03/12:20',
            ATD:'10/12:34',
            pETA:'03/17:50',
            depPart:'ZWWW',
            alterPart:'ZWTL',
            status:'备降',
            commont:''
        },{
            pid:'2813461',
            flightTypeGroup: 'C2',
            occupationSeat: '',
            flightID:'CHH7145',
            flightNum:'B5620',
            flightType:'B738',
            task:'S',
            arrPart:'ZBAA',
            pETD:'03/13:50',
            dyETD:'03/13:50',
            ATD:'03/14:07',
            pETA:'03/18:10',
            depPart:'ZWWW',
            alterPart:'ZWKM',
            status:'备降',
            commont:''
        }
    ];

    /**
     * 数据生成时间格式化
     * */
    var formateTime = function (time) {
        var year = time.substring(0, 4);
        var mon = time.substring(4, 6);
        var date = time.substring(6, 8);
        var hour = time.substring(8, 10);
        var min = time.substring(10, 12);
        var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
        return str;
    };


    /**
     * 调整表格大小以适应所在容器
     *
     * */
    function resizeToFitContainer(tableId) {
        // 获取表格结构下元素
        var gridTableGBox = $('#gbox_' + tableId);
        var gridTableGView = $('#gview_' + tableId);
        var gridTableBDiv = gridTableGView.find('.ui-jqgrid-bdiv');

        // 获取容器高度
        var container = gridTableGBox.parent();

        // 计算表格高度
        var gridTableHeight = gridTableBDiv.outerHeight() - (gridTableGBox.outerHeight() - container.height());
        var gridTableWidth = container.width();

        // 调用表格修改高度宽度方法
        $('#' + tableId).jqGrid('setGridHeight', gridTableHeight);
        $('#' + tableId).jqGrid('setGridWidth', (gridTableWidth - 2));
    }


    var updateTime = function () {
       var time = formateTime($.getFullTime( new Date()));
       $('.time', $canvas).text(' 数据生成时间: '+time);
    };


    var updateCondition = function () {
        var range = $('.form-panel .range', $canvas).val();
        var key = $('.form-panel .key', $canvas).val();
        $('.condition-panel .range', $canvas).html(range).attr('title','范围:'+ range);
        $('.condition-panel .key', $canvas).html(key).attr('title','关键字:'+ key);
        $('.condition-panel',$canvas).removeClass('hidden');
    };


    var initTable = function () {
        if($.isValidObject(table)){
            $('#' + tableId).jqGrid('clearGridData');
            table = null;
        }

        table = $('#' + tableId).jqGrid({
            styleUI: 'Bootstrap',
            datatype: 'local',
            rownumbers: true,
            height: "auto",
            shrinkToFit: true,
            cmTemplate: {
                align: 'center',
                // width: 100,
                resize: true
            },
            pager: pagerId,
            pgbuttons: false,
            pginput: false,
            colNames: tableConfig.colName,
            colModel: tableConfig.colModel,
            rowNum: 999999, // 一页显示多少条
            sortname: 'pid', // 初始化的时候排序的字段
            // sortorder: 'asc', //排序方式,可选desc,asc
            viewrecords: true,
            loadComplete: function (xhr) {
                var colTitle = tableConfig.colTitle;
                $.each(colTitle, function (i, e) {
                    $('#' + tableId).jqGrid('setLabel', i, '', [], {title: e});
                })
            },
            onCellSelect: function (rowid, index, contents, event) {

            },
            // 绑定右键单击事件
            onRightClickRow: function (rowid, iRow, iCol, e) {
                // 当前行数据
                var rowData = table.jqGrid().getRowData(rowid);
                // 获取触发事件的单元格对象
                var cellObj = $(e.target);
                var opt = {
                    rowid : rowid,
                    iRow : iRow,
                    iCol : iCol,
                    table : table,
                    tableId : tableId,
                    rowData : rowData,
                    cellObj : cellObj
                }

                onRightClickRow(opt)
            },

        });
    };


    var onRightClickRow = function (opt) {

        // 清除协调窗口
         clearCollaborateContainer(opt);
       /* // 当前行数据
        var rowData = table.jqGrid().getRowData(rowid);
        $('.selected-cell').removeClass('selected-cell');
        // 获取单元格colModel对象
        var colModel = table.jqGrid('getGridParam')['colModel'][iCol];
        // 获取触发事件的单元格对象
        var cellObj = $(e.target);*!/*/
        // 记录当前选中的单元格对象
        opt.cellObj.addClass('selected-cell');
        var currentModulee = moduleClass[index];

        //进港
        if(currentModulee == 'arr-plan' ){
            collaborateARR(opt);
        }else if(currentModulee == 'pre-landing-plan'){
            collaboratePRE(opt);
        }else if(currentModulee == 'dep-plan' ){
            collaborateDEP(opt);
        }


    };
    var clearCollaborateContainer = function () {
        $('.selected-cell').removeClass('selected-cell');
        $('.grid-table-collaborate-container').remove();
    }

    // 进港协调窗口
    var collaborateARR = function (opt) {
        // 获取协调DOM元素
        var collaboratorDom = $(CollaborateDom.ARR);
        $('#gbox_' + opt.tableId).append(collaboratorDom);
        // 定位协调DOM
        collaboratorDom.position({
            of: opt.cellObj,
            my: 'left top',
            at: 'right top'
        });
        collaboratorDom.on('click',function (e) {
           clearCollaborateContainer(opt);
        });

    };
    // 备降协调窗口
    var collaboratePRE = function (opt) {
        // 获取协调DOM元素
        var collaboratorDom = $(CollaborateDom.PRE);
        $('#gbox_' + opt.tableId).append(collaboratorDom);
        // 定位协调DOM
        collaboratorDom.position({
            of: opt.cellObj,
            my: 'left top',
            at: 'right top'
        });
        collaboratorDom.on('click',function (e) {
           clearCollaborateContainer(opt);
        });

    };
    // 出港协调窗口
    var collaborateDEP = function (opt) {
        // 获取协调DOM元素
        var collaboratorDom = $(CollaborateDom.DEP);
        $('#gbox_' + opt.tableId).append(collaboratorDom);
        // 定位协调DOM
        collaboratorDom.position({
            of: opt.cellObj,
            my: 'left top',
            at: 'right top'
        });
        collaboratorDom.on('click',function (e) {
           clearCollaborateContainer(opt);
        });

    };

    var fireData = function () {
        resizeToFitContainer(tableId);
        var arr = [];
        result.map(function (itme, i) {
            if(i %(index+3) == 1){
                var obj = {}
                for(var i in itme){
                    obj[i] = itme[i];
                }
                arr.push(obj);
            }
        })
        //数据填充
        $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: arr}).trigger('reloadGrid')
        $('#' + tableId).jqGrid('setFrozenColumns');
    };
    var initInquire = function () {
      $('.inquire', $canvas).off('click',inquireData).on('click',inquireData);
      $('.history-inquire',$canvas).off('click',historyInquire).on('click',historyInquire);
    };

    var inquireData = function () {
        updateTime();
        updateCondition();
        initTable();
        fireData();
    };

    var initDatePicker = function () {
        $('#bootstrap-modal-dialog-body .form-item .form-control').datepicker({
            language: 'zh-CN',
            // showOnFocus: false, //是否在获取焦点时显示面板 true显示 false不显示 默认true
            autoclose: true, //选择日期后自动关闭面板
            // clearBtn: true, //是否显示清空按钮
            //todayHighlight: true,
            // startDate: '0d', //可选日期的开始日期 0d:当前 -1d:当前的前1天, +1d:当前的后1天
            endDate: '-1d', //可选日期最后日期
            keepEmptyValues: true,
            // forceParse: true,
            //格式化
            format: 'yyyymmdd',
        });
        var now = $.getFullTime(new Date()).substring(0, 8);
        var preDay =$.addStringTime(now + '0000', 3600 * 1000 * 24 * -1);
        $('#bootstrap-modal-dialog-body .form-item .form-control').datepicker('setDate', $.parseFullTime(preDay));
    }

    var inquireHistoryData = function(){

        $('.history-inquire-btn').on('click',function () {
            updateHistoryTime();
            updateHistoryCondition();
            initHistoryTable();
            fireHistoryData();
        });

    };

    var updateHistoryTime = function(){
        var $canvas = $('.history-data');
        var time = formateTime($.getFullTime( new Date()));
        // $('.time', $canvas).text(' 数据生成时间: '+time);
        $('.time', $canvas).text(time).attr('title','数据生成时间: '+ time);
    };
    var updateHistoryCondition = function(){
        var $canvas = $('.history-data');
        var start = $('.start-date').val();
        var end = $('.end-date').val();
        $('.condition-panel .range', $canvas).html(start+' - ' + end).attr('title','起止日期: '+ start+' - ' + end);
        $('.condition-panel',$canvas).removeClass('hidden');
    };
    var initHistoryTable = function(){
        var tableId = 'history-table';
        var pagerId = 'history-table-pager';
        var table = $('#' + tableId).jqGrid({
            styleUI: 'Bootstrap',
            datatype: 'local',
            rownumbers: true,
            height: "auto",
            shrinkToFit: false,
            cmTemplate: {
                align: 'center',
                width: 100,
                resize: false
            },
            pager: pagerId,
            pgbuttons: false,
            pginput: false,
            colNames: preTableConfig.colName,
            colModel: preTableConfig.colModel,
            rowNum: 999999, // 一页显示多少条
            sortname: 'pid', // 初始化的时候排序的字段
            // sortorder: 'asc', //排序方式,可选desc,asc
            viewrecords: true,
            loadComplete: function (xhr) {
                var colTitle = tableConfig.colTitle;
                $.each(colTitle, function (i, e) {
                    $('#' + tableId).jqGrid('setLabel', i, '', [], {title: e});
                })
            },
            onCellSelect: function (rowid, index, contents, event) {

            }
        });
    };
    var fireHistoryData = function(){
        var tableId = 'history-table';
        resizeToFitContainer(tableId);
        /*var arr = [];
        var index = 1;
        result.map(function (itme, i) {
            if(i %(index+3) == 1){
                var obj = {}
                for(var i in itme){
                    obj[i] = itme[i];
                }
                arr.push(obj);
            }
        })*/
        //数据填充
        $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: preData}).trigger('reloadGrid')
        $('#' + tableId).jqGrid('setFrozenColumns');
    };



    var historyInquire = function () {
        createModal();
        initDatePicker();
        inquireHistoryData();
    };

    var createModal = function () {
        var str = '<div class="history-data"><ul class="form-panel" ><li class="form-item"><label>开始日期</label><input type="text" class="start-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><label>结束日期</label><input type="text" class="end-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><button class="atfm-btn atfm-btn-blue ladda-button history-inquire-btn" data-style="zoom-out"> <span class="ladda-label">查询</span> </button></li></ul> <ul class="condition-panel hidden"> <li class="form-item"> 当前查询条件: </li> <li class="form-item range"></li><li class="form-item"> 数据生成时间: </li>  <li class="form-item time"> </ul><div class="result-panel"> <table id="history-table"></table> <div id="history-table-pager"></div> </div></div>';
        var options = {
            title: '查询历史',
            content: str,
            status: 1, /* 1:正常 2:警告 3:危险 不填:默认情况*/ width: 1000,
            mtop : 200,
            showCancelBtn: false,
            isIcon : false
        };
        BootstrapDialogFactory.dialog(options);
    };

    var initComment = function () {
        index = $('.main-area section.active').index();
        $canvas = $('.'+moduleClass[index]);
        tableId = tableIDs[index];
        pagerId = pagerIDs[index];
        // 绑定Canvas事件，屏蔽表格区域内浏览器右键菜单
        $canvas.bind('mouseenter', function () {
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
        initInquire();
    };

    var initEvent = function(){
        $('.menu-bar li').on('click',function () {
            initComment();
        });
        $('.main-area section').on('click',function () {
            if($('.grid-table-collaborate-container').length > 0){
                clearCollaborateContainer();
            }
        })


    };

    return {
       init : function () {
           initComment();
           initEvent();

           $(window).resize(function () {
               resizeToFitContainer(tableId);
           })
       }
    }
}();

$(document).ready(function () {
   Demo.init();
});
