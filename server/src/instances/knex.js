const { currentEnv: config } = require("../config/db");
console.log(config);
const knex = require('knex')(config);

module.exports = knex;
