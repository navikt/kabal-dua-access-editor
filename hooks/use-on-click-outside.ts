import { type RefObject, useEffect } from 'react';

type Callback = (event: MouseEvent | TouchEvent | KeyboardEvent) => void;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: Callback | undefined,
) =>
  useEffect(() => {
    if (onClickOutside === undefined) {
      return;
    }

    const mouseListener = (event: MouseEvent | TouchEvent) => {
      if (ref.current === null) {
        return;
      }

      const { target } = event;

      if (target instanceof window.Node && !ref.current.contains(target)) {
        onClickOutside(event);
      }
    };

    const escapeListener = (event: KeyboardEvent) => {
      if (ref.current === null) {
        return;
      }

      if (event.key === 'Escape') {
        onClickOutside(event);
      }
    };

    window.addEventListener('mousedown', mouseListener);
    document.addEventListener('touchstart', mouseListener);
    window.addEventListener('keydown', escapeListener);

    return () => {
      window.removeEventListener('mousedown', mouseListener);
      document.removeEventListener('touchstart', mouseListener);
      window.removeEventListener('keydown', escapeListener);
    };
  }, [onClickOutside, ref]);
