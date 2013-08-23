Namespace=new Object();
Namespace.register=function(NS)
{
	var currentObject=window;//the root
	var nsArray=NS.split(".");
	for(var i=0;i<nsArray.length;i++){
		if(typeof(currentObject[nsArray[i]])=='undefined'){
			currentObject[nsArray[i]]=new Object();
		}
		currentObject=currentObject[nsArray[i]];
	}
	return currentObject;
}