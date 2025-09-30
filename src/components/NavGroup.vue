<template>
  <NavButton label="Dashboard FAD" :to="'/dashboard-fad'" :replace="true" />
  <NavButton label="View All" :to="'/all'" :replace="true" />
  <NavButton label="Open" :to="'/open'" :replace="true" />
  <NavButton label="On Progress" :to="'/onprogress'" :replace="true" />
  <NavButton label="Hold" :to="'/hold'" :replace="true" />
  <NavButton label="Closed" :to="'/closed'" :replace="true" />
</template>
<script setup>
import NavButton from './NavButton.vue'
</script>
