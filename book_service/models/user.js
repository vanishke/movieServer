var mongoose = require('../common/db');

var user = new mongoose.Schema({
    username:String,
    password:String,
    userMail:String,
    userPhone:String,
    userAdmin:Boolean,
    userPower:Number,
    userStop:Boolean
});
//用户全量查找
user.statics.findAll = function(callback)
{
    this.find({},callback);
}
// 根据用户名匹配用户信息
user.statics.findByUsername = function(name,callback)
{
    this.find({username:name},callback);
}

//登陆匹配是否拥有相同的用户名和密码并且没有处于封停状态
user.statics.findUserLogin = function(name,password,userStop,callback)
{
    this.find({username:name,password:password,userStop:false}, callback);
}

//验证用户的邮箱和电话
user.statics.findUserPassword = function(name,mail,phone,callback)
{
    this.find({username:name,userMail:mail,userPhone:phone},callback)
}

var userModule = mongoose.model('user',user);
module.exports = userModule;









