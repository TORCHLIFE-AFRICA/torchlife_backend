import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateCampaignUpdateDto } from './dto/create-campaign.dto';
import { uploadToCloudinary } from 'src/utils/cloudinary';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) { }

  // CREATE CAMPAIGN
  async createCampaign(
    dto: CreateCampaignDto,
    files: Express.Multer.File[],
  ) {
    if (!dto.consent.agreed) {
      throw new BadRequestException(
        'Consent is required',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const beneficiary =
          await tx.beneficiary.create({
            data: {
              name: dto.beneficiary.name,

              countryOfResidence:
                dto.beneficiary
                  .countryOfResidence,

              expectedDateOfDelivery:
                new Date(
                  dto.beneficiary
                    .expectedDateOfDelivery,
                ),

              medicalConditions:
                dto.beneficiary
                  .medicalConditions,
            },
          });

        let submitter: { id: string } | null = null;

        if (dto.submitterType === 'PROXY') {
          if (!dto.submitter) {
            throw new BadRequestException(
              'Submitter is required for PROXY campaigns',
            );
          }

          submitter = await tx.submitter.create({
            data: {
              name: dto.submitter.name,
              relationship: dto.submitter.relationship,
              phone: dto.submitter.phone,
              email: dto.submitter.email,
            },
          });
        }

        const hospital =
          await tx.hospital.create({
            data: dto.hospital,
          });

        const consent =
          await tx.consent.create({
            data: {
              agreed:
                dto.consent.agreed,

              agreedAt: new Date(
                dto.consent.agreedAt,
              ),
            },
          });

        const campaign =
          await tx.campaigns.create({
            data: {
              title:
                dto.campaign.title,

              category:
                dto.campaign.category,

              story:
                dto.campaign.story,

              amountNeeded:
                dto.campaign
                  .amountNeeded,

              amountRaised: 0,

              currency:
                dto.campaign.currency,

              status:
                'PUBLISHED',

              verified: false,

              submitterType:
                dto.submitterType,

              beneficiaryId:
                beneficiary.id,

              submitterId:
                submitter?.id,

              hospitalId:
                hospital.id,

              consentId:
                consent.id,
            },
          });

        // upload files
        if (files?.length) {
          const uploadedFiles =
            await Promise.all(
              files.map((file) =>
                uploadToCloudinary(
                  file,
                ),
              ),
            );

          await tx.campaignDocument.createMany(
            {
              data: uploadedFiles.map(
                (
                  uploaded,
                  index,
                ) => ({
                  campaignId:
                    campaign.id,

                  fileName:
                    files[index]
                      .originalname,

                  fileUrl:
                    uploaded.secure_url,

                  mimeType:
                    files[index]
                      .mimetype,

                  isHero:
                    index === 0,

                  type:
                    'MEDICAL_REPORT',

                  visibility:
                    'PRIVATE_DONOR',
                }),
              ),
            },
          );
        }

        return {
          message:
            'Campaign created successfully',

          campaignId:
            campaign.id,
        };
      },
    );
  }

  // CAMPAIGN FEED
  async getCampaignFeed(
    page = 1,
    limit = 10,
  ) {
    const campaigns =
      await this.prisma.campaigns.findMany(
        {
          where: {
            status:
              'PUBLISHED',
          },

          include: {
            beneficiary: true,

            documents: true,
          },

          skip:
            (page - 1) * limit,

          take: limit,
        },
      );

    const items = campaigns
      .map((campaign) => {
        const percentageComplete =
          campaign.amountNeeded > 0
            ? (campaign.amountRaised /
              campaign.amountNeeded) *
            100
            : 0;

        const amountRemaining =
          campaign.amountNeeded -
          campaign.amountRaised;

        let urgencyScore = 0;

        if (
          campaign.verified
        ) {
          urgencyScore += 50;
        }

        if (
          percentageComplete >=
          80 &&
          percentageComplete <=
          95
        ) {
          urgencyScore += 40;
        }

        if (
          campaign.category ===
          'URGENT'
        ) {
          urgencyScore += 100;
        }

        return {
          id: campaign.id,

          title:
            campaign.title,

          category:
            campaign.category,

          status:
            campaign.status,

          verified:
            campaign.verified,

          amountNeeded:
            campaign.amountNeeded,

          amountRaised:
            campaign.amountRaised,

          percentageComplete:
            Number(
              percentageComplete.toFixed(
                2,
              ),
            ),

          amountRemaining,

          countryOfResidence:
            campaign.beneficiary
              .countryOfResidence,

          timeLeftLabel:
            '48 hrs priority',

          heroImageUrl:
            campaign.documents.find(
              (doc) =>
                doc.isHero,
            )?.fileUrl || null,

          urgencyScore,
        };
      })

      .sort(
        (a, b) =>
          b.urgencyScore -
          a.urgencyScore,
      );

    return {
      items: items.map(
        ({
          urgencyScore,
          ...rest
        }) => rest,
      ),

      meta: {
        sort:
          'urgency_score_desc',

        pagination: {
          page,
          limit,
          count: items.length,
        },
      },
    };
  }

  // GET SINGLE CAMPAIGN
  async getCampaignById(
    id: string,
  ) {
    const campaign =
      await this.prisma.campaigns.findUnique(
        {
          where: { id },

          include: {
            hospital: true,

            documents: true,

            updates: {
              orderBy: {
                createdAt:
                  'desc',
              },
            },
          },
        },
      );

    if (!campaign) {
      throw new NotFoundException(
        'Campaign not found',
      );
    }

    return {
      id: campaign.id,

      title: campaign.title,

      category:
        campaign.category,

      story: campaign.story,

      status:
        campaign.status,

      verified:
        campaign.verified,

      amountNeeded:
        campaign.amountNeeded,

      amountRaised:
        campaign.amountRaised,

      currency:
        campaign.currency,

      feeDisclosure: {
        platformFeePercent: 2,

        paymentProcessor:
          'Paystack',

        note:
          'Paystack charges apply separately.',
      },

      hospital: {
        name:
          campaign.hospital.name,

        address:
          campaign.hospital
            .address,

        verified: true,
      },

      documents:
        campaign.documents.map(
          (doc) => ({
            type: doc.type,

            url: doc.fileUrl,

            visibility:
              doc.visibility,
          }),
        ),

      updates:
        campaign.updates.map(
          (update) => ({
            id: update.id,

            message:
              update.message,

            createdAt:
              update.createdAt,
          }),
        ),
    };
  }

  async createCampaignUpdate(
    campaignId: string,
    dto: CreateCampaignUpdateDto,
  ) {
    const campaign =
      await this.prisma.campaigns.findUnique(
        {
          where: { id: campaignId },
        },
      );

    if (!campaign) {
      throw new NotFoundException(
        'Campaign not found',
      );
    }

    if (
      campaign.status !==
      'PUBLISHED'
    ) {
      throw new BadRequestException(
        'Only published campaigns can receive updates',
      );
    }

    const update =
      await this.prisma.campaignUpdate.create(
        {
          data: {
            campaignId,
            message: dto.message,
            visibility:
              dto.visibility,
            createdBy:
              dto.createdBy,
            status: 'PUBLISHED',
          },
        },
      );

    return {
      id: update.id,
      campaignId: update.campaignId,
      status: update.status,
      message: update.message,
      visibility: update.visibility,
      createdBy: update.createdBy,
      createdAt: update.createdAt,
    };
  }
}