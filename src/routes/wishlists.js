const express = require('express');
const wishlistModel = require('../models/wishlists');
const productModel = require('../models/products')
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/wishlist/add',auth.customerAuth,async(req,res)=>{

    try{
        const wishlist = new wishlistModel({
            customerId: req.customer._id
        });
        await wishlist.save();
        res.status(200).send({
            status:1,
            message:"Wishlist created succefully",
            data:wishlist
        })
    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.post('/wishlist/addProduct/:productId',auth.customerAuth,async(req,res)=>{
    try{
        const customerId = req.customer._id;
        const productId = req.params.productId;
        const wishlist = await wishlistModel.findOne({customerId});
        const flag = await wishlistModel.findOne({
            _id:wishlist._id,
            'products.productId':productId
        });
        if(flag){
            return res.status(200).send({
                status:2,
                message:"Product is already wishlisted",
                data:{}
            })
        }
        wishlist.products = wishlist.products.concat({productId});
        await wishlist.save();
        res.status(200).send({
            status:1,
            message:"Product added succefully",
            data:wishlist
        })
    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.get('/wishlist/viewSingle',auth.customerAuth,async(req,res)=>{
    try{
        const customer = req.customer;
        const wishlist = await wishlistModel.findOne({customerId:req.customer._id});
        const wishProducts = wishlist.products;
        let products = [];
        for(let i = 0;i<wishProducts.length;i++){
            let product = await productModel.findOne({_id:wishProducts[i].productId});
            products.push(product);
        }
        res.status(200).send({
            status:1,
            message:"Wishlist is succefully retrieved",
            data:{customer,products}
        })
    }catch(e){
        res.send(e)
    }
})

router.post('/wishlist/deleteProduct/:productId',auth.customerAuth,async(req,res)=>{

    try{
        const productId = req.params.productId;
        const customerId = req.customer._id;
        const wishlist = await wishlistModel.findOne({customerId});
        wishlist.products =  wishlist.products.filter(product=>{
            return product.productId != productId})
        await wishlist.save();
        res.status(200).send({
            status:1,
            message:"Product is deleted succefully"
        })
    
    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message
        })
    }
})







module.exports = router;