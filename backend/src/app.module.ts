import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { VenuesModule } from './venues/venues.module';
import { CategoriesModule } from './categories/categories.module';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Module({
  imports: [AuthModule, UsersModule, VenuesModule, CategoriesModule, EventsModule, RegistrationsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
