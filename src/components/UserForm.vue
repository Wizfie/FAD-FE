<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Username -->
      <div class="sm:col-span-2">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Username *
        </label>
        <input
          v-model.trim="form.username"
          type="text"
          required
          class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <!-- Email -->
      <div class="sm:col-span-2">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Email
        </label>
        <input
          v-model.trim="form.email"
          type="email"
          class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <!-- Role -->
      <div :class="editing ? '' : 'sm:col-span-2'">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Role *
        </label>
        <select
          v-model="form.role"
          required
          @change="handleRoleChange"
          class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">Select Role</option>
          <option v-for="role in ROLES" :key="role.value" :value="role.value">
            {{ role.label }}
          </option>
        </select>
        <p v-if="selectedRole" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {{ selectedRole.description }}
        </p>
      </div>

      <!-- Status (only for editing) -->
      <div v-if="editing">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Status *
        </label>
        <div class="flex flex-wrap items-center gap-4">
          <label class="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="radio"
              value="ACTIVE"
              v-model="form.status"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Active
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="radio"
              value="INACTIVE"
              v-model="form.status"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Inactive
          </label>
        </div>
      </div>

      <!-- Module Selection (only if not Super Admin) -->
      <div v-if="showModuleSelection" class="sm:col-span-2">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Access Modules *
        </label>
        <div
          class="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-800"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              v-for="module in MODULES"
              :key="module.value"
              class="flex items-start gap-3 rounded-lg border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 transition-colors"
              :class="{
                'bg-slate-50 dark:bg-slate-700/50': selectedModules.includes(module.value),
              }"
            >
              <input
                type="checkbox"
                :value="module.value"
                v-model="selectedModules"
                class="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div class="flex-1">
                <div class="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {{ module.label }}
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400">
                  {{ module.description }}
                </div>
              </div>
            </label>
          </div>
        </div>
        <p v-if="moduleError" class="mt-1 text-xs text-red-600 dark:text-red-400">
          {{ moduleError }}
        </p>
        <p v-else class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Select at least one module for users
        </p>
      </div>

      <!-- Password -->
      <div class="sm:col-span-2">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          {{ editing ? 'Password' : 'Password *' }}
        </label>
        <input
          v-model.trim="form.password"
          type="password"
          :required="!editing"
          minlength="6"
          class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <p v-if="editing" class="mt-1 text-xs text-slate-500">
          Leave blank to keep current password
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2 pt-2">
      <BaseButton variant="secondary" type="button" @click="$emit('cancel')"> Cancel </BaseButton>
      <BaseButton variant="primary" type="submit" :loading="loading"> Save </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BaseButton from './BaseButton.vue'
import { ROLES, MODULES, requiresModuleSelection, getRoleConfig } from '@/constants/permissions'

const props = defineProps({
  form: { type: Object, required: true },
  editing: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const selectedModules = ref([])
const moduleError = ref('')

// Computed properties
const selectedRole = computed(() => getRoleConfig(props.form.role))

const showModuleSelection = computed(() => {
  return props.form.role && requiresModuleSelection(props.form.role)
})

// Watch for role changes
const handleRoleChange = () => {
  moduleError.value = ''

  // Clear modules if Super Admin
  if (!requiresModuleSelection(props.form.role)) {
    selectedModules.value = []
    props.form.modules = []
  }
}

// Initialize modules from form
onMounted(() => {
  if (props.form.modules && Array.isArray(props.form.modules)) {
    selectedModules.value = [...props.form.modules]
  } else if (props.form.modules) {
    // Handle case where modules might be stored as JSON string
    try {
      const parsed =
        typeof props.form.modules === 'string' ? JSON.parse(props.form.modules) : props.form.modules
      selectedModules.value = Array.isArray(parsed) ? parsed : []
    } catch {
      selectedModules.value = []
    }
  }
})

// Watch selectedModules to update form
watch(selectedModules, (newModules) => {
  props.form.modules = newModules
  moduleError.value = ''
})

// Handle form submission with validation
const handleSubmit = () => {
  // Validate modules if required
  if (showModuleSelection.value && selectedModules.value.length === 0) {
    moduleError.value = 'Please select at least one module'
    return
  }

  // Update form.modules before submitting
  props.form.modules = selectedModules.value

  emit('submit')
}
</script>
