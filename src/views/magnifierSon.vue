<template>
  <div class="zoom-container">
    <img :src="imageUrl" @click="toggleZoom" ref="image" />
    <div v-if="isZoomed" class="zoom-view" ref="zoomView">
      <img :src="imageUrl" alt="Zoomed Image" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isZoomed: false
    };
  },
  methods: {
    toggleZoom() {
      this.isZoomed = !this.isZoomed;
    }
  }
};
</script>
