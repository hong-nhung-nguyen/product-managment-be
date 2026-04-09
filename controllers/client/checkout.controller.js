const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helpers/product");

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId });

    if(cart.products.length > 0) {
        for(const item of cart.products) {
            const productInfo = await Product.findOne({
                _id: item.product_id
            }).select("_id title thumbnail price discountPercentage slug");

            productInfo.priceNew = productHelper.priceNewProducts([productInfo])[0].priceNew;

            item.productInfo = productInfo;

            item.totalPrice = item.quantity * productInfo.priceNew;
        };

        const cartTotalPrice = cart.products.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);
        cart.totalPrice = cartTotalPrice;
    }
    res.render("client/pages/checkout/index.pug", {
        pageTitle: "Đặt hàng",
        cart: cart,
    })
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    
    const cart = await Cart.findOne({
        _id: cartId
    });

    const products = [];

    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };

        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("price discountPercentage");

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objectProduct);
    };

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    }

    const order = new Order(orderInfo);
    order.save();

    // reset the miniCart header back to 0
    await Cart.updateOne({
        _id: cartId,
    }, {
        products: [],
    })

    req.flash("Đặt hàng thành công");
    res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
        _id: orderId
    });

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail slug");

        product.productInfo = productInfo;

        product.priceNew = productHelper.priceNewProducts([product])[0].priceNew;

        product.totalPrice = product.priceNew * product.quantity;
    };

    const orderTotalPrice = order.products.reduce((total, item) => {
        return total + item.totalPrice;
    }, 0);

    order.totalPrice = orderTotalPrice;

    res.render("client/pages/checkout/success.pug", {
        pageTitle: "Đặt hàng thành công",
        order: order
    })
}
