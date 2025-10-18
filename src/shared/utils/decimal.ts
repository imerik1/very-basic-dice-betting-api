import Decimal from 'decimal.js';
import { ModelAttributeColumnOptions } from 'sequelize';
import { DataType } from 'sequelize-typescript';

export const decimalModel = (
    columnName: string,
    precision: number,
    rounding: Decimal.Rounding,
): Partial<ModelAttributeColumnOptions> => {
    return {
        type: DataType.DECIMAL(precision, rounding),
        get: function () {
            Decimal.set({ precision, rounding });
            return new Decimal(this.getDataValue(columnName) as string);
        },
        set: function (value: Decimal) {
            this.setDataValue(columnName, value.toString());
        },
    };
};
