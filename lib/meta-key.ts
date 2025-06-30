export const CMD = '⌘';
export const CTRL = 'Ctrl';
export const IS_WINDOWS = navigator.platform.startsWith('Win');
export const IS_LINUX = navigator.platform.startsWith('Linux');
export const IS_MAC = navigator.platform.startsWith('Mac');
export const MOD_KEY_TEXT = IS_MAC ? CMD : CTRL;

interface KeyEvent {
  metaKey: boolean;
  ctrlKey: boolean;
}

export const isMetaKey = (event: KeyEvent) => (IS_MAC ? event.metaKey : event.ctrlKey);
