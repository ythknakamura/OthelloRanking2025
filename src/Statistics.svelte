<script lang="ts">
    import {Chart as ChartJS, registerables} from "chart.js";
    import {Card} from "flowbite-svelte";
    import type {Stats, ModeType} from "./libs";
    let {stats, mode}:{stats:Stats, mode:ModeType} = $props();
    let lose = $derived( mode=== 0 ? stats.lose1 + stats.lose2 : mode===1 ? stats.lose1 : stats.lose2);
    let win = $derived(mode=== 0 ? stats.win1 + stats.win2 : mode===1 ? stats.win1 : stats.win2);
    let draw = $derived(mode===0 ? stats.draw1 + stats.draw2 : mode===1 ? stats.draw1 : stats.draw2);
    let total = $derived(win + draw + lose);
    let canvas:HTMLCanvasElement;
    let chart:ChartJS|null = null;

    ChartJS.register(...registerables);
    $effect(()=>{
        if(chart) chart.destroy();
        chart = new ChartJS(canvas!, {
            type: 'bar',
            data: {
                labels:['敗率'],
                datasets: [
                    {label:'プレーヤーの負け',data: [lose/total*100],backgroundColor: '#36A2EB'},
                    {label:'AIの負け',data: [win/total*100],backgroundColor: '#FF6384'},
                    {label:'引き分け',data: [draw/total*100],backgroundColor: '#ffea98'},
                ]
            },
            options: {
                indexAxis: 'y',
                plugins:{
                    legend:{
                        position: 'top',
                        display: true,
                        labels:{
                            font:{
                                size:6
                            }
                        }
                    },
                    tooltip:{
                        enabled: true,
                    }
                },
                scales:{
                    x:{
                        stacked: true,
                        ticks: {
                            callback: function(value, index, ticks) {
                                return value + '%';
                            }
                        }
                    },
                    y:{
                        ticks: {
                            display: false,
                        }, 
                        stacked: true, 
                    }
                }
            }
        });
    });
</script>

<Card class="bg-gray-50 shadow-lg rounded-2xl py-4 pl-8 max-w-full">
    <h2 class="text-xl font-bold mb-2">統計情報</h2>
    <dl class="ml-4 leading-6">
        <dt>ゲーム総数</dt><dd>{total}回</dd>
        <dt>プレーヤの負け</dt><dd>{lose}回 ({(lose/total*100).toFixed(1)}%)</dd>
        <dt>AIの負け</dt><dd>{win}回 ({(win/total*100).toFixed(1)}%)</dd>
        <dt>引き分け</dt><dd>{draw}回 ({(draw/total*100).toFixed(1)}%)</dd>
    </dl>
    <canvas bind:this={canvas} width="100%" height="25%" class="mt-2 mr-4"></canvas>
</Card>

<style>
    dt{
        width: 8em;
    }
    dd{
        float: right;
    }
</style>