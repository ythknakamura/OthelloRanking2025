import type {Result, RawResult, Stats} from './libs';
import {createClient} from '@supabase/supabase-js';
import {writable} from 'svelte/store';
const supabaseUrl = 'https://roriiszsdvbaydyvcbff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmlpc3pzZHZiYXlkeXZjYmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTA2NTIsImV4cCI6MjA2NjE2NjY1Mn0.2nx46N99bu1t7SziG95NXOTWcWpukiL34533L_W2wLM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const realtimeChannel = supabase.channel('update-ranking');


async function fetchAllResults(){
    const {data, error} = await supabase.from('Ranking').select();
    if(error){
        console.error(error);
        throw new Error('Failed to fetch ranking data');
    }
    else{
        return data as RawResult[];
    }
}

function convertRawResultToResult({created_at, black, white, player}: RawResult): Result {
    const score = player === 'black' ? white - black : black - white;
    const date = new Date(created_at);
    const dateStr = date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo'
    });
    return {score, dateStr, black, white};
}

function updateStats(results:Result[], stats:Stats={win:0,draw:0, lose:0}):Stats{
    results.forEach((result)=>{
        if(result.score > 0){
            stats.lose++;
        }
        else if(result.score < 0){
            stats.win++;
        }
        else{
            stats.draw++;
        }
    });
    return stats;
}

export async function createStores(){
    unsubscribe();
    const rawData = await fetchAllResults();
    const data = rawData!.map(convertRawResultToResult);
    const lastResultStore = writable<Result>(data[data.length-1]);
    data.sort((a, b) => b.score - a.score);
    const rankingStore = writable<Result[]>(data);
    const statsStore = writable<Stats>(updateStats(data));
    realtimeChannel.on('postgres_changes', 
        {event: 'INSERT', schema: 'public', table: 'Ranking'}, 
        (payload) => {
            const newResult = convertRawResultToResult(payload.new as RawResult);
            rankingStore.update((data)=>{
                data.push(newResult);

                return data;
            });

            lastResultStore.set(newResult);
            
            statsStore.update((stats)=>updateStats([newResult], stats));

            console.log('Change received!', newResult);
        }).subscribe();
    return {rankingStore,lastResultStore,statsStore};
}


export function unsubscribe(){
    supabase.removeChannel(realtimeChannel);
}
