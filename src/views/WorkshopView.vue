<template>
  <div class="container">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" >
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
   
    <router-link to="/create">
      <button class="create_button">Criar Ata, Workshop e Colaborador</button>
    </router-link>
    <div class="search-bar">
      <div>
        <label for="">Pesquisa por nome:</label>
        <input class="bar_input" type="text" v-model="searchColaborador" placeholder="">
      </div>
      <div>
        <label for="">Pesquisa por Workshop:</label>
        <input class="bar_input" type="text" v-model="searchWorkshop" placeholder="">
      </div>
      <div>
        <label for="">Pesquisa por Data:</label>
        <input class="bar_input" type="date" v-model="searchDate">
      </div>
      
      
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
          <td>
            <router-link class="link_workshop" :to="`/workshop/${ata.AtaId}`">{{ ata.WorkshopNome }}</router-link>
          </td>
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
      const data = response.data.response
      this.groupedAtas = this.groupAtas(data);
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

*{
  font-family: "Roboto", sans-serif;
  line-height: 1.5;
  text-decoration: none;
  color: #fff;
  background-color: #86BBD8;
}
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid #336699;
  border-radius: 8px;
  padding: 20px;
}
.create_button{
  padding: 0.5rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  background-color: #336699;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  &:hover{
    border: 1px solid #fff;
  }
}
.link_workshop{
  font-weight: 700;
  
  &:hover{
    text-decoration: underline;
  }

}
.search-bar {
  display: flex;
  flex-direction: column;
  width: 30%;
  justify-content: space-between;
  margin-bottom: 20px;
  margin: 10px;
  div{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
.bar_input{
  padding: 0.5rem;
  background-color: #EFF7FF;
  border-radius: 8px;
  border: 1.5px solid #336699;
  margin: 1rem 0;
  color: #000000;
}

table {
  width: 100%;
  border-collapse: collapse;
} 





th,
td {
  border: 1px solid #2f4858;
  padding: 8px;
}


tr:nth-child(even) {
  background-color: #f2f2f2;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #86bbd8;
  color: #fff;
}
</style>