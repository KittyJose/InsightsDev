const DBConnect = require("./src/connect");
const core = require('@actions/core');
const github = require('@actions/github');

module.exports = (json) => {
    let config = {server : "https://127.0.0.1:6363", key : password, user: "admin", db:"Doc"}
    DBConnect(config, json)

    //return `url: ${url}, password: ${password}, json: ${json}`;
}


/*

try {
  // `who-to-greet` input defined in action metadata file
  const jsonInp = core.getInput('json');
  console.log(`recieved this from abother repo action ${jsonInp}!`);

  let config = {server : "https://127.0.0.1:6363", key : "root", user: "admin", db:"Doc"}
  DBConnect(config, jsonInp.event)

} catch (error) {
  core.setFailed(error.message);
}*/
