/**
 * Created by caowei on 2018/1/16.
 */
var alternateAirport = function () {
  //IP地址
  var ipHost = "http://localhost:8085/";
  //备降场表格对象
  var airVolumeTable = '';
  //当前显示模块
  var index = 0;
  //当前模块数组
  var moduleClass = ['arr-plan', 'pre-landing-plan', 'area-fly', 'dep-plan','alter_volume'];
  //备降场表格数据
  var data = {
    "generatetime": "201801221210",
    "status": 200,
    "availableCapacity": 0,
    "airportMessage": [
      {
        "airport": "ZWKL",
        "total": 0,
        "occupy": 0,
        "available": 0,
        "remark": "机位备注",
        "positionCapInfo": [{
          "airport": "ZWKL",
          "positionType": "C1",
          "capacity": 2,
          "available": 2,
          "occupy": 0
        }, {
          "airport": "ZWKL",
          "positionType": "C2",
          "capacity": 0,
          "available": 0,
          "occupy": 0
        }, {
          "airport": "ZWKL",
          "positionType": "DE",
          "capacity": 1,
          "available": 1,
          "occupy": 0
        }]
      },
      {
        "airport": "ZWKL",
        "total": 0,
        "occupy": 0,
        "available": 0,
        "remark": "机位备注",
        "positionCapInfo": [{
          "airport": "ZWKL",
          "positionType": "C1",
          "capacity": 2,
          "available": 2,
          "occupy": 0
        }, {
          "airport": "ZWKL",
          "positionType": "C2",
          "capacity": 0,
          "available": 0,
          "occupy": 0
        }, {
          "airport": "ZWKL",
          "positionType": "DE",
          "capacity": 1,
          "available": 1,
          "occupy": 0
        }]
      },
      {
        "airport": "ZWKL",
        "total": 0,
        "occupy": 0,
        "available": 0,
        "remark": "机位备注",
        "positionCapInfo": [{
          "airport": "ZWKL",
          "positionType": "C1",
          "capacity": 2,
          "available": 2,
          "occupy": 0
        }, {
          "airport": "ZWKL",
          "positionType": "C2",
          "capacity": 0,
          "available": 0,
          "occupy": 0
        }, {
          "airport": "ZWKL",
          "positionType": "DE",
          "capacity": 1,
          "available": 1,
          "occupy": 0
        }]
      }
    ]
  }
  //备降场表格列配置
  var dataConfig = {
    "status": 200,
    "generatetime": "201801221210",
    "result": [
      {
        "postionCap": [{
          "key": "C1total",
          "value": "C1",
          "text": "c1当前容量"
        }, {
          "key": "C1occupy",
          "value": "C1",
          "text": "c1占用"
        }, {
          "key": "C1available",
          "value": "C1",
          "text": "c1可用"
        },{
          "key": "C2total",
          "value": "C2",
          "text": "c2当前容量"
        }, {
          "key": "C2occupy",
          "value": "C2",
          "text": "c2占用"
        }, {
          "key": "C2available",
          "value": "C2",
          "text": "c2可用"
        },{
          "key": "DEtotal",
          "value": "DE",
          "text": "DE当前容量"
        }, {
          "key": "DEoccupy",
          "value": "DE",
          "text": "DE占用"
        }, {
          "key": "DEavailable",
          "value": "DE",
          "text": "DE可用"
        }]
      },
      {
        "arrFlightsScope": [{
          "key": "arrAll",
          "value": "1",
          "text": "进港全部"
        }, {
          "key": "arrUnLand",
          "value": "2",
          "text": "进港未落地"
        }]
      }]
  }
  //数据生成时间
  var generateTime = data.generatetime;
  //备降场表格配置
  var tableConfig = {
    colName: ['备降场', '合计可用'],
    colTitle: {
      airport: '备降场',
      total: '合计可用',
    },
    colModel: [{
      name: 'airport',
      index: 'airport'
    }, {
      name: 'total',
      index: 'total',
    }],
    data: [],
    typeArr:[]
  }
  //初始化组件
  var initComment = function () {
    // var url = ipHost + 'altf/airport/retrieveAirport'
    // $.ajax({
    //   type: "GET",
    //   url: url,
    //   data: "",
    //   dataType: "JSON",
    //   async: false,
    //   success: function (data) {
    //   },
    //   error: function (xhr, status, error) {
    //   }
    // });
    /**
     * 备降场容量表格列配置
     * @param obj
     * @param config
     */
    var colConfigConvert = function (obj,config) {
      $.each(obj,function (i,e) {
        if($.isValidObject(e.postionCap)){
          $.each(e.postionCap,function (index,ele) {
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
            index:'remark',
            name:'remark',
          };
          config.colModel.push(remark);
          config.colTitle['remark'] = '航班备注';
          config.colName.push('航班备注');
        }
      })
      return config;
    }
    /**
     *备降场数据转化
     * @param dataObj
     * @param config
     * @returns {*}
     */
    var airportDataConvert = function (dataObj, config) {
      var typeArr = tableConfig.typeArr;
      $.each(dataObj, function (i, e) {
        var obj = {};
        obj['airport'] = e.airport;
        obj['total'] = e.total;
        obj['remark'] = e.remark;
        $.each(e.positionCapInfo, function (index, ele) {
          $.each(typeArr, function (j, m) {
            if (m == ele.positionType) {
              obj[m + 'total'] = ele.capacity;
              obj[m + 'available'] = ele.available;
              obj[m + 'occupy'] = ele.occupy;
            }
          })
        })
        config.data.push(obj);
      })
      return config;
    }
    //切换页面点击事件
      $.jgrid.gridUnload('alernate_flight_grid_table');
      index = $('.main-area section.active').index();
      var canvas = $('.' + moduleClass[index]);
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
      tableConfig = colConfigConvert(dataConfig.result,tableConfig)
      tableConfig = airportDataConvert(data.airportMessage, tableConfig)
      if (!$.isValidObject(airVolumeTable)) {
        dataStyleConvert(tableConfig.data)
        initGridTable(tableConfig, 'alernate_flight_grid_table', 'ale-datas-pager')
      } else {
        $.jgrid.gridUnload('alernate_flight_grid_table');
        initGridTable(tableConfig, 'alernate_flight_grid_table', 'ale-datas-pager')
      }
  }
  /**
   *@method initGridTable 初始化页面主表
   * @param config 对应表格配置
   * @param tableId 表格的tableId
   * @param pagerId 表格统计条数的pagerId
   */
  var initGridTable = function (config, tableId, pagerId) {
    airVolumeTable = $('#' + tableId).jqGrid({
      styleUI: 'Bootstrap',
      datatype: 'local',
      rownumbers: true,
      height: "auto",
      shrinkToFit: true,
      cmTemplate: {
        align: 'center',
        resize: false,
        cellattr: setTableColor,
        // width: 155
      },
      pager: pagerId,
      pgbuttons: false,
      pginput: false,
      colNames: config.colName,
      colModel: config.colModel,
      rowNum: 999999, // 一页显示多少条
      // sortname: 'aircraftType', // 初始化的时候排序的字段
      // sortorder: 'asc', //排序方式,可选desc,asc
      viewrecords: true,
      loadComplete: function (xhr) {
        var colTitle = config.colTitle;
        $.each(colTitle, function (i, e) {
          $('#' + tableId).jqGrid('setLabel', i, '', [], {title: e});
        })
      },
      onRightClickRow: function (rowid, iRow, iCol, e) {
        var colModel = airVolumeTable.jqGrid('getGridParam', 'colModel');
        var colName = colModel[iCol].name;
        // 当前行数据
        var rowData = airVolumeTable.jqGrid().getRowData(rowid);
        // 获取触发事件的单元格对象
        var cellObj = $(e.target);
        var opt = {
          rowid: rowid,
          iRow: iRow,
          iCol: iCol,
          table: airVolumeTable,
          tableId: tableId,
          rowData: rowData,
          cellObj: cellObj
        }
        if (colName.indexOf('total') > 0) {
          onRightClickRow(opt)
        }
      }
    })
    resizeToFitContainer('alernate_flight_grid_table')
    //数据填充
    $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: config.data}).trigger('reloadGrid')
    $('#' + tableId).jqGrid('setFrozenColumns')
    $(window).resize(function () {
      if(index == 4){
        resizeToFitContainer('alernate_flight_grid_table')
      }
    })
  };

  /**
   *备降场表格样式转换
   * @param data
   * @param colName
   */
  function dataStyleConvert(data) {
    $.each(data, function (i, e) {
      if (parseInt(e.total) > 3) {
        e['total_style'] = 'background:#fff;color:#000'
      } else if (parseInt(e.total) <= 3 && parseInt(data.total) != 0) {
        e['total_style'] = 'background:#ee7948;color:#fff'
      } else if (parseInt(e.total) == 0) {
        e['total_style'] = 'background:#ee7948;color:#000'
      }
      // e['C2total_style'] = 'background:#dff0d8;color:#000'
      // e['C1total_style'] = 'background:#dff0d8;color:#000'
      // e['DEavailable_style'] = 'background:#dff0d8;color:#000'
    })
  }

  /**
   *表格右键协调操作
   * @param opt
   */
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

    //容量
    if (currentModulee == 'alter_volume') {
      collaborateAlter(opt);
    }


  };
  /**
   *添加右键协调操作DOM
   * @param opt
   */
  var collaborateAlter = function (opt) {
    // 获取协调DOM元素
    var collaboratorDom = $(CollaborateDom.CAPACITY);
    $('#gbox_' + opt.tableId).append(collaboratorDom);
    // 定位协调DOM
    collaboratorDom.position({
      of: opt.cellObj,
      my: 'left top',
      at: 'right top'
    });
    $('#modificate_volume').on('click', function () {
      getNewVolume()
    })
    $('#cancale').on('click', function () {
      clearCollaborateContainer();
    })
  };

  /**
   * 修改当前容量
   */
  function getNewVolume() {

  }

  /**
   *清除协调窗口
   */
  var clearCollaborateContainer = function () {
    $('.selected-cell').removeClass('selected-cell');
    $('.flight-grid-table-collaborate-container').remove();
  }

  /**
   *表格适配尺寸方法
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

  return {
    init: function () {
      initComment();
    }
  }
}();
$(document).ready(function () {
  alternateAirport.init();
});