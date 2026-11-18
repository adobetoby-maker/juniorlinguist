export const PARENT_POLICY: "weekly-parent-download-v2";
export const PARENT_COPY: string;
export const PARENT_TRACKS: readonly [
  "junior-parent-orientation",
  "homeschool-spanish",
];
export function parentPolicy(value: unknown): boolean;
export function parentReadiness(value: unknown): boolean;
export function parentMarketingStatus(
  deployment: string | undefined,
  fetcher?: typeof fetch,
): Promise<{
  site: string;
  supportsDirectMarketing: boolean;
  ready: boolean;
  enabled: boolean;
  policyVersion: string;
  copy: string;
  sourceDeployment: string;
}>;
