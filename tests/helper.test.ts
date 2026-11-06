import { beforeEach, describe, expect, it, vi } from "vitest";

const { configs, slides } = vi.hoisted(() => ({
  configs: {} as { syncSettings?: { server?: string } },
  slides: { value: [] as any[] },
}));
vi.mock("@slidev/client", () => ({ configs }));
vi.mock("#slidev/slides", () => ({ slides }));

import { getHash, getSyncServer } from "../services/helper";

beforeEach(() => {
  delete configs.syncSettings;
  slides.value = [];
});

describe("getSyncServer", () => {
  it("returns an empty URL without a configured server", () => {
    expect(getSyncServer()).toBe("");
    configs.syncSettings = {};
    expect(getSyncServer()).toBe("");
  });
  it.each(["https://sync.example.com", "wss://sync.example.com"])(
    "normalizes %s with and without a trailing slash", (url) => {
      configs.syncSettings = { server: url };
      expect(getSyncServer()).toBe(url);
      configs.syncSettings.server += "/";
      expect(getSyncServer()).toBe(url);
    },
  );
});

describe("getHash", () => {
  it("produces a stable group ID for the same slide content", () => {
    slides.value = [{ meta: { slide: { content: "# Hello" } } }];
    const hash = getHash();
    expect(hash).toMatch(/^[a-zA-Z0-9]+$/);
    expect(getHash()).toBe(hash);
    slides.value[0].meta.slide.content = "# Changed";
    expect(getHash()).not.toBe(hash);
  });
  it("includes slide order and handles missing content", () => {
    const slide = (content: string) => ({ meta: { slide: { content } } });
    slides.value = [slide("A"), slide("B")];
    const hash = getHash();
    slides.value.reverse();
    expect(getHash()).not.toBe(hash);
    slides.value = [undefined, {}];
    const missingContentHash = getHash();
    slides.value = [slide(""), slide("")];
    expect(getHash()).toBe(missingContentHash);
  });
});
