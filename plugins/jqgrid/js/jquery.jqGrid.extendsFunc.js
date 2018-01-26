/**
 * Created by liutianjiao on 2018/01/26.
 * jqGrid方法扩展
 */

$.jgrid.extend({
    //表格尺寸随窗口缩放自适应。前提为：gbox的父类为弹性布局（如flex）
    resizeSize: function () {
        return this.each(function () {
            var $t = this;
            if (!$t.grid) {
                return;
            }
            var $tid = $t.id;
            // 获取表格所在盒子结构下元素
            var gridTableGBox = $('#gbox_' + $tid);
            // 获取容器
            var container = gridTableGBox.parent()
            //表格盒子高度清，为找到弹性高度
            gridTableGBox.height(0)
            //容器高度
            var containerHeight = container.height()
            //表格盒子高度 = 容器高度
            gridTableGBox.height(containerHeight)
            // 获取表格所在表格视图结构下元素
            var gridTableGView = $('#gview_' + $tid, container);
            //盒子和视图的差值（视图不包含pager的）
            var diff = gridTableGBox.height() - gridTableGView.height();
            // 获取表格所在pager元素
            var gridTablePager = $('.ui-jqgrid-pager', gridTableGBox);
            if(gridTablePager.length > 0){
                diff -= gridTablePager.height()
            }
            // 计算表格高度
            var gridTableBodyHeight = $($t.grid.bDiv).outerHeight()
            var gridTableHeight = gridTableBodyHeight +  diff
            // 计算表格宽度
            var gridTableWidth = container.width();

            $('#' + $tid).jqGrid('setGridHeight', gridTableHeight);
            $('#' + $tid).jqGrid('setGridWidth', (gridTableWidth - 2));

        });
    }
})