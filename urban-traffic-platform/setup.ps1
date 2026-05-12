$base = "c:\Users\saafi\Mini_Projet_Web_Services_GraphQL\urban-traffic-platform"
cd $base
mkdir services -Force | Out-Null

$nestDocker = @"
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
"@

# Gateway
cd $base\services
npx -y @nestjs/cli new gateway --package-manager npm --skip-git --skip-install --strict
cd gateway
npm install @nestjs/graphql @apollo/server graphql @nestjs/jwt @nestjs/passport passport-jwt axios @nestjs/axios
Set-Content Dockerfile $nestDocker
Set-Content .env.example "PORT=3000`nJWT_SECRET=secret`n"

# Auth
cd $base\services
npx -y @nestjs/cli new auth --package-manager npm --skip-git --skip-install --strict
cd auth
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs typeorm pg @nestjs/typeorm class-validator class-transformer
Set-Content Dockerfile $nestDocker
Set-Content .env.example "PORT=3001`nDATABASE_URL=postgres://auth_user:auth_password@db-auth:5432/auth_db`nJWT_SECRET=secret`n"

# Vehicles
cd $base\services
npx -y @nestjs/cli new vehicles --package-manager npm --skip-git --skip-install --strict
cd vehicles
npm install typeorm pg @nestjs/typeorm class-validator class-transformer @nestjs/jwt @nestjs/passport passport-jwt
Set-Content Dockerfile $nestDocker
Set-Content .env.example "PORT=3002`nDATABASE_URL=postgres://vehicles_user:vehicles_password@db-vehicles:5432/vehicles_db`nJWT_SECRET=secret`n"

# Traffic
cd $base\services
npx -y @nestjs/cli new traffic --package-manager npm --skip-git --skip-install --strict
cd traffic
npm install typeorm pg @nestjs/typeorm class-validator class-transformer @nestjs/jwt @nestjs/passport passport-jwt
Set-Content Dockerfile $nestDocker
Set-Content .env.example "PORT=3003`nDATABASE_URL=postgres://traffic_user:traffic_password@db-traffic:5432/traffic_db`nJWT_SECRET=secret`n"

# Incidents
cd $base\services
npx -y @nestjs/cli new incidents --package-manager npm --skip-git --skip-install --strict
cd incidents
npm install typeorm pg @nestjs/typeorm class-validator class-transformer @nestjs/jwt @nestjs/passport passport-jwt
Set-Content Dockerfile $nestDocker
Set-Content .env.example "PORT=3004`nDATABASE_URL=postgres://incidents_user:incidents_password@db-incidents:5432/incidents_db`nJWT_SECRET=secret`n"

# Notifications
cd $base\services
npx -y @nestjs/cli new notifications --package-manager npm --skip-git --skip-install --strict
cd notifications
npm install typeorm pg @nestjs/typeorm class-validator class-transformer @nestjs/jwt @nestjs/passport passport-jwt @nestjs/websockets @nestjs/platform-socket.io socket.io
Set-Content Dockerfile $nestDocker
Set-Content .env.example "PORT=3005`nDATABASE_URL=postgres://notif_user:notif_password@db-notifications:5432/notif_db`nJWT_SECRET=secret`n"

# Frontend
cd $base
npx -y create-next-app@latest frontend --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm --skip-install
cd frontend
npm install @apollo/client graphql socket.io-client leaflet react-leaflet @types/leaflet

$nextDocker = @"
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
"@
Set-Content Dockerfile $nextDocker
Set-Content .env.example "NEXT_PUBLIC_API_URL=http://localhost:3000/graphql`nNEXT_PUBLIC_WS_URL=http://localhost:3005"
