import React, { useState, useEffect } from 'react';
import { driversAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './DriverLocation.css';

const DriverLocation = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, address: '' });
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geoloading, setGeoLoading] = useState(false);
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [offlineReason, setOfflineReason] = useState('');

  useEffect(() => { fetchCurrentLocation(); }, []);

  const fetchCurrentLocation = async () => {
    try {
      const response = await driversAPI.getLocation();
      setLocation(response.data);
      setIsAvailable(response.data.isAvailable || false);
    } catch (error) {
      toast.error('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = () => {
    setGeoLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({ ...prev, latitude, longitude }));
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation((prev) => ({
              ...prev,
              address: data.address?.road || data.address?.suburb || data.address?.city || 'Location Updated'
            }));
          } catch (error) {
            setLocation((prev) => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          } finally {
            setGeoLoading(false);
          }
        },
        (error) => { toast.error('Failed to get location: ' + error.message); setGeoLoading(false); }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
      setGeoLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setLocation((prev) => ({ ...prev, address: e.target.value }));
  };

  const updateLocation = async () => {
    if (!location.latitude || !location.longitude) { toast.error('Please select a location first'); return; }
    setSaving(true);
    try {
      await driversAPI.updateLocation({ latitude: location.latitude, longitude: location.longitude, address: location.address });
      toast.success('Location updated successfully');
    } catch (error) {
      toast.error('Failed to update location');
    } finally {
      setSaving(false);
    }
  };

  const handleGoOfflineClick = () => { setShowOfflineForm(true); };

  const confirmGoOffline = async () => {
    if (!offlineReason.trim()) { toast.error('Please provide a reason for going offline'); return; }
    try {
      await driversAPI.updateAvailability(false, offlineReason.trim());
      setIsAvailable(false);
      setShowOfflineForm(false);
      setOfflineReason('');
      toast.success('You are now OFFLINE');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const updateAvailability = async (newStatus) => {
    try {
      await driversAPI.updateAvailability(newStatus);
      setIsAvailable(newStatus);
      setShowOfflineForm(false);
      setOfflineReason('');
      toast.success(`You are now ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="dl-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading location data…</span>
      </div>
    );
  }

  return (
    <div className="dl-page">
      {/* ── Banner ── */}
      <div className="dl-banner">
        <h1><i className="fas fa-map-marker-alt"></i> My Location & Availability</h1>
        <p>Keep your location updated and stay online to receive more orders.</p>
      </div>

      {/* ── Availability Section ── */}
      <div className="dl-section">
        <div className="dl-section-header">
          <i className="fas fa-signal"></i>
          <h3>Availability Status</h3>
        </div>
        <div className="dl-section-body">
          <div className={`dl-status-strip ${isAvailable ? 'online' : 'offline'}`}>
            <span className="dl-status-dot"></span>
            <span className="dl-status-label">{isAvailable ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          <p className="dl-status-hint">
            {isAvailable ? 'You will receive new orders' : 'You will not receive new orders'}
          </p>

          <div className="dl-toggle-group">
            <button
              onClick={() => updateAvailability(true)}
              className={`dl-toggle-btn go-online ${isAvailable ? 'active' : ''}`}
            >
              <i className="fas fa-toggle-on"></i> Go Online
            </button>
            <button
              onClick={handleGoOfflineClick}
              className={`dl-toggle-btn go-offline ${!isAvailable ? 'active' : ''}`}
            >
              <i className="fas fa-toggle-off"></i> Go Offline
            </button>
          </div>

          {showOfflineForm && (
            <div className="dl-offline-form">
              <label>
                <i className="fas fa-exclamation-circle"></i> Reason for going offline *
              </label>
              <select value={offlineReason} onChange={(e) => setOfflineReason(e.target.value)}>
                <option value="">Select a reason...</option>
                <option value="Personal work">Personal work</option>
                <option value="Vehicle maintenance">Vehicle maintenance</option>
                <option value="Health issue">Health issue</option>
                <option value="Break / Rest">Break / Rest</option>
                <option value="End of shift">End of shift</option>
                <option value="Other">Other</option>
              </select>
              {offlineReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify your reason..."
                  onChange={(e) => setOfflineReason(e.target.value || 'Other')}
                />
              )}
              <div className="dl-offline-actions">
                <button onClick={confirmGoOffline} className="dl-confirm-btn">
                  <i className="fas fa-power-off"></i> Confirm Go Offline
                </button>
                <button onClick={() => { setShowOfflineForm(false); setOfflineReason(''); }} className="dl-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Update Location Section ── */}
      <div className="dl-section">
        <div className="dl-section-header">
          <i className="fas fa-crosshairs"></i>
          <h3>Update Your Location</h3>
        </div>
        <div className="dl-section-body">
          <div className="dl-coord-grid">
            <div className="dl-field">
              <label>Latitude</label>
              <input type="number" value={location.latitude} readOnly placeholder="Latitude" />
              <div className="dl-hint">Auto-detected from GPS</div>
            </div>
            <div className="dl-field">
              <label>Longitude</label>
              <input type="number" value={location.longitude} readOnly placeholder="Longitude" />
              <div className="dl-hint">Auto-detected from GPS</div>
            </div>
          </div>

          <div className="dl-field full">
            <label>Current Address</label>
            <input
              type="text"
              value={location.address}
              onChange={handleAddressChange}
              placeholder="Enter your current location address"
            />
          </div>

          <div className="dl-action-group">
            <button onClick={getCurrentPosition} disabled={geoloading} className="dl-action-btn secondary">
              <i className="fas fa-location-arrow"></i>
              {geoloading ? 'Getting Location...' : 'Get Current Location'}
            </button>
            <button onClick={updateLocation} disabled={saving} className="dl-action-btn primary">
              <i className="fas fa-check"></i>
              {saving ? 'Saving...' : 'Save Location'}
            </button>
          </div>

          <div className="dl-info-banner">
            <i className="fas fa-info-circle"></i>
            <p>Your location helps us assign orders to drivers nearby. Keep your location updated and stay online to receive more orders.</p>
          </div>
        </div>
      </div>

      {/* ── Current Location Summary ── */}
      {location.latitude !== 0 && location.longitude !== 0 && (
        <div className="dl-section">
          <div className="dl-section-header">
            <i className="fas fa-map-pin"></i>
            <h3>Current Location</h3>
          </div>
          <div className="dl-section-body">
            <div className="dl-location-summary">
              <div className="dl-loc-item">
                <span>Latitude</span>
                <strong>{location.latitude.toFixed(6)}</strong>
              </div>
              <div className="dl-loc-item">
                <span>Longitude</span>
                <strong>{location.longitude.toFixed(6)}</strong>
              </div>
              {location.address && (
                <div className="dl-loc-item full">
                  <span>Address</span>
                  <strong>{location.address}</strong>
                </div>
              )}
              {location.lastUpdated && (
                <div className="dl-loc-item full">
                  <small>Last updated: {new Date(location.lastUpdated).toLocaleString()}</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverLocation;
