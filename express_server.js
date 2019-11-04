const {urlDatabase, users} = require("./database");
const {generateRandomString, emailLookup, passwordLookup, urlsForUser, editDeleteAuthenticate} = require("./helper");
const cookieSession = require('cookie-session');
const express = require(`express`);
const app = express();
app.use(cookieSession({
  name: 'session',
  keys:  [
    '7de13381-61b5-47aa-9c74-5ede1ceac390',
    '8dddb6db-4d8d-4571-a836-04fa8d5a9186',
  ],
}));
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const bcrypt = require('bcryptjs');

app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.get("/", (req, res) => {

  if (req.session.user_id) {
    let x = urlsForUser(req.session.user_id);
    let templateVars = { urls: x , user: users[req.session.user_id]};
    res.render("urls_index", templateVars);

  } else {
    res.redirect("/login");
  }

});

app.get("/urls", (req, res) => {

  if (req.session.user_id) {
    let x = urlsForUser(req.session.user_id);
    let templateVars = { urls: x , user: users[req.session.user_id]};
    res.render("urls_index", templateVars);

  } else {
    res.status(400).send('Please login first');

  }

});

app.get("/urls/new", (req, res) => {

  if (req.session.user_id) {
    let x = urlsForUser(req.session.user_id);
    let templateVars = { urls: x , user: users[req.session.user_id]};
    res.render("urls_new", templateVars);

  } else {
    res.redirect("/login");
  }

});

app.get("/urls/:shortURL", (req, res) => {

  if (!req.session.user_id) {
    res.status(400).send('Please login first');

  } else if (editDeleteAuthenticate(req.session.user_id, req.params.shortURL)) {
    let x = urlsForUser(req.session.user_id);
    let templateVars = { urls: x, user: users[req.session.user_id]};
    res.render("urls_show", templateVars);
  } else if (!editDeleteAuthenticate(req.session.user_id, req.params.shortURL)) {
    res.send("URL does not exist or is not owned by the current User");
  } else {
    res.redirect("/login");
  }

});

app.get("/u/:shortURL", (req, res) => {

  if (!req.session.user_id) {
    res.status(400).send('Please login first');
  } else if (editDeleteAuthenticate(req.session.user_id, req.params.shortURL)) {
    let x = urlsForUser(req.session.user_id);
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.status(400).send('URL does not exist');
  }
});

app.post("/urls", (req, res) => {

  let randomString = generateRandomString();
  urlDatabase[randomString] = {"longURL":req.body.longURL,
    "userID":req.session.user_id};
  res.redirect(`/urls/${randomString}`);

});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (editDeleteAuthenticate(req.session.user_id, req.params.shortURL)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
  
});

app.post("/urls/:shortURL/update", (req, res) => {
  if (editDeleteAuthenticate(req.session.user_id, req.params.shortURL)) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
  
});

app.post("/login", (req, res) => {


  if ((req.body.email === "") || (req.body.password === "")) {
    res.status(400).send('Email or Password cannot be empty!!!');
  } else if (!emailLookup(req.body.email, users)) {
    res.status(400).send('Incorrect login credentials');
  } else if (!passwordLookup(req.body.email, req.body.password)) {
    res.status(400).send(`Incorrect login credentials`);
  } else {
    for (user in users) {
      if (users[user].email === req.body.email) {
        userID = users[user].id;
      }
    }
  
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
  req.session.sig = null;
  req.session = null;
  res.redirect("/urls");

});

app.get("/register", (req, res) => {
  if(req.session.user_id) {
    res.redirect("/urls");

  }
  
  let templateVars = {user : users[req.session.user_id]};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {

  if ((req.body.email === "") || (req.body.password === "")) {
    res.status(400).send('Email or Password cannot be empty!!!');
  } else if (emailLookup(req.body.email, users)) {
    res.status(400).send('Email is already used');
  } else {

    let userID = generateRandomString();
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 10);

    users[userID] =
    {"id":userID,
      "email": email,
      "password": password};
      
    req.session.user_id = userID;
    res.redirect("/urls");
   
  }
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
