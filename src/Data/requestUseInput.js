var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://localhost:5000/api/users',
  headers: { 
    'Content-Type': 'application/json', 
    'auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5lemFkaWRpZXIiLCJuYW1lIjoiRGlkaWVyIiwic3VybmFtZSI6IklHSVJBTkVaQSIsImVtYWlsIjoiaWdpcmFuZXphMDI5QGdtYWlsLmNvbSIsInBob25lIjoiMjUwNzg4MzM1MDE1Iiwib3JnVW5pdCI6IkhqdzcwTG9kdGYyIiwib3JnVW5pdExldmVsIjoiMSIsInBhc3N3b3JkIjoiMUBEaXN0cmljdCIsImlhdCI6MTYwNDQwMTU1NiwiZXhwIjoxNjA0NDA1MTU2fQ.MzYbXX4W3Qn9hv4lNNhq5cUzCsPURgYyRCodbbIyu0o'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.status));
})
.catch(function (error) {
  console.log(error.status);
});
