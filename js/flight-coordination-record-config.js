
/**
 * 协调记录表格单元格格式化处理
 *
 * */
var FlightCoordinationRecordCell = {
	
		/**
		 * 时间格式化工具
		 * 
		 * @param cellvalue
		 *            当前单元格数值
		 * @param options
		 *            JQGrid传入的配置项
		 * @param rowObject
		 *            当前行数据
		 * @returns
		 */
		timeFormater : function(cellvalue, options, rowObject) {
			if ($.isValidVariable(cellvalue)) {
				return cellvalue.substring(6, 8) + '/' + cellvalue.substring(8, 12);
			} else {
				return cellvalue;
			}
		},
		/**
		 * 查询条件转大写
		 * 
		 * @param e
		 * @returns
		 */
		searchToUpperCase : function(e) {
			// $(this).val($(this).val().toUpperCase());
			$(this).change();
		},
		/**
		 * 单元格默认样式配置
		 * 
		 * @param rowId JQGrid当前行ID
		 * @param value 当前单元格显示值
		 * @param rowObject 当前行数据
		 * @param colModel JQGrid当前列colModel对象
		 * @param arrData 将要插入的数据项
		 * @returns {String} 需要赋给单元格的属性 PS：注意不同属性间需要有空格分隔
		 */
		cellattrCustom: function(rowId, value, rowObject, colModel, arrData) {
			// 需要赋予表格的属性
			var attrs = '';

			// 无效数值不做处理
			if (!$.isValidVariable(value)) {
				return attrs;
			}

			var title = null;
			if($.isValidVariable(rowObject[colModel.name + '_title'])){
				title =  rowObject[colModel.name + '_title'];
			}else{
				title = rowObject[colModel.name];
			}
			
			if(!$.isValidVariable(title)){
				title = '';
			}
			attrs = attrs + ' title="' + title + '"';
			
			// 显示style
			var style = rowObject[colModel.name + '_style'];
			if ($.isValidVariable(style)) {
				attrs = attrs + ' style="' + style + '"';
			} else {
				attrs = attrs + ' style="' + rowObject['default_style'] + '"';
			}
			
			return attrs;
		}
};




/**
 * 协调记录列表配置
 */
var FlightCoordinationRecordConfig = {


	/**
	 * 表格列模式模板（通用效果）
	 */
	colModelTemplate : {
		align : 'center',
		sortable : true,
		search : true,
		searchoptions : {
			sopt : ['cn','nc','eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en'], 
			dataEvents:[{type: 'keyup', fn: FlightCoordinationRecordCell.searchToUpperCase}]},
		cellattr : FlightCoordinationRecordCell.cellattrCustom,	
		sortfunc : function(a, b, direction) {
			// 若为升序排序，空值转换为最大的字符串进行比较
			// 保证排序过程中，空值始终在最下方
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
	},



    colName : ['id','计划批号', '航班号', '协调类型','协调前','协调后','协调时间','协调用户','协调用户','用户IP','协调备降',],
    colModel: [
		// 协调记录主键
        {
            name: 'id',
            index: 'id',
            hidden : true
        },
        // 计划批号
        {
            name: 'flightDataId',
            index: 'flightDataId',
            hidden : true
        },
        // 航班号
        {
            name: 'flightId',
            index: 'flightId'
        },
        // 协调类型
        {
            name : 'type',
            index : 'type'
        },
        //协调前
        {
            name : 'originalValue',
            index : 'originalValue'
        },
        //协调后
        {
            name : 'value',
            index : 'value'
        },
        //协调时间
        {
            name : 'coordinateTime',
            index : 'coordinateTime'
        },
		//协调用户
        {
            name : 'userName',
            index : 'userName'
        },
		//协调用户
        {
            name : 'userDescription',
            index : 'userDescription'
        },
		//用户IP
        {
            name : 'ipAddress',
            index : 'ipAddress'
        },
		//协调备降
        {
            name : 'comments',
            index : 'comments',
            hidden : true
        },



        ],
    colTitle: {
        id:'协调记录主键',
        flightDataId:'计划批号',
        status:'备降状态',
        flightId:'航班号',
        registeNum:'机号',
        type:'协调类型',
        originalValue:'协调前',
        value:'协调后',
        coordinateTime:'协调时间',
        userName:'协调用户',
        userDescription:'协调用户',
        ipAddress:'用户IP',
        comments: '协调备降'
    }

};