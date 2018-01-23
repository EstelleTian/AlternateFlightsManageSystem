// 右键窗口
var CollaborateDom = {
    // 进港
    ARR : '<div class="grid-table-collaborate-container"><ul class="collaborate-menu"><li><a href="javascript:;">预选备降<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">吐鲁番</a></li><li><a href="javascript:;">克拉玛依</a></li><li><a href="javascript:;">伊宁</a></li><li><a href="javascript:;">喀什</a></li><li><a href="javascript:;">阿勒泰</a></li><li><a href="javascript:;">库车</a></li><li><a href="javascript:;">军民合用<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">库尔勒</a></li><li><a href="javascript:;">和田</a></li><li><a href="javascript:;">哈密</a></li><li><a href="javascript:;">阿克苏</a></li></ul></li></ul></li><li><a href="javascript:;">确定备降<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">吐鲁番</a></li><li><a href="javascript:;">克拉玛依</a></li><li><a href="javascript:;">伊宁</a></li><li><a href="javascript:;">喀什</a></li><li><a href="javascript:;">阿勒泰</a></li><li><a href="javascript:;">库车</a></li><li><a href="javascript:;">军民合用<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">库尔勒</a></li><li><a href="javascript:;">和田</a></li><li><a href="javascript:;">哈密</a></li><li><a href="javascript:;">阿克苏</a></li></ul></li></ul></li><li><a href="javascript:;">正班占用</a></li><li><a href="javascript:;">手工添计划</a></li></ul></div>',
    // 出港
    DEP : '<div class="grid-table-collaborate-container"><ul class="collaborate-menu"><li><a href="javascript:;">备降</a></li><li><a href="javascript:;">预选</a></li><li><a href="javascript:;">正班占用</a></li></ul></div>',
    // 疆内
    AREA : '',
    // 备降
    PRE: '<div class="grid-table-collaborate-container"><ul class="collaborate-menu"><li><a href="javascript:;">更改预选<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">吐鲁番</a></li><li><a href="javascript:;">克拉玛依</a></li><li><a href="javascript:;">伊宁</a></li><li><a href="javascript:;">喀什</a></li><li><a href="javascript:;">阿勒泰</a></li><li><a href="javascript:;">库车</a></li><li><a href="javascript:;">军民合用<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">库尔勒</a></li><li><a href="javascript:;">和田</a></li><li><a href="javascript:;">哈密</a></li><li><a href="javascript:;">阿克苏</a></li></ul></li></ul></li><li><a href="javascript:;">更改备降<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">吐鲁番</a></li><li><a href="javascript:;">克拉玛依</a></li><li><a href="javascript:;">伊宁</a></li><li><a href="javascript:;">喀什</a></li><li><a href="javascript:;">阿勒泰</a></li><li><a href="javascript:;">库车</a></li><li><a href="javascript:;">军民合用<span class="glyphicon glyphicon-play"></span></a><ul><li><a href="javascript:;">库尔勒</a></li><li><a href="javascript:;">和田</a></li><li><a href="javascript:;">哈密</a></li><li><a href="javascript:;">阿克苏</a></li></ul></li></ul></li><li><a href="javascript:;">确定备降</a></li><li><a href="javascript:;">释放停机位</a></li><li><a href="javascript:;">取消备降</a></li></ul></div>',
    // 备降容量
    CAPACITY : '<div class="panel panel-info  flight-grid-table-collaborate-container"><div class="panel-heading">' +
    '<h3 class="panel-title">当前容量修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
    '<form action="" method="post">'+
    '<div class="form-group">' +
    '<label class="sr-only" for="update-ctd-time">Flight</label>' +
    '<div class="input-group form-group-custom has-feedback"><span class="input-group-addon">容量值</span>' +
    '<input type="text" name="flightId" id="flightId" class="form-control flightId-toupper" placeholder="输入容量值">' +
    '<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
    '<span id="inputSuccess1Status" class="sr-only"></span>' +
    '</div>' +
    '</div>'+
    '<div class="form-group form-group-custom"">'+
    '</div>' + '<button type="button" id="cancale" class="atfm-btn atfm-btn-gray collaborate-content-level pull-right">取消</button>'+
    '<button type="button" id="modificate_volume" class="atfm-btn atfm-btn-blue collaborate-content-level pull-right">指定</button>'+
    '</div>' +
    '</form>' +
    '</div></div>',

};