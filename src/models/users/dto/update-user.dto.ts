import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'Email cannot be empty',
  })
  email: string;

  @IsString({
    message: 'Username must be a string',
  })
  name: string;
}
