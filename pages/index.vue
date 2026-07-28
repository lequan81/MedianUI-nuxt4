<script setup lang="ts">
import { ref } from 'vue'

const currentSlide = ref(3)
const totalSlides = 4

const pinnedPosts = [
  {
    id: 1,
    title: 'The 6 Worst Interior Design Jobs In History',
    snippet: 'How hollywood got apartment guides all wrong. The complete beginner\'s guide to interior design ideas. 17 ways living room decors could le...',
    category: 'Decor',
    date: '3 years ago',
    comments: 8,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  }
]

const allPosts = [
  {
    id: 2,
    title: 'Median UI - Blogger Template (Sample Post Product)',
    category: 'Product',
    date: '3 years ago',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    price: { original: 'Rp 150.000', sale: 'Rp 130.000' },
    discount: '-10%',
    isProduct: true
  },
  {
    id: 3,
    title: '14 Things Your Boss Expects You Know About Weight Loss Success Stories',
    snippet: 'What experts are saying about weight loss meal plans. 5 things your boss expects you know about travel vaccines. Will...',
    category: 'Fitness',
    date: '3 years ago',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'What Wikipedia Can\'t Tell You About Salon Services',
    snippet: 'The 5 worst plus size dresses in history. 18 ideas you can steal from makeup artists. 11 things your boss expects you know...',
    category: 'Fashion',
    date: '3 years ago',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: '11 Ways Role Play Scenarios Are Completely Overrated',
    snippet: 'If you read one article about star wars games read this one. 16 great articles about football games. How solitaire card...',
    category: 'Adventure',
    date: '3 years ago',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'An Expert Interview About Honeymoon Packages',
    snippet: 'How culture tips can help you live a better life. 11 great articles about cheap tickets. What the beatles could learn from cultur...',
    category: 'Activities',
    date: '3 years ago',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Why Flight Scanners Are Killing You',
    snippet: 'The unconventional guide to family trip ideas. The complete beginner\'s guide to trip ideas. Why vacation packages shoul...',
    category: 'Flights',
    date: '3 years ago',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=600&q=80'
  }
]
</script>

