import { HttpException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User as UserEntity } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
    let userRepository: typeof UserEntity;
    let sequelize: Sequelize;
    let userService: UserService;

    let mockEntity: UserEntity;

    beforeEach(() => {
        userRepository = UserEntity;
        sequelize = {} as unknown as Sequelize;
        mockEntity = {
            id: 1,
            name: 'test',
            balance: new Decimal(200),
            bets: [],
        } as unknown as UserEntity;

        userService = new UserService(sequelize, userRepository);
    });

    it('should get user by id', async () => {
        jest.spyOn(userRepository, 'findByPk').mockResolvedValueOnce(
            mockEntity,
        );

        const result = await userService.getUserById(1);
        expect(result.id).toBe(mockEntity.id);
        expect(result.name).toBe(mockEntity.name);
        expect(result.balance).toBe(200);
    });

    it('should throw when not get user by id', async () => {
        jest.spyOn(userRepository, 'findByPk').mockResolvedValueOnce(null);

        expect(await userService.getUserById(1)).toThrow(HttpException);
    });

    it('should get all users', async () => {
        jest.spyOn(userRepository, 'findAll').mockResolvedValueOnce([
            mockEntity,
        ]);

        const result = await userService.getUsers();
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(mockEntity.id);
        expect(result[0].name).toBe(mockEntity.name);
        expect(result[0].balance).toBe(200);
    });

    it('should check balance by id', async () => {
        jest.spyOn(userRepository, 'findByPk').mockResolvedValueOnce(
            mockEntity,
        );

        const result = await userService.checkBalance(1);
        expect(result.toNumber()).toBe(200);
    });

    it('should throw check balance by id and not find', async () => {
        jest.spyOn(userRepository, 'findByPk').mockResolvedValueOnce(null);

        expect(await userService.checkBalance(1)).toThrow(HttpException);
    });

    it('[using transaction passed as parameter] should update balance and return new balance', async () => {
        Object.assign(sequelize, {
            transaction: (cb: (t: Transaction) => PromiseLike<Decimal>) =>
                cb({} as Transaction),
        });

        jest.spyOn(userRepository, 'findByPk').mockResolvedValueOnce(
            mockEntity,
        );
        jest.spyOn(userRepository, 'update').mockResolvedValueOnce([1]);

        const result = await userService.updateBalance(
            { id: 1, newValue: new Decimal(100) },
            { transaction: {} as Transaction },
        );

        expect(result.toNumber()).toBe(300);
    });

    it('[using transaction internal] should update balance and return new balance', async () => {
        Object.assign(sequelize, {
            transaction: (cb: (t: Transaction) => PromiseLike<Decimal>) =>
                cb({} as Transaction),
        });

        jest.spyOn(userRepository, 'findByPk').mockResolvedValueOnce(
            mockEntity,
        );
        jest.spyOn(userRepository, 'update').mockResolvedValueOnce([1]);

        const result = await userService.updateBalance(
            { id: 1, newValue: new Decimal(100) },
            {},
        );

        expect(result.toNumber()).toBe(300);
    });
});
