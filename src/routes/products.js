const productModel = require('../models/products');
const categoryModel = require('../models/categories');
const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const router = new express.Router();
let uniqueImageName;
let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'images');
    },
    filename:function(req,file,cb){
        if(file.originalname.match(/\.(jpg|png|jpeg)$/)==null)
            return cb(new Error('invalid extension'))
        uniqueImageName = 'productImg' + '-' +Date.now()+ 
        (file.originalname.match(/\.(jpg|png|jpeg)$/)[0])
        cb(null,uniqueImageName)
    }
})

let upload = multer({storage}).single('photo');

router.post('/product/add',auth.adminAuth,async(req,res)=>{
    upload(req, res,async(err)=>{

            if(err) 
                return res.status(200).send({
                    status:0,
                    message:"Invalid image extension"
                })
            else{
                try{
                const product = new productModel(req.body);
                product.image = `images/${uniqueImageName}`;
                await product.save();
                res.status(200).send({
                    status:1,
                    message:"Product was added succefully",
                    data: product
                })
                }catch(e){
                    res.status(200).send({
                        status:0,
                        message:e.message,
                        data:{}
                    })
                }
           }
      })
})

router.get('/product/viewAll',auth.adminAuth,async(req,res)=>{

    try{
        const products = await productModel.find({});
        res.status(200).send({
            status:1,
            message:"Products are retrieved",
            data:products
        })
    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.get('/product/viewSingle/:productId',auth.adminAuth,async(req,res)=>{
    try{
        const _id = req.params.productId;
        const product = await productModel.findOne({_id});
        if(!product){
            return res.status(200).send({
                status:2,
                message:"Cannot find this product",
                data:{}
            })
        }
        const catId = product.catId;
        const category = await  categoryModel.findOne({_id:catId});
        const catName = category.name;
        res.status(200).send({
            status:1,
            message:"Product is retrieved",
            data: {product,catName}
        })
    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.delete('/product/delete/:productId',auth.adminAuth,async(req,res)=>{
    try{
        const _id = req.params.productId;
        const product = await productModel.findOne({_id});
        if(!product){
            return res.status(200).send({
                status:2,
                message:"Cannot find this product",
            })
        }
        await product.remove();
        res.status(200).send({
            status:1,
            message:"Product is removed succefully"
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:"Deleting error"
        })
    }
})

router.patch('/product/edit/:productId',auth.adminAuth,async(req,res)=>{
    try{
        const _id = req.params.productId;
        const avlUpdates = ['name','price','description','stockAmount','catId'];
        const keys = Object.keys(req.body);
        const flag = keys.every(key=>avlUpdates.includes(key));
        if(!flag){
            return res.status(200).send({
                status:0,
                message:"Invalid update keys",
                data:{}
            })
        }
        const product = await productModel.findOne({_id});
        if(!product){
            return res.status(200).send({
                status:2,
                message:"Cannot find this product",
                data:{}
            })
        }
        keys.forEach(key=>{
            product[key] = req.body[key];
        })
        await product.save();
        res.status(200).send({
            status:1,
            message:"Product is updated succefully",
            data:product
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

module.exports = router;