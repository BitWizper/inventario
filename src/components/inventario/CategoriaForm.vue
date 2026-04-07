<template>
  <v-dialog 
    :model-value="visible" 
    @update:model-value="$emit('update:visible', $event)"
    max-width="500px" 
    persistent
  >
    <v-card>
      <v-card-title class="py-3" style="background-color: #7F1D25; color: white;">
        <span class="text-h6">{{ isEdit ? 'Editar' : 'Nueva' }} Categoría</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" color="white" @click="$emit('update:visible', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="formData.nombre"
            label="Nombre de la categoría*"
            :rules="[v => !!v || 'El nombre es requerido']"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>
          
          <v-textarea
            v-model="formData.descripcion"
            label="Descripción"
            rows="3"
            variant="outlined"
            density="comfortable"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('update:visible', false)">
          Cancelar
        </v-btn>
        <v-btn variant="flat" @click="save" :disabled="!valid" color="#7F1D25">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  categoria: Object
})

const emit = defineEmits(['update:visible', 'save'])

const valid = ref(false)
const form = ref(null)

const formData = ref({
  nombre: '',
  descripcion: ''
})

const isEdit = computed(() => !!props.categoria?.id)

watch(() => props.visible, (newVal) => {
  if (newVal && props.categoria) {
    formData.value = { ...props.categoria }
  } else if (newVal && !props.categoria) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    nombre: '',
    descripcion: ''
  }
  if (form.value) {
    form.value.resetValidation()
  }
}

const save = async () => {
  const { valid: isValid } = await form.value.validate()
  if (isValid) {
    emit('save', formData.value)
  }
}
</script>