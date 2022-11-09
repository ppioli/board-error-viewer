import { getErrorMessage } from '../util/utils';

export interface ApiResult<T> {
  result: null | T;
  error: null | Error;
}

export function okResult<T>(result: T): ApiResult<T> {
  return {
    result,
    error: null,
  };
}
export function noResult<T>(error: any): ApiResult<T> {
  return {
    result: null,
    error: getErrorMessage(error),
  };
}
