import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  // 👈 ADD THIS
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'abhiv',
      password: 'abhiv',
      database: 'mydb',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ only for development
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}