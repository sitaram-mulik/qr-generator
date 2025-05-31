const bcrypt = require('bcrypt');
bcrypt.hash('', 10).then(hash => {
  console.log(hash);
});


//db.users.insertOne({ userName: "cag-1", password: "test123", displayName: "Test User", limit: 1000, domain: "" });