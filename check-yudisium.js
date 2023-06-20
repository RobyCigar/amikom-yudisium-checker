const axios = require('axios');
const fs = require('fs');
const notifier = require('node-notifier');

const url = 'https://daak.amikom.ac.id/page/hasil-yudisium';
const cacheFilePath = 'cache.txt';

function fetchWebsite() {
  return axios.get(url);
}

function compareWithCache(responseData) {
  try {
    const cachedData = fs.readFileSync(cacheFilePath, 'utf8');
    return cachedData === responseData;
  } catch (err) {
    // Cache file doesn't exist yet
    return false;
  }
}

function sendNotification(title, message) {
  notifier.notify({
    title,
    message,
    sound: true,
  });
}

function updateCache(responseData) {
  fs.writeFileSync(cacheFilePath, responseData, 'utf8');
}

function checkWebsiteChange() {
	console.log('start checking...')
  fetchWebsite()
    .then((response) => {
	console.log('end checking...')
      const responseData = response.data;
      if (compareWithCache(responseData)) {
	sendNotification('Website Status', 'No change');
        console.log('No change');
      } else {
	sendNotification('Website Status', 'Website has changed!');
        console.log('Website has changed!');
        updateCache(responseData);
      }
    })
    .catch((error) => {
      console.error('Error fetching website:', error.message);
    });
}

// Run the checkWebsiteChange function every 5 minutes (300,000 milliseconds)
setInterval(checkWebsiteChange, 300000);
