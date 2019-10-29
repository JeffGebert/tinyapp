const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

}

function emailLookup(email1) {
  for (user in users) {
    if (users[user].email === email1){
    return true;
    }
    
  }
  return false;
}

function passwordLookup(email1,password) {

  for (user in users) {
    if (users[user].email === email1) {
      if (users[user].password === password) {
        return true;
      }
    }
    
  }
  return false;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

 app.get("/urls", (req, res) => {

   let templateVars = { urls: urlDatabase , user: users[req.cookies.user_id]};
   res.render("urls_index", templateVars);

 });

 app.get("/urls/new", (req, res) => {
   let templateVars = {user: users[req.cookies.user_id]};

  res.render("urls_new", templateVars);
});

 app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies.user_id]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  longURL =  urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {

  let randomString = generateRandomString();
  urlDatabase[randomString]=req.body.longURL;
  res.redirect(`/urls/${randomString}`);

});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]; 
  res.redirect("/urls");
  

});

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL]=req.body.longURL;
  res.redirect("/urls");
  

});

app.post("/login", (req, res) => {


  if((req.body.email === "") || (req.body.password ==="" )) {
    res.status(400).send('Email or Password cannot be empty!!!')
  } else if (!emailLookup(req.body.email)) {
    res.status(400).send('Incorrect login credentials')
  } else if (!passwordLookup(req.body.email, req.body.password)) {
    res.status(400).send(`Incorrect login credentials`)
  } else {

  for (user in users) {
    if (users[user].email === req.body.email) {
      userID = users[user].id
      };
  };
  
  
  res.cookie("user_id", userID);
  res.redirect("/urls");
   


  let templateVars = {user : users[req.cookies.user_id]};
  res.cookie(username, users[req.cookies.user_id]); 
  res.redirect("/urls");
  }



});

app.get("/login", (req, res) => {



  
  let templateVars = {user : users[req.cookies.user_id]};

  res.render("login", templateVars);


});



app.post("/logout", (req, res) => {

  res.clearCookie("user_id", req.cookies.user_id); 
  res.redirect("/urls");


});

app.get("/register", (req, res) => {
  
  let templateVars = {user : users[req.cookies.user_id]};
  res.render("register", templateVars);
})

app.post("/register", (req, res) => {

  if((req.body.email === "") || (req.body.password ==="" )) {
    res.status(400).send('Email or Password cannot be empty!!!')
  } else if (emailLookup(req.body.email)) {
    res.status(400).send('Email is already used')
  } else {

    let userID = generateRandomString();
    let email = req.body.email;
    let password = req.body.password;

   
    users[userID] = 
    {"id":userID,
   "email": email,
   "password": password};
   
   
   res.cookie("user_id", userID);
   res.redirect("/urls");
   
  }
  

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
