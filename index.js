// 載入 Express
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
//使用post方法，處理來自路徑 /verify?password=密碼 的連線
app.post("/verify",function(req,res){
    //取得POST方法傳遞進來的參數req.body.參數名稱
    let password=req.body.password;
    if(password==="test"){
        req.session.isLogin=true;
        res.redirect("/member");
    }else{
        req.session.isLogin=false;
        res.redirect("/");
    }
});
    
app.get("/member",function(req,res){
    if(req.session.isLogin){
    res.render("member.ejs");
    }else{
        res.redirect("/");
    }
});
//使用GET方法，處理來自路徑 /square?num=數字 的連線
app.get("/square",function(req,res){
    //取得網址列的參數req,query.參數名稱
    let num=req.query.num;
    let result=num*num;
    res.render("result.ejs", {ans:result});
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