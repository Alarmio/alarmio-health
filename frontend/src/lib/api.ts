import type { E2EResult, History, Incident, Range, Summary } from "./types";

export interface HassLike {
  callWS<T>(msg: { type: string; [key: string]: unknown }): Promise<T>;
}

export interface Api {
  summary(): Promise<Summary>;
  history(range: Range): Promise<History>;
  incidents(): Promise<Incident[]>;
  runE2E(): Promise<E2EResult>;
}

/** The real API plus a generic escape hatch used by the element tests. */
export interface HassApi extends Api {
  call<T>(command: string, params?: Record<string, unknown>): Promise<T>;
}

/** HA rejects with `{ code, message }` objects, not Error instances. Turn anything into an Error with a readable message. */
function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (typeof err === "object" && err !== null && "message" in err && typeof err.message === "string" && err.message) {
    return new Error(err.message);
  }
  return new Error("Could not reach Home Assistant. Reload the page and try again.");
}

/** `getHass` is read on every call, because Home Assistant replaces its hass object many times a second. */
export function createHassApi(getHass: () => HassLike | null): HassApi {
  const call = async <T,>(command: string, params: Record<string, unknown> = {}): Promise<T> => {
    const hass = getHass();
    if (!hass) throw new Error("Home Assistant is not connected. Reload the page.");
    try {
      return await hass.callWS<T>({ type: `alarmio_health/${command}`, ...params });
    } catch (err) {
      throw toError(err);
    }
  };
  return {
    call,
    summary: () => call<Summary>("summary"),
    history: (range) => call<History>("history", { range }),
    incidents: async () => (await call<{ incidents: Incident[] }>("incidents")).incidents,
    runE2E: () => call<E2EResult>("run_e2e_test"),
  };
}
