const mongoose = require('mongoose');
const productModel = require('./products');
const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    }
},
{timestamps:true}
);

categorySchema.methods.toJSON = function(){

    const category = this.toObject();
    delete category.__v;
    delete category.createdAt;
    delete category.updatedAt;
    return category;
}

categorySchema.virtual('productCategories',{
    ref:'Product',
    localField:'_id',
    foreignField:'catId'
})

categorySchema.pre('remove',async function(next){

    const category = this;
    const products = await productModel.find({catId:this._id});
    products.forEach(async(product)=>{await product.remove()});
    next();
})

const Category = mongoose.model('Category',categorySchema);
module.exports = Category;