import puppeteer from 'puppeteer';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(__dirname, '../public/assets/images/og-image.svg');
const pngPath = path.resolve(__dirname, '../public/assets/images/og-image.png');

const svg = readFileSync(svgPath, 'utf-8');
const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;">${svg}</body></html>`;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.screenshot({ path: pngPath, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

console.log(`Wrote ${pngPath}`);
