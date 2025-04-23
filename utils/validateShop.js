// utils/validateShop.js

const validateShopData = (data) => {
  const errors = [];

  // Check phone format
  if (!/^(\d{3}-?\d{3}-?\d{4})$/.test(data.tel)) {
    errors.push("Invalid phone number format");
  }

  // Check openTime < closeTime
  if (data.openTime && data.closeTime) {
    const [oh, om] = data.openTime.split(":").map(Number);
    const [ch, cm] = data.closeTime.split(":").map(Number);
    const openMinutes = oh * 60 + om;
    const closeMinutes = ch * 60 + cm;
    if (openMinutes >= closeMinutes) {
      errors.push("Open time must be before close time");
    }
  }

  // Check max 5 pictures
  if (Array.isArray(data.picture) && data.picture.length > 5) {
    errors.push("You can upload up to 5 pictures only");
  }

  return errors;
};
module.exports = validateShopData;
