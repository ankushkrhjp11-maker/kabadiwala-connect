/** Shared, implementation-neutral contracts for future clients and API modules. */
export type SupportedLocale = 'en' | 'hi' | 'mr';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type UserRole = 'COLLECTOR' | 'RECYCLER' | 'ADMIN';

export type SupportedLanguage = 'EN' | 'HI' | 'MR';

export type LotStatus =
  | 'DRAFT'
  | 'AVAILABLE'
  | 'OFFER_ACCEPTED'
  | 'PICKUP_SCHEDULED'
  | 'HANDED_OVER'
  | 'CLOSED'
  | 'CANCELLED';

export interface HealthResponse {
  status: 'ok';
  service: 'kabadiwala-connect-api';
  database: 'connected' | 'unavailable';
}

export interface ValuationRange {
  minimum: number;
  maximum: number;
  currency: 'INR';
  confidence: ConfidenceLevel;
}

export const HIDDEN_FAULT_VERIFICATION_MESSAGE =
  'Hidden fault cannot be determined from image — Verification Required.';
