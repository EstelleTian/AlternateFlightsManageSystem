/**
 * Created by caowei on 2018/1/16.
 */
var tabPage = [$('.fly_time'), $('.ter_time'),$('.fly_in_show'),$('.out_show'),$('.content_show')]
var nav = $('#nav');
$('.nav li', nav).on('click', function () {
  // 更新当前nav索引
  var stateIndex = $(this).index();
  tabToggle(stateIndex, tabPage)
  if($('.content_show') ){
    var tableConfig = {
      colName: ['备降场','合计可用', 'C2当前容量', 'C2占用', 'C2可用','C1当前容量', 'C1占用', 'C1可用','DE当前容量', 'DE占用', 'DE可用','机位备注' ],
      colTitle: {
        flyDepPointType:'备降场',
        point:'合计可用',
        rdepAvgTime:'C2当前容量',
        rdepMeTime:'C2占用',
        schMeDis:'C2可用',
        fplMeDis:'C1当前容量',
        depMeDis:'C1占用',
        dyn10mMeDis:'C1可用',
        dyn20mMeDis:'DE当前容量',
        schAvgDis:'DE占用',
        fplAvgDis:'DE可用',
        depAvgDis:'机位备注',
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
        }],
      data: [{
        flyDepPointType:'ZLDH',
        point:0,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'ZLJQ4',
      },{
        flyDepPointType:'ZWAK',
        point:2,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'ZLJQ4',
      },{
        flyDepPointType:'ZWAT',
        point:4,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'ZLJQ4',
      },{
        flyDepPointType:'ZLDH',
        point:0,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'正常机位总计',
      },{
        flyDepPointType:'ZLDH',
        point:0,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'',
      },{
        flyDepPointType:'ZLDH',
        point:6,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'ZLJQ4',
      },{
        flyDepPointType:'ZLDH',
        point:9,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'ZLJQ4',
      },{
        flyDepPointType:'ZLDH',
        point:0,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'ZLJQ4',
      },{
        flyDepPointType:'ZLDH',
        point:0,
        rdepAvgTime:2,
        rdepMeTime:3,
        schMeDis:5,
        fplMeDis:6,
        depMeDis:6,
        dyn10mMeDis:2,
        dyn20mMeDis:5,
        schAvgDis:0,
        fplAvgDis:3,
        depAvgDis:'ZLJQ4',
      }]
    }
    PredictionData.initGridTable(tableConfig,'alernate_flight_grid_table','ale-datas-pager')
  }
});
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