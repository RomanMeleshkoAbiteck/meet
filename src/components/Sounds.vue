<template>
  <div id="Sounds">

     <audio id="ringtone" src="/src/sounds/incoming.mp3" loop></audio>
     <audio id="ringbacktone" src="/src/sounds/outgoing.mp3" loop></audio>
     <audio id="dtmfTone" src="/src/sounds/dtmf.mp3"></audio>
     <audio id="audioRemote"></audio>

  </div>
</template>

<script>
export default {
  name: "Sounds"
}
</script>

<style scoped>

</style>
