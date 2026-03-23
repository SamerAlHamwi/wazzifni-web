FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the web application files to the root of the web server
COPY web/ /usr/share/nginx/html/

# Copy the course folder to its own subdirectory
COPY course/ /usr/share/nginx/html/course/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
