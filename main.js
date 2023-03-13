const express=require('express')
const app=express()
const mongoose=require('mongoose')
var http = require("http");
var url=require('url');
app.use(express.json());
app.use(express.static('public'))

const path=require('path');
app.set('public',path.join(__dirname,'public'))
/* const template_path = path.join(__dirname, 'public'); */
/* app.set('view engine','hbs'); */
app.set('view engine','html');
/* app.set('views',) */


mongoose.connect('mongodb://127.0.0.1:27017/newdb',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
var db=mongoose.connection;
db.on('error',()=>console.log("error to connect"))
db.once('open',()=>console.log("connected"))

//schema

const sch={
    name:String,
    email:String,
    password:String
}
const monmodel=mongoose.model("peoples",sch)
app.use(express.urlencoded({extended:false}))

/* app.get('/',(req,res)=>{
    res.sendFile('/registration.html')
}) */

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'/registration.html'));
});


//post 

  app.post('/peopledata',async(req,res)=>{
    const data=new monmodel({ 
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }) 
    const val=await data.save(); 
    res.send(val);
    /* res.json(val); */
 
   
   
    
  })

  //from frontend
  /* app.post('/peopledata' ,async(req,res)=>{
    console.log(req.body.name)
    res.send(req.body.name)
  }) */


   //get
  app.get('/get/:id',async(req,res)=>{
    try{
      const posts=await monmodel.findById(req.params.id);
      res.status(200).send(posts);
    } catch(error){
      res.status(500).send(error);
    }
  })



//patch
  app.patch('/patch/:id',async(req,res)=>{

    let upname=req.body.name;
    let upmail=req.body.upmail;
    let uppassword=req.body.password;
    try{
      const updates=await monmodel.findByIdAndUpdate(req.params.id,req.body,{new:true})
      if(!updates){
        return res.status(404).send();
      }
      res.status(200).send(updates);
    }catch(error){
      res.status(500).send(error)
    }
  })

//delete

  app.delete('/delete/:id', async (req, res) => {
    try {
        const updates = await monmodel.findByIdAndDelete(req.params.id);
        res.send('deleted')
        if (!updates) {
            return res.status(404).send();
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
})
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname,'/login.html'));
})
app.get('/courses',(req,res)=>{
  res.sendFile(path.join(__dirname,'/courses.html'));
})

app.post('/login',async(req,res)=>{
  
    const name =req.body.name;
  /*   window.sessionStorage.setItem('test', true); */
  const password=req.body.loginpassword;
  try{
    const getname= await monmodel.findOne({name: name})
  /* console.log(getname);
  res.send(getname);  */
  if(getname.password === password){
    
    res.sendFile(path.join(__dirname,'/index.html'));
  }else{
    res.send('password incorrect')
  }
  }catch(err){
    console.log('errorrr',err)
  }

 

  //const getname= await monmodel.findOne({name: name})
  /* console.log(getname);
  res.send(getname);  */
  //if(getname.password === password){
  //  res.sendFile(path.join(__dirname,'/index.html'));
 // }else{
  //  res.send('password incorrect')
  //}

  

})



app.listen(8000,()=>{
    console.log("port 8000")
})
