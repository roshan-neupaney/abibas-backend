import * as path from 'path';
import { ImageType } from './FileType.type';
import * as sharp from 'sharp';
import { BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

if (process.env.STORAGE === 'cloudinary') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}


export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
): Promise<{ public_id: string; secure_url: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: fileName }, // Options like public_id
      (error, result) => {
        if (error) {
          return reject(
            new BadRequestException('Cloudinary upload failed', error.message),
          );
        }
        if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        }
      },
    );

    // Write the buffer to the stream
    const stream = require('stream');
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    readStream.pipe(uploadStream);
  });
}

export async function uploadImageWithSizes(
  file: Express.Multer.File,
): Promise<ImageType> {
  const ext = path.extname(file.originalname);
  const randomNumber1 = Math.floor(Math.random() * (100000000 - 10 + 1)) + 10;
  const randomNumber2 = Math.floor(Math.random() * (100000000 - 10 + 1)) + 10;
  const fileName = `${randomNumber1}-${randomNumber2}${ext}`;
  const fileBuffer = await sharp(file.buffer).toBuffer();

  if (process.env.STORAGE === 'cloudinary') {
    const uploadedFile: ImageType = {
      originalName: file.originalname,
      fileName: fileName,
      mimeType: file.mimetype,
      size: file.size,
      url: '',
      path: '',
      sizes: [],
    };

    const sizes = [
      { name: 'large', width: 1000 },
      { name: 'medium', width: 600 },
      { name: 'small', width: 300 },
    ];

    // const uploadedFile: ImageType = {
    //   originalName: file.originalname,
    //   fileName: fileName,
    //   mimeType: file.mimetype,
    //   size: file.size,
    //   url: `${filePath}/${fileName}`,
    //   path: `${filePath}/${fileName}`,
    //   sizes: [],
    // }

    for (const size of sizes) {
      const resizedBuffer = await sharp(fileBuffer)
        .resize({ width: size.width })
        .toBuffer();
      const result = await uploadToCloudinary(
        resizedBuffer,
        `${size.name}-${fileName}`,
      );
      uploadedFile.sizes.push({
        name: size.name,
        fileName: result.public_id,
        url: result.secure_url,
      });
    }

    return uploadedFile;
  } else {
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'images');
    const fileBuffer = await sharp(file.buffer).toBuffer();
    const localFileName = `${fileName}`;
    const localFilePath = path.join(filePath, localFileName);
    await sharp(fileBuffer).toFile(localFilePath);

    const uploadedFile: ImageType = {
      originalName: file.originalname,
      fileName: localFileName,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/images/${localFileName}`,
      path: localFilePath,
      sizes: [],
    };
    return uploadedFile;
  }
}

export async function uploadImageWithNoSizes(
  file: Express.Multer.File,
): Promise<ImageType> {
  const ext = path.extname(file.originalname);
  const randomNumber1 = Math.floor(Math.random() * (1000000 - 10 + 1)) + 10;
  const randomNumber2 = Math.floor(Math.random() * (1000000 - 10 + 1)) + 10;
  const fileName = `${randomNumber1}-${randomNumber2}${ext}`;
  const fileBuffer = await sharp(file.buffer).toBuffer();

  if (process.env.STORAGE === 'cloudinary') {
    const result = await uploadToCloudinary(fileBuffer, fileName);

    return {
      originalName: file.originalname,
      fileName: result.public_id,
      mimeType: file.mimetype,
      size: file.size,
      url: result.secure_url,
      path: '',
      sizes: [],
    };
  } else {
    // Local file upload
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'images');
    
    // Ensure the directory exists
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    const localFilePath = path.join(filePath, fileName);
    await sharp(fileBuffer).toFile(localFilePath);

    return {
      originalName: file.originalname,
      fileName: fileName,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/images/${fileName}`,
      path: localFilePath,
      sizes: [],
    };
  }
}
