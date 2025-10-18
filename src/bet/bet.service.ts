import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bet as BetEntity } from './bet.entity';
import { Bet as BetModel } from './bet.model';

@Injectable()
export class BetService {
    constructor(
        @InjectModel(BetEntity)
        private readonly betRepository: typeof BetEntity,
    ) {}

    async getBetById(id: number) {
        const betEntity = await this.betRepository.findByPk(id);

        if (!betEntity) {
            throw new HttpException('Bet not found', HttpStatus.NOT_FOUND);
        }

        return this.toModel(betEntity);
    }

    async getBets() {
        const betEntities = await this.betRepository.findAll();
        return betEntities.map(this.toModel);
    }

    private toModel(betEntity: BetEntity) {
        const betModel = new BetModel();
        betModel.id = betEntity.id;

        return betModel;
    }
}
