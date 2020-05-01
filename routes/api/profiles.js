//引入express
const express = require("express");
//获取路由实例
const router = express.Router();
//引入User模块
const Profile = require("../../model/Profile.js")
//引入passport模块
const passport =require("passport");


//配置测试接口
router.get("/test",(req,res)=>{
    res.json({msg:"info word"});
})
//添加数据接口
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
    //创建一个对象，用来保存添加的数据
    const profileFields={};
    //获取添加的数据
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;

    //对模型进行实例化
    const newProfile = new Profile(profileFields);
    //将数据存储到数据库
    newProfile.save().then((profile)=>{
        res.json(profile)
    }).catch(error=>{
        console.log(error)
    })
});

//获取所有数据的接口
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.find().then(profile=>{
        if(!profile){
            return res.status(404).json("没有任何内容");
        }
        res.json(profile)
    }).catch(error=>{
        res.status(404).json(error)
    })
})
//获取单一数据接口
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({_id: req.params.id}).then(profile=>{
        if(!profile){
            return res.status(404).json("没有任何内容");
        }
        res.json(profile)
    }).catch(error=>{
        res.status(404).json(error)
    })
})
//编辑信息接口
router.post("/edit/id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    //创建一个对象，用来保存添加的数据
    const profileFields={};
    //获取添加的数据
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;

    Profile.findOneAndUpdate(
        {_id:req.params.id},
        {$set:profileFields},
        {new : true}
    ).then(profile=>{
        res.json(profile)
    });
})
//删除数据接口
router.get(
    "/delete/:id",
    passport.authenticate("jwt",{session:false}),(req,res)=>{
        Profile.findOneAndRemove({ _id: req.params.id }).then(profile =>{
            res.json(profile).then(profile=>{
                profile.save()
            })
        }).catch(err => res.status(404).json(err));
    }
)
//导出路由
module.exports = router;