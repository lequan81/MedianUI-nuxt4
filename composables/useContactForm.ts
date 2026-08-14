import { computed, reactive, ref } from "vue";
import * as v from "valibot";
import { useToast } from "~/composables/useToast";
import { useTimeout } from "~/composables/useTimeout";
import { formatDateTime } from "~/utils/formatters";
import { extractApiError } from "~/utils/type-guards";
import { contactSchema } from "~/utils/validators/contact";
import type { SubmittedContactData } from "~/types/contact";

export function useContactForm() {
  const toast = useToast();
  const mountedAt = Date.now();

  const form = ref({
    name: "",
    email: "",
    subject: "",
    message: "",
    website_url: "",
  });

  const fieldErrors = ref<Record<string, string>>({});
  const touchedFields = ref<Record<string, boolean>>({});

  const formState = reactive({
    isSubmitting: false,
    isSubmitted: false,
    isLocked: false,
    activeCard: null as string | null,
    submittedData: null as SubmittedContactData | null,
  });

  function resetFormState() {
    formState.isSubmitted = false;
    formState.submittedData = null;
    form.value = { name: "", email: "", subject: "", message: "", website_url: "" };
    fieldErrors.value = {};
    touchedFields.value = {};
  }

  /**
   * Validates form against Valibot schema.
   * If fieldName is specified, marks it as touched and extracts its specific error.
   */
  function validateField(fieldName?: string) {
    if (fieldName) {
      touchedFields.value[fieldName] = true;
    }

    const result = v.safeParse(contactSchema, form.value);

    if (result.success) {
      if (fieldName) {
        delete fieldErrors.value[fieldName];
      } else {
        fieldErrors.value = {};
      }
      return true;
    }

    const extractedErrors: Record<string, string> = {};
    for (const issue of result.issues) {
      if (issue.path && issue.path.length > 0) {
        const key = String(issue.path[0].key);
        if (!extractedErrors[key]) {
          extractedErrors[key] = issue.message;
        }
      }
    }

    if (fieldName) {
      if (extractedErrors[fieldName]) {
        fieldErrors.value[fieldName] = extractedErrors[fieldName];
      } else {
        delete fieldErrors.value[fieldName];
      }
    } else {
      fieldErrors.value = extractedErrors;
    }

    return false;
  }

  const validFields = computed(() => {
    const result = v.safeParse(contactSchema, form.value);
    const errorKeys = new Set(result.success ? [] : result.issues.map((i) => String(i.path?.[0]?.key)));

    return {
      name: Boolean(form.value.name.trim()) && !errorKeys.has("name"),
      email: Boolean(form.value.email.trim()) && !errorKeys.has("email"),
      message: Boolean(form.value.message.trim()) && !errorKeys.has("message"),
    };
  });

  function toggleCard(id: string) {
    formState.activeCard = formState.activeCard === id ? null : id;
  }

  const { set: setLockTimer } = useTimeout();

  function lockSubmit(seconds: number) {
    formState.isLocked = true;
    setLockTimer(() => {
      formState.isLocked = false;
    }, seconds * 1000);
  }

  function getI18nText(key: string, defaultText: string, params?: Record<string, unknown>): string {
    try {
      const nuxtApp = useNuxtApp() as {
        $i18n?: {
          t: (key: string, params?: Record<string, unknown>) => string;
        };
      };
      if (nuxtApp.$i18n?.t) {
        return nuxtApp.$i18n.t(key, params);
      }
    } catch {
      // Fallback for isolated test environments
    }
    return defaultText;
  }

  async function handleSubmit(captchaToken?: string) {
    touchedFields.value = { name: true, email: true, message: true };

    if (formState.isLocked) {
      toast.warning(
        getI18nText("contact.messages.locked", "Bạn đang trong thời gian chờ. Vui lòng không gửi quá nhanh!")
      );
      return;
    }

    const isValid = validateField();
    if (!isValid) {
      toast.warning(
        getI18nText("contact.messages.validationError", "Vui lòng kiểm tra lại thông tin nhập trong form.")
      );
      return;
    }

    formState.isSubmitting = true;

    try {
      const res = await $fetch<{ message?: string }>("/api/contact", {
        method: "POST",
        body: {
          ...form.value,
          captcha_token: captchaToken,
          _t: mountedAt,
        },
      });

      const now = new Date();
      formState.submittedData = {
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
        time: formatDateTime(now),
      };

      formState.isSubmitting = false;
      formState.isSubmitted = true;
      toast.success(
        getI18nText("contact.messages.success", "Gửi tin nhắn thành công!")
      );

      form.value = { name: "", email: "", subject: "", message: "", website_url: "" };
      fieldErrors.value = {};
      touchedFields.value = {};
      lockSubmit(30);
    } catch (err: unknown) {
      formState.isSubmitting = false;
      const apiError = extractApiError(err);

      if (apiError.statusCode === 429) {
        const retryAfter = apiError.retryAfter || 30;
        const msgKey =
          apiError.code === "RATE_LIMIT_WINDOW"
            ? "contact.messages.windowLimit"
            : "contact.messages.burstLimit";
        const fallbackMsg =
          apiError.code === "RATE_LIMIT_WINDOW"
            ? `Bạn đã đạt giới hạn gửi tin nhắn. Vui lòng chờ ${retryAfter} giây.`
            : `Bạn đã gửi quá nhanh. Vui lòng chờ ${retryAfter} giây.`;

        const msg = getI18nText(msgKey, fallbackMsg, { seconds: retryAfter });
        toast.warning(msg, getI18nText("contact.title", "Giới hạn gửi tin nhắn"));
        lockSubmit(retryAfter);
      } else if (apiError.code === "SUBMIT_TOO_FAST") {
        toast.warning(
          getI18nText("contact.messages.fastSubmit", "Thao tác gửi quá nhanh. Vui lòng thử lại sau giây lát.")
        );
      } else if (apiError.code === "CAPTCHA_INVALID") {
        toast.error(
          getI18nText("contact.messages.captchaInvalid", "Xác minh Captcha không hợp lệ. Vui lòng thử lại.")
        );
      } else if (apiError.statusCode === 400 && apiError.fieldErrors) {
        fieldErrors.value = { ...apiError.fieldErrors };
        toast.error(
          getI18nText("contact.messages.validationError", "Thông tin nhập chưa hợp lệ.")
        );
      } else {
        toast.error(
          getI18nText("contact.messages.serverError", "Có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.")
        );
      }
    }
  }

  return {
    form,
    fieldErrors,
    validFields,
    formState,
    validateField,
    toggleCard,
    resetFormState,
    handleSubmit,
  };
}
