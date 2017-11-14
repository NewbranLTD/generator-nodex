[Unit]
Description=<%= description %>
After=network.target

[Service]
Environment=<%= environment %>
Type=simple
User=<%= user %>
ExecStart=<%= nodePath %> <%= appPath %>
Restart=on-failure

[Install]
WantedBy=multi-user.target
