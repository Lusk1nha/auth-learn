import { HealthEntity } from './health.entity';

describe(HealthEntity.name, () => {
  it('should be defined', () => {
    expect(HealthEntity).toBeDefined();
  });

  it('should create an instance of HealthEntity', () => {
    const health = new HealthEntity();
    expect(health).toBeInstanceOf(HealthEntity);
  });

  it('should have the correct properties', () => {
    const health = new HealthEntity();
    health.status = 'healthy';
    health.memoryUsage = null;

    expect(health.status).toBe('healthy');
    expect(health.memoryUsage).toBeNull();
  });
});
