import { z } from 'zod';

// ──────────────────────────────────────────────
// User
// ──────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  isAdmin?: boolean;
  collection?: 'users' | 'admins';
}

// ──────────────────────────────────────────────
// Coach
// ──────────────────────────────────────────────

export interface Coach {
  id: string;
  name: string;
  slug?: string;
  email?: string;
  phone?: string;
  bio?: string | null;
  isActive?: boolean;
}

export interface CoachResponse {
  success: boolean;
  coach: Coach;
}

export interface PaginatedCoachesResponse {
  success: boolean;
  coaches: Coach[];
  totalDocs?: number;
}

export interface CoachCreateRequest {
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface CoachUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface CoachCreatedResponse {
  success: boolean;
  coach: Coach;
}

export interface CoachUpdatedResponse {
  success: boolean;
  coach: Coach;
}

export interface CoachDeletedResponse {
  success: boolean;
  id: string;
}

export interface CoachQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

// ──────────────────────────────────────────────
// Service
// ──────────────────────────────────────────────

export interface ServiceData {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  picture?: string;
  priceCents: number;
  durationMins: number;
  eligibleCoachIds?: string[];
  isActive?: boolean;
}

export type Service = ServiceData;

export interface ServiceResponse {
  success: boolean;
  service: ServiceData;
}

export interface PaginatedServicesResponse {
  success: boolean;
  services: ServiceData[];
  totalDocs?: number;
}

export interface ServiceCreateRequest {
  name: string;
  description?: string;
  priceCents: number;
  durationMins: number;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface ServiceUpdateRequest {
  name?: string;
  description?: string;
  priceCents?: number;
  durationMins?: number;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface ServiceCreatedResponse {
  success: boolean;
  service: ServiceData;
}

export interface ServiceUpdatedResponse {
  success: boolean;
  service: ServiceData;
}

export interface ServiceDeletedResponse {
  success: boolean;
  id: string;
}

export interface ServiceQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  [key: string]: unknown;
}

// ──────────────────────────────────────────────
// Treatment (legacy admin types)
// ──────────────────────────────────────────────

export interface Treatment {
  id: string;
  name: string;
  description?: string;
  priceCents?: number;
  durationMins?: number;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface TreatmentCreateRequest {
  name: string;
  [key: string]: unknown;
}

export interface TreatmentUpdateRequest {
  name?: string;
  [key: string]: unknown;
}

export interface TreatmentDuplicateRequest {
  targetCenterId: string;
  [key: string]: unknown;
}

export interface PaginatedTreatmentsResponse {
  success: boolean;
  treatments?: Treatment[];
  totalDocs?: number;
  [key: string]: unknown;
}

export interface TreatmentResponse {
  success: boolean;
  treatment: Treatment;
}

export interface TreatmentCreatedResponse {
  success: boolean;
  treatment: Treatment;
}

export interface TreatmentUpdatedResponse {
  success: boolean;
  treatment: Treatment;
}

export interface TreatmentDuplicatedResponse {
  success: boolean;
  treatment: Treatment;
}

export interface TreatmentDeletedResponse {
  success: boolean;
  id: string;
}

// ──────────────────────────────────────────────
// Booking
// ──────────────────────────────────────────────

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'cancelled'
  | 'canceled'
  | 'completed'
  | 'failed_payment'
  | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partial_refund' | 'failed' | 'expired';

export interface BookingResponse {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  date?: string;
  startTime: string;
  endTime?: string;
  timezone?: string;
  userId: string | null;
  serviceId: string | null;
  coachId: string | null;
  priceCents: number;
  totalCents?: number;
  discountCents?: number;
  discountAmountCents?: number;
  currency?: string;
  couponId?: string | null;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponseWithDetails extends BookingResponse {
  user?: User;
  service?: ServiceData;
  coach?: Coach;
  coupon?: CouponData;
  payment?: {
    id: string;
    stripeCheckoutSessionId?: string;
    stripePaymentIntentId?: string;
    amountCents: number;
    status: string;
  };
}

export interface CreateBookingRequest {
  serviceId: string;
  coachId: string;
  startTime: string;
  date?: string;
  couponCode?: string;
  customerNotes?: string;
}

export interface UserBookingQuery {
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface AdminBookingQueryParams {
  status?: BookingStatus;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  page?: number;
}

export interface AdminBookingUpdateRequest {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  internalNotes?: string;
  customerNotes?: string;
  cancelledAt?: string;
}

// ──────────────────────────────────────────────
// Coupon
// ──────────────────────────────────────────────

export interface CouponData {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
}

export type Coupon = CouponData;

export interface CouponValidationResponse {
  success: boolean;
  isValid: boolean;
  discountAmountCents: number;
  error?: string;
  coupon?: CouponData;
}

export const couponCreateSchema = z.object({
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.number().positive(),
  minOrderCents: z.number().optional(),
  maxRedemptions: z.number().optional(),
  maxRedemptionsPerUser: z.number().optional(),
  expiresAt: z.string().optional(),
  startsAt: z.string().optional(),
  applicableServices: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export type CouponCreateRequest = z.infer<typeof couponCreateSchema>;

// ──────────────────────────────────────────────
// Contact form
// ──────────────────────────────────────────────

export interface ContactFormRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  question?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ──────────────────────────────────────────────
// Availability
// ──────────────────────────────────────────────

export interface Slot {
  time: string;
  available: boolean;
  coachIds: string[];
  startsAt: string;
}

export interface DayAvailability {
  date: string;
  availableSlots: Slot[];
}

export interface GetAvailabilityResponse {
  success: boolean;
  availability: DayAvailability[];
}

// ──────────────────────────────────────────────
// Google reviews
// ──────────────────────────────────────────────

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description?: string;
}

export interface GoogleReviewsResponse {
  success: boolean;
  reviews: GoogleReview[];
}
