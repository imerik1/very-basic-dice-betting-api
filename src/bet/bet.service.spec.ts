import { HttpException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserService } from '~/user/user.service';
import { Bet as BetEntity } from './bet.entity';
import { BetService } from './bet.service';

describe('BetService', () => {
    let betRepository: typeof BetEntity;
    let sequelize: Sequelize;
    let userService: UserService;
    let betService: BetService;

    let mockEntity: BetEntity;

    beforeEach(async () => {
        betRepository = BetEntity;
        sequelize = { query: jest.fn() } as unknown as Sequelize;
        userService = {
            checkBalance: jest.fn(),
            updateBalance: jest.fn(),
        } as unknown as UserService;
        mockEntity = {
            id: 1,
            betAmount: new Decimal(10),
            chance: 0.5,
            payout: new Decimal(12.5),
            win: true,
            userId: 1,
        } as unknown as BetEntity;

        betService = new BetService(sequelize, betRepository, userService);
    });

    it('should get bet by id', async () => {
        jest.spyOn(betRepository, 'findByPk').mockResolvedValueOnce(mockEntity);

        const result = await betService.getBetById(1);
        expect(result.id).toBe(mockEntity.id);
        expect(result.userId).toBe(mockEntity.userId);
        expect(result.betAmount).toBe(mockEntity.betAmount.toNumber());
        expect(result.chance).toBe(mockEntity.chance);
        expect(result.win).toBe(mockEntity.win);
        expect(result.payout).toBe(mockEntity.payout.toNumber());
    });

    it('should throw when not get bet by id', async () => {
        jest.spyOn(betRepository, 'findByPk').mockResolvedValueOnce(null);
        expect(betService.getBetById(1)).rejects.toThrow(HttpException);
    });

    it('should get all bets', async () => {
        jest.spyOn(betRepository, 'findAll').mockResolvedValueOnce([
            mockEntity,
        ]);

        const result = await betService.getBets();
        expect(result[0].id).toBe(mockEntity.id);
        expect(result[0].userId).toBe(mockEntity.userId);
        expect(result[0].betAmount).toBe(mockEntity.betAmount.toNumber());
        expect(result[0].chance).toBe(mockEntity.chance);
        expect(result[0].win).toBe(mockEntity.win);
        expect(result[0].payout).toBe(mockEntity.payout.toNumber());
    });

    it('should get all best bets by user and limit', async () => {
        jest.spyOn(sequelize, 'query').mockResolvedValueOnce([
            mockEntity,
        ] as any);

        const result = await betService.getAllBestBets(1);
        expect(result[0].id).toBe(mockEntity.id);
        expect(result[0].userId).toBe(mockEntity.userId);
        expect(result[0].betAmount).toBe(mockEntity.betAmount.toNumber());
        expect(result[0].chance).toBe(mockEntity.chance);
        expect(result[0].win).toBe(mockEntity.win);
        expect(result[0].payout).toBe(mockEntity.payout.toNumber());
    });

    it('should throw if creating bet chance is less than 0 or greater than 1', async () => {
        Object.assign(sequelize, {
            transaction: (cb) => cb({} as Transaction),
        });

        const resultLessThan0 = betService.createBet(
            { userId: 1, betAmount: 10, chance: -1 },
            {},
        );
        expect(resultLessThan0).rejects.toThrow(HttpException);

        const resultGreaterThan1 = betService.createBet(
            { userId: 1, betAmount: 10, chance: 1.01 },
            {},
        );
        expect(resultGreaterThan1).rejects.toThrow(HttpException);
    });

    it('should throw if creating bet balance is insufficient', async () => {
        Object.assign(sequelize, {
            transaction: (cb) => cb({} as Transaction),
        });

        jest.spyOn(userService, 'checkBalance').mockResolvedValueOnce(
            new Decimal(-100),
        );

        const result = betService.createBet(
            { userId: 1, betAmount: 10, chance: 0.5 },
            {},
        );
        expect(result).rejects.toThrow(HttpException);
    });

    it('should create bet and define payout', async () => {
        Object.assign(sequelize, {
            transaction: (cb) => cb({} as Transaction),
        });
        jest.spyOn(userService, 'checkBalance').mockResolvedValue(
            new Decimal(100),
        );
        jest.spyOn(betRepository, 'create').mockImplementation(
            (values: Record<string, unknown>) => {
                return values;
            },
        );

        let times: string[] = [];

        while (times.length < 2) {
            const result = await betService.createBet(
                { userId: 1, betAmount: 10, chance: 0.5 },
                {},
            );

            if (result.win) {
                times[0] = 'win';
                expect(result.payout).toBe(20);
            } else {
                times[1] = 'loose';
                expect(result.payout).toBe(0);
            }
        }
    });
});
