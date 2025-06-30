import type { Metadata } from 'next/types';
import { Code } from '@/components/code/code';
import { accessToTypeScript } from '@/lib/code/typescript';
import { readCsv } from '@/lib/csv/read';

export const metadata: Metadata = {
  title: 'TypeScript code',
};

export default async function TypeScript() {
  const draft = await readCsv();

  return <Code lang="typescript">{accessToTypeScript(draft)}</Code>;
}
