const express = require('express')
const app = express()
const bodyParser = require('body-parser'); 
var jwt = require('jsonwebtoken');


app.use(express.json())
const db=require('./database/db')
const User=require('./models/user');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { use } = require('passport');

const auth=async(req,res,next)=>{
    try{
        const token=req.header('authe').replace('Bearer','')
        const decoded=jwt.verify(token,'thishshfkfhg')
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.user=user
        next()

    }catch(e){
        res.send('please auth')
    }
}


app.get('/',auth,async(req,res)=>{
   const user=await User.find({})
    try{
        res.send(user)
    }catch(e){
        res.send(e)
    }
})



app.post('/users',auth,async(req,res)=>{
    const user=new User(req.body)
    
    try{
        
await user.save()
res.send(user)

    }
    catch(e){
res.send(e)

}
})

app.post('/login',async(req,res)=>{
    try{
        const user=await User.findBycredentials(req.body.email,req.body.password)
        const token=await user.generateAuthtoken()
        res.send({user,token})
        
    }catch(e){
        res.send(e)
    }
})

// app.put('/user/:id', async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowsupdate = ["name", "email", "password"];
//   const isvalidoperation = updates.every((update) =>
//     allowsupdate.includes(update)
//   );


//   if (!isvalidoperation) {
//     return res.send({ error: "invalid uapdate" });
//   }
//   try {
//     const user = await User.findOne({
//       _id: req.params.id ,
//     });
//     if (!user) {
//       return res.status(404).send();
//     }
//     updates.forEach((update) => user[upade] = req.body[update]);
//     await user.save();
//     res.send(user);
//   } catch (e) {
//     res.send(e);
//   }
// });

app.post('/user/:id',auth ,async (req, res) => {

    try{
        let user=await User.updateOne({id:req.params.id},req.body)
       
       
        res.send(user)

    }catch(e){
        res.status(500).send()
            }

})



app.delete('/users/:id',auth,async(req,res)=>{
    console.log('ddddddd')

    try{
const user=await User.findByIdAndDelete(req.params.id)
if(!user){
    return res.status(404).send()
}
res.send(user)

    }catch(e){
res.status(500).send()
    }
})


var port = process.env.PORT || 3000;
app.listen(port, function () {
console.log("Server Has Started!");
});



