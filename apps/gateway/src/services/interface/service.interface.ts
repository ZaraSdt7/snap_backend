export interface MainServiceResponse<T = unknown> {
  context?: unknown;
  status: 'SUCCEED' | 'FAILED';
  code: number;
  message?: string | null;
  error?: string | null;
  data?: T | null;
}
