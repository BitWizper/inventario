<template>
  <v-container fluid class="pa-4">
    <!-- Botón Agregar -->
    <v-row>
      <v-col cols="12" class="text-right">
        <v-btn 
          color="#7F1D25" 
          variant="flat"
          @click="openDialog()"
          prepend-icon="mdi-plus"
        >
          Nuevo Producto
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de Productos -->
    <v-row>
      <v-col cols="12">
        <!-- Barra de búsqueda responsive -->
        <v-text-field
          v-model="search"
          label="Buscar producto"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mb-4"
          style="background-color: white; border-radius: 8px;"
          clearable
        ></v-text-field>

        <!-- Tabla responsive - se convierte en cards en móvil -->
        <v-responsive>
          <!-- Desktop: Tabla normal -->
          <v-data-table
            v-if="!isMobile"
            :headers="headers"
            :items="filteredProductos"
            :loading="loading"
            :items-per-page="10"
            class="elevation-1"
            hover
          >
            <template v-slot:item.stock="{ item }">
              <v-chip 
                :color="getStockColor(item.stock)" 
                size="small"
              >
                {{ item.stock }} unidades
              </v-chip>
            </template>

            <template v-slot:item.precio="{ item }">
              <span class="font-weight-bold" style="color: #7F1D25;">
                ${{ formatPrice(item.precio) }}
              </span>
            </template>

            <template v-slot:item.categoria_nombre="{ item }">
              <v-chip size="small" style="background-color: #CD9395; color: white;">
                {{ getCategoriaNombre(item.categoria_id) }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                size="small"
                color="#9F6162"
                @click="editProduct(item)"
                class="mr-2"
              >
                <v-icon size="20">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="#63131C"
                @click="deleteProduct(item)"
              >
                <v-icon size="20">mdi-delete</v-icon>
              </v-btn>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon size="50" color="#CD9395">mdi-package-variant-closed</v-icon>
                <div class="text-h6 mt-2" style="color: #9F6162;">No hay productos registrados</div>
                <v-btn
                  class="mt-3"
                  color="#7F1D25"
                  variant="tonal"
                  @click="openDialog()"
                >
                  Agregar primer producto
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- Mobile: Cards layout -->
          <div v-else class="d-flex flex-column ga-4">
            <v-card
              v-for="item in filteredProductos"
              :key="item.id"
              class="rounded-lg"
              elevation="2"
            >
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar color="#7F1D25" size="40">
                    <v-icon color="white">mdi-package-variant</v-icon>
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
                      <v-list-item @click="editProduct(item)">
                        <v-list-item-title>
                          <v-icon size="18" class="mr-2">mdi-pencil</v-icon>
                          Editar
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteProduct(item)">
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
                <v-card-subtitle class="mt-1">
                  <v-chip size="x-small" style="background-color: #CD9395; color: white;">
                    {{ getCategoriaNombre(item.categoria_id) }}
                  </v-chip>
                </v-card-subtitle>
              </v-card-item>

              <v-divider></v-divider>

              <v-card-text class="pt-3">
                <v-row dense>
                  <v-col cols="6" class="py-0">
                    <div class="text-caption text-medium-emphasis">Stock</div>
                    <div class="text-body-2 font-weight-medium">
                      <v-chip :color="getStockColor(item.stock)" size="x-small">
                        {{ item.stock }} unidades
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <div class="text-caption text-medium-emphasis">Precio</div>
                    <div class="text-body-2 font-weight-bold" style="color: #7F1D25;">
                      ${{ formatPrice(item.precio) }}
                    </div>
                  </v-col>
                  <v-col cols="6" class="py-0" v-if="item.talla">
                    <div class="text-caption text-medium-emphasis">Talla</div>
                    <div class="text-body-2">{{ item.talla }}</div>
                  </v-col>
                  <v-col cols="6" class="py-0" v-if="item.color">
                    <div class="text-caption text-medium-emphasis">Color</div>
                    <div class="text-body-2">{{ item.color }}</div>
                  </v-col>
                </v-row>
                <div v-if="item.descripcion" class="mt-2">
                  <div class="text-caption text-medium-emphasis">Descripción</div>
                  <div class="text-body-2">{{ item.descripcion }}</div>
                </div>
              </v-card-text>
            </v-card>

            <div v-if="filteredProductos.length === 0 && !loading" class="text-center pa-8">
              <v-icon size="50" color="#CD9395">mdi-package-variant-closed</v-icon>
              <div class="text-h6 mt-2" style="color: #9F6162;">No hay productos registrados</div>
              <v-btn
                class="mt-3"
                color="#7F1D25"
                variant="tonal"
                @click="openDialog()"
              >
                Agregar primer producto
              </v-btn>
            </div>
          </div>
        </v-responsive>
      </v-col>
    </v-row>

    <!-- Diálogo para crear/editar producto -->
    <ProductoForm 
      v-model:visible="dialogVisible"
      :producto="selectedProduct"
      :categorias="categorias"
      @save="saveProduct"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { productosService, categoriasService } from '@/services/api'
import ProductoForm from './ProductoForm.vue'

const productos = ref([])
const categorias = ref([])
const loading = ref(false)
const search = ref('')
const dialogVisible = ref(false)
const selectedProduct = ref(null)
const isMobile = ref(false)

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '80px', align: 'center' },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Categoría', key: 'categoria_nombre', sortable: true },
  { title: 'Talla', key: 'talla', sortable: true, width: '100px', align: 'center' },
  { title: 'Color', key: 'color', sortable: true, width: '120px' },
  { title: 'Stock', key: 'stock', sortable: true, width: '120px', align: 'center' },
  { title: 'Precio', key: 'precio', sortable: true, width: '120px', align: 'right' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '120px', align: 'center' },
]

