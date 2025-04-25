import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;
const Product = db.define('products', {
    name : DataTypes.STRING,
    Image : DataTypes.STRING,
    url : DataTypes.STRING
},{
    freezeTableName: true,

});

export default Product;

(async () => {
    await db.sync();
}
)();
