/**
 * 表格列配置
 */

var GridTableConfig = function () {
    // 通用表(进港计划表 出港计划表 疆内飞越表)
    var common = {
        colName : ['计划批号','备降场', '状态', '航班号', '机号','机型', '任务', '起飞机场','计划ETD', '动态ETD', 'ATD','计划ETA','降落机场','备注' ],
        colModel: [
            // 计划批号
            {
                name: 'flightDataId',
                index: 'flightDataId',
                width:120,
                frozen:true
            },
            // 备降场
            {
                name: 'altairport',
                index: 'altairport',
                width:120,
                frozen:true
            },
            // 状态
            {
                name: 'status',
                index: 'status'
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
            // 任务
            {
                name: 'task',
                index: 'task'
            },
            // 起飞机场
            {
                name: 'depap',
                index: 'depap'
            },
            // 计划ETD
            {
                name: 'petd',
                index: 'petd'
            },
            // 动态ETD
            {
                name: 'detd',
                index: 'detd'
            },
            // ATD
            {
                name: 'atd',
                index: 'atd'
            },
            // 计划ETA
            {
                name: 'peta',
                index: 'peta'
            },
            // 降落机场
            {
                name: 'arrap',
                index: 'arrap'
            },
            // 备注
            {
                name: 'remark',
                index: 'remark'
            }],
        colTitle: {
            flightDataId:'计划批号',
            altairport:'备降场',
            status:'状态',
            flightId:'航班号',
            registeNum:'机号',
            aircraftType:'机型',
            task:'任务',
            depap:'起飞机场',
            petd:'计划ETD',
            detd:'动态ETD',
            atd:'ATD',
            peta:'计划ETA',
            arrap:'降落机场',
            remark:'备注'
        }
    };
    // 备降计划表
    var alertnate = {
        colName: ['备降计划主键','计划批号', '航班号', '机号', '机型', '机型分类', '占用机位', '任务', '起飞机场', '计划ETD', '动态ETD', 'ATD','动态ETA','ATA', '计划ETA', '降落机场', '备降场', '状态', '备降起飞','修改人','修改时间','备注'],
        colTitle: {
            id : '备降计划主键',
            flightDataId: '计划批号',
            flightId: '航班号',
            registeNum: '机号',
            aircraftType: '机型',
            aircraftTypeCategory: '机型分类',
            occupyPostion: '占用机位',
            task: '任务',
            depap: '起飞机场',
            petd: '计划ETD',
            detd: '动态ETD',
            atd: 'ATD',
            deta: '动态ETA',
            ata: 'ATA',
            peta: '计划ETA',
            arrap: '降落机场',
            altairport: '备降场',
            status: '状态',
            alternateDeptime: '备降起飞',
            oper: '修改人',
            updateTime: '修改时间',
            remark: '备注'
        },
        colModel: [
            // 备降计划主键
            {
                name: 'id',
                index: 'id',
                frozen: true,
                hidden: true
            },
            // 计划批号
            {
                name: 'flightDataId',
                index: 'flightDataId',
                width: 120,
                frozen: true
            },
            // 航班号
            {
                name: 'flightId',
                index: 'flightId',
                width: 120,
                frozen: true
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
                name: 'occupyPostion',
                index: 'occupyPostion'
            },
            // 任务
            {
                name: 'task',
                index: 'task'
            },
            // 起飞机场
            {
                name: 'depap',
                index: 'depap'
            },
            // 计划ETD
            {
                name: 'petd',
                index: 'petd'
            },
            // 动态ETD
            {
                name: 'detd',
                index: 'detd'
            },
            // ATD
            {
                name: 'atd',
                index: 'atd'
            },
            // 动态ETA
            {
                name: 'deta',
                index: 'deta'
            },
            // ATA
            {
                name: 'ata',
                index: 'ata'
            },
            // 计划ETA
            {
                name: 'peta',
                index: 'peta'
            },
            // 降落机场
            {
                name: 'arrap',
                index: 'arrap'
            },
            // 备降场
            {
                name: 'altairport',
                index: 'altairport',
            },
            // 状态
            {
                name: 'status',
                index: 'status'
            },
            // 备降起飞
            {
                name: 'alternateDeptime',
                index: 'alternateDeptime'
            },
            // 修改人
            {
                name: 'oper',
                index: 'oper'
            },
            // 修改时间
            {
                name: 'updateTime',
                index: 'updateTime'
            },
            // 备注
            {
                name: 'remark',
                index: 'remark'
            }]
    }
    // 备降场机位容量表

    // ......

    // colModel模板
    var colModelTemplate = {
            width: 65,
            align: 'center',
            sortable: true,
            search: true,
            searchoptions: {
                sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en'],
                dataEvents: [{
                    type: 'keyup',
                    fn: GridTableUtil.searchToUpperCase
                }]
            },
            // cellattr:FlightGridTableCellConfigcellattrCustom,
            sortfunc : function (a, b, direction) {
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

    return {
        common : common,
        alertnate : alertnate,
        colModelTemplate : colModelTemplate
    }


}();
