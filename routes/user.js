const express=require("express");
const auth=require("../middlewares/auth");
const {FoodItem}=require("../models/food_item");
const User=require("../models/user");
const userRouter=express.Router();
const Order=require("../models/order");

userRouter.post("/user/add-to-cart",auth,async(req,res)=>{
    try{
      const {id}=req.body;
      let foodItem=await FoodItem.findById(id);
      let user=await User.findById(req.user);

      if(user.cart.length==0){
         await user.cart.push({foodItem,quantity:1});
      }else{
          let isProductFound=false;
          for(let i=0;i<user.cart.length;i++){
           if(user.cart[i].foodItem._id.equals(id)){
          isProductFound=true;
           }
          }
          if(isProductFound){
              let productt=await user.cart.find((producttt)=>producttt.foodItem._id.equals(foodItem._id));
              productt.quantity+=1;
          }else{
              user.cart.push({foodItem,quantity:1});
          }
      }
      user=await user.save();
      res.json(user);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

userRouter.delete("/api/remove-from-cart/:id",auth,async(req,res)=>{
    try{
        const {id} =req.params;
        let product=await FoodItem.findById(id)
        let user=await User.findById(req.user);
        for(let i=0;i<user.cart.length;i++){
            if(user.cart[i].foodItem._id.equals(product._id)){
                if(user.cart[i].quantity==1){
                    user.cart.splice(i,1);
                }else{
                    user.cart[i].quantity-=1;
                }
            }
        }
        user=await user.save();
        res.json(user);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});


userRouter.post("/place-order",auth,async(req,res)=>{
    try{
        const {cart,totalPrice,address}=req.body;
        let foodItems=[];
        for(let i=0;i<cart.length;i++){
            let foodItem=await FoodItem.findById(cart[i].foodItem._id);
            if(foodItem.quantity>=cart[i].quantity){
                foodItem.quantity-=cart[i].quantity;
                foodItems.push({foodItem,quantity:cart[i].quantity});
                await foodItem.save();
            }else{
                res.status(400).json({msg: `${foodItem} is out of stock` });
            }
        }
        let user=await User.findById(req.user);
        user.cart=[];
        user=await user.save();
        let order=new Order({foodItems,totalPrice,address,userId:req.user,orderAt: new Date().getTime(),});
        order=await order.save();
        res.json(order);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

userRouter.get("/fetch-orders",auth,async(req,res)=>{
    try{
        let order=await Order.find({userId:req.user});
        res.json(order);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});


module.exports=userRouter;