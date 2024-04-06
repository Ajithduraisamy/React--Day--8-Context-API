import 'bootstrap/dist/css/bootstrap.css';
import { CartContext } from '../Context/cart';
import { useContext, useEffect, useState } from 'react';
import Cart from './Cart';

function Products() {
    const [product, setProduct] = useState([]);

    var data = async () => {
        try {
            var res = await fetch("https://dummyjson.com/products");
            var final_res = await res.json();
            console.log(final_res.products);
            setProduct(final_res.products);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        data();
    }, []);

    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

    const isItemInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
    };

    return (
        <>
            <div className="container px-4 px-lg-5 mt-5">
                <div className="d-flex flex-wrap justify-content-between">
                    <h1>SHOP</h1>
                    <Cart cartItems={cartItems} />
                </div>
            </div>

            <div className="container px-4 px-lg-5 mt-5">
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {product.map((product) => (
                        <div className="col mb-5" key={product.id}>
                            <div className="card h-100" style={{ width: "15rem" }}>
                                <img className="card-img-top" src={product.thumbnail} style={{ width: "15rem", height: "15rem" }} />
                                <div className="card-body p-4">
                                    <div className="text-center">
                                        <h5 className="fw-bolder">{product.title}</h5>
                                        {`$${product.price}.00`}
                                    </div>
                                </div>
                                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                    <div className="text-center">
                                        {isItemInCart(product.id) ? (
                                            <button onClick={() => handleRemoveFromCart(product.id)} className="btn btn-outline-danger">Remove from cart</button>
                                        ) : (
                                            <button onClick={() => handleAddToCart(product)} className="btn btn-outline-primary">Add to cart</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Products;
