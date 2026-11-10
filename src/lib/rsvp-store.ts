import { appendFile, mkdir, readFile } from "node:fs/promises";
import { createHash, timingSafeEqual } from "node:crypto";
import path from "node:path";
import type { Rsvp } from "./rsvp-schema";

export class InvalidReceiptError extends Error {}

type StoredRsvp = Omit<Rsvp, "receipt" | "website"> & {
  id: string;
  tokenHash: string;
  updatedAt: string;
};

// Serialize read/verify/append within this Node process; the append-only log retains edits.
let queue: Promise<unknown> = Promise.resolve();

export async function saveRsvp(input: Rsvp, directory = process.env.RSVP_DATA_DIR || path.join(process.cwd(), ".data")) {
  const operation = queue.catch(() => undefined).then(async () => {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const file = path.join(directory, "rsvps.jsonl");
    let log = "";
    try { log = await readFile(file, "utf8"); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    const records: StoredRsvp[] = log.split("\n").filter(Boolean).map((line) => JSON.parse(line));
    const prior = records.findLast((record) => record.id === input.receipt.id);
    const hash = createHash("sha256").update(input.receipt.token).digest("hex");
    if (prior && !timingSafeEqual(Buffer.from(prior.tokenHash, "hex"), Buffer.from(hash, "hex"))) throw new InvalidReceiptError("Invalid receipt.");
    const { receipt, website: _website, ...response } = input;
    const entry: StoredRsvp = { ...response, id: receipt.id, tokenHash: hash, updatedAt: new Date().toISOString() };
    await appendFile(file, JSON.stringify(entry) + "\n", { encoding: "utf8", mode: 0o600, flush: true });
    return { receipt, updated: !!prior };
  });
  queue = operation;
  return operation;
}
