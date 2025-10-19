import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Decimal from 'decimal.js';
import { Sequelize } from 'sequelize-typescript';
import { ParametersUpdateDatabase } from '~/shared/types/parameters-update-database';
import { User as UserEntity } from './user.entity';
import { User as UserModel } from './user.model';

@Injectable()
export class UserService {
    constructor(
        private readonly sequelize: Sequelize,
        @InjectModel(UserEntity)
        private readonly userRepository: typeof UserEntity,
    ) {}

    async getUserById(id: number) {
        const userEntity = await this.userRepository.findByPk(id);

        if (!userEntity) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return this.toModel(userEntity);
    }

    async getUsers() {
        const userEntities = await this.userRepository.findAll();
        return userEntities.map(this.toModel.bind(this) as () => UserModel);
    }

    async checkBalance(id: number) {
        const userEntity = await this.userRepository.findByPk(id, {
            attributes: { include: ['balance'] },
        });

        if (!userEntity) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return userEntity.balance;
    }

    async updateBalance(
        values: { id: number; newValue: Decimal },
        parameters: ParametersUpdateDatabase,
    ) {
        return await this.sequelize.transaction(async (t) => {
            const { transaction = t } = parameters;
            const balance = await this.checkBalance(values.id);
            const newBalance = balance.plus(values.newValue);

            await this.userRepository.update(
                { balance: newBalance },
                { where: { id: values.id }, transaction },
            );

            return newBalance;
        });
    }

    private toModel(userEntity: UserEntity) {
        const userModel = new UserModel();
        userModel.id = userEntity.id;
        userModel.balance = userEntity.balance.toNumber();
        userModel.name = userEntity.name;

        return userModel;
    }
}
