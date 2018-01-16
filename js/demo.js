/**
 *
 */

var Demo = function () {
    var modulClass = ['arr-plan','pre-landing-plan','area-fly','dep-plan'];
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
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
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
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
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
            pETD:'10/15:15',
            dyETD:'10/15:15',
            ATD:'10/15:24',
            pETA:'10/18:49',
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
            shrinkToFit: false,
            cmTemplate: {
                align: 'center',
                width: 150,
                resize: false
            },
            pager: pagerId,
            pgbuttons: false,
            pginput: false,
            colNames: tableConfig.colName,
            colModel: tableConfig.colModel,
            rowNum: 999999, // 一页显示多少条
            // sortname: 'time', // 初始化的时候排序的字段
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

    var inquireHistoryData = function(){
        
    };

    var historyInquire = function () {
        createModal();
        inquireHistoryData();
    };

    var createModal = function () {
        var str = '<div class="history-data"><ul class="form-panel" ><li class="form-item"><label>开始日期</label><input type="text" class="start-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><label>结束日期</label><input type="text" class="end-date form-control" maxlength="8" value="" readonly></li><li class="form-item"><button class="atfm-btn atfm-btn-blue ladda-button history-inquire-btn" data-style="zoom-out"> <span class="ladda-label">查询</span> </button></li></ul> <ul class="condition-panel hidden"> <li class="form-item"> 当前查询条件: </li> <li class="form-item range"></li>  </ul><div class="result-panel"> <table id="history-table"></table> <div id="history-table-pager"></div> </div></div>';
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
        $canvas = $('.'+modulClass[index]);
        tableId = tableIDs[index];
        pagerId = pagerIDs[index];
        initInquire();
    };

    var initEvent = function(){
        $('.menu-bar li').on('click',function () {
            initComment();
        });
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
