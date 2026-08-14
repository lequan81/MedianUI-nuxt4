<script setup lang="ts">
import { definePageMeta, ref } from "#imports";
import { authorConfig } from "~/app/config/site";
import { useContactForm } from "~/composables/useContactForm";
import { useSeo } from "~/composables/useSeo";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

definePageMeta({
    hideSidebar: true,
});

useSeo({
    title: `Liên hệ - ${authorConfig.name}`,
    description: `Trang liên hệ trực tiếp với ${authorConfig.name}. Gửi tin nhắn, góp ý hoặc trao đổi hợp tác dự án.`,
});

const captchaToken = ref("");
const { form, fieldErrors, validFields, validateField, formState, toggleCard, resetFormState, handleSubmit } = useContactForm();

function onCaptchaVerify(token: string) {
    captchaToken.value = token;
}

function submitWithCaptcha(e?: Event) {
    if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
    }
    handleSubmit(captchaToken.value);
}
</script>

<template>
    <article class="mx-auto max-w-5xl space-y-6">
        <!-- Header Title Chuẩn Spacing Giống Hệt Trang About 100% -->
        <div class="space-y-1.5">
            <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-3">
                <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ
                </NuxtLink>
                <span class="text-text-muted">/</span>
                <span class="truncate font-semibold text-text-main">Liên hệ</span>
            </nav>
            <h1 class="text-lg sm:text-2xl md:text-3xl font-bold leading-snug tracking-tight text-text-main">
                Liên hệ
            </h1>
        </div>

        <!-- Layout 2 Cột Preline UI Dài Rộng Ngang (max-w-5xl) -->
        <div class="grid gap-6 lg:gap-8 lg:grid-cols-12 items-stretch">
            <!-- Cột Trái (Author Profile & Info Cards) -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-4">
                <!-- Profile Header Block Tích Hợp Socials -->
                <div @click="toggleCard('author')" :class="[
                    'group relative overflow-hidden rounded-xl border border-dashed p-5 space-y-3.5 shadow-2xs transition-all duration-300 cursor-pointer select-none',
                    formState.activeCard === 'author'
                        ? 'border-primary bg-bg-alt shadow-md'
                        : 'border-border-main bg-bg-alt/60 hover:border-primary/60 hover:bg-bg-alt'
                ]">
                    <div class="flex items-center gap-3">
                        <NuxtImg :src="authorConfig.avatar" :alt="authorConfig.name" :class="[
                            'h-9.5 w-9.5 shrink-0 rounded-full object-cover ring-2 shadow-xs transition-all duration-300',
                            formState.activeCard === 'author' ? 'ring-primary scale-105' : 'ring-primary/20 group-hover:ring-primary group-hover:scale-105'
                        ]" format="webp" loading="lazy" />
                        <div class="min-w-0 flex-1">
                            <h2 :class="[
                                'text-sm sm:text-base font-bold leading-tight inline-block transition-colors',
                                formState.activeCard === 'author' ? 'text-primary' : 'text-text-main group-hover:text-primary'
                            ]">
                                {{ authorConfig.name }}
                            </h2>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="text-xs font-semibold text-primary">
                                    {{ authorConfig.handle }}
                                </span>
                                <span class="text-xs text-text-muted">•</span>
                                <span
                                    class="inline-flex items-center rounded px-1.5 py-0.2 text-[11px] font-semibold text-primary">
                                    23 tuổi
                                </span>
                            </div>
                        </div>
                    </div>

                    <p class="text-xs leading-relaxed text-text-alt pt-0.5">
                        Software Engineer &amp; Tech Blogger. Đam mê nghiên cứu công nghệ mới, an toàn thông tin và xây
                        dựng sản
                        phẩm web tối ưu trải nghiệm đọc.
                    </p>

                    <div class="pt-3.5 border-t border-border-subtle flex items-center gap-1.5" @click.stop>
                        <a v-for="social in authorConfig.socials" :key="social.name" :href="social.href" target="_blank"
                            rel="noreferrer" :title="social.name" :aria-label="social.name"
                            class="flex h-8 w-8 items-center justify-center rounded-lg border border-border-main bg-bg-sec text-text-main transition-all duration-200 hover:border-primary hover:text-primary hover:bg-primary-subtle/40 hover:scale-105 active:scale-95 shadow-2xs select-none">
                            <AppIcon :name="social.icon || 'link'" :size="14" class="shrink-0" />
                        </a>
                    </div>
                </div>

                <!-- Info Blocks List -->
                <div @click="toggleCard('info-block')" :class="[
                    'group relative overflow-hidden rounded-xl border border-dashed p-5 space-y-3.5 shadow-2xs transition-all duration-300 cursor-pointer select-none flex-1 flex flex-col justify-center',
                    formState.activeCard === 'info-block'
                        ? 'border-primary bg-bg-alt shadow-md'
                        : 'border-border-main bg-bg-alt/60 hover:border-primary/60 hover:bg-bg-alt'
                ]">
                    <div class="flex items-start gap-3">
                        <div :class="[
                            'flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-transform duration-300',
                            formState.activeCard === 'info-block' ? 'scale-105' : 'group-hover:scale-105'
                        ]">
                            <AppIcon name="mail" :size="15" />
                        </div>
                        <div class="space-y-0.5 min-w-0">
                            <h3 class="text-xs font-bold text-text-main">Email trực tiếp</h3>
                            <a :href="`mailto:${authorConfig.email}`"
                                class="text-xs font-semibold text-primary hover:underline transition-colors block truncate">
                                {{ authorConfig.email }}
                            </a>
                        </div>
                    </div>

                    <div class="flex items-start gap-3 pt-3 border-t border-border-subtle">
                        <div :class="[
                            'flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-transform duration-300',
                            formState.activeCard === 'info-block' ? 'scale-105' : 'group-hover:scale-105'
                        ]">
                            <AppIcon name="clock" :size="15" />
                        </div>
                        <div class="space-y-0.5 min-w-0">
                            <h3 class="text-xs font-bold text-text-main">Thời gian phản hồi</h3>
                            <p class="text-xs text-text-alt">
                                Cam kết phản hồi tin nhắn trong &lt; 24 giờ
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3 pt-3 border-t border-border-subtle">
                        <div :class="[
                            'flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-transform duration-300',
                            formState.activeCard === 'info-block' ? 'scale-105' : 'group-hover:scale-105'
                        ]">
                            <AppIcon name="map-pin" :size="15" />
                        </div>
                        <div class="space-y-0.5 min-w-0">
                            <h3 class="text-xs font-bold text-text-main">Vị trí địa lý</h3>
                            <p class="text-xs text-text-alt">
                                Việt Nam (Múi giờ UTC+07:00)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cột Phải (Contact Form Block) -->
            <div class="lg:col-span-7 flex flex-col">
                <div @click="toggleCard('form')" :class="[
                    'group relative overflow-hidden rounded-xl border p-4 sm:p-6 shadow-2xs transition-all duration-300 cursor-pointer select-none flex-1 flex flex-col justify-between space-y-4',
                    formState.activeCard === 'form'
                        ? 'border-primary bg-bg-alt shadow-md ring-1 ring-primary/40'
                        : 'border-border-main bg-bg-alt/60 hover:border-primary/60 hover:bg-bg-alt focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 focus-within:bg-bg-alt'
                ]">
                    <div
                        class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500">
                    </div>

                    <div
                        class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border-b border-border-subtle pb-3">
                        <h3 :class="[
                            'text-sm sm:text-base font-bold transition-colors flex items-center gap-2',
                            formState.activeCard === 'form' ? 'text-primary' : 'text-text-main group-hover:text-primary group-focus-within:text-primary'
                        ]">
                            <AppIcon name="send" :size="16" class="text-primary shrink-0" />
                            <span>Gửi tin nhắn trực tiếp</span>
                        </h3>
                        <span class="text-[10.5px] sm:text-xs font-medium text-text-muted">Nhận phản hồi sớm nhất</span>
                    </div>

                    <!-- GIAO DIỆN CẢM ƠN CAO CẤP CHUẨN MEDIAN UI V1.7 -->
                    <div v-if="formState.isSubmitted"
                        class="relative my-auto overflow-hidden rounded-2xl border border-emerald-500/30 bg-bg-sec/80 p-6 sm:p-8 text-center space-y-5 shadow-xl transition-all duration-300">
                        <!-- Glow hiệu ứng nền -->
                        <div
                            class="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none">
                        </div>
                        <div
                            class="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none">
                        </div>

                        <!-- Icon Tích xanh thành công -->
                        <div
                            class="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/10 shadow-xs">
                            <AppIcon name="check" :size="28" class="stroke-3" />
                        </div>

                        <!-- Tiêu đề & Lời cảm ơn -->
                        <div class="space-y-1.5 max-w-md mx-auto">
                            <h4 class="text-base sm:text-lg font-bold text-text-main tracking-tight">
                                Gửi tin nhắn thành công! 🎉
                            </h4>
                            <p class="text-xs text-text-alt leading-relaxed">
                                Cảm ơn bạn đã liên hệ. Tin nhắn của bạn đã được lưu lại và chuyển trực tiếp tới hộp thư
                                của Lê Quân.
                            </p>
                        </div>

                        <!-- Tóm tắt thông tin đã gửi (Glassmorphism Card) -->
                        <div v-if="formState.submittedData"
                            class="rounded-xl border border-border-subtle bg-bg-base/90 p-4 text-left space-y-2 text-xs shadow-2xs backdrop-blur-xs">
                            <div
                                class="flex items-center justify-between text-text-muted pb-2 border-b border-border-subtle text-[11px] font-semibold">
                                <span class="flex items-center gap-1">
                                    <AppIcon name="mail" :size="13" class="text-primary" />
                                    <span>XÁC NHẬN THÔNG TIN</span>
                                </span>
                                <span class="text-[10.5px] font-medium">{{ formState.submittedData.time }}</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                <div>
                                    <span class="text-text-muted text-[11px]">Người gửi:</span>
                                    <p class="font-semibold text-text-main truncate">{{ formState.submittedData.name }}
                                    </p>
                                </div>
                                <div>
                                    <span class="text-text-muted text-[11px]">Email phản hồi:</span>
                                    <p class="font-semibold text-primary truncate">{{ formState.submittedData.email }}
                                    </p>
                                </div>
                            </div>
                            <div v-if="formState.submittedData.subject" class="pt-1 border-t border-border-subtle/50">
                                <span class="text-text-muted text-[11px]">Tiêu đề:</span>
                                <p class="font-medium text-text-main truncate">{{ formState.submittedData.subject }}</p>
                            </div>
                        </div>

                        <!-- Nút Thao tác -->
                        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <button type="button"
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg cursor-pointer active:scale-95"
                                @click="resetFormState">
                                <AppIcon name="rotate-ccw" :size="14" />
                                <span>Gửi tin nhắn khác</span>
                            </button>

                            <NuxtLink to="/"
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border-main bg-bg-base px-5 py-2.5 text-xs font-semibold text-text-main shadow-2xs transition-all duration-200 hover:border-primary hover:text-primary hover:bg-bg-subtle cursor-pointer active:scale-95">
                                <AppIcon name="home" :size="14" />
                                <span>Về trang chủ</span>
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Container Form Fields với Validation Lỗi Chi Tiết -->
                    <div v-else class="relative flex-1 flex flex-col justify-between space-y-3.5 sm:space-y-4">
                        <!-- Honeypot Anti-bot field (Hidden from real users) -->
                        <input v-model="form.website_url" type="text" name="website_url" tabindex="-1"
                            autocomplete="off" aria-hidden="true"
                            class="opacity-0 absolute left-[-9999px] pointer-events-none h-0 w-0" />

                        <div class="space-y-3">
                            <div class="grid gap-3 sm:grid-cols-2">
                                <div class="relative">
                                    <label class="block text-xs font-medium text-text-main/90 pb-1">
                                        Họ và tên <span class="text-rose-500 font-bold ml-0.5">*</span>
                                    </label>
                                    <div class="relative flex items-center w-full">
                                        <input v-model="form.name" type="text" placeholder="Nhập tên của bạn" :class="[
                                            'w-full rounded-lg border bg-bg-sec px-3 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none transition-all shadow-2xs',
                                            validFields.name ? 'pr-8' : '',
                                            fieldErrors.name
                                                ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                                                : validFields.name
                                                    ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                                                    : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'
                                        ]" @input="validateField('name')" />
                                        <AppIcon v-if="validFields.name" name="check" :size="14"
                                            class="absolute right-3 text-emerald-500 shrink-0 pointer-events-none" />
                                    </div>
                                    <p v-if="fieldErrors.name" class="mt-1 text-[11px] font-medium text-rose-500">
                                        {{ fieldErrors.name }}
                                    </p>
                                </div>

                                <div class="relative">
                                    <label class="block text-xs font-medium text-text-main/90 pb-1">
                                        Email <span class="text-rose-500 font-bold ml-0.5">*</span>
                                    </label>
                                    <div class="relative flex items-center w-full">
                                        <input v-model="form.email" type="email" placeholder="your.email@example.com"
                                            :class="[
                                                'w-full rounded-lg border bg-bg-sec px-3 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none transition-all shadow-2xs',
                                                validFields.email ? 'pr-8' : '',
                                                fieldErrors.email
                                                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                                                    : validFields.email
                                                        ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                                                        : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'
                                            ]" @input="validateField('email')" />
                                        <AppIcon v-if="validFields.email" name="check" :size="14"
                                            class="absolute right-3 text-emerald-500 shrink-0 pointer-events-none" />
                                    </div>
                                    <p v-if="fieldErrors.email" class="mt-1 text-[11px] font-medium text-rose-500">
                                        {{ fieldErrors.email }}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-medium text-text-main/90 pb-1">
                                    Tiêu đề
                                </label>
                                <input v-model="form.subject" type="text"
                                    placeholder="Tiêu đề lời nhắn (không bắt buộc)"
                                    class="w-full rounded-lg border border-border-main bg-bg-sec px-3 py-2.5 text-xs text-text-main placeholder-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs" />
                            </div>

                            <div class="relative">
                                <label class="block text-xs font-medium text-text-main/90 pb-1">
                                    Nội dung tin nhắn <span class="text-rose-500 font-bold ml-0.5">*</span>
                                </label>
                                <div class="relative flex items-center w-full">
                                    <textarea v-model="form.message" rows="3"
                                        placeholder="Nội dung bạn muốn trao đổi với Lê Quân..." :class="[
                                            'w-full rounded-lg border bg-bg-sec p-3 text-xs text-text-main placeholder-text-muted outline-none transition-all shadow-2xs resize-y',
                                            fieldErrors.message
                                                ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                                                : validFields.message
                                                    ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                                                    : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'
                                        ]" @input="validateField('message')"></textarea>
                                </div>
                                <p v-if="fieldErrors.message" class="mt-1 text-[11px] font-medium text-rose-500">
                                    {{ fieldErrors.message }}
                                </p>
                            </div>
                        </div>

                        <div class="pt-1.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <TurnstileCaptcha @verify="onCaptchaVerify" />
                            <button type="button" :disabled="formState.isSubmitting || formState.isLocked"
                                class="group/btn w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-bg-sec px-5 py-2.5 text-xs font-semibold text-primary shadow-2xs transition-all duration-200 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                                @click.prevent.stop="submitWithCaptcha">
                                <AppIcon v-if="!formState.isSubmitting" name="send" :size="13"
                                    class="text-primary transition-colors group-hover/btn:text-white" />
                                <span>
                                    {{
                                        formState.isSubmitting
                                            ? "Đang gửi..."
                                    : "Gửi tin nhắn ngay"
                                    }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>
