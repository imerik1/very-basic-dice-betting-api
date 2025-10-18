import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => Int)
    declare id: number;

    @Field()
    declare name: string;

    @Field(() => Float)
    declare balance: number;
}
