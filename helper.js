const {urlDatabase, users} = require("./database");
const bcrypt = require('bcryptjs');

function generateRandomString() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

}

function emailLookup(email1, database) {
  for (user in users) {
    if (users[user].email === email1) {
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
  let userURLS = {};

  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLS[url] = urlDatabase[url];

    }
  };
  return userURLS;

}

function editDeleteAuthenticate(id, key) {
 
  if (urlDatabase[key].userID === id) {
    return true;
  }
  return false;
}


module.exports = {generateRandomString, emailLookup, passwordLookup, urlsForUser, editDeleteAuthenticate};