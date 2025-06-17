import { ApiProperty } from '@nestjs/swagger';
import { HealthEntity } from '../domain/health.entity';

export class GetSystemHealthResponseDto {
  @ApiProperty({
    enum: ['healthy', 'degraded', 'unhealthy'],
    description: 'Service status',
  })
  status: 'healthy' | 'degraded' | 'unhealthy';

  @ApiProperty({
    description: 'Service name',
  })
  service: string;

  @ApiProperty({
    description: 'Service version',
  })
  version: string;

  @ApiProperty({
    description: 'Timestamp of the health check',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Uptime in seconds',
  })
  uptime: number;

  @ApiProperty({
    description: 'Memory usage statistics',
  })
  checks: HealthEntity;

  @ApiProperty({
    description: 'Error message if any',
  })
  error?: string;
}
