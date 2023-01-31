import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "please enter username"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please enter email"],
      validate: [isValidEmail, "please enter valid email"],
    },
    password: {
      type: String,
      unique: true,
      required: [true, "please enter password"],
      minlength: [6, "password length must minlength of 6 character"],
    },
    image: {
      type: String,
      default: "http://localhost:5000/img/userProfile.png",
    },
    bio: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const found = await bcrypt.compare(password, user.password);
    if (found) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("incorrect email");
  }
};

export default mongoose.model("user", UserSchema);
