(function(){
	var setMeta=function(name,content)
	{
	    document.write("<meta name='"+name+"' content='"+content+"'>");
	}
	var linkCSS=function(link)
	{
	    document.write("<link rel='stylesheet' href='"+link+"'/>");
	}
	var includeJS=function()
	{
	    for(var i=0;i<arguments.length;i++){
	    	var src=arguments[i];
	    	document.write("<script charset='UTF-8' src='"+src+"'></script>");
	    } 
	}
	setMeta("viewport","width=device-width,initial-scale=1,user-scalable=no");
	setMeta("apple-mobile-web-app-capable","yes");
	linkCSS("jsWeb/jquery/jquery.mobile-1.3.1.min.css");
	includeJS("jsWeb/jquery/jquery.js",
		"cordova-current.js",
		"jsWeb/libs/core.namespace.js",
		"jsWeb/libs/core.session.js",
		"jsWeb/framework.js",
		"jsWeb/jquery/jquery.mobile-1.3.1.min.js",
		"jsWeb/libs/core.utils.js",
		"jsWeb/libs/core.database.js",
		"jsWeb/libs/core.file.js",
		"jsWeb/libs/core.sequence.js",
		"jsWeb/libs/json2.js",
		"jsWeb/libs/base64.js",
		"jsWeb/libs/base.data.js",
		"jsWeb/libs/core.webnpm.js",
		"js/app.js"
		);
})();

