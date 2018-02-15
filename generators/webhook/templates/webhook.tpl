/**
 * webhook for github to build a cheap and cheerful CI
 * 1. Only do something when the master branch is updated
 * 2. Only affect ./ folder to do a git pull master
 * 3. Restart the script accordingly
 * Once you have this setup, you also want to add the /<%= webPath %>
 * to your nginx config file
 * server {
 *    location = /<%= webPath %> {
 *       // your node config 
 *     }
 * }
 */
const { spawn } = require('child_process');
const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({ path: '<%= webPath %>', secret: '<%= secret %>' });
const env = Object.assign({}, process.env);
const cwd = '<%= cwd %>';
const port = <%= port %>;
const branch = '<%= branch %>';
const options = { env, cwd };

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    // for debugging and testing purpose
    console.log('The url got called! [%s]', req.url);
    res.end('-- no such location --');
  });
}).listen(port, () => {
  console.log(`webhook server start @ ${port}`);
});

handler.on('error', function (err) {
  console.error('Error:', err.message);
});

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  if (event.payload.ref === branch) {
    // this is an example what you can do with your webhook call back
    // the `npm run pull` = `git pull origin master --no-edit`
    const p = spawn('npm', ['run', 'pull'], { env, cwd });
    p.stdout.on('data', data => {
      console.log(`pull stdout: ${data}`);
    });
  }
});