/** jsdom has no ResizeObserver; Recharts' ResponsiveContainer needs one. */
export function stubResizeObserver(): void {
  class RO { observe(): void {} unobserve(): void {} disconnect(): void {} }
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
}

import { expect } from "vitest";

interface DomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveTextContent(text: string | RegExp): R;
  toHaveAttribute(name: string, value?: string): R;
  toBeDisabled(): R;
  toBeEnabled(): R;
}
declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> extends DomMatchers<R> { _t?: T }
}

const asEl = (v: unknown): HTMLElement | null => (v instanceof HTMLElement ? v : null);

/** Tiny stand-ins for the few jest-dom matchers the tests use (no extra dependency). */
export function installDomMatchers(): void {
  expect.extend({
    toBeInTheDocument(received: unknown) {
      const el = asEl(received);
      return { pass: !!el && el.isConnected, message: () => "expected element to be in the document" };
    },
    toHaveTextContent(received: unknown, text: string | RegExp) {
      const content = asEl(received)?.textContent ?? "";
      const pass = typeof text === "string" ? content.includes(text) : text.test(content);
      return { pass, message: () => `expected "${content}" ${this.isNot ? "not " : ""}to match ${String(text)}` };
    },
    toHaveAttribute(received: unknown, name: string, value?: string) {
      const actual = asEl(received)?.getAttribute(name) ?? null;
      const pass = value === undefined ? actual !== null : actual === value;
      return { pass, message: () => `expected attribute ${name} (got ${String(actual)}) ${this.isNot ? "not " : ""}to be ${String(value)}` };
    },
    toBeDisabled(received: unknown) {
      return { pass: asEl(received)?.hasAttribute("disabled") ?? false, message: () => "expected element to be disabled" };
    },
    toBeEnabled(received: unknown) {
      return { pass: !(asEl(received)?.hasAttribute("disabled") ?? true), message: () => "expected element to be enabled" };
    },
  });
}
