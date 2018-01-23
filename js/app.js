/**
 *
 */


var App = function () {
    /*// 模块 class 名称
    var moduleClass = ['arr-module','alternate-module','over-module','dep-module'];
    // 模块内表格ID
    var tableIDs = ['arr-table','alternate-table','over-table','dep-table'];
    // 模块内表格pagerID
    var pagerIDs = ['arr-table-pager','alternate-table-pager','over-table-pager','dep-table-pager'];*/

    var arrObj = {};
    var alternateObj= {};
    var overObj = {};
    var depObj = {};
   /* // 模块对象
    var moduleObj = [arrObj,alternateObj,overObj,depObj];*/
    // 活动模块所在模块下标
    var index = 0;

    // 初始化模块
    var initModule = function () {
        // 进港计划模块
        arrObj = new FormModule({
            canvasId: 'arr-module',
            tableId: 'arr-table',
            url : 'http://localhost:8085/altf/airport/retrieveArrFlights'

        });
        arrObj.initFormModuleObject();

        // 备降计划模块
        alternateObj = new FormModule({
            canvasId: 'alternate-module',
            tableId: 'alternate-table',
            url : 'http://localhost:8085/altf/airport/retrieveAlternateFlights'
        });
        alternateObj.initFormModuleObject();

        // 疆内飞越模块
        overObj = new FormModule({
            canvasId: 'over-module',
            tableId: 'over-table',
            url : 'http://localhost:8085/altf/airport/retrieveOverFlights'
        });
        overObj.initFormModuleObject();

        // 出港计划模块
        depObj = new FormModule({
            canvasId: 'dep-module',
            tableId: 'dep-table',
            url : 'http://localhost:8085/altf/airport/retrieveDepFlights'
        });
        depObj.initFormModuleObject();
    };

    /**
     * 初始化index，绑定菜单栏点击更新index
     * */
    var initIndex = function () {
        index = $('.main-area section.active').index();
        $('.menu-bar li').on('click',function () {
            index = $('.main-area section.active').index();
        });
    };


    return {

        init : function () {
            initIndex();
            initModule();
        }
    }
}();

$(document).ready(function () {
    App.init();
});
