import { CSV_REPO } from '@/lib/csv/repo';

export const GET = async () =>
  new Response(JSON.stringify(CSV_REPO.getDraft()), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
