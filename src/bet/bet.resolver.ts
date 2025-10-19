import { Inject } from '@nestjs/common';
import { Args, Float, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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

    @Query(() => [Bet!])
    async getBestBetPerUser(@Args('limit', { type: () => Int }) limit: number) {
        return this.betService.getAllBestBets(limit);
    }

    @Mutation(() => Bet)
    async createBet(
        @Args('userId', { type: () => Int }) userId: number,
        @Args('betAmount', { type: () => Float }) betAmount: number,
        @Args('chance', { type: () => Float }) chance: number,
    ) {
        return this.betService.createBet({ userId, betAmount, chance }, {});
    }
}
