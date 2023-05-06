// import mongosh
const mongoose=require("mongoose")

//connection string 
mongoose.connect("mongodb://localhost:27017/Bank_Server" ,{
useNewUrlparser:true
})

//define model 
 const Account=mongoose.model('Account',{
    account_no:Number,
    name:String,
    phone:Number,
    balance:Number,
    password:String,
    transactions:[]


})
module.exports={
    Account
}