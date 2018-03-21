/**
 * 2018/01/23
 * author: zxy
 * 表格协调窗口DOM
 */

/**
 * 注意：复合菜单项(就是里面有子菜单的选项)不要加 data-val属性
 * 因为点击菜单时需要从data-val属性获取对应的code(备降机场四字码或者操作码)，复合菜单项是不需要获取的
 *
 * **/

var GridTableCollaborateDom = function () {
    //协调窗口框架
    var collaborateContainer = '<div class="grid-table-collaborate-container"><ul class="collaborate-menu">{child}</ul></div>';

    //预选备降
    var preAlternateLi = '<li class="pre-alternate"><a>预选备降<span class="glyphicon glyphicon-play"></span></a>{level2}</li>';
    //更改预选
    var updatePreAlternateLi = '<li class="update-pre-alternate"><a>更改预选<span class="glyphicon glyphicon-play"></span></a>{level2}</li>';

    //确认备降
    var confirmAlternateLi = '<li class="confirm-alternate"><a>确定备降<span class="glyphicon glyphicon-play"></span></a>{level2}</li>';
    //更改备降
    var updateConfirmAlternateLi = '<li class="update-alternate"><a>更改备降<span class="glyphicon glyphicon-play"></span></a>{level2}</li>';

    //正班占用
    var occupiedLi = '<li data-val="occupied" class="occupied"><a>正班占用</a></li>';


    var LEVEL2 = '<ul class="collaborate-menu level-2">{airport}' +
        '<li class="other"><a>其它<span class="glyphicon glyphicon-play"></span></a>{other}</li>' +
        '<li class="complex"><a>军民合用<span class="glyphicon glyphicon-play"></span></a>{complex}</li>' +
        '<li data-val="outside" class="outside"><a>区外</a></li>' +
        '</ul>';

    return {
        collaborateContainer: collaborateContainer,
        preAlternateLi: preAlternateLi,
        updatePreAlternateLi: updatePreAlternateLi,
        confirmAlternateLi: confirmAlternateLi,
        updateConfirmAlternateLi: updateConfirmAlternateLi,
        occupiedLi: occupiedLi,
        LEVEL2: LEVEL2
    }


    // // 进港
    // var ARR_DOM = $('<div class="grid-table-collaborate-container">' +
    //     '<ul class="collaborate-menu">' +
    //     preAlternateLi +
    //     confirmAlternateLi +
    //     occupiedLi +
    //     // '<li data-val="manual-add" class="manual-add"><a  >手工添加计划</a></li>' +
    //     '</ul>' +
    //     '</div>');
    // // 备降
    // var ALTERNATE_DOM = $('<div class="grid-table-collaborate-container">' +
    //     '<ul class="collaborate-menu">' +
    //     updatePreAlternateLi +
    //     updateConfirmAlternateLi +
    //     '<li data-val="confirm-alternate" class="confirm-alternate"><a  >确定备降</a></li>' +
    //     '<li data-val="release-postion" class="release-postion"><a  >释放停机位</a></li>' +
    //     '<li data-val="cancel-alternate" class="cancel-alternate"><a  >取消备降</a></li>' +
    //     '</ul>' +
    //     '</div>');
    //
    // // 疆内飞越
    // var OVER_DOM = $('<div class="grid-table-collaborate-container">' +
    //     '<ul class="collaborate-menu">' +
    //     preAlternateLi +
    //     confirmAlternateLi +
    //     occupiedLi +
    //     '</ul>' +
    //     '</div>');
    //
    // // 出港
    // var DEP_DOM = $('<div class="grid-table-collaborate-container">' +
    //     '<ul class="collaborate-menu">' +
    //     '<li data-val="alternate" class="alternate"><a  >备降</a></li>' +
    //     '<li data-val="pre-alternate" class="pre-alternate"><a  >预选</a></li>' +
    //     occupiedLi +
    //     '</ul>' +
    //     '</div>');
    //
    // var LEVEL2 = $('<ul class="collaborate-menu level-2">' +
    //     '<li class="other"><a  >其它<span class="glyphicon glyphicon-play"></span></a></li>' +
    //     '<li class="complex"><a  >军民合用<span class="glyphicon glyphicon-play"></span></a></li>' +
    //     '<li data-val="outside" class="outside"><a  >区外</a></li>' +
    //     '</ul>') ;
    //
    // var OTHER = $('<ul class="collaborate-menu collaborate-menu-other">' + '</ul>');
    // var COMPLEX = $('<ul class="collaborate-menu collaborate-menu-complex">' + '</ul>');
    //
    // // 备降容量
    // var CAPACITY = '<div class="panel panel-info  flight-grid-table-collaborate-container"><div class="panel-heading">' +
    // '<h3 class="panel-title">修改当前容量</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
    // '<form action="" method="post">'+
    // '<div class="form-group">' +
    // '<label class="sr-only " for="update-ctd-time">Flight</label>' +
    // '<div class="input-group form-group-custom has-feedback"><span class="input-group-addon">容量值</span>' +
    // '<input type="text" name="flightId" id="flightId" class="form-control flightId-toupper" placeholder="输入容量值">' +
    // '<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
    // '<span id="inputSuccess1Status" class="sr-only"></span>' +
    // '</div>' +
    // '</div>'+
    // '<div class="form-group form-group-custom"">'+
    // '</div>' + '<button type="button" id="cancale" class="atfm-btn atfm-btn-gray  pull-right">取消</button>'+
    // '<button type="button" id="modificate_volume" data-style="zoom-out" class="atfm-btn ladda-label atfm-btn-blue ladda-button collaborate-content-level pull-right">指定</button>'+
    // '</div>' +
    // '</form>' +
    // '</div></div>';
    //
    // return {
    //     ARR_DOM: ARR_DOM,
    //     ALTERNATE_DOM: ALTERNATE_DOM,
    //     OVER_DOM: OVER_DOM,
    //     DEP_DOM: DEP_DOM,
    //     LEVEL2 : LEVEL2,
    //     OTHER : OTHER,
    //     COMPLEX : COMPLEX,
    //     CAPACITY : CAPACITY
    // }

}();
