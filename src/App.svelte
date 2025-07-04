<script lang="ts">
    import {onMount,onDestroy} from 'svelte';
    import {Select, Label} from 'flowbite-svelte';
    import type { Result, Stats, ModeType} from './libs';
    import GameResult from './GameResult.svelte';
    import Statistics from './Statistics.svelte';
    import Ranking from './Ranking.svelte';
    import Chart from './Chart.svelte';
    import {createStores, unsubscribe} from './database';

    let lastResult = $state<Result|null>(null);
    let ranking = $state<Result[]>([]);
    let stats = $state<Stats|null>(null);
    let mode = $state<ModeType>(0); 

    const modeType : {value: ModeType, name: string}[]= [
        {value: 0, name: 'すべて' },
        {value: 1, name: '最弱のAI' },
        {value: 2, name: 'やや弱いAI' },
    ];

    onMount(async () => {
        const {rankingStore, lastResultStore, statsStore} = await createStores();
        lastResultStore.subscribe((value) => {
            lastResult = value;
            mode = 0;
        });
        rankingStore.subscribe((value) => ranking = value);
        statsStore.subscribe((value) => stats = value);
        mode = 0;
        //console.log('Ranking store initialized', ranking, lastResult, stats);
        setTimeout(()=>location.reload(), 10*60*1000);
    });
    onDestroy(() => {
        unsubscribe();
        console.log('Unsubscribed from ranking store');
    });
</script>

<main class="fixed flex flex-col h-svh w-full">
    <div class="flex flex-row justify-between items-center">
        <h1 class="text-center text-4xl font-bold py-8 px-12">
                オセロ 最弱ランキング
        </h1>
        <div class="m-auto flex flex-row items-center">
            <Label for="mode-select" class="mr-4">対戦相手：</Label>
            <Select class="w-36" size="lg" bind:value={mode} placeholder="">
                {#each modeType as {value, name}}
                    <option value={value} selected={value===0}>{name}</option>
                {/each}
            </Select>
        </div>
    </div>
    <div class="grow mx-8 grid gap-6 grid-cols-[2fr_1fr]">
        <!--左側-->
        <div class="flex flex-col gap-4">
            {#if lastResult}
                <GameResult result={lastResult} {ranking}/>
            {/if}
            <Ranking {ranking} {mode}/>
        </div>

        <!--右側-->
        <div class="flex flex-col gap-4">
            {#if stats}
                <Statistics {stats} {mode}/>
                <Chart {ranking} {mode}/>
            {/if}
        </div>
    </div>
</main>
