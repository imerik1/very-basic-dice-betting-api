import { Inject } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
    constructor(@Inject() private readonly userService: UserService) {}

    @Query(() => User)
    async getUser(@Args('id', { type: () => Int }) id: number) {
        return this.userService.getUserById(id);
    }

    @Query(() => [User!])
    async getUserList() {
        return this.userService.getUsers();
    }
}
