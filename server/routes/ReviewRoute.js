const express =  require("express");
const router = express.Router();

const {createReview,updateReview,getProductReviews} =  require("../controllers/reviewController");
const {loginValidation} = require("../middlewares/authentication");

router.post("/create-review",loginValidation,createReview);
router.put("/update-review",loginValidation,updateReview);
router.get("/getProductReviews/:productId",getProductReviews);



module.exports = router;

