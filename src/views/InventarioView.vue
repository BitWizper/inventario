<template>
  <v-container fluid class="pa-4 pa-md-8" style="background: linear-gradient(135deg, #DBD2C9 0%, #d4c9bf 100%); min-height: 100vh;">
    <v-row>
      <v-col cols="12">
        <!-- Header Card Rediseñado - Más grande -->
        <v-card elevation="0" class="mb-8 rounded-xl" style="border-radius: 34px; overflow: hidden; box-shadow: 0 20px 35px -10px rgba(99, 19, 28, 0.2);">
          <div style="background: linear-gradient(135deg, #7F1D25 0%, #63131C 100%); position: relative;">
            <!-- Patrón decorativo de fondo -->
            <div style="position: absolute; top: 0; right: 0; opacity: 0.08; pointer-events: none;">
              <svg width="1000" height="1000" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="white" stroke-width="0.5"/>
                <circle cx="50" cy="50" r="30" stroke="white" stroke-width="0.5"/>
                <circle cx="50" cy="50" r="20" stroke="white" stroke-width="0.5"/>
                <circle cx="50" cy="50" r="10" stroke="white" stroke-width="0.5"/>
              </svg>
            </div>
            
            <v-card-item class="py-6 px-4 px-md-8">
              <div class="d-flex align-center justify-space-between flex-wrap">
                <div class="d-flex align-center">
                  <div class="mr-5" style="background: rgba(219, 210, 201, 0.15); border-radius: 20px; padding: 16px;">
                    <v-icon size="56" color="#DBD2C9">mdi-warehouse</v-icon>
                  </div>
                  <div>
                    <div class="text-h2 text-white font-weight-bold" style="letter-spacing: -0.5px;">
                      Módulo de Inventario
                    </div>
                    <div class="text-subtitle-1 mt-2" style="color: #CD9395; font-weight: 400;">
                      <v-icon size="18" color="#CD9395" class="mr-1">mdi-check-circle</v-icon>
                      Gestión de productos y categorías en tiempo real
                    </div>
                  </div>
                </div>
              </div>
            </v-card-item>
            
            <!-- Stats Cards - Más grandes -->
            <div class="px-4 px-md-8 pb-6">
              <div class="d-flex gap-4 flex-wrap justify-start">
                <div class="stat-card" style="background: rgba(219, 210, 201, 0.12); backdrop-filter: blur(10px); border-radius: 20px; padding: 16px 32px; min-width: 180px; border: 1px solid rgba(219, 210, 201, 0.2);">
                  <div class="d-flex align-center">
                    <div class="text-center">
                      <v-icon size="40" color="#DBD2C9" class="mb-2">mdi-package-variant</v-icon>
                      <div class="text-h3 font-weight-bold text-white">{{ totalProductos }}</div>
                      <div class="text-subtitle-1" style="color: #CD9395; font-weight: 500;">Total Productos</div>
                    </div>
                  </div>
                </div>
                
                <div class="stat-card" style="background: rgba(219, 210, 201, 0.12); backdrop-filter: blur(10px); border-radius: 20px; padding: 16px 32px; min-width: 180px; border: 1px solid rgba(219, 210, 201, 0.2);">
                  <div class="d-flex align-center">
                    <div class="text-center">
                      <v-icon size="40" color="#DBD2C9" class="mb-2">mdi-tag-multiple</v-icon>
                      <div class="text-h3 font-weight-bold text-white">{{ totalCategorias }}</div>
                      <div class="text-subtitle-1" style="color: #CD9395; font-weight: 500;">Categorías</div>
                    </div>
                  </div>
                </div>
                
                <div class="stat-card" style="background: rgba(219, 210, 201, 0.12); backdrop-filter: blur(10px); border-radius: 20px; padding: 16px 32px; min-width: 180px; border: 1px solid rgba(219, 210, 201, 0.2);">
                  <div class="d-flex align-center">
                    <div class="text-center">
                      <v-icon size="40" color="#CD9395" class="mb-2">mdi-alert-circle</v-icon>
                      <div class="text-h3 font-weight-bold text-white">{{ stockBajo }}</div>
                      <div class="text-subtitle-1" style="color: #CD9395; font-weight: 500;">Stock Bajo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="rounded-xl" style="border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(99, 19, 28, 0.1); min-height: 600px;">
          <!-- Tabs personalizadas -->
          <div style="background: white; border-bottom: 2px solid #f0ebe6;">
            <v-tabs 
              v-model="tab" 
              color="#7F1D25"
              bg-color="transparent"
              align-tabs="center"
              grow
              density="comfortable"
              style="min-height: 65px;"
            >
              <v-tab 
                value="productos" 
                class="text-none font-weight-medium"
                :style="{ 
                  fontSize: '18px',
                  letterSpacing: '0.3px'
                }"
              >
                <v-icon start class="mr-2" :color="tab === 'productos' ? '#7F1D25' : '#9F6162'" size="24">mdi-package-variant</v-icon>
                Productos
                <v-badge 
                  v-if="totalProductos > 0"
                  :content="totalProductos" 
                  color="#7F1D25"
                  location="top end"
                  offset-x="8"
                  offset-y="4"
                  class="ml-2"
                />
              </v-tab>
              
              <v-tab 
                value="categorias" 
                class="text-none font-weight-medium"
                :style="{ 
                  fontSize: '18px',
                  letterSpacing: '0.3px'
                }"
              >
                <v-icon start class="mr-2" :color="tab === 'categorias' ? '#7F1D25' : '#9F6162'" size="24">mdi-tag</v-icon>
                Categorías
                <v-badge 
                  v-if="totalCategorias > 0"
                  :content="totalCategorias" 
                  color="#7F1D25"
                  location="top end"
                  offset-x="8"
                  offset-y="4"
                  class="ml-2"
                />
              </v-tab>
            </v-tabs>
          </div>

          <v-divider style="border-color: #e8e2dc;"></v-divider>

          <!-- Contenedor con altura mínima fija para evitar cambios de tamaño -->
          <v-window v-model="tab" style="background: #FAF8F6; min-height: 500px;">
            <v-window-item value="productos" class="pa-4 pa-md-6">
              <ProductosList />
            </v-window-item>
            
            <v-window-item value="categorias" class="pa-4 pa-md-6">
              <CategoriasList />
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProductosList from '@/components/inventario/ProductosList.vue'
import CategoriasList from '@/components/inventario/CategoriasList.vue'
import { productosService, categoriasService } from '@/services/api'

