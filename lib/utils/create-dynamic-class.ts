import { ConfigService } from "@nestjs/config";
import { ClassDecorator } from "./extract-class-data";

export function createDynamicClass(
  className: string,
  { properties }: ClassDecorator,
  configService: ConfigService
) {
  const DynamicClass = class {
    static className = className;
  };

  for (const prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      Object.defineProperty(DynamicClass.prototype, prop, {
        get() {
          const valueFromEnv = configService.get(properties[prop].key, {
            infer: true,
          });

          const returnValue =
            valueFromEnv !== undefined
              ? parseValue(valueFromEnv)
              : properties[prop].defaultValue;

          return returnValue;
        },
        enumerable: true,
        configurable: true,
      });
    }
  }

  return DynamicClass;
}

function parseValue(value: any) {
  if (
    !isNaN(value) &&
    Object.hasOwnProperty.call(value, "trim") &&
    value.trim() !== ""
  ) {
    return Number(value);
  }

  if (
    Object.hasOwnProperty.call(value, "toLowerCase") &&
    value.toLowerCase() === "true"
  ) {
    return true;
  }
  if (
    Object.hasOwnProperty.call(value, "toLowerCase") &&
    value.toLowerCase() === "false"
  ) {
    return false;
  }

  return value;
}
