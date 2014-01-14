//navigator bar includes two functions:
// set up the navigator
// show the navigator
var Navigator=function(){
	this.items=new Array();
	this.selectedIndex=-1;
}
Navigator.prototype.addItem=function(id,name,url){
	this.items.push({
		id:id,
		name:name,
		url:url
	})
}

Navigator.prototype.setItems=function(items){
	this.items=items;
}

Navigator.prototype.removeItem=function(id){
	var tmpItems=new Array();
	for(var i in this.items){
		if(this.items[i].id!=id){
			tmpItems.push(this.items[i]);
		}
	}
	this.items=tmpItems;
}

Navigator.prototype.appendTo=function($target,selectedIndex){
	if("undefined"!=typeof(selectedIndex)){
		this.selectedIndex=selectedIndex;
	}else{
		this.selectedIndex=$target.attr("self-menuIndex");
	}
	var navBarHTML='<div data-role="footer" \
  	data-position="fixed" id="footer" \
  	data-tap-toggle="false" \
  	class="ui-footer-fixed slideup ui-footer ui-bar-a" \
  	role="contentinfo"></div>';
  	$("#footer").remove();
  	$.mobile.activePage.append(navBarHTML);
  	//$("#footer").fixedtoolbar();
  	//$("#footer").fixedtoolbar("updatePagePadding");
  	var footerStr="<div data-role='navbar' data-iconpos='top' class='navbar' data-grid='d'>" + "<ul>";
  	var widthStr=" style='width:"+(100/this.items.length)+"%' ";
  	for(var i=0;i<this.items.length;i++)
	  {
	      var item=this.items[i];
	      var selectedStr="";
	      if(this.selectedIndex==i){
	          selectedStr="class='ui-btn-active ui-state-persist'";
	      }
	      footerStr=footerStr+"<li"+widthStr+"><a href='"+core.utils.getAbsolutePath(item.url)+"' id='"+item.id+"' data-icon='custom' "+selectedStr+">"+item.name+"</a></li>"
	  }
	  footerStr=footerStr+"</ul>"+"</div>";
	  $("#footer").html(footerStr).trigger("create");

}	


module.exports.Navigator=Navigator;

