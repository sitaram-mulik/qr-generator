const bcrypt = require('bcrypt');
bcrypt.hash('KadamSuhas123', 10).then(hash => {
  console.log(hash);
});
