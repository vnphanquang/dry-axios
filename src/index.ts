export * from './decorators/class';
export * from './decorators/method';
export * from './decorators/parameter';

export function Asserted<T>(value?: any): T {
  return value as T;
}
