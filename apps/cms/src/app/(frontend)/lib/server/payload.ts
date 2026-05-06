import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function getPayloadClient() {
  return getPayload({ config });
}

export function getCmsBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_CMS_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL ||
    process.env.SERVER_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

export class PayloadRequestError extends Error {
  status: number;
  path: string;
  details?: unknown;

  constructor(message: string, status: number, path: string, details?: unknown) {
    super(message);
    this.name = 'PayloadRequestError';
    this.status = status;
    this.path = path;
    this.details = details;
  }
}
