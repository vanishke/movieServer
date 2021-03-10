# vue_movie_example

#### 介绍
vue movie example

#### 说明
book_service 后端API项目


book_view 前端项目

#### 详细介绍
http://www.shanhubei.com/vue_movie_example_backend.html

http://www.shanhubei.com/vue_movie_example_f.html

从一个电影网站项目学习[后台API部分]
本篇文章通过一个完整的电影介绍和电影资源发布网站的项目，过一遍Vue.js。
通过前面章节的介绍
http://www.shanhubei.com/tag/vue 或在本平台下的相关文章了解一下。（ps本人是通过工具编辑器编写，同步在多个平台上）
项目源码：
github：https://github.com/shanhubei/vue_movie_example
gitee:
https://gitee.com/shanhubei/vue_movie_example
从一个电影网站项目学习[后台API部分]
## 用户系统开发 ##
通过《使用express应用生成器新建工程-Vue.js》这篇建立相关的项目基础上。建立users.js路由文件，将所有的用户系统开发放在此文件中，对于routes目录中的文件名作为域名二级路径，即使用http://localhost:3000/users访问可以直接导航到users.js文件中。
>在app.js文件中引用users.js文件并对其增加了一个新的路由设置，具体代码如下：
```language
var users - require('./routes/users');
//使用引入的文件
app.use('/users',users);
```
默认项目会自动生成users.js文件
>对于用户模块的操作，首先需要一个model，因此需新建一个用户存放各种model的文件夹models。
需要写一个用于连接数据库的公用模块，此代码放置在根目录的common文件夹中，新建文件db.js。
因为所有用户的操作都应该建立在用户这个数据集的基础上，所以需要在models文件夹下新建user.js作为数据集，其中的代码如下：
```language
var mongoose = require('../common/db');
var user = new mongoose.Schema({
    username: String,
    password: String,
    userMail: String,
    userPhone: String,
    userAdmin: Boolean,
    userPower: Number,
    userStop: Boolean
})

user.statics.findAll = function(callBack){
    this.find({},callBack);
};
user.statics.findByUsername = function(name,callBack){
    this.find({username:name},callBack);
};
//登录匹配是不是拥有相同的用户名和密码并且没有处于封停状态
user.statics.findUserLogin = function(name,password,callBack){
    this.find({username:name,password:password,userStop:false},callBack);
};
//验证邮箱和电话以及用户名找到用户
user.statics.findUserPassword = function(name,mail,phone,callBack){
    this.find({username:name,userMail:mail,userPhone:phone},callBack);
};

var userModel= mongoose.model('user',user);
module.exports = userModel;
```
此model引用了db.js文件中已经连接的Mongoose插件，所以这里的数据库操作都是对db.js文件中已经连接的数据库而进行的。
### 用户模块API路由地址 ###
1.注册路由
/users/register路由是用户的注册路由。
在user.js文件中的代码如下：
```language
//用户注册接口
router.post('/register', function (req, res, next) {
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.password) {
        res.json({status: 1, message: "密码为空"})
    }
    if (!req.body.userMail) {
        res.json({status: 1, message: "用户邮箱为空"})
    }
    if (!req.body.userPhone) {
        res.json({status: 1, message: "用户手机为空"})
    }
    user.findByUsername(req.body.username, function (err, userSave) {
        if (userSave.length != 0) {
            // res.json(userSave)
            res.json({status: 1, message: "用户已注册"})
        } else {
            var registerUser = new user({
                username: req.body.username,
                password: req.body.password,
                userMail: req.body.userMail,
                userPhone: req.body.userPhone,
                userAdmin: 0,
                userPower: 0,
                userStop: 0
            })
            registerUser.save(function () {
                res.json({status: 0, message: "注册成功"})
            })
        }
    })
});
```

2.登录路由
/user/login 用于用户的登录检测。在验证用户的用户名与密码时，如果用户不属于封停用户，则返回一个相应的Token值作为用户的登录状态，此值在所有的登录操作中都需要作为参数携带。（这种Token的方式是不安全甚至无意义的，其实对于一个无状态的登录验证来说，最好在Token中加入一些相关的元素，包括时间、IP和权限等一起作为加密的方式，使用公、私钥的方式进行加密和解密，或者可以使用JWT方式进行接口的验证。）
为了生成这个Token值，需要在JavaScript中引入一个用于加密的中间件，使用npm安装包Crypto：
```language
npm install crypto -save
```
完成后，可以在代码中添加一个方法，参数是一个用户的ID，返回MD5值，代码如下：
```language
//获取md5值
function getMD5Password(id) {
    var md5 = crypto.createHash('md5');
    var token_before = id + init_token
    // res.json(userSave[0]._id)
    return md5.update(token_before).digest('hex')
}
```
login.js代码如下：
```language
//用户登录接口
router.post('/login', function (req, res, next) {
	if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.password) {
        res.json({status: 1, message: "密码为空"})
    }
    user.findUserLogin(req.body.username, req.body.password, function (err, userSave) {
        if (userSave.length != 0) {
            //md5查看密码
            // res.json(userSave)
            // var md5 = crypto.createHash('md5');
            // var token_before = userSave[0]._id + init_token
            // res.json(userSave[0]._id)
            // var token_after = md5.update(token_before).digest('hex')
            var token_after = getMD5Password(userSave[0]._id)
            res.json({status: 0, data: {token: token_after,user:userSave}, message: "用户登录1成功"})
        } else {
            res.json({status: 1, message: "用户名或者密码错误"})
        }
    })
});
```
3.找回密码路由
/users/findPassword用于找回用户的密码，这里需要输入mail、phone和username 3个字段来确定用户的身份，并且允许修改密码。

