const ProductCategory = require("../models/productCategory.module")

module.exports.getSubCategory = (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const childs = await getCategory(sub.id);
            allSub = allSub.concat(childs);
        };

        return allSub;
    }

    const result = getCategory(parentId);
    return result;
}
