import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AddProduct.css'; // Pastikan Anda mengimpor file CSS
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddProduct = () => {
    const [tittle, setTittle] = useState('');
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();

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

    const saveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('tittle', tittle);
        formData.append('file', file);
      
        try {
          await axios.post('http://localhost:5000/products', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          // Tampilkan notifikasi sukses
          Swal.fire({
            title: 'Success!',
            text: 'Product has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/'); // Redirect ke halaman daftar produk
          });
        } catch (error) {
          console.error('Error uploading product:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to add product. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      };

    return (
        <div className="columns is-centered mt-5">
            <div className="column is-half">
                <form onSubmit={saveProduct}>
                    <div className="field">
                        <label className="label">Product Name</label>
                        <div className="control">
                            <input
                                type="text"
                                className="input"
                                value={tittle}
                                onChange={(e) => setTittle(e.target.value)}
                                placeholder="Product Name"
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
                                        onChange={LoadImage}
                                    />
                                    <span className="file-cta">
                                        <span className="file-label">Choose A File...</span>
                                    </span>
                                </label>
                            </div>
                            {preview && (
                                <div className="preview-container">
                                    <img src={preview} alt="Preview" />
                                    <button type="submit" className="button is-success">
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;