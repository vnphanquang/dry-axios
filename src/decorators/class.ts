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

import { AxiosMetadataKey } from '../constants';
import {
  HttpService,
  RequestInterceptor,
  ResponseInterceptor,
} from '../types';

/**
 * Http Class decorator
 * Indicates that this class is an Http Axios wrapper service.
 *
 * @param {AxiosStatic} axios axios static (usually from "import axios from 'axios'"")
 * @param {AxiosRequestConfig} config axios config passed to axios.create
 * @param {RequestInterceptor[]} reqInterceptors axios request interceptors
 * @param {ResponseInterceptor[]} resInterceptors axios response interceptors
 */
export function Http(
  axios: AxiosStatic,
  config: AxiosRequestConfig,
  reqInterceptors: RequestInterceptor[] = [],
  resInterceptors: ResponseInterceptor[] = [],
) {
  return function<T extends HttpService>(constructor: T) {
    return class extends constructor {
      axiosInstance: AxiosInstance;
      axiosConfig: AxiosRequestConfig;

      constructor(...args: any[]) {
        super(...args);

        // create an axios instance with provided config
        this.axiosConfig = config;
        this.axiosInstance = axios.create(config);

        // hook in interceptors if any
        for (const interceptor of reqInterceptors) {
          this.axiosInstance.interceptors.request.use(...interceptor);
        }
        for (const interceptor of resInterceptors) {
          this.axiosInstance.interceptors.response.use(...interceptor);
        }

        Reflect.defineMetadata(AxiosMetadataKey, this.axiosInstance, constructor);
      }
    };
  };
}

export default {};
