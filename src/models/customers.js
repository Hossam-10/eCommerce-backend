const mongoose = require('mongoose');
const wishlistModel = require('./wishlists');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var passwordValidator = require('password-validator');
var schema = new passwordValidator();

schema
.is().min(8)
.has().uppercase(1)
.has().lowercase(1)
.has().symbols(1)
.has().not().spaces()

const customerSchema = new mongoose.Schema({

    fName:{
        type:String,
        required:true,
        trim:true,
        minlength:3
    },
    lName:{
        type:String,
        required:true,
        trim:true,
        minlength:3
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid email');
        }
    },
    age:{
        type:Number,
        required:true,
        min:15,
        max:80
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        maxlength:100,
        validate(value){
           if(!schema.validate(value)) throw new Error('Invalid password');
        }
    },
    phone:{
        type:String,
        required:true,
        trim:true,
        length:11,
        validate(value){
            if(!validator.isMobilePhone(value,'ar-EG')) 
                throw new Error('Invalid phone number');
        }
    },
    gender:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        maxlength:6
    },
    tokens:[{
        token:{
            type:String
        }
    }]
},
{timestamps:true}
)

customerSchema.pre('save',async function(next){
    const customer = this;
    if(customer.isModified('password')){
        customer.password = await bcrypt.hash(customer.password,15);
    }
    next();
});

customerSchema.pre('remove',async function(next){
    const customer = this;
    await wishlistModel.deleteOne({customerId:this._id});
    next();
})

customerSchema.statics.verifyCredintials = async(email,password)=>{

    const customer = await Customer.findOne({email});
    if(!customer) throw new Error('Cannot find this email');
    const samePassword = await bcrypt.compare(password,customer.password);
    if(!samePassword) throw new Error('Invalid password');
    return customer;
}

customerSchema.methods.generateToken = async function(){

    const customer = this;
    const token = jwt.sign({ _id:customer._id.toString() },'}2~^?BmqM,e4"54qe}Jj');
    customer.tokens = customer.tokens.concat({token});
    await customer.save();
    return token;
}

customerSchema.methods.toJSON = function(){
    const customer = this.toObject();
    delete customer.password;
    delete customer.tokens;
    delete customer.__v;
    delete customer.createdAt;
    delete customer.updatedAt;
    return customer;
}

customerSchema.virtual('customerWishlist',{
    ref:'Wishlist',
    localField:'_id',
    foreignField:'customerId'
})

customerSchema.virtual('customerCart',{
    ref:"Cart",
    localField:'_id',
    foreignField:'customerId'
})

customerSchema.virtual('customerOrders',{
    ref:'Order',
    localField:'_id',
    foreignField:'customerId'
})

const Customer = mongoose.model('Customer',customerSchema);
module.exports = Customer;