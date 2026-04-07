<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" class="text-right">
        <v-btn 
          color="#7F1D25" 
          variant="flat"
          @click="openDialog()"
          prepend-icon="mdi-plus"
        >
          Nueva Categoría
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-responsive>
          <!-- Desktop: Tabla normal -->
          <v-data-table
            v-if="!isMobile"
            :headers="headers"
            :items="categorias"
            :loading="loading"
            class="elevation-1"
            hover
          >
            <template v-slot:item.descripcion="{ item }">
              <span style="color: #9F6162;">
                {{ item.descripcion || 'Sin descripción' }}
              </span>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                size="small"
                color="#9F6162"
                @click="editCategory(item)"
                class="mr-2"
              >
                <v-icon size="20">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="#63131C"
                @click="deleteCategory(item)"
              >
                <v-icon size="20">mdi-delete</v-icon>
              </v-btn>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon size="50" color="#CD9395">mdi-tag-off</v-icon>
                <div class="text-h6 mt-2" style="color: #9F6162;">No hay categorías registradas</div>
                <v-btn
                  class="mt-3"
                  color="#7F1D25"
                  variant="tonal"
                  @click="openDialog()"
                >
                  Agregar primera categoría
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- Mobile: Cards layout -->
          <div v-else class="d-flex flex-column ga-4">
            <v-card
              v-for="item in categorias"
              :key="item.id"
              class="rounded-lg"
              elevation="2"
            >
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar :color="getColorFromId(item.id)" size="40">
                    <v-icon color="white">mdi-tag</v-icon>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-menu location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn icon variant="text" v-bind="props">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="editCategory(item)">
                        <v-list-item-title>
                          <v-icon size="18" class="mr-2">mdi-pencil</v-icon>
                          Editar
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteCategory(item)">
                        <v-list-item-title class="text-error">
                          <v-icon size="18" class="mr-2" color="error">mdi-delete</v-icon>
                          Eliminar
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
                <v-card-title class="text-h6 font-weight-bold" style="color: #7F1D25;">
                  {{ item.nombre }}
                </v-card-title>
                <v-card-subtitle v-if="item.descripcion" class="mt-1">
                  {{ item.descripcion }}
                </v-card-subtitle>
                <v-card-subtitle v-else class="mt-1" style="color: #CD9395;">
                  Sin descripción
                </v-card-subtitle>
              </v-card-item>
            </v-card>

            <div v-if="categorias.length === 0 && !loading" class="text-center pa-8">
              <v-icon size="50" color="#CD9395">mdi-tag-off</v-icon>
              <div class="text-h6 mt-2" style="color: #9F6162;">No hay categorías registradas</div>
              <v-btn
                class="mt-3"
                color="#7F1D25"
                variant="tonal"
                @click="openDialog()"
              >
                Agregar primera categoría
              </v-btn>
            </div>
          </div>
        </v-responsive>
      </v-col>
    </v-row>

    <CategoriaForm 
      v-model:visible="dialogVisible"
      :categoria="selectedCategoria"
      @save="saveCategory"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { categoriasService } from '@/services/api'
import CategoriaForm from './CategoriaForm.vue'

const categorias = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const selectedCategoria = ref(null)
const isMobile = ref(false)

const headers = [
  { title: 'ID', key: 'id', width: '80px', align: 'center' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Acciones', key: 'actions', align: 'center', width: '120px' }
]

const getColorFromId = (id) => {
  const colors = ['#7F1D25', '#CD9395', '#9F6162', '#63131C']
  return colors[(id || 1) % colors.length]
}

const loadCategorias = async () => {
  loading.value = true
  try {
    const res = await categoriasService.getAll()
    categorias.value = res.data
  } catch (error) {
    console.error('Error cargando categorías:', error)
    alert('Error al cargar las categorías. ¿El backend está corriendo?')
  } finally {
    loading.value = false
  }
}

const openDialog = (categoria = null) => {
  selectedCategoria.value = categoria
  dialogVisible.value = true
}

const editCategory = (categoria) => {
  openDialog({ ...categoria })
}

const saveCategory = async (categoriaData) => {
  try {
    if (categoriaData.id) {
      await categoriasService.update(categoriaData.id, categoriaData)
      alert('Categoría actualizada exitosamente')
    } else {
      await categoriasService.create(categoriaData)
      alert('Categoría creada exitosamente')
    }
    await loadCategorias()
    dialogVisible.value = false
    window.dispatchEvent(new CustomEvent('refresh-inventario'))
  } catch (error) {
    console.error('Error guardando categoría:', error)
    alert('Error al guardar la categoría')
  }
}

const deleteCategory = async (categoria) => {
  if (confirm(`¿Eliminar categoría "${categoria.nombre}"?`)) {
    try {
      await categoriasService.delete(categoria.id)
      alert('Categoría eliminada exitosamente')
      await loadCategorias()
      window.dispatchEvent(new CustomEvent('refresh-inventario'))
    } catch (error) {
      console.error('Error eliminando categoría:', error)
      alert('Error al eliminar la categoría')
    }
  }
}

// Detectar si es móvil
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  loadCategorias()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.v-data-table :deep(.v-data-table-header__content) {
  color: #7F1D25;
  font-weight: bold;
}

@media (max-width: 768px) {
  .v-container {
    padding: 12px !important;
  }
}
</style>