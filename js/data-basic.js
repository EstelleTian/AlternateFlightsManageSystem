var tableDataConfig = function () {
  var flyErrorTableDataConfig = {
    colName: ['起飞机场','航路点', '平均飞行时间(秒)', '中位飞行时间(秒)', 'SCH中位差(秒)', 'FPL中位差(秒)', 'DEP中位差(秒)', 'DYN10中位差(秒)', 'DYN20中位差(秒)', 'SCH平均差(秒)', 'FPL平均差(秒)', 'DEP平均差(秒)', 'DYN10平均差(秒)', 'DYN20平均差(秒)'],
    colTitle: {
      flyDepPointType:'起飞机场',
      point:'航路点',
      rdepAvgTime:'实际飞行时间平均值(秒)',
      rdepMeTime:'实际飞行时间中位数(秒)',
      schMeDis:'SCH中位数时间差(秒)',
      fplMeDis:'FPL中位数时间差(秒)',
      depMeDis:'DEP中位数时间差(秒)',
      dyn10mMeDis:'DYN10中位数时间差(秒)',
      dyn20mMeDis:'DYN20中位数时间差(秒)',
      schAvgDis:'SCH平均时间差(秒)',
      fplAvgDis:'FPL平均时间差(秒)',
      depAvgDis:'DEP平均时间差(秒)',
      dyn10mAvgDis:'DYN10平均时间差(秒)',
      dyn20mAvgDis:'DYN20平均时间差(秒)'
    },
    colModel: [
      {
        name: 'flyDepPointType',
        index: 'flyDepPointType',
        width:120,
        frozen:true
      },{
        name: 'point',
        index: 'point',
        width:120,
        frozen:true
      }, {
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
      }, {
        name: 'dyn10mAvgDis',
        index: 'dyn10mAvgDis'
      }, {
        name: 'dyn20mAvgDis',
        index: 'dyn20mAvgDis'
      }],
    data: []
  }
  var terminalPointDataConfigTop = {
    colName: ['起飞机场', '终端区航路点', 'SCH中位差(秒)', 'FPL中位差(秒)', 'DEP中位差(秒)', 'DYN10中位差(秒)', 'DYN20中位差(秒)', 'SCH平均差(秒)', 'FPL平均差(秒)', 'DEP平均差(秒)', 'DYN10平均(秒)', 'DYN20平均差(秒)'],
    colTitle:{
      depAirport:'起飞机场',
      terPoint:'终端区航路点',
      schMeDis:'SCH中位数时间差(秒)',
      fplMeDis:'FPL中位数时间差(秒)',
      depMeDis:'DEP中位数时间差(秒)',
      dyn10mMeDis:'DYN10中位数时间差(秒)',
      dyn20mMeDis:'DYN20中位数时间差(秒)',
      schAvgDis:'SCH平均数时间差(秒)',
      fplAvgDis:'FPL平均数时间差(秒)',
      depAvgDis:'DEP平均数时间差(秒)',
      dyn10mAvgDis:'DYN10平均数时间差(秒)',
      dyn20mAvgDis:'DYN20平均数时间差(秒)'
    },
    colModel: [{
      name: 'depAirport',
      index: 'depAirport',
      width:80,
      frozen: true
    }, {
      name: 'terPoint',
      index: 'terPoint'
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
    }, {
      name: 'dyn10mAvgDis',
      index: 'dyn10mAvgDis'
    }, {
      name: 'dyn20mAvgDis',
      index: 'dyn20mAvgDis'
    }],
    data: []
  }
  var terminalPointDataConfigDown = {
    colName: ['起飞机场', '终端区航路点', 'SCH中位差', 'FPL中位差', 'DEP中位差', 'DYN10中位差', 'DYN20中位差', 'SCH平均差', 'FPL平均差', 'DEP平均差', 'DYN10平均差', 'DYN20平均差'],
    colTitle:{
      depAirport:'起飞机场',
      terPoint:'终端区航路点',
      schMeHLevel:'SCH中位数高度差',
      fplMeHLevel: 'FPL中位数高度差',
      depMeHLevel:'DEP中位数高度差',
      dyn10MeHLevel:'DYN10中位数高度差',
      dyn20MeHLevel:'DYN20中位数高度差',
      schAvgHLevel:'SCH平均数高度差',
      fplAvgHLevel:'FPL平均数高度差',
      depAvgHLevel:'DEP平均数高度差',
      dyn10AvgHLevel:'DYN10平均数高度差',
      dyn20AvgHLevel:'DYN20平均数高度差',
    },
    colModel: [{
      name: 'depAirport',
      index: 'depAirport',
      width:80,
      frozen: true
    }, {
      name: 'terPoint',
      index: 'terPoint'
    }, {
      name: 'schMeHLevel',
      index: 'schMeHLevel'
    }, {
      name: 'fplMeHLevel',
      index: 'fplMeHLevel'
    }, {
      name: 'depMeHLevel',
      index: 'depMeHLevel'
    }, {
      name: 'dyn10MeHLevel',
      index: 'dyn10MeHLevel'
    }, {
      name: 'dyn20MeHLevel',
      index: 'dyn20MeHLevel'
    }, {
      name: 'schAvgHLevel',
      index: 'schAvgHLevel'
    }, {
      name: 'fplAvgHLevel',
      index: 'fplAvgHLevel'
    }, {
      name: 'depAvgHLevel',
      index: 'depAvgHLevel'
    }, {
      name: 'dyn10AvgHLevel',
      index: 'dyn10AvgHLevel'
    }, {
      name: 'dyn20AvgHLevel',
      index: 'dyn20AvgHLevel'
    }
    ],
    data: []
  }
  var flyDetailDataConfig = {
    colName: ['ID', '航班号', '机型', '实际飞行时间(秒)', 'SHC飞行时间(秒)', 'FPL飞行时间(秒)', 'DEP飞行时间(秒)', 'DYN10飞行时间(秒)', 'DYN20飞行时间(秒)'],
    colTitle: {
      id:'ID',
      flightID:'航班号',
      aircraftType:'机型',
      rPastTime:'实际飞行时间(秒)',
      schPastTime:'SHC飞行时间(秒)',
      fplPastTime:'FPL飞行时间(秒)',
      depPastTime:'DEP飞行时间(秒)',
      dyn10PastTime:'DYN10飞行时间(秒)',
      dyn20PastTime:'DYN20飞行时间(秒)',
    },
    colModel: [
      {
        name: 'id',
        index: 'id',
        frozen: true
      }, {
        name: 'flightID',
        index: 'flightID',
        frozen: true
      }, {
        name: 'aircraftType',
        index: 'aircraftType'
      }, {
        name: 'rPastTime',
        index: 'rPastTime'
      }, {
        name: 'schPastTime',
        index: 'schPastTime'
      }, {
        name: 'fplPastTime',
        index: 'fplPastTime'
      }, {
        name: 'depPastTime',
        index: 'depPastTime'
      }, {
        name: 'dyn10PastTime',
        index: 'dyn10PastTime'
      }, {
        name: 'dyn20PastTime',
        index: 'dyn20PastTime'
      }],
    data: []
  }
  var terminalDetailDataConfig = {
    colName: ['ID', '航班号', '机型', '实际过点时间', 'SHC过点时间', 'FPL过点时间', 'DEP过点时间', 'DYN10过点时间', 'DYN20过点时间', '实际过点高度', 'SHC过点高度', 'FPL过点高度', 'DEP过点高度', 'DYN10过点高度', 'DYN20过点高度'],
    colTitle:{
      id:'ID',
      flightID:'航班号',
      aircraftType:'机型',
      rPastTime:'实际过点时间',
      schPastTime:'SHC过点时间',
      fplPastTime:'FPL过点时间',
      depPastTime:'DEP过点时间',
      dyn10PastTime:'DYN10过点时间',
      dyn20PastTime:'DYN20过点时间',
      rPasthlevel:'实际过点高度',
      schhlevel:'SHC过点高度',
      fplhlevel:'FPL过点高度',
      dephlevel:'DEP过点高度',
      dyn10hlevel:'DYN10过点高度',
      dyn20hlevel:'DYN20过点高度',
    },
    colModel: [
      {
        name: 'id',
        index: 'id',
        width:100,
        frozen: true
      }, {
        name: 'flightID',
        index: 'flightID',
        frozen: true
      }, {
        name: 'aircraftType',
        index: 'aircraftType',
        width:100
      }, {
        name: 'rPastTime',
        index: 'rPastTime',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'schPastTime',
        index: 'schPastTime',
        width:100,
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'fplPastTime',
        index: 'fplPastTime',
        width:100,
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'depPastTime',
        index: 'depPastTime',
        width:100,
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'dyn10PastTime',
        index: 'dyn10PastTime',
        width:100,
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'dyn20PastTime',
        index: 'dyn20PastTime',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'rPasthlevel',
        index: 'rPasthlevel'
      }, {
        name: 'schhlevel',
        index: 'schhlevel'
      }, {
        name: 'fplhlevel',
        index: 'fplhlevel'
      }, {
        name: 'dephlevel',
        index: 'dephlevel'
      }, {
        name: 'dyn10hlevel',
        index: 'dyn10hlevel'
      }, {
        name: 'dyn20hlevel',
        index: 'dyn20hlevel'
      }
    ],
    data: []
  }

  var precisionTableDataConfig = {
    colName: ['FlightInOId', '航班号','执行时间', '计划起飞机场', '计划降落机场', '计划起飞时间', '计划降落时间', '实际起飞机场', '时机降落机场', '实际起飞时间', '实际降落时间'],
    colTitle: {
      flightInOId:'航班在oracle数据库中的id',
      flightId:'航班号',
      executeDate:'航班执行日期',
      sarrap:'时刻表降落机场',
      sdepap:'时刻表起飞机场',
      sdeptime:'时刻表起飞时间',
      sarrtime:'时刻表降落时间',
      rarrap:'实际降落机场',
      rdepap:'实际起飞机场',
      rarrtime:'实际降落时间',
      rdeptime:'实际飞行时间'
    },
    colModel: [
      {
        name: 'flightInOId',
        index: 'flightInOId',
        frozen:true
      }, {
        name: 'flightId',
        index: 'flightId'
      }, {
        name: 'executeDate',
        index: 'executeDate',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'sdepap',
        index: 'sdepap'
      }, {
        name: 'sarrap',
        index: 'sarrap'
      }, {
        name: 'sdeptime',
        index: 'sdeptime',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'sarrtime',
        index: 'sarrtime',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'rdepap',
        index: 'rdepap'
      }, {
        name: 'rarrap',
        index: 'rarrap'
      }, {
        name: 'rdeptime',
        index: 'rdeptime',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      },{
        name: 'rarrtime',
        index: 'rarrtime',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }  ],
    data: []
  }
  var precisionDetailDataConfig = {
    colName: ['航路点', '实际过点时间', '0-15(分钟)', '15-30(分钟)', '30-60(分钟)', '60-120(分钟)', '120(分钟)以上', 'DEP', 'FPL', 'SCH',],
    colTitle: {
      flightRoute:'航路点名称',
      passTime:'实际过点时间',
      timeIn0To15:'过点时间和保存时间的差值在15分钟内',
      timeIn15To30:'过点时间和保存时间的差值在15到30分钟',
      timeIn30To60:'过点时间和保存时间的差值在30到60分钟',
      timeIn60To120:'过点时间和保存时间的差值在60到120分钟',
      timeIn120:'过点时间和保存时间的差值在超过120分钟',
      timeDEP:'过点时间和DEP状态的时间差值',
      timeFPL:'过点时间和FPL状态的时间差值',
      timeSCH:'过点时间和SCH状态的时间差值'
    },
    colModel: [
      {
        name: 'flightRoute',
        index: 'flightRoute',
        frozen:true
      }, {
        name: 'passTime',
        index: 'passTime',
        formatter: function (cellvalue, options, rowObject) {
          if ($.isValidVariable(cellvalue)) {
            return '<span title="'+cellvalue+'">'+cellvalue.substring(8, 12)+'</span>';
          } else {
            return '';
          }
        }
      }, {
        name: 'timeIn0To15',
        index: 'timeIn0To15'
      }, {
        name: 'timeIn15To30',
        index: 'timeIn15To30'
      }, {
        name: 'timeIn30To60',
        index: 'timeIn30To60'
      }, {
        name: 'timeIn60To120',
        index: 'timeIn60To120'
      }, {
        name: 'timeIn120',
        index: 'timeIn120'
      }, {
        name: 'timeDEP',
        index: 'timeDEP'
      }, {
        name: 'timeFPL',
        index: 'timeFPL'
      }, {
        name: 'timeSCH',
        index: 'timeSCH'
      }],
    data: []
  }
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
    var gridTableHeight = gridTableBDiv.outerHeight() - (gridTableGBox.outerHeight() - container.height()+20);
    var gridTableWidth = container.width();

    // 调用表格修改高度宽度方法
    $('#' + tableId).jqGrid('setGridHeight', gridTableHeight);
    $('#' + tableId).jqGrid('setGridWidth', (gridTableWidth - 2));
  }

  var timeFormater = function (cellvalue, options, rowObject) {
    if ($.isValidVariable(cellvalue)) {
      return cellvalue + '(秒)';
    } else {
      return '';
    }
  }
  /*数据样例*/
  var flyData = {};
  var terData = {};
  var preData = {};
  return {
    flyErrorTableDataConfig: flyErrorTableDataConfig,
    terminalPointDataConfigTop: terminalPointDataConfigTop,
    terminalPointDataConfigDown: terminalPointDataConfigDown,
    precisionTableDataConfig:precisionTableDataConfig,
    resizeToFitContainer: resizeToFitContainer,
    flyDetailDataConfig: flyDetailDataConfig,
    terminalDetailDataConfig: terminalDetailDataConfig,
    precisionDetailDataConfig:precisionDetailDataConfig,
    flyData: flyData,
    terData:terData,
    preData:preData
  }
};

$(document).ready(function () {
  tableDataConfig();
});