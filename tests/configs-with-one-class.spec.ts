import { Test, TestingModule } from "@nestjs/testing";

import { DBConfig } from "../lib/__config/db.config";
import { EnvironmentConfigModule } from "../lib/config.module";

describe("EnvConfig with one configClass", () => {
  let dbConfig: DBConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EnvironmentConfigModule.forRoot({
          basePath: "./lib/__config",
          configClass: DBConfig,
          schema: "zod",
          nestConfigOptions: {
            envFilePath: "./tests/.env.tests",
          },
        }),
      ],
    }).compile();

    dbConfig = module.get<DBConfig>(DBConfig);
  });

  it("should retrieve configuration properties from DbConfig", () => {
    expect(dbConfig).toBeDefined();
    expect(dbConfig.name).toBe("tests_db");
    expect(dbConfig.port).toBe(27017);
    expect(dbConfig.secure).toBe(false);
    expect(dbConfig.host).toBe("localhost");
    expect(dbConfig.user).toBe("root");
  });
});
