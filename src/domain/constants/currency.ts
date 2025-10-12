export const Currency = {
    NGN: 'NGN',
    USD: 'USD',
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];
