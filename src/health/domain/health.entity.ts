import { ApiProperty } from '@nestjs/swagger';
import { MemoryUsageEntity } from 'src/models/memory-usage/domain/memory-usage.entity';

export class HealthEntity {
  @ApiProperty({
    description: 'Check status for the service',
    enum: ['healthy', 'unhealthy'],
    example: 'healthy',
  })
  status: 'healthy' | 'unhealthy';

  @ApiProperty({
    description: 'Check status',
  })
  memoryUsage: MemoryUsageEntity | null;
}
