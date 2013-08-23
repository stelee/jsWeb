Namespace.register("core.webnpm");

core.webnpm.config={
	pathProvider:function(path){
		return path;
	}
}

core.webnpm.define=function(fn){
  if("object"==typeof(fn)){
    return fn;
  }else if("function"==typeof(fn)){
    var module={
      exports:{}
    }
    fn(core.webnpm.require,module.exports,module);
    return module.exports;
  }
}
core.webnpm.require=function(path,pathProvider){
	if('undefined'==typeof(pathProvider)){
		pathProvider=core.webnpm.config.pathProvider
	}
	var path=pathProvider(path);
	var ret;
	$.ajax(path,{
		async:false,
		dataType:"html",
		scriptCharset:"UTF-8",
		success:function(data)
		{
			ret=data;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			ret=null;
		}
	})
	var jsBlock="";
	if(ret.indexOf("define(function")==0){
		jsBlock=ret;
	}else{
		jsBlock="core.webnpm.define(function(require,exports,module){"+ret+"})";
	}
	return eval(jsBlock);
}
define=core.webnpm.define;
require=core.webnpm.require;

core.webnpm.config.pathProvider=function(path)
{
	if(!path.endsWith(".js")){
		path=path+".js";
	}
	return core.utils.getAbsolutePath(path);
}