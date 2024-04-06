import { useContext, useState, useEffect } from "react";
import { CartContext } from "../Context/cart";
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css'

function Cart() {
    const { cartItems, removeFromCart } = useContext(CartContext);

    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);
    const handleShow = () => setLgShow(true);

    const [itemQuantities, setItemQuantities] = useState(() => {
        // Retrieve item quantities from local storage, or default to an empty object
        const storedItemQuantities = localStorage.getItem('itemQuantities');
        return storedItemQuantities ? JSON.parse(storedItemQuantities) : {};
    });

    useEffect(() => {
        // Store item quantities in local storage whenever it changes
        localStorage.setItem('itemQuantities', JSON.stringify(itemQuantities));
    }, [itemQuantities]);

    useEffect(() => {
        // Initialize item quantities with current cart items
        const initialQuantities = {};
        cartItems.forEach(item => {
            // Check if the item exists in itemQuantities state
            // If it does, maintain its quantity, otherwise set to 1
            initialQuantities[item.id] = itemQuantities[item.id] || 1;
        });
        setItemQuantities(initialQuantities);
    }, [cartItems, itemQuantities]);

    const handleChange = (e, itemId) => {
        const selectedQuantity = parseInt(e.target.value);
        setItemQuantities(prevState => ({
            ...prevState,
            [itemId]: selectedQuantity
        }));
    }

    const handleRemove = (item) => {
        removeFromCart(item.id);
        // Remove the item from itemQuantities
        setItemQuantities(prevState => {
            const updatedQuantities = { ...prevState };
            delete updatedQuantities[item.id];
            return updatedQuantities;
        });
    }

    const getCartTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * itemQuantities[item.id];
        });
        return total.toFixed(2);
    }

    return (
        <>
            <button className="btn btn-outline-dark" onClick={handleShow}>
                <i className="bi-cart-fill me-1"></i>
                Cart
                <span className="badge bg-dark text-white ms-1 rounded-pill">{cartItems.length}</span>
            </button>

            <Modal
                size="lg"
                show={lgShow}
                onHide={handleClose}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        CART ITEMS
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        {cartItems.length === 0 ? 
                            <div> Currently no items found in cart. </div> 
                            : 
                            <div>
                                {cartItems.map(item => (
                                    <div className="card mb-3" key={item.id}>
                                        <div className="row no-gutters">
                                            <div className="col-md-4">
                                                <img src={item.thumbnail} style={{ width: "14rem", height: "14rem" }} alt={item.title} />
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card-body">
                                                    <p><b>Brand: </b>{`${item.brand} ${item.title}`}</p>
                                                    <p>{item.description}</p>
                                                    <p><b>Discount: </b>{`${item.discountPercentage}%`}</p>
                                                    <p><b>Rating: </b>{`${item.rating}/5`}</p>
                                                    <p><b>Stock: </b>{`${item.stock} items`}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card-body">
                                                    <select name="qty" value={itemQuantities[item.id]} onChange={(e) => handleChange(e, item.id)}>
                                                        {[...Array(item.stock)].map((_, index) => (
                                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                                        ))}
                                                    </select>
                                                    <h5 className="card-title">${(item.price * itemQuantities[item.id]).toFixed(2)}</h5>
                                                    <h6 onClick={() => handleRemove(item)} className="text-danger">REMOVE</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="subtotal">
                                    <div className="sub">SUBTOTAL: <span>${getCartTotal()}</span></div>
                                    <div className='shipping'>SHIPPING: <span><b>FREE</b></span></div>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-md-12">
                                        <h5 className="total">TOTAL: <span>${getCartTotal()}</span></h5>
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Cart;
