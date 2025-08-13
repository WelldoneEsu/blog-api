const User = require('../models/User');
const jwt = require('jsonwebtoken');
// generate JWT Token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h'}
  );
};
// @desc   Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if ( !email || !password)
    return res.status(400).json({ message: 'email and password required'
  });
  const userExists = await User.findOne({ name, email });
  if (userExists)
    return res.status(400).json ({ message: 'name and email already taken' });
  const user = await User.create({ name, email, password });
  res.status(201).json({
   _id: user._id,
   name: user.name,
   email: user.email,
   token: createToken(user) 
  });
};


// @dec Login user
  exports.login = async (req, res) => {
    try{
  const { email, password } = req.body;
 
  const user  = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(400).json ({ message: 'Invalid credentials' });

  
  
  res.json({
   _id: user._id,
   name: user.name,
   email: user.email,
   token: createToken(user) 
  })
} catch (err) {
    res.status(500).json({ message: err.message})
}
};