import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '~/user/user.module';
import { Bet } from './bet.entity';
import { BetResolver } from './bet.resolver';
import { BetService } from './bet.service';

@Module({
    imports: [SequelizeModule.forFeature([Bet]), UserModule],
    providers: [BetResolver, BetService],
})
export class BetModule {}
