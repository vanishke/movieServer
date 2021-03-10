var express = require('express');
var user= require ( '../models/user');
var comment = require('../models/comment')
var mail = require('../models/mail')
var movie = require('../models/movie')
var crypto = require ('crypto');
var router = express.Router();
// 系统默认token
const init_token = 'TKL02o';
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册接口
router.post('/register',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:"用户名为空"});
        return;
    }
    if(!req.body.password)
    {
        res.json({status:1,message:"密码为空"});
        return;
    }
    if(!req.body.userMail)
    {
        res.json({status:1,message:"邮箱为空"});
        return;
    }
    if(!req.body.userPhone)
    {
        res.json({status:1,message:"联系电话为空"});
        return;
    }
    if(!req.body.userAdmin)
    {
        var userAdmin = false;
    }
    user.findByUsername(req.body.username,function(err,userSave){
        if(userSave.length != 0)
        {
            res.json({status:1,message:"用户已注册"});
            return;
        }
        else
        {
            var registerUser = new user({
                username: req.body.username,
                password: req.body.password,
                userMail: req.body.userMail,
                userPhone: req.body.userPhone,
                userAdmin: req.body.userAdmin?req.body.userAdmin:userAdmin,
                userPower: 0,
                userStop: 0
            });
            registerUser.save(function()
            {
                res.json({status:1,message:"注册成功"});
            })
        }
    });


})
module.exports = router;

//登陆接口
router.post('/login',function(req,res,next){
    if(!req.body.username)
    {
        res.json({status:1,message:"用户名为空"});
        return;
    }
    if(!req.body.password)
    {
        res.json({status:1,message:"密码为空"});
        return;
    }

    user.findUserLogin(req.body.username,req.body.password,0,function(err,userSave){
        if(userSave.length != 0)
        {
            // 通过MDS查看密码
            var token_after = getMDSPassword(userSave[0].id);
            res.json({status : 0, data : {token:token_after, user:userSave},
                message:"用户登录成功" });
            return;
        }
        else
        {
            res.json({status : 1, message:"用户名或密码错误" });
            return;
        }
    });
})

//用户找回、修改密码
router.post('/findPassword',function(req,res,next){
    // 需要同时输入用户的邮箱和联系方式
    //存在两种情况。1、存在repassword的情况下 2、repassword为空
    //接口同时用于修改密码和找回密码
    if(req.body.repassword)
    {
        //验证登陆情况或其他属性
        if(req.body.token)
        {
            if(!req.body.user_id)
            {
                res.json({status:1,message:"用户登陆错误"});
                return;
            }
            if(!req.body.password)
            {
                res.json({status:1,message:"用户原始密码错误"});
                return;
            }
            if(req.body.token == getMDSPassword(req.body.user_id))
            {
                user.findOne({_id:req.body.user_id,password:req.body.password},function(err,checkUser){
                 if(checkUser)
                 {
                     user.update({_id:req.body.user_id},{password:req.body.repassword},function(err,userUpdate){
                    if(userUpdate)
                    {
                        res.json({status:0,message:"更新密码成功"});
                        return;
                    }
                    else
                    {
                        res.json({status:1,message:"更新密码失败"});
                        return;

                    }
                 })

                 }
                 else
                 {
                     res.json({status:1,message:"用户原始密码错误"});
                     return;
                 }
            });
            }
            else
            {
                res.json({status:1,message:"用户登陆错误"});
                return;
            }
        }
        else
        {
            //不存在code,直接验证邮箱和联系方式
            user.findUserPassword(req.body.username,req.body.userMail,req.body.userPhone,function(err,userFound){
            if(userFound.length != 0)
            {
                user.update({_id:userFound[0]._id},{password:req.body.repassword},function(err,userUpdate){
                    if(err)
                    {
                        res.json({status:1,message:"更改用户密码失败",data:err});
                        return;
                    }
                    else
                    {
                        res.json({status:0,message:"更改用户密码成功",data:userUpdate});
                        return;
                    }
                })
            }
            else
            {
                res.json({status:0,message:"信息错误"});
                return;
            }
        })

        }

    }
    else
    {
        //重置密码不存在的情况下，仅校验邮箱和联系方式，返回提交信息供后续修改面操作
        if(!req.body.username)
        {
            res.json({status:1,message:"用户名为空"});
            return;
        }
        if(!req.body.userMail)
        {
            res.json({status:1,message:"邮箱为空"});
            return;
        }
        if(!req.body.userPhone)
        {
            res.json({status:1,message:"联系方式为空"});
            return;
        }
        user.findUserPassword(req.body.username,req.body.userMail,req.body.userPhone,function(err,userFound){
          if(userFound.length != 0)
          {
              res.json({status:0,data:{username:req.body.username,userMail:req.body.userMail,userPhone:req.body.userPhone},message:"验证成功，请修改密码"});
              return;
          }
          else
          {
              res.json({status:1,message:"用户信息校验失败"});
              return;
          }
        })

    }
})
//获取MD5加密
function getMDSPassword(id) {
    var md5 = crypto.createHash('md5');
    var token_before = id + init_token;
    //res.json(userSave[0].id)
    return md5.update(token_before).digest('hex');
}

