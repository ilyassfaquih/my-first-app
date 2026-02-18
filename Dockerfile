# 1. Base Image (بحال JDK)
FROM node:18-alpine

# 2. فين غادي نخدمو داخل الكونطونير
WORKDIR /usr/src/app

# 3. كوبي غير ملفات dependencies هما اللولين (باش نستافدو من Cache)
COPY package*.json ./

# 4. أنسطالي dependencies
RUN npm install

# 5. دابا كوبي الكود كامل
COPY . .

# 6. بني المشروع (Build - كيولد dossier 'dist')
RUN npm run build

# 7. ديماري السيرفر
CMD ["node", "dist/main"]
