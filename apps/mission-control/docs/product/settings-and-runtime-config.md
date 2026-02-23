# Settings and Runtime Config

> API keys, local models, and runtime configuration.

**Related:** [Page Map](./page-map.md), [Integrations](./integrations.md)

---

## Overview

The Settings view (`#settings`) manages:

1. **API Keys** — AI provider keys (OpenAI, Anthropic, Gemini, etc.)
2. **Local Models** — Ollama and self-hosted model config
3. **Gateway config** — Runtime settings from gateway

---

## API Contracts

### API Keys

```
GET    /api/settings/api-keys
POST   /api/settings/api-keys   Body: { provider, key, ... }
PATCH  /api/settings/api-keys   Body: { id, enabled?, ... }
DELETE /api/settings/api-keys   Body: { id } or ?id=<id>
```

### Local Models

```
GET    /api/settings/models
POST   /api/settings/models     Body: { name, provider, base_url?, model_id?, ... }
PATCH  /api/settings/models     Body: { id, ... }
DELETE /api/settings/models     Body: { id } or ?id=<id>
```

### Models (Catalog)

```
GET /api/models
```

Returns available AI models (gateway + local).

### Gateway Config

```
GET /api/openclaw/config
```

---

## Runtime vs Local Ambiguity

- **API keys** and **local models** are stored in Mission Control DB.
- **Models catalog** may mix gateway-provided and local models.
- UI should clarify which settings are local vs gateway-synced.

---

## Deep Links

- `#settings` — Settings root
- `#settings-api-keys` — Scroll to API Keys section
- `#settings-models` — Scroll to Local Models section

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Invalid provider | Validation error |
| Key test failed | Show test result; don't save invalid key |
| Gateway unavailable | Models list may be partial |

---

## Related Docs

- [Integrations](./integrations.md)
- [Error Model](../api/error-model.md)
