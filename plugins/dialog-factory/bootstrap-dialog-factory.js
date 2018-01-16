/**
 * Created by Zhaochen on 2016/3/28.
 */

/**
 * Modified by Liutianjiao on 2016/4/21.
 */
/**
 * Bootstrap Modal Dialog（二次封装）
 *
 * @type {{dialogId: string, dialogTitleId: string, dialogBodyId: string, dialogFooterId: string, buildModalDialogDom: Function, resetModalDialogDom: Function, getModalDialogDom: Function, openModalDialog: Function}}
 */
var BootstrapDialogFactory = function () {
    /**
     * 重要元素ID
     */
    var dialogId = 'bootstrap-modal-dialog';
    var dialogTitleId = 'bootstrap-modal-dialog-title';
    var dialogBodyId = 'bootstrap-modal-dialog-body';
    var dialogFooterId = 'bootstrap-modal-dialog-footer';

    /**
     * 构建对话框DOM元素
     */
    function buildModalDialogDom() {
        if ($('.bootstrap-modal-dialog').length == 1) {
            return;
        } else {
            $('.bootstrap-modal-dialog').remove();
        }
        var modal = $('<div>', {
            'class': 'modal fade bootstrap-modal-dialog',
            'id': dialogId,
            'data-backdrop': "static" // static效果，点击modal外区域不会隐藏modal
        });


        var modalDialog = $('<div>', {
            'class': 'modal-dialog'
        });
        var modalContent = $('<div>', {
            'class': 'modal-content'
        });
        var modalHeader = $('<div>', {
            'class': 'modal-header'
        });
        var modalHeaderClose = $('<button>', {
            'type': 'button',
            'class': 'close',
            'data-dismiss': 'modal',
            'aria-label': 'Close'
        });
        var modalHeaderCloseSpan = $('<span>', {
            'aria-hidden': true,
            'html': '&times;'
        });

        var modalTitle = $('<span>', {
            'class': 'modal-title',
            'id': dialogTitleId
        });
        var modalBody = $('<div>', {
            'class': 'modal-body',
            'id': dialogBodyId
        });
        var modalFooter = $('<div>', {
            'class': 'modal-footer',
            'id': dialogFooterId
        });
        modal.append(modalDialog);
        modalDialog.append(modalContent);
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalContent.append(modalFooter);
        modalHeader.append(modalHeaderClose);
        modalHeaderClose.append(modalHeaderCloseSpan);
        modalHeader.append(modalTitle);
        $('body').append(modal);
    }

    /**
     * 重置对话框DOM元素
     */
    function resetModalDialogDom() {
        var dialogDom = $('#' + dialogId);
        dialogDom.find('#' + dialogTitleId).empty();
        dialogDom.find('#' + dialogBodyId).empty();
        dialogDom.find('#' + dialogFooterId).empty();
    }

    /**
     * 获取对话框DOM对象
     *
     * @returns {*|jQuery|HTMLElement}
     */
    function getModalDialogDom() {
        return $('#' + dialogId);
    }

    return {
        /**
         * 打开对话框
         *
         * @param options
         * ---@param title 弹框标题  非必填  默认：标题
         * ---@param content 弹框内容  非必填  默认：内容
         * ---@param status 弹框状态  非必填 Number 1:正常 2:警告 3:危险 0蓝色/1绿色/2黄色/3红色  默认情况0
         * ---@param isIcon 是否需要小图标  非必填 boolean 默认true
         * ---@param showCancelBtn 是否需要取消按钮 非必填 boolean 默认true
         * ---@param width 弹框宽度  非必填 Number 默认500
         * ---@param mtop 距离页面上部距离  非必填 Number 默认150
         * ---@param pattern 弹框模式  非必填 String 'sm'或不填，默认是正常尺寸，填写sm为小尺寸
         *
         * ---@param buttons 弹框按钮组  非必填 数组型 [{},{},...,{}]
         *    ---@param name 按钮名称
         *    ---@param status 按钮样式 0蓝色/1绿色/2黄色/3红色 默认0
         *    ---@param className 按钮自定义添加类名
         *    ---@param isHidden 是否点击完按钮隐藏弹框 boolean型 默认为true
         *    ---@param callback 回调函数
         */
        dialog: function (options) {
            var pattern = options.pattern;
            buildModalDialogDom();
            var dialogDom = $(".modal-dialog");
            if("sm" == pattern && !dialogDom.hasClass("modal-sm")){
                dialogDom.addClass("modal-sm");
            }else{
                if("sm" != pattern && dialogDom.hasClass("modal-sm")){
                    dialogDom.removeClass("modal-sm");
                }
            }
            resetModalDialogDom();
            var dialogDom = getModalDialogDom();
            var dialogFooter = dialogDom.find('#' + dialogFooterId);
            var dialogCloseCallback = null;
            var titleDom = dialogDom.find('#' + dialogTitleId);
            var statusStyle = "";
            var btnClass = "";
            var fontIcon = "";
            //1:正常 2:警告 3:危险  其余:默认情况
            var status = options.status || 0;
            switch (status) {
                case 1 :
                {
                    statusStyle = "c_5cb85c";
                    fontIcon = "glyphicon-ok-circle";
                    btnClass = "atfm-btn-green";
                    break;
                }
                case 2:
                {
                    statusStyle = "c_f0ad4e";
                    fontIcon = "glyphicon-exclamation-sign";
                    btnClass = "atfm-btn-yellow";
                    break;
                }
                case 3:
                {
                    statusStyle = "c_d9534f";
                    fontIcon = "glyphicon-remove-circle";
                    btnClass = "atfm-btn-red";
                    break;
                }
                default:
                {
                    statusStyle = "c_5bc0de";
                    fontIcon = "glyphicon-ok-circle";
                    btnClass = "atfm-btn-blue";
                    break;
                }
            }
            //添加title icon
            var modalHeaderInfoIcon = '<i class="glyphicon ' + fontIcon + ' dialog-title-icon ' + statusStyle + '"></i>';
            var isHeaderInfoIcon = options.isIcon;
            if(isHeaderInfoIcon != false){
                titleDom.append(modalHeaderInfoIcon);
            }
            //添加title content
            var title = options.title || "标题";
            titleDom.append(title);
            //添加body content
            var content = options.content || "内容";
            dialogDom.find('#' + dialogBodyId).append(content);
            //如果没有默认 给确认关闭
            var defaultButtons = [{
                'name': '确认',
                'callback': function () {

                }
            }];

            //var buttons = options.buttons || defaultButtons;
            var buttons = options.buttons;
            pattern = pattern == "sm" ? "atfm-btn-sm" : "";
            if(buttons != undefined && (typeof buttons) == 'object'){
                for (var i = 0; i < buttons.length; i++) {
                    appendBtn(buttons[i]);

                }
                function appendBtn(button) {
                    //是否点击后关闭弹框
                    var isHidden = button.isHidden;
                    if (isHidden != false) {
                        isHidden = true;
                    }
                    var btnClassName = button.className ? button.className : "";
                    //有status属性  1:正常 2:警告 3:危险  -1:灰色  其余:默认全局样式
                    if(button.status != undefined && button.status != ""){

                        var status = button.status || 0;

                        switch (status) {
                            case -1 :{
                                btnClass = "atfm-btn-default";
                                break;
                            }
                            case 1 :
                            {
                                btnClass = "atfm-btn-green";
                                break;
                            }
                            case 2:
                            {
                                btnClass = "atfm-btn-yellow";
                                break;
                            }
                            case 3:
                            {
                                btnClass = "atfm-btn-red";
                                break;
                            }
                            default: {
                                btnClass = "";
                            }
                        }


                    }

                    var className=  'atfm-btn ' + pattern + ' ' + btnClass + ' ' + btnClassName +' ladda-button';

                    dialogFooter.append($('<button>', {
                            'html':'<span class="ladda-label">'+ button.name+'</span>',
                            'class': className,
                            'data-style': "zoom-out",
                            'click': function (func) {
                                var _this = this;
                                var dialogCloseCallback = typeof button.callback === 'function' ? button.callback : function () {
                                };
                                //点击后关闭弹框
                                if (isHidden) {
                                    dialogDom.modal('hide');
                                    dialogDom.on('hidden.bs.modal', function () {
                                        dialogCloseCallback.call(_this);
                                        dialogDom.off('hidden.bs.modal');
                                    })
                                } else {
                                    dialogCloseCallback.call(_this);
                                }
                            }
                        })
                    );
                }
            };
            var cancelBtn = options.showCancelBtn;
            if (cancelBtn != false) {
                dialogFooter.append($('<button>', {
                        'html': "取消",
                        'class': 'atfm-btn atfm-btn-default ' + pattern,
                        'click': function () {
                            dialogDom.modal('hide');
                        }
                    })
                );
            }
            var effectDom = $(".modal-dialog");
            if("sm" == pattern){
                effectDom = $(".modal-dialog.modal-sm")
            }
            /*自定义宽度*/
            if (options.width * 1 > 0) {
                effectDom.css('width', options.width * 1 + 'px');
            }
            /*自定义顶部偏移量*/
            if (options.mtop * 1 > 0) {
                effectDom.css('margin-top', options.mtop * 1 + 'px');
            }

            dialogDom.modal('show');
        }

    }

}();