import { EnvProperty } from "../decorators/env-property.decorator";

export abstract class ApiConfig {
  @EnvProperty({
    key: "API_NAME",
    defaultValue: "my-default-api",
  })
  apiName: string;

  @EnvProperty({
    key: "API_USE_SSL",
    isRequired: true,
  })
  useSsl: boolean;

  @EnvProperty({
    key: "API_HOST",
    isRequired: true,
  })
  host: string;

  @EnvProperty({
    key: "API_PORT",
    defaultValue: 3000,
  })
  port: number;

  @EnvProperty({
    key: "API_BASE_PATH",
    defaultValue: "/api/v1",
  })
  path: string;
}
