export type UserPlan = 'free' | 'pro' | 'team';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: UserPlan;
  billingCycle: 'monthly' | 'annual';
  company?: string;
  createdAt: string;
}

export interface PricingPlan {
  id: UserPlan;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  period: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}
