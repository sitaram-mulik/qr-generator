const bcrypt = require('bcrypt');
bcrypt.hash('', 10).then(hash => {
  console.log(hash);
});


//db.users.insertOne({ userName: "cag", password: "test123", displayName: "Test User", limit: 2000, domain: "sitarammulik.tech" });
$2b$10$LQUr.uBAZ5hVB31Ly824kOhu9SXIW0ga7t3XJgFcgwmnV/AZH5fca