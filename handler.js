const fs = require('fs');
 
module.exports = {
  main: async function (event, _) {
    const data = fs.readFileSync('./recordings.json',
            {encoding:'utf8', flag:'r'});
    return data
  }
}
