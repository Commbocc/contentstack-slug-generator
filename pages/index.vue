<script setup lang="ts">
const { generateSlug, isNewEntry } = useContentstackExtension()
</script>

<template>
  <div>
    <div class="grid">
      <button :disabled="isNewEntry" @click="generateSlug">Generate</button>
    </div>
    <small v-if="isNewEntry">Save entry before generating a slug.</small>
  </div>
</template>
