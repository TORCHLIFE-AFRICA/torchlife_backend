export class DbDataConstant {
    static userData = {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
        role: true,
        activities: true,
        isverified: true,
        created_at: true,
        updated_at: true,
    };

    static campaignData = {
        id: true,
        title: true,
        story: true,
        priority: true,
        location: true,
        status: true,
        deadline: true,
        target_amount: true,
        amount_raised: true,
        image_url: true,
        type: true,
        created_at: true,
        updated_at: true,
        user: {
            select: this.userData,
        },
        verified_by: {
            select: this.userData,
        },
    };

    static donationData = {
        id: true,
        amount: true,
        status: true,
        created_at: true,
        updated_at: true,
        user: {
            select: this.userData,
        },
        campaign: {
            select: this.campaignData,
        },
    };

    static paymentData = {
        id: true,
        amount: true,
        tx_ref: true,
        custom_tx_ref: true,
        status: true,
        type: true,
        currency: true,
        created_at: true,
        updated_at: true,
        user: {
            select: this.userData,
        },
        donation: {
            select: this.donationData,
        },
    };

    static walletData = {
        id: true,
        balance: true,
        currency: true,
        created_at: true,
        updated_at: true,
        user: {
            select: this.userData,
        },
    };

    static walletTransactionData = {
        id: true,
        amount: true,
        type: true,
        currency: true,
        status: true,
        reference: true,
        description: true,
        created_at: true,
        updated_at: true,
        wallet: {
            select: this.walletData,
        },
    };

    static ratingData = {
        id: true,
        score: true,
        comment: true,
        created_at: true,
        updated_at: true,
        user: {
            select: this.userData,
        },
        campaign: {
            select: this.campaignData,
        },
    };
    static withdrawalRequestData = {
        id: true,
        amount: true,
        status: true,
        created_at: true,
        updated_at: true,
        user: {
            select: this.userData,
        },
        wallet: {
            select: this.walletData,
        },
    };
    static webhookData = {
        id: true,
        url: true,
        event: true,
        created_at: true,
        updated_at: true,
    };
    static paymentProviderData = {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
    };
}
