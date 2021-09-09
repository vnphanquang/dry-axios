/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */

import { HttpConfig, SampleConfig } from './types';

/* eslint-disable no-console */
export const ParamMetadataKey = Symbol('Param');
export const QueryMetadataKey = Symbol('Query');
export const BodyMetadataKey = Symbol('Body');
export const AxiosMetadataKey = Symbol('Axios');
export const RuntimeMetadataKey = Symbol('RuntimeMetadataKey');
export const JwtMetadataKey = Symbol('Jwt');
export const SampleMetadataKey = Symbol('Sample');

export const DefaultSampleConfig: SampleConfig = {
  resolver: (): {} => ({}),
  apply: false,
  validate: false,
  logger: (message: string, identifier: string): void => console.warn(message),
};

export const DefaultHttpParameters: HttpConfig = {
  axios: {},
  reqInterceptors: [],
  resInterceptors: [],
  runtime: {},
};
