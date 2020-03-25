const request = require('superagent');

module.exports = (count = 1) => request
  .get(`http://futuramaapi.herokuapp.com/api/quotes/${count}`)
  .then(res => res.body)
  .then(([{ quote }]) => quote);
