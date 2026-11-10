import { z } from "zod";

export const receiptSchema = z.object({
  id: z.uuid(),
  token: z.uuid(),
});

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100, "Please keep your name under 100 characters."),
  phone: z.string().trim().max(25).transform((value) => value.replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)))).refine((value) => !value || (/^\+?[\d\s().-]{7,25}$/.test(value) && value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15), "Please enter a valid phone number, or leave it empty."),
  side: z.enum(["bride", "groom"]),
  attending: z.enum(["yes", "no"]),
  events: z.array(z.enum(["haldi", "wedding"])).max(2).transform((values) => [...new Set(values)]),
  guests: z.number().int().min(1).max(10),
  note: z.string().trim().max(1000, "Please keep your note under 1,000 characters."),
  website: z.string().max(0, "Please try again."),
  receipt: receiptSchema,
}).superRefine((data, context) => {
  if (data.attending === "yes" && data.events.length === 0) context.addIssue({ code: "custom", path: ["events"], message: "Please choose at least one celebration." });
}).transform((data) => ({ ...data, events: data.attending === "no" ? [] : data.events, guests: data.attending === "no" ? 0 : data.guests }));

export type RsvpInput = z.input<typeof rsvpSchema>;
export type Rsvp = z.output<typeof rsvpSchema>;
export type Receipt = z.infer<typeof receiptSchema>;
