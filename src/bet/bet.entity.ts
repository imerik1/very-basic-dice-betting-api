import Decimal from 'decimal.js';
import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { decimalModel } from '~/shared/utils/decimal';
import { User } from '~/user/user.entity';

@Table({
    tableName: 'bets',
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    version: false,
})
export class Bet extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'id' })
    declare id: number;

    @Column({
        field: 'betAmount',
        ...decimalModel('betAmount', 19, 4),
    })
    declare betAmount: Decimal;

    @Column({
        field: 'chance',
        ...decimalModel('chance', 4, 4),
    })
    declare chance: Decimal;

    @Column({
        field: 'payout',
        ...decimalModel('payout', 19, 4),
    })
    declare payout: Decimal;

    @Column({ type: DataType.BOOLEAN, field: 'win' })
    declare win: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, field: 'userId' })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}
