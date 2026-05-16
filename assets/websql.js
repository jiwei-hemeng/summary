function websql(sql, params = null) {
  return new Promise((reslove) => {
    const db = openDatabase("mywebdbs", "1.0", "Test DB", 2 * 1024 * 1024);
    db.transaction(function (dbtest) {
      dbtest.executeSql(sql, params, (err, result) => {
        reslove(result.rows);
      });
    });
  });
}
websql("SELECT * FROM CHART").then((result) => {
  console.log("res", result);
});
websql("INSERT INTO CHART (id,log) VALUES (7,'hello word7')").then(
  (res) => {
    console.log("11111", res);
  }
);
