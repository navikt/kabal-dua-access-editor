import { CSV_REPO } from '@/lib/csv/repo';

export const GET = async () =>
  new Response(JSON.stringify(CSV_REPO.getSaved()), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
