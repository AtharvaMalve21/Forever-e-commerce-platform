import React, { useContext, useEffect } from "react";
import axios from "axios";
import { ProductContext } from "../context/ProductContext.jsx";

//future scope add pagination set filters

const UserDashboard = () => {
  const { products, setProducts } = useContext(ProductContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/product");

      console.log(data);
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id}>
            <p>Category: {product.category}</p>
            <p>subCategory: {product.subCategory}</p>
            <h1>{product.product_name}</h1>
            <p>{product.product_description}</p>
            <p>{product.price}</p>
            <div className="flex gap-2">
              {product.photos.map((photo) => (
                <img
                  width="100px"
                  height={100}
                  src={`${URI}/${photo}`}
                  alt=""
                />
              ))}
            </div>
            <ul className="flex gap-2">
              {product.sizes.map((size) => (
                <li
                  className="cursor-pointer hover:border border-blue-200 p-2 mt-2"
                  onClick={() => {
                    alert(`Size: ${size}`);
                  }}
                >
                  {size}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div>No Products found</div>
      )}
    </div>
  );
};

export default UserDashboard;
