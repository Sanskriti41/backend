import express from "express"
import dotenv from "dotenv"
const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());



//middlewares
//frontend --> middleware(stringify) -->backend(APi)
app.get('/' , (req,res)=>{
    console.log(req.body);
    res.send("xdfxydtf")
})
console.log(port)

app.listen(port ,()=>
{
    console.log(`listening on port ${port}`)
})