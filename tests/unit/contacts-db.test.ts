// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createContact, listContacts, getContactStats } from "~/server/services/contact.service";

describe("Bun SQLite Contacts System & Database Queries", () => {
  it("should insert a new contact message with native UUIDv7 id", () => {
    const contact = createContact({
      name: "Tester 1",
      email: "tester1@example.com",
      subject: "Chủ đề thử nghiệm",
      message: "Nội dung tin nhắn thử nghiệm",
    });

    expect(contact).toBeDefined();
    expect(contact?.id).toBeDefined();
    expect(contact?.name).toBe("Tester 1");
    expect(contact?.email).toBe("tester1@example.com");
    expect(contact?.status).toBe("unread");
  });

  it("should fetch paginated contacts and compute live stats", () => {
    const result = listContacts(1, 10);
    expect(result).toBeDefined();
    expect(Array.isArray(result.contacts)).toBe(true);
    expect(result.total).toBeGreaterThan(0);

    const stats = getContactStats();
    expect(stats.totalContacts).toBeGreaterThan(0);
  });
});
