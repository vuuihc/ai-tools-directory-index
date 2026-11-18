#!/usr/bin/env node
/**
 * Structural validator for data/tools.json and data/tools.csv.
 * No network, no secrets, no deployment.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIELDS = ['slug', 'name', 'url', 'category', 'pricing', 'tagline'];
const MIN_ROWS = 1000;
const TAGLINE_MAX = 160;

const errors = [];
function fail(message) {
  errors.push(message);
  if (errors.length <= 25) console.error(`FAIL: ${message}`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell !== ''));
}

const jsonPath = path.join(ROOT, 'data', 'tools.json');
const csvPath = path.join(ROOT, 'data', 'tools.csv');

if (!fs.existsSync(jsonPath)) fail('missing data/tools.json');
if (!fs.existsSync(csvPath)) fail('missing data/tools.csv');

let tools = [];
if (fs.existsSync(jsonPath)) {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (error) {
    fail(`tools.json is not valid JSON: ${error.message}`);
  }
  if (payload) {
    if (!payload.meta || typeof payload.meta !== 'object') fail('tools.json has no meta object');
    if (!Array.isArray(payload.tools)) fail('tools.json has no tools array');
    tools = Array.isArray(payload.tools) ? payload.tools : [];
    if (payload.meta && payload.meta.count !== tools.length) {
      fail(`meta.count ${payload.meta.count} !== tools.length ${tools.length}`);
    }
    if (tools.length <= MIN_ROWS) fail(`row count ${tools.length} is not greater than ${MIN_ROWS}`);
  }
}

const ids = new Set();
const slugs = new Set();
for (let index = 0; index < tools.length; index += 1) {
  const tool = tools[index];
  const label = `row ${index + 1}`;
  if (!tool || typeof tool !== 'object' || Array.isArray(tool)) {
    fail(`${label}: not an object`);
    continue;
  }
  const keys = Object.keys(tool).sort();
  if (keys.join(',') !== [...FIELDS].sort().join(',')) {
    fail(`${label}: fields are ${keys.join(',')}, expected ${FIELDS.join(',')}`);
  }
  for (const field of ['slug', 'name', 'url', 'category', 'tagline']) {
    if (typeof tool[field] !== 'string' || tool[field].trim() === '') {
      fail(`${label}: ${field} is empty or not a string`);
    }
  }
  if (tool.pricing !== null && typeof tool.pricing !== 'string') {
    fail(`${label}: pricing must be a string or null`);
  }
  if (typeof tool.tagline === 'string' && [...tool.tagline].length > TAGLINE_MAX) {
    fail(`${label}: tagline exceeds ${TAGLINE_MAX} characters`);
  }
  if (typeof tool.url === 'string' && !/^https?:\/\/\S+$/i.test(tool.url)) {
    fail(`${label}: url is not http(s)`);
  }
  if (typeof tool.category === 'string' && !/^[a-z0-9-]+$/.test(tool.category)) {
    fail(`${label}: category is not a lowercase slug`);
  }
  if (typeof tool.slug === 'string') {
    if (slugs.has(tool.slug)) fail(`${label}: duplicate slug`);
    slugs.add(tool.slug);
  }
}

if (fs.existsSync(csvPath)) {
  const csvRows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const header = csvRows.shift() || [];
  if (header.join(',') !== FIELDS.join(',')) {
    fail(`CSV header is ${header.join(',')}, expected ${FIELDS.join(',')}`);
  }
  if (csvRows.length !== tools.length) {
    fail(`CSV rows ${csvRows.length} !== JSON rows ${tools.length}`);
  }
  for (let index = 0; index < Math.min(csvRows.length, tools.length); index += 1) {
    const cells = csvRows[index];
    if (cells.length !== FIELDS.length) {
      fail(`CSV row ${index + 2}: ${cells.length} columns, expected ${FIELDS.length}`);
      continue;
    }
    const csvTool = Object.fromEntries(FIELDS.map((field, i) => [field, cells[i]]));
    for (const field of FIELDS) {
      const expected = tools[index][field] ?? '';
      if (csvTool[field] !== expected) {
        fail(`CSV row ${index + 2}: ${field} differs from JSON`);
      }
    }
  }
}

if (errors.length) {
  console.error(`validate: FAIL (${errors.length} issue${errors.length === 1 ? '' : 's'})`);
  process.exit(1);
}

const categories = new Set(tools.map((tool) => tool.category));
const priced = tools.filter((tool) => tool.pricing).length;
console.log(`validate: PASS rows=${tools.length} categories=${categories.size} priced=${priced}`);
