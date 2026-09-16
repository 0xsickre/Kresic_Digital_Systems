# Pravni HTML (šabloni)

Ovde **menjaš** tekst u `*.html.example` fajlovima (lakše za paste iz editora).  
**Šta je u produkciji:** sadržaj iz šablona mora da bude u **`dictionaries/de.json` i `en.json`** polje `htmlBody` unutar `datenschutz` / `impressum` / `widerruf` / `agb` — to ide u git i Vercel vidi isto.

## Nakon izmene u `.example`

Iz korena projekta:

```bash
npm run sync:legal
npm run legal:pdf
```

Zatim commit `dictionaries/de.json`, `dictionaries/en.json` i `public/legal/*.pdf`.
PDF-ovi se generišu iz istog `htmlBody`, pa stranica i preuzimanje ne mogu da se raziđu.

## Fajlovi

| Šablon (u gitu) |
|-----------------|
| `datenschutz.de.html.example` |
| `datenschutz.en.html.example` |
| `impressum.de.html.example` |
| `impressum.en.html.example` |
| `widerruf.de.html.example` |
| `widerruf.en.html.example` |
| `agb.de.html.example` |
| `agb.en.html.example` |

## Ponašanje ako `htmlBody` u rečniku je prazan

Stranica koristi ugrađeni tekst iz ostalih ključeva u `datenschutz` / `impressum` (stariji blok-paragrafi).
**`widerruf` i `agb` nemaju taj fallback** — tekst dolazi isključivo iz šablona, pa prazan `htmlBody` znači prazna stranica.

## Redosled pri dodavanju novog dokumenta

Skript radi `de[slug] = { ...de[slug], htmlBody }`. Ako ključ u rečniku još ne postoji,
`...undefined` se raširi u ništa i dobiješ objekat **samo sa `htmlBody`** — bez `title`
za PDF generator i bez `eyebrow` za stranicu, i to tiho.

Zato: **pun blok u oba rečnika ide pre prvog `sync:legal`**, sa praznim `htmlBody` koji
skript popunjava. Tek onda se slug dodaje u niz u `scripts/sync-private-legal-to-dictionaries.mjs`
i u `DOCS` u `scripts/generate-legal-pdfs.mjs`.

`npx tsc --noEmit` hvata ako dodaš ključ u `dictionaries/types.ts` a zaboraviš ga u
jednom od dva rečnika — `readonly` nizovi u tipu blokiraju cast koji bi to inače sakrio.
