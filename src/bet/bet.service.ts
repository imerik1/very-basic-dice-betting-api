import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Decimal from 'decimal.js';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ParametersUpdateDatabase } from '~/shared/types/parameters-update-database';
import { UserService } from '~/user/user.service';
import { Bet as BetEntity } from './bet.entity';
import { Bet as BetModel } from './bet.model';

@Injectable()
export class BetService {
    constructor(
        private readonly sequelize: Sequelize,
        @InjectModel(BetEntity)
        private readonly betRepository: typeof BetEntity,
        @Inject()
        private readonly userService: UserService,
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
        return betEntities.map(this.toModel.bind(this) as () => BetModel);
    }

    async getAllBestBets(limit: number) {
        const betEntities = await this.sequelize.query(
            `
                SELECT 
                    ranked.*
                FROM (
                    SELECT 
                        b.*,
                        ROW_NUMBER() OVER (PARTITION BY userId ORDER BY payout DESC, id ASC) AS rn
                    FROM bets b
                ) ranked
                WHERE rn = 1
                ORDER BY ranked.payout DESC, ranked.id ASC
                LIMIT :limit;
            `,
            {
                replacements: { limit },
                type: QueryTypes.SELECT,
                model: BetEntity,
                mapToModel: true,
            },
        );

        return betEntities.map(this.toModel.bind(this) as () => BetModel);
    }

    async createBet(
        values: { userId: number; betAmount: number; chance: number },
        parameters: ParametersUpdateDatabase,
    ) {
        return await this.sequelize.transaction(async (t) => {
            const { transaction = t } = parameters;

            if (values.chance < 0 || values.chance > 1) {
                throw new HttpException(
                    'Chance must to be between 0 and 1',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const betAmount = new Decimal(values.betAmount).toDecimalPlaces(
                4,
                Decimal.ROUND_HALF_UP,
            );

            const balance = await this.userService.checkBalance(values.userId);

            if (balance.minus(betAmount).isNegative()) {
                throw new HttpException(
                    'Insufficient balance',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const roll = Math.random();
            const win = roll < values.chance;
            const payout = win
                ? betAmount.times(new Decimal(1).div(values.chance))
                : new Decimal(0);

            await this.userService.updateBalance(
                {
                    id: values.userId,
                    newValue: betAmount.negated().plus(payout),
                },
                {
                    transaction,
                },
            );

            const betEntity = await this.betRepository.create(
                {
                    userId: values.userId,
                    betAmount: betAmount,
                    chance: values.chance,
                    win,
                    payout,
                },
                { transaction },
            );

            return this.toModel(betEntity);
        });
    }

    private toModel(betEntity: BetEntity) {
        const betModel = new BetModel();
        betModel.id = betEntity.id;
        betModel.userId = betEntity.userId;
        betModel.betAmount = betEntity.betAmount.toNumber();
        betModel.chance = betEntity.chance;
        betModel.win = betEntity.win;
        betModel.payout = betEntity.payout.toNumber();

        return betModel;
    }
}
