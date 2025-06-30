import type { Metadata } from 'next/types';
import { Code } from '@/components/code/code';
import { accessToKotlin } from '@/lib/code/kotlin';
import { readCsv } from '@/lib/csv/read';

export const metadata: Metadata = {
  title: 'Kotlin code',
};

export default async function Kotlin() {
  const draft = await readCsv();

  return <Code lang="kotlin">{accessToKotlin(draft)}</Code>;
}
