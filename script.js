'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Najah Saneen',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Sona KS',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Mubashir TP',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Manal V',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const updateUI = function(acc){
        //display movements
        displayMovements(acc.movements)

        //display balance
        calcDisplayBalance(acc)
  
        //dispay summary
        calcDisplaySummary(acc)
}



//Event listeners
let currentAccount;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`; //day/month/year


btnLogin.addEventListener("click",function(e){
  e.preventDefault()
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount);
  if(currentAccount){
    if(currentAccount.pin === Number(inputLoginPin.value)){
      //Display UI and message

      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
      containerApp.style.opacity = 100;

      //clear input fields
      inputLoginUsername.value = inputLoginPin.value = "";
      inputLoginPin.blur()

      //update UI
      updateUI(currentAccount)
      
    }else{
      alert("Incorrect PIN")
    }
  }else{
    alert('User not registered')
  }
})


btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value )

 
  if(receiverAcc){
  if(amount > 0 && amount <= currentAccount.balance && receiverAcc.username !== currentAccount.username){
    }else if(amount <= 0){
      alert('enter amount greater than 0')
    }else if(amount >= currentAccount.balance){
      alert('insufficient balance')
    }else{
      alert('The reciever account cannot be same as transfer account')
    }
  }else{
    alert('invalid user')
  }

  //doing the transfer
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  inputTransferTo.value = inputTransferAmount.value ='';

    //update UI
    updateUI(currentAccount)
})

btnLoan.addEventListener('click',function(e){
  e.preventDefault()
  const amount = Math.floor(inputLoanAmount.value)
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    //add movement
    currentAccount.movements.push(amount)

    //update UI
    updateUI(currentAccount)
  }else if(amount < 0){
    alert('Enter amount greater than 0')
  }else if(currentAccount.movements.some(mov => mov <= amount * 0.1)){
    alert('You are not approved for the loan as the amount is too high')
  }
  inputLoanAmount.value = ''
})

btnClose.addEventListener('click',function(e){
  e.preventDefault()

  
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){

    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    console.log(index);
    //Delete account
    accounts.splice(index,1)

    //Hide UI
    containerApp.style.opacity = 0;
    
  }
  inputCloseUsername.value = inputClosePin.value ='';
  
  
})

let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault()
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted
})



const displayMovements = function(movements , sort = false){
  containerMovements.innerHTML = ''

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements 

  movs.forEach(function(mov,i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov.toFixed(2)}</div>
        </div>
    `

    containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}
// displayMovements(account1.movements)

// const createUsernames = function(accs){
//   const userName = 
// }

// const user = "Najah Saneen"

const createUsernames = function(accs){ 
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  })
}

createUsernames(accounts)

const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov) => acc + mov , 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} ₹`
} 
// calcDisplayBalance(account1.movements)

const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc,mov) => acc + mov,0)
  labelSumIn.textContent = `${incomes.toFixed(2)} ₹`
  const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc,mov) => acc + mov,0)
  labelSumOut.textContent = (`${Math.abs(outcomes).toFixed(2)} ₹`)
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate/100).reduce((acc,int) => acc + int,0)
  labelSumInterest.textContent = `${interest.toFixed(2)} ₹`
} 

// calcDisplaySummary(account1.movements)

labelBalance.addEventListener('click',function(){
  [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
    if(i % 2 ===0) row.style.backgroundColor = "aliceblue"
  })
})







/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////////////////////////////////