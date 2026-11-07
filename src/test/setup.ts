import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class TestResizeObserver implements ResizeObserver {
  constructor(private callback: ResizeObserverCallback) {}
  observe(target: Element) {
    const contentRect = {
      x: 0, y: 0, top: 0, right: 600, bottom: 250, left: 0, width: 600, height: 250,
      toJSON: () => ({}),
    } as DOMRectReadOnly;
    queueMicrotask(() => {
      this.callback([{
        target,
        contentRect,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry], this);
    });
  }
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = TestResizeObserver;

afterEach(() => {
  cleanup();
  localStorage.clear();
});
