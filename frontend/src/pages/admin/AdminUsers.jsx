import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminUsers.css';

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
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(searchTerm)
      );
    }
    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?';
  const countByRole = (role) => users.filter(u => u.role === role).length;

  if (loading) {
    return (
      <div className="au-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="au-page">
      {/* Header */}
      <div className="au-header">
        <div>
          <h1><i className="fas fa-users"></i> Users</h1>
          <p>Manage customers, drivers, and admin accounts</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="au-stats">
        <div className="au-stat-card">
          <div className="au-stat-icon blue"><i className="fas fa-users"></i></div>
          <div className="au-stat-info">
            <h4>{users.length}</h4>
            <span>Total Users</span>
          </div>
        </div>
        <div className="au-stat-card">
          <div className="au-stat-icon purple"><i className="fas fa-user"></i></div>
          <div className="au-stat-info">
            <h4>{countByRole('customer')}</h4>
            <span>Customers</span>
          </div>
        </div>
        <div className="au-stat-card">
          <div className="au-stat-icon green"><i className="fas fa-id-badge"></i></div>
          <div className="au-stat-info">
            <h4>{countByRole('driver')}</h4>
            <span>Drivers</span>
          </div>
        </div>
        <div className="au-stat-card">
          <div className="au-stat-icon orange"><i className="fas fa-check-circle"></i></div>
          <div className="au-stat-info">
            <h4>{users.filter(u => u.isActive).length}</h4>
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="au-card">
        {/* Toolbar */}
        <div className="au-toolbar">
          <div className="au-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="au-role-tabs">
            {[
              { key: 'all', label: 'All', count: users.length },
              { key: 'customer', label: 'Customers', count: countByRole('customer') },
              { key: 'driver', label: 'Drivers', count: countByRole('driver') },
              { key: 'admin', label: 'Admins', count: countByRole('admin') }
            ].map(tab => (
              <button
                key={tab.key}
                className={`au-role-tab ${selectedRole === tab.key ? 'active' : ''}`}
                onClick={() => setSelectedRole(tab.key)}
              >
                {tab.label} <span className="au-role-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="au-user-list">
          {filteredUsers.length === 0 ? (
            <div className="au-empty">
              <i className="fas fa-user-slash"></i>
              <p>No users found matching your search</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div className="au-user-row" key={user._id}>
                <div className={`au-user-avatar ${user.role}`}>
                  {getInitials(user.name)}
                </div>
                <div className="au-user-info">
                  <div className="au-user-name">
                    {user.name}
                    <span className={`au-role-badge ${user.role}`}>
                      <i className={`fas ${user.role === 'admin' ? 'fa-shield-alt' : user.role === 'driver' ? 'fa-car' : 'fa-user'}`}></i>
                      {user.role}
                    </span>
                  </div>
                  <div className="au-user-contact">
                    <span><i className="fas fa-envelope"></i> {user.email}</span>
                    <span><i className="fas fa-phone"></i> {user.phone}</span>
                    {user.licenseNumber && (
                      <span><i className="fas fa-id-card"></i> {user.licenseNumber}</span>
                    )}
                  </div>
                </div>
                <div className="au-user-meta">
                  <div className="au-user-tags">
                    <span className={`au-status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      <i className={`fas ${user.isActive ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {user.role === 'driver' && (
                      <span className={`au-avail-badge ${user.isAvailable ? 'online' : 'offline'}`}>
                        <i className="fas fa-circle"></i>
                        {user.isAvailable ? 'Online' : 'Offline'}
                      </span>
                    )}
                    <span className="au-user-date">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user.role !== 'admin' && (
                    <button
                      className={`au-action-btn ${user.isActive ? 'danger' : ''}`}
                      onClick={() => toggleUserStatus(user._id)}
                      title={user.isActive ? 'Disable user' : 'Enable user'}
                    >
                      <i className={`fas ${user.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="au-footer">
          <span className="au-footer-text">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
