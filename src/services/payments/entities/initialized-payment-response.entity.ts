export class InitializeResponseEntity {
    authorization_url: string;
    access_code: string;
    reference: string;
    currency?: string;
    wallet_id: string;
    amount: number;
    tx_ref: string;
}
