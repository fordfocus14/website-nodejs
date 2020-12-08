const express = require('express')
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./Website/user.db', function(err){
  if (err) {
    console.error("error:" + err.message);
  }
  console.log('Connected to the  users database.');
});

db.run('CREATE TABLE IF NOT EXISTS user(id integer NULL PRIMARY KEY, name text, email text, password text)', function(err){
  if(err){
    console.log("error" + err.message)
  }
  console.log(`Rows inserted into : + ${this.lastID}`)
})

function insert(id, name, email, pass){
  db.run(`INSERT INTO user VALUES(?,?, ?,?)`, [id, name, email, pass], function(err){
    if (err){
      console.log(err.message)
    }
  })
}

function display(){
  db.all(`SELECT * FROM user`, [], function(err, rows){
    if (err){
      console.log(err.message)
    }
    rows.forEach((row) => {
      console.log(row.name + "|" + row.email + "|" + row.password )
    })
  })
}


function closedb(){
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}




const app = express()
const bodyParser = require('body-parser')
app.set('view engine', 'ejs')

app.use('/assets', express.static('assets'))
app.use('/images', express.static('images'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

let users = []
let passws = []
let user = "Guest"

app.get('/SignUp', function(req, res){
  res.render('account', {user : user, error: ""})
})
app.get('/login', function(req,res){
  res.render('login', {user: user, error: ''})
})


app.post('/login', function(req, res){
  console.log(req.body)
  user = req.body.username
  pass = req.body.password
  for (var i= 0; i < users.length; i++){
    if(users[i] == user && passws[i]== pass){
      clothes = ['3.jpeg', '2.jpeg', '4.jpeg', '9.jpeg']
      shoes = ['1.jpeg', '2.jpeg', '4.jpeg', '8.jpeg']
      bags = ['1.jpeg', '2.jpeg', '7.jpeg', '6.jpeg']
      products= ['Clothes', 'Shoes', 'Bags']
      res.render('products', {products: products, clothes: clothes, shoes: shoes, bags:bags, user:user})
    }
  }
  res.render('login', {user:"Guest", error: "User not found!!" })

})


app.get('/contact', function(req, res){
  res.render('contact', {user: user})
})


app.get('/user/:logout', function(req, res){
  clothes = ['3.jpeg', '2.jpeg', '4.jpeg', '9.jpeg']
  shoes = ['1.jpeg', '2.jpeg', '4.jpeg', '8.jpeg']
  bags = ['1.jpeg', '2.jpeg', '7.jpeg', '6.jpeg']
  products= ['Clothes', 'Shoes', 'Bags']
  if(req.params.logout == "logout"){
    user= "Guest"
  }
  res.render('products', {products: products, clothes: clothes, shoes: shoes, bags:bags, user:user})
})

app.get('/', function(req, res){
  clothes = ['3.jpeg', '2.jpeg', '4.jpeg', '9.jpeg']
  shoes = ['1.jpeg', '2.jpeg', '4.jpeg', '8.jpeg']
  bags = ['1.jpeg', '2.jpeg', '7.jpeg', '6.jpeg']
  products= ['Clothes', 'Shoes', 'Bags']
  res.render('products', {products: products, clothes: clothes, shoes: shoes, bags:bags, user:user})
})

app.get('/checkout', function(req, res){
  console.log(req.query.search)
  console.log()
  clothes = []
  shoes = []
  bags = []

  value = ""

      if (req.query.search == "hoodie"){
        clothes = ["1.jpeg"]
      }else if(req.query.search == undefined){

        for(var i =1; i<=9; i++){
          clothes.push(i + ".jpeg")
          shoes.push(i + ".jpeg")
          bags.push(i + ".jpeg")
      }
    }else if(req.query.search == "bags"){
      for(var i =1; i<=9; i++){
        bags.push(i + ".jpeg")
      }
    }else if(req.query.search == "clothes" || req.query.search == "cloth" || req.query.search == "dress"){
        for(var i =1; i<=9; i++){
          clothes.push(i + ".jpeg")
        }
      }else if(req.query.search == "shoes"){
        for(var i =1; i<=9; i++){
          shoes.push(i + ".jpeg")
        }
      }else if(req.query.search == "nike"){
            shoes =   ["2.jpeg"]
          }else if(req.query.search == "valentino"){
                bags =   ["1.jpeg"]
          }else{
        value = "ITEM SEARCH NOT FOUND!!!"
      }
  res.render('checkout', {clothes: clothes, shoes: shoes, bags:bags, value: value, user: user})
})

app.get('/shipping', function(req, res){
  res.render('shipping', {user: user})
})

app.post('/shipping/activation_payments', function(req, res){
  console.log(req.body)
  information =  req.body
  res.render('processing', {information: information, user: user})
})

app.post('/shipping/activation_payments/approved', function(req, res){
  information ="Your Information has been Processed!!"
  res.render('processed', {information: information, user: user})
})

app.post('/contact/information/success', function(req, res){
  console.log(req.body.message)
  information = "Your message has been noted for processing"
  res.render('processed', {information: information, user: user})
})


let inc = 0;

app.post('/user/account_processing', function(req, res){
  console.log(req.body)
  username = req.body.username
  password = req.body.password
  email = req.body.email
  users.push(username)
  passws.push(password[0])

  if(password[0] == password[1]){
      res.render('account_processing',{user: user})
  }else{
    error = "Passwords don't much"
    res.render('account', {error: error})
  }
})


app.listen(3000);
console.log("listening started")
