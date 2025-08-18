'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { type CaseStatus, isCaseStatus } from '@/lib/enums/case-status';
import { type CreatorEnum, isCreator } from '@/lib/enums/creator';
import { type DocumentTypeEnum, isDocumentType } from '@/lib/enums/document-type';
import { isParent, type ParentEnum } from '@/lib/enums/parent';
import { isUser, type UserEnum } from '@/lib/enums/user';
import { Observable } from '@/lib/observable/observable';

type Guard<T extends UserEnum | CaseStatus | DocumentTypeEnum | ParentEnum | CreatorEnum> = (
  value: string,
) => value is T;

const getQuery = <T extends UserEnum | CaseStatus | DocumentTypeEnum | ParentEnum | CreatorEnum>(
  key: string,
  guard: Guard<T>,
): T[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const query = new URLSearchParams(window.location.search);
  const value = query.get(key);

  if (value === null) {
    return [];
  }

  return value.split(',').filter(guard);
};

const userFilterStore = new Observable<UserEnum[]>(getQuery('user', isUser));
const caseStatusFilterStore = new Observable<CaseStatus[]>(getQuery('caseStatus', isCaseStatus));
const documentTypeFilterStore = new Observable<DocumentTypeEnum[]>(getQuery('documentType', isDocumentType));
const parentFilterStore = new Observable<ParentEnum[]>(getQuery('parent', isParent));
const creatorFilterStore = new Observable<CreatorEnum[]>(getQuery('creator', isCreator));

export const useUserFilter = (serverValue: UserEnum[]) =>
  useSyncExternalStore(userFilterStore.subscribe, userFilterStore.get, () => serverValue);
export const useCaseStatusFilter = (serverValue: CaseStatus[]) =>
  useSyncExternalStore(caseStatusFilterStore.subscribe, caseStatusFilterStore.get, () => serverValue);
export const useDocumentTypeFilter = (serverValue: DocumentTypeEnum[]) =>
  useSyncExternalStore(documentTypeFilterStore.subscribe, documentTypeFilterStore.get, () => serverValue);
export const useParentFilter = (serverValue: ParentEnum[]) =>
  useSyncExternalStore(parentFilterStore.subscribe, parentFilterStore.get, () => serverValue);
export const useCreatorFilter = (serverValue: CreatorEnum[]) =>
  useSyncExternalStore(creatorFilterStore.subscribe, creatorFilterStore.get, () => serverValue);

export const useSetUserFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (users: UserEnum[]) => {
    userFilterStore.set(users);

    const query = new URLSearchParams(window.location.search);

    if (users.length === 0) {
      query.delete('user');
    } else {
      query.set('user', users.join(','));
    }

    router.push(`${pathname}?${query.toString()}`);
  };
};

export const useSetCaseStatusFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (statuses: CaseStatus[]) => {
    caseStatusFilterStore.set(statuses);

    const query = new URLSearchParams(window.location.search);

    if (statuses.length === 0) {
      query.delete('caseStatus');
    } else {
      query.set('caseStatus', statuses.join(','));
    }

    router.push(`${pathname}?${query.toString()}`);
  };
};

export const useSetDocumentTypeFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (documents: DocumentTypeEnum[]) => {
    documentTypeFilterStore.set(documents);

    const query = new URLSearchParams(window.location.search);

    if (documents.length === 0) {
      query.delete('documentType');
    } else {
      query.set('documentType', documents.join(','));
    }

    router.push(`${pathname}?${query.toString()}`);
  };
};

export const useSetParentFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (parents: ParentEnum[]) => {
    parentFilterStore.set(parents);

    const query = new URLSearchParams(window.location.search);

    if (parents.length === 0) {
      query.delete('parent');
    } else {
      query.set('parent', parents.join(','));
    }

    router.push(`${pathname}?${query.toString()}`);
  };
};

export const useSetCreatorFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (creators: CreatorEnum[]) => {
    creatorFilterStore.set(creators);

    const query = new URLSearchParams(window.location.search);

    if (creators.length === 0) {
      query.delete('creator');
    } else {
      query.set('creator', creators.join(','));
    }

    router.push(`${pathname}?${query.toString()}`);
  };
};
