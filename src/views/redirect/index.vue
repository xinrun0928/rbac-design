<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const { params, query } = route
  const { path } = params
  router.replace({
    path: '/' + (Array.isArray(path) ? path.join('/') : path),
    query
  })
})
</script>
