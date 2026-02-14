 export interface ResponseWrapper<T = any> {
  code: number;
  status: 'SUCCEED' | 'FAILED';
  message: string;
  error: any;
  data: T;
}