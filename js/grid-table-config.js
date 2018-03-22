/**
 * 2018/01/23
 * author: zxy
 * 表格列配置
 */

var GridTableConfig = function () {
    // 通用表(进港计划表 出港计划表 疆内飞越表)
    var common = {
        colName : ['计划批号','备降场', '备降状态', '航班号', '机号','机型', '起飞机场','降落机场','计划ETD', '动态ETD', 'ATD','计划ETA','动态ETA','ATA','任务' ],
        colModel: [
            // 计划批号
            {
                name: 'flightDataId',
                index: 'flightDataId',
                width:120,
                // frozen:true
            },
            // 备降场
            {
                name: 'altairport',
                index: 'altairport',
                width:120,
                // frozen:true
            },
            // 备降状态
            {
                name: 'status',
                index: 'status',
                formatter : formatterStatus
            },
            // 航班号
            {
                name: 'flightId',
                index: 'flightId'
            },
            // 机号
            {
                name: 'registeNum',
                index: 'registeNum'
            },
            // 机型
            {
                name: 'aircraftType',
                index: 'aircraftType'
            },

            // 起飞机场
            {
                name: 'depap',
                index: 'depap'
            },
            // 降落机场
            {
                name: 'arrap',
                index: 'arrap'
            },
            // 计划ETD
            {
                name: 'petd',
                index: 'petd',
                formatter : formatterDateTime
            },
            // 动态ETD
            {
                name: 'detd',
                index: 'detd',
                formatter : formatterDateTime
            },
            // ATD
            {
                name: 'atd',
                index: 'atd',
                width:120,
                formatter : formatterDateTime
            },
            // 计划ETA
            {
                name: 'peta',
                index: 'peta',
                formatter : formatterDateTime
            },
            // 动态ETA
            {
                name: 'deta',
                index: 'deta',
                formatter : formatterDateTime
            },
            // ATA
            {
                name: 'ata',
                index: 'ata',
                formatter : formatterDateTime
            },


            // 任务
            {
                name: 'task',
                index: 'task'
            }],
        colTitle: {
            flightDataId:'计划批号',
            altairport:'备降场',
            status:'备降状态',
            flightId:'航班号',
            registeNum:'机号',
            aircraftType:'机型',
            depap:'起飞机场',
            arrap:'降落机场',
            petd:'计划ETD',
            detd:'动态ETD',
            atd:'ATD',
            peta:'计划ETA',
            deta: '动态ETA',
            ata: 'ATA',
            task:'任务'
        }
    };
    // 备降计划表
    var alertnate = {
        colName: ['计划批号','备降场', '备降状态','航班号', '机号', '机型', '机型分类', '占用机位', '起飞机场', '降落机场','计划ETD', '动态ETD', 'ATD','计划ETA','动态ETA','ATA','实际落地机场', '机位状态','备降起飞' ],
        colTitle: {
            flightDataId: '计划批号',
            altairport: '备降场',
            status: '备降状态',
            flightId: '航班号',
            registeNum: '机号',
            aircraftType: '机型',
            aircraftTypeCategory: '机型分类',
            occupyPosition: '占用机位',
            depap: '起飞机场',
            arrap: '降落机场',
            petd: '计划ETD',
            detd: '动态ETD',
            atd: 'ATD',
            peta: '计划ETA',
            deta: '动态ETA',
            ata: 'ATA',
            rarrap : '实际落地机场',
            positionStatus: '机位状态',
            alternateDeptime: '备降起飞'

        },
        colModel: [

            // 计划批号
            {
                name: 'flightDataId',
                index: 'flightDataId',
                width: 120
            },
            // 备降场
            {
                name: 'altairport',
                index: 'altairport',
            },
            // 备降状态
            {
                name: 'status',
                index: 'status',
                formatter : formatterStatus
            },
            // 航班号
            {
                name: 'flightId',
                index: 'flightId',
                width: 120
            },
            // 机号
            {
                name: 'registeNum',
                index: 'registeNum'
            },
            // 机型
            {
                name: 'aircraftType',
                index: 'aircraftType'
            },
            // 机型分类
            {
                name: 'aircraftTypeCategory',
                index: 'aircraftTypeCategory'
            },
            // 占用机位
            {
                name: 'occupyPosition',
                index: 'occupyPosition'
            },
            // 起飞机场
            {
                name: 'depap',
                index: 'depap'
            },
            // 降落机场
            {
                name: 'arrap',
                index: 'arrap'
            },
            // 计划ETD
            {
                name: 'petd',
                index: 'petd',
                formatter : formatterDateTime
            },
            // 动态ETD
            {
                name: 'detd',
                index: 'detd',
                formatter : formatterDateTime
            },
            // ATD
            {
                name: 'atd',
                index: 'atd',
                formatter : formatterDateTime
            },
            // 计划ETA
            {
                name: 'peta',
                index: 'peta',
                formatter : formatterDateTime
            },
            // 动态ETA
            {
                name: 'deta',
                index: 'deta',
                formatter : formatterDateTime
            },
            // ATA
            {
                name: 'ata',
                index: 'ata',
                formatter : formatterDateTime
            },
            // 实际落地机场
            {
                name: 'rarrap',
                index: 'rarrap',
            },

            // 机位状态
            {
                name: 'positionStatus',
                index: 'positionStatus'
            },
            // 备降起飞
            {
                name: 'alternateDeptime',
                index: 'alternateDeptime'
            }

        ]
    }
    // 备降历史数据查询表
    var alertnateHistory = {
        colName: ['计划批号','备降场', '备降状态','航班号', '机号', '机型', '机型分类', '占用机位', '起飞机场', '降落机场','计划ETD', '动态ETD', 'ATD','计划ETA','动态ETA','ATA','实际落地机场', '机位状态','备降起飞','计划日期' ],
        colTitle: {
        flightDataId: '计划批号',
            altairport: '备降场',
            status: '备降状态',
            flightId: '航班号',
            registeNum: '机号',
            aircraftType: '机型',
            aircraftTypeCategory: '机型分类',
            occupyPosition: '占用机位',
            depap: '起飞机场',
            arrap: '降落机场',
            petd: '计划ETD',
            detd: '动态ETD',
            atd: 'ATD',
            peta: '计划ETA',
            deta: '动态ETA',
            ata: 'ATA',
            rarrap : '实际落地机场',
            positionStatus: '机位状态',
            alternateDeptime: '备降起飞',
            executeDate: '计划日期'

    },
        colModel: [

            // 计划批号
            {
                name: 'flightDataId',
                index: 'flightDataId',
                width: 120
            },
            // 备降场
            {
                name: 'altairport',
                index: 'altairport',
            },
            // 备降状态
            {
                name: 'status',
                index: 'status',
                formatter : formatterStatus
            },
            // 航班号
            {
                name: 'flightId',
                index: 'flightId',
                width: 120
            },
            // 机号
            {
                name: 'registeNum',
                index: 'registeNum'
            },
            // 机型
            {
                name: 'aircraftType',
                index: 'aircraftType'
            },
            // 机型分类
            {
                name: 'aircraftTypeCategory',
                index: 'aircraftTypeCategory'
            },
            // 占用机位
            {
                name: 'occupyPosition',
                index: 'occupyPosition'
            },
            // 起飞机场
            {
                name: 'depap',
                index: 'depap'
            },
            // 降落机场
            {
                name: 'arrap',
                index: 'arrap'
            },
            // 计划ETD
            {
                name: 'petd',
                index: 'petd',
                formatter : formatterDateTime
            },
            // 动态ETD
            {
                name: 'detd',
                index: 'detd',
                formatter : formatterDateTime
            },
            // ATD
            {
                name: 'atd',
                index: 'atd',
                formatter : formatterDateTime
            },
            // 计划ETA
            {
                name: 'peta',
                index: 'peta',
                formatter : formatterDateTime
            },
            // 动态ETA
            {
                name: 'deta',
                index: 'deta',
                formatter : formatterDateTime
            },
            // ATA
            {
                name: 'ata',
                index: 'ata',
                formatter : formatterDateTime
            },
            // 实际落地机场
            {
                name: 'rarrap',
                index: 'rarrap',
            },

            // 机位状态
            {
                name: 'positionStatus',
                index: 'positionStatus'
            },
            // 备降起飞
            {
                name: 'alternateDeptime',
                index: 'alternateDeptime'
            },
            // 计划日期
            {
                name: 'executeDate',
                index: 'executeDate'
            }

        ]
    }
    // 备降场机位容量表

    // ......
    // colModel模板
    var colModelTemplate = {
        width: 100,
        align: 'center',
        sortable : true,
        search : true,
        searchoptions : {
            sopt : ['cn','nc','eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en'],
            dataEvents:[
                {	type: 'keyup',
                    fn: function (e) {
                        $(this).change();
                    },
                }
            ]
        },
        // 单元格相关属性处理
        cellattr: function (rowId, value, rowObject, colModel, arrData) {
            // 需要赋予表格的属性
            var attrs = '';
            // 无效数值不做处理
            if (!$.isValidVariable(value)) {
                return attrs;
            }
            // 单元格原始值,未formatter
            var cellcontent = rowObject[colModel.name];
            // 若单元格值无效
            if (!$.isValidVariable(cellcontent)) {
                cellcontent = '';
            }
            /**
             *  处理时间单元格，用以单元格title显示值的格式
             * */
            // 单元格值长度
            var len = cellcontent.length;
            //时间格式
            var regexp = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
            //12位有效时间
            if (regexp.test(cellcontent) && len == 12) {
                cellcontent = cellcontent.substring(0, 8) + ' ' + cellcontent.substring(8, 10) + ":" + cellcontent.substring(10, 12);
            } else if (regexp.test(cellcontent) && len == 14) { //14位有效时间
                cellcontent = cellcontent.substring(0, 8) + ' ' + cellcontent.substring(8, 10) + ":" + cellcontent.substring(10, 12) + ':' + cellcontent.substring(12, 14);
            }
            // 设置title属性
            attrs = ' title="' + cellcontent + '"';

            // 显示单元格样式style
            var style = rowObject[colModel.name + '_style'];
            if ($.isValidVariable(style)) {
                attrs = attrs + ' style="' + style + '"';
            }

            /**
             * 处理状态列
             * */
            // 取得列值
            var colName = colModel.name;
            // 限制状态列
            if(colName == 'status'){
                // 取得单元格内容转换后的值
                var matter = formatterStatus(cellcontent);
                // 设置title属性为转换后的值
                attrs = ' title="' + matter + '"'
            }

            return attrs;
        },
        sortfunc: function (a, b, direction) {
            // 若为升序排序，空值转换为最大的值进行比较
            // 保证排序过程中，空值始终在最下方
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
                var maxStr = 'ZZZZZZZZZZZZ';
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
        }
    };
    // 单元格时间格式化
    function formatterDateTime (cellvalue, options, rowObject) {
        var val = cellvalue * 1;
        if ($.isValidVariable(cellvalue) && !isNaN(val)) {
            // 12位时间
            if (cellvalue.length == 12) {
                return cellvalue.substring(6, 8) + ' ' + cellvalue.substring(8, 10) + ':' + cellvalue.substring(10, 12);
            }else if(cellvalue.length == 14){  // 14位时间
                return cellvalue.substring(6, 8) + ' ' + cellvalue.substring(8, 10) + ':' + cellvalue.substring(10, 12) + ':' + cellvalue.substring(12, 14);
            }
        }else {
            return '';
        }
    };
    // 航班状态列数值格式化转换
    function formatterStatus(cellvalue, options, rowObject) {
        var code = app.statusCode;
        if($.isValidObject(code) && $.isValidVariable(code[cellvalue])){
           return code[cellvalue].text;
        }else {
            return cellvalue;
        }

    }

    return {
        common : common,
        alertnate : alertnate,
        alertnateHistory : alertnateHistory,
        colModelTemplate : colModelTemplate
    }


}();
