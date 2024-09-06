import { EnvProperty } from "../decorators/env-property.decorator";

export abstract class DBConfig {
  @EnvProperty({
    key: "DB_NAME",
    isRequired: true,
  })
  name: string;

  @EnvProperty({
    key: "DB_HOST",
    isRequired: true,
  })
  host: string;

  @EnvProperty({
    key: "DB_PORT",
    defaultValue: 27017,
  })
  port: number;

  @EnvProperty({
    key: "DB_SECURE",
    defaultValue: false,
  })
  secure: boolean;

  @EnvProperty({
    key: "DB_USER",
    defaultValue: "root",
  })
  user: string;

  @EnvProperty({
    key: "DB_PASS",
    isRequired: true,
  })
  password: string;
}
