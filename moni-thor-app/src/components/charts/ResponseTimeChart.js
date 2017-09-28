// CommitChart.js
import {Line} from 'vue-chartjs';
import Vue from 'vue';
import axios from 'axios';


Vue.component('line-chart', {
    extends: Line,
    props : ['service', 'server'],
    mounted() {
       this.getStats();
    },
    methods: {
        formatDate(timestamp){
            let date = new Date(timestamp);
            return date.getDate() + '/' + (date.getMonth()+1) + '/'+ date.getFullYear() + ' '+ date.getHours()+':'+date.getMinutes();
        },
        getStats(){
            axios.get(`/api/stats?service=${this.service}`)
                .then((response) => {
                    let filteredStats = response.data.filter(stat => stat.server === this.server.split('/')[2]);
                    let start = filteredStats.length > 20 ? (filteredStats.length-20) : 0;
                    const stats = filteredStats.splice(start, filteredStats.length);
                    this.renderChart({
                        labels: stats.map(stat => this.formatDate(stat.meta.created)),
                        datasets: [
                            {
                                label: 'Data One',
                                backgroundColor: '#f87979',
                                data: stats.map(stat => stat.responseTime)
                            }
                        ]
                    }, {responsive: true, maintainAspectRatio: false})
                });
        }
    },
    watch : {
        server(newVal, oldVal){
            console.log(newVal, oldVal);
            this.getStats();
        }
    }

});
