const bcrypt = require('bcrypt');
bcrypt.hash('', 10).then(hash => {
  console.log(hash);
});

//db.users.insertOne({ userName: "", password: "", displayName: "", credits: , domain: ""});
