import { readCsv } from '@/lib/csv/read';

export const GET = async () => Response.json(await readCsv(), { status: 200 });
