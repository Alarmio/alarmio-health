"""Config flow: a single confirm step, one instance only."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback

from .const import CONF_ANCHOR_ENABLED, CONF_ANCHOR_HOST, CONF_GATEWAY, DEFAULT_ANCHOR, DOMAIN
from .net.gateway import is_valid_host


class AlarmioHealthConfigFlow(ConfigFlow, domain=DOMAIN):
    """Config flow with one confirm step."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """The options flow: gateway override and the internet anchor."""
        return AlarmioHealthOptionsFlow()

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show the confirm form, then create the single entry."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            return self.async_create_entry(title="Alarmio Health", data={})
        return self.async_show_form(step_id="user")


class AlarmioHealthOptionsFlow(OptionsFlow):
    """Network check options. Read fresh every cycle, so saving needs no reload."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show or save the options, keeping any other stored option."""
        errors: dict[str, str] = {}
        options = self.config_entry.options
        if user_input is not None:
            gateway = str(user_input.get(CONF_GATEWAY) or "").strip()
            anchor = str(user_input.get(CONF_ANCHOR_HOST) or "").strip() or DEFAULT_ANCHOR
            if gateway and not is_valid_host(gateway):
                errors[CONF_GATEWAY] = "invalid_host"
            if not is_valid_host(anchor):
                errors[CONF_ANCHOR_HOST] = "invalid_host"
            if not errors:
                return self.async_create_entry(
                    data={
                        **options,
                        CONF_GATEWAY: gateway,
                        CONF_ANCHOR_HOST: anchor,
                        CONF_ANCHOR_ENABLED: bool(user_input.get(CONF_ANCHOR_ENABLED, True)),
                    }
                )
        schema = vol.Schema(
            {
                vol.Optional(CONF_GATEWAY, description={"suggested_value": options.get(CONF_GATEWAY, "")}): str,
                vol.Optional(
                    CONF_ANCHOR_HOST, description={"suggested_value": options.get(CONF_ANCHOR_HOST, DEFAULT_ANCHOR)}
                ): str,
                vol.Required(CONF_ANCHOR_ENABLED, default=options.get(CONF_ANCHOR_ENABLED, True)): bool,
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema, errors=errors)
