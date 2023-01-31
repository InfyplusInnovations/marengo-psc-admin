<template>
   <div class="u-overflow-y-hidden u-max-h-screen">
   <NuxtLayout >
      
             <n-config-provider :theme-overrides="themeOverrides">
                <n-message-provider>
                    <n-notification-provider>
                   <n-loading-bar-provider>

                   <n-dialog-provider>
 
   
  
      <NuxtPage />
  
   

                   </n-dialog-provider>

  
      </n-loading-bar-provider>
      </n-notification-provider>
                </n-message-provider>

             </n-config-provider>
     
    </NuxtLayout>
  </div>
</template>

<script setup>
import {NNotificationProvider,NConfigProvider,NMessageProvider,NLoadingBarProvider,NDialogProvider} from 'naive-ui'

  const themeOverrides = {

  common: {
    primaryColor: "#0E1C15FF",
    primaryColorHover: "#9BABA2FF",
    primaryColorPressed:"#9BABA2FF"
  },
  Button: {
    textColorPrimary: "#FFFFFFFF",
    textColorHoverPrimary: "#140808FF",
    textColorPressedPrimary:"#140808FF",
    textColorFocusPrimary:"#140808FF"
  }
 
  }
</script>