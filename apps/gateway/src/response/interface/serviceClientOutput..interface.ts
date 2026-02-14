export interface ServiceClientOutputDto<T = any> {
  status?: 'SUCCEED' | 'FAILED' | null;
  code?: number | undefined;
  error?: string | null;
  message?: string | null;
  data?: T | null;
}