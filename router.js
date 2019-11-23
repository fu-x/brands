//引入mysql包
var mysql = require('mysql');
var express = require('express')

var router = express.Router()
//创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'brand'
});
//连接数据库
connection.connect();

router.get('/getprodlist',function(req, res){
  connection.query('SELECT * FROM brands', function (error, results, fields) {
    if (error) res.json({status:400, message:'获取数据失败'});
    res.json({status:200, message:results});
  });
})

router.post('/addproduct', function(req, res){
  sqlStr = 'INSERT INTO brands SET ?'
  connection.query(sqlStr, req.body, function(error){
    if(error) throw error;
    res.json({status:200, message:'保存数据成功'});
  })
})

router.get('/delproduct', function(req, res){
  connection.query('DELETE FROM brands WHERE id='+req.query.id, function(error){
    if(error) return res.json({status:400, message:'删除数据失败'});
    res.json({status:200, message:'删除数据成功'});
  })
})

module.exports = router;
