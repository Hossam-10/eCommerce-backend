const cartModel = require('../models/carts');
const productModel = require('../models/products');
const auth = require('../middleware/auth');
const express = require('express');
const { findOne } = require('../models/carts');
const router = new express.Router();

router.post('/cart/add',auth.customerAuth,async(req,res)=>{
    try{
        const cart = new cartModel({
            customerId:req.customer._id
        })
        await cart.save();
        res.status(200).send({
            status:1,
            message:"Cart is created succefully",
            data:cart
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.post('/cart/addProduct/:productId',auth.customerAuth,async(req,res)=>{
    try{
        const productId = req.params.productId;
        const customerId = req.customer._id;
        const cart = await cartModel.findOne({customerId});
        let quantity = req.body.quantity;
        let totalPrice = req.body.totalPrice;
        cart.products = cart.products.concat({productId,quantity,totalPrice});
        await cart.save();
        res.status(200).send({
            status:1,
            message:"Product is added succefully to cart",
            data:cart
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.post('/cart/deleteProduct/:productId',auth.customerAuth,async(req,res)=>{
    try{
        const productId = req.params.productId;
        const customerId = req.customer._id;
        const cart = await cartModel.findOne({customerId});
        cart.products = cart.products.filter((product)=>{
            return product.productId != productId
        });
        await cart.save();
        res.status(200).send({
            status:1,
            message:"Deleted succefully",
        })
        
    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message
        })
    }

})

router.get('/cart/viewCart',auth.customerAuth,async(req,res)=>{
    try{
        const customerId = req.customer._id;
        const cart = await cartModel.findOne({customerId});
        const cartProducts = await cart.populate('products.productId').execPopulate();
        res.status(200).send({
            status:1,
            message:"Cart data is retrieved succefully",
            data:cartProducts
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