<template>
  <div>
    <!-- Carousel Slider widget (.slideB) -->
    <section class="section mb-(--content-space)">
      <div class="slideB rounded-(--slider-bd-radius) overflow-hidden">
        <div class="slider-box relative pt-(--slider-ratio) bg-[#e0e0e0] rounded-(--slider-bd-radius)">
          <span class="absolute inset-0 flex items-center justify-center text-[#4a4a4a] text-sm font-normal">
            Slider {{ currentSlide }}
          </span>
        </div>
      </div>

      <!-- slideI: ONLY 4 DOTS -->
      <div class="slideI flex items-center justify-center h-3 my-2">
        <div class="flex items-center gap-1.25">
          <button v-for="i in totalSlides" :key="i" @click="currentSlide = i" :class="[
            'h-1 rounded-full transition-all duration-200 border-0 p-0 cursor-pointer',
            currentSlide === i ? 'bg-primary w-3' : 'bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] w-1'
          ]" :aria-label="'Go to slide ' + i"></button>
        </div>
      </div>
    </section>

    <!-- Ad slot below slider -->
    <div class="mainAd text-center text-[11px] text-slate-500 py-2 mb-(--content-space) opacity-60">
      Ads go here
    </div>

    <!-- Pinned Post section -->
    <section class="section mb-(--content-space)">
      <div class="widget">
        <h3 class="widget-title text-[15px] font-medium leading-[1.4] text-slate-200">Pinned Post</h3>
      </div>

      <div class="blogP flex flex-wrap gap-5">
        <article v-for="post in pinnedPosts" :key="post.id"
          class="p flex flex-col sm:flex-row gap-4 w-full p-0 border-0 bg-transparent">
          <!-- Thumbnail: TRÀN VIỀN 16:9 OBJECT-COVER -->
          <div class="pI relative overflow-hidden rounded-(--content-bd-radius) bg-bg-alt w-full sm:w-70 shrink-0">
            <a class="thumbnail block relative pt-(--thumbnail-ratio)">
              <img :src="post.image" :alt="post.title" class="absolute inset-0 w-full h-full object-cover" />
            </a>
            <!-- Badges: BOOKMARK ICON TRÒN VỀ BÊN PHẢI NẠP Y HỆT DEMO GỐC -->
            <div
              class="bar flex flex-row-reverse justify-end items-center absolute top-2 right-2 gap-1.5 text-[0.76em]">
              <!-- Bookmark badge (Ribbon with + sign / bookmark icon) -->
              <button
                class="flex items-center justify-center w-7 h-7 rounded-full text-[#0e2045] bg-[#fffdfc] shadow-[0_2px_8px_rgba(0,0,0,0.15)] border-0 cursor-pointer"
                title="Bookmark post">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5zM12 8v4m-2-2h4" />
                </svg>
              </button>
              <!-- Comment count badge -->
              <span
                class="flex items-center gap-0.75 px-2 py-1 rounded-xl text-[#0e2045] bg-[#fffdfc] shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-normal">
                <span class="opacity-80">{{ post.comments }}</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Content: .pC -->
          <div class="pC flex-1 min-w-0 p-0">
            <div class="pH info flex items-baseline justify-start mb-1 text-[11px] text-slate-400">
              <span class="label"><span class="opacity-80">in </span><a href="#" class="hover:underline">{{
                post.category }}</a></span>
            </div>
            <div class="pT">
              <h2 class="name m-0 font-normal text-[16.8px] leading-[1.3] text-slate-100">
                <a href="#" class="clamp line-clamp-2 hover:underline">{{ post.title }}</a>
              </h2>
            </div>
            <div class="pS my-1">
              <p class="snippet text-[12px] text-slate-400 leading-normal line-clamp-2 opacity-80">
                {{ post.snippet }}
              </p>
            </div>
            <div class="text-[11px] text-slate-500 opacity-80">{{ post.date }}</div>
          </div>
        </article>
      </div>
    </section>

    <!-- Ad slot -->
    <div class="mainAd text-center text-[11px] text-slate-500 py-2 mb-(--content-space) opacity-60">
      Ads go here
    </div>

    <!-- All stories section -->
    <section class="section">
      <div class="widget">
        <h3 class="widget-title text-[15px] font-medium leading-[1.4] text-slate-200">All stories</h3>
      </div>

      <div class="blogP flex flex-wrap gap-[30px_20px]">
        <!-- article.p: 3-column grid -->
        <article v-for="post in allPosts" :key="post.id"
          class="p w-full sm:w-[calc(33.333%-14px)] p-0 border-0 bg-transparent">
          <!-- Thumbnail: TRÀN VIỀN 16:9 OBJECT-COVER -->
          <div class="pI relative overflow-hidden rounded-(--content-bd-radius) bg-bg-alt">
            <a class="thumbnail block relative pt-(--thumbnail-ratio)">
              <img :src="post.image" :alt="post.title" class="absolute inset-0 w-full h-full object-cover" />
            </a>
            <!-- Badges: Y HỆT DEMO GỐC (Tròn bên phải: Bookmark+, Tag Icon cho Product, và Discount Pill) -->
            <div
              class="bar flex flex-row-reverse justify-end items-center absolute top-2 right-2 gap-1.5 text-[0.76em]">
              <!-- Badge 1 (FAR RIGHT): Circle Bookmark Icon with Plus -->
              <button
                class="flex items-center justify-center w-7 h-7 rounded-full text-[#0e2045] bg-[#fffdfc] shadow-[0_2px_8px_rgba(0,0,0,0.15)] border-0 cursor-pointer"
                title="Bookmark post">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5zM12 8v4m-2-2h4" />
                </svg>
              </button>

              <!-- Badge 2 (MIDDLE for Product post): Circle Tag Icon -->
              <span v-if="post.isProduct"
                class="flex items-center justify-center w-7 h-7 rounded-full text-[#0e2045] bg-[#fffdfc] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </span>

              <!-- Badge 3 (LEFT for Product post): Yellow Discount Pill -->
              <span v-if="post.discount"
                class="flex items-center justify-center px-2 py-1 rounded-full text-[#0e2045] bg-[#fff6bf] shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-semibold text-[11px]">
                {{ post.discount }}
              </span>
            </div>
          </div>

          <!-- Content: .pC -->
          <div class="pC mt-2 p-0">
            <div class="pH info flex items-baseline justify-start mb-1 text-[11px] text-slate-400">
              <span class="label"><span class="opacity-80">in </span><a href="#" class="hover:underline">{{
                post.category }}</a></span>
            </div>
            <div class="pT">
              <!-- CHUẨN DEMO: h2.name > a.clamp MAX 2 LĨNH (line-clamp-2) -->
              <h2 class="name m-0 font-normal text-[16.8px] leading-[1.3] text-slate-100">
                <a href="#" class="clamp line-clamp-2 hover:underline">{{ post.title }}</a>
              </h2>
            </div>
            <div v-if="post.price" class="prices mt-1 leading-tight">
              <span class="line-through opacity-80 text-[11px] block">{{ post.price.original }}</span>
              <span class="text-primary font-semibold text-[13px] block">{{ post.price.sale }}</span>
            </div>
            <div v-if="post.snippet" class="pS my-1">
              <p class="snippet text-[12px] text-slate-400 leading-normal line-clamp-3 opacity-80">
                {{ post.snippet }}
              </p>
            </div>
            <div class="text-[11px] text-slate-500 opacity-80 mt-1">{{ post.date }}</div>
          </div>
        </article>
      </div>

      <!-- Load more posts button -->
      <div class="blogN flex justify-center mt-8">
        <button
          class="button px-4 py-2.5 rounded-(--button-bd-radius) text-white bg-primary hover:brightness-110 active:brightness-90 text-[13px] font-normal cursor-pointer border-0 transition-all">
          Load more posts
        </button>
      </div>
    </section>
  </div>
</template>
