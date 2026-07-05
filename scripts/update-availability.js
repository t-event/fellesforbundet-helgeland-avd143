// Kjøres av GitHub Actions for å hente Outlook-kalender (.ics)
// og skrive public/availability.json til repoet.
// Krever: CALENDAR_ICS_URL som GitHub Actions-secret.

import https from 'https';
import http from 'http';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ICS_URL = process.env.CALENDAR_ICS_URL;
if (!ICS_URL) {
  console.error('FEIL: CALENDAR_ICS_URL er ikke satt som environment-variabel.');
  process.exit(1);
}

const MAKS_REDIRECTS = 5;

function fetch(url, redirectsIgjen = MAKS_REDIRECTS) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'FFH-Availability-Bot/1.0' } }, (res) => {
      // Følg redirect — men med et tak, så en redirect-loop ikke kjører i det uendelige.
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume(); // tøm responsen så socketen kan gjenbrukes
        if (redirectsIgjen <= 0) {
          return reject(new Error('For mange redirects (mulig loop)'));
        }
        // Location kan være relativ — løs den mot gjeldende URL.
        const neste = new URL(res.headers.location, url).toString();
        return fetch(neste, redirectsIgjen - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Konverter ICS-datstreng (YYYYMMDD) til ISO-streng (YYYY-MM-DD)
function parseICSDate(str) {
  const m = str.match(/(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

// Ekspander dato-rekkevidde fra start (inkl.) til end (ekskl.)
function expandDateRange(startISO, endISO) {
  const dates = [];
  const current = new Date(startISO + 'T00:00:00Z');
  const end = new Date(endISO + 'T00:00:00Z');
  while (current < end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

async function main() {
  console.log('Henter ICS-kalender…');
  let icsText;
  try {
    icsText = await fetch(ICS_URL);
  } catch (e) {
    console.error('Feil ved henting av kalender:', e.message);
    process.exit(1);
  }

  const bookedDates = new Set();

  // Del opp i VEVENT-blokker
  const eventBlocks = icsText.split(/BEGIN:VEVENT/i).slice(1);
  console.log(`Fant ${eventBlocks.length} hendelse(r) i kalenderen.`);

  for (const block of eventBlocks) {
    // Finn SUMMARY
    const summaryMatch = block.match(/SUMMARY[^:\r\n]*:([^\r\n]+)/i);
    if (!summaryMatch) continue;
    const summary = summaryMatch[1].trim().replace(/\\n/g, '').replace(/\\,/g, ',');

    // Behandle kun «Opptatt»-hendelser
    if (!/^opptatt$/i.test(summary.trim())) {
      continue;
    }

    // Finn DTSTART
    const dtStartMatch = block.match(/DTSTART[^:\r\n]*:([^\r\n]+)/i);
    if (!dtStartMatch) continue;
    const startISO = parseICSDate(dtStartMatch[1].trim());
    if (!startISO) continue;

    // Finn DTEND (for heldagshendelser — DTEND er eksklusiv)
    const dtEndMatch = block.match(/DTEND[^:\r\n]*:([^\r\n]+)/i);
    if (dtEndMatch) {
      const endISO = parseICSDate(dtEndMatch[1].trim());
      if (endISO && endISO > startISO) {
        expandDateRange(startISO, endISO).forEach(d => bookedDates.add(d));
      } else {
        bookedDates.add(startISO);
      }
    } else {
      bookedDates.add(startISO);
    }
  }

  const sortedDates = Array.from(bookedDates).sort();
  const outputPath = join(__dirname, '..', 'public', 'availability.json');

  // Skriv kun på nytt når de opptatte datoene faktisk har endret seg — ikke bare
  // fordi tidsstempelet endrer seg. Da slipper vi en commit + Pages-deploy hver time.
  // Ved tvil (fil mangler/ugyldig, eller lesefeil) skriver vi alltid, slik at
  // synkingen aldri stopper.
  let uendret = false;
  try {
    const gamle = JSON.parse(readFileSync(outputPath, 'utf8')).bookedDates;
    if (Array.isArray(gamle) && gamle.length === sortedDates.length
        && gamle.every((d, i) => d === sortedDates[i])) {
      uendret = true;
    }
  } catch {
    uendret = false; // fil mangler eller er ugyldig → skriv på nytt
  }

  if (uendret) {
    console.log(`✓ Ingen endring i opptatte datoer (${sortedDates.length}) — hopper over skriving (ingen deploy).`);
    return;
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    bookedDates: sortedDates,
  };
  writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`✓ Oppdatert ${sortedDates.length} opptatte dato(er) → ${outputPath}`);
}

main().catch(e => {
  console.error('Uventet feil:', e);
  process.exit(1);
});
