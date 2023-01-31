<template>
 <n-layout-header class="u-bg-gray-700" bordered>
 <div class="u-flex u-items-center">
    <div class="u-py-5 u-text-white">
        <div class="">
            <n-button @click="$emit('menuChange')" quaternary color="#fff">
            <span class="i-carbon-text-indent u-text-xl"/>
            </n-button>
        </div>
    </div>
    <div class=" u-text-white">
      <div class="u-font-bold u-text-xl">Marengo Test Series</div>
    </div>
 </div>
 </n-layout-header>
</template>
<script setup>
import {NLayout,NLayoutHeader,NButton} from 'naive-ui'


</script>