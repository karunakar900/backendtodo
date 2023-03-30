const express = require('express');
const bodyparser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://karunakar1000:Fajo8SluiFhEFaQP@cluster0.emoarts.mongodb.net/?retryWrites=true&w=majority", {
    UseNewUrlParser: true
}).then(() => {
    console.log("connected to DB")
}).catch((error) => {
    console.log(error)
});


//user schema 
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//routes routes
app.post("/Login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            if (password === user.password) {
                res.send({ message: "login success", user: user });
            } else {
                res.send({ message: "wrong credentials" });
            }
        } else {
            res.send({ message: "user not registered" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.post("/Register", async (req, res) => {

    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            res.send({ message: "user already exists" });
        } else {
            const newUser = new User({ name, email, password });
            await newUser.save();
            res.send({ message: "successfully registered" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


app.listen(5000, () => {
    console.log("started is running at port 5000")
})