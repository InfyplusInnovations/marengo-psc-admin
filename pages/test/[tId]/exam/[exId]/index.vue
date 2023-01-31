<template>
    <div class="">
      <div class="">
      <n-card class="" title="Tests">
       Exam - {{  $route.params.exId  }}
       <n-button @click="navigateTo(`/test/${$route.params.tId}/exam`)" type ="info">Go back to to all exams</n-button>
      </n-card>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { NCard,NButton} from 'naive-ui'
  
  </script>