const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//引入keys.js
const keys = require("./keys");
//引入User.js
const User= require("../model/User")

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

//导出函数
module.exports = (passport)=>{
    passport.use(new JwtStrategy(opts,(jwt_payload, done)=> {
        User.findById(jwt_payload.id).then(user=>{
            if(user){
                return done(null,user);
            }
            return done(null,false);
        }).catch(error=>{
            console.log(error)
        })
    }));
}