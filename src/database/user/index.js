import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },  // Not required becoz if we use goole to signup/signin, password is not required
    address: [{ details: { type: String }, for: { type: String } }],
    phoneNumber: [{ type: Number }],
  },
  {
    timestamps: true,
  }
);

// Method 1
UserSchema.methods.generateJwtToken = function () {             // Making new method (for APIs) (eg. Auth) It will be used at multiole places that is why we mak it here. We can now use it anywhere in this project
  return jwt.sign({ user: this._id.toString() }, "ZomatoAPP");  // ZomatoAPP = Secret Key for making tokens. | this._id => id of 'this' user
};

// Statics
UserSchema.statics.findByEmailAndPhone = async ({ email, phoneNumber }) => {  // for signup
  // check wether email, phoneNumber exists in out database or not
  const checkUserByEmail = await UserModel.findOne({ email });
  const checkUserByPhone = await UserModel.findOne({ phoneNumber });

  if (checkUserByEmail || checkUserByPhone) {
    throw new Error("User already exists!");
  }

  return false;
};

UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {  // for signin
  //check wether email exists
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User does nor exist!");

  // compare password
  const doesPasswordMatch = await bcrypt.compare(password, user.password);  // boolean
  if (!doesPasswordMatch) throw new Error("invalid password!");

  return user;
};

// In statics, we cannot use 'this', we have to target data specifically. ; whereas, in methods we can.

// Hashing the password
UserSchema.pre("save", function (next) {  //  pre => inbetween the process  =>  before saving, perform this function()  |  next = when we are done using this process, move to the next process (next functions)
  const user = this;  // Storing all the data in user.

  //password is modified
  if (!user.isModified("password")) return next(); // If password is empty, move to the next step. 

  // If password is not empty, 
  //generate bcrypt salt
  bcrypt.genSalt(8, (error, salt) => {
    if (error) return next(error);

    // hash the password
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);

      //assign hashed password
      user.password = hash;
      return next();  // Process complete. Next step -> Save data to DB.
    });
  });
});

export const UserModel = mongoose.model("Users", UserSchema);