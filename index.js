const express = require('express');
const app = express();
app.use(express.json())
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId
const port = 3000;
const url = 'mongodb+srv://amit_singh:kya_hal_hai_tere@cluster0.jpqo2bq.mongodb.net/INDEXMONGO';
// const dbname = 'items';
const userSchena=new mongoose.Schema({
    name:{
        type:String,
    },
    Land_name:{
        type:String
    }
})
let user = mongoose.model("users",userSchena)
mongoose.connect(url).then(()=>{
    console.log("mongodb is connected");
}).catch((err)=>{
    console.log(`err message ${err.message}`)
})
app.post('/createitem', async function(req,res){
    const collection =await user.create(req.body)
    return res.status(200).send({data:collection})
});
app.get('/getdata',async function(req,res){
    const getdata = await user.find();
    let findcount = getdata.length
     return res.status(201).send({count:findcount,data:getdata})
});
app.get('/getdata/:id',async function(req,res){
    let data = req.params;
    if(!data){
        return res.status(401).status({msg:"please provide params"})
    }
    const objectitem = new objectId(data)
    const finddatabyid = await user.findById(objectitem );
    if(!finddatabyid){
        return res.status(401).status({msg:"this id is not present"})
    }
    return res.status(201).send({msg:"found",data:finddatabyid})
})
app.put('/updatedata/:id',async function(req,res){
    let id = req.params;
    const updatedata = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ msg: "Invalid ObjectId format" });
      }
      const objectId = new mongoose.Types.ObjectId(id);
    const changedata = await user.findByIdAndUpdate(objectId,updatedata,{new:true});
    if(!changedata){
        return res.status(401).send({msg:"this id is not present"})
    }
    return res.status(201).send({msg:"update data",data:changedata})
})
app.delete('/deletedata/:id', async function(req,res){
    const id = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ msg: "Invalid ObjectId format" });
      }
    const objectId = new mongoose.Types.ObjectId(id)
    const findid = await user.findById(objectId)
    if(!findid){
        return res.status(400).send({ msg: "this id is not present" });
    }
    const deletedata = await user.deleteOne({_id:objectId})
    if(!deletedata){
        return res.status(401).send({msg:"this id is not present"})
    };
    return res.status(201).send({msg:"delete data",data:deletedata})
})
app.listen(port,()=>{
    console.log(`my app is running on ${port}`)
})