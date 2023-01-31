<template>
  <div class="u-p-3">
<img src="/img/horse.svg" alt="" class="u-w-10" v-if="collapsed==true">
<img src="/img/logo.svg" alt="" v-else class="u-px-3">
  </div>
</template>
<script setup>


defineProps({
    collapsed:Boolean
})
</script>