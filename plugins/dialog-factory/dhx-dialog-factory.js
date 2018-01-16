/**
 * Created by Zhaochen on 2016/3/28.
 */


var DhxDialogFactory = {

    /**
     * 窗口工厂（DHX Window特性）
     */
    dhxWinsFactory: null,

    /**
     * 初始化
     */
    init: function () {
        this.dhxWinsFactory = new dhtmlXWindows();
        // 默认使用body作为Viewport
        this.dhxWinsFactory.attachViewportTo(document.body);
    },

    /**
     *
     */
    open: function (title, url, params) {
        if ($.isValidVariable(this.dhxWinsFactory.window(params['id']))) {
            return;
        }
        var w1 = this.dhxWinsFactory.createWindow(params);
        w1.setText(title);
        w1.progressOn();
        w1.attachEvent("onContentLoaded", function (win) {
            win.progressOff();
        });
        w1.attachURL(url);
        w1.addUserButton("open", 4, "Open in new tab");
        w1.button("open").attachEvent("onClick", function (win) {
            win.close();
            window.open(url);
        });
        w1.adjustPosition();
        if ($.isValidVariable(params['buttons'])) {
            var buttons = params['buttons'];
            if (buttons['help'] === false) {
                w1.button('help').hide();
            }
            if (buttons['stick'] === false) {
                w1.button('stick').hide();
            }
            if (buttons['park'] === false) {
                w1.button('park').hide();
            }
            if (buttons['minmax'] === false) {
                w1.button('minmax').hide();
            }
            if (buttons['open'] === false) {
                w1.button('open').hide();
            }
            if (buttons['close'] === false) {
                w1.button('close').hide();
            }
        }
        return w1;
    },

    /**
     * 使用dhxWinsFactory关闭指定ID的窗口
     */
    close: function (winId) {
        var win = this.dhxWinsFactory.window(winId);
        win.close();
        win = null;
    }
};

/**
 *
 */
$(function () {
    DhxDialogFactory.init();
});