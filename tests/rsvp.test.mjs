import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { rsvpSchema } from "../src/lib/rsvp-schema.ts";
import { saveRsvp, InvalidReceiptError } from "../src/lib/rsvp-store.ts";

function response(overrides = {}) {
  return { name: "  A Wedding Guest  ", phone: "+91 98765 43210", side: "bride", attending: "yes", guests: 2, events: ["haldi", "wedding"], note: "Can’t wait!", website: "", receipt: { id: randomUUID(), token: randomUUID() }, ...overrides };
}

test("validates and normalizes guest names and event choices", () => {
  const result = rsvpSchema.parse(response({ events: ["haldi", "haldi"] }));
  assert.equal(result.name, "A Wedding Guest");
  assert.deepEqual(result.events, ["haldi"]);
});

test("accepting requires at least one event and a party of 1–10", () => {
  for (const overrides of [{ events: [] }, { guests: 0 }, { guests: 11 }, { guests: 1.5 }]) assert.equal(rsvpSchema.safeParse(response(overrides)).success, false);
});

test("declining clears selected events and guest count", () => {
  const result = rsvpSchema.parse(response({ attending: "no" }));
  assert.deepEqual(result.events, []);
  assert.equal(result.guests, 0);
});

test("accepts an optional phone but rejects malformed contact details", () => {
  assert.equal(rsvpSchema.safeParse(response({ phone: "" })).success, true);
  for (const phone of ["call me", ".......", "+1234567890123456", "123"]) assert.equal(rsvpSchema.safeParse(response({ phone })).success, false);
});

test("rejects missing names, invalid event IDs, oversized notes, and bot fields", () => {
  for (const overrides of [{ name: " " }, { side: "unknown" }, { events: ["party"] }, { note: "x".repeat(1001) }, { website: "spam.example" }, { receipt: { id: "invalid", token: "invalid" } }]) assert.equal(rsvpSchema.safeParse(response(overrides)).success, false);
});

test("saves a response, authenticates edits, and keeps raw receipt secrets off disk", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "wedding-rsvp-"));
  try {
    const first = rsvpSchema.parse(response());
    assert.equal((await saveRsvp(first, directory)).updated, false);
    assert.equal((await saveRsvp({ ...first, guests: 3 }, directory)).updated, true);
    const log = await readFile(path.join(directory, "rsvps.jsonl"), "utf8");
    const records = log.trim().split("\n").map(JSON.parse);
    assert.equal(records.length, 2);
    assert.equal(records[1].guests, 3);
    assert.equal(records[0].id, records[1].id);
    assert.equal(log.includes(first.receipt.token), false);
    assert.equal("website" in records[0], false);
    await assert.rejects(saveRsvp({ ...first, receipt: { ...first.receipt, token: randomUUID() } }, directory), InvalidReceiptError);
    assert.equal((await readFile(path.join(directory, "rsvps.jsonl"), "utf8")).trim().split("\n").length, 2);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("serializes concurrent submissions without dropping responses, and recovers after a rejected edit", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "wedding-concurrent-"));
  try {
    const inputs = Array.from({ length: 12 }, (_, i) => rsvpSchema.parse(response({ name: `Guest ${i}` })));
    await Promise.all(inputs.map((input) => saveRsvp(input, directory)));
    await assert.rejects(saveRsvp({ ...inputs[0], receipt: { ...inputs[0].receipt, token: randomUUID() } }, directory), InvalidReceiptError);
    await saveRsvp({ ...inputs[0], guests: 4 }, directory);
    const records = (await readFile(path.join(directory, "rsvps.jsonl"), "utf8")).trim().split("\n").map(JSON.parse);
    assert.equal(records.length, 13);
    assert.equal(new Set(records.map((record) => record.id)).size, 12);
    assert.equal(records.at(-1).guests, 4);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
