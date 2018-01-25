/**
 * 2018/01/23
 * author: zxy
 * 表格协调窗口DOM
 */

var GridTableCollaborateDom = function () {
    // 进港
    var ARR_DOM = $('<div class="grid-table-collaborate-container">' +
        '<ul class="collaborate-menu">' +
        '<li><a href="javascript:;" data-val="pre-alternate" class="pre-alternate">预选备降<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:; " data-val="confirm-alternate" class="confirm-alternate">确定备降<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:;" data-val="occupied" class="occupied">正班占用</a></li>' +
        '<li><a href="javascript:;" data-val="manual-add" class="manual-add">手工添加计划</a></li>' +
        '</ul>' +
        '</div>');
    // 备降
    var ALTERNATE_DOM = $('<div class="grid-table-collaborate-container">' +
        '<ul class="collaborate-menu">' +
        '<li><a href="javascript:;" data-val="update-pre-alternate" class="update-pre-alternate">更改预选<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:; " data-val="update-alternate" class="update-alternate">更改备降<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:; " data-val="confirm-alternate" class="confirm-alternate">确定备降</a></li>' +
        '<li><a href="javascript:;" data-val="release-postion" class="release-postion">释放停机位</a></li>' +
        '<li><a href="javascript:;" data-val="cancel-alternate" class="cancel-alternate">取消备降</a></li>' +
        '</ul>' +
        '</div>');

    // 疆内飞越
    var OVER_DOM = $('<div class="grid-table-collaborate-container">' +
        '<ul class="collaborate-menu">' +
        '<li><a href="javascript:;" data-val="pre-alternate" class="pre-alternate">预选备降<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:; " data-val="confirm-alternate" class="confirm-alternate">确定备降<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:;" data-val="occupied" class="occupied">正班占用</a></li>' +
        '<li><a href="javascript:;" data-val="manual-add" class="manual-add">手工添计划</a></li>' +
        '</ul>' +
        '</div>');

    // 出港
    var DEP_DOM = $('<div class="grid-table-collaborate-container">' +
        '<ul class="collaborate-menu">' +
        '<li><a href="javascript:; " data-val="alternate" class="alternate">备降</a></li>' +
        '<li><a href="javascript:;" data-val="pre-alternate" class="pre-alternate">预选</a></li>' +
        '<li><a href="javascript:;" data-val="occupied" class="occupied">正班占用</a></li>' +
        '</ul>' +
        '</div>');

    var LEVEL2 = $('<ul class="collaborate-menu level-2">' +
        '<li><a href="javascript:; " data-val="other" class="other">其它<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:; " data-val="complex" class="complex">军民合用<span class="glyphicon glyphicon-play"></span></a></li>' +
        '<li><a href="javascript:; " data-val="outside" class="outside">区外</a></li>' +
        '</ul>') ;

    var OTHER = $('<ul class="collaborate-menu collaborate-menu-other">' + '</ul>');
    var COMPLEX = $('<ul class="collaborate-menu collaborate-menu-complex">' + '</ul>');

    return {
        ARR_DOM: ARR_DOM,
        ALTERNATE_DOM: ALTERNATE_DOM,
        OVER_DOM: OVER_DOM,
        DEP_DOM: DEP_DOM,
        LEVEL2 : LEVEL2,
        OTHER : OTHER,
        COMPLEX : COMPLEX
    }

}();
