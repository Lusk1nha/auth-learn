import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user with email and password.',
  })
  async register(@Body() data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description: 'Endpoint to login a user with email and password.',
  })
  async login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }
}
