/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DeepObject, FlatPathValueMap } from '../types';

export function getTypeOfVariable(variable: any): string {
  if (variable === null) return 'null';
  if (Array.isArray(variable)) return 'array';
  return typeof variable;
}

export function extractObjectFlatValuePathMap<T>(deepObject: DeepObject<T>): FlatPathValueMap {
  const flatPathValueMap: FlatPathValueMap = {};
  const op: (object: DeepObject<T>, ...parentKeys: string[]) => DeepObject<string> = (object: DeepObject<T>, ...parentKeys: string[]) => {
    const map: DeepObject<string> = {};
    for (const [key, value] of Object.entries(object)) {
      if (getTypeOfVariable(value) === 'object') {
        map[key] = op(value as DeepObject<T>, ...[...parentKeys, key]);
      } else {
        const path = [...parentKeys, key].join('.');
        flatPathValueMap[path] = getTypeOfVariable(value);
        map[key] = [...parentKeys, key].join('.');
      }
    }
    return map;
  };
  op(deepObject);
  return flatPathValueMap;
}

export async function validateResponseFormat(
  sample: any,
  response: any,
  identifier: string,
  logger: (message: string, identifier: string) => any = (message: string) => { console.warn(message); },
): Promise<void> {
  const type = getTypeOfVariable(response);
  if (getTypeOfVariable(sample) !== type) {
    logger(`Mismatch "${identifier}" api: Response type ${type} does not match provided sample ${getTypeOfVariable(sample)}!`, identifier);
  }

  if (type !== 'object') return;

  const sampleMap = extractObjectFlatValuePathMap(sample);
  const responseMap = extractObjectFlatValuePathMap(response);

  for (const [samplePropPath, samplePropType] of Object.entries(sampleMap)) {
    const responsePropType = responseMap[samplePropPath];
    if (!responsePropType) {
      logger(`NotFound "${identifier}" api: property at ".${samplePropPath}" in sample is not found in response!`, identifier);
    } else if (responsePropType !== samplePropType) {
      logger(`Mismatch "${identifier}" api: property at ".${samplePropPath} has type "${responsePropType}" in sample but has type "${samplePropType}" in request!`, identifier);
    }
  }
}
