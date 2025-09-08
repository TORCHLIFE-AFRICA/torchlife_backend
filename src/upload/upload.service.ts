// src/upload/upload.service.ts

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import { CLOUDINARY } from './providers/cloudinary.provider';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UploadService {
    constructor(
        @Inject(CLOUDINARY) private cloudinary: typeof Cloudinary,
        private readonly prismaDB: PrismaService,
    ) {}

    async uploadFile(file: Express.Multer.File, campaignId: string, userId?: string) {
        // 1. Validate file type (images or PDFs only)
        const allowedMimeTypes = ['image/', 'application/pdf'];
        const isAllowed = allowedMimeTypes.some((type) => file.mimetype.startsWith(type));

        if (!isAllowed) {
            throw new BadRequestException('Only image and PDF uploads are allowed');
        }

        // 2. Upload to Cloudinary
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            this.cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'nestjs_uploads',
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result!);
                    },
                )
                .end(file.buffer);
        });

        // 3. Save to DB
        return this.prismaDB.fileUpload.create({
            data: {
                publicId: result.public_id,
                url: result.secure_url,
                format: result.format,
                resourceType: result.resource_type,
                sizeInBytes: result.bytes,
                originalName: result.original_filename,
                userId,
                campaignId,
            },
        });
    }
}
