import { describe, expect, it } from "vitest";
import { pdfLinkBounds, safePdfLink } from "@/lib/pdf-links";

describe("PDF hyperlinks", () => {
  it("preserves web and email destinations", () => {
    expect(safePdfLink("https://www.linkedin.com/in/keshav-s-058264319/")).toBe("https://www.linkedin.com/in/keshav-s-058264319/");
    expect(safePdfLink("https://github.com/Keshav30-jpg")).toBe("https://github.com/Keshav30-jpg");
    expect(safePdfLink("mailto:keshavharis30@gmail.com")).toBe("mailto:keshavharis30@gmail.com");
  });
  it("rejects executable and invalid destinations", () => {
    expect(safePdfLink("javascript:alert(1)")).toBeUndefined();
    expect(safePdfLink("data:text/html,unsafe")).toBeUndefined();
    expect(safePdfLink("not a URL")).toBeUndefined();
  });
  it("keeps link hit areas aligned when a PDF scales", () => {
    expect(pdfLinkBounds([200, 300, 100, 280], 1000, 2000)).toEqual({ left: "10%", top: "14%", width: "10%", height: "1%" });
  });
});