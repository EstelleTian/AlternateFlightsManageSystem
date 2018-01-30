/**
 * 表格列操作url
 */

var CellOpreationUrl = {
    // 进港

    // 预选备降/更改预选
    PRE_ALTERNATE : 'http://192.168.243.104:8085/altf/airport/preSelectAlternate',
    // 确认备降/更改备降
    CONFIRM_ALTERNATE : 'http://192.168.243.104:8085/altf/airport/confirmAlternate',
    // 正班占用
    OCCUPIED : 'http://192.168.243.104:8085/altf/airport/positiveOccupy',
    // 释放停机位
    RELEASE_POSTION : 'http://192.168.243.104:8085/altf/airport/releasePosition',
    // 取消备降
    CANCEL_ALTERNATE : 'http://192.168.243.104:8085/altf/airport/cancleAlternate',
    // 备降计划列表的确认备降
    CHANGETOCONFIRM_ALTERNATE : 'http://192.168.243.104:8085/altf/airport/changeToConfirm',

};

var DataUrl = {
    // 进港
    ARR : 'http://192.168.243.104:8085/altf/airport/retrieveArrFlights',
    // 备降
    ALTERNATE : 'http://192.168.243.104:8085/altf/airport/retrieveAlternateFlights',
    // 备降历史
    ALTERNATE_HISTORY : 'http://192.168.243.104:8085/altf/airport/retrieveAlternateHistory',
    // 疆内飞越
    OVER : 'http://192.168.243.104:8085/altf/airport/retrieveOverFlights',
    // 出港
    DEP : 'http://192.168.243.104:8085/altf/airport/retrieveDepFlights',
    // 复杂天气模式
    WEATHER_MODEL : 'http://192.168.243.104:8085/altf/airport/changeWeatherModel'
}