# Data notes

## Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Opaque internal identifier. Unique per row. |
| `slug` | string | Public tool path on AIToolbox; unique per row. |
| `name` | string | Tool name. |
| `url` | string | Public destination URL, `http(s)` only. |
| `category` | string | One of the site's 12 MECE category keys, or `uncategorized`. |
| `pricing` | string or null | Display summary built from public pricing plans (up to 3 plans). May be stale. |
| `tagline` | string | Public description truncated to at most 160 characters. |

## Source and selection

The dataset is exported from the published tools table behind
[aitoolbox.fyi](https://aitoolbox.fyi/?utm_source=github&utm_medium=repo&utm_campaign=at10).
Only rows that are live on the public site are eligible. The export then:

- keeps one row per public slug, preferring the English locale;
- drops adult content and rows whose public copy contains email/phone wording;
- drops rows with no usable name, slug, URL, or description;
- never exports submitter identity, raw submission metadata, review state,
  internal scores, or unpublished/pending rows.

Current snapshot: **2,075 rows** from 2,157 eligible published slugs.
The exporter's `--check-pii` gate reports zero hits on the JSON and CSV.

## Attribution

Data is licensed under [CC BY 4.0](LICENSE). If you redistribute it, credit
"AIToolbox AI Tools Directory Index" and link to
<https://aitoolbox.fyi/?utm_source=github&utm_medium=repo&utm_campaign=at10>.

## Refresh

Refreshes are manual and weekly; see [`refresh.sh`](refresh.sh). The procedure
requires a checkout of the site repo and a read-only database URL. No
credentials are stored in this repository.

```sh
AITOOLBOX_REPO=/path/to/ai-tools-website ./refresh.sh
```

Required environment variable names (values are never committed):

- `SUPABASE_DATABASE_URL` (preferred) or `DATABASE_URL` — read-only Postgres URL
- `AITOOLBOX_REPO` — path to the site checkout
- optional `AITOOLBOX_ENV_FILE` — defaults to `$AITOOLBOX_REPO/.env.local`

## Known gaps

- Pricing is a display string, not a normalized amount or currency.
- Taglines are truncated public copy, not editorial summaries.
- Category labels are normalized to the site's 12 main keys; about 7% of rows
  have no usable category and appear as `uncategorized`.
- Localized duplicate listings are collapsed to one row per slug.
- The dataset is a snapshot, not a live feed.
