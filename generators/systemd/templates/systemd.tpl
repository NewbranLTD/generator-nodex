[Unit]
Description=<%= description %>
After=network.target

[Service]
Environment=<%= environment %>
User=<%= user %>
Group=<%= group %>
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=<%= appName %>
ExecStart=<%= nodePath %> <%= appPath %>
Restart=always

[Install]
WantedBy=multi-user.target
