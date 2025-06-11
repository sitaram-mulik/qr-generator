export const getSubscriptionStartDate = profile => {
  if (!profile || !profile.subscriptionStarts) {
    return '-';
  }
  // return date
  return new Date(profile.subscriptionStarts).toLocaleString();
};
export const getSubscriptionEndDate = profile => {
  if (!profile || !profile.subscriptionEnds) {
    return '-';
  }
  return new Date(profile.subscriptionEnds).toLocaleString();
};
export const getSubscriptionPeriod = profile => {
  if (!profile || typeof profile.subscriptionPeriod !== 'number') {
    return '-';
  }
  return `${profile.subscriptionPeriod} months`;
};

/**
 * Checks if the subscription has expired based on subscriptionEnds date-time.
 * @param {string|Date} subscriptionEnds - The subscription end date-time.
 * @returns {boolean} - True if subscriptionEnds is less than current date-time, else false.
 */
export const isSubscriptionExpired = ({ subscriptionEnds }) => {
  if (!subscriptionEnds) return false;
  const endDate = new Date(subscriptionEnds);
  const now = new Date();
  return endDate < now;
};

export const getAvailableCredits = (credits, totalAssets, downloads) => {
  let availableCredits = credits - (totalAssets + downloads);
  if (availableCredits < 0) availableCredits = 0;
  return availableCredits;
};
