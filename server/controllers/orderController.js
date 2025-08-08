const Order = require("../models/order");
const Product = require("../models/product");
const Vendor = require("../models/venderProfile");

// create order for Cash on Delivery
exports.createOrder = async (req, res) => {
  try {
    const { productId, productPrice, quantity, totalPrice, shippingAddress } =
      req.body;

    if (
      !productId ||
      !productPrice ||
      !quantity ||
      !totalPrice ||
      !shippingAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const productsDetails = await Product.findById(productId);

    if (!productsDetails) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (productsDetails.stock < 1) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    if(productsDetails.stock < quantity){
        return res.status(400).json({
        success: false,
        message: "Insufficient stock available. Please reduce the quantity or check back later",
      });
    }

    const userId = req.user.userId;

    if(!userId){
           return res.status(400).json({
        success: false,
        message: "Something went wrong during fetching userId",
      });
    }

    //  create order
    const newOrder  = await Order.create({
        customer:userId,
        vendor:productsDetails.vendor,
        product:productId,
        productPrice:productPrice,
        quantity:quantity,
        totalPrice:totalPrice,
        status:"Processing",
        paymentMethod:"Cash on Delivery",
        shippingAddress:shippingAddress,
    }); 

    // update  product
    const updatedProduct = await Product.findByIdAndUpdate(productId,{
        stock:productsDetails.stock-quantity,
    });

    // return respnse 
    return res.status(200).json({
        success:true,
        message:"Order confirmed succesfully"
    })
    
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Internal server error",
    })
    
  }
};

// upadate order for both  cash on delivery and upi
exports.updateOrder = async (req, res) => {
  try {
    const { status, orderId } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is missing",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "OrderId is missing",
      });
    }

 
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    ).populate("customer").populate("product").exec();

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    //  If delivered, add customer to totalBuyers
    if (status === "Delivered") {
   if(updatedOrder.paymentMethod === "upi"){
       await Product.findByIdAndUpdate(
        updatedOrder.product._id,
        { $addToSet: { totalBuyers: updatedOrder.customer } }, 
        { new: true }
      );
   }
   else{
    // update order
    var updatedOrder1 = await Order.findByIdAndUpdate(orderId,{
        paid:true,
    },{new:true});

     await Product.findByIdAndUpdate(
        updatedOrder.product._id,
        { $addToSet: { totalBuyers: updatedOrder.customer } }, 
        { new: true }
      );
   }
     
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      updatedOrder:updatedOrder.paymentMethod === "upi" ? updatedOrder : updatedOrder1,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// my orders 
exports.myOrders = async(req,res)=>{
    try {
        // fetch userId
        const userId = req.user.userId;

        // validation
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong during fetching userId"
            })
        }

        // find all orders  of user
        const allOrders = await Order.find({customer:userId}).sort({createdAt:-1}).populate({
            path:"product",
            populate:{
                path:"reviews"
            }
        }).exec();

        // return response 
        return res.status(200).json({
            success:true,
            message:"Successfully fetched all orders of user",
            allOrders:allOrders,
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })
        
        
    }
}

// buyer cancel order 
exports.cancelOrder = async(req,res)=>{
    try {
        // fetch order Id
        const {orderId} = req.body;

        // validation
        if(!orderId){
            return res.status(400).json({
                success:false,
                message:"OrderId is missing"
            })
        }

        const userId = req.user.userId;

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong during fetching userId",
            })
        }

        // find order details 
        const orderDetails = await Order.findById(orderId);

        if(!orderDetails){
            return res.status(404).json({
                success:false,
                message:"Order not found",
            })
        }

        // check is this order is created by this user or not
        if(String(orderDetails.customer) !== String(userId)){
            return res.status(403).json({
                success:false,
                message:"Anauthorized user"
            })
        }

        // cancel the order
        const cancelOrder = await Order.findByIdAndUpdate(orderId,{
            status:"Cancelled",
        },{new:true})

        // update product stock
        const updatedProduct = await Product.findByIdAndUpdate(orderDetails.product,{
            $inc:{stock:orderDetails.quantity}
        },{new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"Order Cancelled successfully",
        })

        
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Internal Server error"
          })
      
    }
}


// return product 
exports.returnProduct = async(req,res)=>{
    try {
             // fetch order Id
        const {orderId} = req.body;

        // validation
        if(!orderId){
            return res.status(400).json({
                success:false,
                message:"OrderId is missing"
            })
        }

        const userId = req.user.userId;

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong during fetching userId",
            })
        }

        // find order details 
        const orderDetails = await Order.findById(orderId);

        if(!orderDetails){
            return res.status(404).json({
                success:false,
                message:"Order not found",
            })
        }

        // check is this order is created by this user or not
        if(String(orderDetails.customer) !== String(userId)){
            return res.status(403).json({
                success:false,
                message:"Anauthorized user"
            })
        }

        // update order for return product
        const updatedOrder = await Order.findByIdAndUpdate(orderId,{
            returnStatus:true,
        },{new:true})

        // return response
        return res.status(200).json({
            success:true,
            message:"Your return request has been successfully submitted. Our team will process it shortly",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })
        
    }
}

// vendor received  orders
exports.receivedOrder = async(req,res)=>{
  try {

    // fetch userId form requset
    const userId = req.user.userId;

    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong during fetching userId",
      })
    }

    // find vendorProfileId from this userId
    const vendorProfile = await Vendor.findOne({user:userId});

    if(!vendorProfile){
      return res.status(404).json({
        success:false,
        message:"Vendor profile missing or pending admin approval",
      })
    }

    // find all order with this vendorProfile Id and ignore product with status Cancelled and Delivered
   const allOrders = await Order.find({vendor: vendorProfile._id,status: { $nin: ["Cancelled", "Delivered"] }}).sort({createdAt:-1}).populate("product").populate("customer").exec();

   // return response
   return res.status(200).json({
    success:true,
    message:"All orders fetched Successfully",
    allOrders:allOrders,
   })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}


// order details 
exports.orderDetails = async(req,res)=>{
  try {
    // fetch orderId
    const {orderId} = req.params;

    // validation
    if(!orderId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong during fetching orderId"
      })
    };

    // find order details with this orderId
    const orderDetails = await Order.findById(orderId).populate("customer").populate("product").exec();

    if(!orderDetails){
      return res.status(404).json({
        success:false,
        message:"Order not found",
      })
    };

    // return response
    return res.status(200).json({
      success:true,
      message:"Successfully fetched orderDetails",
      orderDetails:orderDetails,
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}

// return products of vendor
exports.returnProducts = async(req,res)=>{
  try {
    // fetch userId
    const userId = req.user.userId;

    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong during fetching userId",
      })
    }

    // fetch vendorProfile
    const vendorProfile = await Vendor.findOne({user:userId});

    if(!vendorProfile){
      return res.status(404).json({
        success:false,
        message:"Vendor profile missing or pending admin approval",
      })
    }

    // find all return orders
    const allReturnOrders = await Order.find({vendor:vendorProfile._id,returnStatus:true}).populate("product").populate("customer").exec();

    // return response
    return res.status(200).json({
      success:true,
      message:"Successfully fetched all return products",
      allReturnOrders:allReturnOrders,
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}