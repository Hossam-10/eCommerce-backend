const mongoose = require('mongoose');
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

const adminSchema = new mongoose.Schema({

    fName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        default:"Admin"
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
    tokens:[{
        token:{
            type:String
        }
    }]
},
{timestamps:true}
);

adminSchema.pre('save',async function(next){

    const admin = this;
    if(admin.isModified('password'))
        admin.password = await bcrypt.hash(admin.password,15);
    next();
});

adminSchema.statics.verifyCredintials = async(email,password)=>{

    const admin = await Admin.findOne({email});
    if(!admin) throw new Error('Cannot find this email');
    const samePassword = await bcrypt.compare(password,admin.password);
    if(!samePassword) throw new Error('Invalid password');
    return admin;
}

adminSchema.methods.generateToken = async function(){
    const admin = this;
    const token = jwt.sign({_id:admin._id.toString()},'[#z[47ank(c<-vmp}7Ee3ewD');
    admin.tokens = admin.tokens.concat({token});
    await admin.save();
    return token;
}

adminSchema.methods.toJSON = function(){

    const admin = this.toObject();
    delete admin.password;
    delete admin.tokens;
    delete admin.__v;
    delete admin.createdAt;
    delete admin.updatedAt;
    return admin;
}


const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;