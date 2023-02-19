const axios = require('axios');

function rateLimit(fn, options) {
  const queue = [];

  function processQueue() {
    if (queue.length > 0) {
      const [url, config, resolve, reject] = queue.shift();
      axios(url, config)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          setTimeout(processQueue, options.interval);
        });
    }
  }

  return function() {
    const args = Array.from(arguments);
    return new Promise((resolve, reject) => {
      queue.push([...args, resolve, reject]);
      if (queue.length <= options.maxRequests) {
        processQueue();
      } else {
        setTimeout(processQueue, options.interval);
      }
    });
  };
}

module.exports = rateLimit;