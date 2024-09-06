import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { sync } from "fast-glob";
import { readFileSync } from "fs";
import { join } from "path";
import { EnvProperty } from "../decorators/env-property.decorator";

export function getDecoratorDetailsFromSource(
  filePath: string
): ClassDecorators {
  const sourceCode = readFileSync(filePath, "utf-8");
  const ast = parse(sourceCode, {
    sourceType: "module",
    plugins: ["typescript", "decorators-legacy"],
  });

  const result: ClassDecorators = {};

  traverse(ast, {
    ClassDeclaration(path: any) {
      const className = path.node.id.name;
      result[className] = {
        properties: {},
      };

      path.node.body.body.forEach((classElement: any) => {
        if (t.isClassProperty(classElement)) {
          const propertyName = (classElement.key as any).name;
          result[className].properties[propertyName] = {};

          if (classElement.decorators) {
            classElement.decorators.forEach((decorator: any) => {
              if (t.isCallExpression(decorator.expression)) {
                const decoratorName = decorator.expression.callee.name;
                const decoratorArgs = decorator.expression.arguments;

                if (
                  decoratorName === EnvProperty.name &&
                  decoratorArgs.length > 0
                ) {
                  const decoratorDetails: any = {};

                  decoratorArgs[0].properties.forEach((prop: any) => {
                    let key: string;

                    if (t.isIdentifier(prop.key)) {
                      key = prop.key.name;
                    } else if (t.isStringLiteral(prop.key)) {
                      key = prop.key.value;
                    } else {
                      return;
                    }

                    const value = prop.value;

                    if (t.isStringLiteral(value)) {
                      decoratorDetails[key] = value.value;
                    } else if (t.isBooleanLiteral(value)) {
                      decoratorDetails[key] = value.value;
                    } else if (t.isNumericLiteral(value)) {
                      decoratorDetails[key] = value.value;
                    }
                  });

                  result[className].properties[propertyName] = decoratorDetails;
                }
              }
            });
          }
        }
      });
    },
  });

  return result;
}

export function findClassesWithDecorators(baseDir: string) {
  const pattern = join(baseDir, "**/*.ts");
  const files = sync(pattern);
  const classesWithDecorators: ClassDecorators = {};

  files.forEach((file) => {
    const classDetails = getDecoratorDetailsFromSource(file);
    Object.assign(classesWithDecorators, classDetails);
  });

  return classesWithDecorators;
}

export interface ClassDecorator {
  properties?: {
    [propertyName: string]: {
      key?: string;
      isRequired?: boolean;
      defaultValue?: any;
    };
  };
}

export interface ClassDecorators {
  [className: string]: ClassDecorator;
}
