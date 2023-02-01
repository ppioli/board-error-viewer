export interface ApiError {
  message: string;
  code?: string;
  stack?: string;
}

export interface ClientError {
  displayMessage: string;
  helpMessage?: string;
}

export function isClientError(
  error: ApiError | ClientError
): error is ApiError {
  return (error as ClientError).displayMessage === undefined
}
