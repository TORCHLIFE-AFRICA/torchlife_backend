import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ForbiddenException, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationOptionsDto } from 'src/shared/utils/pagination/pagination-options.dto';
import { AuthUser } from 'src/shared/types/token-payload.types';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user';
import { CampaignStatus } from 'src/domain/enums/campaign-status.enum';
import { ApiStandardResponse, ApiCommonErrors } from 'src/shared/decorators/swagger.decorator';

class CampaignResponseDto {
  // Define properties if needed for swagger response
}

@ApiTags('Campaigns')
@ApiCommonErrors()
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('create-user')
  @ApiOperation({
    summary: 'Create a new campaign',
    description: 'Allows an authenticated user to create a crowdfunding campaign for themselves or a beneficiary.',
  })
  @ApiStandardResponse(CampaignResponseDto, 201, 'Campaign successfully created')
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateCampaignDto) {
    const userId = user.id;
    return this.campaignService.create(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('user')
  @ApiOperation({
    summary: 'Get user campaigns',
    description: 'Retrieves all campaigns created by the currently authenticated user with pagination support.',
  })
  @ApiStandardResponse(CampaignResponseDto, 200, 'List of user campaigns')
  async findAllByUser(@CurrentUser() user: AuthUser, @Query() options: PaginationOptionsDto) {
    const userId = user.id;
    return this.campaignService.findAllByUser(userId, options);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign details',
    description: 'Retrieves full details of a single campaign including story, target, and raised amounts.',
  })
  @ApiParam({ name: 'id', description: 'The unique identifier of the campaign', example: 'uuid-string' })
  @ApiStandardResponse(CampaignResponseDto, 200, 'Campaign found')
  async findOneById(@Param('id') id: string) {
    return this.campaignService.findOneById(id);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Filter campaigns by status',
    description: 'Retrieves a paginated list of campaigns filtered by their current verification or publication status.',
  })
  @ApiParam({ name: 'status', enum: CampaignStatus, description: 'The status to filter campaigns by' })
  @ApiStandardResponse(CampaignResponseDto, 200, 'List of campaigns by status')
  async findAllByStatus(@Param('status') status: CampaignStatus, @Query() options: PaginationOptionsDto) {
    return this.campaignService.findAllByStatus(status, options);
  }

  @Get()
  @ApiOperation({
    summary: 'List all campaigns',
    description: 'Retrieves a list of all campaigns. Access restricted to administrative users.',
  })
  @ApiStandardResponse(CampaignResponseDto, 200, 'All campaigns retrieved')
  findAll() {
    return this.campaignService.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update campaign',
    description: 'Allows a campaign owner or an admin to update specific fields of an existing campaign.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the campaign to update' })
  @ApiStandardResponse(CampaignResponseDto, 200, 'Campaign successfully updated')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.update({ id: user.id, role: user.role }, id, updateCampaignDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete campaign',
    description: 'Permanently removes a campaign from the platform. Restricted to owners and administrators.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the campaign to delete' })
  @ApiStandardResponse(CampaignResponseDto, 200, 'Campaign successfully deleted')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.campaignService.remove({ id: user.id, role: user.role }, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id/verify')
  @ApiOperation({
    summary: 'Verify campaign',
    description: 'Internal endpoint for proxy/admin users to mark a campaign as verified after document review.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the campaign to verify' })
  @ApiStandardResponse(CampaignResponseDto, 200, 'Campaign successfully verified')
  verifyCampaign(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.campaignService.verifyCampaign(id, user.id);
  }
}
