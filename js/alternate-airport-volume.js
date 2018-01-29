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
  /**
   * 初始化表格
   */
  var initDataBasic = function () {
    $.jgrid.gridUnload('alernate_flight_grid_table');
    //阻止右键点击默认事件
    preventDefaultEvent()
    Promise.all([
      getTableColmodel(dataColConfig, isRefresh), getTableData(tableConfig, isRefresh)
    ])
  }
  /**
   * 初始化用户信息
   */
  var initSystemParam = function () {
    var userName = sessionStorage.getItem('userName');
    var loginTime  = sessionStorage.getItem('loginTime');
    if(userName == undefined || loginTime == undefined){
      var option = {
        title: '警告',
        content: '用户未登录,请登录！',
        showCancelBtn: false,
        status: 2,
        buttons: [
          {
            name: '确定',
            isHidden: false,
            status: 2,
            callback:function () {
              window.location = "index.html";
            }
          }
        ]
      }
      BootstrapDialogFactory.dialog(option)
      return
    }
    $('.login-time').text('登陆时间：'+formatterTime(loginTime));
    $('.user-name').text(userName);
  }
  /**
   *设置表格下方文本
   * @param textObj
   */
  var setDownText = function (textObj) {
    $.each(textObj.postionCategoryAirtype, function (i, e) {
      var str = '<p><span class="total_count">' + e.remark + '：</span><span>' + e.value + '</span></p>';
      str = $(str);
      $('.des')[0].insertBefore(str[0], $('.tip_container')[0]);
    })
  }
  /**
   *获取表格列配置
   */
  var getTableColmodel = function () {
    return new Promise(function (resolve, reject) {
      var url = ipHost + 'altf/airport/retrieveAirportConfig'
      $.ajax({
        type: "GET",
        url: url,
        data: "",
        dataType: "JSON",
        // async: false,
        success: function (data) {
          if ($.isValidObject(data) && data.status == 200) {
            airportConfig = data;
            alternateAirport.airportConfig = data;
            colConfigConvert(airportConfig.airportConfig, tableConfig)
            setDownText(airportConfig.airportConfig)
          } else if (data.status == 500) {
            console.warn(data.error.message)
          } else {
            console.warn('获取机场配置为空')
          }
          resolve(tableConfig);
        },
        error: function (xhr, status, error) {
          console.error(error)
        }
      });
    })

  }
  /**
   * 获取表格数据
   * @param tableConfig
   * @param isRefresh
   */
  var getTableData = function (tableConfig, isRefresh) {
    return new Promise(function (resolve, reject) {
      var url = ipHost + 'altf/airport/retrieveAirport'
      $.ajax({
        type: "GET",
        url: url,
        data: "",
        dataType: "JSON",
        // async: false,
        success: function (data) {
          if ($.isValidObject(data) && data.status == 200) {
            tableData = data;
            var generateTime = data.generateTime
            $('.alter_volume_time').text('数据生成时间:' + formatterTime(generateTime))
            $('.available_capacity').text(data.availableCapacity).attr('title',data.availableCapacity)
            //data转换
            tableConfig = dataConfigConvert(data.airportMessage, tableConfig)
            if (!$.isValidObject(airVolumeTable)) {
              //列配置设置
              dataColConfig = tableConfig.colModel;
              // 初始化表格
              if(tableConfig.colModel.length > 3){
                initGridTable(tableConfig, 'alernate_flight_grid_table', 'ale-datas-pager')
              }else{
                setTimeout(initGridTable(tableConfig, 'alernate_flight_grid_table', 'ale-datas-pager'),500)
              }
            } else {
              // 数据更新
              airVolumeTable.jqGrid('setGridParam', tableConfig.data).trigger('reload');
            }
            //resolve(tableConfig);
            if (isRefresh) {
              startTimer(getTableData, tableConfig, isRefresh, refreshTime);
            }
          } else if (data.status == 500) {
            console.warn(data.error.message)
          }
        },
        error: function (xhr, status, error) {
          console.warn(error)
        }
      });
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
        container: opt.positionContainer,
        adjust: {
          resize: true,
          scroll: true
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
        target:opt.positionContainer , // 指定对象
        event: 'scroll  click', // 失去焦点时隐藏
        effect: function () {
          $(this).fadeOut(); // 隐藏动画
        },
      },
      events:{
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
        width: 120,
        sortfunc: sortNum
      },
      pager: pagerId,
      pgbuttons: false,
      pginput: false,
      colNames: config.colName,
      colModel: config.colModel,
      rowNum: 999999, // 一页显示多少条
      sortname: 'airport', // 初始化的时候排序的字段
      sortorder: 'asc', //排序方式,可选desc,asc
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
          var currentVal = rowData[colName];
          // 获取触发事件的单元格对象
          cellObj = $(e.target);
          var type = colName.split('total');
          var opt = {
            rowid: rowid,
            iRow: iRow,
            iCol: iCol,
            tableId: tableId,
            airport: rowData.airport,
            type: type[0],
            cellObj: cellObj,
            currentVal: currentVal,
            positionContainer: $(".table-contianer .ui-jqgrid-bdiv")
          }
          onRightClickRow(opt)
        }
      }
    })
    airVolumeTable.jqGrid('resizeSize');
    //数据填充
    $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: config.data}).trigger('reloadGrid')
    // $('#' + tableId).jqGrid('setFrozenColumns')
  };

  $(window).resize(function () {
    airVolumeTable.jqGrid('resizeSize');
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
    } else {
      // 单条数据转换
      var obj = {};
      obj['airport'] = dataObj.airport;
      obj['total'] = dataObj.total;
      obj['remark'] = dataObj.remark;
      $.each(dataObj.positionCapInfo, function (index, ele) {
        $.each(config.typeArr, function (j, m) {
          if (m == ele.positionType) {
            obj[m + 'total'] = ele.capacity;
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
  /**
   * 表格列配置转换
   * @param colObj
   * @param config
   */
  var colConfigConvert = function (colObj, config) {
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
  }

  /**
   *表格右键协调操作
   * @param opt
   */
  var onRightClickRow = function (opt) {

    // 清除协调窗口
    clearCollaborateContainer();
    // 记录当前选中的单元格对象
    opt.cellObj.addClass('selected-cell');
    //修改容量值
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
    var dom = GridTableCollaborateDom.CAPACITY;
    if(!$.isValidVariable(dom)){
      return;
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
  };

  /**
   * 修改当前容量值
   * @param capacity
   * @param opt
   */
  function getNewVolume(capacity, opt) {
    var loading = Ladda.create($('.collaborate-content-level')[0])
    loading.start();
    var url = ipHost + 'altf/airport/updatePositionCap'
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
   * @param opt
   * @param rowData
   */
  var fireSingleDataChange = function (tableObj, opt, rowData) {
    // 表格数据ID集合
    var ids = tableObj.jqGrid('getDataIDs');
    // 当前所在行序列
    var index = tableObj.jqGrid('getInd', opt.rowid);
    var f = tableObj.jqGrid('delRowData', opt.rowid);
    if (f) {
      // 再原数据的前一位之后插入新数据
      if (index >= 2) {
        tableObj.jqGrid('addRowData', opt.rowid, rowData.data[0], 'after', ids[index - 2]);
        clearCollaborateContainer()
        var newCellObj = getCellObject(opt.rowid, opt.iRow, opt.iCol)
        opt.cellObj = newCellObj;
        showQtip(opt, true)
      } else {
        tableObj.jqGrid('addRowData', opt.rowid, rowData.data[0], 'first');
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
    if($.isValidVariable(time)){
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
      return airVolumeTable.find('tr#' + rowid).find('td').eq(colIndex);
    } else {
      return airVolumeTable.find('tr#' + rowid).find('td').eq(iCol);
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

    airVolumeTable.parents(".ui-jqgrid-bdiv").off('scroll', position).on('scroll', position);
  };
  /**
   * 用户登出
   */
  var userLogOut = function () {
    $(".user_logout").click(function () {
      $.ajax({
        type: "POST",
        url: ipHost + "altf/logon/userLogout/",
        data: {

        },
        success: function (data) {
          if ($.isValidObject(data)&&data.status ==200) {
            sessionStorage.removeItem("userName","");
            sessionStorage.removeItem("loginTime","");
            window.location = "index.html";
          }
          if(data.status == 500){
            alert(data.error.message + '请稍候再试!')
          }
        },
        error: function () {
          console.error('retrieve statistic data failed, state:');
          console.error(status);
        }
      })
    })
  }
  return {
    init: function () {
      initSystemParam();//初始化用户信息
      initDataBasic();//初始化数据基础
      userLogOut();//用户登出事件
    },
    airportConfig: airportConfig //表格以及页面参数配置
  }
}();
$(document).ready(function () {
  alternateAirport.init();
});