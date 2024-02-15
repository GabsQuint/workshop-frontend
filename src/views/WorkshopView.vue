<template>
  <div class="container">
    <div class="search-bar">
      <input type="text" v-model="searchColaborador" placeholder="Pesquisar por colaborador">
      <input type="text" v-model="searchWorkshop" placeholder="Pesquisar por workshop">
      <input type="date" v-model="searchDate">
    </div>

    <table>
      <thead>
        <tr>
          <th>Data Realização Workshop</th>
          <th>Nome Workshop</th>
          <th>Descrição Workshop</th>
          <th>Nomes Colaboradores</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ata, index) in filteredAtas" :key="index">
          <td>{{ new Date(ata.DataRealizacaoWorkshop).toLocaleDateString() }}</td>
          <td>{{ ata.WorkshopNome }}</td>
          <td>{{ ata.DescricaoWorkshop }}</td>
          <td>{{ ata.Colaboradores.join(', ') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

interface Ata {
  AtaId: number;
  DataRealizacaoWorkshop: string;
  DescricaoWorkshop: string;
  WorkshopNome: string;
  Colaboradores: string[];
}

export default defineComponent({
  data() {
    return {
      searchColaborador: '',
      searchWorkshop: '',
      searchDate: '',
      groupedAtas: [] as Ata[],
    };
  },
  computed: {
    filteredAtas() {
      let filtered = this.groupedAtas;

      if (this.searchColaborador) {
        filtered = filtered.filter(ata =>
          ata.Colaboradores.some(colaborador =>
            colaborador.toLowerCase().includes(this.searchColaborador.toLowerCase())
          )
        );
      }

      return filtered;
    },
  },
  methods: {
    groupAtas(atas: any[]) {
      const grouped: { [key: number]: Ata } = {};

      atas.forEach(ata => {
        if (!grouped[ata.AtaId]) {
          grouped[ata.AtaId] = {
            AtaId: ata.AtaId,
            DataRealizacaoWorkshop: ata.DataRealizacaoWorkshop,
            DescricaoWorkshop: ata.DescricaoWorkshop,
            WorkshopNome: ata.WorkshopNome,
            Colaboradores: [ata.ColaboradorNome],
          };
        } else {
          grouped[ata.AtaId].Colaboradores.push(ata.ColaboradorNome);
        }
      });

      return Object.values(grouped);
    },
    async fetchAtas(workshopNome?: string) {
      const response = await axios.get('http://localhost:3000/api/atas', {
        params: workshopNome ? { workshopNome } : {},
      });
      this.groupedAtas = this.groupAtas(response.data.response);
    },
    async fetchAtasByDate(date?: string) {
      const response = await axios.get('http://localhost:3000/api/atasByDate', {
        params: date ? { data: date } : {},
      });
      this.groupedAtas = this.groupAtas(response.data.response);
    },
  },
  watch: {
    async searchWorkshop(newWorkshop) {
      await this.fetchAtas(newWorkshop);
    },
    async searchDate(newDate) {
      await this.fetchAtasByDate(newDate);
    },
  },
  async created() {
    await this.fetchAtas();
    const response = await axios.get('http://localhost:3000/api/atas');
    this.groupedAtas = this.groupAtas(response.data.response);
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}
</style>