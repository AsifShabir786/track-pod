import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UsersListLayer = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:9001/users/api/auth/users')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch users');
        setLoading(false);
      });
  }, []);

  // Filtering function
  useEffect(() => {
    let filtered = [...users];

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter(user =>
        user.role && user.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Filter by status (active / inactive)
    if (statusFilter) {
      filtered = filtered.filter(user => {
        const isActive = user.role === 'admin';
        return statusFilter === 'active' ? isActive : !isActive;
      });
    }

    // Filter by search term in firstName, lastName, or email
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        (user.firstName && user.firstName.toLowerCase().includes(lowerSearch)) ||
        (user.lastName && user.lastName.toLowerCase().includes(lowerSearch)) ||
        (user.email && user.email.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredUsers(filtered);
  }, [roleFilter, statusFilter, searchTerm, users]);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
        <h3>User List</h3>
        <Link to="/add-user" className="btn btn-primary btn-sm px-3 py-1 radius-8">
          Add New User
        </Link>
      </div>

      {/* Filters Section */}
      <div className="card-body p-3 d-flex gap-3 flex-wrap" style={{ alignItems: 'center' }}>
        <select
          className="form-control"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>

        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ minWidth: '250px' }}
        />
      </div>

      <div className="card-body p-24">
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="table bordered-table mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '8px' }}>S.L</th>
                <th style={{ padding: '8px' }}>Join Date</th>
                <th style={{ padding: '8px' }}>Name</th>
                <th style={{ padding: '8px' }}>Email</th>
                <th style={{ padding: '8px' }}>Department</th>
                <th style={{ padding: '8px' }}>Designation</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const joinDate = user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-GB')
                  : 'N/A';
                const department = user.department || 'N/A';
                const designation = user.designation || 'N/A';
                const isActive = user.role === 'admin';

                return (
                  <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{index + 1}</td>
                    <td style={{ padding: '8px' }}>{joinDate}</td>
                    <td style={{ padding: '8px' }}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td style={{ padding: '8px' }}>{user.email}</td>
                    <td style={{ padding: '8px' }}>{department}</td>
                    <td style={{ padding: '8px' }}>{designation}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          color: isActive ? '#155724' : '#721c24',
                          backgroundColor: isActive ? '#d4edda' : '#f8d7da',
                          display: 'inline-block',
                          fontWeight: '600',
                        }}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button style={{ marginRight: '8px' }}>View</button>
                      <button style={{ marginRight: '8px' }}>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersListLayer;
