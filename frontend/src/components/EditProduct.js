import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useParams, useNavigate } from 'react-router-dom';
import '../css/AddProduct.css'; // Pastikan Anda mengimpor file CSS

const EditProduct = () => {
    const [tittle, setTittle] = useState(''); // State untuk nama produk
    const [file, setFile] = useState(''); // State untuk file gambar
    const [preview, setPreview] = useState(''); // State untuk pratinjau gambar
    const navigate = useNavigate();
    const { id } = useParams(); // Ambil ID dari URL

    // Fungsi untuk mendapatkan data produk berdasarkan ID
    const getProductsById = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/products/${id}`);
            console.log('Product data:', response.data); // Debugging respons
            if (response.data) {
                setTittle(response.data.name || ''); // Gunakan properti "name" dari respons API
                setFile(response.data.Image || ''); // Properti "Image" untuk file
                setPreview(response.data.url || ''); // Properti "url" untuk pratinjau gambar
            } else {
                console.error('No product data found');
            }
        } catch (error) {
            console.error('Error fetching product by ID:', error);
        }
    }, [id]);

    // Panggil fungsi untuk mendapatkan data produk saat komponen dimuat
    useEffect(() => {
        console.log('Fetching product data...');
        getProductsById();
    }, [getProductsById]);

    // Fungsi untuk memuat gambar baru
    const LoadImage = (e) => {
        const image = e.target.files[0];
        if (image) { // Pastikan file valid sebelum diproses
            setFile(image);
            setPreview(URL.createObjectURL(image));
        } else {
            setFile('');
            setPreview('');
        }
    };

    // Fungsi untuk memperbarui data produk
    const UpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', tittle); // Gunakan "name" untuk mencocokkan dengan backend
        formData.append('file', file);

        console.log('FormData:', {
            name: tittle,
            file: file,
        }); // Debugging data yang dikirim

        try {
            const response = await axios.patch(`http://localhost:5000/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Product updated:', response.data);

            // Tampilkan pesan sukses menggunakan SweetAlert2
            Swal.fire({
                title: 'Berhasil!',
                text: 'Data berhasil diupdate.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                navigate('/'); // Redirect ke halaman daftar produk setelah berhasil
            });
        } catch (error) {
            console.error('Error updating product:', error);

            // Tampilkan pesan error menggunakan SweetAlert2
            Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat mengupdate data.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33',
            });
        }
    };

    return (
        <div className="columns is-centered mt-5">
            <div className="column is-half">
                <form onSubmit={UpdateProduct}>
                    <div className="field">
                        <label className="label">Product Name</label>
                        <div className="control">
                            <input
                                type="text"
                                className="input"
                                value={tittle}
                                onChange={(e) => setTittle(e.target.value)} // Perbarui state `tittle`
                                placeholder={tittle ? "Product Name" : "Loading..."} // Tambahkan placeholder untuk debugging
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Image</label>
                        <div className="control file-container">
                            <div className="file">
                                <label className="file-label">
                                    <input
                                        type="file"
                                        className="file-input"
                                        onChange={LoadImage} // Panggil fungsi untuk memuat gambar baru
                                    />
                                    <span className="file-cta">
                                        <span className="file-label">Choose A File...</span>
                                    </span>
                                </label>
                            </div>
                            {preview && (
                                <div className="preview-container">
                                    <img src={preview} alt="Preview" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button type="submit" className="button is-success">
                                Edit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;