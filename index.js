import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());

const createtokens = (user)=>{
    return jwt.sign(
        {
              name:user.name,
              email:user.email,
              age:user.age,
              phone : user.phone
            
        },
        process.env.JWT_TOKEN,
        {
            expiresIn:"1hr"
        }
    )

}


mongoose.connect(process.env.MONGO_URL)
.then(
    ()=>{
       console.log("MOngodb connected succesfully")
    }
)
.catch(
    ()=>{
       console.log("mongodb isn't connected")
    }
)



//schema

const addressSchema = new mongoose.Schema({
    city:
    {
        type:String,
        required:false,
    },

    house:{
          type:String,
          required:true,
    },


})
const userSchema = mongoose.Schema({
    name:{
        type : String,
        required: true,
        unique:false,
    },

    email:
    {
        type:String,
        required:true,
        unique:true,
    },

    age:
    {
        type: Number,
        required:false,

    },

    phone:
    {
        type:Number,
        required:true,

    },

    password:{
        type:String,
        required:true,
    },

    address:
    {
        type:addressSchema
    }




}, {timestamps:true})



const sizesschema = mongoose.Schema({

    size:{
             type:String,
             required:true
    },

    availability:
    {
              type:Number,
              required:true
    }
})


const productschema = mongoose.Schema({
    productname:{
    type: String,
    required:true,
    },

    price:{
        type:Number,
        required:true,
    },

    description:
    {
        type:String,
        required:true,
    },

    sizes:{
        type:[sizesschema],
        required:false,
    },



    availablestock:{
           type:Number,
           required:true

    },

    sizestock:
    {
        type:Number,
        required:false

    }


})







const User = mongoose.model("User" , userSchema);


const product = mongoose.model("product" , productschema);



//middlewares
//frontend --> middleware(stringify) -->backend(APi)
app.post('/signup' , async(req,res)=>{
    console.log(req.body);
    const hashpass = await bcrypt.hash(req.body.password,10)



    const newuser = new User({
        name: req.body.name,
        email:req.body.email,
        age:req.body.age,
        phone:req.body.phone,
        password:hashpass,
        address:{
            city:req.body.address.city,
            house:req.body.address.house
        }
    })
 

    newuser.save();
    const token = createtokens(newuser)
    console.log(token)
    res.send(`this user saved successfully ${newuser}`);
    
})

app.post('/products' , async(req,res)=>
{
    console.log(req.body)
    const newproduct = new product({
        productname:req?.body?.productname,
        price:req?.body?.price,
        description:req?.body?.description,
        sizes:req?.body?.sizes,
            
        availablestock:req?.body?.availablestock,
        sizestock :req?.body?.sizestock
    })


    newproduct.save();
    //console.log(newproduct)
    res.send(`product added successfully ${newproduct}`)
})

app.get('/searchproducts' , async(req,res)=>{
      const{productname} = req.query;
      if(!productname)
      {
        res.status(250)
        res.send("missing products")
      }

      const availableproduct = await product.find({productname:productname}) 
      res.send(availableproduct)
})


app.get('/login' , async(req,res)=>
{
     const {phone , password} = req.query;
     if(!(phone && password))
     {
        res.status(400)
        return res.send("missing details")
     }
     const existinguser =  await User.findOne({phone:phone})
     if(!existinguser)
     {
        res.status(250)
        return res.send("Please signup")
     }
     if(! await bcrypt.compare(password,existinguser.password))
     {
        return res.send("invalid password")
     }

     return res.send("")



})
console.log(port)

app.listen(port ,()=>
{
    console.log(`listening on port ${port}`)
})