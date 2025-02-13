FROM ubuntu:18.04

# Versions of Nginx and nginx-rtmp-module to use
ENV NGINX_VERSION="nginx-1.18.0"
ENV NGINX_RTMP_MODULE_VERSION="1.2.1"
ENV NGINX_CONF_PATH="/etc/nginx/nginx.conf"

# Install dependencies
RUN set -ex; \
    apt-get --yes update; \
    apt-get --yes install wget build-essential libaio1 openssl libpcre3-dev libssl-dev zlib1g-dev ffmpeg;

# Download and decompress Nginx
RUN mkdir -p /tmp/build/nginx && \
    cd /tmp/build/nginx && \
    wget -O ${NGINX_VERSION}.tar.gz https://nginx.org/download/${NGINX_VERSION}.tar.gz && \
    tar -zxf ${NGINX_VERSION}.tar.gz

# Download and decompress RTMP module
RUN mkdir -p /tmp/build/nginx-rtmp-module && \
    cd /tmp/build/nginx-rtmp-module && \
    wget -O nginx-rtmp-module-${NGINX_RTMP_MODULE_VERSION}.tar.gz https://github.com/arut/nginx-rtmp-module/archive/v${NGINX_RTMP_MODULE_VERSION}.tar.gz && \
    tar -zxf nginx-rtmp-module-${NGINX_RTMP_MODULE_VERSION}.tar.gz

# Build and install Nginx
RUN cd /tmp/build/nginx/${NGINX_VERSION} && \
    ./configure \
    --sbin-path=/usr/local/sbin/nginx \
    --conf-path=${NGINX_CONF_PATH} \
    --error-log-path=/var/log/nginx/error.log \
    --pid-path=/var/run/nginx/nginx.pid \
    --lock-path=/var/lock/nginx/nginx.lock \
    --http-log-path=/var/log/nginx/access.log \
    --http-client-body-temp-path=/tmp/nginx-client-body \
    --with-http_ssl_module \
    --with-threads \
    --with-ipv6 \
    --with-file-aio \
    --add-module=/tmp/build/nginx-rtmp-module/nginx-rtmp-module-${NGINX_RTMP_MODULE_VERSION} && \
    make -j $(getconf _NPROCESSORS_ONLN) && \
    make install && \
    mkdir -p /var/lock/nginx && \
    rm -rf /tmp/build

# HLS için gerekli dizini oluştur
RUN mkdir -p /hls && chmod -R 777 /hls

# Forward logs to Docker
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Set up config file
COPY nginx.conf ${NGINX_CONF_PATH}

EXPOSE 1935
CMD ["nginx", "-g", "daemon off;"]