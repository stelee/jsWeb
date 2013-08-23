Namespace.register("entity");

entity.Base=function(tableName){
	this.tableName=tableName;
	this.events={
		error:function(){console.log(this._error)}
	}
}
_MIX(entity.Base,core.utils.mixers.callbackable);
/*
This means you can use events:{} or "on" function to bind the callback to the entity
use trigger to trigger the function;
*/
entity.Base.prototype.executeSql=function(sql,eventName)
{
	var that=this;
	var db=new DBClient()
	db.update(sql,function(error){
		that._error=error;
		that.trigger("error");
	},function(){
		that.trigger(eventName);
	});
}

entity.Base.prototype.findFirstBySql=function(sql,eventName)
{
	var that=this;
	core.entity.EntityList.find(sql,function(list)
	{
		if(list.length>0)
		{
			that.entity=list[0];
			that.trigger(eventName);
		}else
		{
			that.trigger("!"+eventName);
		}
		
	});
	return this;
}

entity.Base.prototype.findBySql=function(sql,eventName)
{
	var that=this;
	core.entity.EntityList.find(sql,function(list)
	{
		that.entities=list;//TODO:that.entity not entities
		that.trigger(eventName);
	});
	return this;
}

entity.Base.prototype.listBySql=function(sql,eventName)
{
	var that=this;
	core.entity.EntityList.find(sql,function(list)
	{
		that.entities=list;
		that.trigger(eventName);
	});
	return this;
}

entity.Base.prototype.find=function(searchStr,onFind)
{
	var sql="select * from {tableName} where 1=1".bind("tableName",this.tableName);
	var that=this;
	if(searchStr)
	{
		sql+=" and "+searchStr;
	}
	core.entity.EntityList.find(sql,function(list)
	{
		if(list.length==0)
		{
			that.entity=null;
			that.trigger("!find");

		}else{
			that.entity=list[0];
			if(!onFind)
				that.trigger("find");
			else
				onFind.apply(this);
		}
	});
	return this;
}
entity.Base.prototype.list=function(searchStr,orderby)
{
	var sql="select * from {tableName} where 1=1".bind("tableName",this.tableName);
	var that=this;
	if(searchStr)
	{
		sql+=" and "+searchStr;
	}
	if(orderby)
	{
		sql+=" order by "+orderby;
	}
	core.entity.EntityList.find(sql,function(list)
	{
		that.entities=list;
		that.trigger("list")
	});
	return this;
}
entity.Base.prototype.createUpdate=function(dataMap,whereStr,dbFlag)
{
	if(isNull(dbFlag))
	{
		dbFlag=true;
	}
	var that=this;
	var sqls=[];
	sqls.push("delete from "+this.tableName+" where "+whereStr);
	sqls.push(that.create(dataMap,false));
	if(dbFlag==false)
	{
		return sqls;
	}else
	{
		var db=new DBClient();
		db.update(sqls,function(error){
			that._error=error;
			that.trigger("error");
		},function(){
			that.trigger("createupdate");
		});
	}
}
entity.Base.prototype.create=function()
{
	var that=this;

	var insertFlag=true;

	if(!that.entity)
	{
		that.entity={};
	}

	if(arguments.length==1)
	{
		if("boolean"==typeof arguments[0]){
			insertFlag=arguments[0]
		}else if("object"==typeof arguments[0])
		{
			core.utils.concat(arguments[0],that.entity,true);
		}
	}else if(arguments.length==2)
	{
		core.utils.concat(arguments[0],that.entity,true);
		insertFlag=arguments[1];
	}


	var fields=new Array();
	var values=new Array();

	dataMap=that.entity;

	if(!dataMap["ddlFlag"])
	{
		dataMap["ddlFlag"]="I";//insert
	}
	
	dataMap["ddlDate"]=getCurrentTimestamp();

	for(prop in dataMap)
	{
		fields.push("'"+prop+"'");
		console.log("prop is "+prop);
		values.push(core.utils.sqlFormat(dataMap[prop]));
	}

	var sql="INSERT INTO '{tableName}' ({fields})VALUES({values})".bind(
		{
			tableName:this.tableName,
			fields:fields.join(","),
			values:values.join(",")
		});
	if(!insertFlag)
	{
		return sql;
	}else
	{
		var db=new DBClient();
		db.update(sql,function(error){
			that._error=error;
			that.trigger("error");
		},function(){
			//that.trigger("create");
			that.find("ddlDate="+dataMap["ddlDate"],function(){
				that.trigger("create");
			})
		});
	}
}

