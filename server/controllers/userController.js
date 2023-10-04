const User = require('../model/User');
const bcrypt = require('bcrypt');

//register endpoint
module.exports.register = async (req, res) => {
    try{
         const { username, email, password } = req.body;
         const usernameCheck = await User.findOne({username});
         if(usernameCheck){
            return res.status(409).json({ message: "username already exist, please select different username.", status: false})
         }
         const emailCheck = await User.findOne({email});
         if(emailCheck){
            return res.status(409).json({ message: "email already used, please user a different email.", status: false})
         }
         const hashedPassword = await bcrypt.hash(password, 10);
         const user = await User.create({
            email,
            username,
            password: hashedPassword,
         });
         delete user.password; 
         return res.status(201).json({message: "Registered successfully", user,  status: true})
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

//login endpoint
module.exports.login = async (req, res) => {
   try{
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if(!user){
           return res.status(404).json({ message: "Incorrect username or password", status: false});
        }
        
        //checking password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
         return res.status(404).json({ message: "Incorrect username or password", status: false});
        }

        delete user.password;
        return res.status(200).json({message: "Login successfully", user,  status: true})

   }catch(err){
       console.log(err);
       return res.status(500).json({message: "Internal server error"});
   }
}

//set avatar for user
module.exports.setAvatar = async (req, res) => {
   try{
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(userId, {
         isAvatarImageSet: true,
         avatarImage,
      });
      return res.json({isSet: userData.isAvatarImageSet, image: userData.avatarImage});
   }catch(err){
      console.log(err);
      return res.status(500).json({message: "Internal server error"});
   }
}

//all users
module.exports.allUsers = async (req, res) => {
   try{
      const users = await User.find({_id : {$ne: req.params.id}}).select([
         "email",
         "username",
         "avatarImage",
         "_id",
      ]);

      return res.json(users);
   }catch(err){
      console.log(err);
      return res.status(500).json({message: "Internal server error"});
   }
}