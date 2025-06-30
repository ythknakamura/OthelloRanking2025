<script lang="ts">
    import {Card} from "flowbite-svelte";
    import type {Stats} from "./libs";
    let {stats}:{stats:Stats} = $props();
    let total = $state(stats.win + stats.draw + stats.lose);
</script>

<Card class="bg-gray-50 shadow-lg rounded-2xl py-4 pl-8 max-w-full">
    <h2 class="text-xl font-bold mb-2">統計情報</h2>
    <dl class="ml-4 leading-8">
        <dt>ゲーム総数</dt><dd>{total}回</dd>
        <dt>プレーヤの負け</dt><dd>{stats.lose}回 ({(stats.lose/total*100).toFixed(1)}%)</dd>
        <dt>AIの負け</dt><dd>{stats.win}回 ({(stats.win/total*100).toFixed(1)}%)</dd>
        <dt>引き分け</dt><dd>{stats.draw}回 ({(stats.draw/total*100).toFixed(1)}%)</dd>
    </dl>
</Card>

<style>
    dt{
        width: 8em;
    }
    dd{
        float: right;
    }
</style>