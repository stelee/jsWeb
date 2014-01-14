Namespace.register("core.file");

core.file.removeFile=function(filePath)
{
	console.log(filePath);
	if(navigator.appVersion.indexOf("iPad")>=0)
	{
		return;
	}
	window.resolveLocalFileSystemURI(filePath,function(fileEntry){
		fileEntry.remove(function(){console.log("file deleted")},function(error){console.log("error on delete file "+error)});
	},function(error){console.log(error)});
}