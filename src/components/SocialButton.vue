<template>
  <div class="button">
    <div class="icon">
      <font-awesome-icon
        :icon="['fab', nameSocial]"
        size="2x"
        :style="{ color: '#ededed' }"
      />
    </div>
    <div class="point"></div>
    <div class="text">{{ nameSocial }}</div>
  </div>
</template>

<script>
export default {
  name: "SocialButton",
  props: {
    nameSocial: String,
  },
};
</script>

<style scoped>
.button {
  display: flex;
  margin: 1.5rem 1.5rem 1.5rem 0;
  position: relative;
  border: 1px solid #dedede;
  border-radius: 10px;
  overflow: hidden;
  background: #ededed;
  width: 155px;
  height: 50px;
}

/* .button:last-of-type {
  margin-right: 0;
} */

.button:hover {
  cursor: pointer;
  box-shadow: 0 0 0 2px #dedede;
}

.icon {
  width: 50px;
  background: #585858;
  padding: 0.5rem;
  z-index: 1;
}

font-awesome-icon {
  z-index: 10;
}

.point {
  border-radius: 5px;
  position: absolute;
  top: 13px;
  right: 102px;
  background: #585858;
  width: 25px;
  height: 25px;
  transform: rotate(45deg);
}

.text {
  padding-left: 0.5rem;
  display: grid;
  place-items: center;
  width: 100%;
  font-weight: bold;
  color: #585858;
}
</style>