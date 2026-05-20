/** Represents a persisted request record returned by the backend. */
export interface SrtRequest {
  id: number;
  name: string;
  title: string;
  description: string;
  createdAt: string; // ISO 8601 datetime string, e.g. "2026-05-19T14:32:00"
}

/** Payload sent to POST /api/requests. */
export interface CreateRequestPayload {
  name: string;
  title: string;
  description: string;
}

/** Error response body returned on 400/500. */
export interface ApiError {
  error: string;   // machine-readable code, e.g. "Validation failed"
  message: string; // human-readable description
}
