const Review = require('../../models/Review');
const Shop = require('../../models/Shop');

const updateCountReview = async (shopId) => {
    try {
        const reviewCount = await Review.countDocuments({ shop: shopId });

        await Shop.findByIdAndUpdate(shopId, {
            numOfReviews: reviewCount
        });

    } catch (error) {
        console.error(error);
    }
};

module.exports = updateCountReview;
