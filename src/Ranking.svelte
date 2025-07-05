<script lang="ts">
    import {Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import type {Result, ModeType} from "./libs";
    let {ranking, mode}:{ranking:Result[], mode:ModeType} = $props();
    let filteredRanking = $derived(
        mode === 0 ? ranking : ranking.filter(r => mode === r.type)
    );
</script>

<div class="h-[50%]">
<Card class="bg-gray-50 shadow-lg rounded-2xl py-4 px-8 max-w-full max-h-full overflow-scroll">
    <h2 class="text-xl font-bold mb-2">最弱のプレーヤー</h2>
    <Table striped border={false}>
        <TableHead  style="line-height: 0.2;">
            <TableHeadCell>#</TableHeadCell>
            <TableHeadCell>時間</TableHeadCell>
            <TableHeadCell>石数</TableHeadCell>
            <TableHeadCell>弱さ</TableHeadCell>
            <TableHeadCell>敗者</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each filteredRanking as {dateStr, black, white, score, type},i}
                <TableBodyRow style="line-height: 0.2;">
                    <TableBodyCell>{i+1}</TableBodyCell>
                    <TableBodyCell>{dateStr}</TableBodyCell>
                    <TableBodyCell>●{black} - ◯{white}</TableBodyCell>
                    <TableBodyCell>{score}</TableBodyCell>
                    <TableBodyCell>
                        {#if score === 0}引き分け
                        {:else if score > 0}プレーヤー
                        {:else if type===2}やや弱いAI
                        {:else}最弱のAI
                        {/if}
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</Card>

</div>