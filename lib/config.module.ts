import {
  Abstract,
  DynamicModule,
  Logger,
  Module,
  Provider,
} from "@nestjs/common";
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from "@nestjs/config";
import { createDynamicClass } from "./utils/create-dynamic-class";
import {
  ClassDecorators,
  findClassesWithDecorators,
} from "./utils/extract-class-data";
import { createValidationSchema } from "./utils/create-validation-schemas";

export interface AutoScanOptions {
  autoScan: true;
  configClass?: never;
  isGlobal?: boolean;
  schema?: "zod" | "joi" | "none";
  basePath?: string;
  nestConfigOptions?: ConfigModuleOptions;
}

export interface NoAutoScanOptions {
  autoScan?: false;
  configClass: Abstract<any> | Abstract<any>[];
  isGlobal?: boolean;
  schema?: "zod" | "joi" | "none";
  basePath?: string;
  nestConfigOptions?: ConfigModuleOptions;
}

export type EnvironmentConfigModuleOptions = NoAutoScanOptions;

@Module({})
export class EnvironmentConfigModule {
  private static readonly logger = new Logger("EnvironmentAutoConfigModule");

  static forRoot(options: EnvironmentConfigModuleOptions): DynamicModule {
    /*if (!options.configClass && !options.autoScan) {
      this.logger.warn(
        "No config class provided. Please provide a config class to EnvironmentConfigModule"
      );
      return {
        module: EnvironmentConfigModule,
        providers: [],
        exports: [],
      };
    }*/

    const providers: Provider[] = [];

    if (
      Array.isArray(options.configClass) &&
      options.configClass?.length === 0 &&
      !options.autoScan
    ) {
      return {
        module: EnvironmentConfigModule,
        providers: [],
        exports: [],
      };
    }

    const classesWithDecorators = findClassesWithDecorators(
      options.basePath || "./src"
    );

    //    if (!options.autoScan) {
    if (Array.isArray(options.configClass)) {
      options.configClass.forEach((option) => {
        providers.push(this.getProvider(classesWithDecorators, option));
      });
    } else {
      const configAbstractClass = options.configClass as Abstract<any>;
      providers.push(
        this.getProvider(classesWithDecorators, configAbstractClass)
      );
    }
    //    } else {
    //      providers.push(this.getAllProviders(classesWithDecorators));
    //    }

    const schema = createValidationSchema(
      options.schema || "none",
      classesWithDecorators
    );

    const nestConfigOptions = options.nestConfigOptions || {};

    return {
      module: EnvironmentConfigModule,
      global: options.isGlobal || false,
      imports: [ConfigModule.forRoot({ ...schema, ...nestConfigOptions })],
      providers: [...providers],
      exports: [...providers],
    };
  }
  /*
  private static getAllProviders(classesWithDecorators: ClassDecorators) {
    const providers: Provider[] = [];

    Object.keys(classesWithDecorators).forEach((className) => {
      providers.push(this.getProvider(classesWithDecorators, null));
    });

    return providers;
  }*/

  private static getProvider(
    classesWithDecorators: ClassDecorators,
    configAbstractClass: Abstract<any>
  ) {
    return {
      provide: configAbstractClass,
      useFactory: (configService: ConfigService) => {
        this.logger.log(`Creating instance of ${configAbstractClass.name}`);
        for (const className in classesWithDecorators) {
          if (className !== configAbstractClass.name) {
            continue;
          }

          const configClass = createDynamicClass(
            className,
            classesWithDecorators[className],
            configService
          );

          const instance = new configClass();
          this.logger.log(`Instance of ${configAbstractClass.name} created`);
          return instance;
        }

        throw new Error(`Class ${configAbstractClass.name} not found`);
      },
      inject: [ConfigService],
    };
  }
}
