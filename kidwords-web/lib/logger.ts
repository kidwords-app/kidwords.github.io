type RdsLogLevel = "info" | "error";

/** Structured logs for Vercel function runtime (stdout/stderr). */
export function logRds(
  event: string,
  data?: Record<string, unknown>,
  level: RdsLogLevel = "info"
): void {
  const payload = {
    source: "kidwords:rds",
    event,
    ts: new Date().toISOString(),
    ...data,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}
