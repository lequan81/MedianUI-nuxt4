<script setup lang="ts">
</script>

<template>
    <div class="flex min-h-screen flex-col bg-bg-base text-text-main antialiased relative">
        <AppHeader />

        <div class="flex flex-1 min-h-[calc(100vh-4rem)]">
            <AppSidebar />

            <div class="flex flex-1 flex-col min-w-0">
                <main class="flex-1 pb-12">
                    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                        <slot />
                    </div>
                </main>
            </div>
        </div>

        <!-- Admin Global Alerts -->
        <ClientOnly>
            <AppToast />
        </ClientOnly>
    </div>
</template>
