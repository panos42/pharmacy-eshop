import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams(); // Extract order ID from URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/orders/${id}`)
      .then(res => {
        if (!res.ok) {
          // If the server doesn't respond with a successful status code, handle it
          throw new Error('Failed to fetch order');
        }
        return res.json(); // Parse the JSON response
      })
      .then(data => setOrder(data)) // Set the order state with the data
      .catch(err => console.error('Error fetching order:', err)); // Log any errors
  }, [id]); // Re-fetch when the order ID changes

  if (!order) {
    return <p>Loading...</p>; // Show a loading message while the order is being fetched
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> {order.total}€</p>
      <h3>Items:</h3>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.name} x {item.quantity} ({item.price}€ each)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetail;
