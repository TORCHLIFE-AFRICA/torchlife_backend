export enum Currency {
    NGN = 'NGN',
    USD = 'USD',
}

export class CreateWalletDto {
    id: string;
    currency: Currency;
}
