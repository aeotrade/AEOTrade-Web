FROM hub.aeotrade.com/aeotrade/node:18.20.4-slim as runner 
WORKDIR /usr/share/aeotrade_portal

COPY .output/  /usr/share/aeotrade_portal/
RUN useradd -m aeotrade -s /bin/bash && \
    chown -R aeotrade:aeotrade /usr/share/aeotrade_portal

USER aeotrade
ENV TZ=Asia/Shanghai 
ENV LANG=en_US.UTF-8

EXPOSE 3000
CMD [ "node", "server/index.mjs" ]