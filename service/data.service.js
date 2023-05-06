const jwt = require("jsonwebtoken");

const db = require("./db");

accounts = {
  1000: {
    account_no: 1000,
    name: "Jaseel",
    phone: 9485784939,
    balance: 100000,
    password: "jaseel123",
    transactions: [],
  },
  1001: {
    account_no: 1001,
    name: "Shani",
    phone: 9485744933,
    balance: 100000,
    password: "shani123",
    transactions: [],
  },
  1002: {
    account_no: 1002,
    name: "Sahal",
    phone: 9485784935,
    balance: 100000,
    password: "sahal123",
    transactions: [],
  },
  1003: {
    account_no: 1003,
    name: "Suhail",
    phone: 9485784940,
    balance: 100000,
    password: "suhail123",
    transactions: [],
  },
};

const register = (acno, uname, phone, pswd) => {
  return db.Account.findOne({
    account_no: acno,
  }).then((acc) => {
    console.log(acc);
    if (acc) {
      return {
        status: false,
        message: "account already exist!...please login!",
        statusCode: 404,
      };
    } else {
      let accnt = new db.Account({
        account_no: acno,
        name: uname,
        phone: phone,
        balance: 0,
        password: pswd,
        transactions: [],
      });
      accnt.save();
      return {
        status: true,
        message: "Registration completed",
        statusCode: 201,
      };
    }
  });
};

const login = (acno, pswd) => {
  return db.Account.findOne({
    account_no: acno,
    password: pswd,
  }).then((res) => {
    if (res) {
      currentUser = res.name;
      currentAcno = acno;
      token = jwt.sign(
        //acno of current user
        { currentAcno: acno },
        "secretsuperkey1234"
      );
      return {
        status: true,
        message: "Login successfull",
        statusCode: 200,
        currentUser,
        currentAcno,
        token,
      };
    } else {
      return {
        status: true,
        message: "invalid password or account number",
        statusCode: 400,
      };
    }
  });
};

//----deposite------------------------------------------
const deposit = (acc, password, amount, req) => {
  return db.Account.findOne({
    account_no: acc,
    password: password,
  }).then((res) => {
    if (res) {
      if (res.account_no != req.currentAcno) {
        return {
          status: false,
          message: "account number is not authenticated",
          statusCode: 422,
        };
      } else {
        res.balance += parseInt(amount);
        let details = { Type: "CREDIT", Amount: parseInt(amount),Balance:res.balance };
        res.transactions.push(details);
        res.save();
        console.log(res);
        return {
          status: true,
          message: `Amount deposited to your account balance: ${amount}`,
          statusCode: 200,
        };
      }
    } else {
      return {
        status: false,
        message: "invalidpassword or Account number",
        statusCode: 400,
      };
    }
  });
};

// -----------------------withdrawal-------------------

const withdrawal = (acc, password, amount, req) => {
  return db.Account.findOne({
    account_no: acc,
    password: password,
  }).then((res) => {
    if (res) {
      if (res.account_no != req.currentAcno) {
        return {
          status: false,
          message: "account number is not authenticated",
          statusCode: 422,
        };
      } else {
        if (res.balance < amount) {
          return {
            status: false,
            message: "insufficient balance",
            statusCode: 422,
          };
        } else {
          res.balance -= parseInt(amount);
          let details = {
            Type: "DEBIT",
            "Amount": parseInt(amount),
            "Balance": res.balance,
          };
          res.transactions.push(details);
          res.save();
          // console.log(res);
          return {
            status: true,
            message: `Amount withdrawn from your account balance: ${amount}`,
            statusCode: 200,
          };
        }
      }
    } else {
      return {
        status: false,
        message: "invalid password or account number",
        statusCode: 422,
      };
    }
  }).catch(err=>console.log(err))
};

// ----------------transactions---------------------
const getTransactions = (acc) => {
  return db.Account.findOne({
    account_no: acc,
  }).then((res) => {
    if (res) {
      return {
        status: true,
        message: "success",
        data: res.transactions,
        statusCode: 200,
      };
    } else {
      return {
        status: false,
        message: "invalid account number",
        statusCode: 400,
      };
    }
  });
};

const delAccount=(acno)=>{
  return db.Account.deleteOne({
    account_no:acno
  }).then(res=>{
    if(res){
      return{
        status:true,
        message:"deletion sucess",
        statusCode:200
      }
    }
    return{
      status:false,
      message:"detetion failed",
      statusCode:400
    }
  })
}
module.exports = {
  register,
  login,
  deposit,
  withdrawal,
  getTransactions,
  delAccount
};
