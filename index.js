//importing express fw
const express=require("express")
const jwt=require("jsonwebtoken")
const cors=require("cors")

const dataservice =require("./service/data.service")


//creating server app
const app = express()

app.use(cors({
    origin:" http://localhost:4200"

}))

//to parse json to js
app.use(express.json())

//middleware
const appMiddleware=(req,res,next)=>{
    // console.log(req.headers["x-access-token"])
    try{
        token=(req.headers["x-access-token"])
        res=jwt.verify(token,"secretsuperkey1234")
        req.currentAcno=res.currentAcno
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


// app.get('/',(req,res)=>{
//     res.send("GET request hit")
// })


// resolving requests
//register API
app.post('/register',(req,res)=>{
    const result = dataservice.register(req.body.acno,req.body.uname,req.body.phone,req.body.pswd)
    // if(result.status==true){
    //     res.status(result.statusCode).json(result)
    // }
    // else{
    //     res.status(result.statusCode).json(result)
    // }

    // res.send("succes")
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    }) 
})

//login...............................................
app.post('/login',(req,res)=>{
    const result = dataservice.login(req.body.acno,req.body.pswd)
     // res.status(result.statusCode).json(result)
     result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj);
        
    });
});




//deposite.............................................
app.post('/deposite',appMiddleware,(req,res)=>{
    const result = dataservice.deposit(req.body.acc,req.body.password,req.body.amount,req)
    // res.status(result.statusCode).json(result)
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj);

    });
    
    

    
})



//withdraw......................................
app.post('/withdraw',appMiddleware,(req,res)=>{
    const result = dataservice.withdrawal(req.body.acc,req.body.password,req.body.amount,req);
    // res.status(result.statusCode).json(result)
    result.then((resobj)=>{
        res.status(resobj.statusCode).send(resobj);
    })
})




//--------transactions---------------
app.post('/transaction',(req,res)=>{
    const result = dataservice.getTransactions(req.body.acc)
    // res.status(result.statusCode).json(result)
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    })
})


//account delete 
app.delete('/delacc:acno',appMiddleware,(req,res)=>{
    const result=dataservice.delAccount(req.params.acno)
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    })
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