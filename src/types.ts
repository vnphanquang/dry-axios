/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';

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
  /** Determine if axios response should be preserved or map to response.data (default: false) */
  preserveAxiosResponse?: boolean,
  map?: <ResponseData, MappedData>(response: ResponseData) => MappedData,
}

export interface DeepObject<T> {
  [key: string]: T | DeepObject<T>;
}

export type FlatPathValueMap = Record<string, string>;

export interface SampleConfig<Runtime extends Record<string, unknown> = {}> {
  /**
   * Resolve to sample data, can be sync or async
   */
  resolver: () => Promise<any> | any,
  /**
   * Whether to return sample data immediately instead of calling api
   */
  apply?: boolean | ((runtime: Runtime) => Promise<boolean> | boolean),
  /**
   * Whether to validate api response against sample data.
   * Validation operation will be triggered asynchronously
   * upon receiving response.
   */
  validate?: boolean | ((runtime: Runtime) => Promise<boolean> | boolean),
  /**
   * Custom logger for validation operation.
   * Default to console.warn
  */
  logger?: (message: string, identifier: string) => Promise<any> | any,
}

export interface HttpConfig<Runtime extends Record<string, unknown> = {}> {
  /**
   * axios config passed to axios.create
   */
  axios: AxiosRequestConfig,
  /**
   * axios request interceptors
   */
  reqInterceptors: RequestInterceptor[],
  /**
   * axios response interceptors
   */
  resInterceptors: ResponseInterceptor[],
  /**
   * user-defined runtime config passed to method decorator config
   */
  runtime: Runtime,
}
