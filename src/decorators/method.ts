/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */

import {
  AxiosInstance,
  AxiosResponse,
  Method,
} from 'axios';
import 'reflect-metadata';
import deepmerge from 'ts-deepmerge';

import {
  QueryMetadataKey,
  ParamMetadataKey,
  BodyMetadataKey,
  AxiosMetadataKey,
  JwtMetadataKey,
  SampleMetadataKey,
  DefaultSampleConfig,
  RuntimeMetadataKey,
} from '../constants';
import {
  ArgumentMap, DryAxiosConfig, SampleConfig,
} from '../types';
import { validateResponseFormat } from '../utils';

function createApi(endpoint: string = '/', method: Method, config: DryAxiosConfig = {}) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    descriptor.value = async function<T> (...args: any[]): Promise<AxiosResponse<T> | T> {
      // resolve sample if specified
      let sample: SampleConfig = DefaultSampleConfig;
      if (Reflect.hasOwnMetadata(SampleMetadataKey, target, methodName)) {
        sample = Reflect.getOwnMetadata(SampleMetadataKey, target, methodName);
      }

      const runtime = Reflect.getOwnMetadata(RuntimeMetadataKey, target.constructor);

      const shouldApplySample = typeof sample.apply === 'function' ? await sample.apply(runtime) : sample.apply;

      if (shouldApplySample) {
        const sampleResponse = await sample.resolver();
        return sampleResponse;
      }

      // prepend url with '/'
      let resolvedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      // resolve segments
      const paramMetadata: ArgumentMap = Reflect.getOwnMetadata(ParamMetadataKey, target, methodName);
      if (paramMetadata) {
        for (const name of Object.keys(paramMetadata)) {
          const argIndex = paramMetadata[name];
          resolvedEndpoint = resolvedEndpoint.replace(`<${name}>`, args[argIndex]);
        }
      }

      // construct query object
      const queryMetadata: ArgumentMap = Reflect.getOwnMetadata(QueryMetadataKey, target, methodName);
      let queries: Record<string, string> | null = null;
      if (queryMetadata) {
        queries = {};
        for (const name of Object.keys(queryMetadata)) {
          const argIndex = queryMetadata[name];
          queries[name] = args[argIndex];
        }
      }

      // construct body if any
      let body: Record<string, any> | null = null;
      if (Reflect.hasOwnMetadata(BodyMetadataKey, target, methodName)) {
        const bodyMetadata = Reflect.getOwnMetadata(BodyMetadataKey, target, methodName);
        body = args[bodyMetadata];
      }

      // resolve jwt if specified
      const jwtResolver: (runtime: any) => Promise<string> | null = Reflect.getOwnMetadata(JwtMetadataKey, target, methodName);
      const jwt = jwtResolver && await jwtResolver(runtime);

      const axios: AxiosInstance = Reflect.getOwnMetadata(AxiosMetadataKey, target.constructor);

      const requestConfig = deepmerge({
        url: resolvedEndpoint,
        method,
        ...(body && { data: body }),
        ...(queries && { params: queries }),
        headers: {
          ...(jwt && { Authorization: `Bearer ${jwt}` }),
        },
      }, config);

      const response = await axios.request(requestConfig);

      const shouldValidateAgainstSample = typeof sample.validate === 'function' ? await sample.validate(runtime) : sample.validate;
      if (shouldValidateAgainstSample) {
        const sampleResponse = await sample.resolver();
        validateResponseFormat(
          sampleResponse,
          response.data,
          methodName,
          sample.logger,
        );
      }

      if (config.preserveAxiosResponse) return response;
      if (config.map) {
        return config.map?.(response.data) ?? response.data;
      }
      return response.data;
    };
    return descriptor;
  };
}

/**
 * Method decorator.
 * Indicates that this method use a get request.
 *
 * @param {string} endpoint Method endpoint.
 */
export function Get(endpoint: string, config?: DryAxiosConfig) {
  return createApi(endpoint, 'GET', config);
}

/**
 * Method decorator.
 * Indicates that this method use a post request.
 *
 * @param {string} endpoint Method endpoint.
 */
export function Post(endpoint: string, config?: DryAxiosConfig) {
  return createApi(endpoint, 'POST', config);
}

/**
 * Method decorator.
 * Indicates that this method use a put request.
 *
 * @param {string} endpoint Method endpoint.
 */
export function Put(endpoint: string, config?: DryAxiosConfig) {
  return createApi(endpoint, 'PUT', config);
}

/**
 * Method decorator.
 * Indicates that this method use a patch request.
 *
 * @param {string} endpoint Method endpoint.
 */
export function Patch(endpoint: string, config?: DryAxiosConfig) {
  return createApi(endpoint, 'PATCH', config);
}

/**
 * Method decorator.
 * Indicates that this method use a delete request.
 *
 * @param {string} endpoint Method endpoint.
 */
export function Delete(endpoint: string, config?: DryAxiosConfig) {
  return createApi(endpoint, 'DELETE', config);
}

/**
 * Method decorator
 * Indicates that this method use jwt for authentication
 *
 * @param {Function} resolver (async/sync) callback that will return jwt for api auth
 */
export function Jwt<Runtime extends Record<string, unknown>>(resolver: (runtime: Runtime) => (Promise<string | undefined> | string | undefined)) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(JwtMetadataKey, resolver, target, methodName);
    return descriptor;
  };
}

/**
 * Method decorator
 * For quick reference to sample response during development,
 * and (optionally) apply mocked sample during testing.
 *
 * @param {SampleConfig} config determines what, how, when to resolve sample response
 */
export function Sample<Runtime extends Record<string, unknown> = {}>(
  config: SampleConfig<Runtime> = DefaultSampleConfig,
) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    config = {
      ...DefaultSampleConfig,
      ...config,
    };
    Reflect.defineMetadata(SampleMetadataKey, config, target, methodName);
    return descriptor;
  };
}
