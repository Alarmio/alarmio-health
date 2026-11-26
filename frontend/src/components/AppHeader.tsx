import { createElement, useCallback } from "react";
import { Wordmark } from "./Wordmark";

interface Props {
  narrow: boolean;
  /** Called with the menu button node (or null on removal) so the element can push `hass` into it without a re-render. */
  registerMenu(node: HTMLElement | null): void;
}

/**
 * On narrow screens HA only opens its sidebar through <ha-menu-button>, which a custom panel must supply itself.
 * The element is undefined outside HA (jsdom, dev harness); it then renders as an inert unknown element.
 */
function MenuButton({ registerMenu }: { registerMenu(node: HTMLElement | null): void }) {
  const ref = useCallback(
    (node: HTMLElement | null) => {
      registerMenu(node);
      return () => registerMenu(null);
    },
    [registerMenu],
  );
  return createElement("ha-menu-button", { ref });
}

export function AppHeader({ narrow, registerMenu }: Props) {
  if (!narrow) return <Wordmark />;
  return (
    <div className="flex items-center gap-2" data-testid="narrow-header">
      <MenuButton registerMenu={registerMenu} />
      <Wordmark />
    </div>
  );
}
