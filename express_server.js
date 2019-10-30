const cookieSession = require('cookie-session');
const express = require(`express`);
const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  maxAge: 24 * 60 * 60 * 1000
}));
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const bcrypt = require('bcryptjs');



app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW"}
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
      if (bcrypt.compareSync(password, users[user].password)) {
        return true;
      }
    }
    
  }
  return false;
}

function urlsForUser(id) {
  let userURLS ={};

  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLS[url] = urlDatabase[url];

    }
  };
  return userURLS;

}

function editDeleteAuthenticate(id, key) {
 
  if (urlDatabase[key].userID === id){
    return true;
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

   if (req.session.user_id) {
    let x = urlsForUser(req.session.user_id);
    let templateVars = { urls: x , user: users[req.session.user_id]};
    res.render("urls_index", templateVars);

   } else {
     res.redirect("/login");
   }

 });

 app.get("/urls/new", (req, res) => {
   let templateVars = {user: users[req.session.user_id]};

  res.render("urls_new", templateVars);
});

 app.get("/urls/:shortURL", (req, res) => {
  let x = urlsForUser(req.session.user_id);
  let templateVars = { urls: x, user: users[req.session.user_id]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL =  urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {

  let randomString = generateRandomString();
  urlDatabase[randomString]={"longURL":req.body.longURL,
  "userID":req.session.user_id};
  res.redirect(`/urls/${randomString}`);

});


app.post("/urls/:shortURL/delete", (req, res) => {
  if (editDeleteAuthenticate(req.session.user_id, req.params.shortURL)) {
    delete urlDatabase[req.params.shortURL]; 
    res.redirect("/urls");
  } else {
    res.redirect("/login")
  };
  

});

app.post("/urls/:shortURL/update", (req, res) => {
  if (editDeleteAuthenticate(req.session.user_id, req.params.shortURL)) {
    urlDatabase[req.params.shortURL]=req.body.longURL;
    res.redirect("/urls");
  } else {
    res.redirect("login");
  }
  

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
  
  req.session.user_id = userID;
  res.redirect("/urls");
   
  let templateVars = {user : users[req.session.user_id]};

  }



});

app.get("/login", (req, res) => {



  
  let templateVars = {user : users[req.session.user_id]};

  res.render("login", templateVars);


});



app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect("/urls");


});

app.get("/register", (req, res) => {
  
  let templateVars = {user : users[req.session.user_id]};
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
    let password = bcrypt.hashSync(req.body.password, 10);

    users[userID] = 
    {"id":userID,
   "email": email,
   "password": password};
   
   
   req.session.user_id = userID;

   console.log("before",req.session.user_id)
   res.redirect("/urls");
   
  }
  

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
