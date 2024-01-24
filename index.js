//準備資料庫連線
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
const uri = "mongodb+srv://chihpao:Yohotmann04@myman.ml5lzso.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let db=null; //讓db在全域變數
async function run() {
  await client.connect();
  db=await client.db("website-1");
  console.log("Database Ready");
}
run().catch(console.dir);

//準備後端的伺服器
const express=require("express");//載入Express
const app=express();//建立Application 物件
//設定 express-session 做使用者狀態管理
const session = require('express-session');
app.use(session({
    secret: "iam1227",
    resave: false,
    saveUninitialized: true
}))
//設定支援取得POST方法的參數
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
//使用樣板引擎ejs(ex:ejs、pug)↓↓   要額外安裝，因為他沒包在express裡面，npm install ejs
app.set("view engine","ejs");
//處理網站的靜態檔案網址對應↓↓↓
app.use(express.static("public"));
/*
    ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    把後端專案資料夾中的靜態檔案檔名，直接對應到網址上
        專案資料夾/public/windspace.jpg => 主機名稱/windspace.jpg
        專案資料夾/public/index.html => 主機名稱/index.html
        專案資料夾/public/style.css => 主機名稱/style.css
*/
app.post("/signup",async function(req,res){
    let name=req.body.name;
    let email=req.body.email;
    let password=req.body.password;
    //新增到資料庫
    let collection=db.collection("member");
    //在資料庫中尋找是否有重複的email
    let member=await collection.findOne({email:email});
    if(member !== null){
        res.send("Failed:Repeated Email");
    }else{  
        await collection.insertOne({
        name:name, 
        email:email,
        password:password,
        time:Date.now()
    });
    res.send("OK");
    }
});
//使用post方法，處理來自路徑 /signin?password=密碼 的連線
app.post("/signin",async function(req,res){
    let email=req.body.email;
    let password=req.body.password;
    //操作資料庫
    let collection=db.collection("member");
    //檢查使用者email、password有沒有符合
    let member=await collection.findOne({
        $and:[
            {email:email},
            {password:password}
        ]
    });
    if (member !== null){
        req.session.member={
            name:member.name, email:member.email
        };
        res.redirect("/member");
    }else{
        req.session.member=null;
        res.redirect("/");
        }
});
/*
app.get("/member",function(req,res){
    if(req.session.member){
    res.render(
        "member.ejs",
        {name:req.session.member.name}
        );
    }else{
        res.redirect("/");
    }
});
*/
//使用GET方法，處理來自路徑 /square?num=數字 的連線
app.get("/square",function(req,res){
    //取得網址列的參數req,query.參數名稱
    let num=req.query.num;
    let result=num*num;
    res.render("result.ejs", {ans:result});
});
app.get("/member", async function(req, res) {
    if (req.session.member) {
      let collection = db.collection("message");
      let results = await collection.find({}).sort({ time: -1 }); // 添加遺漏的 sort 方法
      let data = await results.toArray();
      res.render("member.ejs", {
        name: req.session.member.name,
        data: data
      });
    } else {
      res.redirect("/");
    }
  });
  

app.get("/signout",function(rea,res){
    req.session.member=null;
    res.redirect("/");
});
app.post("/postMessage", async function(req,res){
    let content=req.body.content;
    let name=req.session.member.name;
    let time=Date.now();
    //放進資料庫
    let collection=db.collection("message");
    await collection.insertOne({
        name:name, content:content, time:time
    });
    res.redirect("/member");
});
//使用GET方法，處理來自路徑/squre/數字 的連線
app.get("/square/:num",function(req,res){
    //取得路徑參數req.params.參數名稱
    let num=req.params.num;
    let result=num*num;
    res.send("Result is:"+ result);
});
//https://tw.search.yahoo.com/search?p=%E9%A2%A8%E5%90%91%E7%A9%BA%E9%96%93&fr=yfp-search-sb
//啟動伺服器在http://127.0.0.1:9000/,路徑?參數名稱=資料&參數名稱=資料&...
app.listen(9000,function(){
    console.log("Server Started");
});