import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const OrdersLayer = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', item: 'Mattress A', status: 'Pending' },
    { id: 2, customer: 'Jane Smith', item: 'Bed Frame B', status: 'Shipped' },
  ]);
  const [newOrder, setNewOrder] = useState({ customer: '', item: '', status: '' });
  const [showModal, setShowModal] = useState(false);

  const handleAddOrder = () => {
    const nextId = orders.length + 1;
    setOrders([...orders, { id: nextId, ...newOrder }]);
    setNewOrder({ customer: '', item: '', status: '' });
    setShowModal(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Orders</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon icon="mdi:plus" className="me-1" /> Add Order
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.item}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Order</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newOrder.item}
                    onChange={(e) => setNewOrder({ ...newOrder, item: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleAddOrder}>
                  Add Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default OrdersLayer;
