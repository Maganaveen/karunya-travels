import React, { useState, useEffect } from 'react';
import { driversAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DriverLocation = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: ''
  });
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geoloading, setGeoLoading] = useState(false);

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

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
          setLocation((prev) => ({
            ...prev,
            latitude,
            longitude
          }));

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
            setLocation((prev) => ({
              ...prev,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            }));
          } finally {
            setGeoLoading(false);
          }
        },
        (error) => {
          toast.error('Failed to get location: ' + error.message);
          setGeoLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
      setGeoLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setLocation((prev) => ({
      ...prev,
      address: e.target.value
    }));
  };

  const updateLocation = async () => {
    if (!location.latitude || !location.longitude) {
      toast.error('Please select a location first');
      return;
    }

    setSaving(true);
    try {
      await driversAPI.updateLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      });
      toast.success('Location updated successfully');
    } catch (error) {
      toast.error('Failed to update location');
    } finally {
      setSaving(false);
    }
  };

  const updateAvailability = async (newStatus) => {
    try {
      await driversAPI.updateAvailability(newStatus);
      setIsAvailable(newStatus);
      toast.success(`You are now ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>My Location & Availability</h2>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Availability Status</h3>
          <div style={{
            padding: '20px',
            backgroundColor: isAvailable ? '#e8f5e9' : '#ffebee',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0', color: isAvailable ? '#28a745' : '#dc3545' }}>
              {isAvailable ? '🟢 ONLINE' : '🔴 OFFLINE'}
            </h2>
            <p style={{ margin: '10px 0 0 0', color: '#666' }}>
              {isAvailable ? 'You will receive new orders' : 'You will not receive new orders'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => updateAvailability(true)}
              className={`btn ${isAvailable ? 'btn-success' : 'btn-secondary'}`}
              style={{ width: '100%' }}
            >
              Go Online
            </button>
            <button
              onClick={() => updateAvailability(false)}
              className={`btn ${!isAvailable ? 'btn-danger' : 'btn-secondary'}`}
              style={{ width: '100%' }}
            >
              Go Offline
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Update Your Location</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Latitude
            </label>
            <input
              type="number"
              value={location.latitude}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5'
              }}
              placeholder="Latitude"
            />
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
              Auto-detected from GPS
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Longitude
            </label>
            <input
              type="number"
              value={location.longitude}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5'
              }}
              placeholder="Longitude"
            />
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
              Auto-detected from GPS
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Current Address
            </label>
            <input
              type="text"
              value={location.address}
              onChange={handleAddressChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your current location address"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={getCurrentPosition}
              disabled={geoloading}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              {geoloading ? 'Getting Location...' : '📍 Get Current Location'}
            </button>
            <button
              onClick={updateLocation}
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {saving ? 'Saving...' : '✓ Save Location'}
            </button>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#f0f8ff',
            borderRadius: '4px',
            border: '1px solid #dce3f1'
          }}>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>
              <strong>ℹ️ Note:</strong> Your location helps us assign orders to drivers nearby. 
              Keep your location updated and stay online to receive more orders.
            </p>
          </div>
        </div>

        {location.latitude && location.longitude && (
          <div className="card" style={{ marginTop: '30px' }}>
            <h3>Your Current Location</h3>
            <div style={{
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}>
              <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
              {location.address && <p><strong>Address:</strong> {location.address}</p>}
              {location.lastUpdated && (
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '10px 0 0 0' }}>
                  Last updated: {new Date(location.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverLocation;
