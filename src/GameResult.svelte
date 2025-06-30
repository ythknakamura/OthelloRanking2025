<script lang="ts">
    import {Card} from "flowbite-svelte";
    import type {Result} from "./libs";
    let {result, ranking}:{result:Result, ranking:Result[]} = $props();
    let order = $state(ranking.findIndex((r) => r.score === result.score) + 1);
</script>

<Card class="bg-gray-50 shadow-lg rounded-2xl py-4 px-8 max-w-full">
    <h2 class="text-xl font-bold mb-2">最新のゲーム結果
        <span class="text-lg ml-8 font-normal">
            下から<span class="font-extrabold text-xl">{order}</span>番目
        </span>
        <span class="text-lg ml-8 font-normal">
            (下位 <span class="font-extrabold text-xl">{(order/ranking.length*100).toFixed(1)}</span> %)
        </span>
    </h2>
    <dl class="ml-4 flex">
        <dt>日付</dt><dd>{result.dateStr}</dd>
        <dt>石数</dt><dd> ●{result.black} - ◯{result.white}</dd>
        <dt>弱さ</dt><dd> {result.score}</dd>
        <dt>敗者</dt><dd>
            {#if result.score === 0}
                引き分け
            {:else if (result.score > 0)}
                プレーヤー
            {:else}
                AI
            {/if}
        </dd>
    </dl>
</Card>

