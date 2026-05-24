import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
    controllers: [UploadController],
    providers: [UploadService, CloudinaryProvider],
})
export class UploadModule {}
