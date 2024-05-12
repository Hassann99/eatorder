const mongoose=require("mongoose");
const { foodItemSchema } = require("../models/food_item");

const orderSchema= mongoose.Schema({
    foodItems:[
        {
            foodItem:foodItemSchema,
            quantity:{
                type:Number,
                required:true,
            },
        },
    ],

    totalPrice:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    orderAt:{
        type:Number,
        required:true,
    },
    status:{
        type:Number,
        default:0,
    },

});

const Order=mongoose.model('Order',orderSchema);

module.exports=Order;