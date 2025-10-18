import Decimal from 'decimal.js';
import {
    AutoIncrement,
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Bet } from '~/bet/entity/bet.entity';
import { decimalModel } from '~/shared/utils/decimal';

@Table({
    tableName: 'users',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    version: false,
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'id' })
    declare id: number;

    @Column({ type: DataType.STRING(50), field: 'name' })
    declare name: string;

    @Column({
        field: 'balance',
        ...decimalModel('', 19, 4),
    })
    declare balance: Decimal;

    @HasMany(() => Bet)
    declare bets: Bet[];
}
