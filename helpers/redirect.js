module.exports = (req, res) => {
    const page = req.body.page || 1;
    res.redirect(`/admin/products?page=${page}`);
}