'use strict';
const axios = require('axios');
const CryptoJS = require('crypto-js');

const getTimestamp = date_created => {
  if (date_created) return Date.parse(`${date_created}`) / 1000;

  return Math.floor(new Date() / 1000);
};

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // send a new lead to FB pixel
  app.post('/send-lead-event', async (req, res) => {
    const {
      pixel_id, access_token, test_event_code,
      first_name, last_name, cell_phone, email, date_created
    } = req.body;

    try {
      const payload = JSON.stringify({
        "data": [
          {
            "event_name": "Lead",
            "event_time": getTimestamp(date_created),
            "action_source": "email",
            "user_data": {
              "fn": [CryptoJS.SHA256(first_name).toString()],
              "ln": [CryptoJS.SHA256(last_name).toString()],
              "em": [CryptoJS.SHA256(email).toString()],
              "ph": [CryptoJS.SHA256(cell_phone).toString()]
            }
          }
        ],
        ...(test_event_code ? { test_event_code } : {})
      });

      console.log(payload);

      const response = await axios({
        method: 'post',
        url: `https://graph.facebook.com/v11.0/${pixel_id}/events?access_token=${access_token}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      });

      res.send(response.data);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  });
};