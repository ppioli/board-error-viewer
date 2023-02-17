import { ApiError } from '../model/ApiError';

export function isApiError(error: any) : error is ApiError {
  return error.displayMessage === undefined
}
