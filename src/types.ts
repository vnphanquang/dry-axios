import type { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface ArgumentMap {
  [name: string]: number;
}

export type RequestInterceptor = [
  onFulfilled: (config: AxiosRequestConfig) => AxiosRequestConfig,
  onRejected?: (error: any) => any,
];

export type ResponseInterceptor = [
  onFulfilled: (config: AxiosResponse) => AxiosResponse,
  onRejected?: (error: any) => any,
];

export interface HttpService {
  new (...args: any[]): {};
}

export interface DryAxiosConfig extends AxiosRequestConfig {
  /** Determine if axios response should be preserved or map to response.data (default: false)*/
  preserveAxiosResponse?: boolean,
  map?: <ResponseData, MappedData>(response: ResponseData) => MappedData,
}
