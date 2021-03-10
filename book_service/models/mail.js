var mongoose = require('../common/db');
var mail = new mongoose.Schema({
    fromUser:String,
    toUser:String,
    title:String,
    context:String

});

mail.statics.findByToUserId = function(user_id,callback)
{
    this.find({toUser:user_id},callback);
}

mail.statics.findByFromUserId = function(user_id,callback)
{
    this.find({fromUser:user_id},callback);
}

var mailModel = mongoose.model('mail',mail);

module.exports = mailModel;
