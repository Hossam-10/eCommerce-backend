const adminModel = require('../models/admins');
const categoryModel = require('../models/categories');
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/admin/register',async(req,res)=>{

    try{
        const admin = new adminModel(req.body);
        await admin.save();
        res.status(200).send({
            status:1,
            message:"Admin inserted succefully",
            data:admin
        })
    }
    catch(e){

        res.status(200).send({
            status:0,
            message:"Error in inserting",
            data:e.message
        })
    }
})

router.post('/admin/login',async(req,res)=>{

    try{
        const admin = await adminModel.verifyCredintials(req.body.email,req.body.password);
        const token = await admin.generateToken();

        res.status(200).send({
            status:1,
            message:"Logged in succefully",
            data:{admin,token}
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:e
        })
    }
})

router.get('/admin/viewAll',auth.adminAuth,async(req,res)=>{
    try{
        const admins = await adminModel.find();
        res.status(200).send({
            status:1,
            message:"All admins are retrieved",
            data:admins
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }

})

router.get('/admin/viewSingle/:adminId',auth.adminAuth,async(req,res)=>{

    try{
       const _id = req.params.adminId;
       const admin = await adminModel.findOne({_id}) ;
       if(!admin) throw new Error();
       res.status(200).send({
           status:1,
           message:"Admin is retrieved",
           data:admin
       })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:"Admin is not found",
            data:{}
        })
    }
})

router.get('/admin/profile',auth.adminAuth,async(req,res)=>{

    try{
        const admin = req.admin;
        res.status(200).send({
            status:1,
            message:"Retrieved",
            data:admin
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            message:"Retrieving error",
            data:{}
        })
    }
})

router.patch('/admin/edit/:adminId',auth.adminAuth,async(req,res)=>{

    try{
        const _id = req.params.adminId
        const avlUpdates = ['fName','lName','password','phone'];
        const keys = Object.keys(req.body);
        const flag = keys.every(key=> avlUpdates.includes(key));
        if(!flag){
            return res.status(200).send({
                status:0,
                message:"Invalid update keys",
                data:{}
            })
        }
        const admin = await adminModel.findOne({_id});
        if(!admin){
            res.status(200).send({
                status:2,
                message:"Cannot find this user",
                data:{}
            })
        }
        keys.forEach(key=>{admin[key]=req.body[key]})
        await admin.save();
        res.status(200).send({
            status:1,
            message:"Updated succefully",
            data:admin
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.delete('/admin/deleteMe',auth.adminAuth,async(req,res)=>{
    try{
        await req.admin.remove();
        res.status(200).send({
            status:1,
            message:"Deleted succefully"
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            message:e.message
        })
    }
})

router.delete('/admin/delete/:id',auth.adminAuth,async(req,res)=>{

    try{
        const _id = req.params.id;
        const admin = await adminModel.findOne({_id});
        if(!admin){
            return res.status(200).send({
                status:2,
                message:"Cannot find this user",
            })
        }
        await admin.remove();
        res.status(200).send({
            status:1,
            message:"Deleted succefully"
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            message:"Error"
        })
    }
})

router.post('/admin/logout',auth.adminAuth,async(req,res)=>{

    try{
        req.admin.tokens = req.admin.tokens.filter(token=> token.token !== req.token);
        await req.admin.save();
        res.status(200).send({
            status:1,
            message:"Logged out succefully"
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            message:"Error"
        })
    }
})

router.post('/admin/logoutAll',auth.adminAuth,async(req,res)=>{
    try{
        req.admin.tokens = [];
        await req.admin.save();
        res.status(200).send({
            status:1,
            message:"Logged out succefully"
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            message:"Error"
        })
    }
})

router.get('/admin/showAllCats',auth.adminAuth,async(req,res)=>{

    try{
        const categories = await categoryModel.find({});
        res.status(200).send({
            status:1,
            message:"Data retrieved succefully",
            data:{categories}
        })
    }catch(e){
        res.status(200).send({
            status:0,
            message:"Error in retrieving data",
            data:{}
        })
    }
})

router.get('/admin/showSingleCat/:catId',auth.adminAuth,async(req,res)=>{

    try{
        const _id = req.params.catId;
        const category = await categoryModel.findOne({_id});
        if(!category){
            return res.status(200).send({
                status:2,
                message:"Cannot find this category",
                data:{}
            })
        }
        const catProducts = await category.populate('productCategories').execPopulate();
        const products = catProducts.productCategories;
        res.status(200).send({
            status:1,
            message:"Data retrieved succefully",
            data:{category,products}
        });
    }catch(e){
        res.status(200).send({
            status:0,
            message:"Retrieving error",
            data:e.message
        })
    }
})


module.exports = router;