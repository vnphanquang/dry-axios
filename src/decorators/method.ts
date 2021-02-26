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
} from '../constants';
import { ArgumentMap, DryAxiosConfig } from '../types';

function createApi(endpoint: string = '/', method: Method, config: DryAxiosConfig = {}) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    descriptor.value = function<T> (...args: any[]): Promise<AxiosResponse<T>> {
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

      const queryMetadata: ArgumentMap = Reflect.getOwnMetadata(QueryMetadataKey, target, methodName);
      let queries: Record<string, string> | null = null;
      if (queryMetadata) {
        queries = {};
        for (const name of Object.keys(queryMetadata)) {
          const argIndex = queryMetadata[name];
          queries[name] = args[argIndex];
        }
      }

      let body: Record<string, any> | null = null;
      if (Reflect.hasOwnMetadata(BodyMetadataKey, target, methodName)) {
        const bodyMetadata = Reflect.getOwnMetadata(BodyMetadataKey, target, methodName);
        body = args[bodyMetadata];
      }

      const jwtResolver: () => string | null = Reflect.getOwnMetadata(JwtMetadataKey, target, methodName);
      const jwt = jwtResolver && jwtResolver();

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

      const response = axios.request(requestConfig);
      if (config.preserveAxiosResponse) return response;
      if (config.map) {
        return response
          .then((res) => new Promise(
            (resolve) => resolve(config.map?.(res.data) ?? res.data),
          ));
      }
      return response.then((res) => new Promise((resolve) => resolve(res.data)));
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
 * @param {Function} resolver callback that will return jwt for api auth
 */
export function Jwt(resolver: () => string) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(JwtMetadataKey, resolver, target, methodName);
    return descriptor;
  };
}
