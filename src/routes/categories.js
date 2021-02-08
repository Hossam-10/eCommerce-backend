const categoryModel = require('../models/categories');
const auth = require('../middleware/auth');
const express = require('express');
const router = new express.Router();


router.post('/category/addCategory',auth.adminAuth,async(req,res)=>{

    try{
    const category = new categoryModel(req.body);
    await category.save();
    res.status(200).send({
        status:1,
        message:"Category added succefully",
        data:category
    })
    
    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})


router.patch('/category/edit/:catId',auth.adminAuth,async(req,res)=>{

    try{
        const _id = req.params.catId;
        const avlUpdates = ['name'];
        const keys = Object.keys(req.body);
        const flag = keys.every(key=>avlUpdates.includes(key));
        if(!flag){
            return res.status(200).send({
                status:0,
                message:"Ivalid updates",
                data:{}
            })
        }
        const category = await categoryModel.findOne({_id});
        if(!category){
            return res.status(200).send({
                status:2,
                message:"Cannot find this category",
                data:{}
            })
        }
        category['name'] = req.body['name'];
        await category.save();
        res.status(200).send({
            status:1,
            message:"Updated succefully",
            data:category
        })
    }catch(e){
        res.status(200).send({
            status:0,
            message:"Updating error",
            data:{}
        })
    }
})

router.delete('/category/delete/:catId',auth.adminAuth,async(req,res)=>{

    try{
        const _id = req.params.catId;
        const category = await categoryModel.findOne({_id});
        if(!category)
        {
            return res.status(200).send({
                status:2,
                message:"Cannot find this category",
            })
        }
        await category.remove();
        res.send({
            status:1,
            message:"Deleted succefully"
        })
    }catch(e){
        res.status(200).send({
            status:0,
            message:"Deletion error"
        })
    }
})


module.exports = router;

