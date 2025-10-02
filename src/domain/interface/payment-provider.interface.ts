export interface PaymentGatewayService {
    initializePayment(data: {
        amount: number;
        tx_ref: string;
        currency: string;
        userId: string;
        metadata?: any;
    }): Promise<{ authorization_url: string; reference: string }>;

    verifyPayment(payload: any): Promise<{
        success: boolean;
        amount: number;
        currency: string;
        provider: string;
        raw: any;
    }>;
}
