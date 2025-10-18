import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User as UserEntity } from './user.entity';
import { User as UserModel } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserEntity)
        private readonly userRepository: typeof UserEntity,
    ) {}

    async getUserById(id: number) {
        const userEntity = await this.userRepository.findByPk(id);

        if (!userEntity) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return this.toModel(userEntity);
    }

    async getUsers() {
        const userEntities = await this.userRepository.findAll();
        return userEntities.map(this.toModel.bind(this) as () => UserModel);
    }

    private toModel(userEntity: UserEntity) {
        const userModel = new UserModel();
        userModel.id = userEntity.id;
        userModel.balance = userEntity.balance.toNumber();
        userModel.name = userEntity.name;

        return userModel;
    }
}
