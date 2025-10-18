import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Bet {
    @Field(() => Int)
    declare id: number;

    @Field(() => Int)
    declare userId: number;

    @Field(() => Float)
    declare betAmount: number;

    @Field(() => Float)
    declare chance: number;

    @Field(() => Float)
    declare payout: number;

    @Field()
    declare win: boolean;
}
