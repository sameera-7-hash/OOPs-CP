# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app using a lightweight static server
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist

# Hugging Face Docker spaces require port 7860
EXPOSE 7860
CMD ["serve", "-s", "dist", "-l", "7860"]