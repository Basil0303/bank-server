//importing express fw
const express=require("express")
const jwt=require("jsonwebtoken")
const dataservice =require("./service/data.service")


//creating server app
const app = express()

//to parse json to js
app.use(express.json())

//middleware
const appMiddleware=(req,res,next)=>{
    // console.log(req.headers["x-access-token"])
    try{
        token=(req.headers["x-access-token"])
        res=jwt.verify(token,"secretsuperkey1234")
        console.log(res)
        next()

    }
    catch{
        res.status(400).json({
            staus:false,
            message:"invalid user ...please login",
            statusCode:400
        })

    }
   

    // console.log("middleware is acting")
    // next() 
}


app.get('/',(req,res)=>{
    res.send("GET request hit")
})


// resolving requests
//register API
app.post('/register',(req,res)=>{
    const result = dataservice.register(req.body.acno,req.body.username,req.body.phone,req.body.password)
    if(result.status==true){
        res.status(result.statusCode).json(result)
    }
    else{
        res.status(result.statusCode).json(result)
    }
})

//login...............................................
app.post('/login',appMiddleware,(req,res)=>{
    const result = dataservice.login(req.body.acno,req.body.psw)
    res.status(result.statusCode).json(result)
})




//deposite.............................................
app.post('/deposite',appMiddleware,(req,res)=>{
    const result = dataservice.deposit(req.body.acc,req.body.password,req.body.amount)
    res.status(result.statusCode).json(result)
})



//withdraw......................................
app.post('/withdraw',appMiddleware,(req,res)=>{
    const result = dataservice.withdrawal(req.body.acc,req.body.password,req.body.amount)
    res.status(result.statusCode).json(result)
})


//--------transactions---------------
app.post('/transaction',(req,res)=>{
    const result = dataservice.getTransactions(req.body.acc)
    res.status(result.statusCode).json(result)
})









app.put('/',(req,res)=>{
    res.send("PUT request hit")
})

app.patch('/',(req,res)=>{
    res.send("patch request hit")
})

app.delete('/',(req,res)=>{
    res.send("delete request hit")
})



//configuring port number
app.listen(3000,()=>{
    console.log("server running on port 3000")
})