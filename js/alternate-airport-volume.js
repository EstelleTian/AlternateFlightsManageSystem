/**
 * Created by caowei on 2018/1/16.
 */
var alternateAirport = function () {
  /**
   * 导航事件
   * */
  var initNavTabEvent = function () {
    //导航栏
    var tabPage = [$('.fly_time'), $('.ter_time'), $('.fly_in_show'), $('.out_show'), $('.content_show')]
    var nav = $('#nav');
    $('.nav li', nav).on('click', function () {
      // 更新当前nav索引
      stateIndex = $(this).index();
      tabToggle(stateIndex, tabPage)
    });
  }
  /*
   * tab页状态切换
   * */
  var tabToggle = function (tabIndex, tabPage) {
    $.each(tabPage, function (i, e) {
      if (i == tabIndex) {
        e.removeClass('hide')
        e.addClass('show');
      } else {
        e.removeClass('show')
        e.addClass('hide');
      }
    })
  }
  $('.alternate-airport').on('click', function () {
    var tableConfig = {
      colName: ['备降场', '合计可用', 'C2当前容量', 'C2占用', 'C2可用', 'C1当前容量', 'C1占用', 'C1可用', 'DE当前容量', 'DE占用', 'DE可用', '机位备注'],
      colTitle: {
        flyDepPointType: '备降场',
        point: '合计可用',
        rdepAvgTime: 'C2当前容量',
        rdepMeTime: 'C2占用',
        schMeDis: 'C2可用',
        fplMeDis: 'C1当前容量',
        depMeDis: 'C1占用',
        dyn10mMeDis: 'C1可用',
        dyn20mMeDis: 'DE当前容量',
        schAvgDis: 'DE占用',
        fplAvgDis: 'DE可用',
        depAvgDis: '机位备注',
      },
      colModel: [{
        name: 'flyDepPointType',
        index: 'flyDepPointType',
        width: 120,
        frozen: true
      },{
        name: 'point',
        index: 'point',
      },{
        name: 'rdepAvgTime',
        index: 'rdepAvgTime'
      }, {
        name: 'rdepMeTime',
        index: 'rdepMeTime'
      }, {
        name: 'schMeDis',
        index: 'schMeDis'
      }, {
        name: 'fplMeDis',
        index: 'fplMeDis'
      }, {
        name: 'depMeDis',
        index: 'depMeDis'
      }, {
        name: 'dyn10mMeDis',
        index: 'dyn10mMeDis'
      }, {
        name: 'dyn20mMeDis',
        index: 'dyn20mMeDis'
      }, {
        name: 'schAvgDis',
        index: 'schAvgDis'
      }, {
        name: 'fplAvgDis',
        index: 'fplAvgDis'
      }, {
        name: 'depAvgDis',
        index: 'depAvgDis'
      }],
      data: [{
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZWAK',
        point: 2,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZWAT',
        point: 4,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: '正常机位总计',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: '',
      }, {
        flyDepPointType: 'ZLDH',
        point: 6,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 9,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4'
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }, {
        flyDepPointType: 'ZLDH',
        point: 0,
        rdepAvgTime: 2,
        rdepMeTime: 3,
        schMeDis: 5,
        fplMeDis: 6,
        depMeDis: 6,
        dyn10mMeDis: 2,
        dyn20mMeDis: 5,
        schAvgDis: 0,
        fplAvgDis: 3,
        depAvgDis: 'ZLJQ4',
      }]
    }
    $.jgrid.gridUnload('alernate_flight_grid_table');
    dataStyleConvert(tableConfig.data,'point')
    dataStyleConvert(tableConfig.data, 'rdepAvgTime')
    dataStyleConvert(tableConfig.data, 'fplMeDis')
    dataStyleConvert(tableConfig.data, 'dyn20mMeDis')
    initGridTable(tableConfig, 'alernate_flight_grid_table', 'ale-datas-pager')
  });
  /**
   *@method initGridTable 初始化页面主表
   * @param config 对应表格配置
   * @param tableId 表格的tableId
   * @param pagerId 表格统计条数的pagerId
   */
  var initGridTable = function (config, tableId, pagerId) {
    var table = $('#' + tableId).jqGrid({
      styleUI: 'Bootstrap',
      datatype: 'local',
      rownumbers: true,
      height: "auto",
      shrinkToFit: false,
      cmTemplate: {
        align: 'center',
        resize: false,
        width: 155
      },
      pager: pagerId,
      pgbuttons: false,
      pginput: false,
      colNames: config.colName,
      colModel: config.colModel,
      rowNum: 999999, // 一页显示多少条
      sortname: 'aircraftType', // 初始化的时候排序的字段
      // sortorder: 'asc', //排序方式,可选desc,asc
      viewrecords: true,
      loadComplete: function (xhr) {
        var colTitle = config.colTitle;
        $.each(colTitle, function (i, e) {
          $('#' + tableId).jqGrid('setLabel', i, '', [], {title: e});
        })
      }
    })
    //数据填充
    $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: config.data}).trigger('reloadGrid')
    $('#' + tableId).jqGrid('navGrid', '#' + pagerId, {
      add: false,
      edit: false,
      view: false,
      del: false,
      search: false,
      refresh: false
    });
    $('#' + tableId).jqGrid('setFrozenColumns')
    $(window).resize(function () {
      resizeToFitContainer('alernate_flight_grid_table')
    })
  };

  /**
   *
   * @param data
   * @param colName
   */
  function dataStyleConvert(data, colName) {
    //合计可用列样式配置
    if (colName == 'point') {
      $.each(data,function (i,e) {
        $.each(e,function (index,ele) {
            if(parseInt(ele) == 0){
              e[index + '_style'] = 'background:#dbc3be,color:gray'
            }
        })
      })
      $.each(data, function (i, e) {
        if (parseInt(e.point) > 3) {
          e[colName + '_style'] = 'background:#fff;color:#000'
        } else if (parseInt(e.point) <= 3 && parseInt(data.point) != 0) {
          e[colName + '_style'] = 'background:red;color:#fff'
        } else if (parseInt(e.point) == 0) {
          e[colName + '_style'] = 'background:red;color:#000'
        }
      })
    }
    if (colName == 'rdepAvgTime'|| colName == 'fplMeDis'||colName == 'dyn20mMeDis'){
      $.each(data, function (i, e) {
          e[colName + '_style'] = 'background:#dff0d8;color:#000'
      })
    }
      }

  /**
   *
   * @param tableId
   */
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


  /**
   *
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

  return {
    init: function () {
      initNavTabEvent();
    }
  }
}();
$(document).ready(function () {
  alternateAirport.init();
});