export type Color = 'black' | 'white';
export type ModeType = 0 | 1 | 2; // 0: 全体, 1: 最弱AI, 2: やや弱いAI

export type RawResult = {
    created_at: string,
    black:number,
    white:number,
    player:Color,
    type:ModeType, // 1: 最弱AI, 2: やや弱いAI
}

export type Result = {
    dateStr: string,
    score: number,
    white: number,
    black: number,
    type:ModeType,
}

export type Stats = {
    win1:number,
    draw1:number,
    lose1:number,
    win2:number,
    draw2:number,
    lose2:number,
}
