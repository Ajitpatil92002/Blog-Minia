import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PostStroageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../static/Postimages"));
  },
  filename: (req, file, cb) => {
    const path =
      req.body.title.substring(0, 6) + "-" + Date.now() + file.originalname;
    const Updatedimage = path.replaceAll(" ", "");
    cb(null, Updatedimage);
  },
});

export const postImageUpload = multer({
  storage: PostStroageEngine,
});
