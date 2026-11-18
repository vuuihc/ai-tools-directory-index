# Dataset profile: AI Tools Directory Index

This report describes the snapshot committed in this repository. Every number
below is computed directly from `data/tools.json` at the commit that contains
this file; no external data or estimates are used. Each table is followed by
the command that reproduces it. Run the commands from the repository root.

## Snapshot

| Item | Value |
| --- | --- |
| Rows in `data/tools.json` | 2,072 |
| Rows in `data/tools.csv` (excluding header) | 2,072 |
| `meta.count` | 2,072 |
| `meta.generated_at` | 2026-11-18T01:43:59.210Z |
| Report generated (UTC) | 2026-11-18 |
| SHA-256 of `data/tools.json`, first 12 hex characters | `d57cfea96126` |
| SHA-256 of `data/tools.csv`, first 12 hex characters | `f9d47e246095` |

```sh
python3 -c 'import json;d=json.load(open("data/tools.json"));print(len(d["tools"]),d["meta"]["count"],d["meta"]["generated_at"])' && shasum -a 256 data/tools.json data/tools.csv | cut -c1-12 && date -u +%F
```

## Field completeness

A field counts as non-empty when it is a string containing at least one
non-whitespace character. `pricing` is null when no public price text was
available.

| Field | Non-empty rows | Share of 2,072 |
| --- | ---: | ---: |
| `slug` | 2,072 | 100.00% |
| `name` | 2,072 | 100.00% |
| `url` | 2,072 | 100.00% |
| `category` | 2,072 | 100.00% |
| `pricing` | 802 | 38.71% |
| `tagline` | 2,072 | 100.00% |

```sh
python3 -c 'import json;t=json.load(open("data/tools.json"))["tools"];n=len(t);print("\n".join(f"{k} {sum(1 for r in t if isinstance(r.get(k),str) and r[k].strip())} {sum(1 for r in t if isinstance(r.get(k),str) and r[k].strip())/n*100:.2f}%" for k in ["slug","name","url","category","pricing","tagline"]))'
```

## Category distribution

`category` has 13 distinct values in this snapshot: the site's 12 topic keys
plus `uncategorized`. All 13 are listed below; there are no further categories
and no rows outside them.

| Rank | Category | Rows | Share of 2,072 |
| ---: | --- | ---: | ---: |
| 1 | `content-media` | 711 | 34.31% |
| 2 | `ai-ml-core` | 455 | 21.96% |
| 3 | `business-productivity` | 322 | 15.54% |
| 4 | `uncategorized` | 149 | 7.19% |
| 5 | `marketing-sales` | 99 | 4.78% |
| 6 | `development` | 98 | 4.73% |
| 7 | `education-learning` | 87 | 4.20% |
| 8 | `lifestyle-entertainment` | 51 | 2.46% |
| 9 | `health-wellness` | 35 | 1.69% |
| 10 | `communication` | 21 | 1.01% |
| 11 | `infrastructure-ops` | 17 | 0.82% |
| 12 | `security-compliance` | 15 | 0.72% |
| 13 | `creative-professional` | 12 | 0.58% |
| — | Remaining 0 categories combined | 0 | 0.00% |

```sh
python3 -c 'import json,collections;t=json.load(open("data/tools.json"))["tools"];n=len(t);c=collections.Counter(r["category"] for r in t);print("\n".join(f"{k} {v} {v/n*100:.2f}%" for k,v in c.most_common(15)))'
```

## Pricing distribution

`pricing` is free-form display text, not a normalized amount. The three buckets
below are defined as follows, applied in this order:

- **Paid**: the string contains at least one explicitly positive price amount
  (a currency symbol or code followed by a number greater than zero, or a
  number greater than zero followed by a currency code).
- **Free**: the string contains no positive price amount and does contain a
  free marker: the word `free`, a zero amount such as `$0`, `no cost`, or
  `open source`.
- **Unknown**: `pricing` is null, or the string contains neither a positive
  price amount nor a free marker.

| Bucket | Rows | Share of 2,072 |
| --- | ---: | ---: |
| Free | 170 | 8.20% |
| Paid | 430 | 20.75% |
| Unknown | 1,472 | 71.04% |

Of the 1,472 Unknown rows, 1,270 have `pricing: null` and 202 contain text
without a price or free marker (for example "contact sales" or "pricing not
published"). Of the 170 Free rows, 47 also contain a paid-tier word (paid,
premium, pro, subscription, custom, contact, or enterprise) without a
published positive price. The bucket is assigned from price text alone, so
those rows may be freemium rather than free-only. Currencies and billing
periods are not normalized.

```sh
python3 -c 'import json,re,collections;t=json.load(open("data/tools.json"))["tools"];M=re.compile(r"(?:[$€£¥₹₩₽₺₪]|USD|EUR|GBP|CAD|AUD|CHF|INR|Rs\.?|R\$)\s*(\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?)\s*(?:USD|EUR|GBP|CAD|AUD|CHF|INR|dollars?|euros?)");F=re.compile(r"(?i)\bfree\b|[$€£¥₹₩₽₺₪]\s*0(?:\.0+)?\b|no cost|open[- ]source");c=collections.Counter("paid" if v and any(float((m.group(1) or m.group(2)).replace(",",""))>0 for m in M.finditer(str(v))) else ("free" if v and F.search(str(v)) else "unknown") for v in (r["pricing"] for r in t));print(len(t),dict(c))'
```

## What this data does NOT contain

- **No quality or popularity signals.** There are no ratings, review counts,
  user counts, traffic estimates, click counts, rankings, featured flags,
  revenue figures, funding data, company size, or GitHub stars.
- **No normalized pricing.** `pricing` is display text with mixed currencies
  and billing periods. There are no numeric price, currency, or billing-period
  fields, and prices may be stale relative to the source page.
- **No submission metadata.** There is no submission date, submitter identity,
  contact information, review status, or internal database id. The internal
  `id` column was removed from this snapshot because it could encode the
  submission timestamp.
- **No feature or integration metadata.** Beyond `category`, there is no model
  or provider name, platform, SDK, API availability, integration list, or
  capability tag.
- **No completeness guarantee.** The rows come from public submissions and
  public tool pages on aitoolbox.fyi, after filtering and de-duplication. This
  is not a random or exhaustive sample of all AI tools; localized duplicate
  listings are collapsed to one row per slug, preferring English.
- **No accuracy or availability guarantee.** Names, URLs, and taglines are
  copied from public pages at export time and are not re-verified afterwards.
- **No live feed.** The dataset is a manual weekly snapshot. `meta.generated_at`
  records when the export was produced, and `meta.audit_note` records later
  manual removals.

The complete field list is exactly the following six keys:

```sh
python3 -c 'import json;t=json.load(open("data/tools.json"))["tools"];print(sorted({k for r in t for k in r}))'
```

## Cite this

- Dataset: AI Tools Directory Index
- Repository: <https://github.com/vuuihc/ai-tools-directory-index>
- License: [CC BY 4.0](LICENSE)
- Suggested citation: "AI Tools Directory Index (2026). AIToolbox.
  https://github.com/vuuihc/ai-tools-directory-index (CC BY 4.0)."
