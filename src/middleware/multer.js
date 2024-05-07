import multer from 'multer';
import { join } from 'path';
import __dirname from '../utils.js';



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      let folder = "";
      const route = req.originalUrl
      if (route.startsWith('/products')) {
          folder = join(__dirname, '/public/files/products');
      } else if (route.startsWith('/api/sessions/register')) {
          folder = join(__dirname, '/public/files/profile');
      } else if (route.startsWith('/api/users')) {
          if (route.includes('/documents')) {
              folder = join(__dirname, '/public/files/documents');
          }
      } 

      if (folder === "") {
          folder = join(__dirname, '/public/files');
      }

      cb(null, folder);
  },
  filename: function (req, file, cb) {
      console.log("file")
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});


// Multer upload instance
export const upload = multer({ storage });


