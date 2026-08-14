/**
 * Native TypeScript Type Guards
 * Zero 'any', pure runtime narrowers using control-flow analysis.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export interface ApiErrorPayload {
  readonly statusCode: number;
  readonly message: string;
  readonly code?: string;
  readonly fieldErrors?: Readonly<Record<string, string>>;
  readonly retryAfter?: number;
}

/**
 * Type guard for H3 / ofetch / Nuxt API errors
 */
export function isApiError(err: unknown): err is {
  statusCode: number;
  data?: { code?: string; message?: string; fieldErrors?: Record<string, string>; retryAfter?: number };
  response?: { status?: number; _data?: { data?: { code?: string; retryAfter?: number; message?: string; fieldErrors?: Record<string, string> } } };
} {
  if (!isRecord(err)) return false;

  const hasStatusCode = "statusCode" in err && typeof err.statusCode === "number";
  const hasResponseStatus =
    "response" in err &&
    isRecord(err.response) &&
    typeof err.response.status === "number";

  return hasStatusCode || hasResponseStatus;
}

/**
 * Extracts normalized API error payload safely
 */
export function extractApiError(err: unknown): ApiErrorPayload {
  if (isApiError(err)) {
    const statusCode =
      typeof err.statusCode === "number"
        ? err.statusCode
        : typeof err.response?.status === "number"
        ? err.response.status
        : 500;

    const data = isRecord(err.data)
      ? err.data
      : isRecord(err.response?._data) && isRecord(err.response._data.data)
      ? err.response._data.data
      : {};

    const code = isString(data.code) ? data.code : undefined;
    const message = isString(data.message) ? data.message : "Đã xảy ra lỗi kết nối";
    const fieldErrors = isRecord(data.fieldErrors)
      ? (data.fieldErrors as Record<string, string>)
      : undefined;
    const retryAfter = isNumber(data.retryAfter) ? data.retryAfter : undefined;

    return {
      statusCode,
      code,
      message,
      fieldErrors,
      retryAfter,
    };
  }

  if (isError(err)) {
    return {
      statusCode: 500,
      message: err.message,
    };
  }

  return {
    statusCode: 500,
    message: "Có lỗi không xác định xảy ra",
  };
}
