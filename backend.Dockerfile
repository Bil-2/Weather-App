FROM node:18-alpine

WORKDIR /app

# Initialize and install dependencies including TypeScript
RUN npm init -y && \
    npm install express axios body-parser node-cron @sendgrid/mail && \
    npm install --save-dev typescript ts-node @types/node @types/express @types/body-parser @types/node-cron

# Copy configuration and code
COPY backend.tsconfig.json ./tsconfig.json
COPY server.ts .
COPY netlify/ ./netlify/

EXPOSE 9000

# Run with ts-node
CMD ["npx", "ts-node", "server.ts"]
