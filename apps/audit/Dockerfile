FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx nest build audit

ENV NODE_ENV=production
ENV PORT=3005

EXPOSE 3005

CMD ["node", "dist/apps/audit/main.js"]
