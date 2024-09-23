const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.post('/api/games', async (req, res) => {
  console.log("POST received");
    try {
        const response = await axios.post(
            'https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games',
            'fields name, genres.name, cover.url; where cover != null; limit 10;',  
            {
                headers: {
                    'Client-ID': process.env.VITE_APP_CLIENT_ID,  
                    'Authorization': `Bearer ${process.env.VITE_APP_API_KEY}`,   
                    'X-Requested-With': 'XMLHttpRequest' 
                }
            }
        );
        res.send(response.data); 
    } catch (error) {
        console.error("Error found");
    }
});

app.listen(5000, () => {
    console.log("Server active on port 5000");
});