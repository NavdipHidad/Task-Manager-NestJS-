import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{

    //@IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    
    //@IsNotEmpty()
    @IsString()
    @MinLength(8, {message: 'Password is too short'})
    @MaxLength(32, {message: 'Password is very long'})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak'
    }) //atleast 1 up, 1 low, 1 num or special
    password: string;
}