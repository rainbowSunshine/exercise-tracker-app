require('dotenv').config({path:'./server/.env'});
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true,autoIndex: true });

let exerciseSchema = new mongoose.Schema({
  userId:{type: String, required:true},
  description: {
    type: String,
    default:'test'
  },
  duration:{
    type: Number,
    default: 60
  },
  date:{
    type:Date,
    default:"Mon Jan 01 1990",
  }
});

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
    default:'fcc_test'
  }
});

const User = mongoose.model('User',userSchema);
const Exercise = mongoose.model('Exercise',exerciseSchema)

const createNewUser = (userName,done) => {
  User.init().then(function() {
    let newuser = new User({username: userName});
    newuser.save(function(err, data) {
      if(err) err = "There was an error saving this user! Username taken!";
      done(err,data);
    });
  }); 
};

const addExercise = (inputObj,done)=>{
  console.log(JSON.stringify(inputObj));
  const {description,duration,date,_id} = inputObj;

  let dateToSet = date;
  if (date===""||date==null) dateToSet = new Date();
  else dateToSet = new Date(date);
  
  User.findById(_id,function(err,userData){
    if(err||!userData) {
      //err = "Couldn't find the user!";
      done(err);
      }else{
      const newExercise = new Exercise({userId:_id,
                                        description,
                                        duration,
                                        date:dateToSet});
      newExercise.save((err,data)=>{
        //if(err) err = "There was an error saving this exercise!";
        done(err,data);
      })
      }
  })
}

//exports
exports.UserModel = User;
exports.ExerciseModel = Exercise;
exports.createNewUser = createNewUser;
exports.addExercise = addExercise;