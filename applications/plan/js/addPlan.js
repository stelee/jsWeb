define(function(require,exports,module){
	module.exports.onEnter=function(){

	}
	module.exports.setPlanType=function(){
		$("button[self-callback=setPlanType]").removeAttr('data-theme');
		$(event.target).attr("data-theme","b");
		setTimeout(function(){
			$("button[self-callback=setPlanType]").buttonMarkup("refresh");
		},500);
		
	}
});