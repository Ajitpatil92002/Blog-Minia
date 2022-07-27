import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const UserStroageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../static/Userimages"));
  },
  filename: (req, file, cb) => {
    let name = req.body.username || req.body.title;
    const path = name + "-" + Date.now() + file.originalname;
    const Updatedimage = path.replaceAll(" ", "");
    cb(null, Updatedimage);
  },
});

export const userImageUpload = multer({
  storage: UserStroageEngine,
});
