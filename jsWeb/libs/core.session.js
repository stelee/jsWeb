
Namespace.register("core");
Namespace.register("context");

//storage is the permanent storage

core.Storage=function(){
    this.storage=window.localStorage;
}
core.Storage.prototype.set = function(key,value) {
    this.storage.setItem(key,value);
}
core.Storage.prototype.get=function(key){
    return this.storage.getItem(key);
}
core.Storage.prototype.remove=function(key){
    var ret=this.storage.getItem(key);
    this.storage.removeItem(key);
    return ret;
}
core.Storage.prototype.clear=function(){
    this.storage.clear();
}
core.Storage.prototype.flash=function(msg)
{
    if(typeof(msg)=='undefined')
    {
        return this.remove("__flash__");
    }else
    {
        this.set("__flash__",msg);
    }
}

//session only happens during the application runtime

core.Session=function(){
    this.data=new Object();
}

core.Session.prototype.set = function(key,value) {
    this.data[key]=value;
};

core.Session.prototype.get = function(key) {
    return this.data[key];
};
core.Session.prototype.fetch = function(key) {
    var ret= this.data[key];
    delete this.data[key];
    return ret;
};

core.Session.prototype.getObject = function(key,constructor) {
    if("undefined"==typeof(this.data[key])){
        if(constructor){
            this.data[key]=new constructor();
        }else{
            this.data[key]=new Object();
        }
        
    }
    return this.data[key];
};
core.Session.prototype.setFromPage=function(id){
    var value=$("#"+id).val();
    var ret=true;
    if(isEmpty(value,"")){
        var ret=false;
    }
    this.data[id]=value;
    return ret;
}

//parameter is used to transfer the data between pages
core.Parameter=function(){
    this.data=new Object();
}
core.Parameter.prototype.set = function(key,value) {
    this.data[key]=value;
};

core.Parameter.prototype.get = function(key) {
    return this.data[key];
};
core.Parameter.prototype.fetch = function(key) {
    var ret= this.data[key];
    delete this.data[key];
    return ret;
};
core.Parameter.prototype.setById=function(id){
    var value=$("#"+id).val();
    var ret=true;
    if(isEmpty(value,"")){
        var ret=false;
    }
    this.data[id]=value;
    return ret;
}


context.storage=new core.Storage();
context.session=new core.Session();
context.parameter=new core.Parameter();




