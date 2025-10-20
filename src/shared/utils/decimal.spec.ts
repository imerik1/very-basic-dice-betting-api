import Decimal from 'decimal.js';
import { DataType } from 'sequelize-typescript';
import { decimalModel } from './decimal';

describe('Decimal Utils', () => {
    it('should return correct DataType and functions', () => {
        const result = decimalModel('balance', 10, 4);

        expect(result.type).toEqual(DataType.DECIMAL(10, 4));
        expect(typeof result.get).toBe('function');
        expect(typeof result.set).toBe('function');
    });

    it('should get value as Decimal with rounding', () => {
        const mockThis = {
            getDataValue: jest.fn().mockReturnValue('123.45678'),
        };

        const { get } = decimalModel('balance', 10, 4);

        const value = get!.call(mockThis) as Decimal;

        expect(value).toBeInstanceOf(Decimal);
        expect(value.toString()).toBe('123.4568');
        expect(mockThis.getDataValue).toHaveBeenCalledWith('balance');
    });

    it('should set value as string', () => {
        const mockThis = {
            setDataValue: jest.fn(),
        };

        const { set } = decimalModel('balance', 10, 4);
        const decimalValue = new Decimal('123.4567');

        set!.call(mockThis, decimalValue);

        expect(mockThis.setDataValue).toHaveBeenCalledWith(
            'balance',
            '123.4567',
        );
    });
});
