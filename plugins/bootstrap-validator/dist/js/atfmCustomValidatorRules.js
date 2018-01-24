;
(function ($) {
    $.fn.bootstrapValidator.i18n = $.extend(true, $.fn.bootstrapValidator.i18n, {
        //必填
        notEmpty: {
            'default': '必填项，请输入值'
        },
        //八位日期YYMMDD验证
        dateFormat:{
            'default': '请输入正确的日期格式(YYMMDD)'
        },
        //四位时间值验证
        timeFormat: {
            'default': '请输入正确的时间格式(HHmm)，有效范围0000-2359'
        },
        //
        dateTimeFormat:{
            'default': '无效的日期或时间'
        },
        //和当前时间比较
        compareCurrentTime: {
            'default': '输入时间不能早于当前时间'
        },
        //和当前时间比较
        compareCTOTCurrentTime: {
            'default': '输入时间不能早于当前时间'
        },
        //两个日期之间比较
        dateComparison:{
            'default': '截止时间不能早于起始时间'
        },
        //两个四位时间之间比较
        timeComparison:{
            'default': '截止时间不能早于起始时间'
        },
        //两个八位日期之前比较
        dateComparisonFromDate:{
            'default': '截止日期不能早于起始日期'
        },
        compareTOBT: {
            'default': '录入时间不能早于预关时间'
        },
        comparePDeptime: {
            'default': '输入时间最早不可超过报文时间前60分钟'
        },
        //-------
        compareCOBT2TOBT: {
            'default': '录入预撤时间COBT不能早于预关时间TOBT'
        },
        compareCTOT2TOBT: {
            'default': '录入预起时间CTOT不能早于预关时间TOBT+滑行时间'
        },
        compareASBT2Now: {
            'default': '航班未推出，上客时间ASBT不能早于当前时间-15分钟，不能晚于当前时间',
        },
        compareAGCT2Now: {
            'default': '航班未推出，关门时间AGCT不能早于当前时间-15分钟，不能晚于当前时间',
        },
        compareAOBT2Now: {
            'default': '航班未推出，推出时间AOBT不能早于当前时间-15分钟，不能晚于当前时间',
        },
        //仅数字
        onlyNumber: {
            'default':'只能输入正整数'
        },
        //00~59的正整数
        effectiveNumber:{
            'default':'有效范围: 00~59的正整数'
        },
        //升序
        effectiveAsc:{
            'default':'请按升序排列'
        },
        positiveNumber: {
            'default': '只能为正整数',
        },
        singleDecimal: {
            'default': '只能为正整数或一位小数',
        },
        hunEffectiveNumber: {
            'default': '请输入0-99内的数字',
        },


        //间隔大于等于5
        interval5:{
            'default':'间隔大于等于5'
        },

        //机场名称
        airportName:{
            'default':'请输入正确的机场格式(AAAA,BBC?,AB??,AACC)'
        },
        //数字与逗号
        numberAndComma:{
            'default':'请输入正整数,多个以逗号分隔'
        },

        //如果截止日期有值,则截止时间不能为空
        datenoEmpty:{
            'default':'必填项，请输入值'
        },


    });

    $.fn.bootstrapValidator.validators = {
        notEmpty: {
            enableByHtml5: function ($field) {
                var required = $field.attr('required') + '';
                return ('required' === required || 'true' === required);
            },
            /**
             * Check if input value is empty or not
             *
             * @param {BootstrapValidator} validator The validator plugin instance
             * @param {jQuery} $field Field element
             * @param {Object} options
             * @returns {Boolean}
             */
            validate: function (validator, $field, options) {
                var type = $field.attr('type');
                if ('radio' === type || 'checkbox' === type) {
                    return validator.getFieldElements($field.attr('data-bv-field')).filter(':checked').length > 0;
                }
                return $.trim($field.val()) !== '';
            }
        },
        positiveNumber: {
            validate: function( validator, $field, options ){
                // 若表单验证已经不通过，则不需要继续再进行验证
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                var inputVal = $.trim($field.val()) * 1;
                var reg = /^\d+$/;
                return reg.test(inputVal);
            }
        },
        singleDecimal: {
            validate: function( validator, $field, options){
                // 若表单验证已经不通过，则不需要继续再进行验证
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                var inputVal = $.trim($field.val()) * 1;
                //var reg = /^(\d*?\.\d?)$|^(\d+)$/;
                var reg = /^(\d*?\.\d?)$|^([1-9]\d*)$/;
                return reg.test(inputVal);
            }
        },
        //两个日期之间比较
        dateComparison: {
            validate: function (validator, $field, options) {
                var firstDate = options.firstDate();
                var secDate = options.secDate();
                if (secDate == "" || secDate.length < 12) {
                    return true;
                }
                if (firstDate * 1 >= secDate * 1) {
                    return false;
                }
                return true;
            }
        },
        //两个四位时间之间比较
        timeComparison: {
            validate: function (validator, $field, options) {
                var firstTime = options.firstTime();
                var secTime = options.secTime();
                if(secTime.length < 4){
                    return true;
                }
                if (firstTime * 1 >= secTime * 1) {
                    return false;
                }
                return true;
            }
        },
        //两个八位日期之前比较
        dateComparisonFromDate : {
            validate: function (validator, $field, options) {
                var firstDate = options.firstDate();
                var secDate = options.secDate();

                if (firstDate * 1 > secDate * 1) {
                    return false;
                }
                return true;
            }
        },

        dateFormat: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var regexp = /^(19|20)\d\d(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/;
                return regexp.test(inputVal);
            }
        },
        timeFormat: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var regexp = /(^[0-1][0-9]|^2[0-3])[0-5]{1}[0-9]{1}$/;
                return regexp.test(inputVal);
            }
        },
        compareCTOTCurrentTime: {
            validate: function (validator, $field, options) {
                var f1 = options.f1;
                var f2 = options.f2;
                //入池航班 分配预起时间时，录入时间早于当前时间，告警提示
                if (f1 || f2) {
                    var timeVal = $.trim($field.val());
                    if (timeVal.length < 4) {
                        return true;
                    }
                    var inputVal = options.inputVal.val() + timeVal;
                    var curVal = options.curVal;
                    var diff = $.calculateStringTimeDiff(inputVal, curVal) / 1000 / 60;
                    return diff > 0;
                } else {
                    return true;
                }
            }
        },
        compareCurrentTime: {
            validate: function (validator, $field, options) {
                var timeVal = $.trim($field.val());
                if (timeVal.length < 4) {
                    return true;
                }
                var inputVal = options.inputVal.val() + timeVal;
                var curVal = options.curVal;
                var diff = $.calculateStringTimeDiff(inputVal, curVal) / 1000 / 60;
                return diff > 0;
            }
        },
        //两个日期之间比较
        dateComparison: {
            validate: function (validator, $field, options) {
                var firstDate = options.firstDate();
                var secDate = options.secDate();
                if (secDate == "" || secDate.length < 12) {
                    return true;
                }
                if (firstDate * 1 >= secDate * 1) {
                    return false;
                }
                return true;
            }
        },
        compareTOBT: {
            validate: function (validator, $field, options) {
                var taxi = options.taxi;
                var tobt = options.tobt;
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                //COBT或(CTOT-TAXI)值早于TOBT，则进行黄色的告警提示“录入COBT时间早于TOBT时间”
                if ($.isValidVariable(taxi) && $.isValidVariable(tobt)) {
                    var timeVal = $.trim($field.val());
                    if (timeVal.length < 4) {
                        return true;
                    }
                    var firstVal = options.firstVal.val() + timeVal;
                    var diff = $.calculateStringTimeDiff(firstVal, tobt) / 1000 / 60;
                    return diff > taxi;
                } else {
                    return true;
                }
            }
        },
        comparePDeptime: {
            validate: function (validator, $field, options) {
                var timeVal = $.trim($field.val());
                if (timeVal.length < 4) {
                    return true;
                }
                var pdeptime = options.pdeptime;
                var firstVal = options.firstVal.val() + timeVal;
                var diff = $.calculateStringTimeDiff(firstVal, pdeptime) / 1000 / 60;
                return diff > -60;
            }
        },
        compareCOBT2TOBT: {
            validate: function (validator, $field, options) {
                // 若表单验证已经不通过，则不需要继续再进行验证
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                // 获取TOBT
                var tobt = options.tobt;
                // COBT值早于TOBT，则进行黄色的告警提示“录入COBT时间早于TOBT时间”
                if ($.isValidVariable(tobt)) {
                    //var cobtTime = $.trim($field.val());
                    var cobtTime = options.cobtTime.val();
                    if (cobtTime.length < 4) {
                        return true;
                    }
                    var cobt = options.cobtDate.val() + cobtTime;
                    var diff = $.calculateStringTimeDiff(cobt, tobt) / 1000 / 60;
                    return diff >= 0;
                } else {
                    return true;
                }
            }
        },
        compareCTOT2TOBT: {
            validate: function (validator, $field, options) {
                // 若表单验证已经不通过，则不需要继续再进行验证
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                // 获取TOBT、TAXT
                var tobt = options.tobt;
                var taxi = options.taxi;
                // COBT值早于TOBT，则进行黄色的告警提示“录入COBT时间早于TOBT时间”
                if ($.isValidVariable(tobt) && $.isValidVariable(taxi)) {
                    //var ctotTime = $.trim($field.val());
                    var ctotTime = options.ctotTime.val();
                    if (ctotTime.length < 4) {
                        return true;
                    }
                    var ctot = options.ctotDate.val() + ctotTime;
                    var diff = $.calculateStringTimeDiff(ctot, tobt) / 1000 / 60;
                    return diff >= taxi;
                } else {
                    return true;
                }
            }
        },
        compareASBT2Now: {
            validate: function (validator, $field, options) {
                // 若表单验证已经不通过，则不需要继续再进行验证
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                // 获取检查参数
                var now = options.now;
                var dateElement = options.dateElement;
                var hasAOBT = options.hasAOBT;
                // 拼接完整的ASBT
                var asbtDate = dateElement.val();
                var asbtTime = $.trim($field.val());

                if (asbtTime.length < 4) {
                    return true;
                }
                var asbt = asbtDate + '' + asbtTime;
                // 根据推出状态，判断AGCT是否符合条件
                var asbtNowDiff = $.calculateStringTimeDiff(asbt, now) / 1000 / 60;
                if (hasAOBT) {
                    // 已推出，判断AGCT是否在[NOW-30min, NOW]之间
                    if (asbtNowDiff < -30 || asbtNowDiff > 0) {
                        return {
                            valid: false,
                            message: '航班已推出，上客时间ASBT不能早于当前时间-30分钟，不能晚于当前时间'
                        }
                    }
                } else {
                    // 未推出，判断AGCT是否在[NOW-15min, NOW]之间
                    if (asbtNowDiff < -15 || asbtNowDiff > 0) {
                        return {
                            valid: false,
                            message: '航班未推出，上客时间ASBT不能早于当前时间-15分钟，不能晚于当前时间'
                        };
                    }
                }
                return true;
            }
        },
        compareAGCT2Now: {
            validate: function (validator, $field, options) {
                // 若表单验证已经不通过，则不需要继续再进行验证
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                // 获取检查参数
                var now = options.now;
                var dateElement = options.dateElement;
                var hasAOBT = options.hasAOBT;
                // 拼接完整的AGCT
                var agctDate = dateElement.val();
                var agctTime = $.trim($field.val());
                if (agctTime.length < 4) {
                    return true;
                }
                var agct = agctDate + '' + agctTime;
                // 根据推出状态，判断AGCT是否符合条件
                var agctNowDiff = $.calculateStringTimeDiff(agct, now) / 1000 / 60;
                if (hasAOBT) {
                    // 已推出，判断AGCT是否在[NOW-30min, NOW]之间
                    if (agctNowDiff < -30 || agctNowDiff > 0) {
                        return {
                            valid: false,
                            message: '航班已推出，关门时间AGCT不能早于当前时间-30分钟，不能晚于当前时间'
                        }
                    }
                } else {
                    // 未推出，判断AGCT是否在[NOW-15min, NOW]之间
                    if (agctNowDiff < -15 || agctNowDiff > 0) {
                        return {
                            valid: false,
                            message: '航班未推出，关门时间AGCT不能早于当前时间-15分钟，不能晚于当前时间'
                        };
                    }
                }
                return true;
            }
        },
        compareAOBT2Now: {
            validate: function (validator, $field, options) {
                // 若表单验证已经不通过，则不需要继续再进行验证
                if ($field.parent().parent().find(".help-block:visible").length > 0) {
                    return true;
                }
                // 获取检查参数
                var now = options.now;
                var dateElement = options.dateElement;
                var hasAOBT = options.hasAOBT;
                // 拼接完整的AGCT
                var aobtDate = dateElement.val();
                var aobtTime = $.trim($field.val());
                if (aobtTime.length < 4) {
                    return true;
                }
                var agct = aobtDate + '' + aobtTime;
                // 根据推出状态，判断AGCT是否符合条件
                var agctNowDiff = $.calculateStringTimeDiff(agct, now) / 1000 / 60;
                if (hasAOBT) {
                    // 已推出，判断AGCT是否在[NOW-30min, NOW]之间
                    if (agctNowDiff < -30 || agctNowDiff > 0) {
                        return {
                            valid: false,
                            message: '航班已推出，推出时间AOBT不能早于当前时间-30分钟，不能晚于当前时间'
                        }
                    }
                } else {
                    // 未推出，判断AGCT是否在[NOW-15min, NOW]之间
                    if (agctNowDiff < -15 || agctNowDiff > 0) {
                        return {
                            valid: false,
                            message: '航班未推出，推出时间AOBT不能早于当前时间-15分钟，不能晚于当前时间'
                        };
                    }
                }
                return true;
            }
        },
        //仅限数字
        onlyNumber: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var regexp = /^\+?[0-9]*$/;
                //var regexp = /\d/g;
                return regexp.test(inputVal);
            }
        },
        //至少一个值
        leastOneItem: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());

                if (options.len() == 0) {
                    if (inputVal == "") {
                        return {
                            valid: false,
                            message: '必填项，请输入值'
                        };
                    } else {
                        return true
                    }
                }
                return true;
            }
        },
        //00~59正整数
        effectiveNumber: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var regexp = /^[0-5]{1}[0-9]{1}$/;
                if (!regexp.test(inputVal)) {
                    return {
                        valid: false,
                        message: '有效范围: 00~59的正整数'
                    }
                }
                return true;
            }
        },
        //升序&间隔大于等于5
        effectiveAsc: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var val = options.values();
                var len = val.length;
                if (inputVal.length == 2) {
                    if (len == 0) {
                        return true;
                    } else {
                        if (Number(inputVal) <= val[len - 1]) {
                            return {
                                valid: false,
                                message: '请按升序排列'
                            }
                        }
                        if (Number(inputVal) - val[len - 1] < 5) {
                            return {
                                valid: false,
                                message: '间隔大于等于5'
                            }
                        }
                    }
                }
                return true;
            }
        },
        //间隔大于等于5
        interval5: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var val = options.values();
                var len = val.length;
                if (inputVal.length == 2) {
                    if (len == 0) {
                        return true;
                    } else {
                        if (Number(inputVal) - val[len - 1] < 5) {
                            return {
                                valid: false,
                                message: '间隔大于等于5'
                            }
                        }
                    }
                }
                return true;
            }
        },

        //机场名称
        airportName: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var regexp = /(^[a-zA-Z]{4}|^[a-zA-Z]{2}[\?]{2}|^[a-zA-Z]{3}[\?]{1})([,]([a-zA-Z]{4}|[a-zA-Z]{2}[\?]{2}|[a-zA-Z]{3}[\?]{1}))*$/;
                return regexp.test(inputVal);
            }
        },
        //数字和逗号
        numberAndComma: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var regexp = /^[\d,]*$/;
                return regexp.test(inputVal);
            }
        },

        //日期或时间格式
        dateTimeFormat: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == '') {
                    return true;
                }
                var regexp = /(^[0-1][0-9]|^2[0-3])[0-5]{1}[0-9]{1}$/;
                var reg = /^(?:(?:(?:(?:(?:1[6-9]|[2-9][0-9])?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))()(?:0?2\1(?:29)))|(?:(?:(?:1[6-9]|[2-9][0-9])?[0-9]{2})()(?:(?:(?:0?[13578]|1[02])\2(?:31))|(?:(?:0?[13-9]|1[0-2])\2(?:29|30))|(?:(?:0?[1-9])|(?:1[0-2]))\2(?:0?[1-9]|1[0-9]|2[0-8]))))$/;
                var re = /^([0-1]{1}\d|2[0-3])([0-5]\d)$/;
                if (inputVal.length == 4) {//
                    return regexp.test(inputVal);
                } else if (inputVal.length == 12) {
                    if(!reg.test(inputVal.substring(0,8))){
                        return {
                            valid: false,
                            message: ''+inputVal.substring(0,8)+'日期无效',
                        }
                    }else if(!re.test(inputVal.substring(8,12))){
                        return {
                            valid: false,
                            message: ''+inputVal.substring(8,12)+'时间无效',
                        }
                    }else{
                        return true;
                    }
                } else {
                    return {
                        valid: false,
                        message: inputVal+'日期或时间无效',
                    }
                }

            }
        },

        //如果截止日期有值,则截止时间不能为空
        datenoEmpty:{
            validate: function (validator, $field, options) {
                var date = options.date();
                var inputVal = $.trim($field.val());
                if (inputVal == ''&& date.length > 0) {
                    return  {
                        valid: false,
                        message: '必填项，请输入值'
                    };
                }
                return true
            }
        },

        //00~99正整数
        hunEffectiveNumber: {
            validate: function (validator, $field, options) {
                var inputVal = $.trim($field.val());
                if (inputVal == "") {
                    return true;
                }
                var regexp = /^[0-9]{1}[0-9]{1}$/;
                if (!regexp.test(inputVal)) {
                    return {
                        valid: false,
                        message: '有效范围: 00~99的正整数'
                    }
                }
                return true;
            }
        },





    };
}(window.jQuery));
