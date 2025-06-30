<script lang="ts">
    import {Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import type {Result} from "./libs";
    let {ranking}:{ranking:Result[]} = $props();
</script>

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
            {#each ranking as {dateStr, black, white, score},i}
                <TableBodyRow style="line-height: 0.2;">
                    <TableBodyCell>{i+1}</TableBodyCell>
                    <TableBodyCell>{dateStr}</TableBodyCell>
                    <TableBodyCell>●{black} - ◯{white}</TableBodyCell>
                    <TableBodyCell>{score}</TableBodyCell>
                    <TableBodyCell>
                        {#if score === 0}引き分け
                        {:else if (score > 0)}プレーヤー
                        {:else}AI
                        {/if}
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</Card>