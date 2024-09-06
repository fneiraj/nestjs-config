import { ClassDecorators } from "./extract-class-data";

export const createValidationSchema = (
  schema: "zod" | "joi" | "none",
  classes: ClassDecorators
) => {
  if (schema === "none") {
    return {};
  }

  try {
    const properties = getEnvironmentKeysDefinition(classes);
    return schema === "zod"
      ? createZodSchema(properties)
      : createJoiSchema(properties);
  } catch (e) {
    return {};
  }
};

const getEnvironmentKeysDefinition = (classes: ClassDecorators) => {
  const output = {} as any;
  for (const configKey in classes) {
    const properties = classes[configKey].properties;
    for (const propName in properties) {
      const prop = properties[propName];
      output[prop.key] = {
        isRequired: prop.isRequired,
        defaultValue: prop.defaultValue,
      };
    }
  }
  return output;
};

const createZodSchema = (input: {
  [key: string]: { isRequired: boolean; defaultValue: string };
}) => {
  const { z } = require("zod");
  const schema = {} as any;
  for (const key in input) {
    const { isRequired, defaultValue } = input[key];
    let type = z.string();
    if (typeof defaultValue === "number") {
      type = z.coerce.number();
    } else if (typeof defaultValue === "boolean") {
      type = z.coerce.boolean();
    }
    schema[key] = isRequired ? type : type.optional();
  }

  const zodSchema = z.object(schema);

  return {
    validate: (config: Record<string, unknown>) => zodSchema.parse(config),
  };
};

const createJoiSchema = (input: {
  [key: string]: { isRequired: boolean; defaultValue: string };
}) => {
  const Joi = require("joi");
  const schema = {} as any;
  for (const key in input) {
    const { isRequired, defaultValue } = input[key];
    let type = Joi.string();
    if (typeof defaultValue === "number") {
      type = Joi.number();
    } else if (typeof defaultValue === "boolean") {
      type = Joi.boolean();
    }
    schema[key] = isRequired ? type.required() : type;
  }
  return { validationSchema: Joi.object(schema) };
};
