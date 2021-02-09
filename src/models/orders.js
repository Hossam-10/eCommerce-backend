const mongoose = require('mongoose');
const validator = require('validator');
const orderSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true,
        ref:'Customer'
    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true,
        ref:'Cart'
    },
    requestedPrice:{
        type:Number,
        required:true,
        trim:true,
        validate(value){
            if(value<0) throw new Error('Invalid totalPrice');
        }
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:Number,
        trim:true,
        min:0,
        max:2,
        default:2 //pending
    },
    payMethod:{
        type:String,
        trim:true,
        default:"cash"
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            trim:true,
            ref:'Product'
        },
        quantity:{
            type:Number,
            required:true,
            validate(value){
                if(value<0) throw new Error('Invalid quantity');
            }
        },
        totalPrice:{
            type:Number,
            required:true,
            validate(value){
                if(value<0) throw new Error('Invalid total price');
            }
        }
    }]

},
{timestamps:true}
)

orderSchema.methods.toJSON = function(){
    const order = this.toObject();
    delete order.__v;
    delete order.updatedAt;
    delete order.customerId;
    delete order.cartId;
    return order;
}

const Order = mongoose.model('Order',orderSchema);
module.exports = Order;