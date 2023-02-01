import { ApiError, ClientError } from './ApiError';
import { handleError } from '../main/util';

export interface ApiResult<T> {
  result: T | null;
  error: ClientError | ApiError | null;
}

export function okResult<T>(result: T): ApiResult<T> {
  return {
    result,
    error: null
  };
}

export function clientErrorResult<T>(displayMessage: string): ApiResult<T> {
  return {
    error: { displayMessage},
    result: null
  }
}

export function apiErrorResult<T>(error: any){
  return {
    result: null,
    error: handleError(error),
  }
}


