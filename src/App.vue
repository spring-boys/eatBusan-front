<script setup lang="ts">
// 루트 레이아웃. Vuetify <v-app>으로 감싸고 라우터 뷰를 렌더한다.
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>eatBusan</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
