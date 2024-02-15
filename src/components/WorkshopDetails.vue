<template>
    <div v-if="workshop" class="container">
        <h1>{{ workshop.WorkshopNome }}</h1>
        <p><strong>Descrição:</strong> {{ workshop.DescricaoWorkshop }}</p>
        <p><strong>Data de criação:</strong> {{ new Date(workshop.DataRealizacaoWorkshop).toLocaleDateString() }}</p>
        <h3>Participantes:</h3>
        <div v-for="(colaborador, index) in workshop.Colaboradores" :key="index">
            <p>{{ colaborador }}
                <button class="delete-btn" @click="deleteColaborador(colaborador)">Excluir</button>
            </p>
        </div>
        <select v-model="newColaborador">
            <option disabled value="">Selecione um colaborador</option>
            <option v-for="colaborador in colaboradores" :key="colaborador">{{ colaborador }}</option>
        </select>
        <button @click="addColaborador">Adicionar colaborador</button>
        <router-link to="/">Voltar para a página inicial</router-link>
    </div>
    <div v-else>
        <p>Carregando...</p>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

interface WorkshopData {
    WorkshopNome: string;
    DescricaoWorkshop: string;
    DataRealizacaoWorkshop: string;
    Colaboradores: string[];
}

export default defineComponent({
    data() {
        return {
            workshop: null as WorkshopData | null,
            newColaborador: '',
            colaboradores: [] as string[],
        };
    },
    async created() {
        const id = this.$route.params.id;
        const response = await axios.get(`http://localhost:3000/api/atas`);

        console.log(response.data.response);

        const groupedWorkshops = response.data.response.reduce((acc: any, workshop: any) => {
            if (!acc[workshop.AtaId]) {
                acc[workshop.AtaId] = {
                    WorkshopNome: workshop.WorkshopNome,
                    DescricaoWorkshop: workshop.DescricaoWorkshop,
                    DataRealizacaoWorkshop: workshop.DataRealizacaoWorkshop,
                    Colaboradores: [workshop.ColaboradorNome]
                };
            } else {
                acc[workshop.AtaId].Colaboradores.push(workshop.ColaboradorNome);
            }

            return acc;
        }, {});

        this.workshop = groupedWorkshops[Number(id)];

        const colaboradoresResponse = await axios.get(`http://localhost:3000/api/colaboradores`);
        const colaboradoresSet = new Set((colaboradoresResponse.data.response as { ColaboradorNome: string }[]).map(c => c.ColaboradorNome));
        this.colaboradores = Array.from(colaboradoresSet);
    },
    methods: {
        async deleteColaborador(colaboradorName: string) {
            const ataId = this.$route.params.id;
            await axios.delete(`http://localhost:3000/api/atas/colaboradores`, {
                data: {
                    ataId: ataId,
                    colaboradorName: colaboradorName
                }
            });
            if (this.workshop) {
                this.workshop.Colaboradores = this.workshop.Colaboradores.filter(c => c !== colaboradorName);
            }
        },
        async addColaborador() {
            const ataId = this.$route.params.id;
            await axios.put(`http://localhost:3000/api/atas/colaboradores`, {
                ataId: ataId,
                colaboradorName: this.newColaborador
            });
            if (this.workshop) {
                this.workshop.Colaboradores.push(this.newColaborador);
            }
            this.newColaborador = '';
        }
    }
});
</script>

<style scoped>
*{
    box-sizing: border-box;
    margin: 0;
    background-color: #86BBD8;
    text-decoration: none;
    

    a{
        color: #000;
        &:hover{
            text-decoration: underline;
        }
    }
}   
.container{
    border: 1px solid #336699;
    border-radius: 8px;
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    gap: 1rem;
    h1{
        background-color: #336699;
        font-size: 3rem;
        padding: 1rem;
        border-radius: 8px;
        width: 100%;
        text-align: center;
        color: #fff;
    }

    div{
        display: flex;
        padding: 0.1875rem;
        border: 1px solid #336699;
        border-radius: 6px;
        p{
            margin: 0;
            padding: 0;
        }
    }
    button{
        cursor: pointer;
        padding: 0.5rem;
        border: 1px solid transparent;
        &:hover{
            color: #fff;
        }
    }

    select{
        padding: 0.5rem;
        border-radius: 12px;
        border: 1px solid #336699;

    }
}
</style>