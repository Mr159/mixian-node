//引入express
const express = require("express");
//获取路由实例
const router = express.Router();
//导入全球大头贴
const gravatar = require("gravatar");

//引入keys.js文件
const keys = require("../../config/keys")

//引入jsonwebtoken模块
const jwt = require("jsonwebtoken");

//引入passport模块
const passport =require("passport");


//配置测试接口
router.get("/test",(req,res)=>{
    res.json({msg:"login word"});
})

//注册接口

//引入User模块
const User = require("../../model/User.js")

//引入密码加密模块
const bcrypt = require('bcrypt');
router.post("/register",(req,res)=>{
    User.findOne({email: req.body.email}).then((user)=>{
        if(user){
            res.json({msg:"邮箱已被注册！"})
        }else{
            var avatar = gravatar.url('req.body.email', {s: '200', r: 'pg', d: 'mm'});
            //如果没有，将数据保存在数据库
            const newUser = new User({
                name:req.body.name,
                password:req.body.password,
                avatar,
                email:req.body.email,
                identity:req.body.identity
            });
            //密码加密
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    newUser.password=hash
                    //将数据存储到数据库
                    newUser.save().then(response=>{
                        res.json({code:0,msg:"注册成功",data:response});
                    }).catch(error=>{
                        console.log("数据注册失败:"+error)
                    })
                });
            });
            
        }
    })
});

//登录接口
router.post("/login",(req,res)=>{
    //获取登录的邮箱
    const email =  req.body.email;
    //获取登录的密码
    const password = req.body.password
    //在数据库查询有没有登录的邮箱账号，如果没有，则给前台返回用户名不存在，如果有的话，判断密码是否一致，
    //如果一直则给前台返回登录成功
    User.findOne({email}).then(user=>{
        if(!user){
            return res.status(404).json({msg:"用户名不存在"})
        }else{
            //对峙密码
            bcrypt.compare(password,user.password).then(isMatch=>{
                if(isMatch){
                    //设置规则
                    const rule={
                        id:user._id,
                        name:user.name,
                        avatar:user.avatar,
                        identity:user.identity

                    }
                    //使用jsonwebtoken模块,生成token
                    //jwt.sign(规则,加密名称,过期时间,箭头函数)
                    jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(error,token)=>{
                        res.json({
                            code:0,
                            msg:"success",
                            text:"登录成功",
                            token:"Bearer "+token
                        });
                    })
                    
                }else{
                    res.status(400).json({msg:"密码错误"});
                }
            })
        }
    }).catch(error=>{
        console.log(error)
    })

})
//验证token接口
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        avatar:req.user.avatar,
        identity:req.user.identity
    })
})

//导出路由
module.exports = router;