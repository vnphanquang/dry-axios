/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */
export const ParamMetadataKey = Symbol('Param');
export const QueryMetadataKey = Symbol('Query');
export const BodyMetadataKey = Symbol('Body');
export const AxiosMetadataKey = Symbol('Axios');
export const JwtMetadataKey = Symbol('Jwt');
export const SampleMetadataKey = Symbol('Sample');

export const SampleConfigDefault = {
  resolver: (): {} => ({}),
  apply: false,
  validate: false,
  logger: (message: string, identifier: string): void => console.warn(message),
};
