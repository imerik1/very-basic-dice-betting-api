import { Transaction } from 'sequelize';

export type ParametersUpdateDatabase = {
    transaction?: Transaction;
};
