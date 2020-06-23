const axios = require('axios');

function hashPassword(password,success,fail){
    
axios.post('https://haval-hash.herokuapp.com/', {
    "raw":password
  })
  .then(async function (response) {
    //console.log(response.data);
    let hash = await response.data;
    success(hash);
  })
  .catch(function (error) {
    fail(error);
  });
}

module.exports = {
    hashPassword
}