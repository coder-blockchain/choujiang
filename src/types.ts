export type Prize = {
  id: number;
  name: string;
  count: number;
};

export const PRIZES: Prize[] = [
  { id: 3, name: '三等奖', count: 5 },
  { id: 2, name: '二等奖', count: 3 },
  { id: 1, name: '一等奖', count: 1 },
];

export type AppState = 'setup' | 'draw' | 'results';
