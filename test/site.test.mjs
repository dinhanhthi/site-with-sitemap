import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const requiredPages = [
  "/about.html",
  "/services.html",
  "/blog.html",
  "/contact.html"
];

test("home page links to all four child pages", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");

  for (const page of requiredPages) {
    assert.match(
      home,
      new RegExp(`href=["']${page}["']`),
      `Missing link to ${page} on home page`
    );
  }
});

test("all child pages exist and have basic HTML structure", async () => {
  for (const page of requiredPages) {
    const content = await readFile(new URL(`..${page}`, import.meta.url), "utf8");
    assert.match(content, /<!DOCTYPE html>/i, `${page} must include doctype`);
    assert.match(content, /<title>.+<\/title>/i, `${page} must include title`);
  }
});

test("sitemap contains home and four child pages", async () => {
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  const expected = ["/", ...requiredPages];

  for (const path of expected) {
    assert.match(
      sitemap,
      new RegExp(`<loc>https://example\\.com${path}<\\/loc>`),
      `Missing sitemap URL for ${path}`
    );
  }
});
