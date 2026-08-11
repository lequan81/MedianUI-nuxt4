import type { ContactConfig } from "~/types/contact";

export const contactConfig: ContactConfig = {
  rateLimit: {
    maxBurstRequests: 3,
    burstWindowSeconds: 30,
    maxWindowRequests: 5,
    maxWindowSeconds: 600,
  },
  messages: {
    success: "Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công. Mình sẽ phản hồi sớm nhất.",
    burstLimitExceeded: (seconds: number) =>
      `Bạn đã gửi 3 lần liên tiếp. Vui lòng chờ ${seconds} giây trước khi gửi lại.`,
    windowLimitExceeded: (seconds: number) =>
      `Bạn đã đạt giới hạn 5 tin nhắn/10 phút. Vui lòng thử lại sau ${seconds} giây.`,
    validationError: "Vui lòng kiểm tra lại các trường thông tin bên dưới.",
    serverError: "Có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.",
  },
};