完整代码如下：
```language
//需要输入用户的邮箱信息和手机信息，同时可以更新密码
//    这里需要两个返回情况，一个是req.body.repassword存在时，一个是repassword不存在
//    这个接口同时用于密码的重置，需要用户登录
    if (req.body.repassword) {
        //    存在的时候，需要验证其登录情况或者验证其code验证
        if (req.body.token) {
            //    存在code登录状态时，验证其状态
            if (!req.body.user_id) {
                res.json({status: 1, message: "用户登录错误"})
            }
            if (!req.body.password) {
                res.json({status: 1, message: "用户老密码错误"})
            }
            if (req.body.token == getMD5Password(req.body.user_id)) {
                user.findOne({_id: req.body.user_id, password: req.body.password}, function (err, checkUser) {
                    if (checkUser) {
                        user.update({_id: req.body.user_id}, {password: req.body.repassword}, function (err, userUpdate) {
                            if (err) {
                                res.json({status: 1, message: "更改错误", data: err})
                            }
                            res.json({status: 0, message: '更改成功', data: userUpdate})
                        })
                    } else {
                        res.json({status: 1, message: "用户老密码错误"})
                    }
                })

            } else {
                res.json({status: 1, message: "用户登录错误"})
            }

        } else {
            //    不存在code时，直接验证mail和phone
            user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone, function (err, userFound) {
                if (userFound.length != 0) {
                    user.update({_id: userFound[0]._id}, {password: req.body.repassword}, function (err, userUpdate) {
                        if (err) {
                            res.json({status: 1, message: "更改错误", data: err})
                        }
                        res.json({status: 0, message: '更改成功', data: userUpdate})
                    })
                } else {
                    res.json({status: 1, message: "信息错误"})
                }
            })
        }
    } else {
        //    这里只是验证mail和phone，为了前台验证，返回验证成功和所有的字段，改密码使用或者认证失败
        if (!req.body.username) {
            res.json({status: 1, message: "用户名称为空"})
        }
        if (!req.body.userMail) {
            res.json({status: 1, message: "用户邮箱为空"})
        }
        if (!req.body.userPhone) {
            res.json({status: 1, message: "用户手机为空"})
        }
        user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone, function (err, userFound) {
            if (userFound.length != 0) {
                res.json({
                    status: 0,
                    message: "验证成功，请修改密码",
                    data: {username: req.body.username, userMail: req.body.userMail, userPhone: req.body.userPhone}
                })
            } else {
                res.json({status: 1, message: "信息错误"})
            }
        })
    }
```

4.提交评论路由
/users/postCommment路由用来提交用户对于一个movie的评论。这里需要一个新的model，新的数据对象作为电影的评论。可以在models文件夹中建立一个新的JavaScript文件，名为comment.js 参考前面 就不一一摆出啦。
***
点赞路由、下载路由、发送站内信路由、接收站内信路由等等。

# 启动 #
```
set DEBUG=book_service & npm start
```
***
***
***

从一个电影网站项目学习[前台显示端]---Vue.js
本篇文章通过一个完整的电影介绍和电影资源发布网站的项目，过一遍Vue.js。
通过前面章节的介绍
http://www.shanhubei.com/tag/vue 或在本平台下的相关文章了解一下。（ps本人是通过工具编辑器编写，同步在多个平台上）
项目源码：
github：https://github.com/shanhubei/vue_movie_example
gitee:
https://gitee.com/shanhubei/vue_movie_example
从一个电影网站项目学习[前台显示端]
包含用户的操作、新闻的发布展示等功能。
现在正是开始编写项目。
# 建立电影网站Vue.js项目 #
1.使用Vue.js命令行工具创建新项目。使用以下命令进行Vue.js项目的初始化和安装。
```language
vue init webpack book_view
```
2.在此处项目会提示是否自动安装vue-router组件，这里需要输入y后按回车键进行安装。其他安装的包可以默认选择。

3.进入该项目文件夹中，先使用`npm install`命令进行安装，然后尝试使用`npm run dev`命令运行程序。

4.此项目会极大地依赖后端的数据服务端，所以需要一些相关的请求包，安装vue.js网络请求模块vue-resource.
```language
npm install vue-resource -save
```
5.安装后需要在routes\index.js中引入并注册该组件，代码如下：
```language
import VueResource from 'vue-resource'
Vue.use(VueResource)
```
注意：跨域问题，Vue.js和Express提供了两种可以支持跨域的方式。1.Vue.js的vue-resource的jsonp()方式。2.另外方式需要更改Express编写的服务端代码，在app.js中配置。

# 前台路由页面编写 #
通过编写相应的component，引入相关的router路由。

# 启动 #
```language
npm install
npm run dev
```
