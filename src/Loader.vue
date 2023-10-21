<style scoped>
.loader {
    width: 60px;
    height: 60px;
    border: 8px solid #FFF;
    border-bottom-color: #FF3D00;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: absolute;
    top: 45%;
    left: 45%;
    z-index:9999
}


@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>

<template>
    <span v-if="store.state.isRequest" class="loader"></span>
</template>


<script setup>

import { useStore } from 'vuex'

const store = useStore();



</script>