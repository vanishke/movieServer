// 引入数据库相关文件和代码包
var mongoose = require('../common/db');
// recommend 数据库数据集
var recommend = new mongoose.Schema({
    recommendImg:String,
    recommendSrc:String,
    recommendTitle:String
})

recommend.statics.findByIndexId = function(m_id,callback)
{
    this.find({findByIndexId:m_id},callback);
}
recommend.statics.findAll = function(callback)
{
    this.find({},callback);
}

var recommendModel = mongoose.model('recommend',recommend);

module.exports = recommendModel;
