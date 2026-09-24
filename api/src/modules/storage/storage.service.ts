import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private uploadDir = process.env.UPLOAD_DIR || './uploads';

  async store(file: Express.Multer.File, folder: string): Promise<string> {
    const fileId = uuidv4();
    const ext = file.originalname.split('.').pop();
    const storageKey = `${folder}/${fileId}.${ext}`;
    const fullPath = join(this.uploadDir, storageKey);
    const dirPath = join(this.uploadDir, folder);

    await mkdir(dirPath, { recursive: true });
    await writeFile(fullPath, file.buffer);

    return storageKey;
  }

  validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Invalid file type. Only PDF and images are allowed.' };
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit.' };
    }

    return { valid: true };
  }
}
