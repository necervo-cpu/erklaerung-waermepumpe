/**
 * Modul: Vite-Konfiguration (vite.config.ts)
 * Zweck: Build- und Dev-Server-Konfiguration für die Kältekreis-Fachdokumentation.
 * Verantwortlichkeit: Setzt relative Basis-Pfade für Standalone- und Dateisystem-Betrieb.
 * Sicherheitsrelevanz: Lokaler Build ohne externe Bundle-Injektionen.
 */

import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    target: "es2022",
    sourcemap: true
  }
});
