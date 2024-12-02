// import { diskStorage } from 'multer';
// import { extname, join } from 'path';
// import { randomUUID } from 'crypto';


export const multerOptions = {
  // storage: diskStorage({
  //   destination:join('./public', 'uploads', 'images'),
  //   filename: (req, file, cb) => {
  //     const uniqueSuffix = randomUUID() + extname(file.originalname);
  //     cb(null, uniqueSuffix);
  //   },
  // })
};

export const multerVideoOptions = {
  // storage: diskStorage({
  //   destination:join('./public', 'uploads', 'videos'),
  //   filename: (req, file, cb) => {
  //     const uniqueSuffix = randomUUID() + extname(file.originalname);
  //     cb(null, uniqueSuffix);
  //   },
  // })
};
