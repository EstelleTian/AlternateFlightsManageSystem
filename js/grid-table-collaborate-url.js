/**
 * 表格列操作url
 */

var CellOpreationUrl = {

    // 预选备降(进港、飞越)
    PRE_ALTERNATE : ipHost+'airport/preSelectAlternateSpecial',
    // 确认备降(进港、飞越)
    CONFIRM_ALTERNATE : ipHost+'airport/confirmAlternateSpecial',
    // 正班占用
    OCCUPIED : ipHost+'airport/positiveOccupy',
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
    WEATHER_MODEL : ipHost+'airport/changeWeatherModel'
}