import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationOptions } from 'src/shared/utils/pagination/pagination';
import { PaginationOptionsDto } from 'src/shared/utils/pagination/pagination-options.dto';
import { CAMPAIGN_STATUS } from '@prisma/client';
import { TokenPayload } from 'src/shared/types/token-payload.types';

@ApiBearerAuth('access-token')
@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    @Post('create-user')
    @ApiOperation({ summary: 'Create a new campaign' })
    @ApiResponse({ status: 201, description: 'Campaign successfully created' })
    async create(@Req() req: TokenPayload, @Body() dto: CreateCampaignDto) {
        const userId = req.id;
        return this.campaignService.create(userId, dto);
    }

    @Get('user')
    @ApiOperation({ summary: 'Get all campaigns created by the authenticated user' })
    async findAllByUser(@Req() req: TokenPayload, @Query() options: PaginationOptionsDto) {
        const userId = req.id;
        return this.campaignService.findAllByUser(userId, options);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single campaign by ID' })
    async findOneById(@Param('id') id: string) {
        return this.campaignService.findOneById(id);
    }

    @Get('status/:status')
    @ApiOperation({ summary: 'Get all campaigns by status' })
    async findAllByStatus(@Param('status') status: CAMPAIGN_STATUS, @Query() options: PaginationOptionsDto) {
        return this.campaignService.findAllByStatus(status, options);
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
    @ApiOperation({ summary: 'Update a campaign by ID' })
    @ApiResponse({ status: 200, description: 'Campaign successfully updated' })
    update(@Req() req: TokenPayload, @Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
        const user = req;
        return this.campaignService.update({ id: user.id, role: user.role }, id, updateCampaignDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a campaign by ID' })
    remove(@Req() req: TokenPayload, @Param('id') id: string) {
        const user = req;
        return this.campaignService.remove({ id: user.id, role: user.role }, id);
    }
}
