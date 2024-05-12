const jwt=require("jsonwebtoken");
const User=require("../models/user");

const admin=async(req,res,next)=>{
    try{
        const token=req.header('x-auth-token');
   if(!token) return res.status(401).json({msg:"No auth token access denied"});
   const isVarified= jwt.verify(token,"passwordKey");
   if(!isVarified) return res.status(401).json({msg:"token verification failed"});

   const user=await User.findById(isVarified.id);
   if(user.type=="user" || user.type=="seller") {
    return res.status(401).json({msg:"You are not a admin"});
   }

   req.user=isVarified.id;
   req.token=token;
   next();

    }catch(e){
        res.status(500).json({error:e.message});
    }
}

module.exports=admin;