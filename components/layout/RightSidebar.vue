<script setup lang="ts">
/* Right sidebar (.sideB from XML)
   - Title structure: h2.name > a.clamp (line-clamp-2 MAX 2 LINES)
   - Title font size: 16.8px !important (from main.css)
   - All icons are OUTLINE style
   - Badges: Circle Bookmark+ button on top right of thumbnail
   - Thumbnails object-cover tràn viền 16:9
*/

const popularPosts = [
  {
    id: 1,
    num: '01',
    date: 'Oct 25',
    category: 'Decor',
    title: 'The 6 Worst Interior Design Jobs In History',
    snippet: 'How hollywood got apartment guides all wrong. The complete beginner\'s guide...',
    comments: 8,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },
  { id: 2, num: '02', date: 'Mar 16', category: 'Product', title: 'Median UI - Blogger Template (Sample Post Product)' },
  { id: 3, num: '03', date: 'Mar 16', category: 'Fitness', title: '14 Things Your Boss Expects You Know About Weight Loss Success Stories' },
  { id: 4, num: '04', date: 'Mar 13', category: 'Activities', title: 'An Expert Interview About Honeymoon Packages' },
  { id: 5, num: '05', date: 'Mar 13', category: 'Flights', title: 'Why Flight Scanners Are Killing You' }
]

const labels = [
  { name: 'Accessory', count: 1 },
  { name: 'Activities', count: 1 },
  { name: 'Adventure', count: 1 },
  { name: 'Analysis', count: 1 },
  { name: 'Country', count: 1 },
  { name: 'Cruises', count: 1 },
  { name: 'Decor', count: 1 },
  { name: 'Design', count: 1 }
]
</script>

<template>
  <div>
    <!-- Popular Posts widget (.itemP.popular) -->
    <div class="widget mb-[var(--content-space)]">
      <h3 class="widget-title text-[15px] font-medium leading-[1.4] text-slate-200">Popular Posts</h3>

      <div class="itemP popular flex flex-col gap-[16px]">
        <!-- Item #1: Featured with thumbnail -->
        <article class="most flex flex-col gap-[16px]">
          <!-- Thumbnail: TRÀN VIỀN 16:9 OBJECT-COVER -->
          <div class="pI relative overflow-hidden rounded-[var(--content-bd-radius)] bg-[var(--color-bg-alt)]">
            <a class="thumbnail block relative pt-[var(--thumbnail-ratio)]">
              <img 
                :src="popularPosts[0].image" 
                :alt="popularPosts[0].title"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </a>
            <!-- Badges: BOOKMARK ICON TRÒN & COMMENT COUNT -->
            <div class="bar flex flex-row-reverse justify-end items-center absolute top-2 right-2 gap-[6px] text-[0.76em]">
              <button 
                class="flex items-center justify-center w-7 h-7 rounded-full text-[#0e2045] bg-[#fffdfc] shadow-[0_2px_8px_rgba(0,0,0,0.15)] border-0 cursor-pointer"
                title="Bookmark post"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5zM12 8v4m-2-2h4"/></svg>
              </button>
              <span class="flex items-center gap-[3px] px-[8px] py-[4px] rounded-[12px] text-[#0e2045] bg-[#fffdfc] shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-normal">
                <span class="opacity-80">{{ popularPosts[0].comments }}</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </span>
            </div>
          </div>

          <!-- Counter + Content -->
          <div class="pC flex gap-0">
            <span class="flex-shrink-0 opacity-60 w-[26px] font-bold text-[14px] font-[var(--font-body-alt)] text-slate-400">
              {{ popularPosts[0].num }}
            </span>
            <div class="pB flex-grow w-[calc(100%-26px)]">
              <div class="pH info flex items-baseline justify-start mb-0.5 text-[11px] text-slate-400">
                <span>{{ popularPosts[0].date }}</span>
                <span class="mx-1">·</span>
                <span class="text-[var(--color-primary)]">{{ popularPosts[0].category }}</span>
              </div>
              <div class="pT">
                <h2 class="name m-0 font-normal text-[16.8px] leading-[1.3] text-slate-100">
                  <a href="#" class="clamp line-clamp-2 hover:underline">{{ popularPosts[0].title }}</a>
                </h2>
              </div>
              <div class="pS my-1">
                <p class="snippet text-[12px] text-slate-400 leading-[1.4] line-clamp-2 opacity-80">
                  {{ popularPosts[0].snippet }}
                </p>
              </div>
            </div>
          </div>
        </article>

        <!-- Items #2-#5 -->
        <article 
          v-for="post in popularPosts.slice(1)" 
          :key="post.id"
        >
          <div class="pC flex gap-0">
            <span class="flex-shrink-0 opacity-60 w-[26px] font-bold text-[14px] font-[var(--font-body-alt)] text-slate-400">
              {{ post.num }}
            </span>
            <div class="pB flex-grow w-[calc(100%-26px)]">
              <div class="pH info flex items-baseline justify-start mb-0.5 text-[11px] text-slate-400">
                <span>{{ post.date }}</span>
                <span class="mx-1">·</span>
                <span class="text-[var(--color-primary)]">{{ post.category }}</span>
              </div>
              <div class="pT">
                <h2 class="name m-0 font-normal text-[16.8px] leading-[1.3] text-slate-100">
                  <a href="#" class="clamp line-clamp-2 hover:underline">{{ post.title }}</a>
                </h2>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Labels widget (.itemL) -->
    <div class="widget mb-[var(--content-space)]">
      <h3 class="widget-title text-[15px] font-medium leading-[1.4] text-slate-200">Labels</h3>

      <div class="itemL">
        <div class="lab list flex flex-wrap gap-[8px]">
          <a 
            v-for="lbl in labels" 
            :key="lbl.name"
            href="#"
            class="link flex items-center gap-1.5 w-[calc(50%-4px)] p-2 border border-[var(--color-bg-sec)] rounded-[var(--content-bd-radius)] bg-[var(--color-bg-sec)] text-[12px] text-inherit hover:border-[var(--color-primary)] transition-all"
          >
            <span class="flex-1 truncate">{{ lbl.name }}</span>
            <span class="count inline-flex items-center gap-1 flex-shrink-0 text-slate-400 text-[11px]">
              <span>{{ lbl.count }}</span>
              <svg class="w-3 h-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </span>
          </a>
        </div>

        <label class="flex items-center gap-1 mt-2 py-1.5 cursor-pointer">
          <span class="text-[var(--color-primary)] text-[12px]">Show all</span>
          <span class="text-[11px] text-slate-500">(+25)</span>
        </label>
      </div>
    </div>

    <!-- Ad slot in sidebar -->
    <div class="mb-[var(--content-space)] text-center text-[11px] text-slate-500 py-2 opacity-60">
      Ads go here
    </div>

    <!-- Footer links -->
    <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 opacity-80">
      <a href="#" class="hover:underline">Term</a>
      <span>·</span>
      <a href="#" class="hover:underline">Disclaimer</a>
      <span>·</span>
      <a href="#" class="hover:underline">Privacy</a>
      <span>·</span>
      <a href="#" class="hover:underline">Faq</a>
    </div>
  </div>
</template>
