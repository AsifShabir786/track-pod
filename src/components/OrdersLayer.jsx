import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const OrdersLayer = () => {
  const [orders, setOrders] = useState([]);
  console.log(orders,'orders_______')
  const [visibleColumns, setVisibleColumns] = useState({
    Number: true,
    Date: true,
    Client: true,
    Address: true,
    Status: true,
    Email: true,
    Phone: true,
    Note: true,
    DriverName: true,
    TrackLink: true,
  });

  useEffect(() => {
    fetch('https://trackpod-server.vercel.app/orders', {
      headers: {
        'accept': 'text/plain',
        'X-API-KEY': '0c340847-b764-4ff8-9250-0bb089486648',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch((error) => console.error('API Error:', error));
  }, []);

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Orders</h2>
      </div>

      {/* Column Selector */}
      <div className="mb-3">
        <strong>Toggle Columns:</strong>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {Object.keys(visibleColumns).map((col) => (
            <div key={col} className="form-check me-3">
              <input
                type="checkbox"
                className="form-check-input"
                id={col}
                checked={visibleColumns[col]}
                onChange={() => toggleColumn(col)}
              />
              <label className="form-check-label" htmlFor={col}>
                {col}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              {visibleColumns.Number && <th>Order #</th>}
              {visibleColumns.Date && <th>Date</th>}
              {visibleColumns.Client && <th>Client</th>}
              {visibleColumns.Address && <th>Address</th>}
              {visibleColumns.Status && <th>Status</th>}
              {visibleColumns.Email && <th>Email</th>}
              {visibleColumns.Phone && <th>Phone</th>}
              {visibleColumns.Note && <th>Note</th>}
              {visibleColumns.DriverName && <th>Driver</th>}
              {visibleColumns.TrackLink && <th>Tracking</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                {visibleColumns.Number && <td>{order.Number}</td>}
                {visibleColumns.Date && <td>{new Date(order.Date).toLocaleString()}</td>}
                {visibleColumns.Client && <td>{order.Client}</td>}
                {visibleColumns.Address && <td>{order.Address}</td>}
                {visibleColumns.Status && <td>{order.Status}</td>}
                {visibleColumns.Email && <td>{order.Email}</td>}
                {visibleColumns.Phone && <td>{order.Phone}</td>}
                {visibleColumns.Note && <td>{order.Note}</td>}
                {visibleColumns.DriverName && <td>{order.DriverName}</td>}
                {visibleColumns.TrackLink && (
                  <td>
                    <a href={order.TrackLink} target="_blank" rel="noopener noreferrer">
                      Track Order
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersLayer;
