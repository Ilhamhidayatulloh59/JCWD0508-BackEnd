FROM node:16

WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 8000
VOLUME ["/app/node_modules"]
RUN npm rebuild bcrypt --build-from-source
RUN npx prisma generate
CMD ["npm", "run", "dev"]