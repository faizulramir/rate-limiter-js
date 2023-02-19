const rateLimit = require('../index');

test('limits the API requests according to the specified options', async () => {
    const fn = rateLimit(axios, { maxRequests: 2, interval: 1000 });
    const start = new Date();
    const responses = await Promise.all([
        fn('https://jsonplaceholder.typicode.com/posts/1'),
        fn('https://jsonplaceholder.typicode.com/posts/2'),
        fn('https://jsonplaceholder.typicode.com/posts/3'),
        fn('https://jsonplaceholder.typicode.com/posts/4'),
    ]);
  const end = new Date();
  expect(end - start).toBeGreaterThan(3000); // should take at least 3 seconds
  expect(end - start).toBeLessThan(5000); // should take no more than 5 seconds
  expect(responses.length).toBe(4);
  expect(responses[0].status).toBe(200);
  expect(responses[1].status).toBe(200);
  expect(responses[2].status).toBe(200);
  expect(responses[3].status).toBe(200);
});