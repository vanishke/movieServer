var mongoose = require('../common/db');

var article = new mongoose.Schema({
    articleTitle:String,
    articleContext:String,
    articleTime:String
})

article.statics.findAll = function(callback)
{
    this.find({},callback);
}

article.statics.findByArticleId = function(id,callback)
{
    this.find({_id:id},callback);
}

var articleModel = mongoose.model('article',article);

module.exports = articleModel;
