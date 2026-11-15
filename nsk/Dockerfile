FROM harbor.secnet.nsk.io/dockerhub/library/node:24.22.1-bookworm-slim@sha256:be8204d4bd327363357f532187b752ff62759c31bedf98e9e18fc08c9cbd605c AS web
WORKDIR /work
COPY web/package.json web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY web/ ./
RUN npm run build \
    && mv dist/BASE_PATH/monacoeditorwork/* dist/assets/ \
    && rm -rf dist/BASE_PATH

FROM ghcr.io/blakeblackshear/frigate:0.18.2@sha256:fd60f99ffd4eb6c42360ed4e14953e270586f239309ab3983e55b2e97ffac09a
RUN rm -rf /opt/frigate/web
COPY --from=web /work/dist/ /opt/frigate/web/
LABEL org.opencontainers.image.source="https://git.secnet.nsk.io/eriknelson/frigate" \
      io.nsk.frigate.upstream-version="0.18.2" \
      io.nsk.frigate.upstream-revision="cfa08c56b23d23280c3d0a218e5a43182c97445b"
