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

<main class="bg-green-100 fixed flex flex-col h-svh w-full">
    <h1 class="text-center text-4xl font-bold py-4 px-12">
            オセロ 最弱ランキング
    </h1>
    <div class="grow mx-8 grid gap-6 grid-cols-[2fr_1fr]">
        <!--左側-->
        <div class="flex flex-col gap-4">
            {#if lastResult}
                <GameResult result={lastResult} {ranking}/>
            {/if}
            <div class="max-h-[70%]">
                <Ranking {ranking}/>
            </div>
        </div>

        <!--右側-->
        <div class="flex flex-col gap-4">
            {#if stats}
                <Statistics {stats}/>
                <Chart {ranking}/>
            {/if}
        </div>
    </div>
</main>
