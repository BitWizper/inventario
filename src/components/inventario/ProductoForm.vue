<template>
  <v-dialog 
    :model-value="visible" 
    @update:model-value="$emit('update:visible', $event)"
    max-width="600px" 
    persistent
  >
    <v-card>
      <v-card-title class="py-3" style="background-color: #7F1D25; color: white;">
        <span class="text-h6">{{ isEdit ? 'Editar' : 'Nuevo' }} Producto</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" color="white" @click="$emit('update:visible', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col :cols="12" :md="12">
              <v-text-field
                v-model="formData.nombre"
                label="Nombre del producto*"
                :rules="[v => !!v || 'El nombre es requerido']"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.descripcion"
                label="Descripción"
                rows="2"
                variant="outlined"
                density="comfortable"
              ></v-textarea>
            </v-col>

            <v-col :cols="12" :md="6">
              <v-select
                v-model="formData.categoria_id"
                label="Categoría*"
                :items="categorias"
                item-title="nombre"
                item-value="id"
                :rules="[v => !!v || 'La categoría es requerida']"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col :cols="12" :md="6">
              <v-select
                v-model="formData.talla"
                label="Talla*"
                :items="tallas"
                :rules="[v => !!v || 'La talla es requerida']"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col :cols="12" :md="6">
              <v-text-field
                v-model="formData.color"
                label="Color"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col :cols="12" :md="6">
              <v-text-field
                v-model="formData.stock"
                label="Stock*"
                type="number"
                :rules="[v => v !== undefined && v !== null || 'El stock es requerido', 
                         v => v >= 0 || 'Stock inválido']"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.precio"
                label="Precio*"
                type="number"
                step="0.01"
                prefix="$"
                :rules="[v => !!v || 'El precio es requerido', 
                         v => v > 0 || 'Precio inválido']"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
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
  producto: Object,
  categorias: Array
})

const emit = defineEmits(['update:visible', 'save'])

const valid = ref(false)
const form = ref(null)
const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const formData = ref({
  nombre: '',
  descripcion: '',
  precio: null,
  talla: '',
  color: '',
  stock: null,
  categoria_id: null
})

const isEdit = computed(() => !!props.producto?.id)

watch(() => props.visible, (newVal) => {
  if (newVal && props.producto) {
    // Asegurar que categoria_id se mapee correctamente
    formData.value = { 
      ...props.producto,
      categoria_id: props.producto.categoria_id || props.producto.categoriaId || null
    }
  } else if (newVal && !props.producto) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    nombre: '',
    descripcion: '',
    precio: null,
    talla: '',
    color: '',
    stock: null,
    categoria_id: null
  }
  if (form.value) {
    form.value.resetValidation()
  }
}

const save = async () => {
  const { valid: isValid } = await form.value.validate()
  if (isValid) {
    // Asegurar que enviamos los datos correctamente
    const dataToSave = {
      ...formData.value,
      categoria_id: formData.value.categoria_id
    }
    emit('save', dataToSave)
  }
}
</script>