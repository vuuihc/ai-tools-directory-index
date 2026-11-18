# AI Tools Directory Index

A free, machine-readable snapshot of **2,072 AI tools** — name, destination URL, category, pricing text and a one-line tagline — exported from the public catalogue behind [AIToolbox](https://aitoolbox.fyi/?utm_source=github&utm_medium=repo&utm_campaign=at10).

No API key, no signup, no scraping. Data licensed **CC BY 4.0**.

**Download:** [`data/tools.json`](data/tools.json) · [`data/tools.csv`](data/tools.csv)

## What is in it

| Field | Real example | Notes |
| --- | --- | --- |
| `slug` | `imagineers_studio` | Stable per-row key, unique; derived from the destination domain, not from the tool name |
| `name` | `EmojiArtist` | Tool name as published |
| `url` | `https://imagineers.studio` | Destination, `http(s)` only |
| `category` | `content-media` | 1 of 13 buckets, see below |
| `pricing` | `Free: $0` | **Free text, not a number**; `null` when unknown |
| `tagline` | `EmojiArtist is a web app that lets users create custom emojis. …` | ≤160 chars, may be cut mid-sentence |

Category distribution (2,072 rows):

| Category | Rows | Share |
| --- | --- | --- |
| content-media | 711 | 34.3% |
| ai-ml-core | 455 | 22.0% |
| business-productivity | 322 | 15.5% |
| uncategorized | 149 | 7.2% |
| 9 further buckets | 435 | 21.0% |

## Two-minute usage

```sh
curl -sL https://raw.githubusercontent.com/vuuihc/ai-tools-directory-index/main/data/tools.json -o tools.json
```

```python
import json, collections
rows = json.load(open("tools.json"))["tools"]
print(len(rows), "rows")
print(collections.Counter(r["category"] for r in rows).most_common(5))
print(sum(1 for r in rows if r["pricing"]), "rows carry any pricing text")
```

## What this data does **not** contain

Read this before building on it.

- **No popularity signals.** No traffic, ratings, installs, stars, MAU or revenue. Nothing here tells you which tools are actually used.
- **Pricing is a display string.** Only 802 of 2,072 rows (38.7%) carry any pricing text; 1,270 are `null`. Some values are prose ("pricing page currently returns a 404"). Treat it as text mining, not a price field.
- **Not a curated "best of" list.** Eligibility is "live on the public site", which means a working name, URL and description that passed a content filter. Quality is not a ranking criterion.
- **Dead and parked destinations exist.** 9 rows (0.4%) point at domain-for-sale or parked pages; 8 URLs are `http://` only. `url` was valid when the row was exported, not guaranteed today.
- **Duplicate destinations across vendors.** 2,072 rows map to 2,035 distinct destination URLs; 37 rows share a URL (multi-locale or multi-product pages).
- **Sampling bias.** Rows arrived through public self-submission. Vendors that never submitted are absent; some rows came from third-party bulk-submission services.
- **No contact data.** Submitter identity, emails and internal review state are never exported. 20 rows (1.0%) keep a non-Latin name and 54 (2.6%) a non-English tagline, as published.

Field notes, filters and the export procedure: [`DATA.md`](DATA.md).

## Cite this

> AIToolbox. *AI Tools Directory Index* (2026). 2,072 AI tools, CC BY 4.0. https://github.com/vuuihc/ai-tools-directory-index

Redistribution requires attribution under [CC BY 4.0](LICENSE) — credit "AIToolbox AI Tools Directory Index" and link to https://aitoolbox.fyi/.

## Refresh and corrections

Snapshots are refreshed manually, weekly — see [`refresh.sh`](refresh.sh) and `DATA.md`. If a row is wrong, miscategorised, or yours and you want it out, open an issue or email support@aitoolbox.fyi; removals are honoured and the next snapshot drops the row.
