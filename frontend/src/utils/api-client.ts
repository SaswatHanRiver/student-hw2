import axios, { isAxiosError } from "axios";
import type { ApiError, ApiFieldError } from "@/types/student";

// Base URL of the Spring Boot API. NEXT_PUBLIC_* values are baked in at build time.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// Requests that take longer than this are treated as a network error
const REQUEST_TIMEOUT_MS = 30_000;

// One shared axios instance for every service
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

const NETWORK_ERROR_MESSAGE = "We couldn't reach the server. Check your connection, then try again.";
const UNKNOWN_ERROR_MESSAGE = "Something went wrong. Please try again.";

// Reads the API's ApiError body if there is one
function readApiError(error: unknown): ApiError | null {
  if (isAxiosError(error) && error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as Partial<ApiError>;
    if (typeof data.message === "string") {
      return { code: data.code ?? "UNKNOWN", message: data.message, fieldErrors: data.fieldErrors ?? [] };
    }
  }
  return null;
}

// The sentence to show the user for any failed request
export function getApiErrorMessage(error: unknown): string {
  const apiError = readApiError(error);
  if (apiError) return apiError.message;
  if (isAxiosError(error) && !error.response) return NETWORK_ERROR_MESSAGE;
  return UNKNOWN_ERROR_MESSAGE;
}

// Field-level errors from the API (validation 400 or duplicate 409), keyed by field name
export function getApiFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: ApiFieldError[] = readApiError(error)?.fieldErrors ?? [];
  return Object.fromEntries(fieldErrors.map((fieldError) => [fieldError.field, fieldError.message]));
}

// True when the API answered 404
export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}
