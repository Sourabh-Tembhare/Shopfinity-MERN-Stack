 export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = total / reviews.length;

  // Round to 1 decimal if needed:
  return Math.round(average * 10) / 10;
}
