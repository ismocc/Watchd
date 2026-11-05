import { HttpErrorResponse } from '@angular/common/http';

export function errorMessage(err: HttpErrorResponse) {
  if (err.status === 0) return "can't reach the server, is the backend running?";
  const msg = err.error?.message;
  if (Array.isArray(msg)) return msg[0];
  return msg ?? 'something went wrong';
}
