const express = require('express');
const { getReviews , editReview , createReview , deleteReview } = require('../controllers/reviews')
const router = express.Router({mergeParams: true});
const {protect,authorize} = require('../middleware/auth');


router.route('/')
    .get(getReviews)
    .post(protect,authorize('user'),createReview);
router.route('/:id')
    .put(protect,authorize('admin','user'),editReview)
    .delete(protect,authorize('admin','user'),deleteReview);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management for shops
 */

/**
 * @swagger
 * /api/v1/shops/{shopId}/reviews:
 *   get:
 *     summary: Get all reviews for a specific shop
 *     description: Retrieves a list of reviews associated with a given shop ID. Supports filtering, sorting, and pagination. Publicly accessible.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         description: ID of the shop to retrieve reviews for.
 *         schema:
 *           type: string
 *           example: "60d5f1f77e12f3b4a9f6d8a1"
 *       - in: query
 *         name: select
 *         required: false
 *         description: Select specific fields to return (comma-separated).
 *         schema:
 *           type: string
 *           example: "rating,comment,user"
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Sort results by field (prefix with '-' for descending).
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of reviews per page.
 *         schema:
 *           type: integer
 *           default: 5
 *           example: 5
 *       - in: query
 *         name: rating[gte]
 *         required: false
 *         description: Filter reviews with rating greater than or equal to the value.
 *         schema:
 *           type: number
 *           example: 4
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Number of reviews returned in this page.
 *                   example: 2
 *                 totalReviews:
 *                   type: integer
 *                   description: Total number of reviews for this shop.
 *                   example: 15
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     next:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                     previous:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                   example: { next: { page: 2, limit: 5 } }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal server error.
 *
 *   post:
 *     summary: Create a new review for a shop
 *     description: Allows an authenticated user (role 'user') who has previously made a reservation at the specified shop to submit a review. Users cannot review the same shop twice.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         description: ID of the shop to review.
 *         schema:
 *           type: string
 *           example: "60d5f1f77e12f3b4a9f6d8a1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - header
 *               - comment
 *               - rating
 *             properties:
 *               header:
 *                 type: string
 *                 description: The title or header of the review.
 *                 maxLength: 50
 *                 example: "Excellent Service!"
 *               comment:
 *                 type: string
 *                 description: The main content of the review.
 *                 maxLength: 250
 *                 example: "The massage was very relaxing and the staff were friendly."
 *               rating:
 *                 type: number
 *                 format: integer
 *                 description: Rating from 1 to 5.
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Successfully created the review.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad Request (e.g., validation error, missing fields, rating out of range, user already reviewed this shop).
 *       401:
 *         description: Unauthorized (User not logged in, role is not 'user', or user has no prior reservation for this shop).
 *       404:
 *         description: Shop not found.
 *       500:
 *         description: Internal server error or cannot create review (e.g., database error).
 */

/**
 * @swagger
 * /api/v1/shops/{shopId}/reviews/{id}:
 *   put:
 *     summary: Update an existing review
 *     description: Allows the original author of the review (role 'user') to update their review. Requires authentication.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         description: ID of the shop the review belongs to.
 *         schema:
 *           type: string
 *           example: "60d5f1f77e12f3b4a9f6d8a1"
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to update.
 *         schema:
 *           type: string
 *           example: "61e0f1f77e12f3b4a9f6d8b2"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               header:
 *                 type: string
 *                 description: The updated title or header of the review.
 *                 maxLength: 50
 *                 example: "Great Experience!"
 *               comment:
 *                 type: string
 *                 description: The updated main content of the review.
 *                 maxLength: 250
 *                 example: "Updated my thoughts - still a great place."
 *               rating:
 *                 type: number
 *                 format: integer
 *                 description: Updated rating from 1 to 5.
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *     responses:
 *       200:
 *         description: Successfully updated the review.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad Request (e.g., validation error).
 *       401:
 *         description: Unauthorized (User not logged in or is not the author of the review).
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete a review
 *     description: Allows the original author of the review (role 'user') or an admin (role 'admin') to delete a review. Requires authentication.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         description: ID of the shop the review belongs to.
 *         schema:
 *           type: string
 *           example: "60d5f1f77e12f3b4a9f6d8a1"
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete.
 *         schema:
 *           type: string
 *           example: "61e0f1f77e12f3b4a9f6d8b2"
 *     responses:
 *       200:
 *         description: Successfully deleted the review.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: Empty array indicating successful deletion.
 *                   example: []
 *       401:
 *         description: Unauthorized (User not logged in, or user is not the author and not an admin).
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */