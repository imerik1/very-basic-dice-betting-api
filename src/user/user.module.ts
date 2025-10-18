import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [UserResolver, UserService],
})
export class UserModule {}
