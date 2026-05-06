import { api } from '../api';
import type { GoogleReview, GoogleReviewsResponse } from 'shared/types';

export const useGoogleReviews = async (): Promise<{
  reviews: GoogleReview[];
  count: number;
}> => {
  const response = await api.get<GoogleReviewsResponse>('/google-reviews');
  const { reviews, totalReviews } = response.data;
  return {
    reviews: reviews
      .filter((review: GoogleReview) => review.rating >= 4)
      .slice(0, 10),
    count: totalReviews,
  };
};
