# Scheutplaneet

Twee interactieve rekenverhalen en rekenen met bouwblokjes voor het eerste leerjaar, met illustraties, stemmen en begeleide rekenmomenten.

- **Optellen — Herfst in het bos:** Amina, Sami, Maryam en Adam ontdekken de brug over tien.
- **Aftrekken — Wat heb jij vandaag bij?:** Milan en Alina delen onderweg; eerst terug naar tien en daarna de rest eraf. Milan heeft de nieuwe stem, met het iets hogere volume.
- **Rekenen met blokjes:** optellen én aftrekken met brug, met 2×4-bouwblokjes. Verplaats de blokjes, teken zelf een gesloten vorm rond de juiste getallen om de sok te bevestigen, en volg de splitsing en rekenstappen. Kies Kijk mee, Samen of Zelf, en één of twee kleuren.

Open de website bij `index.html` voor het beginscherm. De verhalen staan bij `optellen.html` en `anas-alina/`; de blokjesoefeningen bij `blokjes/`. De audio begint na een bewuste afspeelactie. Alle gebruikte afbeeldingen, lettertypes en audiobestanden zijn inbegrepen, inclusief de afspeeltempo’s van het tweede verhaal.

## Lokaal openen

Start in deze map een webserver:

```sh
python3 -m http.server 8000
```

Open daarna http://localhost:8000/. Rechtstreeks openen als lokaal bestand ondersteunt de JavaScriptmodules niet overal. Er is geen bouwstap nodig.

## GitHub Pages

De websitebestanden staan in de hoofdmap. Je kunt GitHub Pages instellen op de branch `main`, map `/ (root)`. De relatieve paden ondersteunen ook een repositorypad. De `.nojekyll` voorkomt verwerking door Jekyll. Het uploaden van deze bronbestanden schakelt GitHub Pages niet automatisch in.

## Bronversie

Overgenomen uit de gepubliceerde siteversie 42, broncommit `f8cbe572a2186df710f4c13fbd8a07873c7a3be0`.
