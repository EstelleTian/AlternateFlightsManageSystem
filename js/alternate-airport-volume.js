/**
 * Created by caowei on 2018/1/16.
 */
var alternateAirport = function () {
  //IP地址
  var ipHost = "http://192.168.243.104:8085/";
  //备降场表格对象
  var airVolumeTable = '';
  //备降场表格原始数据
  var tableData = '';
  //备降场表格列配置
  var dataColConfig = '';
  //表单以及右键配置项
  var airportConfig = '';
  //备降场表格配置
  var tableConfig = {
    colName: ['备降场 ', '合计可用 '],
    colTitle: {
      airport: '备降场 ',
      total: '合计可用 ',
    },
    colModel: [{
      name: 'airport',
      index: 'airport'
    }, {
      name: 'total',
      index: 'total',
    }],
    data: [],
    typeArr: []
  }
  //定时器总开关
  var isRefresh = true;
  //当前选中单元格对象
  var cellObj = '';
  //定时刷新时间
  var refreshTime = 1000 * 30;
  //初始化表格
  var initDataBasic = function () {
    $.jgrid.gridUnload('alernate_flight_grid_table');
    //阻止右键点击默认事件
    preventDefaultEvent()
    getTableColmodel(dataColConfig, isRefresh);
  }
  /**
   *设置表格下方文本
   * @param textObj
   */
  var setDownText = function (textObj) {
    $.each(textObj.postionCategoryAirtype,function (i,e) {
      var str = '<p><span>'+e.remark+':</span><span>'+e.value+'</span></p>';
      str = $(str);
      $('.des')[0].insertBefore(str[0],$('.tip_container')[0]);
    })
  }
  /**
   *获取表格列配置
   */
  var getTableColmodel = function () {
    var url = ipHost + 'altf/airport/retrieveAirportConfig'
    $.ajax({
      type: "GET",
      url: url,
      data: "",
      dataType: "JSON",
      async: false,
      success: function (data) {
        if ($.isValidObject(data)&&data.status == 200) {
          airportConfig = data;
          colConfigConvert(airportConfig.airportConfig,tableConfig)
          getTableData(tableConfig,isRefresh);
          setDownText(airportConfig.airportConfig)
        } else if(data.status == 500) {
          console.warn(data.error.message)
        }else{
          console.warn('获取机场配置为空')
        }
      },
      error: function (xhr, status, error) {
        console.error(error)
      }
    });
  }
  /**
   * 获取表格数据
   */
  var getTableData = function ( tableConfig, isRefresh) {
    var url = ipHost + 'altf/airport/retrieveAirport'
    $.ajax({
      type: "GET",
      url: url,
      data: "",
      dataType: "JSON",
      async: false,
      success: function (data) {
        if ($.isValidObject(data)&& data.status == 200) {
          tableData = data;
          var generateTime = data.generateTime
          $('.alter_volume_time').text('数据生成时间:' + formatterTime(generateTime))
          $('.available_capacity').text(data.availableCapacity)
          //data转换
          tableConfig = dataConfigConvert(data.airportMessage, tableConfig)
          if (!$.isValidObject(airVolumeTable)) {
            //列配置设置
            dataColConfig = tableConfig.colModel;
            // 初始化表格
            initGridTable(tableConfig, 'alernate_flight_grid_table', 'ale-datas-pager')
          } else {
            // 数据更新
            airVolumeTable.jqGrid('setGridParam', tableConfig.data).trigger('reloadGrid');
          }
          if (isRefresh) {
            startTimer(getTableData, tableConfig, isRefresh, refreshTime);
          }
        }else if(data.status ==500){
          console.warn(data.error.message)
        }
      },
      error: function (xhr, status, error) {
        console.warn(error)
      }
    });
  }
  /**
   * 修改机场容量qtip提示
   * @param cellObj
   * @param state
   */
  var showQtip = function (cellObj, state) {
    var styleClasses = 'qtip-green';
    var tipMesssage = ' '
    if (state) {
      styleClasses = 'qtip-green-custom qtip-rounded';
      tipMesssage = '修改成功'
    } else {
      tipMesssage = '修改失败'
      styleClasses = 'qtip-red-custom qtip-rounded';
    }
    cellObj.qtip({
      content: {
        text: tipMesssage,
      },
      position: {
        my: 'bottom center', // 同jQueryUI Position
        at: 'top center',
      },
      style: {
        classes: styleClasses
      },
      // 显示配置
      show: {
        delay: 0,
        target: cellObj,
        ready: true, // 初始化完成后马上显示
        effect: function () {
          $(this).fadeIn(); // 显示动画
        }
      },
      // 隐藏配置
      hide: {
        target: cellObj, // 指定对象
        event: 'scroll unfocus click', // 失去焦点时隐藏
        effect: function () {
          $(this).fadeOut(); // 隐藏动画
        },
      },
    })
    setTimeout(function () {
      cellObj.qtip('destroy', true);
    }, 3000)
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
        width: 120
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
        if (colName.indexOf('total') > 0) {
          // 当前行数据
          var rowData = airVolumeTable.jqGrid().getRowData(rowid);
          // 获取触发事件的单元格对象
          cellObj = $(e.target);
          var type = colName.split('total');
          var opt = {
            rowid: rowid,
            iRow: iRow,
            iCol: iCol,
            airport: rowData.airport,
            type: type[0],
            cellObj: cellObj
          }
          onRightClickRow(opt)
        }
      }
    })
    resizeToFitContainer('alernate_flight_grid_table')
    //数据填充
    $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: config.data}).trigger('reloadGrid')
    // $('#' + tableId).jqGrid('setFrozenColumns')
  };

  $(window).resize(function () {
    tableContainerFit();
    resizeToFitContainer('alernate_flight_grid_table');
  })
  /**
   * 表格高度计算
   */
  var tableContainerFit = function () {
    var thisProxy = $('.alter_volume');
    // 容器
    var $container = $('.app-transition');
    // 导航栏
    var $nav = $('.navbar',$container);
    // 菜单栏
    var $menu = $('.menu-bar', $container);
    // 主显示区
    var $main = $('.main-area');
    // 模块头部
    var $head = $('.panel-heading',thisProxy);
    // 模块体
    var $body = $('.panel-body', thisProxy);
    // 模块内的合计可用
    var $form = $('.sub_title', thisProxy);
    // 模块内的底部模块
    var $condition = $('.des', thisProxy);
    // 模块内数据结果可视化区
    var $result = $('.table-contianer', thisProxy);
    // 求得主显示区高度:(总高度-导航栏-菜单栏-主显示区外边距)
    var mainHeight = $container.outerHeight() - $nav.outerHeight(true) -$menu.outerHeight(true) - $main.css('marginTop').replace('px', '')*1- $main.css('marginBottom').replace('px', '')*1;
    // 求得模块体高度:(主显示区高度-模块体内边距)
    var bodyHeight = mainHeight - $body.css('paddingTop').replace('px', '')*1 - $body.css('paddingBottom').replace('px', '')*1;
    // 求得模块内数据结果可视化区高度:(模块体高度-模块头-模块内的表单栏-模块内的当前查询条件栏)
    var h =bodyHeight - $head.outerHeight()-$head.css('marginBottom').replace('px', '')*1 - $form.outerHeight() - $condition .outerHeight();
    // 设置模块内数据结果可视化区高度
    $result.height(h);
  }

  /**
   * 表格配置以及参数数据转换
   * @param dataObj
   * @param config
   * @returns {*}
   */
  var dataConfigConvert = function (dataObj, config) {
    //data数据填充
    $.each(dataObj, function (i, e) {
      var obj = {};
      obj['airport'] = e.airport;
      obj['total'] = e.total;
      obj['remark'] = e.remark;
      $.each(e.positionCapInfo, function (index, ele) {
        $.each(config.typeArr, function (j, m) {
          if (m == ele.positionType) {
            obj[m + 'total'] = ele.capacity;
            obj[m + 'available'] = ele.available;
            obj[m + 'occupy'] = ele.occupy;
          }
        })
      })
      config.data.push(obj);
    })
    // 表格样式转化
    $.each(config.data, function (i, e) {
      if (parseInt(e.total) > 3) {
        e['total_style'] = 'background:#fff;color:#000'
      } else if (parseInt(e.total) <= 3 && parseInt(config.data.total) != 0) {
        e['total_style'] = 'background:#ee7948;color:#fff'
      } else if (parseInt(e.total) == 0) {
        e['total_style'] = 'background:#ee7948;color:#000'
      }
      // e['C2total_style'] = 'background:#dff0d8;color:#000'
      // e['C1total_style'] = 'background:#dff0d8;color:#000'
      // e['DEavailable_style'] = 'background:#dff0d8;color:#000'
    })
    return config;
  }
  var colConfigConvert = function (colObj,config) {
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
    config.colTitle['remark'] = '航班备注';
    config.colName.push('航班备注');
  }

  /**
   *表格右键协调操作
   * @param opt
   */
  var onRightClickRow = function (opt) {

    // 清除协调窗口
    clearCollaborateContainer(opt);
    // 记录当前选中的单元格对象
    opt.cellObj.addClass('selected-cell');
    //容量
    if ($('.alter_volume').is(":visible")) {
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
    //表单验证绑定
    var form = collaboratorDom.find('form');
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
          }
        }
      }
    });
    $('#gbox_' + opt.tableId).append(collaboratorDom);
    // 定位协调DOM
    collaboratorDom.position({
      of: opt.cellObj,
      my: 'left top',
      at: 'right top'
    });
    $('#modificate_volume').on('click', function () {
      //获取验证结果
      var bootstrapValidator = form.data('bootstrapValidator');
      var capacity = form.find('#flightId').val();
      var airport = opt.airport;
      var type = opt.type;

      //手动再次触发验证
      bootstrapValidator.validate();
      if (bootstrapValidator.isValid()) {
        getNewVolume(airport,capacity,type)
      }
    })
    $('#cancale').on('click', function () {
      clearCollaborateContainer();
    })
    $('.modal-close-btn').on('click', function () {
      clearCollaborateContainer();
    })
  };

  /**
   * 修改当前容量
   */
  function getNewVolume(airport,capacity,type) {
    var url = ipHost + 'altf/airport/updatePositionCap'
    // $.ajax({
    //   type: "POST",
    //   url: url,
    //   data:{
    //     airport:airport,
    //     capacity:capacity,
    //     type:type,
    //   },
    //   dataType: "JSON",
    //   async: false,
    //   success: function (data) {
    //     console.log(data);
    //     if($.isValidObject(data)){
    //
    //     }
    //   },
    //   error: function (xhr, status, error) {
    //   }
    // });
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

  /**
   * 定时器
   * @param func
   * @param instance
   * @param isNext
   * @param time
   */
  var startTimer = function (func, instance, isNext, time) {
    if (typeof func == "function") {
      setTimeout(function () {
        func(instance, isNext);
      }, time);
    }
  };
  /**
   * 表格单条数据更新
   * @param tableObj
   * @param rowid
   * @param rowData
   */
  var fireSingleDataChange = function (tableObj, rowid, rowData) {
    // 表格数据ID集合
    var ids = tableObj.jqGrid('getDataIDs');
    var f = tableObj.jqGrid('delRowData', rowid);
    if (f) {
      // 再原数据的前一位之后插入新数据
      if (index >= 2) {
        tableObj.jqGrid('addRowData', rowid, rowData, 'after', ids[index - 2]);
      } else {
        tableObj.jqGrid('addRowData', rowid, rowData, 'first');
      }
    }

  }
  /**
   * 时间格式化
   * @param time
   * @returns {string}
   */
  var formatterTime = function (time) {
    var year = time.substring(0, 4);
    var mon = time.substring(4, 6);
    var date = time.substring(6, 8);
    var hour = time.substring(8, 10);
    var min = time.substring(10, 12);
    var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
    return str;
  }

  return {
    init: function () {
      initDataBasic();
      tableContainerFit();
    },
    airportConfig:airportConfig
  }
}();
$(document).ready(function () {
  alternateAirport.init();
});