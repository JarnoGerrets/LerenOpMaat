# Use the official NGINX base image
FROM nginx:alpine

# Remove the default NGINX web content
RUN rm -rf /usr/share/nginx/html/*

# Copy all files and folders recursively from the current directory
COPY . /usr/share/nginx/html

# Expose default NGINX port
EXPOSE 80