Namespace.register("app");
app.items=[
	{
		id:"menu_plan",
		url:"applications/plan/index.html",
		name:"工作计划"
	},
	{
		id:"menu_sales",
		url:"applications/sales/index.html",
		name:"跟线辅导"
	},
	{
		id:"menu_customer",
		url:"applications/customer/index.html",
		name:"客户拜访"
	},
	{
		id:"menu_profile",
		url:"applications/profile/index.html",
		name:"业绩板"
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
