import { describe, expect, it } from "vitest";

describe("secrets validation", () => {
  it("GOOGLE_CLIENT_ID is set and looks valid", () => {
    const id = process.env.GOOGLE_CLIENT_ID;
    expect(id).toBeDefined();
    expect(id!.length).toBeGreaterThan(10);
    expect(id).toContain(".apps.googleusercontent.com");
  });

  it("GOOGLE_CLIENT_SECRET is set", () => {
    const secret = process.env.GOOGLE_CLIENT_SECRET;
    expect(secret).toBeDefined();
    expect(secret!.length).toBeGreaterThan(5);
  });

  it("RESEND_API_KEY is set and looks valid", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeDefined();
    expect(key!.startsWith("re_")).toBe(true);
  });
});
