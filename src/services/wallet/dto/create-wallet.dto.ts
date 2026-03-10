import { CURRENCY } from '@prisma/client';

export class CreateWalletDto {
    id: string;
    currency: CURRENCY;
}
