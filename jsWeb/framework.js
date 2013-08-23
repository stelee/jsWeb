Namespace.register("context");

context.application={
    id:"__NOTHING__"
};
context.root=null;


$(document).bind("mobileinit", function(){
                 $.mobile.defaultPageTransition="none";
                 $.support.cors=true;//jquery properties
                 $.mobile.allowCrossDomainPages=true;
                 $.mobile.popup.prototype.options.history=false;
                 $.mobile.fixedtoolbar.prototype.options.tapToggle=false
                 //$.mobile.fixedToolbars.touchToggleEnabled=false;

});
$(document).ready(
                  function(){
                    context.root=this.location.href;
                    if(context.root.indexOf("index.html")>0)
                    {
                        //__root=__root.replace(/\w+\.index.html/g,"");
                        var tmpArray=context.root.split("/");
                        context.root=tmpArray.slice(0,tmpArray.length-1).join("/")+"/";
                    }
                    document.addEventListener("deviceready",onDeviceReady,true);
                  }
                  );

$(document).bind('pageshow',function(e)
                 {
                    beforeOnEnter(e)
                    try
                    {
                        var currentApp=/applications\/\w+\//.exec($.mobile.activePage.data("url"));
                        if(currentApp==null){
                            currentApp="index";
                        };

                        if(currentApp!=context.application.id){
                            
                            context.application=new Object();
                            context.application.id=currentApp;
                        }
                        $.mobile.activePage.context=new Object();
                        var url=location.href;
                        var path=url.substr(0,url.lastIndexOf("/"));
                        var page=url.substr(url.lastIndexOf("/")+1);
                        var url=path+"/js/"+page.substr(0,page.lastIndexOf("."))+".js";

                        var controller=require(url,function(path){return path});
                        $.mobile.activePage.controller=controller;
                        if(controller.onEnter){
                            controller.onEnter();
                        }
                        debugger;
                       
                    }catch(exception)
                    {
                        //console.error(exception);
                    }
                    afterOnEnter(e);
                 });
$(document).bind('pageremove',function(e)
{
    try{
        var targetId=($(e.target).attr("id"));
        if(typeof(targetId)=='undefined')
        {
            return;
        }
        var fnName=targetId.replace(/-/g,"_")+"_onRemove";
        console.log(fnName);
        if(typeof(window[fnName])=='function')
        {
            window[fnName](e);
        }
        
    }catch(error)
    {
        //console.error(error);
    }
});

var onRemove=function()
{
    //do nothing;
}

var onDeviceReady=function(){
    document.addEventListener("resume", onResume, false);
    __Configuration.deviceName=device.name;
    __Configuration.deviceCordova=device.cordova;
    __Configuration.devicePlatform=device.platform;
    __Configuration.deviceUUID=device.uuid;
    __Configuration.deviceVersion=device.version;
    document.addEventListener("backbutton",function(){},false);
}
function onResume() {
   
    if(!window.location.href.endsWith("www/index.html"))
    {//not the index.html
        //core.sync.fn.sync(console.log);
    } 
}
var gapAlert=function(message)
{
    if(navigator.notification)
    {
        navigator.notification.alert(
                                 message,  // message
                                 function(){},         // callback
                                 'Alert',            // title
                                 'OK'                  // buttonName
                                 );
    }else{
        alert(message);
    }
    
}
var gapConfirm=function(message,onOK,onNo)
{
    if(isNull(onNo))
    {
        onNo=function(){};
    }
    if(navigator.notification)
    {
        navigator.notification.confirm(message, function(button){
            console.log(button);
            if(button==1)
            {
                onOK();
            }else{
                onNo();
            }
        }, "Confirm", "Yes,No")
    }else{
        if(confirm(message)==true)
        {
            onOK();
        }else{
            onNo();
        }
    }
}
var afterOnEnter=function(e)
{
   
}
var beforeOnEnter=function(e){
    
}
    