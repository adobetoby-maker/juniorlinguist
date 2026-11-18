import {
  PARENT_POLICY,
  PARENT_COPY,
  PARENT_TRACKS,
  parentPolicy,
} from "../../server/parent-marketing.js";
export { PARENT_POLICY, PARENT_COPY, PARENT_TRACKS };
export const WEEKLY_ENDPOINT =
  "https://myaimarketing.worker-bee.app/api/weekly-subscriptions";
export const WEEKLY_POLICY = "weekly-practice-v1";
export const WEEKLY_PRIVACY = "https://languagethreshold.com/privacy";
export const WEEKLY_TRACKS = [
  {
    id: "junior-parent-orientation",
    label: "Junior Linguist for parents",
    weeks: 10,
    detail: "Simple ways to practice together.",
  },
  {
    id: "homeschool-spanish",
    label: "Homeschool Spanish",
    weeks: 50,
    detail: "A small lesson for your family’s week.",
  },
  {
    id: "language-threshold-module-lessons",
    label: "Language Threshold for adults",
    weeks: 50,
    detail: "Spanish for work, travel, and everyday settings.",
  },
] as const;
export type WeeklyTrackId = (typeof WEEKLY_TRACKS)[number]["id"];
export type WeeklyAvailability = { siteKey: string; tracks: WeeklyTrackId[] };
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
export function weeklyAvailability(
  value: unknown,
  directDownload = false,
): WeeklyAvailability | null {
  if (
    !record(value) ||
    value.enabled !== true ||
    value.available !== true ||
    value.policyVersion !== WEEKLY_POLICY ||
    value.pacing !== "one_lesson_email_per_week_total" ||
    value.privacyUrl !== WEEKLY_PRIVACY ||
    !record(value.antiAbuse) ||
    !Array.isArray(value.tracks)
  )
    return null;
  if (
    directDownload &&
    (!parentPolicy(value.parentDownload) ||
      !record(value.parentDownload) ||
      value.parentDownload.enabled !== true)
  )
    return null;
  const guard = value.antiAbuse;
  if (
    guard.provider !== "turnstile" ||
    guard.action !== "weekly_signup" ||
    guard.cdataRequired !== true ||
    typeof guard.siteKey !== "string" ||
    !/^[a-zA-Z0-9_-]{10,100}$/.test(guard.siteKey)
  )
    return null;
  const seen = new Set<string>(),
    tracks: WeeklyTrackId[] = [];
  for (const track of value.tracks) {
    if (!record(track) || typeof track.id !== "string" || seen.has(track.id))
      return null;
    const known = WEEKLY_TRACKS.find((item) => item.id === track.id);
    if (
      !known ||
      track.totalWeeks !== known.weeks ||
      typeof track.available !== "boolean"
    )
      return null;
    seen.add(track.id);
    if (
      track.available &&
      (!directDownload || PARENT_TRACKS.some((id) => id === known.id))
    )
      tracks.push(known.id);
  }
  if (directDownload && !PARENT_TRACKS.every((id) => tracks.includes(id)))
    return null;
  return tracks.length ? { siteKey: guard.siteKey, tracks } : null;
}
export function weeklyRequest(
  input: {
    email: string;
    trackId: string;
    adult: boolean;
    consent: boolean;
    token: string;
    requestId: string;
    website: string;
  },
  available: WeeklyAvailability,
  directDownload = false,
) {
  const email = input.email.trim().toLowerCase();
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    input.adult !== true ||
    input.consent !== true ||
    !available.tracks.includes(input.trackId as WeeklyTrackId) ||
    !input.token ||
    input.token.length > 2048 ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      input.requestId,
    )
  )
    throw new Error(
      "Complete the email, series choice, permission, and verification first.",
    );
  if (directDownload && !PARENT_TRACKS.some((id) => id === input.trackId))
    throw new Error("Choose a parent or homeschool series.");
  return {
    action: "request",
    email,
    trackId: input.trackId as WeeklyTrackId,
    adult: true,
    weeklyConsent: true,
    policyVersion: directDownload ? PARENT_POLICY : WEEKLY_POLICY,
    turnstileToken: input.token,
    requestId: input.requestId,
    website: input.website,
  };
}
export function weeklyRequestAccepted(status: number, value: unknown) {
  return status === 202 && record(value) && value.status === "request_received";
}
