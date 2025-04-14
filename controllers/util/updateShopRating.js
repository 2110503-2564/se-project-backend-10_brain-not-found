const Review = require('../models/Review');
const Shop = require('../models/Shop');

const updateShopRating = async (shopId) => {
    const result = await Review.aggregate([
        { $match: { shop: shopId } },
        {
            $group: {
                _id: '$shop',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    const avg = result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;

    await Shop.findByIdAndUpdate(shopId, {
        shopRating: avg
    });
};

module.exports = updateShopRating;
