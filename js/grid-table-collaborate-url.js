/**
 * 表格列操作url
 */

var CellOpreationUrl = {

    // 预选备降(进港、飞越)
    PRE_ALTERNATE : ipHost+'airport/preelectAlternate',
    // 更改预选备降(进港、飞越)
    UPDATE_PRE_ALTERNATE : ipHost+'airport/changePreelectAlternate',
    // 确认备降(进港、飞越)（可选机场）
    CONFIRM_ALTERNATE : ipHost+'airport/confirmAlternate',
    // 更改确认备降(进港、飞越)（可选机场）
    UPDATE_CONFIRM_ALTERNATE : ipHost+'airport/changeConfirmAlternate',
    // 确认备降(进港、飞越)（不可选机场）
    ASCERTAIN_ALTERNATE : ipHost+'airport/ascertainAlternate',
    // 正班占用
    OCCUPIED : ipHost+'airport/positiveOccupancy',
    // 释放停机位
    RELEASE_POSTION : ipHost+'airport/releasePosition',
    // 取消备降
    CANCEL_ALTERNATE : ipHost+'airport/cancleAlternate',
    // 备降计划列表更改预选
    PRE_ALTERNATE_ALTERNATE : ipHost+'airport/preSelectAlternate',
    // 备降计划列表更改备降
    CONFIRM_ALTERNATE_ALTERNATE : ipHost+'airport/confirmAlternate',
    // 备降计划列表的确认备降
    CHANGETOCONFIRM_ALTERNATE : ipHost+'airport/changeToConfirm',
    // 出港预选备降
    PRE_ALTERNATE_DEP :ipHost+'airport/preSelectAlternateDep',
    // 出港确认备降
    CONFIRM_ALTERNATE_DEP :ipHost+'airport/confirmAlternateDep'

};

var DataUrl = {
    // 进港
    ARR : ipHost+'airport/retrieveArrFlights',
    // 备降
    ALTERNATE : ipHost+'airport/retrieveAlternateFlights',
    // 备降历史
    ALTERNATE_HISTORY : ipHost+'airport/retrieveAlternateHistory',
    // 疆内飞越
    OVER : ipHost+'airport/retrieveOverFlights',
    // 出港
    DEP : ipHost+'airport/retrieveDepFlights',
    // 复杂天气模式
    WEATHER_MODEL : ipHost+'airport/changeWeatherModel',
    // 获取机位数据
    POSTION_LIST : ipHost + 'airport/retrievePostionType',
    // 机位排序
    POSTION_ORDER : ipHost + 'airport/orderPostionType',
    // 机位添加
    POSTION_ADD : ipHost + 'airport/addPostionType',
    // 机位删除
    POSTION_DEL : ipHost + 'airport/deletePostionType',
    // 机位修改
    POSTION_UPDATE : ipHost + 'airport/updatePostionType'
}