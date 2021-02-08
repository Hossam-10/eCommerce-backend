const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({

    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Customer'
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            trim:true,
            ref:'Product'
        }
    }]
},
{timestamps:true}
)


wishlistSchema.methods.toJSON = function(){
    const wishlist = this.toObject();
    delete wishlist.__v;
    delete wishlist.createdAt;
    delete wishlist.updatedAt;
    return wishlist;
}

const Wishlist = mongoose.model('Wishlist',wishlistSchema);
module.exports = Wishlist;