// 用户评论
router.post('/postComment',function(req,res,next){

    if(!req.body.username)
    {
        var username = '匿名用户';
    }
    if(!req.body.movie_id)
    {
        res.json({status:1,message:"用户名称为空"});
        return;
    }
    if(!req.body.context)
    {
        res.json({status:1,message:"评论信息为空"});
        return;
    }
    var saveComment = new comment({
        movie_id:req.body.movie_id,
        username: username ? req.body.username: username,
        context:req.body.context,
        check:0
    });

    saveComment.save(function(err){
        if(err)
        {
            res.json({status:1,message:err});
        }
        else
        {
            res.json({status:0,message:'评论提交成功'});
        }
    })

})

//站内信
router.post('/sendEmail',function(req,res,next){
    if(!req.body.token)
    {
       res.json({status:1,message:'用户登陆状态错误'});
       return;
    }
    if(!req.body.user_id)
    {
        res.json({status:1,message:'用户登陆状态出错'});
        return;
    }
    if(!req.body.toUserName)
    {
        res.json({status:1,message:'未选择相关用户'});
        return;
    }
    if(!req.body.title)
    {
        res.json({status:1,message:'标题不能为空'});
        return;
    }
    if(!req.body.context)
    {
        res.json({status:1,message:'内容不能为空'});
        return;
    }
    if(req.body.token == getMDSPassword(req.body.user_id))
    {
        user.findByUsername(req.body.toUserName,function(err,toUser){
            if(toUser.length !=0)
            {
                var newMail = new mail({
                    fromUser:req.body.user_id,
                    toUser:toUser[0]._id,
                    title:req.body.title,
                    context:req.body.context
                })
                newMail.save(function(err){

                    res.json({status:0,message:'发送成功'});

                })
            }
            else
            {
                res.json({status:1,message:'您发送的对象不存在'});
                return;
            }
        })
    }
    else
    {
        res.json({status:1,message:'用户登陆错误'});
        return;
    }

})

//查看站内信
router.post('/showEmail',function(req,res,next){
    if(!req.body.token)
    {
        res.json({status:1,message:'用户登陆状态错误'});
        return;
    }
    if(!req.body.user_id)
    {
        res.json({status:1,message:'用户登陆状态出错'});
        return;
    }
    //receive 0:接收的站内信 1:发送的站内信
    if(!req.body.receive)
    {
        res.json({status:1,message:'参数错误'});
        return;
    }
    if(req.body.token == getMDSPassword(req.body.user_id))
    {
        if(req.body.receive == 1)
        {
            mail.findByFromUserId(req.body.user_id,function(err,sendMail){
                if(sendMail.length != 0)
                {
                    res.json({status:0,message:'获取成功',data:sendMail});
                }
                else
                {
                    res.json({status:0,message:'获取失败',data:null});
                }
            })
        }
        else
        {
            mail.findByToUserId(req.body.user_id,function(err,receiveMail) {
                if (receiveMail.length != 0)
                {
                    res.json({status: 0, message: '获取成功', data: receiveMail});
                }
                else
                {
                    res.json({status: 0, message: '获取失败', data: null});
                }
            })
        }
    }
    else
    {
        res.json({status:1,message:'用户登录错误'});
        return;
    }
})

//点赞
router.post('/support',function(req,res,next){
    if(!req.body.movie_id)
    {
        res.json({status:1,message:'电影ID传递失败'});
    }
    movie.findById(req.body.movie_id,function(err,supportMovie){
        movie.update({_id:req.body.movie_id},{movieNumSuppose:supportMovie.movieNumSuppose+1},function(err){
            if(err)
            {
                res.json({status:1,message:'点赞失败'});
            }
            else
            {
                res.json({status:0,message:'点赞成功'});
            }
        })
    })

})

// 显示用户个人信息的内容
router.post('/showUser',function(req,res,next){
    if(!req.body.user_id)
    {
        res.json({status:1,message:'用户状态错误'});
        return;
    }
    user.findById(req.body.user_id,function(err,getUser){
        res.json({status:0,message:'获取成功',data:{user_id:getUser._id,
                username:getUser.username,
                userMail:getUser.userMail,
                userPhone:getUser.userPhone,
                userStop:getUser.userStop}});
        return;
    })
})

module.exports = router;
