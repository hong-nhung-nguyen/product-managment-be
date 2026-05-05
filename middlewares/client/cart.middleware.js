const Cart = require("../../models/cart.model");

const createCart = async(req, res) => {
    const cart = new Cart();
    await cart.save();

    const expiresCookie = 1000 * 60 * 60 * 24 * 365;

    res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresCookie)
    });
}

module.exports.cartId = async(req, res, next) => {
    let cart;

    if (!req.cookies.cartId) {
        cart = await createCart(req, res);
    } else {
        // fetch the cart
        cart = await Cart.findOne({
            _id: req.cookies.cartId
        });

        // If cookie exists but cart not found (doesnt exist in databse)
        if (!cart) {
            cart = await createCart(req, res);
        }
    }

    cart.totalQuantity = cart.products.reduce((total, product) => {
        return total + product.quantity;
    }, 0);

    res.locals.miniCart = cart;

    next();
}