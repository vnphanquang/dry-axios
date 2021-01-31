/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import 'reflect-metadata';

import {
  ParamMetadataKey,
  QueryMetadataKey,
  BodyMetadataKey,
} from '../constants';
import { ArgumentMap } from '../types';

export function Param(paramName: string) {
  return function (target: any, methodName: string, parameterIndex: number):void {
    let paramMetadata: ArgumentMap = Reflect.getOwnMetadata(ParamMetadataKey, target, methodName);
    if (!paramMetadata) {
      paramMetadata = {};
    }
    paramMetadata[paramName] = parameterIndex;
    Reflect.defineMetadata(ParamMetadataKey, paramMetadata, target, methodName);
  };
}

export function Query(queryName: string) {
  return function (target: any, methodName: string, parameterIndex: number):void {
    let queryMetadata: ArgumentMap = Reflect.getOwnMetadata(QueryMetadataKey, target, methodName);
    if (!queryMetadata) {
      queryMetadata = {};
    }
    queryMetadata[queryName] = parameterIndex;
    Reflect.defineMetadata(QueryMetadataKey, queryMetadata, target, methodName);
  };
}

export function Body(target: any, methodName: string, parameterIndex: number):void {
  Reflect.defineMetadata(BodyMetadataKey, parameterIndex, target, methodName);
}
