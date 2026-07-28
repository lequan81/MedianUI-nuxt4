<script setup lang="ts">
/* Left sidebar (mainL from XML)
   - Width: 75px (sideWidth.collapse)
   - Border-right: 1px solid var(--color-border-main)
   - All icons are OUTLINE style (stroke: currentColor, fill: none, stroke-width: 1.5)
   - Icons centered: margin-inline auto, size 20px
   - Active line on left edge
   - Group separators: 1px border-bottom
*/

const navGroups = [
  {
    items: [
      { name: 'Home', path: '/', active: true, icon: 'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z' },
      { name: 'Categories', path: '/categories', active: false, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
      { name: 'Projects', path: '/projects', active: false, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    ]
  },
  {
    items: [
      { name: 'Community', path: '/community', active: false, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
      { name: 'Contact', path: '/contact', active: false, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    ]
  },
  {
    items: [
      { name: 'Documentation', path: '/doc1', active: false, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: 'Typography', path: '/doc2', active: false, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: 'Shortcodes', path: '/doc3', active: false, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ]
  }
]
</script>

<template>
  <!-- mainL: 75px wide, border-right line -->
  <div 
    class="mainL hidden lg:block relative flex-shrink-0 z-[1] border-r border-[var(--color-border-main)]" 
    style="width: var(--side-width);"
  >
    <!-- leftW: sticky left sidebar wrapper -->
    <div 
      class="leftW sticky bg-[var(--color-bg-base)] overflow-y-auto overflow-x-hidden"
      style="top: var(--header-height); height: calc(100vh - var(--header-height));"
    >
      <nav 
        class="leftN w-full h-full bg-inherit"
        style="padding-block: var(--content-padding-box) 60px;"
      >
        <div class="leftC" style="padding-inline: calc((var(--side-width) - var(--icon-width)) / 2);">
          <template v-for="(group, gIdx) in navGroups" :key="gIdx">
            <!-- Group Separator Line -->
            <div 
              v-if="gIdx > 0" 
              class="my-3 border-b border-[var(--color-border-main)]"
            ></div>

            <NuxtLink 
              v-for="item in group.items" 
              :key="item.name"
              :to="item.path"
              :class="[
                'leftNav-item flex items-center justify-center relative my-1 py-2 rounded transition-colors',
                item.active ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-200'
              ]"
              style="width: var(--icon-width); height: var(--icon-height);"
              :title="item.name"
            >
              <!-- Active indicator line on left edge -->
              <span 
                v-if="item.active" 
                class="absolute top-0 bottom-0 -left-[20px] w-[2px] bg-[var(--color-primary)] rounded-r"
              ></span>

              <!-- OUTLINE Icon -->
              <svg 
                class="w-[20px] h-[20px] flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                stroke-width="1.5"
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path :d="item.icon"/>
              </svg>
            </NuxtLink>
          </template>
        </div>
      </nav>
    </div>
  </div>
</template>
