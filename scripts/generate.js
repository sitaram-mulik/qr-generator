const bcrypt = require('bcrypt');
bcrypt.hash('', 10).then(hash => {
  console.log(hash);
});


db.user.insertOne({ userName: "cag-1", password: "", displayName: "Test User", limit: 1000, domain: "" })