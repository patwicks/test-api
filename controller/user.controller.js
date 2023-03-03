const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");

const User = require("../model/user.model");
const {
  userRegisterValidator,
  userLoginValidator,
  userUpdateValidator,
} = require("../validators/user.validator");

const expiration = 1 * 24 * 60 * 60;
function createToken(id, secret) {
  return jwt.sign({ id }, secret, { expiresIn: expiration });
}

//Regsiter a user
exports.REGISTER_USER = async (req, res) => {
  try {
    console.log(req.body);
    const { fullname, email, password, roles } = req.body;
    //validate the request
    const { error } = userRegisterValidator(req.body);
    //check if email is existing
    const user = await User.findOne({ email });
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(password, salt);

    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    } else if (user) {
      return res
        .status(400)
        .json({ errorMessage: "Email is already existing!" });
    } else {
      //create new user
      const newUser = new User({
        fullname,
        email,
        password: newPass,
        roles,
      });
      //save user
      const saveNewUser = await newUser.save();

      if (saveNewUser) {
        return res
          .status(200)
          .json({ successMessage: "Successfully registered, login now!" });
      } else {
        return res.status(400).json({ errorMessage: "Failed to register!" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong on registering, try again!",
    });
  }
};

//login a user
exports.LOGIN_USER = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate request
    const { error } = userLoginValidator(req.body);
    //check if email is exist
    const user = await User.findOne({ email });

    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    } else if (!user) {
      return res
        .status(400)
        .json({ errorMessage: "Invalid email or password!" });
    } else {
      //check if password is valid
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res
          .status(400)
          .json({ errorMessage: "Invalid email or password!" });
      } else {
        //assign a token and save it to browser cookies
        const token = createToken(user._id, process.env.TOKEN_SECRET);

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: expiration * 1000,
          secure: true,
          sameSite: "none",
        });

        res.status(200).json({ successMessage: "Successfully login", user });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      errorMessage: "Something went wrong while logging in, try again!",
    });
  }
};

exports.AUTO_LOGIN = async (req, res) => {
  //this functions is not returning any error
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ isLogin: false, user: null });
    } else {
      const { id } = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findById(id);
      return res.status(200).json({ isLogin: true, user });
    }
  } catch (error) {
    return res.status(200).json({ isLogin: false, user: null });
  }
};

exports.UPDATE_USER = async (req, res) => {
  try {
    const { email, fullname, roles } = req.body;
    //validate request data
    const { error } = userUpdateValidator(req.body);
    const user = await User.findById(req.params.id);

    const paramsId = new mongoose.Types.ObjectId(req.params.id);

    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    } else {
      //check email
      const emailExist = await User.findOne({ email });
      if (email === user.email && user._id.toString() !== paramsId.toString()) {
        return res.status(400).json({ errorMessage: "Choose another email!" });
      } else if (emailExist && user._id.toString() !== paramsId.toString()) {
        return res
          .status(400)
          .json({ errorMessage: "Email is already exist!" });
      } else {
        //change the Email
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
          fullname,
          email,
          roles,
        });
        if (updateUser) {
          return res
            .status(200)
            .json({ successMessage: "User details successfully updated!" });
        } else {
          return res
            .status(400)
            .json({ errorMessage: "Failed to update user details!" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ errorMessage: "Something went wrong while updating username!" });
  }
};
