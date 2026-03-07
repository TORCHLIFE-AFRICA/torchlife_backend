import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from 'src/services/upload/upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  create(@Body() createUploadDto: CreateUploadDto) {
    // return this.uploadService.create(createUploadDto);
    return { message: 'Upload endpoint is under construction' };
  }

  @Get()
  findAll() {
    // return this.uploadService.findAll();
    return { message: 'Upload endpoint is under construction' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    // return this.uploadService.update(+id, updateUploadDto);
    return { message: 'Upload endpoint is under construction' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.uploadService.remove(+id);
    return { message: 'Upload endpoint is under construction' };
  }

  @Post(':campaignId')
    @UseInterceptors(FileInterceptor('file'))
    upload(
      @UploadedFile() file: Express.Multer.File,
      @Param('campaignId') campaignId: string,
      @Body('userId') userId: string,
    ) {
      return this.uploadService.uploadFile(file, campaignId, userId);
    }
}