// Función para obtener el nombre de la categoría por ID
const getCategoriaNombre = (categoriaId) => {
  if (!categoriaId) return 'Sin categoría'
  const categoria = categorias.value.find(c => c.id === categoriaId)
  return categoria ? categoria.nombre : 'Sin categoría'
}

const filteredProductos = computed(() => {
  if (!search.value) return productos.value
  return productos.value.filter(p => 
    p.nombre.toLowerCase().includes(search.value.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const loadData = async () => {
  loading.value = true
  try {
    const [productosRes, categoriasRes] = await Promise.all([
      productosService.getAll(),
      categoriasService.getAll()
    ])
    productos.value = productosRes.data
    categorias.value = categoriasRes.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    alert('Error al cargar los datos. ¿El backend está corriendo?')
  } finally {
    loading.value = false
  }
}

const getStockColor = (stock) => {
  if (stock === 0) return '#63131C'
  if (stock < 10) return '#CD9395'
  return '#9F6162'
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const openDialog = (product = null) => {
  selectedProduct.value = product
  dialogVisible.value = true
}

const editProduct = (product) => {
  openDialog({ ...product })
}

const saveProduct = async (productData) => {
  try {
    if (productData.id) {
      await productosService.update(productData.id, productData)
      alert('Producto actualizado exitosamente')
    } else {
      await productosService.create(productData)
      alert('Producto creado exitosamente')
    }
    await loadData()
    dialogVisible.value = false
    window.dispatchEvent(new CustomEvent('refresh-inventario'))
  } catch (error) {
    console.error('Error guardando producto:', error)
    alert('Error al guardar el producto')
  }
}

const deleteProduct = async (product) => {
  if (confirm(`¿Estás seguro de eliminar "${product.nombre}"?`)) {
    try {
      await productosService.delete(product.id)
      alert('Producto eliminado exitosamente')
      await loadData()
      window.dispatchEvent(new CustomEvent('refresh-inventario'))
    } catch (error) {
      console.error('Error eliminando producto:', error)
      alert('Error al eliminar el producto')
    }
  }
}

// Detectar si es móvil
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  loadData()
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // Escuchar cambios en categorías
  window.addEventListener('refresh-inventario', loadData)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('refresh-inventario', loadData)
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