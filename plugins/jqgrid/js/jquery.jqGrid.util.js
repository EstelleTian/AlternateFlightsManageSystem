/**
 * Created by zhaoc on 2016/3/22.
 */

/**
 * GridTable工具类
 *
 * @type {{resizeToFitContainer: Function}}
 */
var GridTableUtil = {

    /**
     * 查询条件转大写
     *
     * @param e
     * @returns
     */
    searchToUpperCase: function (e) {
        $(this).val($(this).val().toUpperCase());
        $(this).change();
    },

    /**
     * 调整表格大小以适应所在容器
     *
     * @param tableId
     */
    resizeToFitContainer: function (tableId) {
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
};

/**
 * GridTable单元格工具类
 *
 * @type {{cellattrCustom: Function, timeFormaterHHmm: Function, positiveFormater: Function, searchToUpperCase: Function}}
 */
var GridTableCellUtil = {

    /**
     * 用于jqGrid绘制当前单元格数据时，为该单元格添加属性
     *
     * This function add attributes to the cell during the creation of the data - i.e dynamically.
     * By example all valid attributes for the table cell can be used or a style attribute with different properties.
     * The function should return string.
     * Parameters passed to this function are:
     *
     * @param rowId 当前行rowId, the id of the row
     * @param val 当前单元格显示值, the value which will be added in the cell
     * @param rowObject 当前行数据对象, the raw object of the data row - i.e if datatype is json - array, if datatype is xml xml node.
     * @param colModel jqGrid的colModel, all the properties of this column listed in the colModel
     * @param rdata 当前行数据的数组, the data row which will be inserted in the row. This parameter is array of type name:value, where name is the name in colModel
     * @returns {string}
     */
    cellattr: function (rowId, val, rowObject, colModel, rdata) {
        // 返回结果，即需要为当前单元格添加的属性
        var attrs = '';
        // 判断数据有效性
        if (!$.isValidVariable(val)) {
            return attrs;
        }
        // 自定义单元给title提示信息
        var title = null;
        if ($.isValidVariable(rowObject[colModel.name + '_title'])) {
            title = rowObject[colModel.name + '_title'];
        } else {
            title = rowObject[colModel.name];
        }
        if (!$.isValidVariable(title)) {
            title = '';
        } else {
            attrs = attrs + ' title="' + title + '"';
        }
        // 自定义单元格style显示样式
        var style = rowObject[colModel.name + '_style'];
        if ($.isValidVariable(style)) {
            attrs = attrs + ' style="' + style + '"';
        } else {
            attrs = attrs + ' style="' + rowObject['default_style'] + '"';
        }
        // 返回为当前单元格添加的属性
        return attrs;
    },

    /**
     * 用于jqGrid自定义排序方法，该方法判断排序方向，调整空值（null）为最大值或最小值，保证空值始终显示在排序的最下方
     *
     * Custom function to make custom sorting when datatype is local.
     * Three parameters a, b and direction are passed.
     * The a and b parameters are values to be compared, direction is numeric 1 and -1 for ascending and descending order.
     * The function should return 1, -1 or 0
     *
     * @param a 用于比较的单元格值a
     * @param b 用于比较的单元格值a
     * @param direction 比较方向，即正序或倒序
     * @returns {number} 返回结果 1, -1, 0
     */
    sortfunc: function (a, b, direction) {
        // 判断数据类型，使用不同的比较方法
        if ($.type(a) === "number" || $.type(b) === "number") {
            // 数字类型
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
        } else {
            // 字符串类型
            var maxStr = 'ZZZZZZZZZZZZZZZZZ';
            if (!$.isValidVariable(a)) {
                if (direction > 0) {
                    a = maxStr;
                } else {
                    a = '';
                }
            }
            if (!$.isValidVariable(b)) {
                if (direction > 0) {
                    b = maxStr;
                } else {
                    b = '';
                }
            }
            return a.localeCompare(b) * direction;
        }
    },

    /**
     * 单元格时间格式化工具，将数据格式化为HHmm格式，适用于字符串时间格式单元格
     *
     * @param cellvalue 当前单元格数据
     * @param options jqGrid的配置项
     * @param rowObject 当前行数据
     * @returns {*}
     */
    timeFormaterHHmm: function (cellvalue, options, rowObject) {
        if ($.isValidVariable(cellvalue)) {
            return cellvalue.substring(8, 12);
        } else {
            return cellvalue;
        }
    },

    /**
     * 单元格时间格式化工具，将数据格式化为HHmm格式，适用于字符串时间格式单元格
     *
     * @param cellvalue 当前单元格数据
     * @param options jqGrid的配置项
     * @param rowObject 当前行数据
     * @returns {*}
     */
    timeFormaterDDHHmm: function (cellvalue, options, rowObject) {
        if ($.isValidVariable(cellvalue)) {
            return cellvalue.substring(6, 8) + '/' + cellvalue.substring(8, 12);
        } else {
            return cellvalue;
        }
    },

    /**
     * 单元格正数格式化工具，适用于数字格式单元格
     *
     * @param cellvalue 当前单元格数据
     * @param options jqGrid的配置项
     * @param rowObject 当前行数据
     * @returns {*}
     */
    positiveFormater: function (cellvalue, options, rowObject) {
        if ($.isValidVariable(cellvalue)) {
            if (parseInt(cellvalue) < 0) {
                return '';
            } else {
                return cellvalue;
            }
        } else {
            return '';
        }
    }
};

