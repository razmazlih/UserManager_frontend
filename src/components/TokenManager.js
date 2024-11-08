import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const adminToken = process.env.REACT_APP_ADMIN_TOKEN;

function TokenManager() {
  const [appId, setAppId] = useState('');
  const [token, setToken] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [tokens, setTokens] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editAppId, setEditAppId] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${baseUrl}/admin/token`, {
          headers: {
            'Admin-Token': adminToken
          }
        });
        const tokensArray = Object.entries(response.data).map(([app_id, token]) => ({ app_id, token }));
        setTokens(tokensArray);
      } catch (error) {
        console.log('Error fetching tokens:', error.response?.data?.message || error.message);
      }
    };

    fetchTokens();
  }, []);

  const handleAddToken = async () => {
    try {
      const response = await axios.post(`${baseUrl}/admin/token`, {
        app_id: appId,
        token: token,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Admin-Token': adminToken
        }
      });

      setResponseMessage(response.data.message || 'Token added successfully');
      setTokens([...tokens, { app_id: appId, token: token }]);
      setAppId('');
      setToken('');
    } catch (error) {
      setResponseMessage('Error: ' + (error.response?.data?.message || error.message));
      console.log(error.response?.data?.message || error.message);
    }
  };

  const handleEditToken = (app_id, currentToken) => {
    setIsEditing(true);
    setEditAppId(app_id);
    setAppId(app_id);
    setToken(currentToken);
  };

  const handleUpdateToken = async () => {
    try {
      const response = await axios.put(`${baseUrl}/admin/token/${editAppId}`, {
        token: token
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Admin-Token': adminToken
        }
      });

      setResponseMessage(response.data.message || 'Token updated successfully');
      setTokens(tokens.map(t => (t.app_id === editAppId ? { ...t, token } : t)));
      setIsEditing(false);
      setAppId('');
      setToken('');
      setEditAppId(null);
    } catch (error) {
      setResponseMessage('Error: ' + (error.response?.data?.message || error.message));
      console.log(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteToken = async (app_id) => {
    try {
      await axios.delete(`${baseUrl}/admin/token/${app_id}`, {
        headers: {
          'Admin-Token': adminToken
        }
      });

      setResponseMessage('Token deleted successfully');
      setTokens(tokens.filter(t => t.app_id !== app_id));
    } catch (error) {
      setResponseMessage('Error: ' + (error.response?.data?.message || error.message));
      console.log(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>ניהול טוקנים</h2>
      <input 
        type="text" 
        placeholder="App Name" 
        value={appId} 
        onChange={(e) => setAppId(e.target.value)} 
        disabled={isEditing} 
      />
      <input 
        type="text" 
        placeholder="App Token" 
        value={token} 
        onChange={(e) => setToken(e.target.value)} 
      />
      {isEditing ? (
        <button onClick={handleUpdateToken}>עדכן טוקן</button>
      ) : (
        <button onClick={handleAddToken}>הוסף טוקן</button>
      )}
      <p>{responseMessage}</p>

      <h3>רשימת טוקנים קיימים</h3>
      <ul>
        {tokens.map((tokenItem, index) => (
          <li key={index}>
            <div className="token-info">
              <span>App Name:</span>
              <p>{tokenItem.app_id}</p>
              <span>Token:</span>
              <p>{tokenItem.token}</p>
            </div>
            <div className="actions">
              <button className="edit" onClick={() => handleEditToken(tokenItem.app_id, tokenItem.token)}>ערוך</button>
              <button className="delete" onClick={() => handleDeleteToken(tokenItem.app_id)}>מחק</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TokenManager;