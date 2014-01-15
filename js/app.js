Namespace.register("app");
app.items=[
	{
		id:"menu_1",
		url:"applications/sample/index.html",
		name:"Menu 1"
	},
	{
		id:"menu_2",
		url:"#",
		name:"Menu 2"
	},
	{
		id:"menu_3",
		url:"a#",
		name:"Menu 3"
	},
	{
		id:"menu_4",
		url:"#",
		name:"Menu 4"
	}
]

//@Override
var afterOnEnter=function(e){

	if($.mobile.activePage.attr("self-noMenu")!="true")
	{
		var Navigator=require("js/plugins/navigatorBar")
		var nav=new Navigator.Navigator();
		nav.setItems(app.items);
		nav.appendTo($.mobile.activePage);

		//var height=$(window).height()+$.mobile.activePage.children("[data-role=footer]").height()+$.mobile.activePage.children("[data-role=header]").height();
                var height=$(document).height();
		$.mobile.activePage.children("[data-role=content]").css({
			overflow:"scroll",
			height:height+"px"
		});
	}

	
	//bind the function
	$("[self-callback]")
	.unbind('click')
	.on("click",function(e){
		var func=$(e.target).attr("self-callback");
		if('function'==typeof($.mobile.activePage.controller[func])){
			$.mobile.activePage.controller[func](e);
		}else{
			alert("function "+func+" is not defined");
		}
	});

}
