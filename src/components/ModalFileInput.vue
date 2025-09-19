<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-semibold mb-4">Upload File</h2>

      <form @submit.prevent="submitForm">
        <!-- File Input -->
        <div class="mb-4">
          <label for="file" class="block text-sm font-medium">Pilih File</label>
          <input
            type="file"
            id="file"
            ref="fileInput"
            class="w-full border rounded px-3 py-2"
            @change="handleFileChange"
          />
        </div>

        <!-- Area Selection -->
        <div class="mb-4">
          <label for="area" class="block text-sm font-medium">Pilih Area</label>
          <select v-model="selectedArea" id="area" class="w-full border rounded px-3 py-2">
            <option value="" disabled>Pilih Area</option>
            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.name }}
            </option>
          </select>
        </div>

        <!-- New Area Input -->
        <div class="mb-4">
          <label class="block text-sm font-medium">Input Area Baru</label>
          <div class="flex items-center gap-2">
            <input
              v-if="isNewArea"
              type="text"
              v-model="newArea"
              placeholder="Masukkan nama area baru"
              class="w-full border rounded px-3 py-2"
            />
            <button type="button" class="text-blue-500 text-sm" @click="toggleNewAreaInput">
              {{ isNewArea ? 'Batal' : 'Tambah Area Baru' }}
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            class="bg-gray-500 text-white px-4 py-2 rounded"
            @click="closeModal"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="!file || (!selectedArea && !newArea)"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  areas: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'submit'])

const file = ref(null)
const selectedArea = ref('')
const newArea = ref('')
const isNewArea = ref(false)

// Toggle New Area Input
function toggleNewAreaInput() {
  isNewArea.value = !isNewArea.value
  if (!isNewArea.value) {
    newArea.value = ''
  }
}

// Handle File Selection
function handleFileChange(event) {
  file.value = event.target.files[0]
}

// Handle Form Submission
function submitForm() {
  const payload = {
    files: file.value,
    areaName: isNewArea.value ? newArea.value : selectedArea.value,
  }

  // Emit to parent with the file and selected area (or new area)
  emit('submit', payload)
  closeModal()
}

// Close Modal
function closeModal() {
  emit('close')
}
</script>

<style scoped>
/* Styling the modal overlay */
.fixed {
  z-index: 999;
}
</style>
