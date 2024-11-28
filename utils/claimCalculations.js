const calculateClaimAmount = (dailyIncome, duration, totalClaims) => {
  // Check if package duration is over
  if (totalClaims >= duration) {
    return 0;
  }
  return parseFloat(dailyIncome);
};

module.exports = { calculateClaimAmount };