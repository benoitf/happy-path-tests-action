FROM node:12.20.0-alpine3.12 as builder
COPY package.json /project/
COPY yarn.lock /project/
WORKDIR /project
RUN yarn install
COPY . /project/
RUN yarn run compile
# compile binary
RUN yarn run nexe --resource 'dist/template/*.md' dist/entrypoint.js -t alpine-x64-12.9.1 -o /che-install-gh-action

FROM scratch
COPY --from=builder /che-install-gh-action /che-install-gh-action
ENTRYPOINT [ "/che-install-gh-action" ]
