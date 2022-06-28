import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../", "storage"));
  },
  filename: function (req, file, cb) {
    const prefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, prefix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
});
