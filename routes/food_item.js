const express=require("express");
const auth = require("../middlewares/auth");
const {FoodItem}=require("../models/food_item");
const foodItemRouter=express.Router();

foodItemRouter.get("/get-category-products",auth,async(req,res)=>{
    try{
        let foodItems=await FoodItem.find({category:req.query.category});
        res.json(foodItems);
    }catch(e){
    res.status(500).json({error:e.message});
    }
    
    });

    foodItemRouter.post("/rate-food-item",auth,async(req,res)=>{
        try{
            const {id,rating}=req.body;
        let food_item=await FoodItem.findById(id);
        for(let i=0;i<food_item.ratings.length;i++){
         if(food_item.ratings[i].userId==req.user){
            food_item.ratings.splice(i,1);
            break;
         }
         
        }
        const ratingSchema={
            userId:req.user,
            rating
         };
         food_item.ratings.push(ratingSchema);
         food_item=await food_item.save();
         res.json(food_item);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    });

    foodItemRouter.get("/api/foodItems/search/:name",auth,async(req,res)=>{
        try{
            const foodItems=await FoodItem.find({ name: { $regex:req.params.name,$options:"i"},});
            res.json(foodItems);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    });



module.exports=foodItemRouter;