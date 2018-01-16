var PredictionData = function () {
  //Ip地址
  var ipHost = 'http://192.168.208.21:8080/module-trajectoryCorrect-service/trajectory/';
  // 当前nav索引
  var stateIndex = 0;
  //状态与地址对应关系
  var searchUrl ={
    fly:ipHost + 'correct/',
    ter:ipHost + 'correct/point/',
    pre:ipHost + 'flight/'
  }
  //根据索引获取当前页面状态数组
  var stateArr = ['fly','ter','pre']
  /*
   * 表单查询对象
   * */
  var DataForm = {
    startDate: '',
    endDate: '',
    currentType: '',
    currentStatus: '',
    airportName: ''
  }
  /*
   * 数据对象
   * */
  var tableDataConfigs = tableDataConfig();
  /*
   * 表格对象
   * */
  var tableObject = {
    flyTableObj: 'flight_grid_table',
    terTableObjTop: 't_flight_grid_table',
    terTableObjDown: 'd_flight_grid_table',
    preTableObj: 'precision_flight_grid_table'
  }
  // 初始化组件
  var initComponent = function () {
    //初始化日历插件datepicker
    initDatepicker('.fly_time ');
    initDatepicker('.ter_time ');
    initPreDatapicker();
    // 设置默认时间
    setDefaultDates();
    //绑定Window事件，窗口变化时重新调整表格大小
    initDocumentResize();

  };
  // 初始化事件绑定
  var initEvent = function () {
    // 导航点击事件
    initNavTabEvent();
    // 提交按钮
    initSubmitEvent();
  };

  /**
   * 导航事件
   * */

  var initNavTabEvent = function () {
    //导航栏
    var tabPage = [$('.fly_time'), $('.ter_time'),$('.fly_in_show'),$('.out_show'),$('.content_show')]
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
  /*
   * 清空页面数据
   * */
  var clearData = function (table) {
    $('.start-date-input').val('');
    $('.flight-end-date').val('');
    $('.flight_name').val('')
    if (stateArr[stateIndex] == 'fly') {
      $.jgrid.gridUnload(table.flyTableObj);
    } else if (stateArr[stateIndex] == 'ter') {
      $.jgrid.gridUnload(table.terTableObjTop);
      $.jgrid.gridUnload(table.terTableObjDown);
    }else if(stateArr[stateIndex] == 'pre'){
      $.jgrid.gridUnload(table.preTableObj);
    }
  }
  /*
   * 提示前清空数据
   * */
  var alertClearData = function (table) {
    if ($.isValidObject(table)) {
      if (stateArr[stateIndex] == 'fly') {
        $.jgrid.gridUnload(table.flyTableObj);
      } else if (stateArr[stateIndex] == 'ter') {
        $.jgrid.gridUnload(table.terTableObjTop);
        $.jgrid.gridUnload(table.terTableObjDown);
      }else if(stateArr[stateIndex] == 'pre'){
        $.jgrid.gridUnload(table.preTableObj);
      }
    }
  }
  /*
   * 监控起飞降落机场状态
   * */
  var initAirportState = function (state1, state2) {
    state1.on('click', function () {
      if ($(this).hasClass('selected')) {
        state2.removeClass('selected')
      } else {
        $(this).addClass('selected')
        state2.removeClass('selected')
      }
    })
    state2.on('click', function () {
      if ($(this).hasClass('selected')) {
        state1.removeClass('selected')
      } else {
        $(this).addClass('selected')
        state1.removeClass('selected')
      }
    })
  }
  /**判断机场状态*/
  var airportStatus = function () {
    if (stateArr[stateIndex] == 'fly') {
      if ($('.fly_time .dep').hasClass('selected')) {
        return '起飞机场'
      } else {
        return '降落机场'
      }
    } else if (stateArr[stateIndex] == 'ter') {
      if ($('.ter_time .dep').hasClass('selected')) {
        return '起飞机场'
      } else {
        return '降落机场'
      }
    }
  }

  /*
   * 获取表单数据
   * */
  var getFormData = function (formObj) {
    if (stateArr[stateIndex] == 'fly') {
      handelFormData('fly_time',formObj)
    } else if (stateArr[stateIndex] == 'ter') {
      handelFormData('ter_time',formObj)
    } else if (stateArr[stateIndex] == 'pre') {
      formObj.startDate = $(".precision_show .start-date-input").val().replace(/(^\s*)|(\s*$)/g, "");
      formObj.airportName = $(".pre_airport_Name").val().toUpperCase().replace(/(^\s*)|(\s*$)/g, "");
    }
    return formObj;
  }
  /*
  * 获取表单数据处理
  * */
  var handelFormData = function (fatherDom,formObj) {
    formObj.startDate = $("."+fatherDom+" .start-date-input").val().replace(/(^\s*)|(\s*$)/g, "");
    formObj.endDate = $("."+fatherDom+" .flight-end-date").val().replace(/(^\s*)|(\s*$)/g, "");
    formObj.currentType = airportStatus().replace(/(^\s*)|(\s*$)/g, "");
    formObj.airportName = $("."+fatherDom+" .flight_name").val().toUpperCase().replace(/(^\s*)|(\s*$)/g, "");
    if (formObj.currentType == '起飞机场') {
      formObj.currentStatus = 'D'
    } else {
      formObj.currentStatus = 'A'
    }
  }
  /**
   * 提交按钮事件
   * */
  var initSubmitEvent = function () {
    $('.fly-data-btn').on('click', function () {
      $(".no-datas-tip").hide();
      alertClearData(tableObject)
      //获取 表单数据
      getFormData(DataForm);
      // 处理表单提交
      handleSubmitForm(DataForm, 'fly_time');
    });
    $('.ter-data-btn').on('click', function () {
      $(".no-datas-tip").hide();
      alertClearData(tableObject)
      //获取 表单数据
      getFormData(DataForm);
      // 处理表单提交
      handleSubmitForm(DataForm, 'ter_time');

    });
    $('.pre-data-btn').on('click', function () {
      $(".no-datas-tip").hide();
      alertClearData(tableObject)
      //获取 表单数据
      getFormData(DataForm);
      // 处理表单提交
      handleSubmitForm(DataForm, 'precision_show');
    })
  };

  /**
   * 校验起止日期范围是否有效，无效则弹出警告
   * */
  var validateDates = function () {
    // 清空警告
    clearAlert();
    // 清空提示
    clearTip();
    // 校验起止日期范围是否有效
    var bool = validateDatesDifference();
    // 若起止日期范围无效则弹出警告
    if (!bool) {
      // 弹出警告
      showAlear({
        valid: false,
        mess: "起止时间跨度不能超过7天"
      })
    }
  };

  /**
   * 校验起止日期范围是否有效
   * @returns {boolean}
   */
  var validateDatesDifference = function () {
    // 起始时间值
    var start = $('.start-date-input').val();
    // 截止时间值
    var end = $('.flight-end-date').val();
    // 若起止时间数值均有效
    if ($.isValidVariable(start) && $.isValidVariable(end)) {
      // 求得起止时间相差天数
      var diff = Math.abs($.calculateStringTimeDiff(start + '0000', end + '0000') / (1000 * 60 * 60 * 24));
      //   若天数差大于7, 则警告
      if (diff > 7) {
        return false;
      }
    }
    return true;
  };

  /**
   * @method setStartdDataRange 设置其实日期范围
   * @param fatherDom 父级容器
   */
  var setStartdDataRange = function (fatherDom) {
    // 起始时间值
    var start = $(fatherDom + '.start-date-input').val();
    // 截止时间值
    var end = $(fatherDom + '.flight-end-date').val();
    // 截止时间前1天
    var preDay = $.addStringTime(end + '0000', 3600 * 1000 * 24 * -1);
    // 截止时间前7天的日期值
    var day7 = $.addStringTime(end + '0000', 3600 * 1000 * 24 * -7);
    // 求得起止时间相差天数
    var diff = Math.abs($.calculateStringTimeDiff(start + '0000', end + '0000') / (1000 * 60 * 60 * 24));
    // 设置起止日期的可选开始日期
    $(fatherDom + '.start-date-input').datepicker('setStartDate', $.parseFullTime(day7));
    // 设置起止日期的可选结束日期
    $(fatherDom + '.start-date-input').datepicker('setEndDate', $.parseFullTime(end + '0000'));
    // 若截止日期小于起止日期,设置起止日期的默认选中日期为截止日期的前1天
    if (end * 1 < start * 1) {
      // 设置起止日期的默认选中日期为截止日期的前1天
      $(fatherDom + '.start-date-input').datepicker('setDate', $.parseFullTime(preDay));
    } else if (diff > 7) { // 若起止时间相差天数大于7天
      // 设置起止日期的默认选中日期为截止日期的前1天
      $(fatherDom + '.start-date-input').datepicker('setDate', $.parseFullTime(preDay));
    } else {
      // 设置起止日期的默认选中日期为当前数值(用于解决输入框数值与日历默认选中日期数值不一致的问题)
      $(fatherDom + '.start-date-input').datepicker('setDate', $.parseFullTime(start + '0000'));
    }
  };

  /*
   * @method dataConvert 数据转换方法
   * @param data ajax返回数据对象
   * @param gridParam 表格参数配置
   * @param option 表格参数具体配置字符串
   * */
  var dataConvert = function (data, gridParam, option) {
    if ($.isValidObject(data)) {
      if ($.isValidObject(data.map)) {
        $.each(data.map, function (i, e) {
          var obj = {}
          //航段飞行时间误差数据转换
          if (option == 'flyErrorTableDataConfig') {
            var str = i.split('-');
            obj.point = str[1]
            obj.flyDepPointType = str[0];
            obj.allName = i;
            $.each(gridParam[option].colModel, function (index, ele) {
              if (ele['index'] != 'flyDepPointType' && ele['index'] != 'point') {
                obj[ele['index']] = e[ele['index']];
              }
            })
          } else{
            //终端区航路点过点时间统计数据转换
            var str = i.split('-')
            obj.terPoint = str[1]
            obj.depAirport = str[0]
            obj.allName = i;
            $.each(gridParam[option].colModel, function (index, ele) {
              if (ele['index'] != 'depAirport' && ele['index'] != 'terPoint') {
                obj[ele['index']] = e[ele['index']];
              }
            })
          }
          gridParam[option].data.push(obj)
        })
      }
      //航班航路点预测精度显示数据转换
      if ($.isValidObject(data.flights)) {
        var obj = {};
        $.each(data.flights, function (i, e) {
          $.each(gridParam[option].colModel, function (j, el) {
            obj[el.index] = e[el.index];
          })
          gridParam[option].data.push(obj)
        })
      }
    }
  }
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
        width: 100,
        resize: false
      },
      pager: pagerId,
      pgbuttons: false,
      pginput: false,
      colNames: config.colName,
      colModel: config.colModel,
      rowNum: 999999, // 一页显示多少条
      // sortname: 'time', // 初始化的时候排序的字段
      // sortorder: 'asc', //排序方式,可选desc,asc
      viewrecords: true,
      loadComplete: function (xhr) {
        var colTitle = config.colTitle;
        $.each(colTitle, function (i, e) {
          $('#' + tableId).jqGrid('setLabel', i, '', [], {title: e});
        })
      },
      // onCellSelect: function (rowid, index, contents, event) {
      //   var colModel = table.jqGrid('getGridParam')['colModel'];
      //   var colName = colModel[index].name;
      //   if (colName == 'flyDepPointType' || colName == 'depAirport') {
      //     //模态框设置
      //     var option = {
      //       title: contents + '航班详情',
      //       content: '<div class="detail"><table id="' + rowid + 'table" class="detail_table"></table><div id="' + rowid + 'detail_pager"></div></div>',
      //       width: 1280,
      //       height: 960,
      //       isIcon: false,
      //       showCancelBtn: false,
      //       mtop: 180
      //     }
      //     //初始化模态框
      //     BootstrapDialogFactory.dialog(option);
      //     //初始化航段飞行时间误差统计详情表格
      //     if (!$('.ter_time').is(':visible')) {
      //       var textParam = table.jqGrid('getGridParam')['data'][rowid-1].allName
      //       tableDataConfigs.flyDetailDataConfig.data = tableDataConfigs.flyData.infoMap[textParam];
      //       initGridTableDetail(tableDataConfigs.flyDetailDataConfig, rowid + 'table', rowid + 'detail_pager')
      //     } else {
      //       //初始化终端区航路点过点时间统计详情表格
      //       var textParam = table.jqGrid('getGridParam')['data'][rowid-1].allName
      //       tableDataConfigs.terminalDetailDataConfig.data = tableDataConfigs.terData.infoMap[textParam];
      //       initGridTableDetail(tableDataConfigs.terminalDetailDataConfig, rowid + 'table', rowid + 'detail_pager')
      //     }
      //   }
      //   if (colName == 'flightInOId') {
      //     var option = {
      //       title: contents + '航班详情',
      //       content: '<div class="detail"><table id="' + rowid + 'table" class="detail_table"></table><div id="' + rowid + 'detail_pager"></div></div>',
      //       width: 1280,
      //       height: 960,
      //       isIcon: false,
      //       showCancelBtn: false,
      //       mtop: 180
      //     }
      //     //初始化模态框
      //     BootstrapDialogFactory.dialog(option);
      //     flightDetailSearch(contents, rowid);
      //   }
      // }
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
    //尺寸计算表格适配内容大小
    tableDataConfigs.resizeToFitContainer(tableId)
  };
  /*
   * @method initGridTable 初始化页面主表点击后出现的详情表格
   * @param config 对应表格配置
   * @param tableId 表格的tableId
   * @param pagerId 表格统计条数的pagerId
   * */
  var initGridTableDetail = function (config, tableId, pagerId) {
    var table = $('#' + tableId).jqGrid({
      styleUI: 'Bootstrap',
      datatype: 'local',
      rownumbers: true,
      height: "auto",
      shrinkToFit: false,
      cmTemplate: {
        align: 'center',
        resize: false,
        width: 100
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
      },
    })
    $('#' + tableId).jqGrid('setGridParam', {datatype: 'local', data: config.data}).trigger('reloadGrid')
    $('#' + tableId).jqGrid('navGrid', '#' + pagerId, {
      add: false,
      edit: false,
      view: false,
      del: false,
      search: false,
      refresh: false
    });
    tableDataConfigs.resizeToFitContainer(tableId)
    $('#' + tableId).jqGrid('setFrozenColumns')
    $('.modal-content .frozen-bdiv').css('top', '35px');
  };
  /**
   * @method handleSubmitForm 处理表单数据
   * @param obj 表单数据对象集合
   * @param state 当前选中的页面的Class名称
   * */
  var handleSubmitForm = function (obj, state) {
    // 清空警告
    clearAlert();
    // 清空提示
    clearTip();
    //校验表单;
    var validate = validateForm(obj);
    if (!validate.valid) {
      // 清空数据时间
      clearGeneratetime();
      //隐藏当前统计条件
      hideConditions();
      // 显示警告信息内容
      showAlear(validate);
      return;
    } else {
      //显示当前统计条件
      showConditions(obj, state);
      //数据查询
      searchData(DataForm, searchUrl[stateArr[stateIndex]]);
    }
  }
  /**
   * @method validateForm 校验表单数据
   * @param obj 表单数据对象集合
   * @return valid 校验结果Boolean
   * @return mess 校验结果信息
   * */
  var validateForm = function (obj) {
    var regexp = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
    //起始时间格式校验
    var endDateValid = regexp.test(obj.startDate);
    if (!endDateValid) {
      alertClearData(tableObject);
      return {
        valid: false,
        mess: "请输入正确的起始时间,日期格式:YYYYMMDD"
      }
    }
    if (stateIndex != 2) {
      //截止时间格式校验
      var endDateValid = regexp.test(obj.endDate);
      if (!endDateValid) {
        alertClearData(tableObject);
        return {
          valid: false,
          mess: "请输入正确的截止时间,日期格式:YYYYMMDD"
        }
      }
      // 起止时间范围校验
      var valid = validateDatesDifference();
      if (!valid) {
        alertClearData(tableObject);
        return {
          valid: false,
          mess: "起止时间跨度不能超过7天"
        }
      }
    }
    // 机场名称校验
    if (obj.airportName == "") {
      alertClearData(tableObject);
      if (stateIndex != 2) {
        return {
          valid: false,
          mess: "请输入正确的机场名称"
        }
      } else {
        return {
          valid: false,
          mess: "请输入正确的航班号"
        }
      }
    }
    return {
      valid: true
    };
  };

  /**
   * @method showAlear 显示警告内容
   * @param validate 校验结果对象集合
   * */
  var showAlear = function (validate) {
    var mess = '';
    if ($.isValidObject(validate)) {
      mess = validate.mess;
    } else if ($.isValidVariable(validate)) {
      mess = validate;
    }
    var $dom = $('.alert-container');
    var str = '<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' +
      '<p id="alert-mess">' + mess + ' </p>' +
      '</div>';
    $dom.empty().append(str);
  };

  /**
   * 清空警告
   *
   * */
  var clearAlert = function () {
    $('.alert-container').empty();
  };
  /**
   *
   * @param mess 提示信息
   */
  var showTip = function (mess) {
    mess = mess || '';
    $('.charts-wrap .no-datas-tip').text(mess).show();
  };

  /**
   * 清空提示
   * */
  var clearTip = function () {
    $('.history-data-statistics .no-datas-tip').text('').hide();
  };


  /**
   * @method showConditions 显示当前统计内容
   * @param obj 表单对象集合
   * @param state 当前页面状态
   * */
  var showConditions = function (obj, state) {
    //当前选中的类型
    if (state != 'precision_show') {
      $('.' + state + ' .conditions-start-data').text(obj.startDate).attr('title', '时间: ' + obj.startDate + '-' + obj.endDate);
      $('.' + state + ' .conditions-end-data').text(obj.endDate).attr('title', '时间: ' + obj.startDate + '-' + obj.endDate);
      $('.' + state + ' .conditions-type').text('机场状态:' + obj.currentType).attr('title', '机场状态: ' + obj.currentType);
      $('.' + state + ' .conditions-subtype').text('机场名称:' + obj.airportName).attr('title', '机场名称: ' + obj.airportName);
      $('.' + state + ' .conditions-content').removeClass('hidden');
    } else {
      $('.' + state + ' .conditions-start-data').text(obj.startDate).attr('title', '时间: ' + obj.startDate);
      $('.' + state + ' .conditions-subtype').text('航班号:' + obj.airportName).attr('title', '机场名称: ' + obj.airportName);
      $('.' + state + ' .conditions-content').removeClass('hidden');
    }
  };
  /**
   * 隐藏当前统计条件
   * */
  var hideConditions = function () {
    $('.conditions-content').addClass('hidden');
  };

  /**
   * @method searchData 搜索数据方法
   * @param formData 表单数据对象集合
   * @return searchUrl ajax请求地址
   * */
  var searchData = function (formData, searchUrl) {
    var loading = Ladda.create($('.loading-data')[stateIndex]);
    loading.start();
    $('.form-wrap').addClass('no-event');
    if (stateArr[stateIndex] == 'pre') {
      var url = searchUrl + formData.startDate + '/' + formData.airportName;
    } else {
      var url = searchUrl + formData.startDate + '/' + formData.endDate + '/' + formData.airportName + '/' + formData.currentStatus + '';
    }
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        // 当前数据
        if ($.isValidObject(data)) {
          //提取数据
          var time = data.generateTime;
          if (stateArr[stateIndex] == 'fly') {
            $.extend(tableDataConfigs.flyData, data)
            // 更新数据时间
            if ($.isValidVariable(time)) {
              // 更新数据时间
              updateGeneratetime('fly_time',time);
            }
          } else if (stateArr[stateIndex] == 'ter') {
            $.extend(tableDataConfigs.terData, data)
            // 更新数据时间
            if ($.isValidVariable(time)) {
              // 更新数据时间
              updateGeneratetime('ter_time',time);
            }
          } else if (stateArr[stateIndex] == 'pre') {
            $.extend(tableDataConfigs.preData, data)
            // 更新数据时间
            if ($.isValidVariable(time)) {
              // 更新数据时间
              updateGeneratetime('precision_show',time);
            }
          }
          if (stateArr[stateIndex] == 'fly') {
            if ($.isValidVariable(formData.currentStatus)) {
              if (formData.currentStatus == 'D') {
                tableDataConfigs.flyErrorTableDataConfig.colName[0] = '起飞机场'
                tableDataConfigs.terminalPointDataConfigTop.colName[0] = '起飞机场'
                tableDataConfigs.terminalPointDataConfigDown.colName[0] = '起飞机场'
              } else if (formData.currentStatus == 'A') {
                tableDataConfigs.flyErrorTableDataConfig.colName[0] = '降落机场'
                tableDataConfigs.terminalPointDataConfigTop.colName[0] = '降落机场'
                tableDataConfigs.terminalPointDataConfigDown.colName[0] = '降落机场'
              }
            }
            tableDataConfigs.flyErrorTableDataConfig.data = []
            tableDataConfigs.flyDetailDataConfig.data = []
            dataConvert(tableDataConfigs.flyData, tableDataConfigs, 'flyErrorTableDataConfig')
            initGridTable(tableDataConfigs.flyErrorTableDataConfig, 'flight_grid_table', 'flight-datas-pager')
          } else if (stateArr[stateIndex] == 'ter') {
            tableDataConfigs.terminalPointDataConfigTop.data = []
            tableDataConfigs.terminalPointDataConfigDown.data = []
            tableDataConfigs.terminalDetailDataConfig.data = []
            dataConvert(tableDataConfigs.terData, tableDataConfigs, 'terminalPointDataConfigTop')
            dataConvert(tableDataConfigs.terData, tableDataConfigs, 'terminalPointDataConfigDown')
            initGridTable(tableDataConfigs.terminalPointDataConfigTop, tableObject.terTableObjTop, 't-datas-pager')
            initGridTable(tableDataConfigs.terminalPointDataConfigDown, tableObject.terTableObjDown, 'd-datas-pager')
          } else if (stateArr[stateIndex] == 'pre') {
            tableDataConfigs.precisionTableDataConfig.data = [];
            tableDataConfigs.precisionDetailDataConfig.data = [];
            tableDataConfigs.precisionTableDataConfig.data = tableDataConfigs.preData.flights;
            initGridTable(tableDataConfigs.precisionTableDataConfig, tableObject.preTableObj, 'pre-datas-pager')
          }
          // 若数据为空
          if ($.isEmptyObject(data.map) && stateIndex != 2) {
            alertClearData(tableObject)
            //显示提示
            showTip('本次统计数据结果为空');
            loading.stop();
            $('.form-wrap').removeClass('no-event');
            return;
          }
          if ($.isEmptyObject(data.flights) && stateArr[stateIndex] == 'pre') {
            alertClearData(tableObject)
            //显示提示
            showTip('本次统计数据结果为空');
            loading.stop();
            $('.form-wrap').removeClass('no-event');
            return;
          }
          loading.stop();
          $('.form-wrap').removeClass('no-event');

        } else if ($.isValidObject(data) && $.isValidVariable(data.status) && '500' == data.status) {
          var err = "查询失败:" + data.error;
          showAlear(err);
          loading.stop();
          $('.form-wrap').removeClass('no-event');
        } else {
          showAlear("查询失败");
          loading.stop();
          $('.form-wrap').removeClass('no-event');
        }

      },
      error: function (xhr, status, error) {
        console.error('Search data failed');
        console.error(error);
        loading.stop();
        showAlear("查询失败");
        $('.form-wrap').removeClass('no-event');
      }
    });
  };
  /**
  *@method flightDetailSearch 航班航路点预测航班详情数据查询
  *@param flightid  航班在orical数据库中的id
  *@param rowid  行id
   * */
  var flightDetailSearch = function (flightid, rowid) {
    var url = ipHost + 'accuracy/check/' + flightid
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if ($.isValidObject(data)) {
          if ($.isValidObject(data.flightRouteResults)) {
            tableDataConfigs.precisionDetailDataConfig.data = [];
            tableDataConfigs.precisionDetailDataConfig.data = data.flightRouteResults
            initGridTableDetail(tableDataConfigs.precisionDetailDataConfig, rowid + 'table', rowid + 'detail_pager')
          }
        }
      },
      error: function (xhr, status, error) {
        console.error('Search data failed');
        console.error(error);
        loading.stop();
        showAlear("查询失败");
        $('.form-wrap').removeClass('no-event');
      }
    })
  }
  /**
   * @method updateGeneratetime 更新当前数据刷新时间
   * @param fatherDom 模块名称
   * @param time 刷新时间
   */
  var updateGeneratetime = function (fatherDom,time) {
    var timeFormatter = formateTime(time);
    $('.'+fatherDom+' .generate-time').text('数据生成时间: ' + timeFormatter);
  };

  /**
   *  清空数据时间
   * */
  var clearGeneratetime = function () {
    $('.history-data-statistics .generate-time').empty();
  };

  /**
   * @method formatter 数据格式转换
   * @param time 时间
   * @returns {string}
   */
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
   * 绑定Window事件，窗口变化时重新调整表格大小
   * */
  var initDocumentResize = function () {
    resizeToFitContainer();
    $(window).resize(function () {
      resizeToFitContainer();
      if ($.isValidObject(tableObject)) {
        if (stateArr[stateIndex] == 'fly') {
          tableDataConfigs.resizeToFitContainer(tableObject.flyTableObj)
        } else if (stateArr[stateIndex] == 'ter') {
          tableDataConfigs.resizeToFitContainer(tableObject.terTableObjTop)
          tableDataConfigs.resizeToFitContainer(tableObject.terTableObjDown)
        }else if(stateArr[stateIndex] == 'pre'){
          tableDataConfigs.resizeToFitContainer(tableObject.preTableObj)
        }
      }
    });
  };

  /**
   *  计算table初始化前父容器的高度
   * */
  var resizeToFitContainer = function () {
    var body = $('.main').height();
    var head = $('.headbar').outerHeight() + parseInt($('.headbar').css('marginBottom'));
    var nav = $('.nav-menu').outerHeight() + parseInt($('.nav-menu').css('marginBottom'));
    var innerNav = $($('.history-data-title')[stateIndex]).outerHeight() + parseInt($($('.history-data-title')[stateIndex]).css('marginBottom'));
    var form = $($('.form-wrap')[stateIndex]).outerHeight() + parseInt($($('.form-wrap')[stateIndex]).css('marginBottom'));
    var wrapHeight = body - head - nav - innerNav - form;
    var chartHeight = wrapHeight - $($('.conditions')[stateIndex]).outerHeight() - $($('.alert-row')[stateIndex]).outerHeight();
    $('.charts-wrap').height(wrapHeight);
    $('.echart-row').height(chartHeight);
  };
  /**
   * @method initDatepicker 初始化日期选择器
   * @param fatherDom 父级容器
   */
  var initDatepicker = function (fatherDom) {
    // 起始时间输入框
    $(fatherDom + '.start-date-input').datepicker({
      language: "zh-CN",
      autoclose: true, //选择日期后自动关闭面板
      endDate: '0d', //可选日期最后日期
      //格式化
      format: 'yyyymmdd',
    });
    // 截止时间输入框
    $(fatherDom + '.flight-end-date').datepicker({
      language: "zh-CN",
      autoclose: true, //选择日期后自动关闭面板
      endDate: '0d', //可选日期最后日期
      //格式化
      format: 'yyyymmdd',
    });
    //事件绑定
    $(fatherDom + '.start-date-input').on('changeDate', function () {
      // 校验起止日期范围是否有效，无效则弹出警告
      validateDates();
    });
    $(fatherDom + '.flight-end-date').on('changeDate', function () {
      // 设置起止时间输入框日历插件的可选范围及默认选中日期
      setStartdDataRange(fatherDom);
      // 校验起止日期范围是否有效，无效则弹出警告
      validateDates();
    });
  };

  var initPreDatapicker = function () {
    //时间输入栏
    $('.precision_show .start-date-input').datepicker({
      language: "zh-CN",
      autoclose: true, //选择日期后自动关闭面板
      endDate: '0d', //可选日期最后日期
      //格式化
      format: 'yyyymmdd',
    })
  }

  /**
   * 设置默认日期
   * */
  var setDefaultDates = function () {
    //当前日期
    var now = $.getFullTime(new Date()).substring(0, 8);
    // 当前日期前1天
    var preDay = $.addStringTime(now + '0000', 3600 * 1000 * 24 * -1);
    // 设置起止日期
    $('.start-date-input').datepicker('setDate', $.parseFullTime(preDay));
    // 设置截止日期
    $('.flight-end-date').datepicker('setDate', $.parseFullTime(now + '0000'));
    //设置默认时间
    $('.precision_show .start-date-input').datepicker('setDate', $.parseFullTime(now + '0000'));
  };
  return {
    init: function () {
      // 初始化组件
      initComponent();
      // 初始化事件绑定
      initEvent();
    },
    initGridTable:initGridTable
  }
}();

$(document).ready(function () {
  PredictionData.init();
});