import { Inject } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Bet } from './bet.model';
import { BetService } from './bet.service';

@Resolver(() => Bet)
export class BetResolver {
    constructor(@Inject() private readonly betService: BetService) {}

    @Query(() => Bet)
    async getBet(@Args('id', { type: () => Int }) id: number) {
        return this.betService.getBetById(id);
    }

    @Query(() => [Bet!])
    async getBetList() {
        return this.betService.getBets();
    }
}
