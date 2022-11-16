const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');

//import User Model and Exercise Model from /myApp.js
const User = require("./myApp.js").UserModel;
const Exercise = require("./myApp.js").ExerciseModel;

app.use(cors())
//app.use(express.static('public'))
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/', (req, res) => {
  //res.send('Hello from the server!')
  //res.sendFile(__dirname + '/views/index.html')
  console.log(path.resolve(__dirname, '../client/build', 'index.html'));
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

let bodyParser = require('body-parser');
//mount body-parser
app.use(bodyParser.urlencoded({extended: false}));

//import createNewUser from /myApp.js
//const createNewUser = require("./myApp.js").createNewUser;
app.post('/api/users',(req,res)=>{
  console.log("post:"+req.body.username);
  User.init().then(function() {
    let newuser = new User({username: req.body.username});
    newuser.save(function(err, data) {
      if(err) res.json("There was an error saving this user! Username taken!");
      else res.json(data)
    });
  }); 
});

//const addExercise = require("./myApp.js").addExercise;
app.post('/api/users/:id/exercises',(req,res)=>{  
  console.log('post req.body');
  //console.log(req.body);
  console.log(JSON.stringify(req.body));
  console.log("POST /api/users/:_id/exercises: "+req.params.id);
  const userId = req.params.id;
  const {description,duration,date} = req.body;

  let dateToSet = date;
  if (date===""||date==null) dateToSet = new Date().toGMTString();
  else dateToSet = new Date(date);
  
  User.findById(userId,function(err,userData){
    if(err||!userData) {
      res.json("Couldn't find the user!")
      }else{
      const newExercise = new Exercise({userId:userId,
                                        description,
                                        duration,
                                        date:dateToSet});
      newExercise.save((err,data)=>{
        if(err) res.json("There was an error saving this exercise!");
        else res.json({_id:userId,
                      username:userData.username,
                      description:data.description,
                      duration:data.duration,
                      date:data.date.toDateString()});  
      })
      }
  })
})

app.get('/api/users',(req,res)=>{
  console.log("get/api/users");
  User.find({},(err,data)=>{
    if(err) res.json(err);
    else res.json(data);
  })
})
  
app.get('/api/users/:_id/logs',(req,res)=>{
  console.log("GET /api/users/:_id/logs: "+JSON.stringify(req.query));
  console.log("/api/users/:_id/logs:"+req.params._id);
  const userId = req.params._id;
  const {from,to,limit} = req.query;
  
  User.findById(userId,(err,data)=>{
    if (err) res.json("Couldn't find this user!");
    else  {
      //console.log(JSON.stringify(data));  
      let dateObj = {}
      if(from) dateObj.$gte = new Date(from);
      if(to) dateObj.$lte = new Date(to);
      let filter = {userId:userId};
      if(from||to) filter.date = dateObj;

      //The nullish coalescing operator (??) is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
      let nonNullLimit = limit ?? 500;
      console.log('filter:');
      console.log(filter);
      
      Exercise.find(filter).limit(nonNullLimit).exec((err,exerciseData)=>{
        if(err||!data) res.json({});
        
        //console.log(JSON.stringify(exerciseData));      
        const log = exerciseData.map((l)=>({
          description:l.description,
          duration:l.duration,
          date:l.date.toDateString()}));//
        
        console.log(log);
        
        res.json({_id:data._id,
                  username:data.username,
                  count:exerciseData.length,
                  log:log}); 
      })  
     }
  })
})

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
