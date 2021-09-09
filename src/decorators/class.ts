/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosStatic,
} from 'axios';
import deepmerge from 'ts-deepmerge';

import {
  AxiosMetadataKey,
  DefaultHttpParameters,
  RuntimeMetadataKey,
} from '../constants';
import {
  HttpConfig,
  HttpService,
} from '../types';

/**
 * Http Class decorator
 * Indicates that this class is an Http Axios wrapper service.
 *
 * @param {AxiosStatic} axios axios static (usually from "import axios from 'axios'"")
 * @param {HttpConfig} config
 */
export function Http<RuntimeConfig extends Record<string, unknown> = {}>(
  axios: AxiosStatic,
  config: Partial<HttpConfig<RuntimeConfig>> = {},
) {
  return function<T extends HttpService>(constructor: T) {
    return class extends constructor {
      axiosInstance: AxiosInstance;
      axiosConfig: AxiosRequestConfig;
      runtime: RuntimeConfig;

      constructor(...args: any[]) {
        super(...args);

        const mergedConfig = deepmerge(DefaultHttpParameters, config);

        // create an axios instance with provided config
        this.axiosConfig = mergedConfig.axios;
        this.axiosInstance = axios.create(this.axiosConfig);
        this.runtime = mergedConfig.runtime;

        // hook in interceptors if any
        for (const interceptor of mergedConfig.reqInterceptors) {
          this.axiosInstance.interceptors.request.use(...interceptor);
        }
        for (const interceptor of mergedConfig.resInterceptors) {
          this.axiosInstance.interceptors.response.use(...interceptor);
        }

        Reflect.defineMetadata(AxiosMetadataKey, this.axiosInstance, constructor);
        Reflect.defineMetadata(RuntimeMetadataKey, this.runtime, constructor);
      }
    };
  };
}

export default {};
