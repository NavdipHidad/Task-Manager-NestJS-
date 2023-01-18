import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const {username, password} = authCredentialsDto;

        /*create salt*/
        const salt = await bcrypt.genSalt();
        /*create hash of salt and original pass*/
        const hashedPassword = await bcrypt.hash(password, salt);
        //console.log(salt, ' ', hashedPassword);
        const user = this.usersRepository.create({username, password: hashedPassword});

        try{
            await this.usersRepository.save(user);
        } catch(error){
            if(error.code === '23505'){ //if column is unique and duplicate found, it return '23505' error code
                throw new ConflictException('Username already exists')
            } else{
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessTocken: string}>{
        const {username, password} = authCredentialsDto;
        const user = await this.usersRepository.findOne({where: {username}});
        //console.log(password, ' ', user.password, user, (password == user.password));

        if(user && password == user.password){
            //return 'success';
            const payload: JwtPayload = {username};
            const accessTocken: string = await this.jwtService.sign(payload);
            return {accessTocken};
        }else{
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}
