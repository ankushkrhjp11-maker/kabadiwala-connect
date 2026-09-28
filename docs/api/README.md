# Initial API Structure

Base path: `/api`

## Implemented endpoint

### `GET /api/health`

Returns API liveness and a non-fatal database connectivity indicator.

```json
{
  "status": "ok",
  "service": "kabadiwala-connect-api",
  "database": "connected"
}
```

If MySQL is unavailable, `status` remains `ok` and `database` is `unavailable`; this allows deployment diagnostics without making the health endpoint fragile.

## Module map

| Module | Phase 2 responsibility |
| --- | --- |
| `health` | Liveness and safe database indicator |
| `auth` | Reserved for JWT/OTP implementation |
| `users` | Reserved for user/profile operations |
| `materials` | Reserved for material catalogue operations |
| `prices` | Reserved for price-board operations |
| `lots` | Reserved for lot operations |
| `recyclers` | Reserved for recycler profiles and authorization |
| `offers` | Reserved for recycler offers |
| `traceability` | Reserved for append-only lot custody events |
| `payments` | Model boundary only; no payment implementation |
| `safety` | Reserved for multilingual safety guidance |
