<template>
      <div  v-if="visible" class="popup" @click.self="close">
          <div class="popupContent">

            <div class="Pop_Up_Header_Box">
                <div>
                    <h2 id="Pop_Up_Title" class="Pop_Up_Title">{{ title }}</h2>
                </div>
                <span class="closeButton" @click="close">&times;</span>
            </div>

            <div id="Main_Pop_Up_Content">
                {{ message }}
                    <div class="popupActions">
                       <slot name="actions"></slot>
                    </div>
            </div>

          </div>
      </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    message: String
  },
  methods: {
    close(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close');
      }
    }
  }
}
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1005;
}


.Pop_Up_Header_Box{
display: flex;
justify-content: space-between;
align-items: center;

}

.Pop_Up_Title{
font-size: var(--font-size-medium);
font-weight: 600;
}


.closeButton {
font-size: 30px;
cursor: pointer;
width: 33px;
height: 33px;
text-align: center;
display: flex;
justify-content: center;
align-items: center;
border-radius: 50%;
color: var(--contrast);
background-color: var(--base-200);

}


.popupContent {
  background-color: var(--base-100);
  padding: 20px;
  border-radius: var(--border-radius-main-2x);
  width: 300px;
  box-shadow: var(--box-shadow-1);
  position: relative;
}

#Main_Pop_Up_Content, .popupActions{
   margin-top: var(--spacing-main-half);
}


</style>