import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user with email and password.',
  })
  @ApiOkResponse({
    description: 'User registered successfully',
    type: RegisterUserResponseDto,
  })
  async register(
    @Body() data: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    const user = await this.authService.register(data);
    return new RegisterUserResponseDto(user);
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
