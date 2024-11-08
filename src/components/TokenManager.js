import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const adminToken = process.env.REACT_APP_ADMIN_TOKEN;

function TokenManager() {
  const [appId, setAppId] = useState('');
  const [token, setToken] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

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
        placeholder="App ID" 
        value={appId} 
        onChange={(e) => setAppId(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Token" 
        value={token} 
        onChange={(e) => setToken(e.target.value)} 
      />
      <button onClick={handleAddToken}>הוסף טוקן</button>
      <p>{responseMessage}</p>
    </div>
  );
}

export default TokenManager;