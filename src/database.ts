import type {Result, RawResult, Stats} from './libs';
import {createClient} from '@supabase/supabase-js';
import {writable} from 'svelte/store';
const supabaseUrl = 'https://roriiszsdvbaydyvcbff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmlpc3pzZHZiYXlkeXZjYmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTA2NTIsImV4cCI6MjA2NjE2NjY1Mn0.2nx46N99bu1t7SziG95NXOTWcWpukiL34533L_W2wLM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const realtimeChannel = supabase.channel('update-ranking');


async function fetchAllResults(){
    const {data, error} = await supabase.from('Ranking').select();
    if(data){
        const rawResults: RawResult[] = [];
        for(const d of data){
            rawResults.push({
                created_at: d.created_at,
                black: d.black,
                white: d.white,
                player: d.player[0]=== 'b' ? 'black' : 'white',
                type: d.type ?? 1
            });
        }
        return rawResults;
    }
    else{        
        console.error(error);
        throw new Error('Failed to fetch ranking data');
    }
}

function convertRawResultToResult({created_at, black, white, player, type}: RawResult): Result {
    const score = player === 'black' ? white - black : black - white;
    const date = new Date(created_at);
    const dateStr = date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo'
    });
    return {score, dateStr, black, white, type};
}

function updateStats(results:Result[], stats:Stats={win1:0, draw1:0, lose1:0, win2:0, draw2:0, lose2:0}):Stats{
    results.forEach((result)=>{
        if(result.type === 1){
            if(result.score > 0){
                stats.lose1++;
            }
            else if(result.score < 0){
                stats.win1++;
            }
            else{
                stats.draw1++;
            }
        }
        else{
            if(result.score > 0){
                stats.lose2++;
            }
            else if(result.score < 0){
                stats.win2++;
            }
            else{
                stats.draw2++;
            }
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
            console.log('Change received!', newResult);
            rankingStore.update((data)=>{
                data = [...data, newResult];
                data.sort((a, b) => b.score - a.score);
                return data;
            });

            lastResultStore.set(newResult);
            
            statsStore.update((stats)=>updateStats([newResult], stats));
        }).subscribe();
    return {rankingStore,lastResultStore,statsStore};
}


export function unsubscribe(){
    //supabase.removeChannel(realtimeChannel);
}
