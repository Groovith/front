# 1단계: 빌드
FROM node:18-alpine AS build
WORKDIR /app
# package.json과 package-lock.json 복사
COPY package*.json ./
# 의존성 설치
RUN npm install
# 소스코드 복사
COPY . .
# React 앱 빌드
RUN npm run build

# 2단계: 실행 환경 설정
FROM nginx:stable-alpine
# React 빌드 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html
# 기본 nginx 설정 파일을 삭제 (custom 설정과 충돌 방지)
RUN rm /etc/nginx/conf.d/default.conf
# custom 설정파일을 컨테이너 내부로 복사
COPY nginx.conf /etc/nginx/conf.d

# Nginx 실행
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]