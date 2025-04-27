import Product from "../models/productModels.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({ where: { id: req.params.id } });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveProduct = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No file uploaded" });
    const name = req.body.name;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid image type" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5mb" });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Product.create({ name: name, Image: fileName, url: url });
            res.status(201).json({ msg: "Product Created Successfully" });
        } catch (error) {
            console.log(error.message);
        }
    });
};

export const updateProduct = async (req, res) => {
    try {
        // Cari produk berdasarkan ID
        const product = await Product.findOne({ where: { id: req.params.id } });
        if (!product) return res.status(404).json({ msg: "No data found" });

        let fileName = product.Image; // Default ke nama file lama
        if (req.files && req.files.file) { // Periksa apakah file baru diunggah
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            const allowedType = ['.png', '.jpg', '.jpeg'];

            // Validasi tipe file dan ukuran
            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "Invalid image type" });
            }
            if (fileSize > 5000000) {
                return res.status(422).json({ msg: "Image must be less than 5MB" });
            }

            // Hapus file lama jika ada
            const filePath = `./public/images/${product.Image}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Simpan file baru
            fileName = file.md5 + ext;
            file.mv(`./public/images/${fileName}`, (err) => {
                if (err) {
                    console.error(`Error moving file: ${err.message}`);
                    return res.status(500).json({ msg: "Failed to upload new image" });
                }
            });
        }

        // Update data produk di database
        const name = req.body.name || product.name; // Gunakan "name" dari body, atau default ke nama lama
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        await Product.update(
            { name: name, Image: fileName, url: url },
            { where: { id: req.params.id } }
        );

        res.status(200).json({
            msg: "Product Updated Successfully",
            product: {
                id: req.params.id,
                name: name,
                Image: fileName,
                url: url,
            },
        });
    } catch (error) {
        console.error(`Error in updateProduct: ${error.message}`);
        res.status(500).json({ msg: "An error occurred" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id } });
        if (!product) return res.status(404).json({ msg: "No data found" });

        const filePath = `./public/images/${product.Image}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Product.destroy({ where: { id: req.params.id } });
        res.status(200).json({ msg: "Product Deleted Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "An error occurred" });
    }
};