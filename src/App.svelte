<script lang="ts">
    import {onMount,onDestroy} from 'svelte';
    import type { Result, Stats} from './libs';
    import GameResult from './GameResult.svelte';
    import Statistics from './Statistics.svelte';
    import Ranking from './Ranking.svelte';
    import Chart from './Chart.svelte';
    import {createStores, unsubscribe} from './database';

    let lastResult = $state<Result|null>(null);
    let ranking = $state<Result[]>([]);
    let stats = $state<Stats|null>(null);

    onMount(async () => {
        const {rankingStore, lastResultStore, statsStore} = await createStores();
        lastResultStore.subscribe((value) => lastResult = value);
        rankingStore.subscribe((value) => ranking = value);
        statsStore.subscribe((value) => stats = value);
        //console.log('Ranking store initialized', ranking, lastResult, stats);
    });
    onDestroy(() => {
        unsubscribe();
        console.log('Unsubscribed from ranking store');
    });
</script>
<div class="bg-green-100 h-svh grid gap-6 px-12 py-8 
    grid-cols-[2fr_1fr] grid-rows-[1fr_2fr_1fr_6fr]">
    <div class="col-span-2 flex items-center justify-center">
        <span class="text-center text-4xl font-bold py-4 px-12">
            オセロ 最弱ランキング
        </span>
    </div>
    <div>
        {#if lastResult}
            <GameResult result={lastResult} {ranking}/>
        {/if}
    </div>
    <div class="row-span-2">
        {#if stats}
            <Statistics {stats}/>
        {/if}
    </div>
    <div class="row-span-3">
        <Ranking {ranking}/>
    </div>
    <div class="row-span-2">
        {#if stats}
            <Chart {stats} {ranking}/>
        {/if}
    </div>
</div>
