import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Auth Guard & strategies
import { JwtStrategy } from './auth/jwt.strategy';

// Resolvers
import { AuthResolver } from './resolvers/auth.resolver';
import { VehiclesResolver } from './resolvers/vehicles.resolver';
import { TrafficResolver } from './resolvers/traffic.resolver';
import { IncidentsResolver } from './resolvers/incidents.resolver';
import { NotificationsResolver } from './resolvers/notifications.resolver';

@Module({
  imports: [
    HttpModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }: { req: any }) => ({ req }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    AuthResolver,
    VehiclesResolver,
    TrafficResolver,
    IncidentsResolver,
    NotificationsResolver,
  ],
})
export class AppModule {}
