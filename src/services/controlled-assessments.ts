const controlledIds = new Set([
  "137545d4-c22b-57c0-89de-ee0c3ff48d08",
  "31a166d7-9181-56e6-a78d-19d5ff9936ba",
  "aa4a1e61-fb5c-5946-ac7d-2db4fba405cb",
  "4b2b8d29-b9c6-5ed0-bae2-e6ace793b05d",
  "4c7e9573-4f02-5a21-868b-e29a9eaa8008",
  "82480b46-af91-5a68-a57e-628ee5ec08de",
]);

export function isControlledAssessment(id: string) {
  return controlledIds.has(id.toLowerCase());
}
