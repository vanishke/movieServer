var mongoose = require('../common/db');
var movie = mongoose.Schema({
    movieName:String,
    movieImg:String,
    movieVideo:String,
    movieDownload:String,
    movieTime:String,
    movieNumSuppose:Number,
    movieNumDownload:Number,
    movieMainPage:Boolean
})

movie.statics.findAll = function(callback)
{
    this.find({},callback);
}

movie.statics.findByMovieId = function(movie_id,callback)
{
    this.find({_id:movie_id},callback);
}

movie.statics.findMainPage = function(movieMainPage,callback)
{
    this.find({movieMainPage:true},callback);
}
var movieModel = mongoose.model('movie',movie);

module.exports = movieModel;
