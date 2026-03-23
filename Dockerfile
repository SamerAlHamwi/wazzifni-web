FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the web application files (Landing Page)
# We copy into the root directory of the web server
COPY web/ /usr/share/nginx/html/

# Copy the course folder as a subdirectory
# This creates /usr/share/nginx/html/course/ with all its contents
COPY course/ /usr/share/nginx/html/course/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
