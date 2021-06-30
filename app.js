const express = require("express");
const multer = require("multer");
const path = require("path");

//set storage engine
const storage = multer.diskStorage({
   destination: "./public/uploads/",
   filename: (req, file, cb) => {
      let filename = `${file.fieldname}-${Date.now()}${path.extname(
         file.originalname
      )}`;
      cb(null, filename);
   },
});

//init upload
const upload = multer({
   storage,
   limits: { fileSize: 1000000 },
   fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
   },
}).single("myImage");

//check file type
function checkFileType(file, cb) {
   //allowwed ext
   const filetypes = /jpeg|jpg|png|gif/;
   //check ext
   const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
   );
   //check mime type
   const mimetype = filetypes.test(file.mimetype);

   if (mimetype && extname) {
      return cb(null, true);
   } else {
      cb("Error: Image Only!");
   }
}

//init app
const app = express();

//ejs
app.set("view engine", "ejs");

//public folder for img files
app.use(express.static("./public"));

app.get("/", (req, res) => {
   res.render("index");
});

app.post("/upload", (req, res) => {
   upload(req, res, (err) => {
      if (err) {
         res.render("index", { msg: err });
      } else {
         if (req.file == undefined) {
            res.render("index", {
               msg: "Error: No file Selected",
            });
         } else {
            res.render("index", {
               msg: "File Uploaded",
               file: `uploads\\${req.file.filename}`,
            });
         }
      }
   });
});

const PORT = process.env.PORT || 3600;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
