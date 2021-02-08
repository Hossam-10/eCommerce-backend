const customerModel = require('../models/customers');
const categoryModel = require('../models/categories');
const productModel = require('../models/products');
const express = require('express');
const router = new express.Router;
const auth = require('../middleware/auth');

router.post('/customer/register',async(req,res)=>{

    try{
        const customer = new customerModel(req.body);
        await customer.save();
        res.status(200).send({
            status:1,
            message:'Customer inserted succefully',
            data:customer
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

router.post('/customer/login',async(req,res)=>{

    try{
       const customer = await customerModel.verifyCredintials(req.body.email,req.body.password);
       const token = await customer.generateToken();

       res.status(200).send({
           status:1,
           message:"Logged succefully",
           data:{customer,token}
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

router.get('/customer/showAll',auth.adminAuth,async(req,res)=>{

    try{
        const customers = await customerModel.find();
        res.status(200).send({
            status:1,
            message:"Retrieving is done",
            data:customers
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:"Retrieving error",
            data:e
        })
    }
})

router.get('/customer/showSingle/:customerId',auth.customerAuth,async(req,res)=>{

    try{
        const customerId = req.params.customerId;
        const customer = await customerModel.findOne({_id:customerId});
        if(!customer) throw new Error()
        res.status(200).send({
            status:1,
            message:"User is retrieved",
            data:customer
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:"Cannot find this user"
        })
    }
    
})

router.get('/customer/profile',auth.customerAuth,async(req,res)=>{

    const customer = req.customer;
    res.status(200).send({
        status:1,
        message:"Retrieved",
        data:customer
    })
})

router.delete('/customer/delete/:Id',auth.adminAuth,async(req,res)=>{

    try{
        const id = req.params.Id;
        const customer = await customerModel.findByIdAndDelete(id);
        if(!customer)
        {
            return res.status(200).send({
                status:2,
                message:"Cannot find this user"
            })
        }
        res.status(200).send({
            status:1,
            message:"Deleted succesfully"
        })
    }
    catch(e){

        res.status(200).send({
            status:0,
            message:"Deletion error"
        })
    }
})

router.delete('/customer/deleteMe',auth.customerAuth,async(req,res)=>{

    try{
        await req.customer.remove();
        res.status(200).send({
            status:1,
            message:"Deleted succefully"
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:e.message
        })
    }
})

router.patch('/customer/edit/:customerId',auth.customerAuth,async(req,res)=>{

    avlUpdates = ['fName','lName','age','password','phone','gender'];
    const keys = Object.keys(req.body);
    const flag = keys.every((key)=> avlUpdates.includes(key))
    if(!flag){
        return res.status(200).send({
            status:0,
            message:"Invalid update keys",
            data:""
        })
    }
    try{
        const id = req.params.customerId;
        const customer = await customerModel.findOne({_id:id});
        if(!customer){
            return res.status(200).send({
                status:2,
                message:"Cannot find this user",
                data:''
            })
        }
        keys.forEach(key=>{customer[key] = req.body[key]})
        await customer.save();
        res.status(200).send({
            status:1,
            message:"Updated succefully",
            data:customer
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:"Updating error",
            data:''
        })
    }

})

router.post('/customer/logout',auth.customerAuth,async(req,res)=>{
    try{
        req.customer.tokens = req.customer.tokens.filter(token=>{
            return token.token !== req.token;
        })
        await req.customer.save();
        res.status(200).send({
            status:1,
            message:"Logged out succefully"
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:"Error"
        })
    }
})

router.post('/customer/logoutAll',auth.customerAuth,async(req,res)=>{

    try{
        req.customer.tokens = [];
        await req.customer.save();
        res.status(200).send({
            status:1,
            message:"Logged out succefully"
        })
    }
    catch(e){
        res.status(200).send({
            status:0,
            message:"Error"
        })
    }
})

router.get('/customer/showAllCats',auth.customerAuth,async(req,res)=>{

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

router.get('/customer/showSingleCat/:catId',auth.customerAuth,async(req,res)=>{

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

router.get('/customer/viewAllProducts',auth.customerAuth,async(req,res)=>{

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

router.get('/customer/viewSingleProduct/:productId',auth.customerAuth,async(req,res)=>{
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

module.exports = router;