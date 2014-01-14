define(function(require,exports,module){
	module.exports.onEnter=function(){

	}
	module.exports.goData=function(){
		_loadApp("sales","data")
	}
	module.exports.goGuidence=function(){
		_loadApp("sales","guidence")
	}
	module.exports.goCheckpoint=function(){
		_loadApp("sales","checkpoint")
	}
})