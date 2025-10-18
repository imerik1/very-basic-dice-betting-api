import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bet } from '~/bet/entity/bet.entity';
import { User } from '~/user/entity/user.entity';
import { BetModule } from './bet/bet.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'default',
            models: [User, Bet],
        }),
        BetModule,
        UserModule,
    ],
})
export class AppModule {}
