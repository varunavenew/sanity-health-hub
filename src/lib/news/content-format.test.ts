import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveArticleContentFormat } from "@/lib/news/content-format";

describe("resolveArticleContentFormat", () => {
  it("keeps the three stored values", () => {
    assert.equal(resolveArticleContentFormat("article"), "article");
    assert.equal(resolveArticleContentFormat("podcast"), "podcast");
    assert.equal(resolveArticleContentFormat("video"), "video");
  });

  it("treats missing, empty, and unknown values as article", () => {
    assert.equal(resolveArticleContentFormat(undefined), "article");
    assert.equal(resolveArticleContentFormat(null), "article");
    assert.equal(resolveArticleContentFormat(""), "article");
    assert.equal(resolveArticleContentFormat("   "), "article");
    assert.equal(resolveArticleContentFormat("post"), "article");
    assert.equal(resolveArticleContentFormat(42), "article");
  });

  it("tolerates casing and whitespace", () => {
    assert.equal(resolveArticleContentFormat(" Podcast "), "podcast");
    assert.equal(resolveArticleContentFormat("VIDEO"), "video");
  });
});
