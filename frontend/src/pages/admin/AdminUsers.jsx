import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedRole, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'status-completed',
      driver: 'status-started',
      customer: 'status-assigned'
    };

    const roleIcons = {
      admin: 'fa-shield-alt',
      driver: 'fa-car',
      customer: 'fa-user'
    };

    return (
      <span className={`status-badge ${roleClasses[role] || 'status-pending'}`}>
        <i className={`fas ${roleIcons[role]}`}></i> {role.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`status-badge ${isActive ? 'status-completed' : 'status-pending'}`}>
        <i className={`fas ${isActive ? 'fa-check-circle' : 'fa-times-circle'}`}></i> {isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}><i className="fas fa-users"></i> Manage Users</h2>

        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Total Users</h4>
            <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{users.length}</h2>
            <small style={{ color: '#9ca3af' }}>All time</small>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Customers</h4>
            <h2 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>
              {users.filter(u => u.role === 'customer').length}
            </h2>
            <small style={{ color: '#9ca3af' }}>Active renters</small>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Drivers</h4>
            <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>
              {users.filter(u => u.role === 'driver').length}
            </h2>
            <small style={{ color: '#9ca3af' }}>Fleet drivers</small>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Active</h4>
            <h2 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>
              {users.filter(u => u.isActive).length}
            </h2>
            <small style={{ color: '#9ca3af' }}>Currently active</small>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '0.75rem' }}
                />
              </div>
              <select
                className="form-control"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{ width: 'auto', minWidth: '150px', padding: '0.75rem' }}
              >
                <option value="all">All Roles ({users.length})</option>
                <option value="customer">Customers ({users.filter(u => u.role === 'customer').length})</option>
                <option value="driver">Drivers ({users.filter(u => u.role === 'driver').length})</option>
                <option value="admin">Admins ({users.filter(u => u.role === 'admin').length})</option>
              </select>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '1rem', display: 'block' }}></i>
            <p style={{ color: '#6c757d' }}>No users found matching your search</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th>User Info</th>
                  <th>Contact Details</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>License</th>
                  <th>Availability</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td style={{ minWidth: '150px' }}>
                      <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '0.25rem' }}>{user.name}</strong>
                      <small style={{ color: '#6c757d' }}>ID: {user._id.slice(-8)}</small>
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <div style={{ lineHeight: '1.6' }}>
                        <div><i className="fas fa-envelope" style={{ color: '#667eea', marginRight: '0.5rem', minWidth: '14px' }}></i>{user.email}</div>
                        <div><i className="fas fa-phone" style={{ color: '#667eea', marginRight: '0.5rem', minWidth: '14px' }}></i>{user.phone}</div>
                      </div>
                    </td>
                    <td style={{ minWidth: '100px' }}>{getRoleBadge(user.role)}</td>
                    <td style={{ minWidth: '100px' }}>{getStatusBadge(user.isActive)}</td>
                    <td style={{ minWidth: '120px' }}>
                      {user.licenseNumber ? (
                        <span style={{ fontFamily: 'monospace', backgroundColor: '#f3f4f6', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {user.licenseNumber}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ minWidth: '100px' }}>
                      {user.role === 'driver' ? (
                        <span className={`status-badge ${user.isAvailable ? 'status-completed' : 'status-pending'}`}>
                          <i className={`fas fa-circle`}></i> {user.isAvailable ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ minWidth: '140px' }}>
                      <div style={{ lineHeight: '1.6' }}>
                        <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                        <small style={{ color: '#6c757d' }}>{new Date(user.createdAt).toLocaleTimeString()}</small>
                      </div>
                    </td>
                    <td style={{ minWidth: '120px' }}>
                      {user.role !== 'admin' && (
                        <button
                          className={`btn btn-sm ${user.isActive ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                          onClick={() => toggleUserStatus(user._id)}
                        >
                          <i className={`fas ${user.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                          {user.isActive ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px', textAlign: 'right', color: '#6c757d', fontSize: '0.9rem' }}>
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;