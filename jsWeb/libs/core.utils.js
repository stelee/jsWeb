Namespace.register("core.utils");
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    };
    
	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;
        
		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}
        
		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");
        
		mask = String(dF.masks[mask] || mask || dF.masks["default"]);
        
		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}
        
		var	_ = utc ? "getUTC" : "get",
        d = date[_ + "Date"](),
        D = date[_ + "Day"](),
        m = date[_ + "Month"](),
        y = date[_ + "FullYear"](),
        H = date[_ + "Hours"](),
        M = date[_ + "Minutes"](),
        s = date[_ + "Seconds"](),
        L = date[_ + "Milliseconds"](),
        o = utc ? 0 : date.getTimezoneOffset(),
        flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };
        
		return mask.replace(token, function ($0) {
                            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                            });
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
shortDate:      "m/d/yy",
mediumDate:     "mmm d, yyyy",
longDate:       "mmmm d, yyyy",
fullDate:       "dddd, mmmm d, yyyy",
shortTime:      "h:MM TT",
mediumTime:     "h:MM:ss TT",
longTime:       "h:MM:ss TT Z",
isoDate:        "yyyy-mm-dd",
isoTime:        "HH:MM:ss",
isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
dayNames: [
           "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
           "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
           ],
monthNames: [
             "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
             "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
             ]
};
var getTableNameFromSQL=function(sql)
{
    var result=sql.match(/CREATE\sTABLE\s\S+\s/);
    if(result.length==0)
        return "";
    else
    {
        return $.trim(result[0].substring(13));
    
    }
    
}
//class strBuilder begin
core.utils.StrBuilder=function(str,dataBind){
    this.result=str;
    this.dataBind=new Array();
    if(typeof(dataBind)!='undefined')
    {
        this.dataBind=dataBind;
    }
}
core.utils.getSunday=function(date)
{
    var theDay=date;
    var timeDiff=theDay.getDay()*24*60*60*1000+theDay.getHours()*60*60*1000+theDay.getMinutes()*60*1000+theDay.getSeconds()*1000+theDay.getMilliseconds();
    return (new Date(theDay.getTime()-timeDiff));
}
core.utils.StrBuilder.prototype.bind=function(key,value)
{
    this.dataBind[key]=value;
}

core.utils.StrBuilder.prototype.buildString=function()
{
    var result=this.result;
    if(typeof(this.dataBind)!='undefined')
    {
        for(prop in this.dataBind){
            var reg=new RegExp("\{"+prop+"\}","g");
            result=result.replace(reg,this.dataBind[prop]);
        }
    }
    return result;
}
//class strBuilder end

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
Date.prototype.get_unixtimestamp = function(){

    //var localOffset=(new Date()).getTimezoneOffset()*60000; 
    return Math.round((this.getTime())/1000);
}
Date.prototype.getSunday=function()
{
    return core.utils.getSunday(this);
}
Date.prototype.dayAgo=function(day)
{
    var currentTime=this.getTime();
    var timeDiff=day*24*60*60*1000;
    return (new Date(currentTime-timeDiff));
}
Date.prototype.dayAfter=function(day)
{
    var currentTime=this.getTime();
    var timeDiff=day*24*60*60*1000;
    return (new Date(currentTime+timeDiff));
}
var convertFromUnixTimestamp=function(seconds)
{
    try{
        return getDateByUnixTimestamp(seconds).format("yyyy-mm-dd HH:MM:ss");
    }catch(error)
    {
        console.error("not a valid unixtimestamp");
        return seconds;
    }
    
}
var getDateByUnixTimestamp=function(seconds)
{    
    if("string"==typeof(seconds)&&seconds.search(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/)>=0)
    {
        return (new Date(seconds));
    }else
    {
        seconds=parseInt(seconds);
        if(isNaN(seconds))
        {
            //try to convert the date directly
            return (new Date(seconds));
        }else{
            //var localOffset=(new Date()).getTimezoneOffset()*60000; 
            var millisecnds=seconds*1000;
            return (new Date(millisecnds));
        }
    }
}

