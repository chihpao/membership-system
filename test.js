const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://chihpao:Yohotmann04@myman.ml5lzso.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // 資料庫基本的操作
    // 選擇要操作的資料庫 client.db("資料庫名稱");
    let db=client.db("website");
    // 選擇想要操作的集合 db.collection("集合的名稱");
    let collection=db.collection("user");
    // 做CRUD 資料的操作:Creat、Read、Update、Delet
    // 新增一筆會員資料
    /*
    let result=await collection.insertOne({
        name:"ply", email:"ply@ply.com",password:"ply", level:3
    });
    console.log(result);
    */
   //新增多筆資料
   /*
   let result=await collection.insertMany([
    {name:"aaa", email:"siesj@aaa.com", password:"aaa",level:1},
    {name:"bbb", email:"siesj@bbb.com", password:"bbb",level:2},
    {name:"ccc", email:"siesj@www.com", password:"www",level:3},
    {name:"ddd", email:"siesj@eee.com", password:"eee",level:4},
   ]);
   console.log(result);
   */
   //更新一筆資料 collection.updateOne(篩選條件,更新的資料);
   /*
   let result=await collection.updateOne({
        email:"siesj@www.com"
   },{
        $set:{
            name:"哈哈哈"
        }
   });
   console.log(result)
   */
  //更新多筆資料    collection.updateMany(篩選條件,更新的資料);
  /*
  let result=await collection.updateMany({
        level:3
  },{
    $set:{
        level:200
    }
  });
  console.log(result)
  */
 //刪除資料 collection.deletOne(篩選條件); collection.deletMmany(篩選條件)
 /*
  let result=await collection.deleteOne({
    level:200
  });
  console.log(result)
  */
 //取得一筆資料 collection.findOne(篩選條件);
 //(等於)$eq, (大於)$gt, (大於且等於)$gte, (小於)$lt, 小於且等於($lte
 //$and, $or
 /*
 let result=await collection.findOne({
    $and:[
        {email:"siesj@eee.com"},
        {password:"eee"}
    ]
 });
 console.log(result);
 */
//取得多筆資料 find
 let pageSize=10;
 let page=3;
 let result=await collection.find({
    level:{
        $gte:1
    }
    }).sort({
    level:-1 //1:正向, -1:反向
 }).limit(3).skip(2);
 let date=await result.toArray();
 console.log(date);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
