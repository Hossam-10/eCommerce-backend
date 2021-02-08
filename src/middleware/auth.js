const jwt = require('jsonwebtoken');
const customerModel = require('../models/customers');
const adminModel = require('../models/admins');

const customerAuth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decodedToken = jwt.verify(token,'}2~^?BmqM,e4"54qe}Jj');
        const customer = await customerModel.findOne({_id:decodedToken._id,'tokens.token':token});
        if(!customer) throw new Error();
        req.customer = customer;
        req.token = token;
        next()
       
    }
    catch(e){
        res.status(500).send({
            status:0,
            data:e,
            message:'Please authintcate'
        })
        
    }
}

const adminAuth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decodedToken = jwt.verify(token,'[#z[47ank(c<-vmp}7Ee3ewD');
        const admin = await adminModel.findOne({_id:decodedToken._id,'tokens.token':token})
        if(!admin) throw new Error();
        req.admin = admin;
        req.token = token;
        next();
    }
    catch(e){
        res.status(500).send({
            status:0,
            message:"Please authenticate",
            data:e
        })
    }
}

module.exports = {customerAuth,adminAuth};