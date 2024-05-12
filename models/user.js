const mongoose=require("mongoose");
const  {foodItemSchema}  = require("../models/food_item");
const userSchema=mongoose.Schema({
name:  
{
    required:true,
    type:String,
    trim: true
   },

email: 
{
    required:true,
    type:String,
    trim:true,
    validate:(value)=>{
        const re =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return value.match(re);
    },
    message:"please enter a valid email address",
    

},
password:{
    required:true,
    type:String,
    
},
address:{
    type:String,
    default:''
},
type:{
    type:String,
    default:"user"
},
cart:[{
    foodItem:foodItemSchema,
    quantity:{
        type:Number,
        required:true
    }
}]
});

const User=mongoose.model("User",userSchema);

module.exports=User;