const bcrypt = require('bcrypt');
bcrypt.hash('', 10).then(hash => {
  console.log(hash);
});

//db.users.insertOne({ userName: "cag1", password: "", displayName: "CAG 1", credits: 2000, domain: "test.com", isSuperAdmin: true});
