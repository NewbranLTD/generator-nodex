{
  "short_name": "<%= cacheName %>",
  "name": "<%= cacheDescription %>",
  "icons": [
    <% if (iconsList) { %><%= iconsList %><% } %>
  ],
  "start_url": "<%= startUrl %>",
  "orientation": "<%= orientation %>",
  "display": "<%= displayStyle %>",<% if (setColorAttr) { %>,
  "background_color": "<%= backgroundColor %>",
  "theme_color": "<%= themeColor %>"
<% } %>
}