entity.Base.prototype.update=function(dataMap,searchStr,autoDDLDate)
{
	var that=this;
	var updateArray=new Array();
	for(key in dataMap)
	{
		var value=dataMap[key];
		updateArray.push("'{key}'={value}".bind({
			key:key,
			value:core.utils.sqlFormat(value)
		}));
	}
	if(isNull(autoDDLDate))
	{
		autoDDLDate=true;
	}
	if(autoDDLDate==true){
		updateArray.push("ddlDate="+getCurrentTimestamp());
	}
	var sql="UPDATE {tableName} set {updateStr} where 1=1".bind({
		tableName:that.tableName,
		updateStr:updateArray.join(",")
	});

	if(searchStr)
	{
		sql+=" and "+searchStr;
	}
	var db=new DBClient();
	db.update(sql,function(error)
	{
		that._error=error;
		that.trigger("error");
		console.error("failed on execute sql:"+sql);
	},function(){
		if(isNull(that.entity))
		{
			that.entity=new Object();
		}
		core.utils.concat(dataMap,that.entity,true);
		that.trigger("update");
	})
}

entity.Base.prototype.delete=function(searchStr,dbFlag){
	var that=this;
	if(isNull(dbFlag))
	{
		dbFlag=true;
	}
	var that=this;
	var sql="delete from {tableName} where 1=1".bind("tableName",that.tableName);
	if(searchStr)
	{
		sql+=" and "+searchStr;
	}
	if(dbFlag==false)
	{
		return sql;
	}
	var db=new DBClient();
	db.update(sql,function(error){
		that._error=error;
		that.trigger("error");
	},function(){
		that.trigger("delete");
	})
}
entity.Base.prototype.saveRemoteEntities=function(idNames)
{
	var that=this;
	if("string"==typeof idNames)
	{
		idNames=[idNames];
	}
	for(i in that.remoteEntities)
	{
		var remoteEntity=that.remoteEntities[i];
		var tableName=remoteEntity.tableName;
		var fieldsList=remoteEntity.fields;
		var valuesList=remoteEntity.values;
		that.saveToDB(tableName,fieldsList,valuesList,idNames,function(){
			that.trigger("saveremoteentities");
		})
	}
}
entity.Base.prototype.saveToDB=function(tableName,fieldsList,valuesList,idNames,onSuccess,onFailed)
{
	if(!onFailed)
	{
		onFailed=function(error)
		{
			console.log(error);
		}
	}
	var fieldsSql=("'"+fieldsList.join("','")+"'")
    var db=new DBClient();
    var sqls=new Array();
        
    for(var i in valuesList)
    {
        var whereStr="1=1";
        var sep="";
        var valueSql="";
        for(var j in valuesList[i])
        {
            var value=valuesList[i][j];
            if(typeof(value)=="string")
            {
                value=value.replace(/\'/g,"''");
            }
            valueSql=valueSql+sep+"'"+value+"'";
            sep=",";
            if(idNames.indexOf(fieldsList[j])>=0)
            {
                whereStr=whereStr+" and {field}={value}".bind({
                    field:fieldsList[j],
                    value:"'"+value+"'"
                });
            }

        }
        var deleteSql="delete from {tableName} where {whereStr}".bind(
        {
            tableName:tableName.trim(),
            whereStr:whereStr
        })
        sqls.push(deleteSql);
        var sql="INSERT INTO '"+tableName.trim()+"' ("+fieldsSql+")VALUES("+valueSql+")";
        if(core.utils.getDDLFlag(sql)!="D"){
            sqls.push(sql);
        }
    }
    console.log(sqls);
    db.update(sqls,onFailed,onSuccess);
}