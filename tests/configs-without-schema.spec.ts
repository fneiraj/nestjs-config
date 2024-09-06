import { Test, TestingModule } from "@nestjs/testing";

import { DBConfig } from "../lib/__config/db.config";
import { EnvironmentConfigModule } from "../lib/config.module";
import { ApiConfig } from "../lib/__config/api.config";

describe("EnvConfig without Schema", () => {
  let dbConfig: DBConfig;
  let apiConfig: ApiConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EnvironmentConfigModule.forRoot({
          basePath: "./lib/__config",
          configClass: [DBConfig, ApiConfig],
          schema: "none",
          nestConfigOptions: {
            envFilePath: "./tests/.env.tests",
          },
        }),
      ],
    }).compile();

    dbConfig = module.get<DBConfig>(DBConfig);
    apiConfig = module.get<ApiConfig>(ApiConfig);
  });

  it("should retrieve configuration properties from DbConfig", () => {
    expect(dbConfig).toBeDefined();
    expect(dbConfig.name).toBe("tests_db");
    expect(dbConfig.port).toBe(27017);
    expect(dbConfig.secure).toBe(false);
    expect(dbConfig.host).toBe("localhost");
    expect(dbConfig.user).toBe("root");
  });

  it("should retrieve configuration properties from ApiConfig", () => {
    expect(apiConfig).toBeDefined();
    expect(apiConfig.apiName).toBe("my-default-api");
    expect(apiConfig.host).toBe("http://localhost");
    expect(apiConfig.port).toBe(3000);
    expect(apiConfig.path).toBe("/api/v1");
  });
});
