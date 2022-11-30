function websql() {
  const db = openDatabase("mywebdbs", "1.0", "Test DB", 2 * 1024 * 1024);
  return function(sql, params = null) {
    return new Promise((reslove) => {
      db.transaction(function (dbtest) {
        dbtest.executeSql(sql, params, (err, result) => {
          reslove(result.rows);
        });
      });
    });
  };
}
const mysql = websql();
mysql("SELECT * FROM CHART").then((result) => {
  console.log("res", result);
});
mysql("INSERT INTO CHART (id,log) VALUES (7,'hello word7')")
  .then((res) => {
    console.log("11111", res);
  });
