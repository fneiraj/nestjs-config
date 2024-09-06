import { Test, TestingModule } from "@nestjs/testing";

import { EnvironmentConfigModule } from "../lib/config.module";

describe("EnvConfig without configClasses", () => {
  beforeEach(async () => {});

  it("should return module without config classes when send empty array", async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EnvironmentConfigModule.forRoot({
          basePath: "./tests/config",
          configClass: [],
          schema: "joi",
          nestConfigOptions: {
            envFilePath: "./tests/.env.tests",
          },
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
  });

  /*  it("should return module without config classes", async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EnvironmentConfigModule.forRoot({
          autoScan: false,
          basePath: "./tests/config",
          schema: "joi",
          nestConfigOptions: {
            envFilePath: "./tests/.env.tests",
          },
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
  });*/
});
