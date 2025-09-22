<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/stores/axios.js'
import ModalFileInput from './ModalFileInput.vue'

const loading = ref(true)
const errorMsg = ref('')
const weekAnchor = ref(new Date()) // tanggal acuan minggu aktif
const cards = ref([])
const isModalOpen = ref(false)
const areas = ref([])

// ===== utils tanggal =====
function toISODate(d) {
  const z = new Date(d)
  const yyyy = z.getFullYear()
  const mm = String(z.getMonth() + 1).padStart(2, '0')
  const dd = String(z.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
function addDays(d, n) {
  const z = new Date(d)
  z.setDate(z.getDate() + n)
  return z
}
function startOfWeekMonday(d) {
  const z = new Date(d)
  const dow = z.getDay() || 7 // 1..7 (Sen=1)
  return addDays(z, -(dow - 1))
}
function endOfWeekMonday(d) {
  return addDays(startOfWeekMonday(d), 6)
}
function startOfMonth(y, m) {
  return new Date(y, m, 1)
} // m: 0..11
function endOfMonth(y, m) {
  return new Date(y, m + 1, 0)
}
function fmtDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return isNaN(d) ? '-' : d.toLocaleString()
}

// === picker bulan & tahun (default dari weekAnchor) ===
const month = ref(weekAnchor.value.getMonth()) // 0..11
const year = ref(weekAnchor.value.getFullYear())

// generate minggu dalam bulan (mulai Senin), label: 1..N
function weeksInMonth(y, m) {
  const first = startOfMonth(y, m)
  const last = endOfMonth(y, m)
  // cari Senin pertama yang <= hari pertama bulan
  let cur = startOfWeekMonday(first)
  const out = []
  let idx = 1
  while (cur <= last) {
    out.push({ idx, start: new Date(cur), end: endOfWeekMonday(cur) })
    cur = addDays(cur, 7)
    idx++
  }
  return out
}
const weeks = computed(() => weeksInMonth(year.value, month.value))

// label rentang minggu aktif
const weekLabel = computed(() => {
  const s = startOfWeekMonday(weekAnchor.value)
  const e = endOfWeekMonday(weekAnchor.value)
  const fmt = (d) =>
    d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
  return `${fmt(s)} – ${fmt(e)}`
})

// ketika bulan/tahun berubah → pilih minggu yang “mencakup” weekAnchor jika ada, jika tidak ambil Minggu #1
watch([month, year], () => {
  const list = weeks.value
  // kalau weekAnchor tidak berada di bulan yang dipilih, set ke minggu #1
  const inRange = list.find(
    (w) =>
      startOfWeekMonday(weekAnchor.value) >= w.start &&
      startOfWeekMonday(weekAnchor.value) <= w.end,
  )
  weekAnchor.value = inRange ? weekAnchor.value : list[0].start
  load()
})

// klik angka minggu
function pickWeek(w) {
  weekAnchor.value = w.start
  load()
}

// Function to open modal
function openModal() {
  isModalOpen.value = true
}

// Function to close modal
function closeModal() {
  isModalOpen.value = false
}

// ===== loader =====
async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data: areaRes } = await api.get('/api/areas')
    areas.value = areaRes.data ?? []

    const nowISO = toISODate(weekAnchor.value) // pakai Senin minggu aktif juga OK
    const prevISO = toISODate(addDays(weekAnchor.value, -7)) // minggu sebelumnya

    const promises = areas.value.map(async (a) => {
      const { data: weekRes } = await api.get('/api/photos', {
        params: { areaId: a.id, period: 'week', date: nowISO, page: 1, pageSize: 1 },
      })
      const total = weekRes.total ?? 0
      const latest = (weekRes.items && weekRes.items[0]) || null

      const { data: prevRes } = await api.get('/api/photos', {
        params: { areaId: a.id, period: 'week', date: prevISO, page: 1, pageSize: 1 },
      })
      const prevTotal = prevRes.total ?? 0
      const delta = total - prevTotal

      return {
        areaId: a.id,
        areaName: a.name,
        total,
        latestAt: latest ? latest.createdAt : null,
        thumbUrl: latest ? latest.thumbUrl || latest.url : null,
        url: latest ? latest.url : null,
        delta,
      }
    })

    cards.value = await Promise.all(promises)
  } catch (e) {
    console.error(e)
    errorMsg.value = e?.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(load)

// Handle submit from ModalFileInput
async function handleSubmit(formData) {
  try {
    // use axios instance imported as api
    const resp = await api.post('/api/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    // success => refresh
    isModalOpen.value = false
    await load()
    return resp.data
  } catch (e) {
    console.error('Upload failed', e)
    throw e
  }
}
</script>

<template>
  <section class="space-y-4 p-4">
    <!-- Header + picker -->
    <header class="space-y-3">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-semibold">Ringkasan Foto — Mingguan</h2>
          <span class="text-sm text-gray-600">({{ weekLabel }})</span>
        </div>

        <button class="px-3 py-1.5 rounded bg-black text-white text-sm" @click="load">
          Refresh
        </button>
        <div>
          <!-- Button untuk membuka modal -->
          <button @click="openModal">Tambah Foto</button>

          <!-- Modal Input File -->
          <ModalFileInput
            :isOpen="isModalOpen"
            :areas="areas"
            @close="closeModal"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- Picker bulan & tahun -->
      <div class="flex items-center gap-2">
        <select v-model.number="month" class="border rounded px-2 py-1 text-sm">
          <option v-for="m in 12" :key="m - 1" :value="m - 1">
            {{ new Date(2000, m - 1, 1).toLocaleString(undefined, { month: 'long' }) }}
          </option>
        </select>
        <select v-model.number="year" class="border rounded px-2 py-1 text-sm">
          <option v-for="y in 7" :key="y" :value="new Date().getFullYear() - 3 + y - 1">
            {{ new Date().getFullYear() - 3 + y - 1 }}
          </option>
        </select>
      </div>

      <!-- Baris angka minggu untuk bulan terpilih -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="w in weeks"
          :key="w.idx"
          class="px-2.5 py-1 rounded-full text-sm border"
          :class="
            startOfWeekMonday(weekAnchor) >= w.start && startOfWeekMonday(weekAnchor) <= w.end
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700'
          "
          @click="pickWeek(w)"
        >
          {{ w.idx }}
        </button>
      </div>
    </header>

    <!-- Body -->
    <div v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat ringkasan…</div>

    <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="c in cards" :key="c.areaId" class="border rounded-2xl overflow-hidden shadow-sm">
        <div class="p-4 pb-0">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ c.areaName }}</h3>
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="c.total > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              Minggu ini
            </span>
          </div>

          <div class="mt-1 text-3xl font-bold">{{ c.total }}</div>

          <div class="text-xs text-gray-600 mt-1 flex items-center gap-2">
            <span>Terakhir:</span>
            <span class="font-medium">{{ fmtDate(c.latestAt) }}</span>
            <span v-if="c.delta !== 0" :class="c.delta > 0 ? 'text-green-600' : 'text-red-600'">
              ({{ c.delta > 0 ? '+' : '' }}{{ c.delta }})
            </span>
          </div>
        </div>

        <div class="mt-3">
          <a v-if="c.thumbUrl" :href="c.url" target="_blank" class="block">
            <img
              :src="c.thumbUrl"
              alt="preview terbaru"
              class="w-full h-40 object-cover"
              loading="lazy"
              @error="
                (e) => {
                  if (c.url && e.target.src !== c.url) e.target.src = c.url
                }
              "
            />
          </a>
          <div
            v-else
            class="w-full h-40 flex items-center justify-center text-xs text-gray-400 bg-gray-50"
          >
            Belum ada foto minggu ini
          </div>
        </div>

        <div class="p-3 flex items-center justify-end gap-2">
          <router-link
            :to="{
              name: 'gallery-area',
              params: {
                id: c.areaId,
              },
              query: {
                area: c.areaName,
              },
            }"
            class="text-sm px-3 py-1.5 rounded border"
          >
            Lihat detail
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
