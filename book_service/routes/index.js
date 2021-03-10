var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');
var movie = require('../models/movie');
var user = require('../models/user');
var recommend = require('../models/recommend');
var article = require('../models/article');

router.get('/',function(req,res,next){
    console.log('index');
    res.render('index',{title:'Express'});
});

//获取主页电影推荐
router.get('/showIndex', function (req, res, next) {
        recommend.findAll(function(err, allRecommends) {
            if(err)
            {
                res.json({status:1,message:'获取推荐失败'})
            }
            else
            {
                res.json({status: 0, message: '获取推荐成功', data:allRecommends})
            }
        })
});

//排行榜
router.get('/showRanking',function(req,res,next){

    movie.findMainPage({movieMainPage:true},function(err,rankingMovies){
        res.json({status:0,message:'获取排行榜',data:rankingMovies});
    });
})

//显示文章列表
router.get('/showArticle',function(req,res,next){
    article.findAll(function(err,getArticles){
        res.json({status:0,message:'获取主页',data:getArticles});
    })
})

// 文章详情
router.post('/articleDetail',function(req,res,next){

    if(!req.body.article_id)
    {
        res.json({status:1,message:'文章ID错误'});
        return;
    }
    article.findByArticleId(req.body.article_id,function(err,getArticle){
        res.json({status:0,message:'获取成功',data:getArticle});
        return;

    })

})

module.exports = router;
