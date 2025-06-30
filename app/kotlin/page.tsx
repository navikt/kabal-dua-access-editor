import type { Metadata } from 'next/types';
import { Code } from '@/components/code/code';
import { accessToKotlin } from '@/lib/code/kotlin';
import { CSV_REPO } from '@/lib/csv/repo';

export const metadata: Metadata = {
  title: 'Kotlin code',
};

export default async function Kotlin() {
  const draft = await CSV_REPO.getSaved();

  return <Code lang="kotlin">{accessToKotlin(draft)}</Code>;
}