String.prototype.bind=function(dataBind)
{
    if(arguments.length==1)
    {
        var builder=new core.utils.StrBuilder(this,dataBind);
        return builder.buildString();
    }else if(arguments.length==2)
    {
        var parameter=new Object();
        parameter[arguments[0]]=arguments[1];
        var builder=new core.utils.StrBuilder(this,parameter);
        return builder.buildString();
    }
        
}
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var transformObject=function(from,to)
{
    for(prop in to)
    {
        if(typeof(from[prop])=='undefined')
        {
            from[prop]=to[prop];
        }
    }
    return from;
}
core.utils.transformObject=transformObject;
core.utils.mixObject=transformObject;

var isNull=function(obj)
{
    if(typeof(obj)=='undefined')
    {
        return true;
    }
    if(obj==null)
    {
        return true;
    }
    return false;
}
var isEmpty=function(obj,emptyStr)
{
    if(isNull(emptyStr))
    {
        emptyStr="";
    }
    if(isNull(obj)){
        return true;
    }else if(obj==emptyStr)
    {
        return true;
    }else
    {
        return false;
    }
}
var nullSafe=function(str,defaultStr)
{
    var _defaultStr="";
    if(typeof(defaultStr)=="string")
    {
        _defaultStr=defaultStr;
    }
    if(isNull(str))
    {
        return _defaultStr;
    }else
    {
        return str;
    }
}
var sqlSafe=function(str)
{
   var ret=nullSafe(str);
   if(typeof(ret)=="string")
   {
        return nullSafe(str).replace(/\'/g,"''");
   }else
   {
        return ret;
   }
   
}
var getCurrentDateTime=function()
{
    return (new Date()).format("yyyy-mm-dd HH:MM:ss");
}
var getCurrentTimestamp=function()
{
    var currentTimeStamp=(new Date()).get_unixtimestamp();
    var lastsynctime=parseInt(lastSyncTime());
    if(isNaN(lastSyncTime()))
    {
        return currentTimeStamp;
    }
    if(currentTimeStamp<lastSyncTime())
    {
        currentTimeStamp=lastsynctime+Math.round(Math.random()*100);
    }
    return currentTimeStamp;
}
var getQuery=function(name) 
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
core.utils.dateConvert=function(datetimeStr)
{
    

    var re=/^(\d{4})-(\d{1,2})-(\d{1,2})/g;
    var monthNames=[ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if(monthNames.indexOf(datetimeStr.substring(0,3))>0)
    {
        var tmpDatetimeArray=datetimeStr.split(" ");
        return tmpDatetimeArray[0]+"_"+tmpDatetimeArray[2];
    }

    if(re.test(datetimeStr))
    {
        var year=RegExp.$1;
        var month=RegExp.$2;
        if(month==""||year=="")
            return "";
        month=Number(month);
        return "{month}_{year}".bind(
            {
                month:monthNames[month-1],
                year:year
            });
    }else
    {
        return "";
    }
}
core.utils.isEmpty=function(origStr,emptyStandard,result)
{
    emptyStandard=emptyStandard? emptyStandard:"";
    result=result? result:"";
    if(isNull(origStr))
    {
        return result;
    }else if(origStr==emptyStandard)
    {
        return result;
    }else
    {
        return origStr;
    }

}
core.utils.getAbsolutePath=function(path)
{
    return context.root+path;
}
core.utils.sqlFormat=function(value)
{
    if(isNull(value))
    {
        return "null";
    }
    else if("number" == typeof value){
        return value;
    }else
    {
        return "'"+value.replace(/\'/g,"''")+"'"
    }
}
var findInArray=function(array,eq){
    var fnEqual;
    if(typeof(eq)=='function')
        fnEqual=eq;
    else
    {
        fnEqual=function(element)
        {
            if(element==eq)
                return true;
            else
                return false;
        }
    }
    var ret=new Array();
    for(var i=0;i<array.length;i++)
    {
        if(fnEqual(array[i]))
        {
            return true;
        }
    }
    return false;
}
var removeFromArray=function(array,eq)
{
    var fnEqual;
    if(typeof(eq)=='function')
        fnEqual=eq;
    else
    {
        fnEqual=function(element)
        {
            if(element==eq)
                return true;
            else
                return false;
        }
    }
    var ret=new Array();
    for(var i=0;i<array.length;i++)
    {
        if(!fnEqual(array[i]))
        {
            ret.push(array[i]);
        }
    }
    return ret;
}


core.utils.mix=function(origClass,mixer){
    for(prop in mixer)
    {
        origClass.prototype[prop]=mixer[prop];
    }
}
var _MIX=core.utils.mix;
Namespace.register("core.utils.mixers");
core.utils.mixers.callbackable={
    on:function(eventname,callback)
    {
        if(isNull(this.events))
        {
            this.events=new Object();
        }
        if(arguments.length==1)
        {
            this.events["_lastbindedfunction"]=arguments[0];
        }else{
            this.events[eventname]=callback;
        }
        
        return this;
    },
    unbind:function(eventname)
    {
        delete this.events[eventname];
    },
    error:function(error)
    {
        this._error=error;
        this.trigger("error");
    },
    trigger:function(eventname)
    {
        if(typeof this.events[eventname]=="function")
        {
            this.events[eventname].apply(this);
        }else
        {
            if(typeof this.events["_lastbindedfunction"]=="function")
            {
                this.events["_lastbindedfunction"].apply(this);
                this.events["_lastbindedfunction"]=null;
            }else
            {
                console.error("callback function for '"+eventname+"' isn't defined");
            }
            
        }
    }
}

core.utils.concat=function(source,target,overwrite)
{
    //concat the source to the target and return the target
    if("undefined"==typeof overwrite)
    {
        overwrite=false;
    }
    for(key in source)
    {
        var value=source[key];
        if(typeof(target[key])=="undefined")
        {
            target[key]=value;
        }else
        {
            if(overwrite)
            {
                target[key]=value;
            }
        }
    }
}

core.utils.extend=function(child,parent)
{
    var parentObject=new parent();
    child.prototype=parentObject;
    child.prototype.super=parent.prototype;
}
var _XND=core.utils.extend;
var _EXTEND=core.utils.extend;


var parseBoolean=function(val)
{
    if("boolean" == typeof val)
    {
        return val;
    }else
    {
        if(val=="true")
            return true;
        else
            return false;
    }
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
core.utils.iterateAndExecute=function(array,onEach,onFinish,currentIndex){
    currentIndex=currentIndex||0;
    if(currentIndex>=array.length)
    {
        
        onFinish();
        return;
    }
    onEach(array[currentIndex],function(){
        currentIndex++;
        core.utils.iterateAndExecute(array,onEach,onFinish,currentIndex);
    })
}
_EACH=core.utils.iterateAndExecute

core.utils.simpleMatch=function(val,caseObject){
    var ret=caseObject[val];
    if('undefined'==typeof ret){
        ret=caseObject["_"];
    }
    return ret;
}
var simpleMatch=core.utils.simpleMatch;

core.utils.loadApp=function(appName,pageName){
    if(isNull(pageName))
    {
        pageName="index";
    }

    $.mobile.changePage(
        core.utils.getAbsolutePath("/applications/{appName}/{pageName}.html".bind(
        {
            appName:appName,
            pageName:pageName
        })
        )
    );
}


Namespace.register("core.utils.fn");

// console.nativeLog=console.log;
// console.log=function(msg){
//     if("undefined"==typeof(msg)||msg==null){
//         console.nativeLog("null or undefined msg");
//     }else
//     {
//         console.nativeLog(msg);
//     }
// }

core.utils.fn.changePage=function(path)
{
    $.mobile.changePage(core.utils.getAbsolutePath(path))
}
core.utils.fn.loadPage=function(appName,pageName)
{
    if(isNull(pageName))
    {
        pageName="index";
    }
    $.mobile.changePage(core.utils.getAbsolutePath("/applications/{appName}/{pageName}.html".bind(
    {
        appName:appName,
        pageName:pageName
    }
    )))
}

core.utils.fn.getVar=function(idName){
    return $("#"+idName).val();
}

_CHG=core.utils.fn.changePage;
_loadApp=core.utils.fn.loadPage;
_getVar=core.utils.fn.getVar;

// function(fn,context){
//     if(typeof fn=="function")
//     {
//         fn.apply(context);
//     }else
//     {
//         console.error("callback function for '"+fn+"' isn't defined");
//     }
// }
