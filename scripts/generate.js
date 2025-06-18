const bcrypt = require('bcrypt');
bcrypt.hash('test123', 10).then(hash => {
  console.log(hash);
});

//db.users.insertOne({ userName: "cag1", password: "$2b$10$Os.9ce8C8U1Hh8Fy8JoPg.8J/ICT4Ov8JVD9xZ0UqRtjc.PW7bXga", displayName: "CAG 1", credits: 2000, domain: "test.com", isSuperAdmin: true});
