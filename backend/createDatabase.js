const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zahraa18*Z@"
});

conn.connect(err => {
  if (err) {
    console.error(err.message);
    return;
  }

  conn.query("CREATE DATABASE cooperation", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("✅ Database cooperation created");
    }
    conn.end();
  });
});
