#  全栈-最简单的列表管理(vue+express+mysql)

#### 这是一个最简单的列表管理

**贴图：**

![1574493557959](C:\Users\fuxiang\AppData\Roaming\Typora\typora-user-images\1574493557959.png)

数据库有一个brands表，结构如下，id要设置为自动递增：

| 名      | 类型    | 长度 | 小数点 | 允许空值 | 主键 |
| ------- | ------- | ---- | ------ | -------- | ---- |
| id      | int     | 10   | 0      |          | 主键 |
| name    | varchar | 100  | 0      |          |      |
| newDate | varchar | 200  | 0      |          |      |

**具体步骤：**

*后端*--主要有两个文件，app.js和router.js。分别负责创建服务器和实现路由功能。app.js为启动文件。

1. 首先安装express创建一个服务器，引入`body-parser`模块并绑定，用来接收post提交的数据；

   ```javascript
   app.use(bodyParser.urlencoded({ extended: false }))    
   app.use(bodyParser.json())
   ```

2. 创建router.js文件，用来绑定路由功能。

   ```javascript
   var router = express.Router()
   ```

3. router.js文件中引入`mysql`模块，操作数据库。

4. 创建连接，连接数据库，这里注意数据库用户名、密码和数据库名一定要对，不要把数据库名写成表名；

   ```javascript
   //创建连接
   var connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '123456',
     database: 'brand'
   });
   //连接数据库
   connection.connect();
   ```

5. 实现路由功能，并通过`res.json`响应json格式数据，实现接口。这里只列举添加数据路由接口。

   ```javascript
   router.get('/getprodlist',function(req, res){  //获取数据
     connection.query('SELECT * FROM brands', function (error, results, fields) {
       if (error) res.json({status:400, message:'获取数据失败'});
       res.json({status:200, message:results});
     });
   })
   router.post('/addproduct', function(req, res){  //添加数据
     sqlStr = 'INSERT INTO brands SET ?'
     connection.query(sqlStr, req.body, function(error){
       if(error) throw error;
       res.json({status:200, message:'保存数据成功'});
     })
   })
   router.get('/delproduct', function(req, res){  //删除数据
     connection.query('DELETE FROM brands WHERE id='+req.query.id, function(error){
       if(error) return res.json({status:400, message:'删除数据失败'});
       res.json({status:200, message:'删除数据成功'});
     })
   })
   ```

6. 解决跨域问题，在app.js中设置。

   ```javascript
   app.all('*', function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
     res.header("X-Powered-By",' 3.2.1')
     res.header("Content-Type", "application/json;charset=utf-8");
     next();
   });
   ```

这样我们的接口就可以使用了。因为我们监听的3000端口。这个时候我们可以访问：localhost:3000/getprodlist

来查看接口数据。可以实现在数据库中添加一些数据，方便测试。

![1574492205681](C:\Users\fuxiang\AppData\Roaming\Typora\typora-user-images\1574492205681.png)

如果可以查看到数据，就说明我们的接口完成了。接下来我们就去可以实现前端功能了。

*前端*--只有index.html一个文件

1. ui界面我们引入bootstrap组件构建。

2. js我们一如vue.js和vue-resource.js,注意引入包的先后顺序。

3. 全局配置数据接口根路径。

   ```javascript
   Vue.http.options.root = "http://localhost:3000/";
   ```

4. 在data里添加一些假数据，查看界面效果，通过v-for把list数据渲染到页面中。key不要忘记设置。

   ```javascript
   <tr v-for="item in search(keywords)" :key="item.id">
           <td>{{ item.id }}</td>
           <td>{{ item.name }}</td>
           <td>{{ item.newDate}}</td>
           <td><a href="#" @click.prevent="del(item.id)">删除</a></td>
   </tr>
   ```

5. getList方法通过get方式调用接口获取数据。

   ```javascript
   getList(){
     this.$http.get("getprodlist").then(result=>{
         if (result.body.status == 200){
            this.list = result.body.message;
         }else{
            alert("数据库连接失败");
         }
     })
   },
   ```

6. add方法，通过post调用接口提交数据。

   ```javascript
   add(){
      var date = new Date();
      this.$http.post("addproduct",{
      name:this.name, 
      newDate:date.toString()
      },
      {emulateJSON:true})
      .then(result=>{
         if (result.body.status == 200){
            this.getList();
            this.name = "";
         }else {
            alert("连接服务器失败");
         }
       })
   },
   ```

7. del(id)方法，通过get方法，传递id参数，调用接口并根据id删除数据。

   ```javascript
   del(id){
      this.$http.get("delproduct?id=" + id).then(result=>{
         if (result.body.status == 200){
             this.getList();
         }else{
             alert("数据库连接失败");
         }
      })
   },
   ```

8. search过滤数据列表，实现搜索列表功能。

   ```javascript
   search(keywords){
      return this.list.filter(ele=>{
              if(ele.name.indexOf(keywords)!=-1||ele.id.toString().indexOf(keywords)!=-1)
                   return true;
      })
   }
   ```