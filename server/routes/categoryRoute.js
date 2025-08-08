const express = require("express");
const router  = express.Router();


const {createCategory,getAllCategories,categoryPageDetails} = require("../controllers/categoryController");
const {loginValidation,isAdmin} = require("../middlewares/authentication");

router.post("/create-category",loginValidation,isAdmin,createCategory);
router.get("/getAllCategories",getAllCategories);
router.get("/categoryPageDetails/:categoryId",categoryPageDetails);



module.exports = router;