var mongoose = require('../common/db');

var comment = new mongoose.Schema({
    movie_id:String,
    username:String,
    context:String,
    check:Boolean
});
comment.statics.findAll = function(callback)
{
    this.find({},callback);
}

comment.statics.findByMovieId = function(m_id,callback)
{
    this.find({movie_id:m_id,check:true},callback);
}
var commentModule = mongoose.model('comment',comment);
module.exports = commentModule;









