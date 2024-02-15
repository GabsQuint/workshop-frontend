<template class="main_page">
  <div class="create-page">
    <router-link to="/">Voltar para a página inicial</router-link>
    <h1>Criar Ata, Workshop e Colaborador</h1>
    <div class="container">

      <div>
        <form @submit.prevent="handleAtaSubmit">
          <div>
            <label for="AtaName">Ata:</label>
            <input id="AtaName" v-model="ataName" type="text" required>
          </div>

          <button type="submit">Criar Workshop</button>
        </form>

        <form @submit.prevent="handleColaboradorSubmit">
          <div>
            <label for="colaboradorName">Colaborador:</label>
            <input id="colaboradorName" v-model="colaboradorName" type="text" required>
          </div>

          <button type="submit">Criar Colaborador</button>
        </form>
      </div>
      <form class="create-workshop" @submit.prevent="handleWorkshopCreationSubmit">
        <div>
          <label for="workshopCreationName">Nome do Workshop:</label>
          <input id="workshopCreationName" v-model="workshopCreationName" type="text" required>
        </div>

        <div>
          <label for="workshopCreationDate">Data do Workshop:</label>
          <input id="workshopCreationDate" v-model="workshopCreationDate" type="date" required>
        </div>

        <div>
          <label for="workshopCreationDescription">Descrição do Workshop:</label>
          <input id="workshopCreationDescription" v-model="workshopCreationDescription" type="text" required>
        </div>

        <button type="submit">Criar Workshop</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      ataName: '',
      colaboradorName: '',
      workshopCreationName: '',
      workshopCreationDate: '',
      workshopCreationDescription: '',
    };
  },
  methods: {
    async handleAtaSubmit() {
      try {
        const response = await axios.post('http://localhost:3000/api/ata', {
          workshopName: this.ataName
        });
      } catch (error) {
        console.error(error);
      }
    },
    async handleColaboradorSubmit() {
      try {
        const response = await axios.post('http://localhost:3000/api/colaborador', {
          name: this.colaboradorName
        });
      } catch (error) {
        console.error(error);
      }
    },
    async handleWorkshopCreationSubmit() {
      try {
        const response = await axios.post('http://localhost:3000/api/workshops', {
          name: this.workshopCreationName,
          dateCompletion: this.workshopCreationDate,
          description: this.workshopCreationDescription,
        });

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
  }
});
</script>
<style scoped>
* {
  background-color: #86BBD8;
  color: #fff;
  border-radius: 4px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

}
button{
  width: 11rem;
}

input{
  width:9.85rem;
}

.create-page {
  border: 1px solid #336699;
  border-radius: 8px;
  h1 {
    text-align: center;
  }

  div {
    display: flex;
  }

  form {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    input {
      border: 1px solid #336699;
      padding: 0.5rem;
    }

    button {
      padding: 0.5rem;
      border: 1px solid #336699;
      cursor: pointer;

      &:hover {
        background-color: #336699;
        border: 1px solid #000;
      }
    }

  }
}

.container{
  display: flex;
  justify-content: space-around;
  div{
    display: flex;
    flex-direction: column;

    form{
      display: flex;
      flex-direction: column;
    }
  }
}
.create-workshop{
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>