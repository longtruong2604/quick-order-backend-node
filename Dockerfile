# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Copy the prisma schema and migrations folder
COPY prisma ./prisma

# Generate Prisma client and run migrations

# Set the environment variable for SQLite file path
ENV DATABASE_URL="file:./prisma/dev.db"

# Expose the port where the app will be running
EXPOSE 4000

# Run the migration command to apply database migrations
RUN npx prisma migrate dev --name init --preview-feature

# Command to run the application
CMD ["npm", "run", "start"]
