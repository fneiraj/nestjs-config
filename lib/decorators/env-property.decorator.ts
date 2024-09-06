type RequiredWithoutDefault = {
  key: string;
  isRequired: true;
  defaultValue?: never;
};

type OptionalWithDefault = {
  key: string;
  isRequired?: false;
  defaultValue: any;
};

export type ConfigProp = RequiredWithoutDefault | OptionalWithDefault;

export const EnvProperty = ({ key, isRequired, defaultValue }: ConfigProp) => {
  return (target: any, propertyKey: string | symbol) => {};
};
