import { describe, expect, test } from 'vitest';
import { userEvent } from '@vitest/browser/context';
import { render } from 'vitest-browser-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { usePointerLock } from './use-pointer-lock';

const TestComponent = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isLocked, lock, unlock } = usePointerLock(ref);
  const [pointerPosition, setPointerPosition] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [targetBounds, setTargetBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (ref.current) {
      setTargetBounds(ref.current.getBoundingClientRect());
    }
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    setPointerPosition((prev) => {
      if (document.pointerLockElement === ref.current) {
        return {
          x: prev.x + e.movementX,
          y: prev.y + e.movementY,
        };
      }
      return {
        x: e.clientX,
        y: e.clientY,
      };
    });
  };

  const isOutside = targetBounds
    ? pointerPosition.x < targetBounds.left ||
      pointerPosition.x > targetBounds.right ||
      pointerPosition.y < targetBounds.top ||
      pointerPosition.y > targetBounds.bottom
    : false;

  return (
    <div id="root">
      {/* biome-ignore lint/a11y: We don't care about a11y here :D */}
      <div
        id="target"
        ref={ref}
        onClick={lock}
        onMouseMove={handleMouseMove}
        style={{ width: '200px', height: '200px', background: 'gray', position: 'relative' }}
      />
      {/* biome-ignore lint/a11y: We don't care about a11y here :D */}
      <button
        onClick={lock}
        id="lock-button"
      >
        Lock
      </button>
      {/* biome-ignore lint/a11y: We don't care about a11y here :D */}
      <button
        onClick={unlock}
        id="unlock-button"
      >
        Unlock
      </button>

      <p id="is-locked-status">{String(isLocked)}</p>
      <p id="is-outside-status">{String(isOutside)}</p>
    </div>
  );
};

describe('usePointerLock', () => {
  test('should update isLocked when pointerlockchange event fired', async () => {
    const { container } = render(<TestComponent />);

    const unlockButton = container.querySelector('#unlock-button')!;
    const lockButton = container.querySelector('#lock-button')!;
    const isLockedStatusElement = container.querySelector('#is-locked-status')!;

    await userEvent.click(lockButton);
    expect(isLockedStatusElement.textContent).toBe('true');

    await userEvent.click(unlockButton);
    expect(isLockedStatusElement.textContent).toBe('false');
  });

  test('simulate pointer staying inside when locked and going outside when unlocked', async () => {
    const { container } = render(<TestComponent />);

    const target = container.querySelector('#target')!;
    const unlockButton = container.querySelector('#unlock-button')!;
    const lockButton = container.querySelector('#lock-button')!;
    const isLockedStatusElement = container.querySelector('#is-locked-status')!;
    const isOutsideStatusElement = container.querySelector('#is-outside-status')!;

    // Lock pointer
    await userEvent.click(lockButton);
    expect(isLockedStatusElement.textContent).toBe('true');

    // Move cursor (should not leave target while locked)
    target.dispatchEvent(
      new MouseEvent('mousemove', {
        movementX: 300,
        movementY: 300,
        bubbles: true,
      }),
    );

    expect(isOutsideStatusElement.textContent).toBe('false');

    // Unlock
    await userEvent.click(unlockButton);
    expect(isLockedStatusElement.textContent).toBe('false');

    // Move freely (should allow pointer to go outside)
    target.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: -50,
        clientY: -50,
        bubbles: true,
      }),
    );

    expect(isOutsideStatusElement.textContent).toBe('true');
  });
});
