const express = require("express");
const UserModel = require("../models/userModel")
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../Config/generateToken");

const loginController = expressAsyncHandler(async (req,res) => {
    const {name, password} = req.body;
    const user = await UserModel.findOne({name});

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
        res.json(res);
    }else{
        res.status(401);
        throw new Error("Invalid UserName or Passeword");
    }
});


const registerController = expressAsyncHandler(async (req,res) => {
    const {name, email, password} = req.body;
    // console.log(name, email, password);
    // check for all fields
    if(!name || !email || !password){
        res.status(400);
        throw Error("All Necessary input fields not being filled");
    }

    // pre-existing user
    const userExist = await UserModel.findOne({email});
    if(userExist){
        throw new Error("User already Exist");
    }

    //userName already Taken
    const userNameExist = await UserModel.findOne({name});
    if(userNameExist){
        throw new Error("UserName already Exist");
    }

    // create an entry in the db
    const user = await UserModel.create({ name, email, password });

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    }
    else{
        res.status(400);
        throw new Error("Registration Error");
    }

});

module.exports = {loginController, registerController};