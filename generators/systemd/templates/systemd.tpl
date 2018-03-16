[Unit]
Description=<%= description %>
After=network.target

[Service]
Environment=<%= environment %>
Type=simple
User=<%= user %>
Group=<%= group %>
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=<%= appName %>
ExecStart=<%= nodePath %> <%= appPath %>
Restart=on-failure

[Install]
WantedBy=multi-user.target
