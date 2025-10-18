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
import { User } from '~/user/entity/user.entity';

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
        ...decimalModel('betAmount', 19, 4),
    })
    declare betAmount: Decimal;

    @Column({
        ...decimalModel('chance', 1, 4),
    })
    declare chance: Decimal;

    @Column({
        ...decimalModel('payout', 19, 4),
    })
    declare payout: Decimal;

    @Column({ type: DataType.BOOLEAN })
    declare win: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, field: 'userId' })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}
