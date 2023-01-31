<template>
  <div class="">
    <div class="">
    <n-card class="" title="Tests">
     TEST {{  - $route.params.tId  }}
     <n-button @click="navigateTo(`/test`)" type ="info">Go back to to all tests</n-button>
    </n-card>

    </div>
  </div>
</template>

<script setup>
import { NCard,NButton} from 'naive-ui'

</script>