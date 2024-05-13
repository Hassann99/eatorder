const express=require("express");
const mongoose  = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter=require("./routes/user");
const adminRouter = require("./routes/admin");
const foodItemRouter = require("./routes/food_item");
const morgan = require("morgan");



//init
const app=express();
const PORT= process.env.PORT || 3000;
const DB="mongodb+srv://rshab1393:tvaws8dy5SJNh8sn@eatorder.cptnooq.mongodb.net/";
 const cors = require('cors');
//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(adminRouter);
app.use(foodItemRouter)
app.use(cors())

//connections
//mongoose.connect(DB).then(()=>{console.log("connection successful")}).catch((e)=>{console.log(e)});
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName:"eatorder"
}).then(()=>{
    console.log('MongoDB connected')
}).catch((err)=>{
    console.log(err)
});
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`connected at port ${PORT}`);
})

app.get('/',(req,res)=>{
    res.send("hello world")
})


