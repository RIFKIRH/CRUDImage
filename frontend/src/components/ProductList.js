import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ProductList.css';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Link } from 'react-router-dom';  

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
    }
  };

  const deleteProduct = async (id) => {
    // Tampilkan popup konfirmasi sebelum menghapus
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/products/${id}`);
          setProducts(products.filter((product) => product.id !== id));
          // Tampilkan notifikasi sukses
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        } catch (err) {
          console.error('Error deleting product:', err);
          setError('Failed to delete product. Please try again later.');
        }
      }
    });
  };

  return (
    <div className="container mt-5">
      <Link  className='button is-success' to="/add">Add Product</Link>
      {error && <p className="has-text-danger">{error}</p>}
      <div className="columns is-multiline is-flex">
        {Array.isArray(products) && products.map(product => (
          <div className="column is-one-quarter" key={product.id}>
            <div className="card custom-card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src={product.url || 'https://via.placeholder.com/300'} alt={product.name || 'Product Image'} />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{product.name}</p>
                  </div>
                </div>
              </div>
              <footer className="card-footer">
              <Link  className='button is-success' to={`edit/${product.id}`}>Edit Product</Link>
                <button
                  className="card-footer-item button is-white is-danger"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;