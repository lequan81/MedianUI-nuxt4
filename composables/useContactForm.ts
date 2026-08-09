import { computed, reactive, ref, watch } from "vue";
import * as v from "valibot";
import { useToast } from "~/composables/useToast";
import { contactSchema } from "~/utils/validators/contact";

export function useContactForm() {
  const toast = useToast();

  const form = ref({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const fieldErrors = ref<Record<string, string>>({});
  const touchedFields = ref<Record<string, boolean>>({});

  const formState = reactive({
    isSubmitting: false,
    isSubmitted: false,
    isLocked: false,
    activeCard: null as string | null,
  });

  function validateField(field: string) {
    touchedFields.value[field] = true;
    const val = String(form.value[field as keyof typeof form.value] || "").trim();

    if (field === "name") {
      if (!val) {
        fieldErrors.value.name = "Tên không được để trống";
      } else if (val.length < 2) {
        fieldErrors.value.name = "Tên phải có ít nhất 2 ký tự";
      } else if (val.length > 60) {
        fieldErrors.value.name = "Tên không quá 60 ký tự";
      } else {
        delete fieldErrors.value.name;
      }
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        fieldErrors.value.email = "Email không được để trống";
      } else if (!emailRegex.test(val)) {
        fieldErrors.value.email = "Địa chỉ Email không đúng định dạng";
      } else {
        delete fieldErrors.value.email;
      }
    } else if (field === "message") {
      if (!val) {
        fieldErrors.value.message = "Nội dung tin nhắn không được để trống";
      } else if (val.length < 5) {
        fieldErrors.value.message = "Nội dung lời nhắn phải từ 5 ký tự trở lên";
      } else if (val.length > 1000) {
        fieldErrors.value.message = "Nội dung lời nhắn không quá 1000 ký tự";
      } else {
        delete fieldErrors.value.message;
      }
    }
  }

  // Real-time validation watch as the user types
  watch(
    () => form.value.name,
    () => {
      if (touchedFields.value.name || fieldErrors.value.name !== undefined) {
        validateField("name");
      }
    }
  );

  watch(
    () => form.value.email,
    () => {
      if (touchedFields.value.email || fieldErrors.value.email !== undefined) {
        validateField("email");
      }
    }
  );

  watch(
    () => form.value.message,
    () => {
      if (touchedFields.value.message || fieldErrors.value.message !== undefined) {
        validateField("message");
      }
    }
  );

  const validFields = computed(() => {
    const nameVal = form.value.name.trim();
    const emailVal = form.value.email.trim();
    const messageVal = form.value.message.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      name:
        (touchedFields.value.name || form.value.name.length > 0) &&
        nameVal.length >= 2 &&
        nameVal.length <= 60 &&
        !fieldErrors.value.name,
      email:
        (touchedFields.value.email || form.value.email.length > 0) &&
        emailRegex.test(emailVal) &&
        !fieldErrors.value.email,
      message:
        (touchedFields.value.message || form.value.message.length > 0) &&
        messageVal.length >= 5 &&
        messageVal.length <= 1000 &&
        !fieldErrors.value.message,
    };
  });

  function toggleCard(id: string) {
    formState.activeCard = formState.activeCard === id ? null : id;
  }

  function lockSubmit(seconds: number) {
    formState.isLocked = true;
    setTimeout(() => {
      formState.isLocked = false;
    }, seconds * 1000);
  }

  async function handleSubmit() {
    fieldErrors.value = {};
    touchedFields.value = { name: true, email: true, message: true };

    if (formState.isLocked) {
      toast.warning("Bạn đang trong thời gian chờ. Vui lòng không gửi quá nhanh!");
      return;
    }

    const validationResult = v.safeParse(contactSchema, form.value);
    if (!validationResult.success) {
      for (const issue of validationResult.issues) {
        if (issue.path && issue.path.length > 0) {
          const keyName = String(issue.path[0].key);
          fieldErrors.value[keyName] = issue.message;
        }
      }
      toast.warning("Vui lòng kiểm tra lại thông tin nhập trong form.");
      return;
    }

    formState.isSubmitting = true;

    try {
      const res = await $fetch<{ success: boolean; message: string }>("/api/contact", {
        method: "POST",
        body: form.value,
      });

      formState.isSubmitting = false;
      formState.isSubmitted = true;
      toast.success(res.message || "Gửi tin nhắn thành công!");

      form.value = { name: "", email: "", subject: "", message: "" };
      fieldErrors.value = {};
      touchedFields.value = {};
      lockSubmit(30);
    } catch (err: any) {
      formState.isSubmitting = false;
      const statusCode = err?.statusCode || err?.response?.status;
      const errorData = err?.data || err?.response?._data?.data;

      if (statusCode === 429) {
        const retryAfter = errorData?.retryAfter || 30;
        const msg = errorData?.message || `Bạn đã gửi quá nhanh. Vui lòng chờ ${retryAfter} giây.`;
        toast.warning(msg, "Giới hạn gửi tin nhắn");
        lockSubmit(retryAfter);
      } else if (statusCode === 400 && errorData?.fieldErrors) {
        fieldErrors.value = errorData.fieldErrors;
        toast.error(errorData.message || "Thông tin nhập chưa hợp lệ.");
      } else {
        toast.error("Có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.");
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
    handleSubmit,
  };
}
