const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/product");

// [GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId });

    if(cart.products.length > 0) {
        for(const item of cart.products) {
            const productInfo = await Product.findOne(
                { _id: item.product_id }
            ).select("_id title thumbnail price discountPercentage slug");
            
            productInfo.priceNew = productHelper.priceNewProducts([productInfo])[0].priceNew;

            item.productInfo = productInfo;

            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }

    const cartTotalPrice = cart.products.reduce((total, item) => {
        return total + item.totalPrice;
    }, 0);
    cart.totalPrice = cartTotalPrice;
    
    
    res.render("client/pages/cart/index.pug", {
        pageTitle: "Giỏ hàng",
        cart: cart
    });
}


// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
    const productSlug = req.body.productSlug;

    const cart = await Cart.findOne({ _id: cartId });
    
    const existProductInCart = cart.products.find(item => item.product_id == productId);

    if (existProductInCart) {
        // update the quantity only
        const quantityNew = quantity + existProductInCart.quantity;

        await Cart.updateOne(
            { 
                _id: cartId,
                "products.product_id": productId
            }, 
            {
                $set: {
                    "products.$.quantity": quantityNew
                }   
            }
        )
        
    } else {
        // add one more product object into cart
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }

        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products: objectCart }
            }
        );
    }

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    
    res.redirect(`/products/detail/${productSlug}`);
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne({
        _id: cartId,
    }, {
        $pull: { products: { product_id: productId } }
    })

    req.flash("success", "Đã xóa sản phẩm");
    res.redirect("/cart");
}

// [GET] /cart/update/:productId/:quantity
module.exports.updateQuantity = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
    }, {
        $set: {
            "products.$.quantity": quantity
        }
    })

    req.flash("success", "Cập nhật số lượng thành công");
    res.redirect("/cart");

}

