const User = require('../models/User.js');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const register = async (req, res) => {
  const user = req.body;
  const createdUser = await User.create(user);
  const jwt = createdUser.createJWT();
  res.status(StatusCodes.CREATED).json({
    success: true,
    user: { name: createdUser.name, email: createdUser.email },
    jwt,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePasswords(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new BadRequestError('Invalid credentials');
  }

  const jwt = await user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ success: true, user: { name: user.name }, jwt });
};

module.exports = { register, login };
