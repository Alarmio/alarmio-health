import type { Plugin } from "postcss";

/**
 * Makes Tailwind v4 output work inside a shadow root.
 *  - `@property` rules are ignored in shadow trees, and Tailwind's own fallback is gated behind
 *    an `@supports` check that modern browsers fail, so the --tw-* defaults would be unset.
 *    We turn each `@property` initial value into a plain declaration on `:host, *, ::before, ::after`.
 *  - `:root` never matches in a shadow tree; selectors are reduced to `:host`.
 */
const PSEUDO = ":host, *, :before, :after, ::backdrop";

export default function shadowDom(): Plugin {
  return {
    postcssPlugin: "alarmio-shadow-dom",
    OnceExit(root, { Rule, AtRule, Declaration }) {
      const defaults = new Map<string, string>();
      root.walkAtRules("property", (rule) => {
        let initial: string | null = null;
        rule.walkDecls("initial-value", (d) => {
          initial = d.value;
        });
        if (initial !== null) defaults.set(rule.params.trim(), initial);
        rule.remove();
      });
      root.walkAtRules("layer", (rule) => {
        if (rule.params.trim() === "properties" && rule.nodes) rule.remove();
      });
      if (defaults.size > 0) {
        const layer = new AtRule({ name: "layer", params: "properties" });
        const rule = new Rule({ selector: PSEUDO });
        for (const [prop, value] of defaults) rule.append(new Declaration({ prop, value }));
        layer.append(rule);
        root.prepend(layer);
      }
      root.walkRules((rule) => {
        if (!rule.selector.includes(":root")) return;
        const kept = rule.selectors.filter((s) => s.trim() !== ":root");
        if (kept.length === 0) rule.remove();
        else rule.selectors = kept;
      });
    },
  };
}
