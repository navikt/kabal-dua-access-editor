import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ALL_IDS } from '@/lib/enums/all';
import { Observable } from '@/lib/observable/observable';

const MAX_INDEX = ALL_IDS.length - 1;
const MIN_INDEX = 0;
const ID_TO_INDEX: Record<string, number> = Object.fromEntries(ALL_IDS.map((id, index) => [id, index]));
let previousOpenIndex: number | null = null;

const openStore = new Observable<number | null>(null);

export const useOpenState = () => useSyncExternalStore(openStore.subscribe, openStore.get);

export const unsetOpenIndex = () => {
  previousOpenIndex = openStore.get();
  openStore.set(null);
};

export const setOpenIndex = (index: number | null = null) => openStore.set(index);

export const getOpenIndex = () => openStore.get();

export const setOpenIndexToPreviousSetOrFirst = () => openStore.set(previousOpenIndex ?? MIN_INDEX);
export const setOpenIndexToPreviousSetOrLast = () => openStore.set(previousOpenIndex ?? MAX_INDEX);

export const setFirstOpenIndex = () => openStore.set(MIN_INDEX);

export const setLastOpenIndex = () => openStore.set(MAX_INDEX);

export const incrementOpenIndex = () => {
  const currentIndex = openStore.get();

  if (currentIndex === null) {
    openStore.set(previousOpenIndex ?? MIN_INDEX);
    return;
  }

  const nextIndex = currentIndex < MAX_INDEX ? currentIndex + 1 : MIN_INDEX;
  openStore.set(nextIndex);
};

export const setOpenIndexById = (id: string) => {
  const index = ID_TO_INDEX[id];

  if (index === undefined) {
    console.warn(`Invalid ID: ${id}. Cannot set open index.`);
    return;
  }

  openStore.set(index);
};

export const decrementOpenIndex = () => {
  const currentIndex = openStore.get();

  if (currentIndex === null) {
    openStore.set(previousOpenIndex ?? MAX_INDEX);
    return;
  }

  const prevIndex = currentIndex > MIN_INDEX ? currentIndex - 1 : MAX_INDEX;
  openStore.set(prevIndex);
};

export const useIsOpen = (id: string): boolean => {
  const index = ID_TO_INDEX[id];

  const [isOpen, setIsOpen] = useState(() => openStore.get() === index);
  const previousIsOpen = useRef<boolean>(isOpen);

  useEffect(() => {
    openStore.subscribe((openIndex) => {
      const isOpen = openIndex === index;

      if (isOpen === previousIsOpen.current) {
        return;
      }

      previousIsOpen.current = isOpen;
      setIsOpen(isOpen);
    });
  }, [index]);

  return isOpen;
};
