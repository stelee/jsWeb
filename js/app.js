Namespace.register("app");
app.items=[
	{
		id:"main",
		url:"index.html",
		name:"Main"
	},
	{
		id:"quickstart",
		url:"application/tutorial/index.html",
		name:"Quick Start"
	},
	{
		id:"profile",
		url:"application/profile/index.html",
		name:"About Me"
	}

]

//@Override
var afterOnEnter=function(e){
	var Navigator=require("js/plugins/navigatorBar")
	var nav=new Navigator.Navigator();
	nav.setItems(app.items);
	nav.appendTo($.mobile.activePage);
}