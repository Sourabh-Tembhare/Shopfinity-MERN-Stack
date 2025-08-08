const express = require("express");
const router = express.Router();

const {loginValidation,isVendor} = require("../middlewares/authentication");

const {order,verify} = require("../controllers/paymentController");
const {createOrder,updateOrder,myOrders,cancelOrder,returnProduct,receivedOrder,orderDetails,returnProducts}  = require("../controllers/orderController");

router.post("/upi-order",loginValidation,order);
router.post("/upi-order-verify",loginValidation,verify);
router.post("/cod-create-order",loginValidation,createOrder);
router.put("/update-order",loginValidation,isVendor,updateOrder);
router.get("/myOrders",loginValidation,myOrders);
router.put("/cancelOrder",loginValidation,cancelOrder);
router.put("/returnProduct",loginValidation,returnProduct);
router.get("/receivedOrder",loginValidation,isVendor,receivedOrder);
router.get("/orderDetails/:orderId",loginValidation,isVendor,orderDetails);
router.get("/returnProducts",loginValidation,isVendor,returnProducts);






module.exports = router;