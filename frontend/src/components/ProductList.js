import React from 'react';

const ProductList = () => {
  return (
    <div className="container mt-5">
      <div className="columns is-multiline">
        <div className="column is-one-quarter">
          <div className="card">
            <div className="card-image">
              <figure className="image is-4by3">
                {/* Gambar menggunakan URL dari baris 11 */}
                <img src="/images/dubu.jpg" alt="Placeholder" />
              </figure>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content">
                  <p className="title is-4">Istri Rifki Ril</p>
                  <p className="subtitle is-6">cicak@gmail.com</p>
                </div>
              </div>
            </div>
            <footer className="card-footer">
              <button
                className="card-footer-item button is-white"
                onClick={() => console.log('Edit clicked')}
              >
                Edit
              </button>
              <button
                className="card-footer-item button is-white"
                onClick={() => console.log('Delete clicked')}
              >
                Delete
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;