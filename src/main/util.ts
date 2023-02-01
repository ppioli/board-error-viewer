import { ApiError } from '../model/ApiError';

/**
 * A typeguarded version of `instanceof Error` for NodeJS.
 * @author Joseph JDBar Barron
 * @link https://dev.to/jdbar
 */
export function instanceOfNodeError<T extends new (...args: any) => Error>(
  value: Error,
  errorType: T
): value is InstanceType<T> & NodeJS.ErrnoException {
  return value instanceof errorType;
}

export function handleError(error: any) : ApiError {
  if( instanceOfNodeError(error, Error) ){
    return error;
  } else if( typeof error === 'string'){
    return new Error(error)
  } else {
    throw new Error()
  }
}





