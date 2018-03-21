

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
			$(this).val($(this).val().toUpperCase());
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
		
	/**
	 * 表格列名称
	 */
	colNames : [ 'id', '数据版本', '航班数据ID', '航班号', '协调类型', '协调前', '协调后', '协调备注',
			'协调状态', '协调时间', '协调用户EN', '协调用户' , '用户IP' ],

	/**
	 * 表格列模式
	 */
	colModel : [ {
		name : 'id',
		index : 'id',
		hidden : true
	}, {
		name : 'version',
		index : 'version',
		hidden : true
	}, {
		name : 'fid',
		index : 'fid',
		hidden : true
	}, {
		name : 'flightid',
		index : 'flightid'
	}, {
		name : 'type',
		index : 'type'
	}, {
		name : 'originalValue',
		index : 'originalValue'
	}, {
		name : 'value',
		index : 'value'
	}, {
		name : 'comments',
		index : 'comments'
	},{
		name : 'status',
		index : 'status'
	}, {
		name : 'timestamp',
		index : 'timestamp',
		formatter : FlightCoordinationRecordCell.timeFormater
	}, {
		name : 'username',
		index : 'username',
		hidden : true
	}, {
		name : 'usernameZh',
		index : 'usernameZh'
	}, {
		name : 'ipAddress',
		index : 'ipAddress'
	} ]
};