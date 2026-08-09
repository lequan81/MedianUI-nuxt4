<template>
  <div class="space-y-8 animate-pulse">
    <section class="pt-1">
      <div class="mb-4 h-5 w-32 rounded bg-bg-alt/70"></div>
      
      <!-- Big featured popular post skeleton -->
      <div class="flex flex-col gap-4 mb-4">
        <div class="aspect-video w-full rounded-lg bg-bg-sec/70 border border-border-subtle"></div>
        <div class="flex gap-2.5">
          <div class="h-5 w-6 rounded bg-bg-alt/60"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 w-28 rounded bg-bg-alt/50"></div>
            <div class="h-4 w-full rounded bg-bg-sec/80"></div>
            <div class="h-4 w-3/4 rounded bg-bg-sec/80"></div>
          </div>
        </div>
      </div>

      <!-- Small popular posts list skeleton -->
      <div class="space-y-3">
        <div v-for="i in 4" :key="i" class="flex gap-2.5">
          <div class="h-4 w-6 rounded bg-bg-alt/60"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 w-20 rounded bg-bg-alt/50"></div>
            <div class="h-3.5 w-full rounded bg-bg-sec/70"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-1">
      <div class="mb-4 h-5 w-24 rounded bg-bg-alt/70"></div>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="i in 6" :key="i" class="h-9 rounded bg-bg-sec/60 border border-border-subtle"></div>
      </div>
    </section>
  </div>
</template>
