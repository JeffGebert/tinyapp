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


function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

}

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
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

   let templateVars = { urls: urlDatabase , username: req.cookies.username};
   console.log(templateVars);
   res.render("urls_index", templateVars);

 });

 app.get("/urls/new", (req, res) => {
   let templateVars = {username: req.cookies.username};
  res.render("urls_new");
});

 app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username};
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
  console.log("hi")
  
  res.cookie("username", req.body.username); 
  res.redirect("/urls");


});

app.post("/logout", (req, res) => {
  console.log("log0ut")
  res.clearCookie("username", req.body.username); 
  res.redirect("/urls");


});


