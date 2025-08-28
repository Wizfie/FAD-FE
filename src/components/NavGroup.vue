<template>
  <NavButton label="Dashboard" :to="'/'" :replace="true" />
  <NavButton label="View All" :to="'/all'" :replace="true" />
  <NavButton label="Open" :to="'/open'" :replace="true" />
  <NavButton label="On Progress" :to="'/onprogress'" :replace="true" />
  <NavButton label="Closed" :to="'/closed'" :replace="true" />
</template>
<script setup>
import NavButton from './NavButton.vue'
</script>