const tab = ref('productos')
const totalProductos = ref(0)
const totalCategorias = ref(0)
const stockBajo = ref(0)

const loadStats = async () => {
  try {
    const [productosRes, categoriasRes] = await Promise.all([
      productosService.getAll(),
      categoriasService.getAll()
    ])
    totalProductos.value = productosRes.data.length
    totalCategorias.value = categoriasRes.data.length
    stockBajo.value = productosRes.data.filter(p => p.stock < 10).length
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
    // Fallback a localStorage si la API falla
    try {
      const storedProductos = localStorage.getItem('inventario_productos')
      const storedCategorias = localStorage.getItem('inventario_categorias')
      
      if (storedProductos) {
        const productos = JSON.parse(storedProductos)
        totalProductos.value = productos.length
        stockBajo.value = productos.filter(p => p.stock < 10).length
      }
      
      if (storedCategorias) {
        const categorias = JSON.parse(storedCategorias)
        totalCategorias.value = categorias.length
      }
    } catch (e) {
      console.error('Error en fallback:', e)
    }
  }
}

const handleRefresh = () => {
  loadStats()
}

onMounted(() => {
  loadStats()
  window.addEventListener('refresh-inventario', handleRefresh)
})

onUnmounted(() => {
  window.removeEventListener('refresh-inventario', handleRefresh)
})
</script>

<style scoped>
.gap-4 {
  gap: 20px;
}

/* Animación suave para las tarjetas de estadísticas */
.stat-card {
  transition: all 0.3s ease;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(219, 210, 201, 0.2) !important;
  border-color: rgba(219, 210, 201, 0.4) !important;
}

/* Personalización de tabs */
:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 12px 24px;
}

:deep(.v-tab:hover) {
  background-color: rgba(127, 29, 37, 0.04);
}

:deep(.v-tab--selected) {
  background: linear-gradient(to bottom, transparent 0%, transparent 85%, #7F1D25 85%, #7F1D25 100%);
}

:deep(.v-tab--selected .v-icon) {
  color: #7F1D25 !important;
}

/* Smooth scroll para el contenido */
:deep(.v-window) {
  scroll-behavior: smooth;
}

/* Fijar altura mínima para evitar cambios de tamaño */
:deep(.v-window-item) {
  min-height: 450px;
}

/* Ajustes responsive */
@media (max-width: 768px) {
  .stat-card {
    padding: 12px 20px !important;
    min-width: 130px !important;
  }
  
  .stat-card .v-icon {
    font-size: 28px !important;
  }
  
  .stat-card .text-h3 {
    font-size: 1.75rem !important;
  }
  
  .stat-card .text-subtitle-1 {
    font-size: 0.75rem !important;
  }
  
  .gap-4 {
    gap: 12px;
  }
  
  :deep(.v-tab) {
    font-size: 14px !important;
    padding: 8px 12px;
  }
  
  :deep(.v-tab .v-icon) {
    font-size: 18px !important;
  }
  
  :deep(.v-window-item) {
    min-height: 400px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 8px 16px !important;
    min-width: 100px !important;
  }
  
  .stat-card .v-icon {
    font-size: 24px !important;
  }
  
  .stat-card .text-h3 {
    font-size: 1.5rem !important;
  }
  
  :deep(.v-window-item) {
    min-height: 350px;
  }
}
</style>