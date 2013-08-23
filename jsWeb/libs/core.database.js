//Database interface
var dbConfig;
var globalDB;//=window.openDatabase(dbConfig.dbName,dbConfig.version,dbConfig.descriptionName,dbConfig.size);

function DBClient(dbConfig)
{
    var name;
    var version;
    var descriptionName;
    var size;
    
    if(arguments.length==4)
    {
        name=arguments[0];
        version=arguments[1];
        descriptionName=arguments[2];
        size=arguments[3];
    }else
    {
        name=dbConfig.dbName;
        version=dbConfig.version;
        descriptionName=dbConfig.descriptionName;
        size=dbConfig.size;
    }
    if(!globalDB)
    {
        
        globalDB=window.openDatabase(dbConfig.dbName,dbConfig.version,dbConfig.descriptionName,dbConfig.size);
    }
    this.db=globalDB;
    this.create=function(sql,errorCB,successCB)
    {
        
        var sqls=new Array();
        
        if(typeof(sql)=='string')
        {
            sqls.push(sql);
        }else
        {
            sqls=sql;
        }
        
        successCB=(typeof(successCB)=='undefined')?function(){}:successCB;
        errorCB=(typeof(errorCB)=='undefeined')?function(error){console.log("error of db.create:"+error)}:errorCB;
        
        this.db.transaction
        (function(tx)
         {
            for(i in sqls)
            {
                tx.executeSql(sqls[i]);
            }
         },
         errorCB,
         successCB
        );
    }
    this.drop=function(tableName,errorCB,successCB)
    {
        var sql="DROP TABLE IF EXISTS "+tableName;
        successCB=(typeof(successCB)=='undefined')?function(){}:successCB;
        errorCB=(typeof(errorCB)=='undefeined')?function(error){console.log("error of db.update:"+error)}:errorCB;
        
        this.db.transaction
        (function(tx)
         {
         tx.executeSql(sql)
         },
         errorCB,
         successCB
         );

    }
    this.update=function(sql,errorCB,successCB)
    {
        
        var sqls=new Array();
        
        if(typeof(sql)=='string')
        {
            sqls.push(sql);
        }else
        {
            sqls=sql;
        }
        
        
        errorCB=(typeof(errorCB)=='undefeined')?function(error){console.log("error of db.create:"+error)}:errorCB;
        successCB=(typeof(successCB)=='undefined')?function(){}:successCB;
        
        this.db.transaction
        (function(tx)
         {
         for(i in sqls)
         {
         tx.executeSql(sqls[i]);
         }
         },
         errorCB,
         successCB
         );
    }
    this.select=function(sql,querySuccess,errorCB){
        errorCB=(typeof(errorCB)=='undefined')?function(error){console.log(error);console.log(sql)}:errorCB;
        this.db.transaction
        (
         function(tx)
         {
         tx.executeSql(sql,[],querySuccess,errorCB);
         },errorCB
        );
    }
    this.hasResult=function(sql,onYes,onNo)
    {
        this.select(sql,function(tx,rs)
            {
                if(rs.rows.length==0)
                {
                    onNo();
                }else
                {
                    onYes(rs);
                }
            });
    }
}
function SqlBuilder(sqlStr,dataBind)
{
    var builder=new core.utils.StrBuilder(sqlStr,dataBind);
    return builder.buildString();
}

