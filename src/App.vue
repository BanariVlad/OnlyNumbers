<template>
  <v-app>
    <v-text-field v-model="test" v-only-numbers="test"></v-text-field>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    test: ""
  })
};
</script>
