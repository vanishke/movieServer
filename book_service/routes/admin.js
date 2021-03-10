var express = require('express');
var user = require ( '../models/user');
var comment = require('../models/comment')
var mail = require('../models/mail')
var movie = require('../models/movie')
var article = require('../models/article')
var recommend = require('../models/recommend')
var crypto = require ('crypto');
var router = express.Router();
// 系统默认token
const init_token = 'TKL02o';
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//添加电影
router.post('/movieAdd',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }
    if(!req.body.id)
    {
        res.json({status:1,message:'用户传递错误'});
        return;
    }
    if(!req.body.movieName)
    {
        res.json({status:1,message:'电影名称为空'});
        return;
    }
    if(!req.body.movieImg)
    {
        res.json({status:1,message:'电影图片为空'});
        return;
    }
    if(!req.body.movieDownload)
    {
        res.json({status:1,message:'电影下载地址为空'});
        return;
    }

    if(!req.body.movieMainPage)
    {
        //新添加电影默认不推荐
        var movieMainPage = false;
    }
    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户位管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {

                var saveMovie = new movie({
                    movieName:req.body.movieName,
                    movieImg:req.body.movieImg,
                    movieVideo:req.body.movieVideo,
                    movieDownload:req.body.movieDownload,
                    movieTime:Date.now(),
                    movieNumSuppose:0,
                    movieNumDownload:0,
                    movieMainPage: req.body.movieMainPage ? req.body.movieMainPage : movieMainPage
                })
                saveMovie.save(function(err){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'添加成功'});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//删除电影
router.post('/movieDel',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }
    if(!req.body.id)
    {
        res.json({status:1,message:'用户传递错误'});
        return;
    }
    if(!req.body.movieId)
    {
        res.json({status:1,message:'电影ID传递失败'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户位管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                movie.remove({_id:req.body.movieId},function(err,delMovie){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'删除成功',data:delMovie});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//电影更新
router.post('/movieUpdate',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }
    if(!req.body.id)
    {
        res.json({status:1,message:'用户传递错误'});
        return;
    }
    if(!req.body.movieId)
    {
        res.json({status:1,message:'电影ID传递失败'});
        return;
    }
    if(!req.body.movieNumSuppose)
    {
        res.json({status:1,message:'movieNumSuppose参数错误'});
        return;
    }
    if(!req.body.movieNumDownload)
    {
        res.json({status:1,message:'movieNumDownload参数错误'});
        return;
    }
    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                movie.update({_id: req.body.movieId},{$set:{movieNumDownload: req.body.movieNumDownload,movieNumSuppose: req.body.movieNumSuppose}},function(err,updateMovie){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'更新成功',data:updateMovie});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

// 获取所有电影
router.get('/movie',function(req,res,next){
    movie.findAll(function(err,allMovie){
        if(err)
        {
            res.json({status:0,message:'获取电影列表失败'});
        }
        else
        {
            res.json({status:0,message:'获取电影列表成功',data:allMovie});
        }

    })
})

// 显示后台所有评论
router.get('/commentsList',function(req,res,next){
    comment.findAll(function(err,allComments){
        if(err)
        {
            res.json({status:1,message:'获取评论失败'});
        }
        else
        {
            res.json({status:0,message:'获取评论失败',data:allComments});
        }
    })
})

//审核用户评论
router.post('/checkComment',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }
    if(!req.body.id)
    {
        res.json({status:1,message:'用户传递错误'});
        return;
    }
    if(!req.body.commentId)
    {
        res.json({status:1,message:'评论ID传递失败'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                comment.update({ _id: req.body.commentId},{$set:{check:true}},function(err,updateComment){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'审核成功',data:updateComment});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//删除用户评论
router.post('/delComment',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.commentId)
    {
        res.json({status:1,message:'评论ID传递失败'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                comment.remove({ _id: req.body.commentId},function(err,updateComment){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'删除成功',data:updateComment});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//封停用户
router.post('/stopUser',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.userId)
    {
        res.json({status:1,message:'用户ID传递失败'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                user.update({ _id: req.body.userId},{ userStop: true},function(err,updateComment){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'封停成功',data:updateComment});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//更新用户密码
router.post('/changeUser',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.userId)
    {
        res.json({status:1,message:'用户ID传递失败'});
        return;
    }

    if(!req.body.newPassword)
    {
        res.json({status:1,message:'用户新密码传递失败'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                user.update({ _id: req.body.userId},{ password: req.body.newPassword},function(err,updateComment){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'修改成功',data:updateComment});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//查看所有用户信息
router.post('/showUser',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.id)
    {
        res.json({status:1,message:'用户状态传递失败'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                user.findAll(function(err,allUser){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'查看用户列表成功',data:allUser});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})


//管理用户权限
router.post('/powerUpdate',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.id)
    {
        res.json({status:1,message:'用户状态传递失败'});
        return;
    }
    if(!req.body.userId)
    {
        res.json({status:1,message:'用户Id传递失败'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(!findUser[0].userAdmin && !findUser[0].userStop)
            {
                user.update({_id:req.body.userId},{userAdmin:true},function(err,allUser){
                    if(err)
                    {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'更新用户权限成功',data:allUser});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//添加文章
router.post('/addArticle',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.id)
    {
        res.json({status:1,message:'用户状态传递失败'});
        return;
    }
    if(!req.body.articleTitle)
    {
        res.json({status:1,message:'文章名称为空'});
        return;
    }
    if(!req.body.articleContext)
    {
        res.json({status:1,message:'文章内容为空'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {

                var saveArticle = new article({
                    articleTitle: req.body.articleTitle,
                    articleContext: req.body.articleContext,
                    articleTime: Date.now()
                })
                saveArticle.save(function(err) {
                    if (err) {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'添加文章成功'});
                        return;
                    }
                })

            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})



//删除文章
router.post('/delArticle',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.id)
    {
        res.json({status:1,message:'用户状态传递失败'});
        return;
    }
    if(!req.body.articleId)
    {
        res.json({status:1,message:'文章ID为空'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {
                article.remove({_id:req.body.articleId},function(err,delArticle) {
                    if (err) {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'删除文章成功',data:delArticle});
                        return;
                    }
                })

            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//新增主页推荐
router.post('/addRecommend',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.id)
    {
        res.json({status:1,message:'用户状态传递失败'});
        return;
    }
    if(!req.body.recommendImg)
    {
        res.json({status:1,message:'推荐图片为空'});
        return;
    }
    if(!req.body.recommendSrc)
    {
        res.json({status:1,message:'推荐地址为空'});
        return;
    }
    if(!req.body.recommendTitle)
    {
        res.json({status:1,message:'推荐标题为空'});
        return;
    }

    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {

                var saveRecommend = new recommend({
                    recommendImg: req.body.recommendImg,
                    recommendSrc: req.body.recommendSrc,
                    recommendTitle: req.body.recommendTitle
                })
                saveRecommend.save(function(err) {
                    if (err) {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'添加推荐成功'});
                        return;
                    }
                })

            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})


//删除主页推荐
router.post('/delRecommend',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:'用户名为空'});
        return;
    }
    if(!req.body.token)
    {
        res.json({status:1,message:'登陆状态错误'});
        return;
    }

    if(!req.body.id)
    {
        res.json({status:1,message:'用户状态传递失败'});
        return;
    }
    if(!req.body.recommendId)
    {
        res.json({status:1,message:'推荐ID为空'});
        return;
    }


    var check = checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error == 0)
    {
        user.findByUsername(req.body.username,function(err,findUser){
            //用户为管理员且未被封停的情况下
            if(findUser[0].userAdmin && !findUser[0].userStop)
            {


                recommend.remove({_id:req.body.recommendId},function(err) {
                    if (err) {
                        res.json({status:1,message:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:'删除推荐成功'});
                        return;
                    }
                })

            }
            else
            {
                res.json({status:1,message:'用户没有获得权限或者已经停用'});
                return;
            }

        })
    }
    else
    {

        res.json({status:1,message:check.message});
        return;
    }
})

//校验用户是否管理员
function checkAdminPower(name,token,user_id) {
    var check = {"error":1,"message":"用户信息错误，请重新登陆"};
    if(token == getMDSPassword(user_id))
    {
         check.error = 0;
         check.message ="用户登录成功";
    }
    return check;
}
//获取MD5加密
function getMDSPassword(id) {
    var md5 = crypto.createHash('md5');
    var token_before = id + init_token;
    //res.json(userSave[0].id)
    return md5.update(token_before).digest('hex');
}


module.exports = router;
