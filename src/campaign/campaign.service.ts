import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CAMPAIGN_STATUS, USER_ROLES } from '@prisma/client';
import { paginate, PaginationOptions } from 'src/shared/utils/pagination/pagination';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class CampaignService {
    constructor(
        private prisma: PrismaService,
        private uploadService: UploadService,
    ) {}
    async create(userId: string, dto: CreateCampaignDto, file?: Express.Multer.File) {
        // Optionally ensure required proxy fields (extra runtime guard)
        if (dto.type === USER_ROLES.PROXY) {
            if (!dto.proxyName || !dto.proxyEmail || !dto.proxyPhone) {
                throw new Error('Missing proxy fields for PROXY campaign');
            }
        }
        const campaign: any = {
            ...dto,
            user_id: userId,
            amount_raised: 0,
        };
        if (file) {
            await this.uploadService.uploadFile(file, campaign.id, userId);
        }

        return campaign;
    }

    async findAllByUser(userId: string, options: PaginationOptions) {
        const settings = {
            defaultLimit: 10, // campaigns per page
            maxLimit: 50, // prevent huge requests
        };

        return paginate(
            async () => {
                const [campaigns, total] = await this.prisma.$transaction([
                    this.prisma.campaign.findMany({
                        where: { user_id: userId },
                        orderBy: { created_at: 'desc' },
                        skip: (options.page! - 1) * (options.limit ?? settings.defaultLimit),
                        take: options.limit ?? settings.defaultLimit,
                    }),
                    this.prisma.campaign.count({
                        where: { user_id: userId },
                    }),
                ]);
                return [campaigns, total];
            },
            options,
            settings,
        );
    }

    async findOneById(id: string) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, first_name: true, last_name: true, email: true },
                },
                donations: true,
                ratings: true,
                fileUploads: true,
            },
        });

        if (!campaign) throw new NotFoundException(`Campaign with ID ${id} not found`);
        return campaign;
    }
    findAll(options: PaginationOptions = {}) {
        const settings = {
            defaultLimit: 10,
            maxLimit: 50,
        };

        return paginate(
            async (skip, limit) => {
                const [campaigns, total] = await this.prisma.$transaction([
                    this.prisma.campaign.findMany({
                        orderBy: { created_at: 'desc' },
                        skip,
                        take: limit,
                    }),
                    this.prisma.campaign.count(),
                ]);
                return [campaigns, total];
            },
            options,
            settings,
        );
    }

    async update(user: { id: string; role: USER_ROLES }, campaignId: string, dto: UpdateCampaignDto) {
        const campaign = await this.findOneById(campaignId);
        if (!campaign) throw new NotFoundException();

        if (campaign.user_id !== user.id && user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.SUPER_ADMIN) {
            throw new ForbiddenException('You are not authorized to update this campaign');
        }

        return this.prisma.campaign.update({
            where: { id: campaignId },
            data: dto,
        });
    }

    async remove(user: { id: string; role: USER_ROLES }, campaignId: string) {
        const campaign = await this.findOneById(campaignId);
        if (!campaign) throw new NotFoundException();

        if (campaign.user_id !== user.id && user.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenException('You are not authorized to delete this campaign');
        }

        return this.prisma.campaign.delete({
            where: { id: campaignId },
        });
    }

    async approveCampaign(campaignId: string) {
        const campaign = await this.findOneById(campaignId);
        if (!campaign) throw new NotFoundException();

        return this.prisma.campaign.update({
            where: { id: campaignId },
            data: {
                status: CAMPAIGN_STATUS.APPROVED,
            },
        });
    }

    async findAllByStatus(status: CAMPAIGN_STATUS, options: PaginationOptions) {
        const settings = {
            defaultLimit: 10,
            maxLimit: 50,
        };

        return paginate(
            async () => {
                const [campaigns, total] = await this.prisma.$transaction([
                    this.prisma.campaign.findMany({
                        where: { status },
                        orderBy: { created_at: 'desc' },
                        skip: (options.page! - 1) * (options.limit ?? settings.defaultLimit),
                        take: options.limit ?? settings.defaultLimit,
                    }),
                    this.prisma.campaign.count({
                        where: { status },
                    }),
                ]);
                return [campaigns, total];
            },
            options,
            settings,
        );
    }

    async verifyCampaign(campaignId: string, userId: string) {
        // 1. Get the user
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // 2. Check if user is a "proxy"
        if (user.role !== USER_ROLES.PROXY) {
            throw new Error('Only proxy users can verify campaigns');
        }

        // 3. Update the campaign
        const campaign = await this.prisma.campaign.update({
            where: { id: campaignId },
            data: {
                verified_by: {
                    connect: { id: user.id },
                },
            },
        });

        return campaign;
    }

    findOne(id: number) {
        return `This action returns a #${id} campaign`;
    }
}
