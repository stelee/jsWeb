Namespace.register("core.sequence");
core.sequence.Sequence=function()
{
	this.funcList=new Array();
	this.datastore=new Object();
}

core.sequence.Sequence.prototype.val=function(key,value)
{
	if(typeof(value)=='undefined')
	{
		return this.datastore[key];
	}else
	{
		this.datastore[key]=value;
	}
}
core.sequence.Sequence.prototype.register=function(func)
{
	this.funcList.push(func);
	return this;
}
core.sequence.Sequence.prototype.execute=function(currentIndex)
{
	var _this=this;
	if(isNull(currentIndex))
	{
		currentIndex=0;
	}
	if(currentIndex>=this.funcList.length)
	{
		return;
	}

	this.funcList[currentIndex](function(msg){

		if(!isNull(msg))
		{
			console.log(msg);
		}

		currentIndex=currentIndex+1;
		_this.execute(currentIndex);
	},_this);
}