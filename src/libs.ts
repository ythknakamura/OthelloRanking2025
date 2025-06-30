export type Color = 'black' | 'white';

export type RawResult = {
    created_at: string,
    black:number,
    white:number,
    player:Color,
}

export type Result = {
    dateStr: string,
    score: number,
    white: number,
    black: number,
}

export type Stats = {
    win:number,
    draw:number,
    lose:number,
}