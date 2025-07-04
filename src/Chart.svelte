<script lang="ts">
    import {Card} from "flowbite-svelte";
    import {Chart as ChartJS, registerables} from "chart.js";
    import type {Result, ModeType} from "./libs";
    
    let {ranking, mode}:{ranking:Result[], mode:ModeType} = $props();
    let canvas:HTMLCanvasElement;
    let chart:ChartJS|null = null;

    const bins = [
        {label:"-64 〜 -49", min:-64, max:-49},
        {label:"-48 〜 -33", min:-48, max:-33},
        {label:"-32 〜 -17", min:-32, max:-17},
        {label:"-16 〜 0", min:-16, max:0},
        {label:"1 〜 16", min:1, max:16},
        {label:"17 〜 32", min:17, max:32},
        {label:"33 〜 48", min:33, max:48},
        {label:"49 〜 64", min:49, max:64}
    ];
    const frequency = $derived.by(()=>{
        const freq = new Array(bins.length).fill(0);
        ranking.forEach((result)=>{
            const score = result.score;
            if(mode===0 || result.type === mode){
                bins.forEach((bin, index)=>{
                    if(score >= bin.min && score <= bin.max){
                        freq[index]++;
                    }
                });
            }
        });
        return freq;
    });
    ChartJS.register(...registerables);
    $effect(()=>{
        if(chart) chart.destroy();
        chart = new ChartJS(canvas!, {
            type: 'bar',
            data: {
                labels: bins.map(b=>b.label),
                datasets: [{
                    label: '弱さ',
                    data: frequency,
                    borderWidth: 0.5,
                    categoryPercentage: 1.0,
                    barPercentage: 1.0,
                    borderColor: '#eeeeee',
                    backgroundColor: bins.map( b => b.min>0?'#36A2EB':'#FF6384'),
                }]
            },
            options: {
                indexAxis: 'y',
                plugins:{
                    legend:{
                        display: false
                    },
                    tooltip:{
                        enabled: false,
                    },
                },
                scales:{
                    x:{
                        title:{
                            display: true,
                            text: '人数'
                        },
                        grid: {
                            display: true,
                        },
                        beginAtZero: true,
                    },
                    y:{
                        reverse: true,
                        title:{
                            display: true,
                            text: '弱さ'
                        },
                        grid: {
                            display: true,
                        },
                    }
                }
            }
        });
    });
</script>

<Card class="bg-gray-50 shadow-lg rounded-2xl py-4 pl-4 pr-6 max-w-full">
    <h2 class="text-xl font-bold mb-2">弱さの度数分布</h2>
    <canvas bind:this={canvas} width="100%" height="80%"></canvas>
</Card>
