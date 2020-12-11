var axios = require('axios');
let loggedIn = false;
UseAuth();
export default function UseAuth(username, password) {
  var data = JSON.stringify({ "username": username, "password": password });
  var config = {
    method: 'post',
    url: 'https://dev.hisprwanda.org/vmis/api/auth',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };
  if (localStorage.getItem('vmis')) {
    console.log(username + " ok " + password)
    axios(config)
      .then(function (response) {
        localStorage.removeItem('vmisJwt');
        console.log(JSON.stringify(response.data.token))
        localStorage.setItem('vmisJwt', response.data.token);
        loggedIn = true;
        console.log(1)
      })
      .catch(function (error) {
        loggedIn = false;
        console.log(error);
      });
      console.log(2)
    return loggedIn;
  }
  else {
    //localStorage.removeItem('vmisJwt');
    //loggedIn = false;
    return loggedIn;
  }
}