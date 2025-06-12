import { AuthModule } from './auth.module';

describe(AuthModule.name, () => {
  let module: AuthModule;

  beforeEach(async () => {
    module = new AuthModule();
  });

  it(`#${AuthModule.name} should be defined without errors when services loads`, async () => {
    expect(module).toBeDefined();
  });
});
