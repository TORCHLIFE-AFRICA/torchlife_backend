import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_ROLES } from '@prisma/client';
import { paginate, PaginationOptions } from 'src/shared/utils/pagination/pagination';

@Injectable()
export class CampaignService {
    constructor(private prisma: PrismaService) {}
    async create(userId: string, dto: CreateCampaignDto) {
        const data: any = {
            ...dto,
            user_id: userId,
            amount_raised: 0,
        };

        // Optionally ensure required proxy fields (extra runtime guard)
        if (dto.type === USER_ROLES.PROXY) {
            if (!dto.proxyName || !dto.proxyEmail || !dto.proxyPhone) {
                throw new Error('Missing proxy fields for PROXY campaign');
            }
        }

        return this.prisma.campaign.create({ data });
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
    findAll() {
        return `This action returns all campaign`;
    }

    findOne(id: number) {
        return `This action returns a #${id} campaign`;
    }

    update(id: number, updateCampaignDto: UpdateCampaignDto) {
        return `This action updates a #${id} campaign`;
    }

    remove(id: number) {
        return `This action removes a #${id} campaign`;
    }
}
