const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const cors = require("cors");

const app = express();
dotenv.config();

app.use(cors());

app.use(express.json());


const connectDb = async() =>{
    try{    
        const connect = mongoose.connect(process.env.MONGO_URI);
        console.log("server is connected to Db");
    } catch(err){
        console.log("server not connected to db", err.message);
    }
        
}
connectDb();


app.get("/",(req,res)=>{
    res.send("API is running")
});

app.use("/user", userRoutes);




// console.log(process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log("Server is Running..."));

