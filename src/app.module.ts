import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { EntryModule } from './resources/entry/entry.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './resources/user/entities/user.entity';
import { Entry } from './resources/entry/entities/entry.entity';
import * as dotenv from 'dotenv'
import { AuthModule } from './auth/auth.module';
  
dotenv.config();

@Module({
  imports: [
    AuthModule,
    UserModule,
    EntryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      entities: [User, Entry],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
