const Product = require("../models/product");
const User = require("../models/user");
const crypto = require("crypto");
const Payment = require("../models/payment");
const { instance } = require("../config/razorpay");
const Order = require("../models/order");


// ORDER CREATION
exports.order = async (req, res) => {
  try {
    let { amount, productId, productPrice, quantity, totalPrice, shippingAddress } = req.body;
    amount = Number(totalPrice);

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount provided" });
    }

    if (!productId || !productPrice || !quantity || !totalPrice || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Insufficient data to create order",
      });
    }

    const productDetails = await Product.findById(productId);

    if (!productDetails) {
      return res.status(400).json({
        success: false,
        message: "Product is currently not available",
      });
    }

    if (productDetails.stock < 1) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    if(quantity > productDetails.stock ){
        return res.status(400).json({
        success: false,
        message: "Insufficient stock available. Please reduce the quantity or check back later",
      });
    }

    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong during fetching userId",
      });
    }


    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options); 


    const productOrder = await Order.create({
      customer: userId,
      vendor: productDetails.vendor,
      product: productId,
      productPrice: productPrice,
      quantity: quantity,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: "upi",
    });

    res.status(200).json({
      success: true,
      razorpayOrder: order,
      productOrder,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//  VERIFY PAYMENT
exports.verify = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      productId,
      vendorId,
      orderId,
    } = req.body;


    if (!userId || !productId || !vendorId || !orderId) {
  return res.status(400).json({ message: "Missing required fields" });
}

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if(product.stock < 1){
        return res.status(400).json({
            success:false,
            message:"Product is out of stock"
        })
    }

    // create order
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        productId,
        vendorId:vendorId,
      });

      await payment.save();

      // update order 
      const updatedOrder = await Order.findByIdAndUpdate(orderId,{
        paid:true,
        paymentId:razorpay_payment_id,
        status:"Processing",
      })

      

      await Product.findByIdAndUpdate(
        productId,
        { stock:product.stock-updatedOrder.quantity},
        { new: true }
      );
       
      

      return res.json({ message: "Payment Successful" });
    } else {
      return res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Payment Verification Failed" });
  }
};
