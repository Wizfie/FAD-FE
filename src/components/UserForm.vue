<template>
  <form @submit.prevent="$emit('submit')" class="space-y-4">
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
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Role *
        </label>
        <select
          v-model="form.role"
          required
          class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="EXTERNAL">External</option>
          <option value="INTERNAL">Internal</option>
          <option value="ADMIN">Admin</option>
        </select>
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
import BaseButton from './BaseButton.vue'

const props = defineProps({
  form: { type: Object, required: true },
  editing: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])
</script>
