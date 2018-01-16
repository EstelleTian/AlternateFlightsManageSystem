/**
 *
 */

var Demo = function () {

    var $canvas = $('.arr');
    var table = null;
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
            alterPart:'',
            status:'',
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
        $('.condition-panel').removeClass('hidden');
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
        /*$('#' + tableId).jqGrid('navGrid', '#' + pagerId, {
            add: false,
            edit: false,
            view: false,
            del: false,
            search: false,
            refresh: false
        });*/

        $(window).resize(function () {
            // $('#' + tableId).jqGrid('setFrozenColumns');
            resizeToFitContainer(tableId);
        })
    };


    var fireData = function () {
        //数据填充
        $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: result}).trigger('reloadGrid')
        $('#' + tableId).jqGrid('setFrozenColumns');
        //尺寸计算表格适配内容大小
        resizeToFitContainer(tableId);
    };
    var Inquire = function () {
      $('.inquire', $canvas).on('click',function () {
          updateTime();
          updateCondition();
          initTable();
          fireData();
      });
    };

    var toggleRange = function () {
        $('.form-panel .range').on('change',function () {
            console.log($(this).val());
        });
    }



    return {
       init : function () {
           Inquire();
           // toggleRange();
       }
    }
}();

$(document).ready(function () {
   Demo.init();
});
