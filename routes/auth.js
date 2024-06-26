const express=require("express");
const bcryptjs=require("bcryptjs");
const User=require("../models/user");
const authRouter=express.Router();
const auth=require("../middlewares/auth");
const jwt =require("jsonwebtoken");



// SIGN UP
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password,address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
      address
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



  // Sign In Route
 // Exercise
 authRouter.post("/api/signin", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "User with this email does not exist!" });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }

      const token = jwt.sign({ id: user._id }, "passwordKey");
      res.json({ token, ...user._doc });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // get user data
 authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/change-adress-screen",auth,async(req,res)=>{
  try{
    const {address}=req.body;
    let user=await User.findById(req.user);
    user.address=address;
    user=await user.save();
   res.json(user);
  }catch(e){
    res.status(500).json({error:e.message});
  }
});






authRouter.post("/change-credentials",auth,async(req,res)=>{
  try{
    const {name,email,address,password}=req.body;
    let user=await User.findById(req.user);
    user.name=name;
    user.address=address;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }
    user.email=email;
    const hashedPassword = await bcryptjs.hash(password, 8);
    user.password=hashedPassword;
    user=await user.save();
    res.json(user);


  }catch(e){
    res.status(500).json({error:e.message});
  }
});

  module.exports=authRouter;
