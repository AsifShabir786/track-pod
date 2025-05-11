import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const DriversLayers = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Alex Johnson', license: 'ABC12345', status: 'Active' },
    { id: 2, name: 'Sara Lee', license: 'XYZ67890', status: 'Inactive' },
  ]);
  const [newDriver, setNewDriver] = useState({ name: '', license: '', status: '' });
  const [showModal, setShowModal] = useState(false);

  const handleAddDriver = () => {
    const nextId = drivers.length + 1;
    setDrivers([...drivers, { id: nextId, ...newDriver }]);
    setNewDriver({ name: '', license: '', status: '' });
    setShowModal(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Drivers</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon icon="mdi:plus" className="me-1" /> Add Driver
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Driver ID</th>
              <th>Name</th>
              <th>License Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.license}</td>
                <td>{driver.status}</td>
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
                <h5 className="modal-title">Add New Driver</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Driver Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">License Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDriver.license}
                    onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newDriver.status}
                    onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleAddDriver}>
                  Add Driver
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

export default DriversLayers;
