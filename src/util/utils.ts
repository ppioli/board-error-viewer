export function getErrorMessage(error: unknown): Error {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }
  if (typeof error === 'string') {
    return {
      message: error,
      stack: undefined,
      name: 'UNSPECIFIED_ERROR',
    };
  }
  return {
    message: 'Unexpected error',
    name: 'UNEXPECTED_ERROR',
  };
}
