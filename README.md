# NestJS AutoConfigurable Environment config

## Overview

NestJS module that provides a simple way to configure your application using environment variables. It allows you to define a configuration class with properties that map to environment variables and their default values. The module automatically reads the environment variables and populates the configuration properties with the values. It also create a validation schema based on the configuration class that can use zod or joi.

## Installation

To install the `@fneiraj/nestjs-config` module, run the following command:

```bash
npm install @fneiraj/nestjs-config
```

## How to Use

### Importing the Module

Import the `EnvironmentConfigModule` into your AppModule and use the `forRoot` method to specify the configuration class.

```typescript
import { Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "@fneiraj/nestjs-config";
import { ApiConfig } from "./config/api.config";
import { DBConfig } from "./config/db.config";

@Module({
  imports: [
    EnvironmentConfigModule.forRoot({
      basePath: "./src", // optional, default is "./src"
      configClass: [DBConfig, ApiConfig], // required, configuration classes to be used
      schema: "joi", // optional, default is "none", can be "joi" or "zod" to validate type and required fields
      nestConfigOptions: { // optional, can be used to pass options to the nest config module
        envFilePath: ".env",
      },
    }),
    // other modules..
  ],
})
export class AppModule {}
```

### Defining the Configuration Class

Create a configuration *abstract* class with properties that map to environment variables. Use the `EnvProperty` decorator to define the properties and specify the environment variable name and default value.

```typescript
import { EnvProperty } from "@fneiraj/nestjs-config";

export abstract class ApiConfig {
  @EnvProperty({
    key: "API_NAME",
    defaultValue: "my-default-api",
  })
  apiName: string;

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
```

The `EnvProperty` decorator accepts an object with the following properties:

- **key**: The name of the environment variable.
- **defaultValue**: The default value for the property.
- **isRequired**: A boolean value indicating whether the property is required. If set to `true` and set schema to "joi" or "zod" it will validate that the property is set.

## Accessing the Configuration Properties

You can access the configuration properties by injecting the abstract class into your service or controller. The properties will be automatically populated with the values from the environment variables.

```typescript
import { Injectable, Logger } from "@nestjs/common";
import { ApiConfig } from "./config/api.config";
import { DBConfig } from "./config/db.config";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly apiConfig: ApiConfig,
    private readonly dbConfig: DbConfig
  ) {
    this.logger.log(this.apiConfig);
    this.logger.log(this.dbConfig);
  }

  getApiHost(): number {
    return this.apiConfig.host;
  }
}
```

## WIP

- [ ] Add support for AutoScanning of configuration classes withouth the need to import them in the module
- [ ] Add support for more types of fields like arrays, objects, etc.
