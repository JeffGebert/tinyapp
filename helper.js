const {urlDatabase, users} = require("./database");
const bcrypt = require('bcryptjs');


//generates random string for user_id.

function generateRandomString() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

}

// checks for an email in the database.  

function emailLookup(email1, database) {
  for (user in users) {
    if (users[user].email === email1) {
      return true;
    }
    
  }
  return false;
}

//looksup password and matches users password against password in the database.

function passwordLookup(email1, password) {

  for (user in users) {
    if (users[user].email === email1) {
      if (bcrypt.compareSync(password, users[user].password)) {
        return true;
      }
    }
    
  }
  return false;
}


// returns urls for user_id to be displayed on the urls page for current user logged in.

function urlsForUser(id) {
  let userURLS = {};

  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLS[url] = urlDatabase[url];

    }
  }
  
  return userURLS;

}

//checks to see if current user is user who created link in the database.

function editDeleteAuthenticate(id, key) {
  try {
  if (urlDatabase[key].userID === id) {
    return true;
  }
  } catch(err) {
    return false;
  }

  return false;
}



module.exports = {generateRandomString, emailLookup, passwordLookup, urlsForUser, editDeleteAuthenticate};