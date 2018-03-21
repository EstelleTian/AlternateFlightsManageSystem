var ModuleLoader = function(){
    /**
     * 获取URL传来的参数
     */
    function getRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    /**
     * 
     * @param {加载链接对象} obj 
     */
    function Loadlink(obj){
        var body = document.getElementsByTagName('body')[0];
        var head = document.getElementsByTagName('head')[0];
        //遍历url传来的参数
        var fileName = JSON.parse(obj['param'])['moduleName'] ;
        for(var x in urlsObj){
            if(fileName == x){
                var srcs = urlsObj[x].script;
                for(var i=0;i<srcs.length;i++){
                    //创建标签
                    var script = document.createElement("script");
                    script.src = srcs[i];
                    body.appendChild(script);
                }
                var links = urlsObj[x].link;
                for(var j=0;j<links.length;j++){
                    //创建标签
                    var link = document.createElement("link")
                    link.rel = 'stylesheet'
                    link.href = links[j]
                    head.appendChild(link);
                }
            }
        }

    }
    //获取参数
    var urlParam = getRequest();
    return{
        init:function(){
            Loadlink(urlParam);
        },
        data:JSON.parse(urlParam.param)['data']
    }
}();
window.onload = function(){
    ModuleLoader.init()
}