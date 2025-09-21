import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationOptions } from 'src/shared/utils/pagination/pagination';
import { PaginationOptionsDto } from 'src/shared/utils/pagination/pagination-options.dto';

@ApiBearerAuth('access-token')
@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    @Post('create-user')
    @ApiOperation({ summary: 'Create a new campaign' })
    @ApiResponse({ status: 201, description: 'Campaign successfully created' })
    async create(@Req() req: any, @Body() dto: CreateCampaignDto) {
        const userId = req.user.id;
        return this.campaignService.create(userId, dto);
    }

    @Get('user')
    @ApiOperation({ summary: 'Get all campaigns created by the authenticated user' })
    async findAllByUser(@Req() req: any, @Query() options: PaginationOptionsDto) {
        const userId = req.user.id;
        return this.campaignService.findAllByUser(userId, options);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single campaign by ID' })
    async findOneById(@Param('id') id: string) {
        return this.campaignService.findOneById(id);
    }

    @Get()
    findAll() {
        return this.campaignService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.campaignService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
        return this.campaignService.update(+id, updateCampaignDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.campaignService.remove(+id);
    }
}
