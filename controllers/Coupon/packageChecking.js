const BuyPackageModel = require("../../models/BuyPackageModel");

const validateUserPackage = async (userId) => {
  const userPackages = await BuyPackageModel.find({
    investor_id: userId
  });

  if (!userPackages || userPackages.length === 0) {
    throw new Error("No active packages found");
  }

  const totalRecharge = userPackages.reduce((sum, package) => {
    return sum + Number(package.recharge_amount);
  }, 0);

  if (totalRecharge < 3600) {
    throw new Error(
      "Total recharge amount must be at least 3600 to use coupons");
  }

  return true;
};

module.exports = {
  validateUserPackage,
};
