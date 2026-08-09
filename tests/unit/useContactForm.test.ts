import { describe, expect, it } from "vitest";
import { useContactForm } from "~/composables/useContactForm";

describe("useContactForm composable", () => {
  it("should initialize form and state cleanly", () => {
    const { form, formState } = useContactForm();
    expect(form.value.name).toBe("");
    expect(form.value.email).toBe("");
    expect(formState.isSubmitting).toBe(false);
    expect(formState.isSubmitted).toBe(false);
    expect(formState.activeCard).toBe(null);
  });

  it("should toggle active card state", () => {
    const { formState, toggleCard } = useContactForm();
    toggleCard("author");
    expect(formState.activeCard).toBe("author");
    toggleCard("author");
    expect(formState.activeCard).toBe(null);
  });
});
