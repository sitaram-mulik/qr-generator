export const getAvailableCredits = profile => {
  if (!profile || typeof profile.availableCredits !== 'number') {
    return 0;
  }
  return profile.availableCredits;
};
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
export const isValidityExpired = validTill => {
  if (!validTill) return false;
  const endDate = new Date(validTill);
  const now = new Date();
  return endDate < now;
};

/**
 * Returns the number of days remaining until subscriptionEnds.
 * Returns 0 if subscriptionEnds is in the past or invalid.
 * @param {string|Date} subscriptionEnds - The subscription end date-time.
 * @returns {number} - Number of days remaining.
 */
export const getSubscriptionDaysRemaining = subscriptionEnds => {
  if (!subscriptionEnds) return 0;
  const endDate = new Date(subscriptionEnds);
  const now = new Date();
  const diffTime = endDate - now;
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Returns the number of days remaining until account deactivation based on subscriptionEnds and gracePeriod.
 * Returns 0 if subscriptionEnds or gracePeriod is invalid or deactivation date has passed.
 * @param {string|Date} subscriptionEnds - The subscription end date-time.
 * @param {number} gracePeriod - The grace period in days.
 * @returns {number} - Number of days remaining until deactivation.
 */
export const getDeactivationDaysRemaining = (subscriptionEnds, gracePeriod) => {
  if (!subscriptionEnds || typeof gracePeriod !== 'number' || gracePeriod < 0) return 0;
  const endDate = new Date(subscriptionEnds);
  const deactivationDate = new Date(endDate);
  deactivationDate.setDate(deactivationDate.getDate() + gracePeriod);
  const now = new Date();
  const diffTime = deactivationDate - now;
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
