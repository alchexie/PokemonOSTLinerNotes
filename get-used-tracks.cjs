const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs');
const TRACK_INFO_PATH = path.join(__dirname, 'public', 'data', 'track_info.json');

const SERIES_TO_OST = {
  PT: 'B2W2',
  DPPT: 'DP',
  E: 'B2W2',
  RSE: 'RS',
  GS: 'HGSS',
  Y: 'LPLE',
  RGBY: 'RG',
};

function walkMdFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMdFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function buildKeyIndex(trackInfo) {
  const keyIndex = new Map();
  for (const key of Object.keys(trackInfo)) {
    keyIndex.set(key, key);
    keyIndex.set(key.toLowerCase(), key);
    keyIndex.set(key.toUpperCase(), key);
  }
  return keyIndex;
}

function normalizeKey(rawKey, keyIndex) {
  if (!rawKey) return null;
  const direct = keyIndex.get(rawKey);
  if (direct) return direct;

  const upper = rawKey.toUpperCase();
  if (SERIES_TO_OST[upper]) {
    const mapped = SERIES_TO_OST[upper];
    const mappedDirect = keyIndex.get(mapped) || keyIndex.get(mapped.toLowerCase()) || keyIndex.get(mapped.toUpperCase());
    if (mappedDirect) return mappedDirect;
  }

  const lower = rawKey.toLowerCase();
  return keyIndex.get(lower) || keyIndex.get(upper) || null;
}

function buildTrackMaps(trackInfo) {
  const maps = new Map();
  const labelMaps = new Map();
  for (const [key, tracks] of Object.entries(trackInfo)) {
    const map = new Map();
    const labelMap = new Map();
    for (const track of tracks) {
      if (!Array.isArray(track) || track.length < 2) continue;
      const label = String(track[0]).trim();
      const numberStr = String(track[1]).trim();
      const number = parseInt(numberStr, 10);
      if (!Number.isNaN(number)) {
        map.set(label, number);
        map.set(numberStr, number);
        if (label.includes('.') && !labelMap.has(number)) {
          labelMap.set(number, label);
        }
      }
    }
    maps.set(key, map);
    labelMaps.set(key, labelMap);
  }
  return { maps, labelMaps };
}

function cleanToken(token) {
  return token
    .replace(/^[\s,\uFF0C\u3002\uFF1B\u3001;]+/g, '')
    .replace(/[\s,\uFF0C\u3002\uFF1B\u3001;]+$/g, '')
    .trim();
}

function tokenizeTracks(trackText) {
  const rough = trackText.split(/\s+/);
  const tokens = [];
  for (const part of rough) {
    const cleaned = cleanToken(part);
    if (!cleaned) continue;
    const splits = cleaned.split(/[\u3001\uFF0C,;]/);
    for (const s of splits) {
      const t = cleanToken(s);
      if (t) tokens.push(t);
    }
  }
  return tokens;
}

function parseTrackNumber(token, trackMap) {
  if (!token) return null;
  const map = trackMap || new Map();
  if (map.has(token)) return map.get(token);

  const stripped = token.replace(/^[^0-9]+|[^0-9.]+$/g, '');
  if (map.has(stripped)) return map.get(stripped);

  if (/^\d+$/.test(stripped)) {
    const n = parseInt(stripped, 10);
    return Number.isNaN(n) ? null : n;
  }

  if (/^\d+\.\d+$/.test(stripped)) {
    const last = stripped.split('.').pop();
    const n = parseInt(last, 10);
    return Number.isNaN(n) ? null : n;
  }

  return null;
}

function extractMatches(content) {
  const matches = [];
  const re = /\*\*([^_]+?)_(.+?)_\*\*/gs;
  let m;
  while ((m = re.exec(content))) {
    matches.push({
      description: m[1],
      tracks: m[2],
    });
  }
  return matches;
}

function inferKeyFromPath(filePath) {
  const rel = path.relative(DOCS_DIR, filePath);
  const parts = rel.split(path.sep).filter(Boolean);
  if (parts.length === 0) return null;
  const group = parts[0];
  const segs = group.split('-').filter(Boolean);
  if (segs.length === 0) return null;
  return segs[segs.length - 1];
}

