# react-pointer-lock-hook

A lightweight and type-safe React hook for the Pointer Lock API.

## Installation

```shell
npm install react-pointer-lock-hook
```

## Usage

```ts
import { useRef } from 'react';
import { usePointerLock } from 'react-pointer-lock-hook';

const MapViewer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { lock, unlock } = usePointerLock(mapRef);

  const position = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if(!mapRef.current) {
      return;
    }
    position.current.x += e.movementX;
    position.current.y += e.movementY;
    mapRef.current.scrollTo(position.current.x, position.current.y);
  };

  return (
    <div
      ref={mapRef}
      onMouseDown={lock}
      onMouseUp={unlock}
      onMouseMove={handleMouseMove}
    >
      ...
    </div>
  );
};
```
