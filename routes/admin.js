const express=require("express");
 
const adminRouter=express.Router();
const admin=require("../middlewares/admin");
const { FoodItem } = require("../models/food_item");
const auth=require("../middlewares/auth");
const Order=require("../models/order")

adminRouter.post('/admin/add-food-item',admin,async(req,res)=>{
    try{
        const {name,description,price,quantity,category,imageUrl}=req.body;
        let foodItem=new FoodItem({name,description,price,quantity,category,imageUrl});

        foodItem=await foodItem.save();
        res.json(foodItem);
    }catch(e){
        res.status(500).json({error: e.message});
    }
});

adminRouter.get('/admin/get-all-food-items',admin,async(req,res)=>{
    try{
   let foodItem=await FoodItem.find({});
   res.json(foodItem);
}catch(e){
    res.status(500).json({error:e.message});
}});

adminRouter.get('/user/get-featured-food-items',auth,async(req,res)=>{
    try{
   let foodItem=await FoodItem.find({});
   res.json(foodItem);
}catch(e){
    res.status(500).json({error:e.message});
}});

adminRouter.get("/fetch/admin/orders",admin,async(req,res)=>{
    try{
        let order=await Order.find({});
        res.json(order);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});
adminRouter.post("/change/order/status",admin,async(req,res)=>{
    try{
        const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);    
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

adminRouter.post("/delete-food-item",admin,async(req,res)=>{
    try{
        const {id}=req.body
        let foodItem=await FoodItem.findByIdAndDelete(id);
        res.json(foodItem);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

adminRouter.get("/fetch/admin/orders",admin,async(req,res)=>{
    try{
        let order=await Order.find({});
        res.json(order);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});


module.exports=adminRouter;