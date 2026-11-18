import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { build } from "esbuild";
import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const directory = mkdtempSync(path.resolve("node_modules/.jr-router-tests-"));
const output = path.join(directory, "subscription-gate.mjs");
await build({
  entryPoints: ["src/components/SubscriptionGate.tsx"], outfile: output,
  bundle: true, platform: "node", format: "esm", jsx: "automatic",
  external: ["react", "react/jsx-runtime", "react-router-dom"], logLevel: "silent",
  plugins: [{ name: "synthetic-subscription", setup(builder) {
    // Keep the real gate and installed Router; no authentication/database calls.
    builder.onResolve({ filter: /state\/subscription-state$/ }, () => ({
      path: "subscription", namespace: "fixture",
    }));
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({
      contents: "export const useSubscription=()=>globalThis.__juniorRouterSubscription;",
      loader: "js",
    }));
  } }],
});
const { SubscriptionGate } = await import(pathToFileURL(output));
test.after(() => {
  delete globalThis.__juniorRouterSubscription;
  rmSync(directory, { recursive: true, force: true });
});
function render(isActive) {
  globalThis.__juniorRouterSubscription = { isActive, loading: false };
  return renderToStaticMarkup(React.createElement(MemoryRouter, {
    initialEntries: ["/learn/colors/quiz?mode=practice"],
  }, React.createElement(Routes, null, React.createElement(Route, {
    path: "/learn/*", element: React.createElement(SubscriptionGate, null,
      React.createElement("main", null, "SYNTHETIC_LEARNING_CONTENT")),
  }))));
}
test("settled inactive subscription retains pricing/login links and hides deep learning content", () => {
  const html = render(false);
  assert.match(html, /Start your free trial/);
  assert.match(html, /href="\/pricing"/);
  assert.match(html, /href="\/login"/);
  assert.ok(!html.includes("SYNTHETIC_LEARNING_CONTENT"));
});
test("settled active subscription retains access through the nested learning route", () => {
  const html = render(true);
  assert.match(html, /<main>SYNTHETIC_LEARNING_CONTENT<\/main>/);
  assert.ok(!html.includes("Start your free trial"));
});
