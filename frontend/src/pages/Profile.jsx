import React, { useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Profile.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://karunya-travels-2.onrender.com/api';
const UPLOADS_BASE = API_BASE_URL.replace('/api', '');

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', licenseNumber: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      const u = res.data;
      setProfile({ name: u.name || '', email: u.email || '', phone: u.phone || '', licenseNumber: u.licenseNumber || '' });
      setAvatarUrl(u.avatar || '');
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.phone.trim()) { toast.error('Name and phone are required'); return; }
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ name: profile.name, phone: profile.phone, licenseNumber: profile.licenseNumber });
      updateUser({ name: res.data.user.name, phone: res.data.user.phone });
      toast.success('Profile updated successfully');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) { toast.error('All password fields are required'); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('New passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPw(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setChangingPw(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await authAPI.uploadAvatar(formData);
      setAvatarUrl(res.data.user.avatar);
      updateUser({ avatar: res.data.user.avatar });
      toast.success('Avatar updated');
    } catch { toast.error('Failed to upload avatar'); }
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return { level: 0, label: '', cls: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', cls: 'weak' };
    if (score <= 2) return { level: 2, label: 'Medium', cls: 'medium' };
    return { level: 3, label: 'Strong', cls: 'strong' };
  };

  const strength = getPasswordStrength(passwords.newPassword);

  if (loading) {
    return (
      <div className="pf-loading">
        <div className="pf-loading-spinner"></div>
        <span>Loading profile…</span>
      </div>
    );
  }

  const fullAvatarUrl = avatarUrl ? `${UPLOADS_BASE}${avatarUrl}` : '';
  const roleIcon = user?.role === 'driver' ? 'fa-steering-wheel' : user?.role === 'admin' ? 'fa-shield-alt' : 'fa-user';

  return (
    <div className="pf-page">
      <div className="pf-layout">
        {/* Left — Profile Card */}
        <aside className="pf-sidebar">
          <div className="pf-card-profile">
            <div className="pf-card-bg"></div>
            <div className="pf-avatar-section">
              <div className="pf-avatar-ring">
                <div className="pf-avatar">
                  {fullAvatarUrl
                    ? <img src={fullAvatarUrl} alt="Avatar" />
                    : profile.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <button className="pf-avatar-btn" onClick={() => fileInputRef.current?.click()}>
                  <i className="fas fa-camera"></i>
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarUpload} />
              </div>
              <h2 className="pf-user-name">{profile.name}</h2>
              <p className="pf-user-email">{profile.email}</p>
              <span className="pf-role-badge">
                <i className={`fas ${roleIcon}`}></i>
                {user?.role}
              </span>
            </div>

            <div className="pf-quick-stats">
              <div className="pf-stat-item">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <span className="pf-stat-label">Phone</span>
                  <span className="pf-stat-value">{profile.phone || '—'}</span>
                </div>
              </div>
              <div className="pf-stat-item">
                <i className="fas fa-circle-check"></i>
                <div>
                  <span className="pf-stat-label">Status</span>
                  <span className="pf-stat-value pf-status-active">Active</span>
                </div>
              </div>
              {user?.role === 'driver' && profile.licenseNumber && (
                <div className="pf-stat-item">
                  <i className="fas fa-id-card"></i>
                  <div>
                    <span className="pf-stat-label">License</span>
                    <span className="pf-stat-value">{profile.licenseNumber}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pf-tab-nav">
            <button className={`pf-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <i className="fas fa-user-pen"></i> Edit Profile
            </button>
            <button className={`pf-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              <i className="fas fa-shield-halved"></i> Security
            </button>
          </div>
        </aside>

        {/* Right — Forms */}
        <main className="pf-main">
          {activeTab === 'profile' && (
            <div className="pf-section animate-in">
              <div className="pf-section-top">
                <div>
                  <h3 className="pf-section-title">Personal Information</h3>
                  <p className="pf-section-desc">Update your personal details</p>
                </div>
                <div className="pf-section-icon">
                  <i className="fas fa-user-edit"></i>
                </div>
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="pf-form-grid">
                  <div className="pf-field">
                    <label><i className="fas fa-user"></i> Full Name</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                  </div>
                  <div className="pf-field">
                    <label><i className="fas fa-phone"></i> Phone</label>
                    <input type="text" value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" />
                  </div>
                  <div className="pf-field">
                    <label><i className="fas fa-envelope"></i> Email</label>
                    <input type="email" value={profile.email} readOnly />
                    <span className="pf-hint"><i className="fas fa-lock"></i> Email cannot be changed</span>
                  </div>
                  {user?.role === 'driver' && (
                    <div className="pf-field">
                      <label><i className="fas fa-id-card"></i> License Number</label>
                      <input type="text" value={profile.licenseNumber} onChange={(e) => setProfile(p => ({ ...p, licenseNumber: e.target.value }))} placeholder="License number" />
                    </div>
                  )}
                </div>
                <div className="pf-form-actions">
                  <button type="submit" className="pf-btn pf-btn-primary" disabled={saving}>
                    {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-check"></i> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="pf-section animate-in">
              <div className="pf-section-top">
                <div>
                  <h3 className="pf-section-title">Change Password</h3>
                  <p className="pf-section-desc">Ensure your account stays secure</p>
                </div>
                <div className="pf-section-icon security">
                  <i className="fas fa-lock"></i>
                </div>
              </div>

              <form onSubmit={handlePasswordChange}>
                <div className="pf-form-stack">
                  <div className="pf-field">
                    <label><i className="fas fa-key"></i> Current Password</label>
                    <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Enter current password" />
                  </div>
                  <div className="pf-field-divider">
                    <span>New Password</span>
                  </div>
                  <div className="pf-form-grid">
                    <div className="pf-field">
                      <label><i className="fas fa-lock"></i> New Password</label>
                      <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords(p => ({ ...p, newPassword: e.target.value }))} placeholder="Enter new password" />
                      {passwords.newPassword && (
                        <div className="pf-strength-wrap">
                          <div className="pf-strength-bars">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={`pf-str-bar ${i <= strength.level ? `active ${strength.cls}` : ''}`} />
                            ))}
                          </div>
                          <span className={`pf-str-label ${strength.cls}`}>{strength.label}</span>
                        </div>
                      )}
                    </div>
                    <div className="pf-field">
                      <label><i className="fas fa-lock"></i> Confirm Password</label>
                      <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm new password" />
                      {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                        <span className="pf-hint pf-error"><i className="fas fa-exclamation-circle"></i> Passwords do not match</span>
                      )}
                      {passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword && passwords.confirmPassword.length >= 6 && (
                        <span className="pf-hint pf-match"><i className="fas fa-check-circle"></i> Passwords match</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pf-form-actions">
                  <button type="submit" className="pf-btn pf-btn-primary" disabled={changingPw}>
                    {changingPw ? <><i className="fas fa-spinner fa-spin"></i> Changing...</> : <><i className="fas fa-key"></i> Update Password</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
