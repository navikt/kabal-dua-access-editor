import type { Metadata } from 'next/types';
import { Code } from '@/components/code/code';
import { accessToTypeScript } from '@/lib/code/typescript';
import { CSV_REPO } from '@/lib/csv/repo';

export const metadata: Metadata = {
  title: 'TypeScript code',
};

export default async function TypeScript() {
  const draft = await CSV_REPO.getSaved();

  return <Code lang="typescript">{accessToTypeScript(draft)}</Code>;
}
