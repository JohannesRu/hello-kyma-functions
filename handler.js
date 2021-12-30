const fs = require('fs');
 
module.exports = {
  main: async function (event, _) {
   fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});
    //const data = fs.readFileSync('./recordings.json', {encoding:'utf8', flag:'r'});
    return "hi"
  }
}
