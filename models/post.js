import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please enter title"],
      unique: true,
    },
    body: {
      type: String,
      required: [true, "please enter body"],
    },
    description: {
      type: String,
      required: [true, "please enter description"],
      minlength: [20, "minlength of description is 20 characters"],
      maxlength: [200, "maxlength of description is 200 characters"],
    },
    category: {
      type: String,
      required: [true, "please enter category"],
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("blogpost", PostSchema);
