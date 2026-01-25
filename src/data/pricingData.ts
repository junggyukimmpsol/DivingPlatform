import { CenterId } from '../types/center.types'

export interface PricingItem {
  program: string
  deposit: number // 예약금
  balance: number // 현지지불/잔금
}

export const PRICING_DATA: Record<CenterId, PricingItem[]> = {
  cebu: [
    { program: '보트 체험다이빙 2회(+장비렌탈 + 점심)', deposit: 60000, balance: 140000 },
    { program: '보트 펀다이빙 2회(+장비렌탈 + 점심)', deposit: 20000, balance: 120000 },
    { program: '보트 펀다이빙 3회(+장비렌탈 + 점심)', deposit: 40000, balance: 120000 },
    { program: '비치다이빙 2회(+장비 렌탈 X + 점심)', deposit: 0, balance: 80000 },
  ],
  bohol: [
    { program: '알로나 비치 체험 다이빙 2회(+장비렌탈)', deposit: 20000, balance: 140000 },
    { program: '알로나 비치 펀 다이빙 2회 (+장비렌탈)', deposit: 0, balance: 120000 },
    { program: '나팔링 체험 다이빙 2회(+장비렌탈)', deposit: 30000, balance: 150000 },
    { program: '나팔링 펀 다이빙 2회 (+장비렌탈)', deposit: 10000, balance: 130000 },
    { program: '발리카삭 펀 다이빙 2회 (+장비렌탈+ 점심)', deposit: 20000, balance: 140000 },
    { program: '발리카삭 펀 다이빙 3회 (+장비렌탈+ 점심)', deposit: 60000, balance: 180000 },
    { program: '파밀라칸 펀 다이빙 2회 (+장비렌탈+ 점심)', deposit: 20000, balance: 140000 },
    { program: '파밀라칸 펀 다이빙 3회 (+장비렌탈+ 점심)', deposit: 60000, balance: 180000 },
  ],
  'kota-kinabalu': [
    { program: '아일랜드 보트 체험다이빙 2회(올 인클루시브)', deposit: 0, balance: 150000 },
    { program: '아일랜드 보트 펀다이빙 3회(올 인클루시브)', deposit: 0, balance: 150000 },
  ],
  bali: [
    { program: '뚤람벤 체험다이빙 2회(+장비렌탈 + 점심)', deposit: 0, balance: 140000 },
    { program: '뚤람벤 체험다이빙 3회(+장비렌탈 + 점심)', deposit: 20000, balance: 160000 },
    { program: '뚤람벤 펀다이빙 2회(+장비렌탈 + 점심)', deposit: 0, balance: 140000 },
    { program: '뚤람벤 펀다이빙 3회(+장비렌탈 + 점심)', deposit: 30000, balance: 170000 },
    { program: '누사두아 체험다이빙 2회(+장비 렌탈+점심)', deposit: 40000, balance: 180000 },
    { program: '누사두아 펀다이빙 2회(+장비 렌탈+점심)', deposit: 10000, balance: 150000 },
    { program: '누사두아 펀다이빙 3회(+장비 렌탈+점심)', deposit: 50000, balance: 190000 },
    { program: '누사 페니다 펀다이빙 2회', deposit: 30000, balance: 170000 },
    { program: '누사 페니다 펀다이빙 3회', deposit: 70000, balance: 210000 },
    { program: '누사 페니다 체험다이빙 2회', deposit: 90000, balance: 230000 },
  ],
}
