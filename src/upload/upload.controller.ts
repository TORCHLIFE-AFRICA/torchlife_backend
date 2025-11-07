// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { UploadService } from './upload.service';
// import { CreateUploadDto } from './dto/create-upload.dto';
// import { UpdateUploadDto } from './dto/update-upload.dto';

// @Controller('upload')
// export class UploadController {
//   constructor(private readonly uploadService: UploadService) {}

//   @Post()
//   create(@Body() createUploadDto: CreateUploadDto) {
//     return this.uploadService.create(createUploadDto);
//   }

//   @Get()
//   findAll() {
//     return this.uploadService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.uploadService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
//     return this.uploadService.update(+id, updateUploadDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.uploadService.remove(+id);
//   }
// }



import { Controller, Post, UploadedFile, UseInterceptors, Param, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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