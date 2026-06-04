import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Get,
  Query,
  Param,
} from '@nestjs/common';

import {
  FilesInterceptor,
} from '@nestjs/platform-express';

import { memoryStorage } from 'multer';
import { Express } from 'express';

import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateCampaignUpdateDto } from './dto/create-campaign.dto';
import { plainToInstance } from 'class-transformer';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Campaigns')
@ApiBearerAuth()
@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
  ) {}

  // CREATE CAMPAIGN
  @Post()
  @ApiOperation({
    summary: 'Create Campaign',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',

      required: ['data', 'documents'],

      properties: {
        data: {
          type: 'string',
        },

        documents: {
          type: 'array',

          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor(
      'documents',
      10,
      {
        storage: memoryStorage(),

        limits: {
          fileSize:
            10 * 1024 * 1024,
        },

        fileFilter: (
          req,
          file,
          cb,
        ) => {
          const allowedMimeTypes =
            [
              'image/jpeg',
              'image/png',
              'image/jpg',
              'application/pdf',
            ];

          if (
            !allowedMimeTypes.includes(
              file.mimetype,
            )
          ) {
            return cb(
              new BadRequestException(
                'Only JPG, PNG and PDF files are allowed',
              ),
              false,
            );
          }

          cb(null, true);
        },
      },
    ),
  )
 async createCampaign(
  @Body() body: { data: string },
  @UploadedFiles()
  files: Express.Multer.File[],
) {
  if (!files?.length) {
    throw new BadRequestException(
      'At least one document is required',
    );
  }

  let parsedBody: CreateCampaignDto;

  try {
    parsedBody = plainToInstance(
      CreateCampaignDto,
      JSON.parse(body.data),
    );
  } catch {
    throw new BadRequestException(
      'Invalid JSON format',
    );
  }

  return this.campaignsService.createCampaign(
    parsedBody,
    files,
  );
}

  // CAMPAIGN FEED
  @Get()
  @ApiOperation({
    summary:
      'Get Public Campaign Feed',
  })
  getCampaignFeed(
    @Query('page') page = '1',

    @Query('limit')
    limit = '10',
  ) {
    return this.campaignsService.getCampaignFeed(
      Number(page),
      Number(limit),
    );
  }

  // GET SINGLE CAMPAIGN
  @Get(':id')
  @ApiOperation({
    summary:
      'Get Campaign Details',
  })
  @ApiParam({
    name: 'id',
    example: 'cmp_001',
  })
  @ApiResponse({
    status: 200,

    description:
      'Campaign fetched successfully',
  })
  @ApiResponse({
    status: 404,

    description:
      'Campaign not found',
  })
  getCampaignById(
    @Param('id') id: string,
  ) {
    return this.campaignsService.getCampaignById(
      id,
    );
  }

   @Post(':id/updates')
  @ApiOperation({
    summary:
      'Create Campaign Update',
  })
  createUpdate(
    @Param('id') id: string,

    @Body()
    dto: CreateCampaignUpdateDto,
  ) {
    return this.campaignsService.createCampaignUpdate(
      id,
      dto,
    );
  }
}