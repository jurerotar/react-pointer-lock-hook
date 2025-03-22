import { useCallback, useEffect, useState, type RefObject } from 'react';

export const usePointerLock = (targetRef: RefObject<HTMLElement | null>) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const isSupported =
    typeof document !== 'undefined' &&
    'pointerLockElement' in document &&
    'exitPointerLock' in document &&
    targetRef?.current?.requestPointerLock !== undefined;

  const requestPointerLock = useCallback((): void => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    target.requestPointerLock();
  }, [targetRef]);

  const exitPointerLock = useCallback((): void => {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }, []);

  const onPointerLockChange = useCallback((): void => {
    const locked = document.pointerLockElement === targetRef?.current;
    setIsLocked(locked);
  }, [targetRef]);

  useEffect(() => {
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockChange);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockChange);
    };
  }, [onPointerLockChange]);

  return {
    isLocked,
    isSupported,
    lock: requestPointerLock,
    unlock: exitPointerLock,
  };
};
