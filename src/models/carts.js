const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true,
        ref:'Customer'
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
);

cartSchema.methods.toJSON = function(){
    const cart = this.toObject();
    delete cart.__v;
    delete cart.createdAt;
    delete cart.updatedAt;
    return cart;
}
cartSchema.virtual('cartProducts',{
    ref:"Product",
    localField:"_id",
    foreignField:"carts.cartId"
})




const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart;