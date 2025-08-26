FROM node:24-alpine AS builder
WORKDIR /map
COPY . .
RUN npm i
RUN npm run build

FROM node:24-alpine
WORKDIR /map
COPY --from=builder /map/dist ./dist
COPY --from=builder /map/package*json ./
RUN npm i --production
CMD ["npm", "run", "start"]