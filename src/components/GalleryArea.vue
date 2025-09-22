<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/stores/axios'
import GroupCompare from './GroupCompare.vue'

const route = useRoute()
const router = useRouter()
const areaId = computed(() => route.params.id)
const areaName = computed(() => route.query.area)

console.log('Area ID:', areaId.value)
console.log('Area Name:', areaName.value)

// state
const photos = ref([])
const total = ref(0)
const loading = ref(false)
const errorMsg = ref('')

// filter state
const period = ref('week') // 'day' | 'week' | 'month'
const anchor = ref(new Date()) // acuan tanggal
const page = ref(1)
const pageSize = ref(48)
// category filter and optional selected comparison group
const category = ref('') // '', 'before','action','after'
const selectedGroup = ref('')

// utils tanggal
function addDays(d, n) {
  const z = new Date(d)
  z.setDate(z.getDate() + n)
  return z
}
function startOfWeekMonday(d) {
  const z = new Date(d)
  const dow = z.getDay() || 7
  return addDays(z, -(dow - 1))
}
function endOfWeekMonday(d) {
  return addDays(startOfWeekMonday(d), 6)
}
function toISO(d) {
  const z = new Date(d)
  const yyyy = z.getFullYear()
  const mm = String(z.getMonth() + 1).padStart(2, '0')
  const dd = String(z.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
function fmtDT(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return isNaN(d) ? '-' : d.toLocaleString()
}

// month & weeks
const month = ref(anchor.value.getMonth())
const year = ref(anchor.value.getFullYear())
const groups = ref([])
const showGroupCompare = ref(false)
const currentGroup = ref(null)

function startOfMonth(y, m) {
  return new Date(y, m, 1)
}
function endOfMonth(y, m) {
  return new Date(y, m + 1, 0)
}
function weeksInMonth(y, m) {
  const first = startOfMonth(y, m)
  const last = endOfMonth(y, m)
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

// label rentang aktif
const rangeLabel = computed(() => {
  if (period.value === 'day') {
    return new Date(anchor.value).toLocaleDateString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }
  if (period.value === 'week') {
    const s = startOfWeekMonday(anchor.value)
    const e = endOfWeekMonday(anchor.value)
    const f = (d) =>
      d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    return `${f(s)} – ${f(e)}`
  }
  return new Date(anchor.value).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

// load data
async function load(resetPage = true) {
  loading.value = true
  errorMsg.value = ''
  try {
    if (resetPage) page.value = 1
    const { data } = await api.get('/api/photos', {
      params: {
        areaId: areaId.value,
        period: period.value,
        date: toISO(anchor.value),
        category: category.value || undefined,
        comparisonGroupId: selectedGroup.value || undefined,
        page: page.value,
        pageSize: pageSize.value,
      },
    })
    photos.value = data.items ?? data.data?.items ?? []
    total.value = data.total ?? data.data?.total ?? 0
  } catch (e) {
    console.error(e)
    errorMsg.value = e?.message || 'Gagal memuat foto'
  } finally {
    loading.value = false
  }
}

// actions
async function removePhoto(id) {
  if (!confirm('Hapus foto ini?')) return
  await api.delete(`api/photos/${id}`)
  photos.value = photos.value.filter((x) => x.id !== id)
  total.value = Math.max(0, total.value - 1)
}

// watchers
watch([period, () => areaId.value, category, selectedGroup], () => load(true))
watch([month, year], () => {
  anchor.value = startOfMonth(year.value, month.value)
  load(true)
})

// init
onMounted(() => {
  month.value = anchor.value.getMonth()
  year.value = anchor.value.getFullYear()
  load(true)
  loadGroups()
})

async function loadGroups() {
  try {
    const { data } = await api.get('/api/comparison-groups', { params: { areaId: areaId.value } })
    groups.value = data.items ?? data.data?.items ?? data
  } catch (e) {
    console.warn('Failed load groups', e)
  }
}

async function fetchGroup(id) {
  try {
    const { data } = await api.get(`/api/comparison-groups/${id}`)
    currentGroup.value = data
    showGroupCompare.value = true
  } catch (e) {
    console.error('failed fetch group', e)
  }
}

// helpers UI
function pickWeek(w) {
  anchor.value = w.start
  load(true)
}
function isActiveWeek(w) {
  const s = startOfWeekMonday(anchor.value)
  return s >= w.start && s <= w.end
}

function categoryLabel(cat) {
  if (!cat) return ''
  const v = String(cat).toLowerCase()
  if (v === 'before') return 'Sebelum'
  if (v === 'action') return 'Aksi'
  if (v === 'after') return 'Sesudah'
  return cat
}

// pagination
const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value * pageSize.value < total.value)
async function prevPage() {
  if (!canPrev.value) return
  page.value--
  await load(false)
}
async function nextPage() {
  if (!canNext.value) return
  page.value++
  await load(false)
}
</script>

<template>
  <section class="p-4 space-y-4">
    <header class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          <button class="border rounded px-2 py-1 text-sm" @click="router.back()">← Kembali</button>
          <h2 class="text-xl font-semibold">Galeri Area #{{ areaName }}</h2>
        </div>
        <div class="text-sm text-gray-600">{{ rangeLabel }} • {{ total }} foto</div>
      </div>

      <!-- Controls -->
      <div class="flex flex-wrap items-center gap-2">
        <select v-model="period" class="border rounded px-2 py-1 text-sm">
          <!-- <option value="day">Per Hari</option> -->
          <option value="week">Per Minggu</option>
          <option value="month">Per Bulan</option>
        </select>

        <!-- Day picker -->
        <!-- <input
          v-if="period === 'day'"
          type="date"
          class="border rounded px-2 py-1 text-sm"
          :value="toISO(anchor)"
          @change="
            (e) => {
              anchor.value = new Date(e.target.value)
              console.log('Anchor updated to:', anchor.value)

              load(true)
            }
          "
        /> -->

        <!-- Month + week chips -->
        <template v-if="period !== 'day'">
          <!-- Filter kategori -->
          <div class="flex items-center gap-2">
            <button
              @click="category = ''"
              :class="category === '' ? 'bg-black text-white' : ''"
              class="border px-2 py-1 text-sm rounded"
            >
              Semua
            </button>
            <button
              @click="category = 'before'"
              :class="category === 'before' ? 'bg-black text-white' : ''"
              class="border px-2 py-1 text-sm rounded"
            >
              Sebelum
            </button>
            <button
              @click="category = 'action'"
              :class="category === 'action' ? 'bg-black text-white' : ''"
              class="border px-2 py-1 text-sm rounded"
            >
              Aksi
            </button>
            <button
              @click="category = 'after'"
              :class="category === 'after' ? 'bg-black text-white' : ''"
              class="border px-2 py-1 text-sm rounded"
            >
              Sesudah
            </button>
          </div>

          <!-- Selector grup (memuat grup) -->
          <select v-model.number="selectedGroup" class="border rounded px-2 py-1 text-sm">
            <option value="">(Semua grup)</option>
            <option v-for="g in groups" :key="g.id" :value="g.id">
              {{ g.title || 'Group ' + g.id }}
            </option>
          </select>
          <button
            v-if="selectedGroup"
            class="border px-3 py-1 rounded text-sm"
            @click="fetchGroup(selectedGroup)"
          >
            Bandingkan
          </button>
          <!-- group chips quick access -->
          <div class="flex gap-2 ml-2">
            <template v-for="g in groups" :key="g.id">
              <button class="border px-2 py-1 rounded text-xs" @click="fetchGroup(g.id)">
                {{ g.title || 'Grup ' + g.id }}
                <span class="text-gray-500">({{ g._count?.photos || g.photoCount || '-' }})</span>
              </button>
            </template>
          </div>
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

          <!-- Pilihan minggu untuk period=week -->
          <div v-if="period === 'week'" class="flex flex-wrap gap-2">
            <button
              v-for="w in weeks"
              :key="w.idx"
              class="px-2.5 py-1 rounded-full text-sm border"
              :class="
                isActiveWeek(w) ? 'bg-black text-white border-black' : 'bg-white text-gray-700'
              "
              @click="pickWeek(w)"
            >
              {{ w.idx }}
            </button>
          </div>
        </template>
      </div>
    </header>

    <div v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat foto…</div>

    <div v-else-if="photos.length === 0" class="text-sm text-gray-500">
      Tidak ada foto untuk rentang ini.
    </div>

    <!-- Grid -->
    <div v-else class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="p in photos" :key="p.id" class="border rounded overflow-hidden">
        <a :href="p.url" target="_blank">
          <img
            :src="p.thumbUrl || p.url"
            :alt="p.originalName"
            class="w-full h-44 object-cover"
            loading="lazy"
            @error="
              (e) => {
                if (p.url && e.target.src !== p.url) e.target.src = p.url
              }
            "
          />
        </a>
        <div class="p-2 text-xs text-gray-600">
          <div>{{ p.area?.name || '—' }}</div>
          <div>{{ categoryLabel(p.category) }} • {{ fmtDT(p.takenAt || p.createdAt) }}</div>
          <div v-if="p.keterangan" class="text-gray-700 mt-1">{{ p.keterangan }}</div>
        </div>
        <div class="p-2 pt-0 flex justify-end">
          <button class="text-red-600 text-xs border px-2 py-1 rounded" @click="removePhoto(p.id)">
            hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-center gap-2" v-if="total > pageSize">
      <button class="border px-3 py-1 rounded text-sm" :disabled="!canPrev" @click="prevPage">
        Prev
      </button>
      <div class="text-sm">Hal {{ page }} / {{ Math.max(1, Math.ceil(total / pageSize)) }}</div>
      <button class="border px-3 py-1 rounded text-sm" :disabled="!canNext" @click="nextPage">
        Next
      </button>
    </div>
  </section>
  <div
    v-if="showGroupCompare"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-6xl rounded p-4">
      <GroupCompare
        :group="currentGroup"
        @close="showGroupCompare = false"
        @add="
          (g) => {
            router.push({
              name: 'gallery-area',
              params: { id: g.areaId },
              query: { area: g.area?.name },
            })
            showGroupCompare = false
          }
        "
      />
    </div>
  </div>
</template>
