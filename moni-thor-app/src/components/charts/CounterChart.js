// CommitChart.js
import {Line} from 'vue-chartjs';
import Vue from 'vue';
import axios from 'axios';


export default Vue.component('counter-chart', {
    extends: Line,
    props: ['service', 'server','limit'],
    mounted() {
        this.getStats();
    },
    methods: {
        formatDate(timestamp) {
            let date = new Date(timestamp);
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        },
        getStats() {
            let filteredMetrics = Object.keys(this.server.metrics)
                .filter(key => key.startsWith('counter') && !key.includes('hystrix'));
            const metrics = filteredMetrics
                .splice(0,this.limit || filteredMetrics.length)
                .reduce((obj, key) => {
                    obj[key] = this.server.metrics[key];
                    return obj;
                }, {});
            this.renderChart({
                labels: Object.keys(metrics),
                datasets: [
                    {

                        label: ' requests',
                        backgroundColor: '#ff5722',
                        data: Object.values(metrics)
                    }
                ]
            }, {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: false
                    }]
                }
            })
        }
    },
    watch: {
        server() {
            this.getStats();
        },
        limit(){
            this.getStats();
        }
    }

});
