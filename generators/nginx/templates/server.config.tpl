# minimum nginx proxy setup for nodejs app

server {
  listen <%= listenPortNumber %>;

  server_name <%= serverName %>;

  location / {
    proxy_pass <%= localhostName %>:<%= localhostPort %>;
    proxy_set_header Host $host;
    # getting the visitor info
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    # for socket connection
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
  }

  # access_log /path/to/log/access.log
  # error_log /path/to/log/error.log
}
<% if (wwwDomain) { %>
server {
  listen <%= subListenPortNumber %>;
  server_name <%= subDomainServerName %>;
  <% if (wwwForward) { %>
  # forward it back to http(s)://<%= serverName %>;
  return 301 $scheme://<%= serverName %>$request_uri;
  <% } else { %>
  location / {
    # you have to fill this out yourself
  }
  <% } %>
}
<% } %>
