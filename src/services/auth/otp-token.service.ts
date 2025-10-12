import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OtpToken } from './entities/otp-token.entity';

@Injectable()
export class OtpTokenService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createOtpTokenDto: OtpToken) {
    return this.prisma.otpToken.create({
      data: { 
        token: createOtpTokenDto.token,
        userId: createOtpTokenDto.userId,
        expiryDate: createOtpTokenDto.expiryDate
      },
    });
  }

  async findOne(userId: string): Promise<OtpToken | null> {
    const token = await this.prisma.otpToken.findFirst({
      where: { userId },
      orderBy: { pkId: 'desc' },
    });

    return token as OtpToken;
  }

  async delete(userId: string): Promise<boolean> {
    const token = await this.prisma.otpToken.deleteMany({
      where: { userId } 
    });

    return true;
  }

}
