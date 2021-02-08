const mongoose = require('mongoose');
const fs = require('fs');
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:2
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:10
    },
    stockAmount:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    catId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Category'
    },
    carts:[{
        cartId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            trim:true,
            ref:'Cart'
        }
    }]
},
{timestamps:true}
)

productSchema.virtual('wishlistProducts',{
    ref:'Wishlist',
    localField:'_id',
    foreignField:'products.productId'
})

productSchema.pre('remove',async function(next){
    const product = this;
    await fs.unlinkSync(product.image);
    next();
})

productSchema.methods.toJSON = function(){

    const product = this.toObject();
    delete product.__v;
    delete product.createdAt;
    delete product.updatedAt;
    delete product.carts;
    return product;
}

const Product = mongoose.model('Product',productSchema);
module.exports = Product;