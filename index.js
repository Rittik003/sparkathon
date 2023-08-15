const express=require ('express')
const app=express();
const mongoose=require('mongoose');
const db='mongodb://127.0.0.1:27017/satya';
const port=3001;
mongoose.connect(db).then(()=>{
    console.log("connection successful");
}).catch(()=>{
    console.log("sorry some error is there");
})
app.use(express.json());
app.use(require('./router'));
app.use(require('./router2'));

app.listen(port,()=>{
    console.log("server listening to the port",port);
})