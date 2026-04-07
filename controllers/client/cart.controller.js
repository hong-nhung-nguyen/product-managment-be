const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

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