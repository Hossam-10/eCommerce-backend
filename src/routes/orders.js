const orderModel = require('../models/orders');
const cartModel = require('../models/carts');
const auth = require('../middleware/auth');
const express = require('express');
const router = new express.Router();


//customers can do these
router.post('/order/create',auth.customerAuth,async(req,res)=>{
    try{
        const customerId = req.customer._id;
        const cart = await cartModel.findOne({customerId});
        const cartProducts = cart.products;
        const order = new orderModel({
            customerId:customerId,
            cartId:cart._id,
            ...req.body
        })
        cartProducts.forEach((product)=>{
            order.products = order.products.concat({
                productId:product.productId,
                quantity:product.quantity,
                totalPrice:product.totalPrice
            })
        })
        cart.products = [];
        await order.save();
        await cart.save();
        res.status(200).send({
            status:1,
            message:"Order is created succefully",
            data:order
            
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.get('/order/viewSingle/:orderId',auth.customerAuth,async(req,res)=>{

    try{
        const _id = req.params.orderId;
        const order = await orderModel.findOne({_id});
        const orderProducts = await order.populate('products.productId').execPopulate()
        res.status(200).send({
            status:1,
            message:"Order is retrieved succefully",
            data:orderProducts
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.get('/order/allCustomerOrders',auth.customerAuth,async(req,res)=>{

    try{
        const customerId = req.customer._id;
        const orders = await orderModel.find({customerId});
        res.status(200).send({
            status:1,
            message:"Orders are retrieved succefully",
            data:orders
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

//Admins can do these
router.patch('/order/edit/:orderId',auth.adminAuth,async(req,res)=>{
    try{
        const _id = req.params.orderId;
        const order = await orderModel.findOne({_id});
        const avlUpdates = ['status'];
        const keys = Object.keys(req.body);
        const flag = keys.every(key=>avlUpdates.includes(key));
        if(!flag){
            return res.status(200).send({
                status:0,
                message:"Invalid update keys",
                data:{}
            })
        }
        order['status'] = req.body['status'];
        await order.save();
        res.status(200).send({
            status:1,
            message:"Order is updated succefully",
            data:order
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})

router.get('/order/viewAll',auth.adminAuth,async(req,res)=>{
    try{
        const orders = await orderModel.find();
        res.status(200).send({
            status:1,
            message:"Orders are retrieved succefully",
            data:orders
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message,
            data:{}
        })
    }
})


router.delete('/order/delete/:orderId',auth.adminAuth,async(req,res)=>{

    try{
        const _id = req.params.orderId;
        const order = await orderModel.findOne({_id});
        await order.remove();
        res.status(200).send({
            status:1,
            message:"Order is deleted succefully",
        })

    }catch(e){
        res.status(200).send({
            status:0,
            message:e.message
        })
    }
})






module.exports = router;
