const jwt = require("jsonwebtoken");

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

const register = (acno, username, phone, password) => {
  if (acno in accounts) {
    return {
      status: false,
      message: "Account already exist!...... please login",
      statusCode: 404,
    };
  } else {
    accounts[acno] = {
      account_no: acno,
      name: username,
      phone: phone,
      balance: 0,
      password: password,
      transactions: [],
    };
    console.log(accounts);
    return {
      status: true,
      message: "Registration completed",
      statusCode: 201,
    };
  }
};

const login = (acno, psw) => {
  if (acno in accounts) {
    console.log(psw)
    console.log(accounts[acno].password)
    if (accounts[acno].password == psw) {
      currentUser = accounts[acno].name;
      currentAcno = acno;
      token = jwt.sign({ currentAcno: acno }, "secretsuperkey1234");
      return {
        status: true,
        message: "Login successfull",
        statusCode: 200,
        currentUser,
        token,
      }
    } 
    else {
      return {
        status: false,
        message: "invalid password",
        statusCode: 400,
      };
    }
  } 
  else {
    return {
      status: false,
      message: "invalid Account number",
      statusCode: 400,
    };
  }
};

//----deposite------------------------------------------

const deposit = (acc, password, amount) => {
  if (acc in accounts) {
    if (accounts[acc].password == password) {
      accounts[acc].balance += parseInt(amount);
      accounts[acc].transactions.push({
        type: "CREDIT",
        Amount: parseInt(amount),
      });

      return {
        status: true,
        message: `Amount deposited to your account balance: ${accounts[acc].balance}`,
        statusCode: 200,
      };
    } else {
      return {
        status: false,
        message: "invalid password",
        statusCode: 400,
      };
    }
  } else {
    return {
      status: false,
      message: "invalid Account number",
      statusCode: 400,
    };
  }
};

const withdrawal = (acc, password, amount) => {
  if (acc in accounts) {
    if (accounts[acc].password == password) {
      if (parseInt(amount) <= accounts[acc].balance) {
        accounts[acc].balance -= parseInt(amount);
        let details = { type: "DEBIT", Amount: parseInt(amount) };
        accounts[acc].transactions.push(details);

        return {
          status: true,
          message: `withdrawal of amount ${amount} is successfull balance:${accounts[acc].balance}`,
          statusCode: 200,
        };
      } else {
        return {
          status: false,
          message: "You Dont Have Enough Funds In Your Account!",
          statusCode: 400,
        };
      }
    } else {
      return {
        status: false,
        message: "password is invalid",
        statusCode: 400,
      };
    }
  } else {
    return {
      status: false,
      message: "Invalid account number",
      statusCode: 400,
    };
  }
};

// ----------------transactions---------------------
const getTransactions = (acc) => {
  if (acc in accounts) {
    return {
      status: true,
      message: "success",
      data: accounts[acc].transactions,
      statusCode: 200,
    };
  } else {
    return {
      status: false,
      message: "invalid account number",
      statusCode: 400,
    };
  }
};

module.exports = {
  register,
  login,
  deposit,
  withdrawal,
  getTransactions,
};