function main() {
  const outArgIndex = process.argv.indexOf('--out');
  const outArg = outArgIndex >= 0 ? process.argv[outArgIndex + 1] : null;
  if (outArgIndex >= 0 && (!outArg || outArg.startsWith('--'))) {
    console.error('Missing value for --out');
    process.exit(1);
  }

  const trackInfoRaw = fs.readFileSync(TRACK_INFO_PATH, 'utf8');
  const trackInfo = JSON.parse(trackInfoRaw);
  const keyIndex = buildKeyIndex(trackInfo);
  const { maps: trackMaps, labelMaps: trackLabelMaps } = buildTrackMaps(trackInfo);

  const used = new Map();
  const usedDisc = new Map();
  const warnings = [];

  const mdFiles = walkMdFiles(DOCS_DIR);
  for (const file of mdFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = extractMatches(content);
    for (const match of matches) {
      const tokens = tokenizeTracks(match.tracks);
      if (tokens.length === 0) continue;

      const parsed = tokens.map((token) => {
        const idx = token.indexOf('-');
        if (idx > 0) {
          return {
            raw: token,
            key: token.slice(0, idx).trim(),
            track: token.slice(idx + 1).trim(),
          };
        }
        return { raw: token, key: null, track: token.trim() };
      });

      const keys = [...new Set(parsed.filter((p) => p.key).map((p) => p.key))];
      const pathKey = inferKeyFromPath(file);
      const defaultKey = pathKey || (keys.length === 1 ? keys[0] : null);

      for (const item of parsed) {
        const rawKey = item.key || defaultKey;
        if (!rawKey) {
          warnings.push(`Missing key for token "${item.raw}" in ${file}`);
          continue;
        }

        const normalizedKey = normalizeKey(rawKey, keyIndex);
        if (!normalizedKey) {
          warnings.push(`Unknown key "${rawKey}" for token "${item.raw}" in ${file}`);
          continue;
        }

        const trackMap = trackMaps.get(normalizedKey);
        const labelMap = trackLabelMaps.get(normalizedKey);
        const number = parseTrackNumber(item.track, trackMap);
        if (number === null) {
          warnings.push(`Unknown track "${item.track}" for key "${normalizedKey}" in ${file}`);
          continue;
        }

        if (!used.has(normalizedKey)) used.set(normalizedKey, new Set());
        used.get(normalizedKey).add(number);

        let discLabel = null;
        if (item.track.includes('.')) {
          discLabel = item.track;
        } else if (labelMap && labelMap.has(number)) {
          discLabel = labelMap.get(number);
        }
        if (discLabel) {
          if (!usedDisc.has(normalizedKey)) usedDisc.set(normalizedKey, new Set());
          usedDisc.get(normalizedKey).add(discLabel);
        }
      }
    }
  }

  const orderedKeys = Object.keys(trackInfo);
  const content = orderedKeys
    .filter((key) => used.has(key))
    .map((key) => ({
      ost: key,
      track_itunes: [...used.get(key)].sort((a, b) => a - b).join(' '),
      tracks_disc: usedDisc.has(key)
        ? [...usedDisc.get(key)].sort((a, b) => {
            const an = parseFloat(a);
            const bn = parseFloat(b);
            if (Number.isNaN(an) || Number.isNaN(bn)) return a.localeCompare(b);
            return an - bn;
          }).join(' ')
        : '',
      count: used.get(key).size,
    }));
  const total = content.reduce((sum, item) => sum + item.count, 0);
  const result = { content, total };

  const outputPath = outArg
    ? path.resolve(process.cwd(), outArg)
    : path.join(__dirname, 'dist', 'used_tracks.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Wrote ${content.length} OST entries (total ${total} tracks) to ${outputPath}`);

  if (warnings.length) {
    console.error(`Warnings (${warnings.length}):`);
    for (const w of warnings) {
      console.error(`- ${w}`);
    }
  }
}

main();
