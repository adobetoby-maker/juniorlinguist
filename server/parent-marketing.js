export const PARENT_POLICY = "weekly-parent-download-v2";
export const PARENT_COPY =
  "Send my free family study guide and the weekly Language Threshold lesson series I select. I am an adult using my own email. I can change preferences or unsubscribe at any time.";
export const PARENT_TRACKS = [
  "junior-parent-orientation",
  "homeschool-spanish",
];
const totals = [10, 50];
const object = (value) =>
  !!value && typeof value === "object" && !Array.isArray(value);
export function parentPolicy(value) {
  return (
    object(value) &&
    value.policyVersion === PARENT_POLICY &&
    value.copy === PARENT_COPY &&
    typeof value.enabled === "boolean" &&
    Array.isArray(value.tracks) &&
    value.tracks.length === 2 &&
    PARENT_TRACKS.every((id) => value.tracks.includes(id))
  );
}
export function parentReadiness(value) {
  if (
    !object(value) ||
    value.enabled !== true ||
    value.available !== true ||
    value.policyVersion !== "weekly-practice-v1" ||
    value.pacing !== "one_lesson_email_per_week_total" ||
    value.privacyUrl !== "https://languagethreshold.com/privacy" ||
    !parentPolicy(value.parentDownload) ||
    !object(value.antiAbuse) ||
    !Array.isArray(value.tracks)
  )
    return false;
  const guard = value.antiAbuse;
  if (
    guard.provider !== "turnstile" ||
    guard.action !== "weekly_signup" ||
    guard.cdataRequired !== true ||
    typeof guard.siteKey !== "string" ||
    !/^[a-zA-Z0-9_-]{10,100}$/.test(guard.siteKey)
  )
    return false;
  const ids = value.tracks.map((track) => track?.id);
  if (new Set(ids).size !== ids.length) return false;
  return PARENT_TRACKS.every((id, index) =>
    value.tracks.some(
      (track) =>
        track?.id === id &&
        track.available === true &&
        track.totalWeeks === totals[index] &&
        track.publishedLessons === totals[index],
    ),
  );
}
export async function parentMarketingStatus(deployment, fetcher = fetch) {
  if (!/^dpl_[a-zA-Z0-9]+$/.test(deployment || ""))
    throw Error("Source deployment is unavailable");
  const origin = "https://myaimarketing.worker-bee.app";
  const read = async (path) => {
    const response = await fetcher(origin + path, {
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) throw Error("Marketing status is unavailable");
    const raw = await response.text();
    if (new TextEncoder().encode(raw).length > 8192)
      throw Error("Marketing status is invalid");
    return JSON.parse(raw);
  };
  const [availability, policy] = await Promise.all([
    read("/api/weekly-subscriptions?availability=1"),
    read("/api/marketing-gate?site=juniorlinguist.com"),
  ]);
  if (
    !object(policy) ||
    policy.site !== "juniorlinguist.com" ||
    policy.policyVersion !== PARENT_POLICY ||
    policy.copy !== PARENT_COPY ||
    typeof policy.enabled !== "boolean"
  )
    throw Error("Marketing policy is unavailable");
  return {
    site: "juniorlinguist.com",
    supportsDirectMarketing: true,
    ready: parentReadiness(availability),
    enabled: policy.enabled && availability.parentDownload?.enabled === true,
    policyVersion: PARENT_POLICY,
    copy: PARENT_COPY,
    sourceDeployment: deployment,
  };
}
