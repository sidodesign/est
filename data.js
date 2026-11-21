// 시도디자인 견적 - 실장용 데이터 (원가 없음)
window.SIDO_DATA = {
 "version": "2026-11-17-1836",
 "stepLines": {
  "s1": [
   {
    "id": "protect",
    "items": [
     "보양작업"
    ],
    "qty": "1",
    "tags": "FBPWK",
    "loc": "공용부",
    "bom": {
     "mode": "detail",
     "label": "보양 구성",
     "items": [
      {
       "name": "엘리베이터 보양판·골판지",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "복도·현관 보양",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "보양 비닐·마스킹테이프",
       "qty": "1",
       "unit": "식"
      }
     ]
    },
    "label": "엘리베이터·복도 보호"
   },
   {
    "id": "inprotect",
    "items": [
     "내부 바닥 보양"
    ],
    "qty": "Math.round(FT)",
    "tags": "",
    "loc": "전체",
    "note": "바닥 시공 면적",
    "label": "집 안 바닥 보호"
   },
   {
    "id": "consent",
    "items": [
     "공사동의서"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "공용부",
    "label": "입주민 공사 동의서",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "세대 방문 동의서 받기",
       "qty": "1",
       "unit": "식"
      }
     ]
    }
   },
   {
    "id": "report",
    "items": [
     "관리사무소 공사신고·엘베사용료"
    ],
    "qty": "1",
    "tags": "FBPWK",
    "loc": "공용부",
    "label": "관리사무소 신고·엘리베이터 사용료"
   },
   {
    "id": "logi",
    "items": [
     "물류비"
    ],
    "qty": "1",
    "tags": "F",
    "loc": "전체",
    "label": "자재 운반비"
   },
   {
    "id": "demo",
    "items": [
     "부분 철거",
     "전체 철거"
    ],
    "qty": "Math.round(exclM2)",
    "tags": "FBP",
    "loc": "전체",
    "note": "전용면적 기준",
    "label": "집 전체 철거"
   },
   {
    "id": "demoBath",
    "items": [
     "욕실 철거 (1칸)"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "욕실 철거",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "타일 철거",
       "qty": "L('demoBath')",
       "unit": "칸"
      },
      {
       "name": "도기·수전·액세서리 철거",
       "qty": "L('demoBath')",
       "unit": "칸"
      },
      {
       "name": "천장재 철거",
       "qty": "L('demoBath')",
       "unit": "칸"
      }
     ]
    }
   },
   {
    "id": "demoKitchen",
    "items": [
     "주방 철거"
    ],
    "qty": "1",
    "tags": "FK",
    "loc": "주방",
    "label": "주방 철거"
   },
   {
    "id": "demoMold",
    "items": [
     "몰딩 철거"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체",
    "label": "몰딩 철거"
   },
   {
    "id": "demoDoor",
    "items": [
     "도어 철거"
    ],
    "qty": "rooms+baths",
    "tags": "",
    "loc": "전체",
    "label": "문 철거"
   },
   {
    "id": "demoFloor",
    "items": [
     "바닥 철거 및 샌딩"
    ],
    "qty": "Math.round(FT/3.3058*10)/10",
    "tags": "",
    "loc": "전체",
    "note": "바닥 시공 면적(평) · 강마루 철거와 샌딩을 합친 금액",
    "label": "바닥(강마루) 철거·샌딩",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "강마루 철거",
       "qty": "SELF",
       "unit": "평"
      },
      {
       "name": "바닥 샌딩",
       "qty": "SELF",
       "unit": "평"
      }
     ]
    }
   },
   {
    "id": "asbestos",
    "items": [
     "석면 철거"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체"
   },
   {
    "id": "waste",
    "items": [
     "철거 폐기물 (1톤)"
    ],
    "qty": "Math.max(1,Math.ceil(exclM2/40))",
    "tags": "FBPWK",
    "loc": "전체",
    "note": "1톤 트럭 / 공정 작업과 별도",
    "label": "철거 쓰레기 반출"
   },
   {
    "id": "ladder",
    "items": [
     "사다리차 기본시간",
     "사다리차 반대 4시간",
     "사다리차 일대 8시간"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "전체",
    "note": "현장 층수에 맞는 금액이 자동으로 들어갑니다",
    "label": "사다리차"
   },
   {
    "id": "ladderAdd",
    "items": [
     "사다리차 추가 1시간"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체",
    "note": "기본·반대·일대 시간을 넘길 때 1시간 단위로 넣습니다",
    "label": "사다리차 추가 시간"
   },
   {
    "id": "permit",
    "items": [
     "확장 행위허가 신고"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체"
   },
   {
    "id": "elevFee",
    "items": [
     "엘리베이터 사용료·예치금"
    ],
    "qty": "1",
    "tags": "",
    "loc": "공용부"
   },
   {
    "id": "notice",
    "items": [
     "이웃 공사 안내문·선물"
    ],
    "qty": "1",
    "tags": "",
    "loc": "공용부"
   },
   {
    "id": "demoCloset",
    "items": [
     "붙박이장·신발장 철거"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "demoWall",
    "items": [
     "아트월·벽체 철거"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실"
   },
   {
    "id": "demoBathTile",
    "items": [
     "욕실 타일 철거 (덧방 제외)"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실"
   },
   {
    "id": "demoBal",
    "items": [
     "발코니 타일·턱 철거"
    ],
    "qty": "1",
    "tags": "",
    "loc": "발코니"
   },
   {
    "id": "demoMoldTop",
    "items": [
     "상부 몰딩 철거"
    ],
    "qty": "1",
    "tags": "-",
    "loc": "전체",
    "label": "상부 몰딩 철거 (천장 몰딩)"
   },
   {
    "id": "demoBase",
    "items": [
     "걸레받이 철거"
    ],
    "qty": "1",
    "tags": "-",
    "loc": "전체",
    "label": "걸레받이 철거"
   }
  ],
  "s2": [
   {
    "id": "window",
    "items": [
     "창호 (업체 견적)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체",
    "note": "업체 견적 원가 입력",
    "label": "창문(샷시) 교체"
   },
   {
    "id": "demoSash",
    "items": [
     "샷시 철거"
    ],
    "qty": "4",
    "tags": "",
    "loc": "전체",
    "label": "기존 창문 철거"
   },
   {
    "id": "turning",
    "items": [
     "터닝도어 (예림)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "발코니",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "터닝도어 문짝·프레임",
       "qty": "L('turning')",
       "unit": "EA"
      },
      {
       "name": "유리",
       "qty": "L('turning')",
       "unit": "EA"
      },
      {
       "name": "시공",
       "qty": "L('turning')",
       "unit": "식"
      }
     ]
    }
   },
   {
    "id": "caulk",
    "items": [
     "외부 코킹 및 부자재"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체",
    "label": "창문 바깥 실리콘·부자재"
   },
   {
    "id": "winLabor",
    "items": [
     "창호 시공 인건비 (1인)"
    ],
    "qty": "2",
    "tags": "",
    "loc": "전체",
    "label": "창문 작업비"
   },
   {
    "id": "screen",
    "items": [
     "방충망 교체"
    ],
    "qty": "6",
    "tags": "",
    "loc": "전체"
   },
   {
    "id": "expand",
    "items": [
     "발코니 확장 공사 (1칸)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "발코니",
    "note": "1칸 100만 원 · 확장부 목공 단열과 샷시는 별도",
    "label": "발코니 확장 공사",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "단열 작업",
       "qty": "L('expand')",
       "unit": "칸"
      },
      {
       "name": "엑셀 난방배관 연장",
       "qty": "L('expand')",
       "unit": "칸"
      },
      {
       "name": "미장 작업",
       "qty": "L('expand')",
       "unit": "칸"
      }
     ]
    }
   },
   {
    "id": "expandInsul",
    "items": [
     "확장부 단열 목작업 (1칸)"
    ],
    "qty": "Math.max(1,L('expand'))",
    "tags": "",
    "loc": "발코니",
    "label": "확장부 단열 목작업",
    "note": "확장 공사를 체크하면 함께 들어갑니다 · 1칸 90만 원",
    "follow": "expand",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "단열재 (아이소핑크 등)",
       "qty": "L('expandInsul')",
       "unit": "칸"
      },
      {
       "name": "각재 틀·석고보드",
       "qty": "L('expandInsul')",
       "unit": "칸"
      },
      {
       "name": "목수 시공",
       "qty": "L('expandInsul')",
       "unit": "칸"
      }
     ]
    }
   }
  ],
  "s3": [
   {
    "id": "waterproof",
    "items": [
     "욕실 방수"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "note": "1칸 70만 원 · 2칸 이상 칸당 60만 원",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "1차 방수 (시멘트 액체방수)",
       "qty": "baths",
       "unit": "칸"
      },
      {
       "name": "도막방수 아덱스 WPM003",
       "qty": "baths",
       "unit": "칸"
      },
      {
       "name": "방수테이프 (모서리 보강)",
       "qty": "baths",
       "unit": "칸"
      },
      {
       "name": "실리콘",
       "qty": "baths",
       "unit": "칸"
      }
     ]
    },
    "label": "욕실 방수"
   },
   {
    "id": "zendai",
    "items": [
     "젠다이 시공"
    ],
    "qty": "1",
    "tags": "",
    "loc": "욕실"
   },
   {
    "id": "xl",
    "items": [
     "엑셀배관 증설"
    ],
    "qty": "1",
    "tags": "",
    "loc": "확장부"
   },
   {
    "id": "dist",
    "items": [
     "분배기 교체"
    ],
    "qty": "1",
    "tags": "",
    "loc": "보일러실"
   },
   {
    "id": "boiler",
    "items": [
     "보일러 교체"
    ],
    "qty": "1",
    "tags": "",
    "loc": "보일러실"
   },
   {
    "id": "thermo",
    "items": [
     "각방 온도조절기 교체"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체"
   },
   {
    "id": "level",
    "items": [
     "수평몰탈 시공"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체",
    "label": "바닥 수평 맞추기"
   },
   {
    "id": "plaster",
    "items": [
     "미장작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체"
   },
   {
    "id": "plumbMat",
    "items": [
     "설비 자재·부자재"
    ],
    "qty": "1",
    "tags": "FBW",
    "loc": "전체",
    "bom": {
     "mode": "detail",
     "label": "설비 자재 구성",
     "items": [
      {
       "name": "엑셀배관 XL 15A",
       "qty": "10",
       "unit": "M"
      },
      {
       "name": "엘보·소켓·티",
       "qty": "10",
       "unit": "EA"
      },
      {
       "name": "볼밸브",
       "qty": "2",
       "unit": "EA"
      },
      {
       "name": "앵글밸브",
       "qty": "baths*3",
       "unit": "EA"
      },
      {
       "name": "고압호스",
       "qty": "baths*3",
       "unit": "EA"
      },
      {
       "name": "테프론테이프",
       "qty": "2",
       "unit": "EA"
      }
     ]
    },
    "label": "배관 자재"
   },
   {
    "id": "tapMove",
    "items": [
     "수전 위치 변경"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "drainMove",
    "items": [
     "주방·세탁실 급배수 이설"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "trap",
    "items": [
     "배수구·트랩 교체"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "욕실 배수구·트랩 교체",
    "note": "욕실마다 1곳"
   },
   {
    "id": "leak",
    "items": [
     "누수 탐지·보수"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "acPipe",
    "items": [
     "에어컨 배관 매립"
    ],
    "qty": "2",
    "tags": "",
    "loc": ""
   },
   {
    "id": "plumbLabor",
    "items": [
     "설비 인건비"
    ],
    "qty": "1",
    "tags": "FBW",
    "loc": "전체",
    "label": "설비 작업비"
   },
   {
    "id": "aircon",
    "items": [
     "시스템에어컨 (업체 견적)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체",
    "note": "업체 견적 원가 입력"
   }
  ],
  "s4": [
   {
    "id": "ceilMold",
    "items": [
     "예림 평몰딩 30",
     "예림 평몰딩 40",
     "예림 평몰딩 50",
     "예림 천정몰딩 1번",
     "예림 마이너스 몰딩"
    ],
    "qty": "Math.ceil(perimAll*1.1/2.4)",
    "tags": "FB",
    "loc": "전체",
    "note": "상부 몰딩 기본 평몰딩 3cm / 1본 2.4m / 로스 10%",
    "label": "천장 몰딩"
   },
   {
    "id": "baseMold",
    "items": [
     "예림 평몰딩 40",
     "예림 걸레받이 60",
     "예림 걸레받이 40",
     "예림 걸레받이 90",
     "예림 강화마루용 걸레받이"
    ],
    "qty": "Math.ceil(perimAll*1.1/2.4)",
    "tags": "FB",
    "loc": "전체",
    "note": "하부 몰딩 기본 평몰딩 4cm / 1본 2.4m / 로스 10%",
    "label": "걸레받이 (바닥 몰딩)"
   },
   {
    "id": "doorMold",
    "items": [
     "예림 평문선 40",
     "예림 평문선 60"
    ],
    "qty": "(rooms+1+baths)*5",
    "tags": "",
    "loc": "전체",
    "note": "문 1개당 5본",
    "label": "문 테두리 몰딩 (문선)"
   },
   {
    "id": "flatCeil",
    "items": [
     "평천장(중천장) 목작업",
     "라운드 중천장 목작업"
    ],
    "qty": "0",
    "tags": "",
    "loc": "거실",
    "label": "거실 천장 평평하게",
    "hideZero": true,
    "note": "목수 1명 — ‘목수 작업비’ 줄 인원에 더해집니다"
   },
   {
    "id": "wellCeil",
    "items": [
     "우물천장 목작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실",
    "label": "우물천장 (천장 한 단 올리기)"
   },
   {
    "id": "wall",
    "items": [
     "가벽 목작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "arch",
    "items": [
     "아치 목작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "shelf",
    "items": [
     "선반 목작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "insul",
    "items": [
     "벽체 단열작업 (1면)"
    ],
    "qty": "0",
    "tags": "",
    "loc": "",
    "hideZero": true,
    "note": "목수 1.5명 — ‘목수 작업비’ 줄 인원에 더해집니다"
   },
   {
    "id": "curtainBox",
    "items": [
     "커튼박스"
    ],
    "qty": "Math.round(rooms*2.5+3)",
    "tags": "",
    "loc": "전체"
   },
   {
    "id": "artwall",
    "items": [
     "아트월"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실"
   },
   {
    "id": "lightBox",
    "items": [
     "등박스·간접등 홈 목작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실"
   },
   {
    "id": "tvBox",
    "items": [
     "TV 매립박스·벽 보강"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실"
   },
   {
    "id": "hidden",
    "items": [
     "히든도어·문틀 목작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "flatWall",
    "items": [
     "석고보드 벽체 평탄화"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "woodMat",
    "items": [
     "목자재 납품"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "전체",
    "note": "각재, 석고보드, MDF, 합판",
    "bom": {
     "mode": "replace",
     "label": "목자재",
     "items": [
      {
       "name": "각재 (30x30)",
       "qty": "Math.max(1,Math.ceil((ON('flatCeil')*livingA*0.6+ON('wellCeil')*livingA*0.5+ON('wall')*7+L('insul')*7+ON('curtainBox')*L('curtainBox')*0.3+ON('artwall')*6+ON('lightBox')*4+ON('tvBox')*3+perimAll*0.05)*1.5/20))",
       "note": "30×30 / 12자 20개 1단"
      },
      {
       "name": "석고보드 (9.5T)",
       "qty": "Math.ceil((ON('flatCeil')*livingA*0.6+ON('wellCeil')*livingA*0.5+ON('wall')*7+L('insul')*7+ON('curtainBox')*L('curtainBox')*0.3+ON('artwall')*6+ON('lightBox')*4+ON('tvBox')*3+perimAll*0.05)/1.62*1.1)",
       "note": "900×1800 / 로스 10%"
      },
      {
       "name": "MDF (9T)",
       "qty": "Math.max(1,Math.ceil(perimAll/12))",
       "note": "몰딩·문선 보강"
      },
      {
       "name": "일반합판 (9T)",
       "qty": "Math.max(1,ON('wall')*4+ON('tvBox')*2+ON('fan')*1+ON('shelf')*1+ON('artwall')*2)",
       "note": "보강용 4×8자"
      },
      {
       "name": "아이소핑크/단열재 (50T)",
       "qty": "L('insul')*5",
       "note": "단열 작업 시"
      }
     ]
    },
    "label": "목재·석고보드"
   },
   {
    "id": "woodSub",
    "items": [
     "부자재 및 장비대"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "전체",
    "note": "타카핀, 목공본드, 폼본드 등",
    "bom": {
     "mode": "replace",
     "label": "목공 부자재",
     "items": [
      {
       "name": "우레탄폼",
       "qty": "Math.max(2,Math.ceil(perimAll/15))",
       "note": "틈새 충진"
      },
      {
       "name": "목공본드",
       "qty": "Math.max(2,Math.ceil(perimAll/20))"
      },
      {
       "name": "ST45 타카핀",
       "qty": "1+Math.ceil((ON('flatCeil')*livingA*0.6+ON('wellCeil')*livingA*0.5+ON('wall')*7+L('insul')*7+ON('curtainBox')*L('curtainBox')*0.3+ON('artwall')*6+ON('lightBox')*4+ON('tvBox')*3+perimAll*0.05)/30)",
       "note": "석고·각재 고정"
      },
      {
       "name": "T50 타카핀",
       "qty": "1"
      },
      {
       "name": "422 타카핀",
       "qty": "1",
       "note": "얇은 판재 고정"
      },
      {
       "name": "630 타카핀",
       "qty": "1",
       "note": "몰딩 고정"
      },
      {
       "name": "실리콘(유성=무초산)",
       "qty": "Math.ceil(perimAll/10)",
       "note": "몰딩 마감"
      },
      {
       "name": "장갑",
       "qty": "1"
      }
     ]
    },
    "label": "목공 부자재"
   },
   {
    "id": "woodLabor",
    "items": [
     "목수 인건비"
    ],
    "qty": "Math.max(1,Math.round(((ON('ceilMold')+ON('baseMold')+ON('doorMold'))>0?(py>=35?2:1):0)+ON('flatCeil')*1+ON('halfIn')*1.5+ON('insul')*1.5))",
    "tags": "FB",
    "loc": "전체",
    "note": "몰딩 1명(35평 이상 2명) + 평천장 1 + 반매립 1.5 + 단열 1.5 → 합쳐서 반올림 · 인원은 고칠 수 있습니다",
    "label": "목수 작업비"
   },
   {
    "id": "halfIn",
    "items": [
     "목수 인건비"
    ],
    "qty": "0",
    "tags": "",
    "loc": "",
    "label": "반매립 작업",
    "note": "목수 1.5명 — ‘목수 작업비’ 줄 인원에 더해집니다",
    "hideZero": true
   }
  ],
  "s5": [
   {
    "id": "light",
    "items": [
     "전체 조명 자재"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체",
    "note": "거실등·주방등·방등을 아래 줄에서 따로 넣으면 이 줄은 끄세요",
    "bom": {
     "mode": "detail",
     "label": "조명 구성",
     "items": [
      {
       "name": "거실등 (LED 6등)",
       "qty": "1",
       "unit": "EA"
      },
      {
       "name": "주방등",
       "qty": "1",
       "unit": "EA"
      },
      {
       "name": "방등",
       "qty": "rooms",
       "unit": "EA"
      },
      {
       "name": "현관 센서등",
       "qty": "1",
       "unit": "EA"
      },
      {
       "name": "발코니등",
       "qty": "balconies",
       "unit": "EA"
      },
      {
       "name": "욕실등 (방습등)",
       "qty": "baths",
       "unit": "EA"
      }
     ]
    },
    "label": "기본 조명 세트 (묶음 금액)"
   },
   {
    "id": "down",
    "items": [
     "3인치 COB 매입등",
     "2인치 COB 다운라이트",
     "다운라이트 확산 3인치 7W",
     "다운라이트 확산 4인치 10W",
     "다운라이트 확산 6인치 15W"
    ],
    "qty": "rooms*4+8",
    "tags": "F",
    "loc": "전체",
    "label": "천장 매입등",
    "note": "종류를 고르고, 곳마다 개수를 넣을 수 있습니다"
   },
   {
    "id": "line",
    "items": [
     "라인조명"
    ],
    "qty": "6",
    "tags": "",
    "loc": "거실",
    "label": "라인조명 (일자 조명)"
   },
   {
    "id": "t5",
    "items": [
     "T5 간접조명"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실",
    "label": "간접조명 (숨은 조명)"
   },
   {
    "id": "pendant",
    "items": [
     "펜던트 조명"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "fan",
    "items": [
     "실링팬"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "switch",
    "items": [
     "스위치·콘센트 교체"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "전체",
    "bom": {
     "mode": "detail",
     "label": "스위치·콘센트 구성",
     "items": [
      {
       "name": "스위치 (1~3구)",
       "qty": "rooms+5",
       "unit": "EA"
      },
      {
       "name": "콘센트 (2구 접지)",
       "qty": "rooms*3+8",
       "unit": "EA"
      },
      {
       "name": "방우 콘센트",
       "qty": "baths",
       "unit": "EA"
      },
      {
       "name": "통신/TV 아울렛",
       "qty": "rooms+1",
       "unit": "EA"
      }
     ]
    },
    "label": "스위치·콘센트 교체"
   },
   {
    "id": "circuit",
    "items": [
     "콘센트·전용회로 증설"
    ],
    "qty": "2",
    "tags": "",
    "loc": ""
   },
   {
    "id": "split",
    "items": [
     "스위치 회로분리"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "dim",
    "items": [
     "디밍 작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실"
   },
   {
    "id": "interphone",
    "items": [
     "인터폰 7인치 교체"
    ],
    "qty": "1",
    "tags": "",
    "loc": "현관"
   },
   {
    "id": "fire",
    "items": [
     "자동확산 소화기 (연동)"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "주방"
   },
   {
    "id": "panel",
    "items": [
     "분전반·차단기 교체"
    ],
    "qty": "1",
    "tags": "",
    "loc": "현관"
   },
   {
    "id": "tvLine",
    "items": [
     "TV·통신 매립 배선"
    ],
    "qty": "1",
    "tags": "",
    "loc": "거실"
   },
   {
    "id": "sensor",
    "items": [
     "현관 센서등"
    ],
    "qty": "py>=30?2:1",
    "tags": "FB",
    "loc": "현관",
    "label": "현관 센서등",
    "note": "30평부터 2개"
   },
   {
    "id": "balLight",
    "items": [
     "발코니 조명"
    ],
    "qty": "balconies",
    "tags": "FB",
    "loc": "발코니",
    "label": "발코니 직부등",
    "note": "발코니마다 1개"
   },
   {
    "id": "appPower",
    "items": [
     "가전 전원 (인덕션·식세기)"
    ],
    "qty": "2",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "elecSub",
    "items": [
     "전기 부자재"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "전체",
    "note": "전선은 조명·콘센트 모두 2.5SQ",
    "bom": {
     "mode": "detail",
     "label": "전기 부자재 구성",
     "items": [
      {
       "name": "IV 전선 2.5SQ (조명·콘센트 공통)",
       "qty": "rooms*25+50",
       "unit": "M"
      },
      {
       "name": "CD관",
       "qty": "rooms*8+15",
       "unit": "M"
      },
      {
       "name": "매입복스",
       "qty": "rooms*4+10",
       "unit": "EA"
      },
      {
       "name": "커넥터·절연테이프",
       "qty": "1",
       "unit": "식"
      }
     ]
    },
    "label": "전선·전기 부자재"
   },
   {
    "id": "elecLabor",
    "items": [
     "전기 인건비"
    ],
    "qty": "Math.max(2,Math.ceil(rooms/2)+buf)",
    "tags": "FB",
    "loc": "전체",
    "note": "여유 1인 포함",
    "label": "전기 작업비"
   },
   {
    "id": "lightLiving",
    "items": [
     "[메가맨] LED 거실4등 100W",
     "[메가맨] LED 거실6등",
     "[비츠온] LED 심플 시스템 거실4등 100W",
     "[비츠온] LED 심플 시스템 거실6등 150W"
    ],
    "altBy": "py>=28?1:0",
    "qty": "1",
    "tags": "FB",
    "loc": "거실",
    "label": "거실등",
    "note": "24~27평은 4등 · 28평부터 6등"
   },
   {
    "id": "lightRoom",
    "items": [
     "[메가맨] LED 사각방등 50W",
     "[메가맨] LED 리모컨방등 55W",
     "[비츠온] LED 심플 시스템 방등 50W",
     "[비츠온] LED 원형 방등 50W"
    ],
    "qty": "rooms",
    "tags": "FB",
    "loc": "방",
    "label": "방등",
    "note": "방마다 1개"
   },
   {
    "id": "lightKitchen",
    "items": [
     "[메가맨] LED 주방2등 50W",
     "[메가맨] LED 주방1등 25W",
     "[비츠온] LED 심플 시스템 주방2등 50W",
     "[비츠온] LED 심플 시스템 주방1등 25W"
    ],
    "altBy": "py<28?1:0",
    "qty": "1",
    "tags": "FB",
    "loc": "주방",
    "label": "주방등",
    "note": "28평부터 2등 · 그 아래는 1등"
   },
   {
    "id": "bathDown",
    "items": [
     "욕실 다운라이트 6인치 15W (방습)"
    ],
    "qty": "baths*2",
    "tags": "FB",
    "loc": "욕실",
    "label": "욕실 다운라이트",
    "note": "욕실 1칸에 2개"
   },
   {
    "id": "direct",
    "items": [
     "LED 직부등 15W"
    ],
    "qty": "1",
    "tags": "-",
    "loc": "",
    "label": "직부등 (다용도실·드레스룸 등)",
    "note": "필요한 곳의 개수를 넣습니다"
   }
  ],
  "s6": [
   {
    "id": "doorSet",
    "items": [
     "방문·욕실문 교체 세트 (ABS 기본 민자도어)",
     "방문 교체 세트 (예림 슬림도어)"
    ],
    "qty": "rooms+1",
    "tags": "FB",
    "loc": "방",
    "label": "방문 교체 (문짝·문틀·경첩·손잡이·설치 포함)",
    "note": "ABS 기본 민자도어 · 방 + 다용도실 1",
    "bom": {
     "mode": "detail",
     "label": "세트 구성",
     "items": [
      {
       "name": "ABS 기본 민자도어 (문짝 35T)",
       "qty": "rooms+1",
       "unit": "EA"
      },
      {
       "name": "ABS 문틀 (두께는 실측 후 확정)",
       "qty": "rooms+1",
       "unit": "EA"
      },
      {
       "name": "경첩",
       "qty": "rooms+1",
       "unit": "조"
      },
      {
       "name": "손잡이·실린더",
       "qty": "rooms+1",
       "unit": "EA"
      },
      {
       "name": "문 설치비",
       "qty": "rooms+1",
       "unit": "짝"
      }
     ]
    }
   },
   {
    "id": "bathDoorSet",
    "items": [
     "방문·욕실문 교체 세트 (ABS 기본 민자도어)"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "욕실문 교체 (문짝·문틀·경첩·손잡이·설치 포함)",
    "note": "ABS 기본 민자도어 · 욕실용 턱 문틀",
    "bom": {
     "mode": "detail",
     "label": "세트 구성",
     "items": [
      {
       "name": "ABS 기본 민자도어 (문짝 35T)",
       "qty": "baths",
       "unit": "EA"
      },
      {
       "name": "ABS 문틀 (욕실용 턱 있음)",
       "qty": "baths",
       "unit": "EA"
      },
      {
       "name": "경첩",
       "qty": "baths",
       "unit": "조"
      },
      {
       "name": "손잡이·실린더",
       "qty": "baths",
       "unit": "EA"
      },
      {
       "name": "문 설치비",
       "qty": "baths",
       "unit": "짝"
      }
     ]
    }
   },
   {
    "id": "roomLeaf",
    "items": [
     "예림 ABS 민자 문짝 35T",
     "예림 목재 민자 문짝 36T",
     "예림 히든도어 45T ABS"
    ],
    "qty": "rooms+1",
    "tags": "",
    "loc": "방",
    "note": "기본색상",
    "label": "방문 문짝"
   },
   {
    "id": "roomFrame",
    "items": [
     "예림 ABS 문틀 155바 식기무",
     "예림 ABS 문틀 110바 식기무",
     "예림 ABS 문틀 130바 식기무",
     "예림 ABS 문틀 140바 식기무",
     "예림 ABS 문틀 175바 식기무",
     "예림 ABS 문틀 195바 식기무",
     "예림 ABS 문틀 210바 식기무",
     "예림 ABS 문틀 230바 식기무",
     "예림 ABS 문틀 245바 식기무",
     "예림 발포 슬림문틀 식기무",
     "예림 히든문틀 140바",
     "예림 히든문틀 110바",
     "예림 히든문틀 170바",
     "예림 히든문틀 200바",
     "예림 히든문틀 230바",
     "예림 히든문틀 260바",
     "예림 히든문틀 290바"
    ],
    "qty": "rooms+1",
    "tags": "",
    "loc": "방",
    "note": "1000×2100 기준 / 바 사이즈 선택",
    "label": "방문 문틀 (두께 선택)"
   },
   {
    "id": "bathLeaf",
    "items": [
     "예림 ABS 민자 문짝 35T"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "note": "기본색상",
    "label": "욕실 문짝"
   },
   {
    "id": "bathFrame",
    "items": [
     "예림 ABS 문틀 155바 식기유",
     "예림 ABS 문틀 110바 식기유",
     "예림 ABS 문틀 130바 식기유",
     "예림 ABS 문틀 140바 식기유",
     "예림 ABS 문틀 175바 식기유",
     "예림 ABS 문틀 195바 식기유",
     "예림 ABS 문틀 210바 식기유",
     "예림 ABS 문틀 230바 식기유",
     "예림 ABS 문틀 245바 식기유"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "note": "식기 유 / 바 사이즈 선택",
    "label": "욕실 문틀 (턱 있음)"
   },
   {
    "id": "leafColor",
    "items": [
     "문짝 시트 옵션 비칼라·메탈",
     "문짝 시트 옵션 HP",
     "문짝 시트 옵션 매트"
    ],
    "qty": "rooms+1+baths",
    "tags": "",
    "loc": "",
    "note": "색상 시트 추가금",
    "label": "문짝 색상 추가"
   },
   {
    "id": "hinge",
    "items": [
     "도어 경첩"
    ],
    "qty": "rooms+1+baths",
    "tags": "",
    "loc": "",
    "label": "경첩"
   },
   {
    "id": "handle",
    "items": [
     "도어 손잡이·실린더"
    ],
    "qty": "rooms+1+baths",
    "tags": "",
    "loc": "",
    "label": "손잡이"
   },
   {
    "id": "doorInstall",
    "items": [
     "도어 시공비 (짝당)"
    ],
    "qty": "rooms+1+baths",
    "tags": "",
    "loc": "",
    "label": "문 설치비"
   },
   {
    "id": "doorMeasure",
    "items": [
     "도어 실측비"
    ],
    "qty": "1",
    "tags": "FBW",
    "loc": "",
    "label": "문 실측비"
   },
   {
    "id": "frameExtra",
    "items": [
     "문틀 비규격 추가"
    ],
    "qty": "1",
    "tags": "",
    "loc": "",
    "note": "195바 초과·비규격"
   },
   {
    "id": "doorLeaf",
    "items": [
     "ABS 민자도어 (문짝 교체)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "",
    "note": "문짝만 교체"
   },
   {
    "id": "turning2",
    "items": [
     "터닝도어 (예림)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "발코니"
   },
   {
    "id": "jungmun",
    "items": [
     "초슬림 3연동 중문",
     "ㄱ자 3연동 중문",
     "원슬라이딩 중문",
     "폴딩도어"
    ],
    "qty": "1",
    "tags": "F",
    "loc": "현관",
    "label": "현관 중문",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "중문 프레임·문짝",
       "qty": "L('jungmun')",
       "unit": "EA"
      },
      {
       "name": "유리",
       "qty": "L('jungmun')",
       "unit": "EA"
      },
      {
       "name": "레일·부속",
       "qty": "L('jungmun')",
       "unit": "식"
      },
      {
       "name": "시공",
       "qty": "L('jungmun')",
       "unit": "식"
      }
     ]
    }
   },
   {
    "id": "lock",
    "items": [
     "도어락 교체 (지문)"
    ],
    "qty": "1",
    "tags": "F",
    "loc": "현관",
    "label": "도어락 교체"
   },
   {
    "id": "firedoor",
    "items": [
     "현관 방화문 시트 작업"
    ],
    "qty": "1",
    "tags": "",
    "loc": "현관"
   },
   {
    "id": "doorLabor",
    "items": [
     "도어 시공 인건비"
    ],
    "qty": "1",
    "tags": "",
    "loc": "",
    "note": "도어세트 외 추가 시공 시"
   }
  ],
  "s7": [
   {
    "id": "wallTile",
    "items": [
     "600각 포세린 타일",
     "300×600 벽타일",
     "600×1200 포세린 타일"
    ],
    "qty": "Math.ceil(bathWallM2*1.08/1.44)",
    "tags": "FBW",
    "loc": "욕실",
    "note": "벽 면적 / 1BOX 1.44㎡ / 로스 8%",
    "label": "욕실 벽 타일"
   },
   {
    "id": "floorTile",
    "items": [
     "600각 포세린 타일",
     "300각 바닥·발코니 타일"
    ],
    "qty": "Math.ceil(bathFloorM2*1.08/1.44)",
    "tags": "FBW",
    "loc": "욕실",
    "note": "바닥 면적 / 로스 8%",
    "label": "욕실 바닥 타일"
   },
   {
    "id": "entTile",
    "items": [
     "600각 포세린 타일"
    ],
    "qty": "Math.ceil(entryA*1.08/1.44)",
    "tags": "F",
    "loc": "현관",
    "label": "현관 바닥 타일",
    "note": "600각 포세린 / 박스"
   },
   {
    "id": "balTile",
    "items": [
     "300각 바닥·발코니 타일"
    ],
    "qty": "Math.ceil(balconies*6*1.08/1.44)",
    "tags": "F",
    "loc": "발코니",
    "label": "발코니 바닥 타일",
    "note": "300각 / 박스 · 1칸 6㎡ 기준"
   },
   {
    "id": "kitTile",
    "items": [
     "600각 포세린 타일"
    ],
    "qty": "Math.ceil(4*1.08/1.44)",
    "tags": "FK",
    "loc": "주방",
    "label": "주방 벽 타일",
    "note": "600각 포세린 / 박스 · 4㎡ 기준"
   },
   {
    "id": "entWall",
    "items": [
     "현관 벽 타일·아트월 타일"
    ],
    "qty": "4",
    "tags": "",
    "loc": "현관",
    "label": "현관 벽 타일·아트월 타일"
   },
   {
    "id": "balWall",
    "items": [
     "발코니 벽 타일"
    ],
    "qty": "6",
    "tags": "",
    "loc": "발코니",
    "label": "발코니 벽 타일"
   },
   {
    "id": "overlay",
    "items": [
     "욕실 덧방 시공 (1칸)"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "note": "기존 타일 위 시공"
   },
   {
    "id": "tileSub",
    "items": [
     "타일 부자재"
    ],
    "qty": "Math.round(bathWallM2+bathFloorM2+ON('entTile')*entryA+ON('balTile')*balconies*6+ON('kitTile')*4+L('entWall')+L('balWall'))",
    "tags": "FBW",
    "loc": "욕실",
    "note": "타일 붙이는 면적(㎡) × 부자재 단가",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "압착시멘트 (일반/고급 20kg)",
       "qty": "Math.ceil((bathWallM2+bathFloorM2+ON('entTile')*entryA+ON('balTile')*balconies*6+ON('kitTile')*4+L('entWall')+L('balWall'))/3)",
       "unit": "포"
      },
      {
       "name": "몰탈 (레미탈 40kg)",
       "qty": "Math.ceil(bathFloorM2*2+(ON('entTile')*entryA+ON('balTile')*balconies*6)*0.5)",
       "unit": "포"
      },
      {
       "name": "타일본드 (내장용/고성능)",
       "qty": "Math.ceil((bathWallM2+ON('kitTile')*4+L('entWall')+L('balWall'))/15)",
       "unit": "통"
      },
      {
       "name": "아덱스 메지",
       "qty": "Math.ceil((bathWallM2+bathFloorM2+ON('entTile')*entryA+ON('balTile')*balconies*6+ON('kitTile')*4+L('entWall')+L('balWall'))/10)",
       "unit": "포"
      },
      {
       "name": "코너비드 (PVC 12T L형)",
       "qty": "baths*4",
       "unit": "EA"
      },
      {
       "name": "타일 에폭시",
       "qty": "((ON('wallTile')*(ALT('wallTile')!=1?1:0))+(ON('floorTile')*(ALT('floorTile')==0?1:0))+ON('entTile')+ON('kitTile'))>0?Math.max(1,baths):0",
       "unit": "조",
       "note": "600각·대형 타일일 때만"
      },
      {
       "name": "실리콘(유성=무초산)",
       "qty": "baths*2",
       "unit": "EA"
      }
     ]
    },
    "label": "타일 부자재"
   },
   {
    "id": "tileLabor",
    "items": [
     "타일 인건비 (기공)"
    ],
    "qty": "Math.max(1,Math.ceil((bathWallM2+bathFloorM2+ON('entTile')*entryA+ON('balTile')*balconies*6+ON('kitTile')*4+L('entWall')+L('balWall'))/9))+buf",
    "tags": "FBW",
    "loc": "",
    "note": "욕실·현관·주방·발코니 타일 면적 합계 기준",
    "label": "타일 작업비"
   },
   {
    "id": "smc",
    "items": [
     "SMC 돔천장"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "note": "조명 별도",
    "label": "욕실 천장 (돔천장)"
   },
   {
    "id": "basin",
    "items": [
     "인토 일체형 세면기 L-336-1 사각",
     "인토 일체형 세면기 L-337-1 라운드",
     "이녹스 일체형 세면기 L-2210 사각",
     "대림 반다리 세면기 370 사각",
     "라우체 반다리 세면기 지니",
     "라우체 탑볼 세면대 오클리",
     "아메리칸 반다리 세면기 플랫 516 사각",
     "세면대 (언더볼)"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "세면대"
   },
   {
    "id": "basinTap",
    "items": [
     "베르사츠 원홀 세면수전 BSL-1001",
     "베르사츠 원홀 세면수전 BSL-5001",
     "에떼르노 원홀수전 E7-1001",
     "에떼르노 원홀수전 E9-1001"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "세면대 수전",
    "altBy": "2"
   },
   {
    "id": "shower",
    "items": [
     "베르사츠 샤워수전 BSB-1006",
     "베르사츠 샤워기 BSB-5005",
     "에떼르노 샤워수전 E7-1005",
     "에떼르노 샤워수전 E9-1005",
     "에떼르노 샤워수전 E7-1005NB + 슬라이드바"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "샤워 수전 (슬라이드바 포함)",
    "altBy": "4"
   },
   {
    "id": "slidebar",
    "items": [
     "베르사츠 슬라이드바 원형 BSA-1000-1",
     "베르사츠 슬라이드바 사각 BSA-2000",
     "에떼르노 슬라이드바 ESSB-100"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "label": "샤워기 거치대 (슬라이드바)",
    "note": "기본 샤워수전에 슬라이드바가 들어 있습니다 · 따로 넣을 때만 체크"
   },
   {
    "id": "toilet",
    "items": [
     "인토 투피스 양변기 C-941",
     "이녹스 투피스 양변기 8100",
     "인토 원피스 양변기 C-1002",
     "대림 2피스 치마 양변기 733",
     "라우체 2피스 치마형 양변기 포레",
     "라우체 원피스 양변기 포레",
     "아메리칸 2피스 양변기 웨이브R",
     "아메리칸 2피스 양변기 리니어",
     "라우체 비데일체형 양변기",
     "인토 투피스 양변기 C-951"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "변기",
    "altBy": "9"
   },
   {
    "id": "mirror",
    "items": [
     "댐퍼 슬라이드장 1200×800",
     "플랩장 1200×500",
     "플랩장 1200×600",
     "LED 거울",
     "원목 양개형"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "상부 수납장 (거울 슬라이딩장)"
   },
   {
    "id": "towel",
    "items": [
     "베르사츠 수건걸이 원형 BSA-100",
     "베르사츠 수건걸이 사각 BSA-200"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "수건걸이"
   },
   {
    "id": "paperHolder",
    "items": [
     "베르사츠 휴지걸이 BSA-100"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "label": "휴지걸이",
    "note": "욕실 악세서리 세트에 들어 있습니다 · 따로 넣을 때만 체크"
   },
   {
    "id": "shelf2",
    "items": [
     "베르사츠 코너선반 BSA-002",
     "베르사츠 이단 수건선반 BSA-006"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "label": "선반"
   },
   {
    "id": "robe",
    "items": [
     "베르사츠 옷걸이 BSA-100"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "label": "옷걸이"
   },
   {
    "id": "cleaner",
    "items": [
     "청소스프레이건"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "청소용 샤워건"
   },
   {
    "id": "vent",
    "items": [
     "환풍기 (힘펠 플렉스)",
     "환풍기 (휴젠트 온풍)"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "환풍기",
    "altBy": "1"
   },
   {
    "id": "partition",
    "items": [
     "유리 파티션 (일반)",
     "ㄱ자 젠다이 유리 파티션"
    ],
    "qty": "1",
    "tags": "FBW",
    "loc": "욕실",
    "label": "샤워 유리 칸막이"
   },
   {
    "id": "tub",
    "items": [
     "아크릴 욕조 (이동식)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "욕실"
   },
   {
    "id": "zendaiTop",
    "items": [
     "인조대리석 젠다이 선반"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실"
   },
   {
    "id": "setLabor",
    "items": [
     "도기세팅 인건비",
     "도기세팅 인건비 (일반 타일 욕실)"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "note": "욕실 1칸 풀세팅 · 포세린 타일 욕실 35만 / 일반 타일 욕실 30만",
    "label": "욕실 설치비 (변기·세면대)"
   },
   {
    "id": "grout",
    "items": [
     "줄눈 시공"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "label": "줄눈 시공"
   },
   {
    "id": "bidet",
    "items": [
     "비데 설치"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실"
   },
   {
    "id": "rain",
    "items": [
     "베르사츠 해바라기 샤워기 BSB-2009",
     "베르사츠 해바라기 샤워기 BSB-6009"
    ],
    "qty": "1",
    "tags": "",
    "loc": "욕실",
    "label": "해바라기 샤워기"
   },
   {
    "id": "vanity",
    "items": [
     "욕실 수납장 (하부장)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "욕실"
   },
   {
    "id": "bathLight",
    "items": [
     "욕실 조명 (방습등)"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실"
   },
   {
    "id": "bathSilicone",
    "items": [
     "실란트/방수실리콘"
    ],
    "qty": "baths*2",
    "tags": "",
    "loc": "욕실",
    "label": "욕실 실리콘 (자재)",
    "note": "욕실 1칸에 2개 · 도기·젠다이·코너 마감"
   },
   {
    "id": "lineDrain",
    "items": [
     "라인유가(50파이)"
    ],
    "qty": "baths",
    "tags": "",
    "loc": "욕실",
    "label": "라인 유가 (배수구)"
   },
   {
    "id": "bathAcc",
    "items": [
     "욕실 악세서리 세트 (무광니켈)"
    ],
    "qty": "baths",
    "tags": "FBW",
    "loc": "욕실",
    "label": "욕실 악세서리 세트",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "휴지걸이 (무광니켈)",
       "qty": "baths",
       "unit": "EA"
      },
      {
       "name": "라인유가",
       "qty": "baths",
       "unit": "EA"
      },
      {
       "name": "방우콘센트",
       "qty": "baths",
       "unit": "EA"
      }
     ]
    }
   }
  ],
  "s8": [
   {
    "id": "floor",
    "items": [
     "장판 2.2T (평당)",
     "장판 1.8T (평당)",
     "장판 2.7T (평당)",
     "장판 3.2T (평당)",
     "장판 4.5T (평당)",
     "장판 5T (평당)",
     "강마루 (동화 나투스진 7T · 평당)",
     "돌마루 (에디톤 스톤 5T)",
     "데코타일 3T"
    ],
    "qty": "ALT('floor')<7?py:Math.round(FT*1.07*10)/10",
    "tags": "FBP",
    "loc": "전체",
    "note": "장판·강마루는 평수(아파트 평형) 그대로 넣습니다 · 돌마루·데코타일은 실제 까는 넓이 + 로스 7%",
    "label": "바닥재",
    "cq": "ALT('floor')<7?Math.round(FT*(py>0&&py<pyAuto?pyAuto/py:1)*1.07/3.3058*10)/10:0"
   },
   {
    "id": "floorProtect",
    "items": [
     "강마루 보양"
    ],
    "qty": "Math.round(FT)",
    "tags": "",
    "loc": "전체",
    "note": "마루 시공 시",
    "label": "마루 보호"
   },
   {
    "id": "floorSub",
    "items": [
     "바닥 부자재"
    ],
    "qty": "1",
    "tags": "FBP",
    "loc": "전체",
    "note": "접착제, 프라이머, 실리콘",
    "bom": {
     "mode": "detail",
     "label": "바닥 부자재",
     "items": [
      {
       "name": "장판본드",
       "qty": "Math.ceil(FT/30)",
       "unit": "통"
      },
      {
       "name": "실리콘",
       "qty": "rooms+2",
       "unit": "EA"
      },
      {
       "name": "프라이머",
       "qty": "1",
       "unit": "통"
      }
     ]
    },
    "label": "바닥 부자재"
   },
   {
    "id": "divider",
    "items": [
     "재료분리대·논슬립"
    ],
    "qty": "rooms+2",
    "tags": "FBP",
    "loc": "전체",
    "label": "재료분리대·논슬립",
    "note": "문턱·바닥재가 바뀌는 자리 / 1m당 1만 원"
   },
   {
    "id": "stepFix",
    "items": [
     "바닥 단차 보정"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "floorLabor",
    "items": [
     "바닥 인건비"
    ],
    "qty": "ALT('floor')<=6?0:Math.max(1,Math.ceil(FT/90))+buf",
    "tags": "FBP",
    "loc": "전체",
    "note": "장판은 아래 평당 시공비 · 마루는 시공 포함 · 그 밖은 90㎡/인 + 여유 1인",
    "label": "바닥 작업비",
    "hideZero": true
   },
   {
    "id": "floorMeal",
    "items": [
     "식대"
    ],
    "qty": "Math.max(1,Math.ceil(FT/90))+1",
    "tags": "FBP",
    "loc": "전체",
    "note": "바닥 작업자",
    "label": "작업자 식대"
   },
   {
    "id": "floorLabN",
    "items": [
     "장판 시공비 (평당)"
    ],
    "qty": "ON('floor')&&ALT('floor')<4?py:0",
    "tags": "FBP",
    "loc": "전체",
    "label": "장판 시공비",
    "note": "평형 × 평당 시공비",
    "hideZero": true
   },
   {
    "id": "floorLab45",
    "items": [
     "장판 4.5T 시공비 (평당)"
    ],
    "qty": "ON('floor')&&ALT('floor')==4?py:0",
    "tags": "FBP",
    "loc": "전체",
    "label": "장판 4.5T 시공비",
    "note": "4.5T 장판을 고르면 자동 · 평형 × 평당 시공비",
    "hideZero": true
   },
   {
    "id": "floorLab5",
    "items": [
     "장판 5T 시공비 (평당)"
    ],
    "qty": "ON('floor')&&ALT('floor')==5?py:0",
    "tags": "FBP",
    "loc": "전체",
    "label": "장판 5T 시공비",
    "note": "5T 장판을 고르면 자동 · 평형 × 평당 시공비",
    "hideZero": true
   }
  ],
  "s9": [
   {
    "id": "paper",
    "items": [
     "실크 벽지 베스트 (평당)",
     "실크 벽지 테라피 (평당)",
     "실크 벽지 디아망 (평당)",
     "실크 벽지 포티스 (평당)",
     "합지 벽지 (평당)"
    ],
    "qty": "Math.round(py*2.5)",
    "tags": "FBP",
    "loc": "전체",
    "note": "도배 평수 = 평형 × 2.5 · 벽지 평당 금액 (부자재·인건비·식대는 아래 줄에 따로 들어갑니다)",
    "label": "벽지 (도배 평수 × 평당 금액)",
    "lump": true,
    "bom": {
     "mode": "detail",
     "label": "실장 참고",
     "items": [
      {
       "name": "벽지 (1롤 5평)",
       "qty": "Math.ceil(SELF/5)",
       "unit": "롤",
       "hide": true,
       "note": "발주할 롤 수 · 실장만 봅니다"
      }
     ]
    }
   },
   {
    "id": "ceilPaper",
    "items": [
     "천정지 도배"
    ],
    "qty": "Math.round(FT)",
    "tags": "",
    "loc": "전체",
    "label": "천장 벽지"
   },
   {
    "id": "putty",
    "items": [
     "퍼티·곰팡이 처리"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "partPaper",
    "items": [
     "부분 도배"
    ],
    "qty": "10",
    "tags": "",
    "loc": ""
   },
   {
    "id": "paperSub",
    "items": [
     "도배 부자재 (평당)"
    ],
    "qty": "Math.round(py*2.5)",
    "tags": "FBP",
    "loc": "전체",
    "note": "초배지, 도배풀, 실리콘, 커버링테이프 · 도배 평수 기준",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "초배지 (일반초배지320mm*320M)",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "삼중지 150mm*100M",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "네바리/조인트테이프 (균열)",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "도배풀 14kg",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "마법사 50mm*30M",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "도배용 수성실리콘",
       "qty": "1",
       "unit": "식"
      }
     ]
    },
    "label": "도배 부자재",
    "lump": true
   },
   {
    "id": "paperLabor",
    "items": [
     "도배 인건비"
    ],
    "qty": "Math.max(1,Math.round(Math.round(py*2.5)/(ALT('paper')==4?20:15)))+(ALT('paper')==2||ALT('paper')==3?1:0)",
    "tags": "FBP",
    "loc": "전체",
    "note": "실크: 도배 평수 ÷ 15 · 합지: ÷ 20 (반올림) · 디아망·포티스는 1명 추가",
    "label": "도배 작업비"
   },
   {
    "id": "paperMeal",
    "items": [
     "식대"
    ],
    "qty": "L('paperLabor')",
    "tags": "FBP",
    "loc": "전체",
    "note": "도배 작업자",
    "label": "작업자 식대"
   },
   {
    "id": "paperRound",
    "items": [
     "도배 인건비"
    ],
    "qty": "1",
    "tags": "",
    "loc": "",
    "label": "무몰딩·라운드 마감 추가 인건비",
    "note": "무몰딩·라운드 목작업에 도배 마감이 들어갈 때 1명 추가"
   }
  ],
  "s10": [
   {
    "id": "filmDoor",
    "items": [
     "예림 인테리어필름 기본칼라",
     "예림 인테리어필름 비칼라·메탈",
     "예림 인테리어필름 매트 HE407",
     "예림 인테리어필름 벨로체 L-100",
     "예림 인테리어필름 벨로체 L-400",
     "예림 인테리어필름 방염시트"
    ],
    "qty": "Math.ceil((rooms+1)*3.5/1.22)",
    "tags": "",
    "loc": "방",
    "note": "문·문틀 1개당 약 2.9M (폭 1.22m)",
    "label": "문·문틀 필름"
   },
   {
    "id": "filmSub",
    "items": [
     "필름 부자재"
    ],
    "qty": "1",
    "tags": "",
    "loc": "",
    "note": "프라이머, 퍼티, 본드, 샌딩페이퍼",
    "bom": {
     "mode": "replace",
     "label": "필름 부자재",
     "items": [
      {
       "name": "프라이머",
       "qty": "Math.max(1,Math.ceil(L('filmDoor')*1.22/20))",
       "note": "접착력 향상"
      },
      {
       "name": "퍼티 5kg",
       "qty": "1",
       "note": "면 보수"
      },
      {
       "name": "사포",
       "qty": "Math.max(2,Math.ceil(L('filmDoor')/3))",
       "note": "바탕면 연마"
      }
     ]
    },
    "label": "필름 부자재"
   },
   {
    "id": "filmLabor",
    "items": [
     "필름 인건비"
    ],
    "qty": "Math.max(1,Math.ceil(L('filmDoor')*1.22/20))+buf",
    "tags": "",
    "loc": "",
    "note": "20㎡/인 + 여유 1인",
    "label": "필름 작업비"
   },
   {
    "id": "filmMeal",
    "items": [
     "식대"
    ],
    "qty": "Math.max(1,Math.ceil(L('filmDoor')*1.22/20))+1",
    "tags": "",
    "loc": "",
    "note": "필름 작업자",
    "label": "작업자 식대"
   },
   {
    "id": "paint",
    "items": [
     "도장 공사 (몰딩·문틀)"
    ],
    "qty": "1",
    "tags": "",
    "loc": ""
   },
   {
    "id": "sashFilm",
    "items": [
     "창호 필름 (샷시)"
    ],
    "qty": "4",
    "tags": "",
    "loc": ""
   },
   {
    "id": "sinkFilm",
    "items": [
     "싱크·가구 필름 리폼"
    ],
    "qty": "10",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "closetFilm",
    "items": [
     "붙박이장·신발장 필름"
    ],
    "qty": "8",
    "tags": "",
    "loc": ""
   },
   {
    "id": "wallPaint",
    "items": [
     "벽면 도장 (페인트)"
    ],
    "qty": "20",
    "tags": "",
    "loc": ""
   },
   {
    "id": "balPaint",
    "items": [
     "발코니 페인트"
    ],
    "qty": "balconies",
    "tags": "",
    "loc": "발코니"
   },
   {
    "id": "elastic",
    "items": [
     "탄성코트"
    ],
    "qty": "balconies",
    "tags": "FB",
    "loc": "발코니",
    "label": "발코니 탄성코트",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "곰팡이·오염 제거",
       "qty": "L('elastic')",
       "unit": "칸"
      },
      {
       "name": "프라이머 (하도)",
       "qty": "L('elastic')",
       "unit": "칸"
      },
      {
       "name": "탄성코트 도장 2회",
       "qty": "L('elastic')",
       "unit": "칸"
      }
     ]
    }
   }
  ],
  "s11": [
   {
    "id": "sink",
    "items": [
     "싱크대"
    ],
    "qty": "10",
    "tags": "FK",
    "loc": "주방",
    "note": "기본 싱크대·4way 폭포수전·후드 포함",
    "label": "싱크대 (길이 자)",
    "lump": true,
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "싱크대 (상부장·하부장)",
       "qty": "L('sink')",
       "unit": "자"
      },
      {
       "name": "4way 폭포수전",
       "qty": "1",
       "unit": "EA"
      },
      {
       "name": "후드",
       "qty": "1",
       "unit": "EA"
      }
     ]
    }
   },
   {
    "id": "top",
    "items": [
     "주방 상판 교체 (인조대리석)"
    ],
    "qty": "1",
    "tags": "K",
    "loc": "주방"
   },
   {
    "id": "bowl",
    "items": [
     "사각 싱크볼"
    ],
    "qty": "1",
    "tags": "FK",
    "loc": "주방"
   },
   {
    "id": "ktap",
    "items": [
     "주방 수전 (폭포수전)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "hood",
    "items": [
     "후드"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "cooktop",
    "items": [
     "쿡탑 (가스/인덕션)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "fridge",
    "items": [
     "냉장고장"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방",
    "lump": true,
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "냉장고장 몸통·문짝",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "경첩·부속",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "설치",
       "qty": "1",
       "unit": "식"
      }
     ]
    }
   },
   {
    "id": "tall",
    "items": [
     "키큰장"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "shoe",
    "items": [
     "신발장"
    ],
    "qty": "1",
    "tags": "F",
    "loc": "현관",
    "note": "자 기준",
    "label": "신발장",
    "lump": true,
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "신발장 몸통·문짝",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "경첩·손잡이·부속",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "설치",
       "qty": "1",
       "unit": "식"
      }
     ]
    }
   },
   {
    "id": "closet",
    "items": [
     "붙박이장 (여닫이)",
     "붙박이장 (슬라이딩)"
    ],
    "qty": "8",
    "tags": "",
    "loc": "방1",
    "note": "자 기준",
    "label": "붙박이장 (길이 자)",
    "lump": true,
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "붙박이장 몸통·문짝",
       "qty": "L('closet')",
       "unit": "자"
      },
      {
       "name": "경첩·손잡이·부속",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "설치",
       "qty": "1",
       "unit": "식"
      }
     ]
    }
   },
   {
    "id": "hanger",
    "items": [
     "시스템 행거"
    ],
    "qty": "1",
    "tags": "",
    "loc": "드레스룸"
   },
   {
    "id": "desk",
    "items": [
     "화장대·책장"
    ],
    "qty": "4",
    "tags": "",
    "loc": "",
    "note": "자 기준"
   },
   {
    "id": "furnDoor",
    "items": [
     "가구 도어 교체"
    ],
    "qty": "4",
    "tags": "",
    "loc": ""
   },
   {
    "id": "dress",
    "items": [
     "드레스룸 시스템장"
    ],
    "qty": "1",
    "tags": "",
    "loc": "드레스룸"
   },
   {
    "id": "pantry",
    "items": [
     "팬트리장"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "laundry",
    "items": [
     "다용도실·세탁실 상부장"
    ],
    "qty": "1",
    "tags": "",
    "loc": "다용도실"
   },
   {
    "id": "island",
    "items": [
     "아일랜드 식탁"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "appInst",
    "items": [
     "식기세척기·인덕션 설치"
    ],
    "qty": "1",
    "tags": "",
    "loc": "주방"
   },
   {
    "id": "shoeShelf",
    "items": [
     "신발장 중간 선반장 추가"
    ],
    "qty": "1",
    "tags": "",
    "loc": "현관",
    "label": "신발장 중간 선반장 추가"
   }
  ],
  "s12": [
   {
    "id": "procWaste",
    "items": [
     "공정간 폐기물 처리 (1회)"
    ],
    "qty": "1",
    "tags": "FBPWK",
    "loc": "전체",
    "note": "공정 작업과 별도 반출 (목공 후·도배 후)",
    "label": "공사 중 쓰레기 반출"
   },
   {
    "id": "silicone",
    "items": [
     "마감 실리콘 작업",
     "마감 실리콘 작업 (40평대 이상)"
    ],
    "qty": "1",
    "tags": "FB",
    "loc": "전체",
    "label": "마무리 실리콘",
    "altBy": "py>=40?1:0",
    "note": "집 전체 실리콘 / 40평 이상은 40만 원",
    "bom": {
     "mode": "detail",
     "label": "포함 내역",
     "items": [
      {
       "name": "창틀·샷시 둘레 실리콘",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "걸레받이·몰딩 마감 실리콘",
       "qty": "1",
       "unit": "식"
      },
      {
       "name": "주방·욕실 마감 실리콘",
       "qty": "1",
       "unit": "식"
      }
     ]
    }
   },
   {
    "id": "clean",
    "items": [
     "입주청소"
    ],
    "qty": "Math.round(supplyM2)",
    "tags": "",
    "loc": "전체",
    "note": "협의 후 진행",
    "label": "입주청소"
   },
   {
    "id": "dryer",
    "items": [
     "빨래건조대"
    ],
    "qty": "1",
    "tags": "",
    "loc": "발코니"
   },
   {
    "id": "sickhouse",
    "items": [
     "새집증후군 시공"
    ],
    "qty": "1",
    "tags": "",
    "loc": "전체"
   },
   {
    "id": "blind",
    "items": [
     "블라인드·커튼"
    ],
    "qty": "1",
    "tags": "",
    "loc": "",
    "note": "고객 별도 요청 시"
   },
   {
    "id": "outsource",
    "items": [
     "기타 외주 공사 (업체 견적)"
    ],
    "qty": "1",
    "tags": "",
    "loc": "",
    "note": "업체 견적 원가 입력"
   }
  ]
 },
 "presets2": [
  {
   "label": "전체 리모델링",
   "tag": "F"
  },
  {
   "label": "기본 리모델링",
   "tag": "B"
  },
  {
   "label": "도배·바닥만",
   "tag": "P"
  },
  {
   "label": "욕실만",
   "tag": "W"
  },
  {
   "label": "주방만",
   "tag": "K"
  },
  {
   "label": "직접 선택",
   "tag": ""
  }
 ],
 "cats": {
  "s1": [
   {
    "key": "prep",
    "label": "보양·공사 준비",
    "desc": "엘리베이터·복도 보호, 관리사무소 신고",
    "lines": [
     "protect",
     "inprotect",
     "consent",
     "report",
     "logi",
     "elevFee",
     "notice"
    ]
   },
   {
    "key": "demo",
    "label": "철거",
    "desc": "기존 마감 뜯어내기",
    "lines": [
     "demo",
     "demoBath",
     "demoKitchen",
     "demoMold",
     "demoDoor",
     "demoFloor",
     "demoCloset",
     "demoWall",
     "demoBathTile",
     "demoBal",
     "asbestos",
     "demoMoldTop",
     "demoBase"
    ]
   },
   {
    "key": "waste",
    "label": "철거 쓰레기 반출",
    "desc": "1톤 트럭 기준",
    "lines": [
     "waste"
    ]
   },
   {
    "key": "ladder",
    "label": "사다리차",
    "desc": "층수에 맞춰 자동 계산",
    "lines": [
     "ladder",
     "ladderAdd"
    ]
   },
   {
    "key": "permit",
    "label": "확장 행위허가 신고",
    "desc": "",
    "lines": [
     "permit"
    ]
   }
  ],
  "s2": [
   {
    "key": "window",
    "label": "창문(샷시) 교체",
    "desc": "업체 견적 금액 입력",
    "lines": [
     "window",
     "demoSash",
     "caulk",
     "winLabor",
     "screen"
    ]
   },
   {
    "key": "turning",
    "label": "터닝도어",
    "desc": "발코니 출입문",
    "lines": [
     "turning"
    ]
   },
   {
    "key": "expand",
    "label": "발코니 확장",
    "desc": "업체 견적 금액 입력",
    "lines": [
     "expand",
     "expandInsul"
    ]
   }
  ],
  "s3": [
   {
    "key": "water",
    "label": "욕실 방수",
    "desc": "타일 공사 전 방수층",
    "lines": [
     "waterproof"
    ]
   },
   {
    "key": "pipe",
    "label": "배관·수전 위치 변경",
    "desc": "수전·배수 이동, 누수 보수",
    "lines": [
     "zendai",
     "tapMove",
     "drainMove",
     "trap",
     "leak",
     "xl",
     "level",
     "plaster",
     "plumbMat",
     "plumbLabor"
    ]
   },
   {
    "key": "heat",
    "label": "보일러·난방",
    "desc": "보일러, 분배기, 온도조절기",
    "lines": [
     "boiler",
     "dist",
     "thermo"
    ]
   },
   {
    "key": "ac",
    "label": "에어컨",
    "desc": "시스템에어컨·배관",
    "lines": [
     "aircon",
     "acPipe"
    ]
   }
  ],
  "s4": [
   {
    "key": "mold",
    "label": "몰딩 바꾸기",
    "desc": "천장 몰딩·걸레받이·문선",
    "lines": [
     "ceilMold",
     "baseMold",
     "doorMold"
    ]
   },
   {
    "key": "ceil",
    "label": "천장 작업",
    "desc": "평천장·우물천장·간접등 자리",
    "lines": [
     "flatCeil",
     "wellCeil",
     "lightBox"
    ]
   },
   {
    "key": "wall",
    "label": "벽 작업",
    "desc": "가벽·아트월·단열·커튼박스",
    "lines": [
     "wall",
     "arch",
     "shelf",
     "insul",
     "tvBox",
     "hidden",
     "flatWall",
     "artwall",
     "curtainBox",
     "halfIn"
    ]
   },
   {
    "key": "wood",
    "label": "목공 자재·작업비",
    "desc": "자재·부자재·목수 작업비",
    "lines": [
     "woodMat",
     "woodSub",
     "woodLabor"
    ]
   }
  ],
  "s5": [
   {
    "key": "light",
    "label": "조명 바꾸기",
    "desc": "방등·매입등·간접조명",
    "lines": [
     "light",
     "down",
     "line",
     "t5",
     "pendant",
     "fan",
     "dim",
     "sensor",
     "balLight",
     "lightLiving",
     "lightRoom",
     "lightKitchen"
    ]
   },
   {
    "key": "switch",
    "label": "스위치·콘센트",
    "desc": "교체·증설·전용회로",
    "lines": [
     "switch",
     "circuit",
     "split",
     "appPower",
     "tvLine",
     "panel"
    ]
   },
   {
    "key": "safety",
    "label": "인터폰·소화기",
    "desc": "",
    "lines": [
     "interphone",
     "fire"
    ]
   },
   {
    "key": "elec",
    "label": "전기 자재·작업비",
    "desc": "전선·부자재·전기 작업비",
    "lines": [
     "elecSub",
     "elecLabor"
    ]
   }
  ],
  "s6": [
   {
    "key": "room",
    "label": "방문 바꾸기",
    "desc": "세트 가격: 문짝·문틀·경첩·손잡이·설치 포함 (실측비 별도)",
    "lines": [
     "doorSet",
     "roomLeaf",
     "roomFrame",
     "leafColor",
     "hinge",
     "handle",
     "doorInstall",
     "doorMeasure",
     "frameExtra"
    ]
   },
   {
    "key": "bath",
    "label": "욕실문 바꾸기",
    "desc": "세트 가격: 욕실용 턱 문틀 포함",
    "lines": [
     "bathDoorSet",
     "bathLeaf",
     "bathFrame"
    ]
   },
   {
    "key": "leafonly",
    "label": "문짝만 교체",
    "desc": "문틀은 두고 문짝만",
    "lines": [
     "doorLeaf"
    ]
   },
   {
    "key": "jungmun",
    "label": "현관 중문",
    "desc": "",
    "lines": [
     "jungmun"
    ]
   },
   {
    "key": "front",
    "label": "현관문·도어락",
    "desc": "도어락, 방화문 시트",
    "lines": [
     "lock",
     "firedoor"
    ]
   },
   {
    "key": "turn",
    "label": "터닝도어",
    "desc": "",
    "lines": [
     "turning2"
    ]
   },
   {
    "key": "labor",
    "label": "문 추가 작업비",
    "desc": "",
    "lines": [
     "doorLabor"
    ]
   }
  ],
  "s7": [
   {
    "key": "btile",
    "label": "욕실 타일",
    "desc": "벽·바닥 타일, 부자재, 타일 작업비",
    "lines": [
     "wallTile",
     "floorTile",
     "overlay",
     "tileSub",
     "tileLabor",
     "grout"
    ]
   },
   {
    "key": "fixture",
    "label": "변기·세면대·수전",
    "desc": "변기, 세면대, 수전, 샤워기",
    "lines": [
     "toilet",
     "basin",
     "basinTap",
     "shower",
     "slidebar",
     "rain",
     "bidet"
    ]
   },
   {
    "key": "ceiling",
    "label": "욕실 천장·환풍기·조명",
    "desc": "",
    "lines": [
     "smc",
     "vent",
     "bathLight"
    ]
   },
   {
    "key": "acc",
    "label": "거울·수납·액세서리",
    "desc": "거울장, 수건걸이, 휴지걸이",
    "lines": [
     "mirror",
     "vanity",
     "towel",
     "paperHolder",
     "shelf2",
     "robe",
     "cleaner",
     "zendaiTop",
     "lineDrain",
     "bathAcc"
    ]
   },
   {
    "key": "shower",
    "label": "샤워 칸막이·욕조",
    "desc": "",
    "lines": [
     "partition",
     "tub"
    ]
   },
   {
    "key": "set",
    "label": "욕실 설치비",
    "desc": "변기·세면대 설치",
    "lines": [
     "setLabor",
     "bathSilicone"
    ]
   },
   {
    "key": "othertile",
    "label": "현관·주방·발코니 타일",
    "desc": "",
    "lines": [
     "entTile",
     "balTile",
     "kitTile",
     "entWall",
     "balWall"
    ]
   }
  ],
  "s8": [
   {
    "key": "floor",
    "label": "바닥재 깔기",
    "desc": "장판·마루 + 부자재·작업비",
    "lines": [
     "floor",
     "floorProtect",
     "floorSub",
     "floorLabor",
     "floorMeal",
     "floorLabN",
     "floorLab45",
     "floorLab5"
    ]
   },
   {
    "key": "finish",
    "label": "바닥 마감·보정",
    "desc": "재료분리대, 단차 보정",
    "lines": [
     "divider",
     "stepFix"
    ]
   }
  ],
  "s9": [
   {
    "key": "paper",
    "label": "벽지 바꾸기",
    "desc": "벽지 + 부자재·작업비",
    "lines": [
     "paper",
     "ceilPaper",
     "paperSub",
     "paperLabor",
     "paperMeal",
     "paperRound"
    ]
   },
   {
    "key": "repair",
    "label": "벽 보수",
    "desc": "퍼티·곰팡이 처리, 부분 도배",
    "lines": [
     "putty",
     "partPaper"
    ]
   }
  ],
  "s10": [
   {
    "key": "film",
    "label": "문·문틀 필름",
    "desc": "필름 + 부자재·작업비",
    "lines": [
     "filmDoor",
     "filmSub",
     "filmLabor",
     "filmMeal"
    ]
   },
   {
    "key": "film2",
    "label": "창틀·가구 필름",
    "desc": "",
    "lines": [
     "sashFilm",
     "sinkFilm",
     "closetFilm"
    ]
   },
   {
    "key": "paint",
    "label": "페인트·탄성코트",
    "desc": "",
    "lines": [
     "paint",
     "wallPaint",
     "balPaint",
     "elastic"
    ]
   }
  ],
  "s11": [
   {
    "key": "sink",
    "label": "싱크대",
    "desc": "싱크대, 상판, 싱크볼, 수전, 후드",
    "lines": [
     "sink",
     "top",
     "bowl",
     "ktap",
     "hood",
     "cooktop",
     "appInst",
     "island"
    ]
   },
   {
    "key": "kstore",
    "label": "주방 수납장",
    "desc": "냉장고장, 키큰장, 팬트리",
    "lines": [
     "fridge",
     "tall",
     "pantry"
    ]
   },
   {
    "key": "shoe",
    "label": "현관 신발장",
    "desc": "",
    "lines": [
     "shoe",
     "shoeShelf"
    ]
   },
   {
    "key": "closet",
    "label": "붙박이장·드레스룸",
    "desc": "",
    "lines": [
     "closet",
     "hanger",
     "dress",
     "desk"
    ]
   },
   {
    "key": "laundry",
    "label": "다용도실 수납",
    "desc": "",
    "lines": [
     "laundry"
    ]
   },
   {
    "key": "fdoor",
    "label": "가구 문짝 교체",
    "desc": "",
    "lines": [
     "furnDoor"
    ]
   }
  ],
  "s12": [
   {
    "key": "pwaste",
    "label": "공사 중 쓰레기 반출",
    "desc": "목공 후·도배 후",
    "lines": [
     "procWaste"
    ]
   },
   {
    "key": "finish",
    "label": "마무리",
    "desc": "실리콘, 입주청소, 새집증후군",
    "lines": [
     "silicone",
     "clean",
     "sickhouse"
    ]
   },
   {
    "key": "life",
    "label": "발코니·생활용품",
    "desc": "빨래건조대, 블라인드",
    "lines": [
     "dryer",
     "blind"
    ]
   },
   {
    "key": "out",
    "label": "기타 외주 공사",
    "desc": "업체 견적 금액 입력",
    "lines": [
     "outsource"
    ]
   }
  ]
 },
 "alias": {
  "관리사무소 공사신고·엘베사용료": "관리사무소 신고·엘리베이터 사용료",
  "철거 폐기물 (1톤)": "철거 쓰레기 반출 (1톤 트럭)",
  "창호 시공 인건비": "창호 시공 작업비 (1명 하루)",
  "목수 인건비": "목수 작업비 (1명 하루)",
  "전기 인건비": "전기 작업비 (1명 하루)",
  "전체 조명 자재": "기본 조명 세트 (방·거실·주방·현관·발코니)",
  "3인치 COB 매입등": "천장 매입등",
  "T5 간접조명": "간접조명",
  "초슬림 3연동 중문": "3연동 슬라이딩 중문",
  "원슬라이딩 중문": "한쪽 슬라이딩 중문",
  "ㄱ자 3연동 중문": "ㄱ자 슬라이딩 중문 (가벽 포함)",
  "폴딩도어": "접이식 중문",
  "번호키 밀레 M-500": "번호키 밀레",
  "타일 인건비 (기공)": "타일 작업비 (1명 하루)",
  "600각 포세린 타일": "정사각 타일 60×60cm (엑셀 단가)",
  "300×600 벽타일": "직사각 타일 30×60cm (엑셀 단가)",
  "300각 바닥·발코니 타일": "작은 바닥 타일 30×30cm (엑셀 단가)",
  "도기세팅 인건비": "욕실 설치비 (포세린 타일 욕실)",
  "SMC 돔천장": "욕실 돔천장",
  "LED 거울": "LED 조명 거울",
  "유리 파티션 (일반)": "유리 칸막이",
  "ㄱ자 젠다이 유리 파티션": "ㄱ자 유리 칸막이 (선반형)",
  "장판 1.8T": "장판 얇은 것 (1.8mm)",
  "장판 2.2T (LX 자연애 등)": "장판 보통 (2.2mm)",
  "장판 2.7T": "장판 조금 두꺼운 것 (2.7mm)",
  "장판 3.2T": "장판 두꺼운 것 (3.2mm)",
  "장판 4.5T": "장판 아주 두꺼운 것 (4.5mm)",
  "장판 5T": "장판 최고 두께 (5mm)",
  "강마루 (동화 나투스진 7T)": "강마루 (나무 마루)",
  "돌마루 (에디톤 스톤 5T)": "돌마루 (돌 느낌 마루)",
  "데코타일 3T": "데코타일 (얇은 바닥 타일)",
  "바닥 인건비": "바닥 작업비 (1명 하루)",
  "실크 도배 (LX 베스띠급)": "실크 벽지 (일반)",
  "디아망 도배 (프리미엄)": "실크 벽지 (고급)",
  "합지 도배": "합지 벽지 (저렴)",
  "도배 인건비": "도배 작업비 (1명 하루)",
  "필름 인건비": "필름 작업비 (1명 하루)",
  "600×1200 포세린 타일": "대형 타일 60×120cm (추정 단가)",
  "설비 인건비": "설비 작업비 (1명 하루)",
  "도어 시공 인건비": "도어 시공 작업비 (1명 하루)",
  "창호 시공 인건비 (1인)": "창호 시공 작업비 (1명 하루)",
  "식대": "작업자 식대",
  "공정간 폐기물 처리 (1회)": "공사 중 쓰레기 반출 (1회)",
  "인토 투피스 양변기 C-941": "인토 투피스 양변기",
  "인토 원피스 양변기 C-1002": "인토 원피스 양변기",
  "인토 일체형 세면기 L-336-1 사각": "인토 세면대 사각",
  "인토 일체형 세면기 L-337-1 라운드": "인토 세면대 라운드",
  "이녹스 일체형 세면기 L-2210 사각": "이녹스 세면대 사각",
  "대림 반다리 세면기 370 사각": "대림 반다리 세면대 370 사각",
  "대림 반다리 세면기 384 라운드": "대림 반다리 세면대 384 라운드",
  "라우체 반다리 세면기 지니": "라우체 반다리 세면대 지니",
  "라우체 반다리 세면기 위니": "라우체 반다리 세면대 위니",
  "라우체 세면기 코니": "라우체 세면대 코니",
  "아메리칸 반다리 세면기 플랫 516 사각": "아메리칸 반다리 세면대 플랫 516 사각",
  "아메리칸 반다리 세면기 웨이브R": "아메리칸 반다리 세면대 웨이브R",
  "베르사츠 원홀 세면수전 BSL-1001": "베르사츠 세면대 수전",
  "베르사츠 원홀 세면수전 BSL-5001": "베르사츠 세면대 수전",
  "베르사츠 원홀 세면기 좌우이동 BSL-3001": "베르사츠 원홀 세면대 좌우이동",
  "에떼르노 원홀수전 E7-1001": "에떼르노 세면대 수전 E7-1001",
  "에떼르노 원홀수전 E9-1001": "에떼르노 세면대 수전 E9-1001",
  "베르사츠 샤워수전 BSB-1006": "베르사츠 샤워수전",
  "베르사츠 샤워기 BSB-3005": "베르사츠 샤워기",
  "베르사츠 샤워기 BSB-5005": "베르사츠 샤워기",
  "베르사츠 해바라기 샤워기 BSB-2009": "베르사츠 해바라기 샤워기",
  "베르사츠 해바라기 샤워기 BSB-6009": "베르사츠 해바라기 샤워기",
  "베르사츠 슬라이드바 원형 BSA-1000-1": "베르사츠 슬라이드바 원형",
  "베르사츠 슬라이드바 사각 BSA-2000": "베르사츠 슬라이드바 사각",
  "에떼르노 슬라이드바 ESSB-100": "에떼르노 슬라이드바",
  "베르사츠 수건걸이 원형 BSA-100": "베르사츠 수건걸이 원형",
  "베르사츠 수건걸이 사각 BSA-200": "베르사츠 수건걸이 사각",
  "베르사츠 휴지걸이 BSA-100": "베르사츠 휴지걸이",
  "베르사츠 이단 수건선반 BSA-006": "베르사츠 이단 수건선반",
  "베르사츠 코너선반 BSA-002": "베르사츠 코너선반",
  "베르사츠 옷걸이 BSA-100": "베르사츠 옷걸이",
  "댐퍼 슬라이드장 1200×800": "거울 슬라이드장 120×80cm",
  "플랩장 1200×500": "거울 여닫이장 120×50cm",
  "플랩장 1200×600": "거울 여닫이장 120×60cm",
  "림바스 타일 300×600": "직사각 타일 30×60cm",
  "림바스 타일 600×600": "정사각 타일 60×60cm",
  "림바스 타일 600×1200·800×800": "대형 타일 60×120cm",
  "림바스 타일 300×300": "작은 바닥 타일 30×30cm",
  "예림 ABS 민자 문짝 35T": "ABS 기본 민자도어",
  "예림 목재 민자 문짝 36T": "목재 문짝",
  "예림 히든도어 45T ABS": "히든도어 (벽과 같은 면)",
  "문짝 시트 옵션 비칼라·메탈": "색상 추가 (비칼라·메탈)",
  "문짝 시트 옵션 HP": "색상 추가 (HP)",
  "문짝 시트 옵션 매트": "색상 추가 (매트)",
  "도어 경첩": "경첩",
  "도어 손잡이·실린더": "손잡이",
  "도어 시공비 (짝당)": "문 설치비 (1짝)",
  "예림 ABS 문틀 110바 식기무": "문틀 두께 11cm",
  "예림 ABS 문틀 110바 식기유": "문틀 두께 11cm (욕실용 턱)",
  "예림 ABS 문틀 130바 식기무": "문틀 두께 13cm",
  "예림 ABS 문틀 130바 식기유": "문틀 두께 13cm (욕실용 턱)",
  "예림 ABS 문틀 140바 식기무": "문틀 두께 14cm",
  "예림 ABS 문틀 140바 식기유": "문틀 두께 14cm (욕실용 턱)",
  "예림 ABS 문틀 155바 식기무": "문틀 두께 15.5cm",
  "예림 ABS 문틀 155바 식기유": "문틀 두께 15.5cm (욕실용 턱)",
  "예림 ABS 문틀 175바 식기무": "문틀 두께 17.5cm",
  "예림 ABS 문틀 175바 식기유": "문틀 두께 17.5cm (욕실용 턱)",
  "예림 ABS 문틀 195바 식기무": "문틀 두께 19.5cm",
  "예림 ABS 문틀 195바 식기유": "문틀 두께 19.5cm (욕실용 턱)",
  "예림 ABS 문틀 210바 식기무": "문틀 두께 21cm",
  "예림 ABS 문틀 210바 식기유": "문틀 두께 21cm (욕실용 턱)",
  "예림 ABS 문틀 230바 식기무": "문틀 두께 23cm",
  "예림 ABS 문틀 230바 식기유": "문틀 두께 23cm (욕실용 턱)",
  "예림 ABS 문틀 245바 식기무": "문틀 두께 24.5cm",
  "예림 ABS 문틀 245바 식기유": "문틀 두께 24.5cm (욕실용 턱)",
  "예림 발포 슬림문틀 식기무": "슬림 문틀 (얇은 테두리)",
  "예림 히든문틀 110바": "히든도어 문틀 11cm",
  "예림 히든문틀 140바": "히든도어 문틀 14cm",
  "예림 히든문틀 170바": "히든도어 문틀 17cm",
  "예림 히든문틀 200바": "히든도어 문틀 20cm",
  "예림 히든문틀 230바": "히든도어 문틀 23cm",
  "예림 히든문틀 260바": "히든도어 문틀 26cm",
  "예림 히든문틀 290바": "히든도어 문틀 29cm",
  "예림 평몰딩 30": "평몰딩 3cm",
  "예림 평몰딩 40": "평몰딩 4cm",
  "예림 평몰딩 50": "일자 몰딩 5cm",
  "예림 천정몰딩 1번": "계단형 천장 몰딩 8cm",
  "예림 마이너스 몰딩": "마이너스 몰딩 (몰딩 없는 느낌)",
  "예림 걸레받이 40": "걸레받이 4cm",
  "예림 걸레받이 60": "걸레받이 6cm",
  "예림 걸레받이 90": "걸레받이 9cm",
  "예림 강화마루용 걸레받이": "마루용 걸레받이",
  "예림 평문선 40": "문선 4cm",
  "예림 평문선 60": "문선 6cm",
  "예림 인테리어필름 기본칼라": "필름 기본색",
  "예림 인테리어필름 비칼라·메탈": "필름 비칼라·메탈",
  "예림 인테리어필름 매트 HE407": "필름 매트 HE407",
  "예림 인테리어필름 벨로체 L-100": "필름 벨로체 L-100",
  "예림 인테리어필름 벨로체 L-400": "필름 벨로체 L-400",
  "예림 인테리어필름 방염시트": "필름 방염시트",
  "예림 인테리어필름 방염 FHE407": "필름 방염 FHE407",
  "사다리차 기본시간": "사다리차 기본 1시간",
  "사다리차 반대 4시간": "사다리차 반대 4시간",
  "사다리차 일대 8시간": "사다리차 일대 8시간",
  "M20 마그네틱 / A타입 레일 1M": "마그네틱 / A타입 레일 1M",
  "M20 마그네틱 / A타입 레일 2M": "마그네틱 / A타입 레일 2M",
  "M20 마그네틱 / A타입 레일 3M": "마그네틱 / A타입 레일 3M",
  "M20 마그네틱 / B타입 날개형 레일 1M": "마그네틱 / B타입 날개형 레일 1M",
  "M20 마그네틱 / B타입 날개형 레일 2M": "마그네틱 / B타입 날개형 레일 2M",
  "M20 마그네틱 / B타입 날개형 레일 3M": "마그네틱 / B타입 날개형 레일 3M",
  "M20 마그네틱 / 라인 확산 12W [L300]": "마그네틱 / 라인 확산 12W []",
  "M20 마그네틱 / 라인 확산 24W [L600]": "마그네틱 / 라인 확산 24W []",
  "M20 마그네틱 / 라인 확산 30W [L900]": "마그네틱 / 라인 확산 30W []",
  "M20 마그네틱 / 라인 확산 40W [L1200]": "마그네틱 / 라인 확산 40W []",
  "M20 마그네틱 / 멀티 집중 6W [L110]": "마그네틱 / 멀티 집중 6W []",
  "M20 마그네틱 / 멀티 집중 12W [L220]": "마그네틱 / 멀티 집중 12W []",
  "M20 마그네틱 / 멀티 집중 18W [L330]": "마그네틱 / 멀티 집중 18W []",
  "M20 마그네틱 / 멀티 집중 24W [L440]": "마그네틱 / 멀티 집중 24W []",
  "M20 마그네틱 / 멀티 집중 30W [L550]": "마그네틱 / 멀티 집중 30W []",
  "M20 마그네틱 / 멀티 집중 36W [L660]": "마그네틱 / 멀티 집중 36W []",
  "M20 마그네틱 / 멀티 폴더 집중 6W [L112]": "마그네틱 / 멀티 폴더 집중 6W []",
  "M20 마그네틱 / 멀티 폴더 집중 12W [L225]": "마그네틱 / 멀티 폴더 집중 12W []",
  "M20 마그네틱 / 멀티 폴더 집중 18W [L325]": "마그네틱 / 멀티 폴더 집중 18W []",
  "M20 마그네틱 / 스팟 스포트 7W": "마그네틱 / 스팟 스포트 7W",
  "M20 마그네틱 / 스팟 스포트 12W": "마그네틱 / 스팟 스포트 12W",
  "M20 마그네틱 / 스팟 스포트 20W": "마그네틱 / 스팟 스포트 20W",
  "M20 마그네틱 / 공 직부 12W": "마그네틱 / 공 직부 12W",
  "M20 마그네틱 / 원반(Ø95) 집중형 스포트 9W": "마그네틱 / 원반(Ø95) 집중형 스포트 9W",
  "M20 마그네틱 / 원반(Ø95) 확산형 스포트 12W": "마그네틱 / 원반(Ø95) 확산형 스포트 12W",
  "M20 마그네틱 / 스팟 펜던트 등기구 7W": "마그네틱 / 스팟 펜던트 등기구 7W",
  "M20 마그네틱 / 스팟 펜던트 등기구 12W": "마그네틱 / 스팟 펜던트 등기구 12W",
  "M20 마그네틱 / 블루투스 스피커 [24~48v]": "마그네틱 / 블루투스 스피커 [24~48v]",
  "M20 마그네틱 / 레일형 SMPS 100W": "마그네틱 / 레일형 SMPS 100W",
  "M20 마그네틱 / 레일형 SMPS 200W": "마그네틱 / 레일형 SMPS 200W",
  "M20 마그네틱 / 전원 입력 (노출형 SMPS용)": "마그네틱 / 전원 입력 (노출형 SMPS용)",
  "M20 마그네틱 / 전원 일자 연결": "마그네틱 / 전원 일자 연결",
  "M20 마그네틱 / 전원 ㄱ자 연결": "마그네틱 / 전원 ㄱ자 연결",
  "M20 마그네틱 / 전원 T자 연결": "마그네틱 / 전원 T자 연결",
  "M20 마그네틱 / A타입 노출 레일 연결 철판": "마그네틱 / A타입 노출 레일 연결 철판",
  "M20 마그네틱 / A타입 ㄱ자 연결 부속": "마그네틱 / A타입 ㄱ자 연결 부속",
  "M20 마그네틱 / A타입 ㄱ자 연결 부속 (아웃코너)": "마그네틱 / A타입 ㄱ자 연결 부속 (아웃코너)",
  "M20 마그네틱 / A타입 ㄱ자 연결 부속 (인코너)": "마그네틱 / A타입 ㄱ자 연결 부속 (인코너)",
  "M20 마그네틱 / A타입 T자 연결 부속": "마그네틱 / A타입 T자 연결 부속",
  "M20 마그네틱 / A타입 십자 연결 부속": "마그네틱 / A타입 십자 연결 부속",
  "M20 마그네틱 / B타입 ㄱ자 연결 부속": "마그네틱 / B타입 ㄱ자 연결 부속",
  "M20 마그네틱 / B타입 ㄱ자 연결 부속 (아웃코너)": "마그네틱 / B타입 ㄱ자 연결 부속 (아웃코너)",
  "M20 마그네틱 / B타입 ㄱ자 연결 부속 (인코너)": "마그네틱 / B타입 ㄱ자 연결 부속 (인코너)",
  "M20 마그네틱 / B타입 T자 연결 부속": "마그네틱 / B타입 T자 연결 부속",
  "M20 마그네틱 / B타입 십자 연결 부속": "마그네틱 / B타입 십자 연결 부속",
  "[M15] 블랙 / 마그네틱 레일 레일 2M": "[] 블랙 / 마그네틱 레일 레일 2M",
  "[M15] 블랙 / 마그네틱 레일 레일 3M": "[] 블랙 / 마그네틱 레일 레일 3M",
  "[M15] 블랙 / 라인 확산형 등기구 L300 [6W / CCT / 24V]": "[] 블랙 / 라인 확산형 등기구 [6W / CCT / 24V]",
  "[M15] 블랙 / 라인 확산형 등기구 L600 [12W / CCT / 24V]": "[] 블랙 / 라인 확산형 등기구 [12W / CCT / 24V]",
  "[M15] 블랙 / 멀티 집중형 등기구 L300 [6W / CCT / 24V]": "[] 블랙 / 멀티 집중형 등기구 [6W / CCT / 24V]",
  "[M15] 블랙 / 멀티 집중형 등기구 L600 [12W / CCT / 24V]": "[] 블랙 / 멀티 집중형 등기구 [12W / CCT / 24V]",
  "[M15] 블랙 / 스팟 집중형 등기구 [5W / CCT / 24V]": "[] 블랙 / 스팟 집중형 등기구 [5W / CCT / 24V]",
  "[M15] 블랙 / 사이드 스팟 집중형 등기구 [8W / CCT / 24V]": "[] 블랙 / 사이드 스팟 집중형 등기구 [8W / CCT / 24V]",
  "[M15] 블랙 / 더블 스팟 집중형 등기구 [3W*2 / CCT / 24W]": "[] 블랙 / 더블 스팟 집중형 등기구 [3W*2 / CCT / 24W]",
  "[M15] 블랙 / 스팟 직부형 숏타입 등기구 [10W / CCT / 24V]": "[] 블랙 / 스팟 직부형 숏타입 등기구 [10W / CCT / 24V]",
  "[M15] 블랙 / 스팟 직부형 롱타입 등기구 [10W / CCT / 24V]": "[] 블랙 / 스팟 직부형 롱타입 등기구 [10W / CCT / 24V]",
  "[M15] 블랙 / 레일 연결 부속 ㄱ자": "[] 블랙 / 레일 연결 부속 ㄱ자",
  "[M15] 블랙 / 레일 연결 부속 ㄱ자(인코너)": "[] 블랙 / 레일 연결 부속 ㄱ자(인코너)",
  "[M15] 블랙 / 레일 연결 부속 ㄱ자(아웃코너)": "[] 블랙 / 레일 연결 부속 ㄱ자(아웃코너)",
  "[M15] 블랙 / 전원 연결 부속 / 전원 입력": "[] 블랙 / 전원 연결 부속 / 전원 입력",
  "[M15] 블랙 / 전원 연결 부속 / 일자 연결": "[] 블랙 / 전원 연결 부속 / 일자 연결",
  "[M15] 블랙 / 전원 연결 부속 / ㄱ자 연결선": "[] 블랙 / 전원 연결 부속 / ㄱ자 연결선",
  "[M15] 블랙 / 전원 연결 부속 / ㄱ자 커버 연결 / 수평전용": "[] 블랙 / 전원 연결 부속 / ㄱ자 커버 연결 / 수평전용",
  "[M15] 블랙 / 전원+레일 / ㄱ자 수평 세트": "[] 블랙 / 전원+레일 / ㄱ자 수평 세트",
  "[M15] 블랙 / 마감캡": "[] 블랙 / 마감캡",
  "[M15] 블루투스 스피커 [블랙 / DC24v~48v]": "[] 블루투스 스피커 [블랙 / DC24v~48v]",
  "[M15] 블루투스 스피커 [화이트 / DC24v~48v]": "[] 블루투스 스피커 [화이트 / DC24v~48v]",
  "[M15] 니켈 / 마그네틱 레일 레일 2M": "[] 니켈 / 마그네틱 레일 레일 2M",
  "[M15] 니켈 / 마그네틱 레일 레일 3M": "[] 니켈 / 마그네틱 레일 레일 3M",
  "[M15] 니켈 / 라인 확산형 등기구 L300 [6W / CCT / 24V]": "[] 니켈 / 라인 확산형 등기구 [6W / CCT / 24V]",
  "[M15] 니켈 / 라인 확산형 등기구 L600 [12W / CCT / 24V]": "[] 니켈 / 라인 확산형 등기구 [12W / CCT / 24V]",
  "[M15] 니켈 / 멀티 집중형 등기구 L300 [6W / CCT / 24V]": "[] 니켈 / 멀티 집중형 등기구 [6W / CCT / 24V]",
  "[M15] 니켈 / 멀티 집중형 등기구 L600 [12W / CCT / 24V]": "[] 니켈 / 멀티 집중형 등기구 [12W / CCT / 24V]",
  "[M15] 니켈 / 스팟 집중형 등기구 [5W / CCT / 24V]": "[] 니켈 / 스팟 집중형 등기구 [5W / CCT / 24V]",
  "[M15] 니켈 / 사이드 스팟 집중형 등기구 [8W / CCT / 24V]": "[] 니켈 / 사이드 스팟 집중형 등기구 [8W / CCT / 24V]",
  "[M15] 니켈 / 더블 스팟 집중형 등기구 [3W*2 / CCT / 24W]": "[] 니켈 / 더블 스팟 집중형 등기구 [3W*2 / CCT / 24W]",
  "[M15] 니켈 / 스팟 직부형 숏타입 등기구 [10W / CCT / 24V]": "[] 니켈 / 스팟 직부형 숏타입 등기구 [10W / CCT / 24V]",
  "[M15] 니켈 / 스팟 직부형 롱타입 등기구 [10W / CCT / 24V]": "[] 니켈 / 스팟 직부형 롱타입 등기구 [10W / CCT / 24V]",
  "[M15] 니켈 / 레일 연결 부속 ㄱ자": "[] 니켈 / 레일 연결 부속 ㄱ자",
  "[M15] 니켈 / 레일 연결 부속 ㄱ자(인코너)": "[] 니켈 / 레일 연결 부속 ㄱ자(인코너)",
  "[M15] 니켈 / 레일 연결 부속 ㄱ자(아웃코너)": "[] 니켈 / 레일 연결 부속 ㄱ자(아웃코너)",
  "[M15] 니켈 / 전원 연결 부속 / 전원 입력": "[] 니켈 / 전원 연결 부속 / 전원 입력",
  "[M15] 니켈 / 전원 연결 부속 / 일자 연결": "[] 니켈 / 전원 연결 부속 / 일자 연결",
  "[M15] 니켈 / 전원 연결 부속 / ㄱ자 연결선": "[] 니켈 / 전원 연결 부속 / ㄱ자 연결선",
  "[M15] 니켈 / 전원 연결 부속 / ㄱ자 커버 연결 / 수평전용": "[] 니켈 / 전원 연결 부속 / ㄱ자 커버 연결 / 수평전용",
  "[M15] 니켈 / 전원+레일 / ㄱ자 수평 세트": "[] 니켈 / 전원+레일 / ㄱ자 수평 세트",
  "[M15] 니켈 / 마감캡": "[] 니켈 / 마감캡",
  "M10 블랙 / A타입 레일 1M": "블랙 / A타입 레일 1M",
  "M10 블랙 / A타입 레일 2M": "블랙 / A타입 레일 2M",
  "M10 블랙 / A타입 레일 3M": "블랙 / A타입 레일 3M",
  "M10 블랙 / B타입 날개형 레일 1M": "블랙 / B타입 날개형 레일 1M",
  "M10 블랙 / B타입 날개형 레일 2M": "블랙 / B타입 날개형 레일 2M",
  "M10 블랙 / B타입 날개형 레일 3M": "블랙 / B타입 날개형 레일 3M",
  "M10 마그네틱 / 스팟 스포트 7W": "마그네틱 / 스팟 스포트 7W",
  "M10 마그네틱 / 스팟 스포트 10W": "마그네틱 / 스팟 스포트 10W",
  "M10 마그네틱 / 멀티 집중 6W [L150]": "마그네틱 / 멀티 집중 6W []",
  "M10 마그네틱 / 멀티 집중 12W [L300]": "마그네틱 / 멀티 집중 12W []",
  "M10 마그네틱 / 멀티 집중 18W [L430]": "마그네틱 / 멀티 집중 18W []",
  "M10 마그네틱 / 라인 확산 12W [L300]": "마그네틱 / 라인 확산 12W []",
  "M10 마그네틱 / 라인 확산 24W [L600]": "마그네틱 / 라인 확산 24W []",
  "M10 마그네틱 / ㄱ자 연결 부속": "마그네틱 / ㄱ자 연결 부속",
  "M10 마그네틱 / ㄱ자 연결 부속 (아웃코너)": "마그네틱 / ㄱ자 연결 부속 (아웃코너)",
  "M10 마그네틱 / ㄱ자 연결 부속 (인코너)": "마그네틱 / ㄱ자 연결 부속 (인코너)",
  "M10 마그네틱 / 십자 연결 부속": "마그네틱 / 십자 연결 부속",
  "M10 마그네틱 / T자 연결 부속": "마그네틱 / T자 연결 부속",
  "M10 마그네틱 / 날개형 ㄱ자 연결 부속": "마그네틱 / 날개형 ㄱ자 연결 부속",
  "M10 마그네틱 / 날개형 ㄱ자 연결 부속 (아웃코너)": "마그네틱 / 날개형 ㄱ자 연결 부속 (아웃코너)",
  "M10 마그네틱 / 날개형 ㄱ자 연결 부속 (인코너)": "마그네틱 / 날개형 ㄱ자 연결 부속 (인코너)",
  "M10 마그네틱 / 날개형 십자 연결 부속": "마그네틱 / 날개형 십자 연결 부속",
  "M10 마그네틱 / 날개형 T자 연결 부속": "마그네틱 / 날개형 T자 연결 부속",
  "M10 마그네틱 / 전원 일자 연결선": "마그네틱 / 전원 일자 연결선",
  "M10 마그네틱 / 전원 ㄱ자 연결선": "마그네틱 / 전원 ㄱ자 연결선",
  "M10 마그네틱 / 전원 입력선": "마그네틱 / 전원 입력선",
  "LED 볼구 G80 10W": "LED 볼구 10W",
  "하츠) 티오람 HMF-G500": "하츠) 티오람 HMF-",
  "하츠) 티오람 미니 HMF-J300": "하츠) 티오람 미니 HMF-",
  "F30 타카핀": "타카핀",
  "F50 타카핀": "타카핀",
  "라인조명 (M10/M20/매입형)": "라인조명 (//매입형)",
  "ST45 타카핀": "타카핀",
  "T50 타카핀": "타카핀",
  "도기세팅 인건비 (일반 타일 욕실)": "욕실 설치비 (일반 타일 욕실)",
  "방문·욕실문 교체 세트 (ABS 기본 민자도어)": "문 교체 세트 (ABS 기본 민자도어)",
  "아덱스wpm003": "도막방수제 아덱스 WPM003",
  "프라이머Q": "방수 프라이머",
  "부직포/방수테이프": "방수테이프 (모서리 보강)",
  "실란트/방수실리콘": "욕실 실리콘",
  "발코니 조명": "발코니 직부등 (LED 15W)",
  "현관 센서등": "현관 센서등 (LED 15W)",
  "장판 2.2T (평당)": "장판 보통 (2.2mm)",
  "장판 1.8T (평당)": "장판 얇은 것 (1.8mm)",
  "장판 2.7T (평당)": "장판 조금 두꺼운 것 (2.7mm)",
  "장판 3.2T (평당)": "장판 두꺼운 것 (3.2mm)",
  "장판 4.5T (평당)": "장판 아주 두꺼운 것 (4.5mm)",
  "장판 5T (평당)": "장판 최고 두께 (5mm)",
  "사다리차 추가 1시간": "사다리차 추가 시간",
  "강마루 (동화 나투스진 7T · 평당)": "강마루 (나무 마루 · 시공비 포함)"
 },
 "company": {
  "name": "시도디자인",
  "tel": "1588-8604",
  "addr": "",
  "account": "",
  "manager": ""
 },
 "settings": {
  "bizProfit": 0.07,
  "vat": 0.1,
  "roundUnit": 10000,
  "laborBuffer": 1,
  "bufferItems": [
   "목수 인건비",
   "전기 인건비",
   "타일 인건비 (기공)",
   "도배 인건비",
   "바닥 인건비",
   "필름 인건비"
  ]
 },
 "catalog": [
  {
   "id": "i001",
   "proc": "가설",
   "name": "보양작업",
   "spec": "엘리베이터 및 공용부 보양작업",
   "unit": "식",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "i002",
   "proc": "가설",
   "name": "내부 바닥 보양",
   "spec": "폴라베니아 내부 바닥 보양",
   "unit": "㎡",
   "kind": "경비",
   "price": 3200
  },
  {
   "id": "i003",
   "proc": "가설",
   "name": "공사동의서",
   "spec": "아파트 입주민 / 관리사무소 공사동의서",
   "unit": "식",
   "kind": "경비",
   "price": 300000
  },
  {
   "id": "i004",
   "proc": "가설",
   "name": "관리사무소 공사신고·엘베사용료",
   "spec": "아파트별 금액 상이 (예치금, 엘베사용료)",
   "unit": "식",
   "kind": "경비",
   "price": 100000
  },
  {
   "id": "i005",
   "proc": "가설",
   "name": "물류비",
   "spec": "건축용 자재 물류비, 운반비",
   "unit": "식",
   "kind": "경비",
   "price": 100000
  },
  {
   "id": "i006",
   "proc": "가설",
   "name": "사다리차 (8층 이하)",
   "spec": "",
   "unit": "회",
   "kind": "경비",
   "price": 181000
  },
  {
   "id": "i007",
   "proc": "가설",
   "name": "사다리차 (10층 이상)",
   "spec": "",
   "unit": "회",
   "kind": "경비",
   "price": 160000
  },
  {
   "id": "i008",
   "proc": "철거",
   "name": "부분 철거",
   "spec": "상부몰딩, 도어, 도배, 장판 등",
   "unit": "㎡",
   "kind": "노무",
   "price": 6700
  },
  {
   "id": "i009",
   "proc": "철거",
   "name": "전체 철거",
   "spec": "현관·바닥·신발장·도어·몰딩 전체",
   "unit": "㎡",
   "kind": "노무",
   "price": 15000
  },
  {
   "id": "i010",
   "proc": "철거",
   "name": "욕실 철거 (1칸)",
   "spec": "욕실 전체 철거",
   "unit": "칸",
   "kind": "노무",
   "price": 626000
  },
  {
   "id": "i011",
   "proc": "철거",
   "name": "바닥 철거 및 샌딩",
   "spec": "강마루 등 바닥재 철거 + 샌딩 / 평당",
   "unit": "평",
   "kind": "노무",
   "price": 35000
  },
  {
   "id": "i012",
   "proc": "철거",
   "name": "철거 폐기물 (1톤)",
   "spec": "1톤 트럭 폐기물",
   "unit": "회",
   "kind": "노무",
   "price": 209000
  },
  {
   "id": "i013",
   "proc": "철거",
   "name": "석면 철거",
   "spec": "석면 철거 및 폐기물",
   "unit": "식",
   "kind": "노무",
   "price": 348000
  },
  {
   "id": "i014",
   "proc": "설비",
   "name": "욕실 방수",
   "spec": "욕실 1칸 / 1차 방수·아덱스 WPM003·방수테이프·실리콘 포함 / 1칸 70만 원, 2칸 이상은 칸당 60만 원",
   "unit": "칸",
   "kind": "자재",
   "price": 600000,
   "tier": [
    [
     0,
     1,
     700000
    ],
    [
     2,
     999,
     600000
    ]
   ]
  },
  {
   "id": "i015",
   "proc": "설비",
   "name": "젠다이 시공",
   "spec": "욕실 젠다이 시공 / 자재 포함",
   "unit": "칸",
   "kind": "노무",
   "price": 399000
  },
  {
   "id": "i016",
   "proc": "설비",
   "name": "미장작업",
   "spec": "몰딩·바닥 미장",
   "unit": "식",
   "kind": "노무",
   "price": 342000
  },
  {
   "id": "i017",
   "proc": "설비",
   "name": "수평몰탈 시공",
   "spec": "셀프레벨링",
   "unit": "식",
   "kind": "노무",
   "price": 228000
  },
  {
   "id": "i018",
   "proc": "설비",
   "name": "엑셀배관 증설",
   "spec": "확장부 난방 배관",
   "unit": "식",
   "kind": "자재",
   "price": 285000
  },
  {
   "id": "i019",
   "proc": "설비",
   "name": "설비 자재·부자재",
   "spec": "엑셀배관, 엘보, 소켓, 유니온 등",
   "unit": "식",
   "kind": "자재",
   "price": 137000
  },
  {
   "id": "i020",
   "proc": "설비",
   "name": "욕조 설치",
   "spec": "철거·자재 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 774000
  },
  {
   "id": "i021",
   "proc": "창호",
   "name": "창호 (업체 견적)",
   "spec": "업체 견적 기준 / 철거·시공·코킹 포함",
   "unit": "식",
   "kind": "자재",
   "price": 0,
   "costVar": "window",
   "m": 0.128
  },
  {
   "id": "i022",
   "proc": "창호",
   "name": "창호 철거",
   "spec": "예림 기준",
   "unit": "틀",
   "kind": "노무",
   "price": 40000
  },
  {
   "id": "i023",
   "proc": "창호",
   "name": "창호 시공 인건비",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 287000
  },
  {
   "id": "i024",
   "proc": "창호",
   "name": "외부 코킹 및 부자재",
   "spec": "실리콘, 폼, 고임목, 칼블럭 등",
   "unit": "식",
   "kind": "자재",
   "price": 115000
  },
  {
   "id": "i025",
   "proc": "창호",
   "name": "터닝도어",
   "spec": "미스트 유리 기준 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 516000
  },
  {
   "id": "i026",
   "proc": "목공",
   "name": "목수 인건비",
   "spec": "목수 1명 하루 / 1명만 들어가면 35만 원, 2명부터 1명 30만 원",
   "unit": "인",
   "kind": "노무",
   "price": 300000,
   "tier": [
    [
     0,
     1.49,
     350000
    ],
    [
     1.5,
     99999,
     300000
    ]
   ]
  },
  {
   "id": "i027",
   "proc": "목공",
   "name": "상하부 몰딩 목작업",
   "spec": "상하부 몰딩 시공",
   "unit": "식",
   "kind": "노무",
   "price": 364000
  },
  {
   "id": "i028",
   "proc": "목공",
   "name": "평천장(중천장) 목작업",
   "spec": "거실 평천장",
   "unit": "식",
   "kind": "노무",
   "price": 364000
  },
  {
   "id": "i029",
   "proc": "목공",
   "name": "벽체 단열작업 (1면)",
   "spec": "아이소핑크 단열 + 석고 마감",
   "unit": "식",
   "kind": "노무",
   "price": 390000
  },
  {
   "id": "i030",
   "proc": "목공",
   "name": "목자재 납품",
   "spec": "각재, 석고보드, MDF, 합판",
   "unit": "식",
   "kind": "자재",
   "price": 390000
  },
  {
   "id": "i031",
   "proc": "목공",
   "name": "부자재 및 장비대",
   "spec": "타카핀, 목공본드, 폼본드, 마대 등",
   "unit": "식",
   "kind": "자재",
   "price": 39000
  },
  {
   "id": "i032",
   "proc": "목공",
   "name": "하부 걸레받이",
   "spec": "예림 걸레받이",
   "unit": "식",
   "kind": "자재",
   "price": 91000
  },
  {
   "id": "i033",
   "proc": "목공",
   "name": "각재 30×30",
   "spec": "8자 / 20개",
   "unit": "단",
   "kind": "자재",
   "price": 54000
  },
  {
   "id": "i034",
   "proc": "목공",
   "name": "석고보드 9.5T",
   "spec": "900×1800",
   "unit": "장",
   "kind": "자재",
   "price": 5200
  },
  {
   "id": "i035",
   "proc": "목공",
   "name": "MDF 9T",
   "spec": "반장",
   "unit": "장",
   "kind": "자재",
   "price": 16000
  },
  {
   "id": "i036",
   "proc": "목공",
   "name": "일반합판 9T",
   "spec": "4자×8자",
   "unit": "장",
   "kind": "자재",
   "price": 28000
  },
  {
   "id": "i037",
   "proc": "목공",
   "name": "아이소핑크 50T",
   "spec": "단열재",
   "unit": "장",
   "kind": "자재",
   "price": 19000
  },
  {
   "id": "i038",
   "proc": "목공",
   "name": "평몰딩 30mm",
   "spec": "천장 몰딩",
   "unit": "EA",
   "kind": "자재",
   "price": 2900
  },
  {
   "id": "i039",
   "proc": "목공",
   "name": "평몰딩 40mm",
   "spec": "바닥 몰딩",
   "unit": "EA",
   "kind": "자재",
   "price": 3100
  },
  {
   "id": "i040",
   "proc": "전기",
   "name": "전기 인건비",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "i041",
   "proc": "전기",
   "name": "전기 자재",
   "spec": "콘센트, 스위치 전체",
   "unit": "식",
   "kind": "자재",
   "price": 237000
  },
  {
   "id": "i042",
   "proc": "전기",
   "name": "전기 부자재",
   "spec": "절연테이프, 전선 연장재, 와이어 커넥터",
   "unit": "식",
   "kind": "자재",
   "price": 86000
  },
  {
   "id": "i043",
   "proc": "전기",
   "name": "전체 조명 자재",
   "spec": "거실등, 주방등, 방등, 현관센서등, 발코니등",
   "unit": "식",
   "kind": "자재",
   "price": 313000
  },
  {
   "id": "i044",
   "proc": "전기",
   "name": "3인치 COB 매입등",
   "spec": "확산형 다운라이트",
   "unit": "EA",
   "kind": "자재",
   "price": 5400
  },
  {
   "id": "i045",
   "proc": "전기",
   "name": "2인치 COB 다운라이트",
   "spec": "5W",
   "unit": "EA",
   "kind": "자재",
   "price": 4300
  },
  {
   "id": "i046",
   "proc": "전기",
   "name": "LED 플렉시블 간접등",
   "spec": "중천장 간접조명",
   "unit": "식",
   "kind": "자재",
   "price": 76000
  },
  {
   "id": "i047",
   "proc": "전기",
   "name": "T5 간접조명",
   "spec": "우물천장·신발장 하부",
   "unit": "식",
   "kind": "자재",
   "price": 108000
  },
  {
   "id": "i048",
   "proc": "전기",
   "name": "라인조명",
   "spec": "거실·주방",
   "unit": "M",
   "kind": "자재",
   "price": 54000
  },
  {
   "id": "i049",
   "proc": "전기",
   "name": "실링팬",
   "spec": "로슬러 프라임2 52인치 / 리모컨 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 273000
  },
  {
   "id": "i050",
   "proc": "전기",
   "name": "스위치 회로분리",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 54000
  },
  {
   "id": "i051",
   "proc": "전기",
   "name": "인터폰 7인치 교체",
   "spec": "도어락 연동 / 마감판 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 313000
  },
  {
   "id": "i052",
   "proc": "도어",
   "name": "예림 ABS 민자도어세트",
   "spec": "문짝·문틀(155바) / 경첩·손잡이 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 272000
  },
  {
   "id": "i053",
   "proc": "도어",
   "name": "욕실 ABS 민자도어세트",
   "spec": "식기유 / 경첩·손잡이 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 278000
  },
  {
   "id": "i054",
   "proc": "도어",
   "name": "슬림 발포 ABS 민자도어세트",
   "spec": "크림화이트 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 306000
  },
  {
   "id": "i055",
   "proc": "도어",
   "name": "ABS 민자도어 (문짝 교체)",
   "spec": "경첩·손잡이 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 159000
  },
  {
   "id": "i056",
   "proc": "도어",
   "name": "문틀 폭 추가 (195바 초과)",
   "spec": "틀 1개당",
   "unit": "틀",
   "kind": "자재",
   "price": 17000
  },
  {
   "id": "i057",
   "proc": "도어",
   "name": "초슬림 3연동 중문",
   "spec": "1300×2300 기준 / 기본형 · 일반 유리 (85만 원부터)",
   "unit": "EA",
   "kind": "자재",
   "price": 850000
  },
  {
   "id": "i058",
   "proc": "도어",
   "name": "원슬라이딩 중문",
   "spec": "1300×2300 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 850000
  },
  {
   "id": "i059",
   "proc": "도어",
   "name": "ㄱ자 3연동 중문",
   "spec": "가벽 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 1436000
  },
  {
   "id": "i060",
   "proc": "도어",
   "name": "폴딩도어",
   "spec": "기본 사이즈 / 모루유리 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 1078000
  },
  {
   "id": "i061",
   "proc": "도어",
   "name": "방화문 EGI 100바 세트",
   "spec": "철거·자재·시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 397000
  },
  {
   "id": "i062",
   "proc": "도어",
   "name": "도어클로저 (논스톱)",
   "spec": "K630 국산",
   "unit": "EA",
   "kind": "자재",
   "price": 22000
  },
  {
   "id": "i063",
   "proc": "도어",
   "name": "번호키 밀레 M-500",
   "spec": "시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 65000
  },
  {
   "id": "i064",
   "proc": "도어",
   "name": "도어락 교체 (지문)",
   "spec": "베스틴 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 318000
  },
  {
   "id": "i065",
   "proc": "도어",
   "name": "세이프도어 (스텐 헤어)",
   "spec": "900×2100",
   "unit": "EA",
   "kind": "자재",
   "price": 238000
  },
  {
   "id": "i066",
   "proc": "도어",
   "name": "강화도어",
   "spec": "900×2100",
   "unit": "EA",
   "kind": "자재",
   "price": 142000
  },
  {
   "id": "i067",
   "proc": "타일",
   "name": "타일 인건비 (기공)",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "i068",
   "proc": "타일",
   "name": "타일 인건비 (조공)",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 200000
  },
  {
   "id": "i069",
   "proc": "타일",
   "name": "600각 포세린 타일",
   "spec": "바닥·벽",
   "unit": "BOX",
   "kind": "자재",
   "price": 30000
  },
  {
   "id": "i070",
   "proc": "타일",
   "name": "300×600 벽타일",
   "spec": "욕실 벽체",
   "unit": "BOX",
   "kind": "자재",
   "price": 25000
  },
  {
   "id": "i071",
   "proc": "타일",
   "name": "300각 바닥·발코니 타일",
   "spec": "",
   "unit": "BOX",
   "kind": "자재",
   "price": 20000
  },
  {
   "id": "i072",
   "proc": "타일",
   "name": "타일 부자재",
   "spec": "타일 면적 1㎡당 / 압착시멘트·몰탈·본드·메지·코너비드·실리콘 (600각은 에폭시 포함)",
   "unit": "㎡",
   "kind": "자재",
   "price": 9000
  },
  {
   "id": "i073",
   "proc": "타일",
   "name": "욕실 덧방 시공 (1칸)",
   "spec": "포세린 1칸",
   "unit": "칸",
   "kind": "노무",
   "price": 262000
  },
  {
   "id": "i074",
   "proc": "타일",
   "name": "압착시멘트",
   "spec": "20kg",
   "unit": "포",
   "kind": "자재",
   "price": 6800
  },
  {
   "id": "i075",
   "proc": "타일",
   "name": "타일본드",
   "spec": "내장용",
   "unit": "말",
   "kind": "자재",
   "price": 19000
  },
  {
   "id": "i076",
   "proc": "욕실",
   "name": "도기세팅 인건비",
   "spec": "욕실 한 칸 설비 풀세팅 기준",
   "unit": "칸",
   "kind": "노무",
   "price": 350000
  },
  {
   "id": "i077",
   "proc": "욕실",
   "name": "SMC 돔천장",
   "spec": "SMC 돔천장",
   "unit": "EA",
   "kind": "자재",
   "price": 300000
  },
  {
   "id": "i078",
   "proc": "욕실",
   "name": "세면대 (사각 반다리)",
   "spec": "인토/이녹스",
   "unit": "EA",
   "kind": "자재",
   "price": 137000
  },
  {
   "id": "i079",
   "proc": "욕실",
   "name": "세면대 (언더볼)",
   "spec": "이누스",
   "unit": "EA",
   "kind": "자재",
   "price": 114000
  },
  {
   "id": "i080",
   "proc": "욕실",
   "name": "세면수전 (원홀)",
   "spec": "에떼르노 E7-1001",
   "unit": "EA",
   "kind": "자재",
   "price": 80000
  },
  {
   "id": "i081",
   "proc": "욕실",
   "name": "샤워수전 + 슬라이드바",
   "spec": "에떼르노 E7-1005 / 베르사츠 슬라이드바",
   "unit": "EA",
   "kind": "자재",
   "price": 167000
  },
  {
   "id": "i082",
   "proc": "욕실",
   "name": "양변기 (투피스 치마형)",
   "spec": "인토/이녹스",
   "unit": "EA",
   "kind": "자재",
   "price": 148000
  },
  {
   "id": "i083",
   "proc": "욕실",
   "name": "슬라이드 거울장",
   "spec": "1200×800",
   "unit": "EA",
   "kind": "자재",
   "price": 108000
  },
  {
   "id": "i084",
   "proc": "욕실",
   "name": "LED 거울",
   "spec": "600×800",
   "unit": "EA",
   "kind": "자재",
   "price": 137000
  },
  {
   "id": "i085",
   "proc": "욕실",
   "name": "욕실 악세서리 세트",
   "spec": "수건걸이, 휴지걸이, 라인유가, 방우콘센트",
   "unit": "세트",
   "kind": "자재",
   "price": 95000
  },
  {
   "id": "i086",
   "proc": "욕실",
   "name": "수건걸이",
   "spec": "베르사츠 무광",
   "unit": "EA",
   "kind": "자재",
   "price": 31000
  },
  {
   "id": "i087",
   "proc": "욕실",
   "name": "청소스프레이건",
   "spec": "무광니켈 청소건 (스프링호스)",
   "unit": "EA",
   "kind": "경비",
   "price": 25000
  },
  {
   "id": "i088",
   "proc": "욕실",
   "name": "환풍기 (힘펠 플렉스)",
   "spec": "C2-100LF MD-N",
   "unit": "EA",
   "kind": "자재",
   "price": 65000
  },
  {
   "id": "i089",
   "proc": "욕실",
   "name": "환풍기 (휴젠트 온풍)",
   "spec": "힘펠 휴젠뜨2 2.5 복합 환풍기 / 욕실 온풍·제습",
   "unit": "EA",
   "kind": "자재",
   "price": 360000
  },
  {
   "id": "i090",
   "proc": "욕실",
   "name": "유리 파티션 (일반)",
   "spec": "투명 강화유리 파티션",
   "unit": "EA",
   "kind": "자재",
   "price": 250000
  },
  {
   "id": "i091",
   "proc": "욕실",
   "name": "ㄱ자 젠다이 유리 파티션",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 251000
  },
  {
   "id": "i092",
   "proc": "욕실",
   "name": "샤워부스",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 262000
  },
  {
   "id": "i093",
   "proc": "욕실",
   "name": "인조대리석 젠다이 선반",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 80000
  },
  {
   "id": "i094",
   "proc": "욕실",
   "name": "아크릴 욕조 (이동식)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 541000
  },
  {
   "id": "i095",
   "proc": "바닥",
   "name": "장판 1.8T",
   "spec": "저가형",
   "unit": "㎡",
   "kind": "자재",
   "price": 8300
  },
  {
   "id": "i096",
   "proc": "바닥",
   "name": "장판 2.2T (LX 자연애 등)",
   "spec": "일반형 / 본드·실리콘 포함",
   "unit": "㎡",
   "kind": "자재",
   "price": 16100
  },
  {
   "id": "i097",
   "proc": "바닥",
   "name": "장판 2.7T",
   "spec": "중급형",
   "unit": "㎡",
   "kind": "자재",
   "price": 26400
  },
  {
   "id": "i098",
   "proc": "바닥",
   "name": "장판 3.2T",
   "spec": "고급형",
   "unit": "㎡",
   "kind": "자재",
   "price": 31000
  },
  {
   "id": "i099",
   "proc": "바닥",
   "name": "장판 4.5T",
   "spec": "시공 평당 13,000원 별도",
   "unit": "㎡",
   "kind": "자재",
   "price": 36800
  },
  {
   "id": "i100",
   "proc": "바닥",
   "name": "장판 5T",
   "spec": "시공 평당 15,000원 별도",
   "unit": "㎡",
   "kind": "자재",
   "price": 41400
  },
  {
   "id": "i101",
   "proc": "바닥",
   "name": "강마루 (동화 나투스진 7T)",
   "spec": "평당 12만 원 (시공 인건비 포함)",
   "unit": "㎡",
   "kind": "자재",
   "price": 36300
  },
  {
   "id": "i102",
   "proc": "바닥",
   "name": "강마루 보양",
   "spec": "종이보양",
   "unit": "㎡",
   "kind": "자재",
   "price": 1200
  },
  {
   "id": "i103",
   "proc": "바닥",
   "name": "돌마루 (에디톤 스톤 5T)",
   "spec": "",
   "unit": "㎡",
   "kind": "자재",
   "price": 52000
  },
  {
   "id": "i104",
   "proc": "바닥",
   "name": "데코타일 3T",
   "spec": "보타닉 / 시공 평당 11,000원 포함",
   "unit": "㎡",
   "kind": "자재",
   "price": 14000
  },
  {
   "id": "i105",
   "proc": "바닥",
   "name": "바닥 인건비",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "i106",
   "proc": "바닥",
   "name": "바닥 부자재",
   "spec": "접착제, 프라이머, 실리콘",
   "unit": "식",
   "kind": "자재",
   "price": 53000
  },
  {
   "id": "i107",
   "proc": "도배",
   "name": "실크 도배 (LX 베스띠급)",
   "spec": "벽지 자재",
   "unit": "㎡",
   "kind": "자재",
   "price": 3000
  },
  {
   "id": "i108",
   "proc": "도배",
   "name": "디아망 도배 (프리미엄)",
   "spec": "LX 디아망",
   "unit": "㎡",
   "kind": "자재",
   "price": 4600
  },
  {
   "id": "i109",
   "proc": "도배",
   "name": "합지 도배",
   "spec": "광폭/소폭",
   "unit": "㎡",
   "kind": "자재",
   "price": 2300
  },
  {
   "id": "i110",
   "proc": "도배",
   "name": "천정지 도배",
   "spec": "실크 천정지",
   "unit": "㎡",
   "kind": "자재",
   "price": 1700
  },
  {
   "id": "i111",
   "proc": "도배",
   "name": "도배 부자재",
   "spec": "초배지, 도배풀, 실리콘, 커버링테이프 등",
   "unit": "㎡",
   "kind": "자재",
   "price": 1300
  },
  {
   "id": "i112",
   "proc": "도배",
   "name": "도배 인건비",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "i113",
   "proc": "필름",
   "name": "필름 자재",
   "spec": "예림 기본색상",
   "unit": "㎡",
   "kind": "자재",
   "price": 9900
  },
  {
   "id": "i114",
   "proc": "필름",
   "name": "필름 인건비",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "i115",
   "proc": "필름",
   "name": "필름 부자재",
   "spec": "프라이머, 퍼티, 본드, 샌딩페이퍼 등",
   "unit": "식",
   "kind": "자재",
   "price": 25000
  },
  {
   "id": "i116",
   "proc": "가구",
   "name": "싱크대",
   "spec": "자당 / 기본 싱크대·4way 폭포수전·후드 포함",
   "unit": "자",
   "kind": "자재",
   "price": 250000
  },
  {
   "id": "i117",
   "proc": "가구",
   "name": "신발장",
   "spec": "신발장 1식 (평균 기준)",
   "unit": "식",
   "kind": "자재",
   "price": 680000
  },
  {
   "id": "i118",
   "proc": "가구",
   "name": "붙박이장 (여닫이)",
   "spec": "1통 4자 / 손잡이 별도",
   "unit": "자",
   "kind": "자재",
   "price": 145000
  },
  {
   "id": "i119",
   "proc": "가구",
   "name": "붙박이장 (슬라이딩)",
   "spec": "",
   "unit": "자",
   "kind": "자재",
   "price": 155000
  },
  {
   "id": "i120",
   "proc": "가구",
   "name": "사각 싱크볼",
   "spec": "백조 엠보 / 올스텐 배수구",
   "unit": "EA",
   "kind": "자재",
   "price": 295000
  },
  {
   "id": "i121",
   "proc": "가구",
   "name": "주방 수전 (폭포수전)",
   "spec": "하츠 폰테206 4WAY",
   "unit": "EA",
   "kind": "자재",
   "price": 79000
  },
  {
   "id": "i122",
   "proc": "가구",
   "name": "냉장고장",
   "spec": "",
   "unit": "식",
   "kind": "자재",
   "price": 1000000
  },
  {
   "id": "i123",
   "proc": "가구",
   "name": "시스템 행거",
   "spec": "기본형",
   "unit": "식",
   "kind": "자재",
   "price": 536000
  },
  {
   "id": "i124",
   "proc": "기타",
   "name": "공정간 폐기물 처리",
   "spec": "타일 후 1회, 도배 후 1회",
   "unit": "식",
   "kind": "경비",
   "price": 223000
  },
  {
   "id": "i125",
   "proc": "기타",
   "name": "탄성코트",
   "spec": "발코니 1칸 30만 원, 2칸 이상은 칸당 25만 원",
   "unit": "칸",
   "kind": "자재",
   "price": 250000,
   "tier": [
    [
     0,
     1,
     300000
    ],
    [
     2,
     999,
     250000
    ]
   ]
  },
  {
   "id": "i126",
   "proc": "기타",
   "name": "마감 실리콘 작업",
   "spec": "집 전체 실리콘 마감 / 40평 미만",
   "unit": "식",
   "kind": "노무",
   "price": 350000
  },
  {
   "id": "i127",
   "proc": "기타",
   "name": "입주청소",
   "spec": "",
   "unit": "㎡",
   "kind": "경비",
   "price": 4500
  },
  {
   "id": "i128",
   "proc": "기타",
   "name": "자동확산 소화기 (연동)",
   "spec": "설치비 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 300000
  },
  {
   "id": "i129",
   "proc": "기타",
   "name": "줄눈 시공",
   "spec": "욕실 1칸",
   "unit": "칸",
   "kind": "노무",
   "price": 178000
  },
  {
   "id": "i130",
   "proc": "기타",
   "name": "방충망 교체",
   "spec": "미세촘촘망",
   "unit": "EA",
   "kind": "자재",
   "price": 89000
  },
  {
   "id": "i131",
   "proc": "타일",
   "name": "600×1200 포세린 타일",
   "spec": "대형 타일 / 1BOX 1.44㎡",
   "unit": "BOX",
   "kind": "자재",
   "price": 40000
  },
  {
   "id": "n01",
   "proc": "가설",
   "name": "확장 행위허가 신고",
   "spec": "관리사무소·구청 신고 대행",
   "unit": "식",
   "kind": "경비",
   "price": 400000
  },
  {
   "id": "n02",
   "proc": "목공",
   "name": "아트월",
   "spec": "포인트 벽 (도배 마감 제외)",
   "unit": "식",
   "kind": "자재",
   "price": 1300000
  },
  {
   "id": "n03",
   "proc": "기타",
   "name": "도장 공사 (몰딩·문틀)",
   "spec": "페인트 작업 및 보양 포함",
   "unit": "식",
   "kind": "노무",
   "price": 2226000
  },
  {
   "id": "n04",
   "proc": "가구",
   "name": "주방 상판 교체 (인조대리석)",
   "spec": "철거·시공 포함",
   "unit": "식",
   "kind": "자재",
   "price": 1249000
  },
  {
   "id": "n05",
   "proc": "가구",
   "name": "화장대·책장",
   "spec": "맞춤 제작",
   "unit": "자",
   "kind": "자재",
   "price": 114000
  },
  {
   "id": "n06",
   "proc": "도어",
   "name": "현관 방화문 시트 작업",
   "spec": "도어 안쪽 시트",
   "unit": "식",
   "kind": "노무",
   "price": 170000
  },
  {
   "id": "n07",
   "proc": "전기",
   "name": "콘센트·전용회로 증설",
   "spec": "인덕션·식세기·에어컨 등",
   "unit": "개소",
   "kind": "노무",
   "price": 54000
  },
  {
   "id": "n08",
   "proc": "설비",
   "name": "보일러 교체",
   "spec": "콘덴싱 보일러 / 철거·시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 854000
  },
  {
   "id": "n09",
   "proc": "설비",
   "name": "분배기 교체",
   "spec": "배관 교체 포함",
   "unit": "식",
   "kind": "자재",
   "price": 399000
  },
  {
   "id": "n10",
   "proc": "설비",
   "name": "각방 온도조절기 교체",
   "spec": "조절기·구동기 교체",
   "unit": "식",
   "kind": "자재",
   "price": 683000
  },
  {
   "id": "n11",
   "proc": "설비",
   "name": "시스템에어컨 (업체 견적)",
   "spec": "업체 견적 기준 / 배관·타공 포함",
   "unit": "식",
   "kind": "자재",
   "price": 0,
   "costVar": "aircon",
   "m": 0.122
  },
  {
   "id": "n12",
   "proc": "기타",
   "name": "빨래건조대",
   "spec": "천장형 / 전동은 별도",
   "unit": "EA",
   "kind": "자재",
   "price": 223000
  },
  {
   "id": "n13",
   "proc": "기타",
   "name": "커튼박스",
   "spec": "목작업 + 마감",
   "unit": "M",
   "kind": "노무",
   "price": 37000
  },
  {
   "id": "n14",
   "proc": "기타",
   "name": "기타 외주 공사 (업체 견적)",
   "spec": "업체 견적 기준",
   "unit": "식",
   "kind": "자재",
   "price": 0,
   "costVar": "outsource",
   "m": 0.326
  },
  {
   "id": "n15",
   "proc": "목공",
   "name": "발코니 확장 공사 (업체 견적)",
   "spec": "철거·단열·바닥 난방 포함 / 창호 별도",
   "unit": "식",
   "kind": "노무",
   "price": 0,
   "costVar": "expand",
   "m": 0.231
  },
  {
   "id": "t01",
   "proc": "설비",
   "name": "설비 인건비",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "t02",
   "proc": "도어",
   "name": "도어 시공 인건비",
   "spec": "도어세트 외 추가 시공",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "t03",
   "proc": "창호",
   "name": "창호 시공 인건비 (1인)",
   "spec": "",
   "unit": "인",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "t04",
   "proc": "기타",
   "name": "식대",
   "spec": "작업자 식대",
   "unit": "명",
   "kind": "경비",
   "price": 10000
  },
  {
   "id": "t05",
   "proc": "도어",
   "name": "터닝도어 (예림)",
   "spec": "예림자연창 130바 / 미스트+투명 / 핸들 / 시공 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 700000
  },
  {
   "id": "t06",
   "proc": "도어",
   "name": "슬림 발포 ABS 도어세트",
   "spec": "예림 슬림 발포 / 문짝·문틀·경첩·손잡이",
   "unit": "EA",
   "kind": "자재",
   "price": 306000
  },
  {
   "id": "t07",
   "proc": "철거",
   "name": "주방 철거",
   "spec": "상·하부장, 상판, 싱크볼",
   "unit": "식",
   "kind": "노무",
   "price": 348000
  },
  {
   "id": "t08",
   "proc": "철거",
   "name": "몰딩 철거",
   "spec": "천장·바닥 몰딩",
   "unit": "식",
   "kind": "노무",
   "price": 209000
  },
  {
   "id": "t09",
   "proc": "철거",
   "name": "도어 철거",
   "spec": "문짝·문틀",
   "unit": "EA",
   "kind": "노무",
   "price": 28000
  },
  {
   "id": "t10",
   "proc": "철거",
   "name": "샷시 철거",
   "spec": "예림 기준",
   "unit": "틀",
   "kind": "노무",
   "price": 49000
  },
  {
   "id": "t11",
   "proc": "목공",
   "name": "천장 몰딩",
   "spec": "평몰딩 / 2.4m 1EA 기준 환산",
   "unit": "M",
   "kind": "자재",
   "price": 1300
  },
  {
   "id": "t12",
   "proc": "목공",
   "name": "걸레받이 (하부 몰딩)",
   "spec": "평몰딩 40mm / MDF",
   "unit": "M",
   "kind": "자재",
   "price": 1400
  },
  {
   "id": "t13",
   "proc": "목공",
   "name": "우물천장 목작업",
   "spec": "간접조명 홈 포함",
   "unit": "식",
   "kind": "노무",
   "price": 455000
  },
  {
   "id": "t14",
   "proc": "목공",
   "name": "가벽 목작업",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 390000
  },
  {
   "id": "t15",
   "proc": "목공",
   "name": "선반 목작업",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 260000
  },
  {
   "id": "t16",
   "proc": "목공",
   "name": "아치 목작업",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 455000
  },
  {
   "id": "t17",
   "proc": "전기",
   "name": "펜던트 조명",
   "spec": "식탁등 등",
   "unit": "EA",
   "kind": "자재",
   "price": 65000
  },
  {
   "id": "t18",
   "proc": "전기",
   "name": "스위치·콘센트 교체",
   "spec": "전체 화이트 스위치·콘센트",
   "unit": "식",
   "kind": "자재",
   "price": 237000
  },
  {
   "id": "t19",
   "proc": "전기",
   "name": "디밍 작업",
   "spec": "조광기·디밍 안정기",
   "unit": "식",
   "kind": "자재",
   "price": 76000
  },
  {
   "id": "t20",
   "proc": "가구",
   "name": "후드",
   "spec": "하츠 슬림 등",
   "unit": "EA",
   "kind": "자재",
   "price": 227000
  },
  {
   "id": "t21",
   "proc": "가구",
   "name": "쿡탑 (가스/인덕션)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 284000
  },
  {
   "id": "t22",
   "proc": "가구",
   "name": "키큰장",
   "spec": "",
   "unit": "식",
   "kind": "자재",
   "price": 511000
  },
  {
   "id": "t23",
   "proc": "가구",
   "name": "가구 도어 교체",
   "spec": "문짝 교체",
   "unit": "EA",
   "kind": "자재",
   "price": 57000
  },
  {
   "id": "t24",
   "proc": "타일",
   "name": "현관 타일",
   "spec": "600각 포세린 / 현관 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 14000
  },
  {
   "id": "t25",
   "proc": "타일",
   "name": "발코니 바닥 타일",
   "spec": "300각 / 발코니 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 12000
  },
  {
   "id": "t26",
   "proc": "기타",
   "name": "공정간 폐기물 처리 (1회)",
   "spec": "공정별 폐기물 반출 1회",
   "unit": "회",
   "kind": "경비",
   "price": 200000
  },
  {
   "id": "t27",
   "proc": "가설",
   "name": "엘리베이터 사용료·예치금",
   "spec": "관리사무소 규정",
   "unit": "식",
   "kind": "경비",
   "price": 0
  },
  {
   "id": "t28",
   "proc": "가설",
   "name": "이웃 공사 안내문·선물",
   "spec": "",
   "unit": "식",
   "kind": "경비",
   "price": 0
  },
  {
   "id": "t29",
   "proc": "철거",
   "name": "붙박이장·신발장 철거",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t30",
   "proc": "철거",
   "name": "아트월·벽체 철거",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t31",
   "proc": "철거",
   "name": "욕실 타일 철거 (덧방 제외)",
   "spec": "",
   "unit": "칸",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t32",
   "proc": "철거",
   "name": "발코니 타일·턱 철거",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t33",
   "proc": "설비",
   "name": "수전 위치 변경",
   "spec": "",
   "unit": "개소",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t34",
   "proc": "설비",
   "name": "주방·세탁실 급배수 이설",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t35",
   "proc": "설비",
   "name": "배수구·트랩 교체",
   "spec": "욕실 배수구(유가)·트랩 교체 1곳 / 임시 단가",
   "unit": "EA",
   "kind": "자재",
   "price": 50000
  },
  {
   "id": "t36",
   "proc": "설비",
   "name": "누수 탐지·보수",
   "spec": "철거 후 확인 시",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t37",
   "proc": "욕실",
   "name": "비데 설치",
   "spec": "전원 확인",
   "unit": "EA",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t38",
   "proc": "욕실",
   "name": "해바라기 샤워 (매립)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t39",
   "proc": "욕실",
   "name": "욕실 수납장 (하부장)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t40",
   "proc": "욕실",
   "name": "욕실 조명 (방습등)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t41",
   "proc": "목공",
   "name": "등박스·간접등 홈 목작업",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t42",
   "proc": "목공",
   "name": "TV 매립박스·벽 보강",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t43",
   "proc": "목공",
   "name": "히든도어·문틀 목작업",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t44",
   "proc": "목공",
   "name": "석고보드 벽체 평탄화",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t45",
   "proc": "전기",
   "name": "분전반·차단기 교체",
   "spec": "",
   "unit": "식",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t46",
   "proc": "전기",
   "name": "TV·통신 매립 배선",
   "spec": "",
   "unit": "개소",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t47",
   "proc": "전기",
   "name": "현관 센서등",
   "spec": "LED 센서등 15W / 인터넷 시세 기준 임시 단가",
   "unit": "EA",
   "kind": "자재",
   "price": 13600
  },
  {
   "id": "t48",
   "proc": "전기",
   "name": "발코니 조명",
   "spec": "LED 직부등 15W / 인터넷 시세 기준 임시 단가",
   "unit": "EA",
   "kind": "자재",
   "price": 9100
  },
  {
   "id": "t49",
   "proc": "전기",
   "name": "가전 전원 (인덕션·식세기)",
   "spec": "전용회로",
   "unit": "개소",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t50",
   "proc": "타일",
   "name": "주방 벽 타일",
   "spec": "",
   "unit": "㎡",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t51",
   "proc": "타일",
   "name": "현관 벽 타일·아트월 타일",
   "spec": "",
   "unit": "㎡",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t52",
   "proc": "타일",
   "name": "발코니 벽 타일",
   "spec": "",
   "unit": "㎡",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t53",
   "proc": "바닥",
   "name": "재료분리대·논슬립",
   "spec": "1m당",
   "unit": "M",
   "kind": "자재",
   "price": 10000
  },
  {
   "id": "t54",
   "proc": "바닥",
   "name": "바닥 단차 보정",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t55",
   "proc": "도배",
   "name": "퍼티·곰팡이 처리",
   "spec": "벽면 상태에 따라",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t56",
   "proc": "도배",
   "name": "부분 도배",
   "spec": "",
   "unit": "㎡",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t57",
   "proc": "필름",
   "name": "창호 필름 (샷시)",
   "spec": "내부 샷시 시트",
   "unit": "틀",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t58",
   "proc": "필름",
   "name": "싱크·가구 필름 리폼",
   "spec": "",
   "unit": "㎡",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t59",
   "proc": "필름",
   "name": "붙박이장·신발장 필름",
   "spec": "",
   "unit": "㎡",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t60",
   "proc": "기타",
   "name": "벽면 도장 (페인트)",
   "spec": "",
   "unit": "㎡",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t61",
   "proc": "기타",
   "name": "발코니 페인트",
   "spec": "",
   "unit": "칸",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t62",
   "proc": "가구",
   "name": "드레스룸 시스템장",
   "spec": "",
   "unit": "식",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t63",
   "proc": "가구",
   "name": "팬트리장",
   "spec": "",
   "unit": "식",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t64",
   "proc": "가구",
   "name": "다용도실·세탁실 상부장",
   "spec": "",
   "unit": "식",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t65",
   "proc": "가구",
   "name": "아일랜드 식탁",
   "spec": "",
   "unit": "식",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "t66",
   "proc": "가구",
   "name": "식기세척기·인덕션 설치",
   "spec": "가전 연결",
   "unit": "EA",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t67",
   "proc": "설비",
   "name": "에어컨 배관 매립",
   "spec": "",
   "unit": "개소",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t68",
   "proc": "기타",
   "name": "새집증후군 시공",
   "spec": "",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "t69",
   "proc": "기타",
   "name": "블라인드·커튼",
   "spec": "고객 별도 요청 시",
   "unit": "식",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "v001",
   "proc": "욕실",
   "name": "인토 투피스 양변기 C-941",
   "spec": "부속·시트 일반",
   "unit": "EA",
   "kind": "자재",
   "price": 148000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v002",
   "proc": "욕실",
   "name": "이녹스 투피스 양변기 8100",
   "spec": "부속·시트 일반",
   "unit": "EA",
   "kind": "자재",
   "price": 148000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v003",
   "proc": "욕실",
   "name": "인토 원피스 양변기 C-1002",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 216000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v004",
   "proc": "욕실",
   "name": "대림 2피스 치마 양변기 733",
   "spec": "부속·시트 대림",
   "unit": "EA",
   "kind": "자재",
   "price": 319000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v005",
   "proc": "욕실",
   "name": "대림 2피스 치마 양변기 735 림리스",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 319000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v006",
   "proc": "욕실",
   "name": "라우체 2피스 치마형 양변기 포레",
   "spec": "부속·시트 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 205000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v007",
   "proc": "욕실",
   "name": "라우체 2피스 반치형 양변기 아크",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 205000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v008",
   "proc": "욕실",
   "name": "라우체 원피스 양변기 포레",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 285000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v009",
   "proc": "욕실",
   "name": "라우체 원피스 양변기 아크",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 285000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v010",
   "proc": "욕실",
   "name": "라우체 비데일체형 양변기",
   "spec": "전체 부속 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 626000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v011",
   "proc": "욕실",
   "name": "아메리칸 2피스 양변기 웨이브R",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 296000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v012",
   "proc": "욕실",
   "name": "아메리칸 2피스 양변기 시그니처",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 336000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v013",
   "proc": "욕실",
   "name": "아메리칸 2피스 양변기 리니어",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 342000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v014",
   "proc": "욕실",
   "name": "인토 일체형 세면기 L-336-1 사각",
   "spec": "인토 세면대 L336 / 앵글밸브 · 앙카 · P트랩 · 폽업 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 148000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v015",
   "proc": "욕실",
   "name": "인토 일체형 세면기 L-337-1 라운드",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v016",
   "proc": "욕실",
   "name": "이녹스 일체형 세면기 L-2210 사각",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v017",
   "proc": "욕실",
   "name": "대림 반다리 세면기 370 사각",
   "spec": "폽업 대림",
   "unit": "EA",
   "kind": "자재",
   "price": 205000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v018",
   "proc": "욕실",
   "name": "대림 반다리 세면기 384 라운드",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 205000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v019",
   "proc": "욕실",
   "name": "라우체 반다리 세면기 지니",
   "spec": "앵글·앙카·트랩·폽업 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 171000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v020",
   "proc": "욕실",
   "name": "라우체 반다리 세면기 위니",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 171000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v021",
   "proc": "욕실",
   "name": "라우체 탑볼 세면대 오클리",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 159000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v022",
   "proc": "욕실",
   "name": "라우체 세면기 코니",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 114000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v023",
   "proc": "욕실",
   "name": "아메리칸 반다리 세면기 플랫 516 사각",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 264000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v024",
   "proc": "욕실",
   "name": "아메리칸 반다리 세면기 웨이브R",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 236000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v025",
   "proc": "욕실",
   "name": "베르사츠 원홀 세면수전 BSL-1001",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 61200,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v026",
   "proc": "욕실",
   "name": "베르사츠 원홀 세면수전 BSL-5001",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 96000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v027",
   "proc": "욕실",
   "name": "베르사츠 원홀 세면기 좌우이동 BSL-3001",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 68000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v028",
   "proc": "욕실",
   "name": "에떼르노 원홀수전 E7-1001",
   "spec": "에떼르노 E7-1001NB 니켈 원홀 세면 수전",
   "unit": "EA",
   "kind": "자재",
   "price": 98000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v029",
   "proc": "욕실",
   "name": "에떼르노 원홀수전 E9-1001",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 164400,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v030",
   "proc": "욕실",
   "name": "베르사츠 샤워수전 BSB-1006",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 118400,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v031",
   "proc": "욕실",
   "name": "베르사츠 샤워기 BSB-3005",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 103000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v032",
   "proc": "욕실",
   "name": "베르사츠 샤워기 BSB-5005",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 157600,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v033",
   "proc": "욕실",
   "name": "에떼르노 샤워수전 E7-1005",
   "spec": "엑셀 단가 120,000 기준 + 15%",
   "unit": "EA",
   "kind": "자재",
   "price": 157600,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v034",
   "proc": "욕실",
   "name": "에떼르노 샤워수전 E9-1005",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 262200,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v035",
   "proc": "욕실",
   "name": "베르사츠 해바라기 샤워기 BSB-2009",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 194000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v036",
   "proc": "욕실",
   "name": "베르사츠 해바라기 샤워기 BSB-6009",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 216000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v037",
   "proc": "욕실",
   "name": "베르사츠 슬라이드바 원형 BSA-1000-1",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 35600,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v038",
   "proc": "욕실",
   "name": "베르사츠 슬라이드바 사각 BSA-2000",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 38000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v039",
   "proc": "욕실",
   "name": "에떼르노 슬라이드바 ESSB-100",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 65600,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v040",
   "proc": "욕실",
   "name": "베르사츠 수건걸이 원형 BSA-100",
   "spec": "무광니켈 수건걸이",
   "unit": "EA",
   "kind": "자재",
   "price": 28000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v041",
   "proc": "욕실",
   "name": "베르사츠 수건걸이 사각 BSA-200",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 38000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v042",
   "proc": "욕실",
   "name": "베르사츠 휴지걸이 BSA-100",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 39100,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v043",
   "proc": "욕실",
   "name": "베르사츠 이단 수건선반 BSA-006",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 34000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v044",
   "proc": "욕실",
   "name": "베르사츠 코너선반 BSA-002",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 21000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v045",
   "proc": "욕실",
   "name": "베르사츠 옷걸이 BSA-100",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 19600,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v046",
   "proc": "욕실",
   "name": "댐퍼 슬라이드장 1200×800",
   "spec": "800×1200 거울 슬라이딩장",
   "unit": "EA",
   "kind": "자재",
   "price": 158000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v047",
   "proc": "욕실",
   "name": "플랩장 1200×500",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v048",
   "proc": "욕실",
   "name": "플랩장 1200×600",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 148000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "v049",
   "proc": "타일",
   "name": "림바스 타일 300×600",
   "spec": "1BOX 1.44㎡",
   "unit": "BOX",
   "kind": "자재",
   "price": 17000,
   "group": "타일 (림바스)"
  },
  {
   "id": "v050",
   "proc": "타일",
   "name": "림바스 타일 600×600",
   "spec": "1BOX 1.44㎡ (14,000~)",
   "unit": "BOX",
   "kind": "자재",
   "price": 16000,
   "group": "타일 (림바스)"
  },
  {
   "id": "v051",
   "proc": "타일",
   "name": "림바스 타일 600×1200·800×800",
   "spec": "1BOX 1.44㎡",
   "unit": "BOX",
   "kind": "자재",
   "price": 41000,
   "group": "타일 (림바스)"
  },
  {
   "id": "v052",
   "proc": "타일",
   "name": "림바스 타일 300×300",
   "spec": "1BOX 1.44㎡",
   "unit": "BOX",
   "kind": "자재",
   "price": 17000,
   "group": "타일 (림바스)"
  },
  {
   "id": "v053",
   "proc": "도어",
   "name": "예림 ABS 민자 문짝 35T",
   "spec": "문짝만 교체 1EA",
   "unit": "EA",
   "kind": "자재",
   "price": 200000,
   "group": "도어 (예림)"
  },
  {
   "id": "v054",
   "proc": "도어",
   "name": "예림 목재 민자 문짝 36T",
   "spec": "기본색상",
   "unit": "EA",
   "kind": "자재",
   "price": 162000,
   "group": "도어 (예림)"
  },
  {
   "id": "v055",
   "proc": "도어",
   "name": "예림 히든도어 45T ABS",
   "spec": "990×2100 / 3면 홈가공",
   "unit": "EA",
   "kind": "자재",
   "price": 191000,
   "group": "도어 (예림)"
  },
  {
   "id": "v056",
   "proc": "도어",
   "name": "문짝 시트 옵션 비칼라·메탈",
   "spec": "ABS 문짝 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 23000,
   "group": "도어 (예림)"
  },
  {
   "id": "v057",
   "proc": "도어",
   "name": "문짝 시트 옵션 HP",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 37000,
   "group": "도어 (예림)"
  },
  {
   "id": "v058",
   "proc": "도어",
   "name": "문짝 시트 옵션 매트",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 68000,
   "group": "도어 (예림)"
  },
  {
   "id": "v059",
   "proc": "도어",
   "name": "문틀 비규격 추가",
   "spec": "문틀바 비규격(5단위)",
   "unit": "EA",
   "kind": "자재",
   "price": 45000,
   "group": "도어 (예림)"
  },
  {
   "id": "v060",
   "proc": "도어",
   "name": "도어 경첩",
   "spec": "문 1개 기준",
   "unit": "조",
   "kind": "자재",
   "price": 4400,
   "group": "도어 (예림)"
  },
  {
   "id": "v061",
   "proc": "도어",
   "name": "도어 손잡이·실린더",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 14000,
   "group": "도어 (예림)"
  },
  {
   "id": "v062",
   "proc": "도어",
   "name": "도어 시공비 (짝당)",
   "spec": "4짝 이상 기준 (1짝 6만·2짝 5만·3짝 4만)",
   "unit": "짝",
   "kind": "노무",
   "price": 40000,
   "group": "도어 (예림)"
  },
  {
   "id": "v063",
   "proc": "도어",
   "name": "도어 실측비",
   "spec": "",
   "unit": "식",
   "kind": "경비",
   "price": 34000,
   "group": "도어 (예림)"
  },
  {
   "id": "v064",
   "proc": "도어",
   "name": "예림 ABS 문틀 110바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 89000,
   "group": "도어 (예림)"
  },
  {
   "id": "v065",
   "proc": "도어",
   "name": "예림 ABS 문틀 110바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 95000,
   "group": "도어 (예림)"
  },
  {
   "id": "v066",
   "proc": "도어",
   "name": "예림 ABS 문틀 130바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 96000,
   "group": "도어 (예림)"
  },
  {
   "id": "v067",
   "proc": "도어",
   "name": "예림 ABS 문틀 130바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 103000,
   "group": "도어 (예림)"
  },
  {
   "id": "v068",
   "proc": "도어",
   "name": "예림 ABS 문틀 140바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 100000,
   "group": "도어 (예림)"
  },
  {
   "id": "v069",
   "proc": "도어",
   "name": "예림 ABS 문틀 140바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 109000,
   "group": "도어 (예림)"
  },
  {
   "id": "v070",
   "proc": "도어",
   "name": "예림 ABS 문틀 155바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 107000,
   "group": "도어 (예림)"
  },
  {
   "id": "v071",
   "proc": "도어",
   "name": "예림 ABS 문틀 155바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 115000,
   "group": "도어 (예림)"
  },
  {
   "id": "v072",
   "proc": "도어",
   "name": "예림 ABS 문틀 175바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 114000,
   "group": "도어 (예림)"
  },
  {
   "id": "v073",
   "proc": "도어",
   "name": "예림 ABS 문틀 175바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 123000,
   "group": "도어 (예림)"
  },
  {
   "id": "v074",
   "proc": "도어",
   "name": "예림 ABS 문틀 195바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 121000,
   "group": "도어 (예림)"
  },
  {
   "id": "v075",
   "proc": "도어",
   "name": "예림 ABS 문틀 195바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 131000,
   "group": "도어 (예림)"
  },
  {
   "id": "v076",
   "proc": "도어",
   "name": "예림 ABS 문틀 210바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 128000,
   "group": "도어 (예림)"
  },
  {
   "id": "v077",
   "proc": "도어",
   "name": "예림 ABS 문틀 210바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 138000,
   "group": "도어 (예림)"
  },
  {
   "id": "v078",
   "proc": "도어",
   "name": "예림 ABS 문틀 230바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "도어 (예림)"
  },
  {
   "id": "v079",
   "proc": "도어",
   "name": "예림 ABS 문틀 230바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 146000,
   "group": "도어 (예림)"
  },
  {
   "id": "v080",
   "proc": "도어",
   "name": "예림 ABS 문틀 245바 식기무",
   "spec": "1000×2100 기준",
   "unit": "EA",
   "kind": "자재",
   "price": 145000,
   "group": "도어 (예림)"
  },
  {
   "id": "v081",
   "proc": "도어",
   "name": "예림 ABS 문틀 245바 식기유",
   "spec": "1000×2100 기준 / 욕실용",
   "unit": "EA",
   "kind": "자재",
   "price": 154000,
   "group": "도어 (예림)"
  },
  {
   "id": "v082",
   "proc": "도어",
   "name": "예림 발포 슬림문틀 식기무",
   "spec": "ABS+나무 / 스토퍼 15mm / 단가 확인 필요",
   "unit": "EA",
   "kind": "자재",
   "price": 127000,
   "group": "도어 (예림)"
  },
  {
   "id": "v083",
   "proc": "도어",
   "name": "예림 히든문틀 110바",
   "spec": "목재 / 비조립",
   "unit": "EA",
   "kind": "자재",
   "price": 131000,
   "group": "도어 (예림)"
  },
  {
   "id": "v084",
   "proc": "도어",
   "name": "예림 히든문틀 140바",
   "spec": "목재 / 비조립",
   "unit": "EA",
   "kind": "자재",
   "price": 141000,
   "group": "도어 (예림)"
  },
  {
   "id": "v085",
   "proc": "도어",
   "name": "예림 히든문틀 170바",
   "spec": "목재 / 비조립",
   "unit": "EA",
   "kind": "자재",
   "price": 153000,
   "group": "도어 (예림)"
  },
  {
   "id": "v086",
   "proc": "도어",
   "name": "예림 히든문틀 200바",
   "spec": "목재 / 비조립",
   "unit": "EA",
   "kind": "자재",
   "price": 163000,
   "group": "도어 (예림)"
  },
  {
   "id": "v087",
   "proc": "도어",
   "name": "예림 히든문틀 230바",
   "spec": "목재 / 비조립",
   "unit": "EA",
   "kind": "자재",
   "price": 175000,
   "group": "도어 (예림)"
  },
  {
   "id": "v088",
   "proc": "도어",
   "name": "예림 히든문틀 260바",
   "spec": "목재 / 비조립",
   "unit": "EA",
   "kind": "자재",
   "price": 185000,
   "group": "도어 (예림)"
  },
  {
   "id": "v089",
   "proc": "도어",
   "name": "예림 히든문틀 290바",
   "spec": "목재 / 비조립",
   "unit": "EA",
   "kind": "자재",
   "price": 199000,
   "group": "도어 (예림)"
  },
  {
   "id": "v090",
   "proc": "목공",
   "name": "예림 평몰딩 30",
   "spec": "30×9 / 1본",
   "unit": "EA",
   "kind": "자재",
   "price": 4900,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v091",
   "proc": "목공",
   "name": "예림 평몰딩 40",
   "spec": "40×9 / 1본",
   "unit": "EA",
   "kind": "자재",
   "price": 5100,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v092",
   "proc": "목공",
   "name": "예림 평몰딩 50",
   "spec": "50×9 / 1본",
   "unit": "EA",
   "kind": "자재",
   "price": 5500,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v093",
   "proc": "목공",
   "name": "예림 평몰딩 60",
   "spec": "60×9 / 1본",
   "unit": "EA",
   "kind": "자재",
   "price": 3600,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v094",
   "proc": "목공",
   "name": "예림 평몰딩 80",
   "spec": "80×9 / 1본",
   "unit": "EA",
   "kind": "자재",
   "price": 4300,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v095",
   "proc": "목공",
   "name": "예림 평몰딩 100",
   "spec": "100×9 / 1본",
   "unit": "EA",
   "kind": "자재",
   "price": 5300,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v096",
   "proc": "목공",
   "name": "예림 천정몰딩 1번",
   "spec": "80×12",
   "unit": "EA",
   "kind": "자재",
   "price": 7900,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v097",
   "proc": "목공",
   "name": "예림 마이너스 몰딩",
   "spec": "25×15",
   "unit": "EA",
   "kind": "자재",
   "price": 5600,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v098",
   "proc": "목공",
   "name": "예림 걸레받이 40",
   "spec": "40×9",
   "unit": "EA",
   "kind": "자재",
   "price": 5800,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v099",
   "proc": "목공",
   "name": "예림 걸레받이 60",
   "spec": "60×9",
   "unit": "EA",
   "kind": "자재",
   "price": 6200,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v100",
   "proc": "목공",
   "name": "예림 걸레받이 90",
   "spec": "90×9",
   "unit": "EA",
   "kind": "자재",
   "price": 7200,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v101",
   "proc": "목공",
   "name": "예림 강화마루용 걸레받이",
   "spec": "70×15",
   "unit": "EA",
   "kind": "자재",
   "price": 8200,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v102",
   "proc": "목공",
   "name": "예림 평문선 40",
   "spec": "40×12",
   "unit": "EA",
   "kind": "자재",
   "price": 6200,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v103",
   "proc": "목공",
   "name": "예림 평문선 60",
   "spec": "60×12",
   "unit": "EA",
   "kind": "자재",
   "price": 6300,
   "group": "몰딩 (예림)"
  },
  {
   "id": "v104",
   "proc": "필름",
   "name": "예림 인테리어필름 기본칼라",
   "spec": "폭 1.22m",
   "unit": "M",
   "kind": "자재",
   "price": 12000,
   "group": "필름 (예림)"
  },
  {
   "id": "v105",
   "proc": "필름",
   "name": "예림 인테리어필름 비칼라·메탈",
   "spec": "폭 1.22m",
   "unit": "M",
   "kind": "자재",
   "price": 13000,
   "group": "필름 (예림)"
  },
  {
   "id": "v106",
   "proc": "필름",
   "name": "예림 인테리어필름 매트 HE407",
   "spec": "폭 1.22m",
   "unit": "M",
   "kind": "자재",
   "price": 17000,
   "group": "필름 (예림)"
  },
  {
   "id": "v107",
   "proc": "필름",
   "name": "예림 인테리어필름 벨로체 L-100",
   "spec": "폭 1.22m",
   "unit": "M",
   "kind": "자재",
   "price": 23000,
   "group": "필름 (예림)"
  },
  {
   "id": "v108",
   "proc": "필름",
   "name": "예림 인테리어필름 벨로체 L-400",
   "spec": "폭 1.22m",
   "unit": "M",
   "kind": "자재",
   "price": 28000,
   "group": "필름 (예림)"
  },
  {
   "id": "v109",
   "proc": "필름",
   "name": "예림 인테리어필름 방염시트",
   "spec": "폭 1.22m",
   "unit": "M",
   "kind": "자재",
   "price": 20000,
   "group": "필름 (예림)"
  },
  {
   "id": "v110",
   "proc": "필름",
   "name": "예림 인테리어필름 방염 FHE407",
   "spec": "폭 1.22m",
   "unit": "M",
   "kind": "자재",
   "price": 25000,
   "group": "필름 (예림)"
  },
  {
   "id": "v111",
   "proc": "가설",
   "name": "사다리차 기본시간",
   "spec": "층수별 운임표 자동 (VAT 별도)",
   "unit": "회",
   "kind": "경비",
   "price": 0,
   "group": "사다리차",
   "costTable": [
    [
     2,
     5,
     120000
    ],
    [
     6,
     7,
     130000
    ],
    [
     8,
     9,
     140000
    ],
    [
     10,
     11,
     150000
    ],
    [
     12,
     13,
     160000
    ],
    [
     14,
     14,
     170000
    ],
    [
     15,
     15,
     180000
    ],
    [
     16,
     16,
     200000
    ],
    [
     17,
     17,
     210000
    ],
    [
     18,
     18,
     230000
    ],
    [
     19,
     19,
     250000
    ],
    [
     20,
     20,
     300000
    ],
    [
     21,
     21,
     350000
    ],
    [
     22,
     22,
     400000
    ],
    [
     23,
     23,
     450000
    ],
    [
     24,
     24,
     500000
    ],
    [
     25,
     25,
     600000
    ],
    [
     26,
     99,
     800000
    ]
   ],
   "m": 0.2
  },
  {
   "id": "v112",
   "proc": "가설",
   "name": "사다리차 반대 4시간",
   "spec": "층수별 운임표 자동 (VAT 별도)",
   "unit": "회",
   "kind": "경비",
   "price": 0,
   "group": "사다리차",
   "costTable": [
    [
     2,
     5,
     350000
    ],
    [
     6,
     7,
     350000
    ],
    [
     8,
     9,
     380000
    ],
    [
     10,
     11,
     450000
    ],
    [
     12,
     13,
     450000
    ],
    [
     14,
     14,
     550000
    ],
    [
     15,
     15,
     550000
    ],
    [
     16,
     16,
     550000
    ],
    [
     17,
     17,
     600000
    ],
    [
     18,
     18,
     650000
    ],
    [
     19,
     19,
     650000
    ],
    [
     20,
     20,
     700000
    ],
    [
     21,
     21,
     700000
    ],
    [
     22,
     22,
     800000
    ],
    [
     23,
     23,
     800000
    ],
    [
     24,
     24,
     1000000
    ],
    [
     25,
     25,
     1100000
    ],
    [
     26,
     99,
     1200000
    ]
   ],
   "m": 0.2
  },
  {
   "id": "v113",
   "proc": "가설",
   "name": "사다리차 일대 8시간",
   "spec": "층수별 운임표 자동 (VAT 별도)",
   "unit": "회",
   "kind": "경비",
   "price": 0,
   "group": "사다리차",
   "costTable": [
    [
     2,
     5,
     550000
    ],
    [
     6,
     7,
     550000
    ],
    [
     8,
     9,
     600000
    ],
    [
     10,
     11,
     650000
    ],
    [
     12,
     13,
     650000
    ],
    [
     14,
     14,
     750000
    ],
    [
     15,
     15,
     750000
    ],
    [
     16,
     16,
     750000
    ],
    [
     17,
     17,
     800000
    ],
    [
     18,
     18,
     850000
    ],
    [
     19,
     19,
     850000
    ],
    [
     20,
     20,
     900000
    ],
    [
     21,
     21,
     900000
    ],
    [
     22,
     22,
     1000000
    ],
    [
     23,
     23,
     1000000
    ],
    [
     24,
     24,
     1200000
    ],
    [
     25,
     25,
     1400000
    ],
    [
     26,
     99,
     1500000
    ]
   ],
   "m": 0.2
  },
  {
   "id": "v114",
   "proc": "가설",
   "name": "사다리차 추가 1시간",
   "spec": "층수별 운임표 자동 (VAT 별도)",
   "unit": "시간",
   "kind": "경비",
   "price": 0,
   "group": "사다리차",
   "costTable": [
    [
     2,
     5,
     80000
    ],
    [
     6,
     7,
     80000
    ],
    [
     8,
     9,
     80000
    ],
    [
     10,
     11,
     100000
    ],
    [
     12,
     13,
     100000
    ],
    [
     14,
     14,
     130000
    ],
    [
     15,
     15,
     140000
    ],
    [
     16,
     16,
     140000
    ],
    [
     17,
     17,
     150000
    ],
    [
     18,
     18,
     180000
    ],
    [
     19,
     19,
     180000
    ],
    [
     20,
     20,
     200000
    ],
    [
     21,
     21,
     200000
    ],
    [
     22,
     22,
     200000
    ],
    [
     23,
     23,
     200000
    ],
    [
     24,
     24,
     200000
    ],
    [
     25,
     25,
     300000
    ],
    [
     26,
     99,
     300000
    ]
   ],
   "m": 0.2
  },
  {
   "id": "v115",
   "proc": "전기",
   "name": "샤리벨 T5 1200mm LED 18W (2P)",
   "spec": "동성 / 주광/주백/전주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 4000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v116",
   "proc": "전기",
   "name": "샤리벨 T5 900mm LED 14W (2P)",
   "spec": "동성",
   "unit": "EA",
   "kind": "자재",
   "price": 3900,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v117",
   "proc": "전기",
   "name": "샤리벨 T5 600mm LED 9W (2P)",
   "spec": "동성",
   "unit": "EA",
   "kind": "자재",
   "price": 3700,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v118",
   "proc": "전기",
   "name": "샤리벨 T5 400mm LED 7W (2P)",
   "spec": "동성",
   "unit": "EA",
   "kind": "자재",
   "price": 4000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v119",
   "proc": "전기",
   "name": "샤리벨 T5 300mm LED 5W (2P)",
   "spec": "동성",
   "unit": "EA",
   "kind": "자재",
   "price": 3500,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v120",
   "proc": "전기",
   "name": "t3 1200 18W",
   "spec": "TS / 주광/주백/전주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 4300,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v121",
   "proc": "전기",
   "name": "t3 1000 16W",
   "spec": "TS",
   "unit": "EA",
   "kind": "자재",
   "price": 4200,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v122",
   "proc": "전기",
   "name": "t3 900 14W",
   "spec": "TS",
   "unit": "EA",
   "kind": "자재",
   "price": 4100,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v123",
   "proc": "전기",
   "name": "t3 600 9W",
   "spec": "TS",
   "unit": "EA",
   "kind": "자재",
   "price": 3900,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v124",
   "proc": "전기",
   "name": "t3 400 7W",
   "spec": "TS",
   "unit": "EA",
   "kind": "자재",
   "price": 3700,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v125",
   "proc": "전기",
   "name": "t3 300 5W",
   "spec": "TS",
   "unit": "EA",
   "kind": "자재",
   "price": 3500,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v126",
   "proc": "전기",
   "name": "다운라이트 확산 2인치 5W",
   "spec": "다빛 / 화이트 (주광/주백/전구)",
   "unit": "EA",
   "kind": "자재",
   "price": 3100,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v127",
   "proc": "전기",
   "name": "다운라이트 확산 3인치 7W",
   "spec": "다빛 / 타공 Ø75",
   "unit": "EA",
   "kind": "자재",
   "price": 3100,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v128",
   "proc": "전기",
   "name": "다운라이트 확산 4인치 10W",
   "spec": "다빛 / 타공 Ø92",
   "unit": "EA",
   "kind": "자재",
   "price": 3800,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v129",
   "proc": "전기",
   "name": "다운라이트 확산 6인치 15W",
   "spec": "다빛 / 타공 Ø150 / 화이트 (주광/주백)",
   "unit": "EA",
   "kind": "자재",
   "price": 4000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v130",
   "proc": "전기",
   "name": "루시 COB 매입등 2인치 5W",
   "spec": "다빛 / 타공 Ø50 / 화이트 (주백/전구)",
   "unit": "EA",
   "kind": "자재",
   "price": 4500,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v131",
   "proc": "전기",
   "name": "루시 COB 매입등 3인치 8W",
   "spec": "다빛 / 타공 Ø75",
   "unit": "EA",
   "kind": "자재",
   "price": 4500,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v132",
   "proc": "전기",
   "name": "다운라이트 움푹 확산 5W",
   "spec": "다빛 / 타공 Ø55 / 화이트 (주광/주백/전구)",
   "unit": "EA",
   "kind": "자재",
   "price": 3200,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v133",
   "proc": "전기",
   "name": "다운라이트 움푹 확산 5W (타공 Ø72)",
   "spec": "다빛 / 타공 Ø72",
   "unit": "EA",
   "kind": "자재",
   "price": 3200,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v134",
   "proc": "전기",
   "name": "다운라이트 COB 안도 확산 1.5인치 8W",
   "spec": "다빛 / 화이트 (전구/주백)",
   "unit": "EA",
   "kind": "자재",
   "price": 6400,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v135",
   "proc": "전기",
   "name": "다운라이트 COB 안도 확산 2인치 8W",
   "spec": "다빛 / 타공 Ø55 / 화이트 (전구/주백/주광)",
   "unit": "EA",
   "kind": "자재",
   "price": 5900,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v136",
   "proc": "전기",
   "name": "다운라이트 COB 안도 집중 2인치 8W",
   "spec": "다빛",
   "unit": "EA",
   "kind": "자재",
   "price": 5900,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v137",
   "proc": "전기",
   "name": "다운라이트 COB 안도 확산 3인치 12W",
   "spec": "다빛 / 타공 Ø75",
   "unit": "EA",
   "kind": "자재",
   "price": 6400,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v138",
   "proc": "전기",
   "name": "다운라이트 COB 안도 집중 3인치 12W",
   "spec": "다빛",
   "unit": "EA",
   "kind": "자재",
   "price": 6400,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v139",
   "proc": "전기",
   "name": "앵글 COB 매입등 1.5인치 5W",
   "spec": "TS / 타공 Ø35 / 화이트/블랙 (주백/전구)",
   "unit": "EA",
   "kind": "자재",
   "price": 22000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v140",
   "proc": "전기",
   "name": "앵글 COB 매입등 2인치 7W",
   "spec": "TS / 타공 Ø55",
   "unit": "EA",
   "kind": "자재",
   "price": 24000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v141",
   "proc": "전기",
   "name": "앵글 COB 매입등 3인치 8W",
   "spec": "TS / 타공 Ø75",
   "unit": "EA",
   "kind": "자재",
   "price": 24000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v142",
   "proc": "전기",
   "name": "COB 실린더 매입등 2인치 5W",
   "spec": "다빛 / 타공 Ø55 / 화이트,블랙(주광/주백/전구)",
   "unit": "EA",
   "kind": "자재",
   "price": 17000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v143",
   "proc": "전기",
   "name": "COB 실린더 매입등 2인치 5W (니켈/골드(주백/전구))",
   "spec": "다빛 / 타공 Ø55 / 니켈/골드(주백/전구)",
   "unit": "EA",
   "kind": "자재",
   "price": 25000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v144",
   "proc": "전기",
   "name": "COB 실린더 매입등 2인치 5W (니켈/골드(CCT))",
   "spec": "다빛 / 타공 Ø55 / 니켈/골드(CCT)",
   "unit": "EA",
   "kind": "자재",
   "price": 26000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v145",
   "proc": "전기",
   "name": "숏타입 실린더 매입등 3인치 10W",
   "spec": "SHS / 타공 Ø75 / 화이트/블랙 (주광/주백/전구)",
   "unit": "EA",
   "kind": "자재",
   "price": 19000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v146",
   "proc": "전기",
   "name": "미들타입 실린더 매입등 3인치 10W",
   "spec": "SHS / 타공 Ø75",
   "unit": "EA",
   "kind": "자재",
   "price": 22000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v147",
   "proc": "전기",
   "name": "롱타입 실린더 매입등 3인치 10W",
   "spec": "SHS / 타공 Ø75",
   "unit": "EA",
   "kind": "자재",
   "price": 26000,
   "group": "조명 · 간접등&매입등"
  },
  {
   "id": "v148",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 3구 6W",
   "spec": "다빛 / 주백/전구 / 화이트+블랙/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v149",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 5구 10W",
   "spec": "다빛 / 주백/전구 / 화이트+블랙/블랙/올화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 15000,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v150",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 5구 10W (니켈+블랙)",
   "spec": "다빛 / 주백/전구 / 니켈+블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v151",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 10구 20W",
   "spec": "다빛 / 주백/전구 / 화이트+블랙/블랙/올화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 22000,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v152",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 10구 20W (니켈+블랙)",
   "spec": "다빛 / 주백/전구 / 니켈+블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v153",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 15구 30W",
   "spec": "다빛 / 주백/전구 / 화이트+블랙/블랙/올화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 33000,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v154",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 15구 30W (니켈+블랙)",
   "spec": "다빛 / 주백/전구 / 니켈+블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v155",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 회전 5구 10W",
   "spec": "다빛 / 주백/전구 / 화이트+블랙/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 20000,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v156",
   "proc": "전기",
   "name": "마그네틱 멀티 매입 회전 10구 20W",
   "spec": "다빛 / 주백/전구 / 화이트+블랙/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 31000,
   "group": "조명 · 멀티매입등"
  },
  {
   "id": "v157",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 레일 1M",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 15000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v158",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 레일 2M",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 29000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v159",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 레일 3M",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 44000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v160",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 날개형 레일 1M",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 15000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v161",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 날개형 레일 2M",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 29000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v162",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 날개형 레일 3M",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 44000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v163",
   "proc": "전기",
   "name": "M20 마그네틱 / 라인 확산 12W [L300]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 14000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v164",
   "proc": "전기",
   "name": "M20 마그네틱 / 라인 확산 24W [L600]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 23000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v165",
   "proc": "전기",
   "name": "M20 마그네틱 / 라인 확산 30W [L900]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 29000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v166",
   "proc": "전기",
   "name": "M20 마그네틱 / 라인 확산 40W [L1200]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 39000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v167",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 집중 6W [L110]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 14000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v168",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 집중 12W [L220]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 18000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v169",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 집중 18W [L330]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 22000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v170",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 집중 24W [L440]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 25000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v171",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 집중 30W [L550]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 28000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v172",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 집중 36W [L660]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 31000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v173",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 폴더 집중 6W [L112]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 20000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v174",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 폴더 집중 12W [L225]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 37000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v175",
   "proc": "전기",
   "name": "M20 마그네틱 / 멀티 폴더 집중 18W [L325]",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 35000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v176",
   "proc": "전기",
   "name": "M20 마그네틱 / 스팟 스포트 7W",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 24000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v177",
   "proc": "전기",
   "name": "M20 마그네틱 / 스팟 스포트 12W",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 28000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v178",
   "proc": "전기",
   "name": "M20 마그네틱 / 스팟 스포트 20W",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 35000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v179",
   "proc": "전기",
   "name": "M20 마그네틱 / 공 직부 12W",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v180",
   "proc": "전기",
   "name": "M20 마그네틱 / 원반(Ø95) 집중형 스포트 9W",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v181",
   "proc": "전기",
   "name": "M20 마그네틱 / 원반(Ø95) 확산형 스포트 12W",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v182",
   "proc": "전기",
   "name": "M20 마그네틱 / 스팟 펜던트 등기구 7W",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v183",
   "proc": "전기",
   "name": "M20 마그네틱 / 스팟 펜던트 등기구 12W",
   "spec": "주백/전구 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v184",
   "proc": "전기",
   "name": "M20 마그네틱 / 블루투스 스피커 [24~48v]",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 72000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v185",
   "proc": "전기",
   "name": "M20 마그네틱 / 레일형 SMPS 100W",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 34000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v186",
   "proc": "전기",
   "name": "M20 마그네틱 / 레일형 SMPS 200W",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 44000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v187",
   "proc": "전기",
   "name": "M20 마그네틱 / 전원 입력 (노출형 SMPS용)",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 4300,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v188",
   "proc": "전기",
   "name": "M20 마그네틱 / 전원 일자 연결",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 5900,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v189",
   "proc": "전기",
   "name": "M20 마그네틱 / 전원 ㄱ자 연결",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 5900,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v190",
   "proc": "전기",
   "name": "M20 마그네틱 / 전원 T자 연결",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 15000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v191",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 노출 레일 연결 철판",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v192",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 ㄱ자 연결 부속",
   "spec": "노출시 연결철판 2개 필요 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v193",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 ㄱ자 연결 부속 (아웃코너)",
   "spec": "노출시 연결철판 2개 필요 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v194",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 ㄱ자 연결 부속 (인코너)",
   "spec": "노출시 연결철판 2개 필요 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v195",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 T자 연결 부속",
   "spec": "노출시 연결철판 3개 필요 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v196",
   "proc": "전기",
   "name": "M20 마그네틱 / A타입 십자 연결 부속",
   "spec": "노출시 연결철판 4개 필요 / 블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v197",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 ㄱ자 연결 부속",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v198",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 ㄱ자 연결 부속 (아웃코너)",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v199",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 ㄱ자 연결 부속 (인코너)",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v200",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 T자 연결 부속",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v201",
   "proc": "전기",
   "name": "M20 마그네틱 / B타입 십자 연결 부속",
   "spec": "블랙/화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v202",
   "proc": "전기",
   "name": "[M15] 블랙 / 마그네틱 레일 레일 2M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 25000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v203",
   "proc": "전기",
   "name": "[M15] 블랙 / 마그네틱 레일 레일 3M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 37000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v204",
   "proc": "전기",
   "name": "[M15] 블랙 / 라인 확산형 등기구 L300 [6W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 17000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v205",
   "proc": "전기",
   "name": "[M15] 블랙 / 라인 확산형 등기구 L600 [12W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 30000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v206",
   "proc": "전기",
   "name": "[M15] 블랙 / 멀티 집중형 등기구 L300 [6W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 22000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v207",
   "proc": "전기",
   "name": "[M15] 블랙 / 멀티 집중형 등기구 L600 [12W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 42000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v208",
   "proc": "전기",
   "name": "[M15] 블랙 / 스팟 집중형 등기구 [5W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 30000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v209",
   "proc": "전기",
   "name": "[M15] 블랙 / 사이드 스팟 집중형 등기구 [8W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 39000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v210",
   "proc": "전기",
   "name": "[M15] 블랙 / 더블 스팟 집중형 등기구 [3W*2 / CCT / 24W]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 37000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v211",
   "proc": "전기",
   "name": "[M15] 블랙 / 스팟 직부형 숏타입 등기구 [10W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 41000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v212",
   "proc": "전기",
   "name": "[M15] 블랙 / 스팟 직부형 롱타입 등기구 [10W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 39000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v213",
   "proc": "전기",
   "name": "[M15] 블랙 / 레일 연결 부속 ㄱ자",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 10000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v214",
   "proc": "전기",
   "name": "[M15] 블랙 / 레일 연결 부속 ㄱ자(인코너)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 10000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v215",
   "proc": "전기",
   "name": "[M15] 블랙 / 레일 연결 부속 ㄱ자(아웃코너)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 10000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v216",
   "proc": "전기",
   "name": "[M15] 블랙 / 전원 연결 부속 / 전원 입력",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 9200,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v217",
   "proc": "전기",
   "name": "[M15] 블랙 / 전원 연결 부속 / 일자 연결",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 11000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v218",
   "proc": "전기",
   "name": "[M15] 블랙 / 전원 연결 부속 / ㄱ자 연결선",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 13000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v219",
   "proc": "전기",
   "name": "[M15] 블랙 / 전원 연결 부속 / ㄱ자 커버 연결 / 수평전용",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 13000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v220",
   "proc": "전기",
   "name": "[M15] 블랙 / 전원+레일 / ㄱ자 수평 세트",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 23000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v221",
   "proc": "전기",
   "name": "[M15] 블랙 / 마감캡",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 200,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v222",
   "proc": "전기",
   "name": "[M15] 블루투스 스피커 [블랙 / DC24v~48v]",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 68000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v223",
   "proc": "전기",
   "name": "[M15] 블루투스 스피커 [화이트 / DC24v~48v]",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 68000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v224",
   "proc": "전기",
   "name": "[메타스마트] 스트립 컨트롤러 [DC42V / 240W]",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 32000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v225",
   "proc": "전기",
   "name": "[메타스마트] 2.4G 무선 스위치",
   "spec": "화이트 / 그레이",
   "unit": "EA",
   "kind": "자재",
   "price": 27000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v226",
   "proc": "전기",
   "name": "[메타스마트] 2.4G 무선리모컨",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 11000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v227",
   "proc": "전기",
   "name": "[M15] 니켈 / 마그네틱 레일 레일 2M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 30000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v228",
   "proc": "전기",
   "name": "[M15] 니켈 / 마그네틱 레일 레일 3M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 45000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v229",
   "proc": "전기",
   "name": "[M15] 니켈 / 라인 확산형 등기구 L300 [6W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 22000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v230",
   "proc": "전기",
   "name": "[M15] 니켈 / 라인 확산형 등기구 L600 [12W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 34000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v231",
   "proc": "전기",
   "name": "[M15] 니켈 / 멀티 집중형 등기구 L300 [6W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 27000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v232",
   "proc": "전기",
   "name": "[M15] 니켈 / 멀티 집중형 등기구 L600 [12W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 46000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v233",
   "proc": "전기",
   "name": "[M15] 니켈 / 스팟 집중형 등기구 [5W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 33000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v234",
   "proc": "전기",
   "name": "[M15] 니켈 / 사이드 스팟 집중형 등기구 [8W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 42000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v235",
   "proc": "전기",
   "name": "[M15] 니켈 / 더블 스팟 집중형 등기구 [3W*2 / CCT / 24W]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 41000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v236",
   "proc": "전기",
   "name": "[M15] 니켈 / 스팟 직부형 숏타입 등기구 [10W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 44000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v237",
   "proc": "전기",
   "name": "[M15] 니켈 / 스팟 직부형 롱타입 등기구 [10W / CCT / 24V]",
   "spec": "CCT",
   "unit": "EA",
   "kind": "자재",
   "price": 42000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v238",
   "proc": "전기",
   "name": "[M15] 니켈 / 레일 연결 부속 ㄱ자",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 11000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v239",
   "proc": "전기",
   "name": "[M15] 니켈 / 레일 연결 부속 ㄱ자(인코너)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 11000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v240",
   "proc": "전기",
   "name": "[M15] 니켈 / 레일 연결 부속 ㄱ자(아웃코너)",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 11000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v241",
   "proc": "전기",
   "name": "[M15] 니켈 / 전원 연결 부속 / 전원 입력",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 10000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v242",
   "proc": "전기",
   "name": "[M15] 니켈 / 전원 연결 부속 / 일자 연결",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 11000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v243",
   "proc": "전기",
   "name": "[M15] 니켈 / 전원 연결 부속 / ㄱ자 연결선",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 14000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v244",
   "proc": "전기",
   "name": "[M15] 니켈 / 전원 연결 부속 / ㄱ자 커버 연결 / 수평전용",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 14000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v245",
   "proc": "전기",
   "name": "[M15] 니켈 / 전원+레일 / ㄱ자 수평 세트",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 26000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v246",
   "proc": "전기",
   "name": "[M15] 니켈 / 마감캡",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 200,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v247",
   "proc": "전기",
   "name": "M10 블랙 / A타입 레일 1M",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 18000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v248",
   "proc": "전기",
   "name": "M10 블랙 / A타입 레일 2M",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 37000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v249",
   "proc": "전기",
   "name": "M10 블랙 / A타입 레일 3M",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 55000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v250",
   "proc": "전기",
   "name": "M10 블랙 / B타입 날개형 레일 1M",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 18000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v251",
   "proc": "전기",
   "name": "M10 블랙 / B타입 날개형 레일 2M",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 37000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v252",
   "proc": "전기",
   "name": "M10 블랙 / B타입 날개형 레일 3M",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 55000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v253",
   "proc": "전기",
   "name": "M10 마그네틱 / 스팟 스포트 7W",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 27000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v254",
   "proc": "전기",
   "name": "M10 마그네틱 / 스팟 스포트 10W",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 27000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v255",
   "proc": "전기",
   "name": "M10 마그네틱 / 멀티 집중 6W [L150]",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 15000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v256",
   "proc": "전기",
   "name": "M10 마그네틱 / 멀티 집중 12W [L300]",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 18000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v257",
   "proc": "전기",
   "name": "M10 마그네틱 / 멀티 집중 18W [L430]",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 23000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v258",
   "proc": "전기",
   "name": "M10 마그네틱 / 라인 확산 12W [L300]",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 18000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v259",
   "proc": "전기",
   "name": "M10 마그네틱 / 라인 확산 24W [L600]",
   "spec": "주백/전구 / 블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 23000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v260",
   "proc": "전기",
   "name": "M10 마그네틱 / ㄱ자 연결 부속",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 8600,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v261",
   "proc": "전기",
   "name": "M10 마그네틱 / ㄱ자 연결 부속 (아웃코너)",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 8600,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v262",
   "proc": "전기",
   "name": "M10 마그네틱 / ㄱ자 연결 부속 (인코너)",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 8600,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v263",
   "proc": "전기",
   "name": "M10 마그네틱 / 십자 연결 부속",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v264",
   "proc": "전기",
   "name": "M10 마그네틱 / T자 연결 부속",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v265",
   "proc": "전기",
   "name": "M10 마그네틱 / 날개형 ㄱ자 연결 부속",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 8600,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v266",
   "proc": "전기",
   "name": "M10 마그네틱 / 날개형 ㄱ자 연결 부속 (아웃코너)",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 8600,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v267",
   "proc": "전기",
   "name": "M10 마그네틱 / 날개형 ㄱ자 연결 부속 (인코너)",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 8600,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v268",
   "proc": "전기",
   "name": "M10 마그네틱 / 날개형 십자 연결 부속",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v269",
   "proc": "전기",
   "name": "M10 마그네틱 / 날개형 T자 연결 부속",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v270",
   "proc": "전기",
   "name": "M10 마그네틱 / 전원 일자 연결선",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 4300,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v271",
   "proc": "전기",
   "name": "M10 마그네틱 / 전원 ㄱ자 연결선",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 5400,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v272",
   "proc": "전기",
   "name": "M10 마그네틱 / 전원 입력선",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 4300,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v273",
   "proc": "전기",
   "name": "[마그네틱/전원] 노출형 SMPS 100W",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 41000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v274",
   "proc": "전기",
   "name": "[마그네틱/전원] 노출형 SMPS 200W",
   "spec": "블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 54000,
   "group": "조명 · 마그네틱"
  },
  {
   "id": "v275",
   "proc": "전기",
   "name": "[SH] 프리컷 COB 라인바 24V 10M",
   "spec": "주광/주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 26000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v276",
   "proc": "전기",
   "name": "전원 연결선",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 1100,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v277",
   "proc": "전기",
   "name": "일자 연결잭",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 1000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v278",
   "proc": "전기",
   "name": "ㄱ자 연결잭",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 1000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v279",
   "proc": "전기",
   "name": "실리콘바 10*10 1M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 2200,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v280",
   "proc": "전기",
   "name": "실리콘바 15*10 1M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 2800,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v281",
   "proc": "전기",
   "name": "실리콘바 20*10 1M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 3500,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v282",
   "proc": "전기",
   "name": "실리콘바 30*20 1M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 5400,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v283",
   "proc": "전기",
   "name": "[SH/DC24V] 프리컷팅 / 10*10 그립 스트립(실리콘 라인바) 10m",
   "spec": "주광/주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 54000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v284",
   "proc": "전기",
   "name": "[SH/DC24V] 프리컷팅 / 20*10 그립 스트립(실리콘 라인바) 10m",
   "spec": "주광/주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 81000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v285",
   "proc": "전기",
   "name": "[SH/DC24V] 그립 스트립(실리콘 라인바) 용 전원 입력 1m",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 800,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v286",
   "proc": "전기",
   "name": "[SH/DC24V] 그립 스트립(실리콘 라인바) 용 일자 연결",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 600,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v287",
   "proc": "전기",
   "name": "[SH/DC24V] 그립 스트립(실리콘 라인바) 용 일자(ㄱ자) 연결 5cm",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 600,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v288",
   "proc": "전기",
   "name": "[SH/DC24V] 그립 스트립(실리콘 라인바) 용 브라켓 10*10",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 400,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v289",
   "proc": "전기",
   "name": "[SH/DC24V] 그립 스트립(실리콘 라인바) 용 마감캡 10*10",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 400,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v290",
   "proc": "전기",
   "name": "[SH/DC24V] 그립 스트립(실리콘 라인바) 용 브라켓 20*10",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 400,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v291",
   "proc": "전기",
   "name": "[SH/DC24V] 그립 스트립(실리콘 라인바) 용 마감캡 20*10",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 400,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v292",
   "proc": "전기",
   "name": "[메타스마트] 스트립 컨트롤러 [DC42V / 240W] #291",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 32000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v293",
   "proc": "전기",
   "name": "[메타스마트] 2.4G 무선 스위치 (그레이)",
   "spec": "화이트 / 그레이",
   "unit": "EA",
   "kind": "자재",
   "price": 27000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v294",
   "proc": "전기",
   "name": "[메타스마트] 2.4G 무선리모컨 #293",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 11000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v295",
   "proc": "전기",
   "name": "[루멘룩스] 라인바용 안정기 24V 60W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v296",
   "proc": "전기",
   "name": "[루멘룩스] 라인바용 안정기 24V 100W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 18000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v297",
   "proc": "전기",
   "name": "[루멘룩스] 라인바용 안정기 24V 200W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 29000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v298",
   "proc": "전기",
   "name": "[루멘룩스] 라인바용 안정기 24V 300W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 35000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v299",
   "proc": "전기",
   "name": "[가구조명용] SMPS 24V 100W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 52000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v300",
   "proc": "전기",
   "name": "[가구조명용/디밍] 동그란 히든 터치 S/W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 16000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v301",
   "proc": "전기",
   "name": "[가구조명용/디밍] 온오프 터치 S/W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 16000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v302",
   "proc": "전기",
   "name": "[가구조명용/페이드 인 아웃] 선반 서랍(도어) 온오프 센서 S/W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 16000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v303",
   "proc": "전기",
   "name": "[가구조명용/디밍] 모션 센서 S/W",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 16000,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v304",
   "proc": "전기",
   "name": "[가구조명용] 등기구 연결선 2M",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 2700,
   "group": "조명 · 가구조명"
  },
  {
   "id": "v305",
   "proc": "전기",
   "name": "레일 1M",
   "spec": "SHS / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 3900,
   "group": "조명 · 레일"
  },
  {
   "id": "v306",
   "proc": "전기",
   "name": "레일 2M",
   "spec": "SHS / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 7800,
   "group": "조명 · 레일"
  },
  {
   "id": "v307",
   "proc": "전기",
   "name": "레일 3M",
   "spec": "SHS / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 레일"
  },
  {
   "id": "v308",
   "proc": "전기",
   "name": "레일부속 / 전원 마감",
   "spec": "화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 1300,
   "group": "조명 · 레일"
  },
  {
   "id": "v309",
   "proc": "전기",
   "name": "레일부속 / 일자 마감",
   "spec": "화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 1300,
   "group": "조명 · 레일"
  },
  {
   "id": "v310",
   "proc": "전기",
   "name": "레일부속 / ㄱ자 연결",
   "spec": "화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 1500,
   "group": "조명 · 레일"
  },
  {
   "id": "v311",
   "proc": "전기",
   "name": "레일부속 / T자 연결",
   "spec": "화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 2700,
   "group": "조명 · 레일"
  },
  {
   "id": "v312",
   "proc": "전기",
   "name": "레일부속 / +자 연결",
   "spec": "화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 2700,
   "group": "조명 · 레일"
  },
  {
   "id": "v313",
   "proc": "전기",
   "name": "레일부속 / 레일지지대(너트일체형)",
   "spec": "화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 1300,
   "group": "조명 · 레일"
  },
  {
   "id": "v314",
   "proc": "전기",
   "name": "VER2 에코 티로드 T7 레일등 15W",
   "spec": "동성 / 주광/주백/전구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 4900,
   "group": "조명 · 레일"
  },
  {
   "id": "v315",
   "proc": "전기",
   "name": "VER2 에코 티로드 T7 레일등 20W",
   "spec": "동성 / 주광/주백/전구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 5400,
   "group": "조명 · 레일"
  },
  {
   "id": "v316",
   "proc": "전기",
   "name": "VER2 에코 티로드 T7 레일등 25W",
   "spec": "동성 / 주광/주백/전구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 5900,
   "group": "조명 · 레일"
  },
  {
   "id": "v317",
   "proc": "전기",
   "name": "VER2 에코 티로드 T7 레일등 30W",
   "spec": "동성 / 주광/주백/전구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 6500,
   "group": "조명 · 레일"
  },
  {
   "id": "v318",
   "proc": "전기",
   "name": "에코 카네스 COB 원형레일 10W",
   "spec": "동성 / 주광/주백/전구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 7000,
   "group": "조명 · 레일"
  },
  {
   "id": "v319",
   "proc": "전기",
   "name": "에코 카네스 COB 원형레일 20W",
   "spec": "동성 / 주광/주백/전구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 9200,
   "group": "조명 · 레일"
  },
  {
   "id": "v320",
   "proc": "전기",
   "name": "에코 카네스 COB 원형레일 30W",
   "spec": "동성 / 주광/주백/전구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "조명 · 레일"
  },
  {
   "id": "v321",
   "proc": "전기",
   "name": "미니 송이 레일",
   "spec": "SHS / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 레일"
  },
  {
   "id": "v322",
   "proc": "전기",
   "name": "미니 송이 1등 P/D 레일",
   "spec": "SHS / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 레일"
  },
  {
   "id": "v323",
   "proc": "전기",
   "name": "원통 레일",
   "spec": "SHS / E26 볼구 / 화이트/블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 레일"
  },
  {
   "id": "v324",
   "proc": "전기",
   "name": "LED PAR 30 15W 확산",
   "spec": "비츠온 / 주광/주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 레일"
  },
  {
   "id": "v325",
   "proc": "전기",
   "name": "LED PAR 30 15W 집중",
   "spec": "비츠온 / 주광/주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 레일"
  },
  {
   "id": "v326",
   "proc": "전기",
   "name": "LED 볼구 G80 10W",
   "spec": "비츠온 / 주광/주백/전구",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 레일"
  },
  {
   "id": "v327",
   "proc": "전기",
   "name": "42인치 에어프리 실링팬",
   "spec": "오케이 / 올화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 140000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v328",
   "proc": "전기",
   "name": "52인치 에어프리 실링팬",
   "spec": "오케이 / 올화이트/화이트+우드/올블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 140000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v329",
   "proc": "전기",
   "name": "LED 42인치 에어프리 실링팬",
   "spec": "오케이 / 3색변환 / 올화이트/화이트+우드/올블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 156000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v330",
   "proc": "전기",
   "name": "LED 52인치 에어프리 실링팬",
   "spec": "오케이 / 3색변환 / 올화이트/화이트+우드/올블랙",
   "unit": "EA",
   "kind": "자재",
   "price": 156000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v331",
   "proc": "전기",
   "name": "로슬러 프라임 3 52인치",
   "spec": "로슬러 / R타입, S타입 / 화이트+화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 248000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v332",
   "proc": "전기",
   "name": "로슬러 프라임 3 52인치 (화이트+애쉬)",
   "spec": "로슬러 / R타입, S타입 / 화이트+월넛 / 화이트+애쉬",
   "unit": "EA",
   "kind": "자재",
   "price": 259000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v333",
   "proc": "전기",
   "name": "로슬러 프라임 3 42인치 R타입",
   "spec": "로슬러 / R타입, S타입 / 화이트+화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 243000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v334",
   "proc": "전기",
   "name": "로슬러 프라임 3 42인치 S타입",
   "spec": "로슬러 / R타입, S타입 / 화이트+월넛 / 화이트+애쉬",
   "unit": "EA",
   "kind": "자재",
   "price": 254000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v335",
   "proc": "전기",
   "name": "루씨에어 레이더3 실링팬 132cm",
   "spec": "화이트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v336",
   "proc": "전기",
   "name": "힘펠) 휴젠뜨2 복합환풍기 FHD-P150S1",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 334000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v337",
   "proc": "전기",
   "name": "힘펠) 휴젠뜨3 복합환풍기 FHD3-C150P",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 636000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v338",
   "proc": "전기",
   "name": "힘펠) 휴젠뜨 노바 FHD2-C150P NOVA",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 388000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v339",
   "proc": "전기",
   "name": "힘펠) 휴젠뜨 팔레트 FHD2-C150P",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 529000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v340",
   "proc": "전기",
   "name": "하츠) 티오람 HMF-G500",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 334000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v341",
   "proc": "전기",
   "name": "하츠) 티오람 미니 HMF-J300",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 129000,
   "group": "조명 · 실링팬&휴젠뜨"
  },
  {
   "id": "v342",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 1285*320 [50W / 5700K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 16000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v343",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 1290*320 [50W / 4000K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 17000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v344",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 1290*230 [50W / 5700K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 21000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v345",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 640*640 [50W / 5700K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 16000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v346",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 640*640 [50W / 4000K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 17000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v347",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 540*540 [50W / 5700K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 20000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v348",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 640*320 [30W / 5700K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 17000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v349",
   "proc": "전기",
   "name": "[KC/IC] 에코 슬림 직하 엣지등 640*230 [25W / 5700K]",
   "spec": "데이온",
   "unit": "EA",
   "kind": "자재",
   "price": 17000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v350",
   "proc": "전기",
   "name": "[비츠온] LED 심플 시스템 거실6등 150W",
   "spec": "일신 / 6500K",
   "unit": "EA",
   "kind": "자재",
   "price": 83000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v351",
   "proc": "전기",
   "name": "[비츠온] LED 심플 시스템 거실4등 100W",
   "spec": "일신 / 6500K",
   "unit": "EA",
   "kind": "자재",
   "price": 56000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v352",
   "proc": "전기",
   "name": "[비츠온] LED 심플 시스템 주방2등 50W",
   "spec": "일신 / 6500K",
   "unit": "EA",
   "kind": "자재",
   "price": 20000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v353",
   "proc": "전기",
   "name": "[비츠온] LED 심플 시스템 주방1등 25W",
   "spec": "일신 / 6500K",
   "unit": "EA",
   "kind": "자재",
   "price": 15000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v354",
   "proc": "전기",
   "name": "[비츠온] LED 심플 시스템 방등 50W",
   "spec": "일신 / 6500K",
   "unit": "EA",
   "kind": "자재",
   "price": 15000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v355",
   "proc": "전기",
   "name": "[비츠온] LED 원형 방등 50W",
   "spec": "일신 / 6500K",
   "unit": "EA",
   "kind": "자재",
   "price": 20000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v356",
   "proc": "전기",
   "name": "아토 실링팬 방등 50W",
   "spec": "오케이 / 3색변환",
   "unit": "EA",
   "kind": "자재",
   "price": 167000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v357",
   "proc": "전기",
   "name": "LED 윈드 실링팬 방등 50W",
   "spec": "오케이 / 3색변환",
   "unit": "EA",
   "kind": "자재",
   "price": 96000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "v358",
   "proc": "전기",
   "name": "LED 윈드 실링팬 방등 75W",
   "spec": "오케이 / 3색변환",
   "unit": "EA",
   "kind": "자재",
   "price": 119000,
   "group": "조명 · 홈조명"
  },
  {
   "id": "x001",
   "proc": "가설",
   "name": "엘리베이터 보양",
   "spec": "골판지/보양판/비닐 / 공용부 보양",
   "unit": "식",
   "kind": "경비",
   "price": 209000,
   "group": "엑셀 품목"
  },
  {
   "id": "x002",
   "proc": "가설",
   "name": "현관/복도 보양",
   "spec": "보양판/텐텐지 / 진입 동선 보양",
   "unit": "식",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x003",
   "proc": "가설",
   "name": "바닥 보양재",
   "spec": "텐텐지/보양매트/보양판 / 마루·타일 보호",
   "unit": "㎡",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x004",
   "proc": "가설",
   "name": "문틀/샷시 보양",
   "spec": "마스킹테이프/커버링 / 도장·필름 보호",
   "unit": "식",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x005",
   "proc": "가설",
   "name": "비닐 보양",
   "spec": "커버링/보양비닐 / 가구·창호 보호",
   "unit": "롤",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x006",
   "proc": "가설",
   "name": "마스킹테이프",
   "spec": "24/48/50mm / 도장·실리콘 보양",
   "unit": "롤",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x007",
   "proc": "가설",
   "name": "분진막/집진비닐",
   "spec": "출입구용 / 철거/목공 분진 차단",
   "unit": "식",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x008",
   "proc": "철거",
   "name": "폐기물 마대",
   "spec": "20kg/40kg / 철거 폐기물 담기",
   "unit": "장",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x009",
   "proc": "철거",
   "name": "폐기물 처리비",
   "spec": "혼합/목재/타일/석고 / 폐기물 반출",
   "unit": "식",
   "kind": "노무",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x010",
   "proc": "철거",
   "name": "양중/사다리차",
   "spec": "층수별 / 자재 양중 및 폐기물 반출",
   "unit": "회",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x011",
   "proc": "철거",
   "name": "집진/청소 소모품",
   "spec": "청소포/빗자루/마대 / 공정 중 청소",
   "unit": "식",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x012",
   "proc": "철거",
   "name": "철거 날/소모품",
   "spec": "그라인더날/컷팅날 / 철거 장비 소모품",
   "unit": "EA",
   "kind": "노무",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x013",
   "proc": "기타",
   "name": "자동확산소화기",
   "spec": "주방용/천장형 / 가스레인지·후드 상부",
   "unit": "EA",
   "kind": "자재",
   "price": 445000,
   "group": "엑셀 품목"
  },
  {
   "id": "x014",
   "proc": "기타",
   "name": "단독형 감지기",
   "spec": "연기/열 감지기 / 확장부·주방·거실",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x015",
   "proc": "기타",
   "name": "스프링클러 헤드",
   "spec": "상향/하향/측벽형 / 설비 이설 또는 교체",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x016",
   "proc": "기타",
   "name": "스프링클러 커버",
   "spec": "원형 커버 / 천장 마감 후 커버",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x017",
   "proc": "기타",
   "name": "방화판/방화보드",
   "spec": "준불연/불연 확인 / 확장 사용승인 부위",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x018",
   "proc": "기타",
   "name": "방화실리콘",
   "spec": "내화/방화용 / 관통부·틈새 방화 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x019",
   "proc": "기타",
   "name": "소화기",
   "spec": "분말 3.3kg 등 / 세대 또는 주방 비치",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x020",
   "proc": "설비",
   "name": "엑셀배관 XL배관",
   "spec": "15A/20A / 냉수·온수 배관",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x021",
   "proc": "설비",
   "name": "PB배관",
   "spec": "15A/20A / 냉온수 배관",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x022",
   "proc": "설비",
   "name": "주름관",
   "spec": "스텐 주름관 / 수전·보일러 연결",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x023",
   "proc": "설비",
   "name": "카플링/커플링",
   "spec": "XL/PB용 / 배관 연결",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x024",
   "proc": "설비",
   "name": "서비스니플",
   "spec": "15A/20A / 수전·밸브 연결",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x025",
   "proc": "설비",
   "name": "엘보",
   "spec": "15A/20A / 배관 방향 전환",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x026",
   "proc": "설비",
   "name": "티/T자 부속",
   "spec": "15A/20A / 배관 분기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x027",
   "proc": "설비",
   "name": "소켓",
   "spec": "15A/20A / 배관 연장 연결",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x028",
   "proc": "설비",
   "name": "레듀샤",
   "spec": "이경 연결 / 규격 다른 배관 연결",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x029",
   "proc": "설비",
   "name": "볼밸브",
   "spec": "15A/20A / 급수 차단 밸브",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x030",
   "proc": "설비",
   "name": "앵글밸브",
   "spec": "세면대/변기/싱크 / 급수 차단",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x031",
   "proc": "설비",
   "name": "고압호스",
   "spec": "30/40/60cm / 수전·양변기 연결",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x032",
   "proc": "설비",
   "name": "테프론테이프",
   "spec": "일반형 / 나사산 누수 방지",
   "unit": "EA",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x033",
   "proc": "설비",
   "name": "PVC 배관",
   "spec": "VG1/VG2 50/75/100A / 욕실·싱크·세탁 배수",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x034",
   "proc": "설비",
   "name": "PVC 엘보",
   "spec": "50/75/100A / 배수 방향 전환",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x035",
   "proc": "설비",
   "name": "PVC 티",
   "spec": "50/75/100A / 배수 분기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x036",
   "proc": "설비",
   "name": "PVC 소켓",
   "spec": "50/75/100A / 배수관 연결",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x037",
   "proc": "설비",
   "name": "유가",
   "spec": "욕실/베란다용 / 바닥 배수구",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x038",
   "proc": "설비",
   "name": "트랩",
   "spec": "P트랩/S트랩/봉수트랩 / 악취 역류 방지",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x039",
   "proc": "설비",
   "name": "세탁기 배수구",
   "spec": "일반/겸용 / 세탁실 배수 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x040",
   "proc": "설비",
   "name": "싱크 배수세트",
   "spec": "일반/대형볼 / 싱크대 하부 배수",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x041",
   "proc": "설비",
   "name": "액체방수재",
   "spec": "완결방수액 등 / 욕실·베란다 바탕 방수",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x042",
   "proc": "설비",
   "name": "도막방수재",
   "spec": "마페이/아덱스 등 / 욕실 벽·바닥 방수",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x043",
   "proc": "설비",
   "name": "방수 프라이머",
   "spec": "방수재용 / 방수 전 접착력 향상",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x044",
   "proc": "설비",
   "name": "부직포/방수테이프",
   "spec": "코너/조인트용 / 모서리·배관 주변 보강",
   "unit": "롤",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x045",
   "proc": "설비",
   "name": "실란트/방수실리콘",
   "spec": "바이오/우레탄 / 욕실·창호 누수 취약부",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x046",
   "proc": "목공",
   "name": "각재",
   "spec": "30x30/30x45/45x45 / 천장틀·가벽틀·박스틀",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x047",
   "proc": "목공",
   "name": "투바이/구조목",
   "spec": "2x4 등 / 가벽·보강틀",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x048",
   "proc": "목공",
   "name": "MDF",
   "spec": "3T/6T/9T/12T/18T / 문선·몰딩·가구 보조",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x049",
   "proc": "목공",
   "name": "일반합판",
   "spec": "4.8T/9T/12T / 벽·천장·가구 보강",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x050",
   "proc": "목공",
   "name": "내수합판",
   "spec": "9T/12T/18T / 습기 우려 부위 보강",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x051",
   "proc": "목공",
   "name": "석고보드",
   "spec": "9.5T/12.5T / 벽체·천장 마감",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x052",
   "proc": "목공",
   "name": "방수석고보드",
   "spec": "9.5T/12.5T / 욕실 주변·습기 부위",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x053",
   "proc": "목공",
   "name": "방화석고보드",
   "spec": "12.5T/15T / 방화구획·법규 부위",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x054",
   "proc": "목공",
   "name": "준불연보드",
   "spec": "마그네슘/시멘트보드 / 불연/준불연 필요 부위",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x055",
   "proc": "목공",
   "name": "아이소핑크/단열재",
   "spec": "30T/50T/100T / 내부 단열·결로 보완",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x056",
   "proc": "목공",
   "name": "우레탄폼",
   "spec": "일반/난연 / 틈새 충진·창호 주변",
   "unit": "캔",
   "kind": "자재",
   "price": 7700,
   "group": "엑셀 품목"
  },
  {
   "id": "x057",
   "proc": "목공",
   "name": "목공본드",
   "spec": "오공본드 등 / 목재 접착",
   "unit": "EA",
   "kind": "자재",
   "price": 2600,
   "group": "엑셀 품목"
  },
  {
   "id": "x058",
   "proc": "목공",
   "name": "F30 타카핀",
   "spec": "30mm / 몰딩·MDF 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x059",
   "proc": "목공",
   "name": "F50 타카핀",
   "spec": "50mm / 두꺼운 목재 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x060",
   "proc": "목공",
   "name": "422 타카핀",
   "spec": "ㄷ자핀 / 얇은 판재 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 4000,
   "group": "엑셀 품목"
  },
  {
   "id": "x061",
   "proc": "목공",
   "name": "콘크리트 타카핀",
   "spec": "25/32/38mm / 콘크리트면 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x062",
   "proc": "목공",
   "name": "목재피스",
   "spec": "32/38/50/65mm / 목재 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x063",
   "proc": "목공",
   "name": "석고피스",
   "spec": "25/32mm / 석고보드 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x064",
   "proc": "목공",
   "name": "칼블럭",
   "spec": "6/8/10mm / 콘크리트 벽체 고정",
   "unit": "봉",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x065",
   "proc": "목공",
   "name": "천장몰딩",
   "spec": "마이너스/평몰딩/갈매기 / 천장과 벽 이음 마감",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x066",
   "proc": "목공",
   "name": "문선몰딩",
   "spec": "평문선/무문선 보조 / 문틀 주변 마감",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x067",
   "proc": "목공",
   "name": "걸레받이",
   "spec": "MDF/PVC/도장용 / 벽·바닥 이음 마감",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x068",
   "proc": "목공",
   "name": "루바/템바보드",
   "spec": "MDF/PVC/원목 / 포인트 벽체 마감",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x069",
   "proc": "목공",
   "name": "아트월 보드",
   "spec": "세라믹/목재/필름보드 / 거실 포인트 마감",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x070",
   "proc": "전기",
   "name": "IV 전선",
   "spec": "1.5SQ / 조명 배선",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x071",
   "proc": "전기",
   "name": "IV 전선 (2.5SQ)",
   "spec": "2.5SQ / 콘센트·전열 배선",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x072",
   "proc": "전기",
   "name": "IV 전선 (4SQ)",
   "spec": "4SQ / 에어컨·고부하 회로",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x073",
   "proc": "전기",
   "name": "CV 케이블",
   "spec": "2.5/4/6SQ / 전용회로·분전반",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x074",
   "proc": "전기",
   "name": "VCTF 케이블",
   "spec": "0.75/1.5SQ / 기기 연결·간접조명",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x075",
   "proc": "전기",
   "name": "CD관",
   "spec": "16/22/28mm / 전선 보호 배관",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x076",
   "proc": "전기",
   "name": "후렉시블관",
   "spec": "16/22mm / 곡선 구간 전선 보호",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x077",
   "proc": "전기",
   "name": "커넥터/부싱",
   "spec": "CD/후렉시블용 / 배관 연결·마감",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x078",
   "proc": "전기",
   "name": "매입복스",
   "spec": "1개용/2개용 / 스위치·콘센트 매립",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x079",
   "proc": "전기",
   "name": "노출박스",
   "spec": "1개용/2개용 / 노출 배선 기구 설치",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x080",
   "proc": "전기",
   "name": "스위치",
   "spec": "1구/2구/3구/4구 / 조명 제어",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x081",
   "proc": "전기",
   "name": "콘센트",
   "spec": "2구/접지형 / 일반 전원",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x082",
   "proc": "전기",
   "name": "방우콘센트",
   "spec": "욕실/베란다용 / 습기 부위 콘센트",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x083",
   "proc": "전기",
   "name": "통신/TV 아울렛",
   "spec": "인터넷/TV / 통신 단자 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x084",
   "proc": "전기",
   "name": "다운라이트",
   "spec": "3/4/6인치 / 거실·복도·방 조명",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x085",
   "proc": "전기",
   "name": "라인조명 (M10/M20/매입형)",
   "spec": "M10/M20/매입형 / 거실·주방 라인 조명",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x086",
   "proc": "전기",
   "name": "간접조명 LED바",
   "spec": "12V/24V / 우물천장·가구 하부",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x087",
   "proc": "전기",
   "name": "LED 안정기/SMPS",
   "spec": "용량별 / LED 전원 공급",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x088",
   "proc": "전기",
   "name": "센서등",
   "spec": "현관/복도 / 자동 점등 조명",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x089",
   "proc": "전기",
   "name": "실링팬 보강자재",
   "spec": "보강목/브라켓 / 천장 실링팬 설치 보강",
   "unit": "식",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x090",
   "proc": "전기",
   "name": "분전함",
   "spec": "세대용 / 차단기 수납함",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x091",
   "proc": "전기",
   "name": "누전차단기",
   "spec": "20A/30A 등 / 누전 보호",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x092",
   "proc": "전기",
   "name": "배선차단기",
   "spec": "20A/30A 등 / 과전류 보호",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x093",
   "proc": "전기",
   "name": "접지자재",
   "spec": "접지선/터미널 / 접지 보완",
   "unit": "식",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x094",
   "proc": "전기",
   "name": "인터폰/비디오폰",
   "spec": "코콤/코맥스/현대통신 등 / 공동현관 연동 확인",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x095",
   "proc": "전기",
   "name": "도어락",
   "spec": "번호/카드/지문/푸시풀 / 현관문 잠금장치",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x096",
   "proc": "타일",
   "name": "600각 타일",
   "spec": "600x600 포세린/폴리싱 / 거실·욕실·현관 바닥/벽",
   "unit": "박스",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x097",
   "proc": "타일",
   "name": "300각 타일",
   "spec": "300x300 / 욕실 바닥·베란다",
   "unit": "박스",
   "kind": "자재",
   "price": 17000,
   "group": "엑셀 품목"
  },
  {
   "id": "x098",
   "proc": "타일",
   "name": "300x600 타일",
   "spec": "300x600 / 욕실 벽체",
   "unit": "박스",
   "kind": "자재",
   "price": 17000,
   "group": "엑셀 품목"
  },
  {
   "id": "x099",
   "proc": "타일",
   "name": "200각 타일",
   "spec": "200x200 / 욕실/베란다 바닥",
   "unit": "박스",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x100",
   "proc": "타일",
   "name": "모자이크 타일",
   "spec": "시트형 / 포인트 벽·바닥",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x101",
   "proc": "타일",
   "name": "현관 타일 (논슬립/포세린)",
   "spec": "논슬립/포세린 / 현관 바닥",
   "unit": "박스",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x102",
   "proc": "타일",
   "name": "압착시멘트 (일반/고급)",
   "spec": "일반/고급 / 타일 접착",
   "unit": "포",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x103",
   "proc": "타일",
   "name": "몰탈",
   "spec": "시멘트몰탈 / 바닥 구배·바탕 조성",
   "unit": "포",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x104",
   "proc": "타일",
   "name": "타일본드 (내장용/고성능)",
   "spec": "내장용/고성능 / 벽타일 접착",
   "unit": "통",
   "kind": "자재",
   "price": 19000,
   "group": "엑셀 품목"
  },
  {
   "id": "x105",
   "proc": "타일",
   "name": "타일 프라이머",
   "spec": "타일 접착용 / 바탕면 접착력 향상",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x106",
   "proc": "타일",
   "name": "일반 메지",
   "spec": "백색/회색 / 타일 줄눈",
   "unit": "포",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x107",
   "proc": "타일",
   "name": "아덱스 메지",
   "spec": "색상별 / 고급 줄눈",
   "unit": "포",
   "kind": "자재",
   "price": 8000,
   "group": "엑셀 품목"
  },
  {
   "id": "x108",
   "proc": "타일",
   "name": "에폭시 줄눈",
   "spec": "2액형 / 오염·방수성 줄눈",
   "unit": "세트",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x109",
   "proc": "타일",
   "name": "코너비드",
   "spec": "PVC/스텐/알루미늄 / 타일 모서리 마감",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x110",
   "proc": "타일",
   "name": "십자스페이서",
   "spec": "1.5/2/3mm / 타일 간격 유지",
   "unit": "봉",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x111",
   "proc": "욕실",
   "name": "양변기",
   "spec": "투피스/원피스/치마형 / 욕실 변기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x112",
   "proc": "욕실",
   "name": "세면대",
   "spec": "긴다리/반다리/탑볼/하부장형 / 욕실 세면 도기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x113",
   "proc": "욕실",
   "name": "세면수전",
   "spec": "원홀/투홀/매립 / 세면대 수전",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x114",
   "proc": "욕실",
   "name": "샤워수전",
   "spec": "일반/해바라기/매립 / 욕실 샤워 수전",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x115",
   "proc": "욕실",
   "name": "욕조수전",
   "spec": "벽붙이/매립 / 욕조 사용 시",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x116",
   "proc": "욕실",
   "name": "욕실 거울",
   "spec": "일반/LED / 세면대 상부",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x117",
   "proc": "욕실",
   "name": "욕실장/슬라이드장",
   "spec": "상부장/거울장 / 욕실 수납",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x118",
   "proc": "욕실",
   "name": "수건걸이 (일반/블랙/스텐)",
   "spec": "일반/블랙/스텐 / 욕실 액세서리",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x119",
   "proc": "욕실",
   "name": "휴지걸이",
   "spec": "일반/매립/블랙 / 욕실 액세서리",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x120",
   "proc": "욕실",
   "name": "코너선반",
   "spec": "유리/스텐/블랙 / 샤워부스 내부",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x121",
   "proc": "욕실",
   "name": "환풍기",
   "spec": "일반/힘펠 등 / 욕실 환기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x122",
   "proc": "욕실",
   "name": "욕실 도어",
   "spec": "ABS/터닝/알루미늄 / 욕실 문 교체",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x123",
   "proc": "욕실",
   "name": "샤워부스 (파티션/여닫이/슬라이딩)",
   "spec": "파티션/여닫이/슬라이딩 / 욕실 공간 분리",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x124",
   "proc": "욕실",
   "name": "젠다이 상판",
   "spec": "인조대리석/타일마감 / 세면대 상부 선반",
   "unit": "M",
   "kind": "자재",
   "price": 80000,
   "group": "엑셀 품목"
  },
  {
   "id": "x125",
   "proc": "바닥",
   "name": "강마루",
   "spec": "동화/한솔/KCC 등 / 거실·방 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x126",
   "proc": "바닥",
   "name": "원목마루",
   "spec": "두께/수종별 / 고급 바닥재",
   "unit": "㎡",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x127",
   "proc": "바닥",
   "name": "SPC마루",
   "spec": "클릭형/접착형 / 방수성 바닥재",
   "unit": "㎡",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x128",
   "proc": "바닥",
   "name": "장판 1.8T (저가형)",
   "spec": "저가형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 7200,
   "group": "엑셀 품목"
  },
  {
   "id": "x129",
   "proc": "바닥",
   "name": "장판 2.2T",
   "spec": "일반형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 14000,
   "group": "엑셀 품목"
  },
  {
   "id": "x130",
   "proc": "바닥",
   "name": "장판 2.7T (중급형)",
   "spec": "중급형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 23000,
   "group": "엑셀 품목"
  },
  {
   "id": "x131",
   "proc": "바닥",
   "name": "장판 3.2T (고급형)",
   "spec": "고급형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 27000,
   "group": "엑셀 품목"
  },
  {
   "id": "x132",
   "proc": "바닥",
   "name": "장판 4.5T/5T",
   "spec": "두꺼운 고급형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x133",
   "proc": "바닥",
   "name": "데코타일",
   "spec": "3T/5T / 상가·현관·보조공간",
   "unit": "㎡",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x134",
   "proc": "바닥",
   "name": "마루본드",
   "spec": "강마루용 / 마루 접착",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x135",
   "proc": "바닥",
   "name": "장판본드",
   "spec": "수성/유성 / 장판 접착",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x136",
   "proc": "바닥",
   "name": "논슬립/재료분리대",
   "spec": "알루미늄/스텐 / 단차·재료 경계 마감",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x137",
   "proc": "바닥",
   "name": "걸레받이 (MDF/PVC)",
   "spec": "MDF/PVC / 벽 하부 마감",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x138",
   "proc": "바닥",
   "name": "실리콘",
   "spec": "수성/바이오/우레탄 / 걸레받이·창틀·욕실 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x139",
   "proc": "바닥",
   "name": "바닥보양판",
   "spec": "PP/종이보양판 / 마루·타일 보호",
   "unit": "장",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x140",
   "proc": "필름",
   "name": "인테리어필름",
   "spec": "LG/현대/삼성 등 / 문·문틀·샷시·가구 리폼",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x141",
   "proc": "필름",
   "name": "프라이머",
   "spec": "필름용 / 접착력 향상",
   "unit": "통",
   "kind": "자재",
   "price": 9900,
   "group": "엑셀 품목"
  },
  {
   "id": "x142",
   "proc": "필름",
   "name": "퍼티",
   "spec": "필름/도장용 / 면 보수·홈 메움",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x143",
   "proc": "필름",
   "name": "사포",
   "spec": "120/220/400방 / 바탕면 연마",
   "unit": "장",
   "kind": "자재",
   "price": 2500,
   "group": "엑셀 품목"
  },
  {
   "id": "x144",
   "proc": "필름",
   "name": "헤라/칼날",
   "spec": "필름 도구 / 필름 시공 소모품",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x145",
   "proc": "기타",
   "name": "수성페인트",
   "spec": "내부용 / 벽·천장 도장",
   "unit": "통",
   "kind": "자재",
   "price": 104000,
   "group": "엑셀 품목"
  },
  {
   "id": "x146",
   "proc": "기타",
   "name": "탄성코트 (베란다용)",
   "spec": "베란다용 / 베란다·세탁실 벽체",
   "unit": "㎡",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x147",
   "proc": "기타",
   "name": "젯소/프라이머",
   "spec": "도장용 / 도장 전 바탕 처리",
   "unit": "통",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x148",
   "proc": "기타",
   "name": "퍼티 (내부용/외부용)",
   "spec": "내부용/외부용 / 크랙·면 보수",
   "unit": "통",
   "kind": "자재",
   "price": 12000,
   "group": "엑셀 품목"
  },
  {
   "id": "x149",
   "proc": "기타",
   "name": "롤러/붓/트레이",
   "spec": "도장 도구 / 페인트 작업 소모품",
   "unit": "세트",
   "kind": "자재",
   "price": 10000,
   "group": "엑셀 품목"
  },
  {
   "id": "x150",
   "proc": "도배",
   "name": "LX 베스띠",
   "spec": "실크벽지 / 일반 실크벽지",
   "unit": "롤",
   "kind": "자재",
   "price": 49000,
   "group": "엑셀 품목"
  },
  {
   "id": "x151",
   "proc": "도배",
   "name": "LX 디아망",
   "spec": "프리미엄 실크벽지 / 고급 실크벽지",
   "unit": "롤",
   "kind": "자재",
   "price": 76000,
   "group": "엑셀 품목"
  },
  {
   "id": "x152",
   "proc": "도배",
   "name": "합지",
   "spec": "광폭/소폭 / 가성비 벽지",
   "unit": "롤",
   "kind": "자재",
   "price": 38000,
   "group": "엑셀 품목"
  },
  {
   "id": "x153",
   "proc": "도배",
   "name": "삼중지",
   "spec": "초배용 / 벽면 보정",
   "unit": "롤",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x154",
   "proc": "도배",
   "name": "초배지",
   "spec": "일반 초배지 / 벽지 전 바탕지",
   "unit": "롤",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x155",
   "proc": "도배",
   "name": "부직포",
   "spec": "도배용 / 벽면 상태 보정",
   "unit": "롤",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x156",
   "proc": "도배",
   "name": "운용지",
   "spec": "도배 보강지 / 이음부·바탕 보강",
   "unit": "롤",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x157",
   "proc": "도배",
   "name": "네바리/조인트테이프",
   "spec": "균열보강 / 석고 이음부·크랙 보강",
   "unit": "롤",
   "kind": "경비",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x158",
   "proc": "도배",
   "name": "도배풀",
   "spec": "가루풀/액상풀 / 벽지 접착",
   "unit": "포",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x159",
   "proc": "도배",
   "name": "마법사",
   "spec": "도배 보수재 / 벽면 보수·접착 보조",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x160",
   "proc": "도배",
   "name": "도배용 수성실리콘",
   "spec": "백색/투명 / 벽지 마감 틈새",
   "unit": "EA",
   "kind": "자재",
   "price": 3600,
   "group": "엑셀 품목"
  },
  {
   "id": "x161",
   "proc": "창호",
   "name": "PVC 샷시",
   "spec": "KCC/LX/예림 등 / 거실·방 창호",
   "unit": "틀",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x162",
   "proc": "창호",
   "name": "시스템창호",
   "spec": "브랜드별 / 고단열 창호",
   "unit": "틀",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x163",
   "proc": "창호",
   "name": "방충망",
   "spec": "일반/미세촘촘망 / 창호 방충망",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x164",
   "proc": "창호",
   "name": "유리",
   "spec": "복층/로이/강화 / 창호 유리 교체",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x165",
   "proc": "창호",
   "name": "창호 실리콘",
   "spec": "외부/내부/바이오 / 창호 주변 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x166",
   "proc": "도어",
   "name": "ABS도어",
   "spec": "문짝/문틀 / 방문·욕실문",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x167",
   "proc": "도어",
   "name": "목문",
   "spec": "도장/필름 마감 / 방문",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x168",
   "proc": "도어",
   "name": "슬라이딩도어",
   "spec": "레일형/포켓형 / 드레스룸·주방·공간분리",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x169",
   "proc": "도어",
   "name": "방문손잡이",
   "spec": "일반/잠금형 / 문 손잡이",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x170",
   "proc": "도어",
   "name": "경첩",
   "spec": "일반/댐퍼 / 문짝 고정",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x171",
   "proc": "도어",
   "name": "도어스토퍼",
   "spec": "자석/말굽 / 문 고정",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x172",
   "proc": "가구",
   "name": "싱크대 하부장",
   "spec": "LPM/PET/도장 / 주방 하부 수납",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x173",
   "proc": "가구",
   "name": "싱크대 상부장",
   "spec": "LPM/PET/도장 / 주방 상부 수납",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x174",
   "proc": "가구",
   "name": "키큰장/냉장고장",
   "spec": "맞춤가구 / 주방 수납",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x175",
   "proc": "가구",
   "name": "싱크 상판",
   "spec": "인조대리석/칸스톤/세라믹 / 주방 상판",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x176",
   "proc": "가구",
   "name": "싱크볼",
   "spec": "일반/사각/백조 등 / 주방 싱크볼",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x177",
   "proc": "가구",
   "name": "주방수전",
   "spec": "일반/거위목/정수기겸용 / 주방 수전",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x178",
   "proc": "가구",
   "name": "신발장 (일반/띄움/간접조명)",
   "spec": "일반/띄움/간접조명 / 현관 수납",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x179",
   "proc": "가구",
   "name": "붙박이장",
   "spec": "슬라이딩/여닫이 / 방 수납",
   "unit": "M",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x180",
   "proc": "가구",
   "name": "팬트리장 (맞춤수납)",
   "spec": "맞춤수납 / 주방·다용도실 수납",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x181",
   "proc": "가구",
   "name": "욕실장",
   "spec": "거울장/하부장 / 욕실 수납",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x182",
   "proc": "가구",
   "name": "가스쿡탑",
   "spec": "2구/3구 / 주방 조리기기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x183",
   "proc": "가구",
   "name": "전기쿡탑/인덕션",
   "spec": "2구/3구 / 주방 조리기기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x184",
   "proc": "가구",
   "name": "후드 (침니/슬림/빌트인)",
   "spec": "침니/슬림/빌트인 / 주방 배기",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x185",
   "proc": "가구",
   "name": "음식물처리기 배선/배관",
   "spec": "제품별 / 싱크대 하부 설치 대비",
   "unit": "식",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x186",
   "proc": "가구",
   "name": "빨래건조대 (천장형/전동)",
   "spec": "천장형/전동 / 베란다·세탁실",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x187",
   "proc": "가구",
   "name": "커튼박스/블라인드",
   "spec": "공간별 / 창 주변 마감/차광",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x188",
   "proc": "목공",
   "name": "각재 (30x30)",
   "spec": "30x30 / 8자 / 20개 / 천장틀·가벽틀·박스틀",
   "unit": "단",
   "kind": "자재",
   "price": 62000,
   "group": "엑셀 품목"
  },
  {
   "id": "x189",
   "proc": "목공",
   "name": "MDF (9T)",
   "spec": "9T / 문선·몰딩·가구 보조",
   "unit": "반장",
   "kind": "자재",
   "price": 18000,
   "group": "엑셀 품목"
  },
  {
   "id": "x190",
   "proc": "목공",
   "name": "일반합판 (9T)",
   "spec": "9T / 4자*8자 / 벽·천장·가구 보강",
   "unit": "장",
   "kind": "자재",
   "price": 32000,
   "group": "엑셀 품목"
  },
  {
   "id": "x191",
   "proc": "목공",
   "name": "석고보드 (9.5T)",
   "spec": "9.5T / 벽체·천장 마감",
   "unit": "장",
   "kind": "자재",
   "price": 6000,
   "group": "엑셀 품목"
  },
  {
   "id": "x192",
   "proc": "목공",
   "name": "아이소핑크/단열재 (30T)",
   "spec": "30T / 내부 단열·결로 보완",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x193",
   "proc": "목공",
   "name": "아이소핑크/단열재 (50T)",
   "spec": "50T / 내부 단열·결로 보완",
   "unit": "장",
   "kind": "자재",
   "price": 22000,
   "group": "엑셀 품목"
  },
  {
   "id": "x194",
   "proc": "목공",
   "name": "아이소핑크/단열재 (100T)",
   "spec": "100T / 내부 단열·결로 보완",
   "unit": "장",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x195",
   "proc": "목공",
   "name": "장갑",
   "spec": "노란목장갑 / 10개",
   "unit": "봉",
   "kind": "자재",
   "price": 4800,
   "group": "엑셀 품목"
  },
  {
   "id": "x196",
   "proc": "목공",
   "name": "실리콘(유성=무초산)",
   "spec": "실리콘",
   "unit": "EA",
   "kind": "자재",
   "price": 2600,
   "group": "엑셀 품목"
  },
  {
   "id": "x197",
   "proc": "목공",
   "name": "ST45 타카핀",
   "spec": "핀 / 얇은 판재 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 5100,
   "group": "엑셀 품목"
  },
  {
   "id": "x198",
   "proc": "목공",
   "name": "T50 타카핀",
   "spec": "핀 / 얇은 판재 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 6000,
   "group": "엑셀 품목"
  },
  {
   "id": "x199",
   "proc": "목공",
   "name": "630 타카핀",
   "spec": "핀 / 얇은 판재 고정",
   "unit": "갑",
   "kind": "자재",
   "price": 8500,
   "group": "엑셀 품목"
  },
  {
   "id": "x200",
   "proc": "목공",
   "name": "천장몰딩 (평몰딩 30mm)",
   "spec": "평몰딩 30mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 2900,
   "group": "엑셀 품목"
  },
  {
   "id": "x201",
   "proc": "목공",
   "name": "바닥몰딩",
   "spec": "평몰딩 40mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 3100,
   "group": "엑셀 품목"
  },
  {
   "id": "x202",
   "proc": "설비",
   "name": "아덱스wpm003",
   "spec": "16kg / 탄성도막방수제",
   "unit": "말",
   "kind": "자재",
   "price": 118000,
   "group": "엑셀 품목"
  },
  {
   "id": "x203",
   "proc": "설비",
   "name": "일반붓",
   "spec": "4인치",
   "unit": "EA",
   "kind": "자재",
   "price": 1400,
   "group": "엑셀 품목"
  },
  {
   "id": "x204",
   "proc": "설비",
   "name": "프라이머Q",
   "spec": "18L",
   "unit": "말",
   "kind": "자재",
   "price": 76000,
   "group": "엑셀 품목"
  },
  {
   "id": "x205",
   "proc": "설비",
   "name": "자동수평몰탈",
   "spec": "25kg",
   "unit": "포",
   "kind": "자재",
   "price": 16000,
   "group": "엑셀 품목"
  },
  {
   "id": "x206",
   "proc": "설비",
   "name": "레미탈",
   "spec": "",
   "unit": "EA",
   "kind": "자재",
   "price": 6000,
   "group": "엑셀 품목"
  },
  {
   "id": "x207",
   "proc": "기타",
   "name": "폼세라믹(보드)",
   "spec": "600*1220*50T",
   "unit": "EA",
   "kind": "자재",
   "price": 24000,
   "group": "엑셀 품목"
  },
  {
   "id": "x208",
   "proc": "목공",
   "name": "몰딩",
   "spec": "평몰딩 30mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 2900,
   "group": "엑셀 품목"
  },
  {
   "id": "x209",
   "proc": "목공",
   "name": "몰딩 (평몰딩 40mm)",
   "spec": "평몰딩 40mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 3100,
   "group": "엑셀 품목"
  },
  {
   "id": "x210",
   "proc": "목공",
   "name": "몰딩 (평몰딩 50mm)",
   "spec": "평몰딩 50mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 3500,
   "group": "엑셀 품목"
  },
  {
   "id": "x211",
   "proc": "목공",
   "name": "몰딩 (평몰딩 60mm)",
   "spec": "평몰딩 60mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 3600,
   "group": "엑셀 품목"
  },
  {
   "id": "x212",
   "proc": "목공",
   "name": "몰딩 (평몰딩 80mm)",
   "spec": "평몰딩 80mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 4300,
   "group": "엑셀 품목"
  },
  {
   "id": "x213",
   "proc": "목공",
   "name": "몰딩 (평몰딩 100mm)",
   "spec": "평몰딩 100mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 5300,
   "group": "엑셀 품목"
  },
  {
   "id": "x214",
   "proc": "목공",
   "name": "몰딩 (평몰딩 120mm)",
   "spec": "평몰딩 120mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 6200,
   "group": "엑셀 품목"
  },
  {
   "id": "x215",
   "proc": "목공",
   "name": "몰딩 (평몰딩 160mm)",
   "spec": "평몰딩 160mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 8200,
   "group": "엑셀 품목"
  },
  {
   "id": "x216",
   "proc": "목공",
   "name": "몰딩 (평몰딩 200mm)",
   "spec": "평몰딩 200mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 8800,
   "group": "엑셀 품목"
  },
  {
   "id": "x217",
   "proc": "목공",
   "name": "몰딩 (평몰딩 250mm)",
   "spec": "평몰딩 250mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 12000,
   "group": "엑셀 품목"
  },
  {
   "id": "x218",
   "proc": "목공",
   "name": "몰딩 (평몰딩 300mm)",
   "spec": "평몰딩 300mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 13000,
   "group": "엑셀 품목"
  },
  {
   "id": "x219",
   "proc": "목공",
   "name": "몰딩 (평몰딩 400mm)",
   "spec": "평몰딩 400mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 18000,
   "group": "엑셀 품목"
  },
  {
   "id": "x220",
   "proc": "목공",
   "name": "몰딩 (평몰딩 600mm)",
   "spec": "평몰딩 600mm / 천장과 벽 이음 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 27000,
   "group": "엑셀 품목"
  },
  {
   "id": "x221",
   "proc": "타일",
   "name": "600각 타일 (600x600 포세린)",
   "spec": "600x600 포세린 / 거실·욕실·현관 바닥/벽",
   "unit": "박스",
   "kind": "자재",
   "price": 21000,
   "group": "엑셀 품목"
  },
  {
   "id": "x222",
   "proc": "타일",
   "name": "현관 타일 600각타일",
   "spec": "논슬립/포세린 / 현관 바닥",
   "unit": "박스",
   "kind": "자재",
   "price": 21000,
   "group": "엑셀 품목"
  },
  {
   "id": "x223",
   "proc": "타일",
   "name": "압착시멘트 (일반/고급 20kg)",
   "spec": "일반/고급 20kg / 타일 접착",
   "unit": "포",
   "kind": "자재",
   "price": 6800,
   "group": "엑셀 품목"
  },
  {
   "id": "x224",
   "proc": "타일",
   "name": "몰탈 (레미탈 40kg)",
   "spec": "레미탈 40kg / 바닥 구배·바탕 조성",
   "unit": "포",
   "kind": "자재",
   "price": 9100,
   "group": "엑셀 품목"
  },
  {
   "id": "x225",
   "proc": "타일",
   "name": "코너비드 (PVC 12T L형)",
   "spec": "PVC 12T L형 / 타일 모서리 마감",
   "unit": "EA",
   "kind": "자재",
   "price": 2300,
   "group": "엑셀 품목"
  },
  {
   "id": "x226",
   "proc": "타일",
   "name": "타일 에폭시",
   "spec": "",
   "unit": "조",
   "kind": "자재",
   "price": 57000,
   "group": "엑셀 품목"
  },
  {
   "id": "x227",
   "proc": "욕실",
   "name": "인토 양변기",
   "spec": "투피스 치마형 / 욕실 변기",
   "unit": "EA",
   "kind": "자재",
   "price": 148000,
   "group": "엑셀 품목"
  },
  {
   "id": "x228",
   "proc": "욕실",
   "name": "이녹스 양변기",
   "spec": "투피스 치마형 / 욕실 변기",
   "unit": "EA",
   "kind": "자재",
   "price": 148000,
   "group": "엑셀 품목"
  },
  {
   "id": "x229",
   "proc": "욕실",
   "name": "인토 세면대",
   "spec": "사각 반다리 / 욕실 세면 도기",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "엑셀 품목"
  },
  {
   "id": "x230",
   "proc": "욕실",
   "name": "이녹스 세면대",
   "spec": "사각 반다리 / 욕실 세면 도기",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "엑셀 품목"
  },
  {
   "id": "x231",
   "proc": "욕실",
   "name": "이누스 세면대",
   "spec": "언더볼 / 욕실 세면 도기",
   "unit": "EA",
   "kind": "자재",
   "price": 114000,
   "group": "엑셀 품목"
  },
  {
   "id": "x232",
   "proc": "욕실",
   "name": "에떼르노 세면수전",
   "spec": "원홀 E7-1001 / 세면대 수전",
   "unit": "EA",
   "kind": "자재",
   "price": 80000,
   "group": "엑셀 품목"
  },
  {
   "id": "x233",
   "proc": "욕실",
   "name": "에떼르노 샤워수전",
   "spec": "일반 E7-1005 / 욕실 샤워 수전",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "엑셀 품목"
  },
  {
   "id": "x234",
   "proc": "욕실",
   "name": "베르사츠 슬라이드바",
   "spec": "무광 / 슬라이드바",
   "unit": "EA",
   "kind": "자재",
   "price": 31000,
   "group": "엑셀 품목"
  },
  {
   "id": "x235",
   "proc": "욕실",
   "name": "욕실 거울 (LED 600*800)",
   "spec": "LED 600*800 / 세면대 상부",
   "unit": "EA",
   "kind": "자재",
   "price": 137000,
   "group": "엑셀 품목"
  },
  {
   "id": "x236",
   "proc": "욕실",
   "name": "욕실 거울 (일반 600*800)",
   "spec": "일반 600*800 / 세면대 상부",
   "unit": "EA",
   "kind": "자재",
   "price": 0,
   "group": "엑셀 품목"
  },
  {
   "id": "x237",
   "proc": "욕실",
   "name": "욕실 슬라이드장",
   "spec": "상부장 1200*800 / 욕실 수납",
   "unit": "EA",
   "kind": "자재",
   "price": 108000,
   "group": "엑셀 품목"
  },
  {
   "id": "x238",
   "proc": "욕실",
   "name": "원목 양개형",
   "spec": "상부장 600*800 / 욕실 수납",
   "unit": "EA",
   "kind": "자재",
   "price": 148000,
   "group": "엑셀 품목"
  },
  {
   "id": "x239",
   "proc": "욕실",
   "name": "베르사츠 수건걸이",
   "spec": "무광 / 욕실 액세서리",
   "unit": "EA",
   "kind": "자재",
   "price": 31000,
   "group": "엑셀 품목"
  },
  {
   "id": "x240",
   "proc": "욕실",
   "name": "베르사츠 휴지걸이",
   "spec": "무광 / 욕실 액세서리",
   "unit": "EA",
   "kind": "자재",
   "price": 34000,
   "group": "엑셀 품목"
  },
  {
   "id": "x241",
   "proc": "욕실",
   "name": "라인유가(50파이)",
   "spec": "150*150",
   "unit": "EA",
   "kind": "자재",
   "price": 30000,
   "group": "엑셀 품목"
  },
  {
   "id": "x242",
   "proc": "욕실",
   "name": "환풍기 (힘펠 100LF MD-N)",
   "spec": "힘펠 100LF MD-N / 욕실 환기",
   "unit": "EA",
   "kind": "자재",
   "price": 65000,
   "group": "엑셀 품목"
  },
  {
   "id": "x243",
   "proc": "욕실",
   "name": "환풍기 (휴젠트2 2.5)",
   "spec": "휴젠트2 2.5 / 욕실 환기",
   "unit": "EA",
   "kind": "자재",
   "price": 410000,
   "group": "엑셀 품목"
  },
  {
   "id": "x244",
   "proc": "욕실",
   "name": "샤워파티션 (일반버전)",
   "spec": "파티션 / 욕실 공간 분리",
   "unit": "EA",
   "kind": "자재",
   "price": 228000,
   "group": "엑셀 품목"
  },
  {
   "id": "x245",
   "proc": "욕실",
   "name": "샤워파티션 (젠다이버전)",
   "spec": "파티션 / 욕실 공간 분리",
   "unit": "EA",
   "kind": "자재",
   "price": 262000,
   "group": "엑셀 품목"
  },
  {
   "id": "x246",
   "proc": "바닥",
   "name": "강마루 (동화나투스진 7T)",
   "spec": "동화나투스진 7T / 거실·방 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 35000,
   "group": "엑셀 품목"
  },
  {
   "id": "x247",
   "proc": "바닥",
   "name": "강마루 바닥보양",
   "spec": "종이보양 / 거실·방 바닥",
   "unit": "㎡",
   "kind": "경비",
   "price": 1200,
   "group": "엑셀 품목"
  },
  {
   "id": "x248",
   "proc": "바닥",
   "name": "장판 2.0T",
   "spec": "일반형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 11000,
   "group": "엑셀 품목"
  },
  {
   "id": "x249",
   "proc": "바닥",
   "name": "장판 4.5T/시공평당13,000원",
   "spec": "두꺼운 고급형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "노무",
   "price": 32000,
   "group": "엑셀 품목"
  },
  {
   "id": "x250",
   "proc": "바닥",
   "name": "장판 5T/시공 평당 15,000원",
   "spec": "두꺼운 고급형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "노무",
   "price": 36000,
   "group": "엑셀 품목"
  },
  {
   "id": "x251",
   "proc": "바닥",
   "name": "포레스트 장판 5T",
   "spec": "두꺼운 고급형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 37000,
   "group": "엑셀 품목"
  },
  {
   "id": "x252",
   "proc": "바닥",
   "name": "에디톤 스톤 5T",
   "spec": "고급형 / 방·거실 바닥",
   "unit": "㎡",
   "kind": "자재",
   "price": 52000,
   "group": "엑셀 품목"
  },
  {
   "id": "x253",
   "proc": "바닥",
   "name": "데코타일(보타닉) / 시공 1.1",
   "spec": "3T / 상가·현관·보조공간",
   "unit": "㎡",
   "kind": "노무",
   "price": 10000,
   "group": "엑셀 품목"
  },
  {
   "id": "x254",
   "proc": "바닥",
   "name": "데코타일(디럭스) / 시공 1.1",
   "spec": "3T / 상가·현관·보조공간",
   "unit": "㎡",
   "kind": "노무",
   "price": 10000,
   "group": "엑셀 품목"
  },
  {
   "id": "x255",
   "proc": "바닥",
   "name": "데코타일(온돌용) / 시공 1.1",
   "spec": "3T / 상가·현관·보조공간",
   "unit": "㎡",
   "kind": "노무",
   "price": 16000,
   "group": "엑셀 품목"
  },
  {
   "id": "x256",
   "proc": "필름",
   "name": "인테리어필름 (예림)",
   "spec": "예림 / 문·문틀·샷시·가구 리폼",
   "unit": "M",
   "kind": "자재",
   "price": 12000,
   "group": "엑셀 품목"
  },
  {
   "id": "x257",
   "proc": "필름",
   "name": "인테리어필름 (예림(비칼라))",
   "spec": "예림(비칼라) / 문·문틀·샷시·가구 리폼",
   "unit": "M",
   "kind": "자재",
   "price": 12000,
   "group": "엑셀 품목"
  },
  {
   "id": "x258",
   "proc": "필름",
   "name": "인테리어필름 (예림(매트))",
   "spec": "예림(매트) / 문·문틀·샷시·가구 리폼",
   "unit": "M",
   "kind": "자재",
   "price": 17000,
   "group": "엑셀 품목"
  },
  {
   "id": "x259",
   "proc": "필름",
   "name": "인테리어필름 (예림(방염))",
   "spec": "예림(방염) / 문·문틀·샷시·가구 리폼",
   "unit": "M",
   "kind": "자재",
   "price": 20000,
   "group": "엑셀 품목"
  },
  {
   "id": "x260",
   "proc": "필름",
   "name": "퍼티 5kg",
   "spec": "필름/도장용 / 면 보수·홈 메움",
   "unit": "통",
   "kind": "자재",
   "price": 4900,
   "group": "엑셀 품목"
  },
  {
   "id": "x261",
   "proc": "기타",
   "name": "일반페인트 수성",
   "spec": "베란다용 / 베란다·세탁실 벽체",
   "unit": "보",
   "kind": "자재",
   "price": 593000,
   "group": "엑셀 품목"
  },
  {
   "id": "x262",
   "proc": "기타",
   "name": "글로리광택스 수성",
   "spec": "베란다용 / 베란다·세탁실 벽체",
   "unit": "보",
   "kind": "자재",
   "price": 668000,
   "group": "엑셀 품목"
  },
  {
   "id": "x263",
   "proc": "기타",
   "name": "탄성코트(2개이상)",
   "spec": "베란다용 / 베란다·세탁실 벽체",
   "unit": "보",
   "kind": "자재",
   "price": 297000,
   "group": "엑셀 품목"
  },
  {
   "id": "x264",
   "proc": "기타",
   "name": "세라믹 탄성",
   "spec": "베란다용 / 베란다·세탁실 벽체",
   "unit": "보",
   "kind": "자재",
   "price": 371000,
   "group": "엑셀 품목"
  },
  {
   "id": "x265",
   "proc": "기타",
   "name": "젯소/프라이머 1L",
   "spec": "도장용 / 도장 전 바탕 처리",
   "unit": "통",
   "kind": "자재",
   "price": 41000,
   "group": "엑셀 품목"
  },
  {
   "id": "x266",
   "proc": "도배",
   "name": "실크도배 천정지",
   "spec": "실크벽지 / 일반 실크벽지",
   "unit": "롤(10평)",
   "kind": "자재",
   "price": 55000,
   "group": "엑셀 품목"
  },
  {
   "id": "x267",
   "proc": "도배",
   "name": "삼중지 150mm*100M",
   "spec": "초배용 / 벽면 보정",
   "unit": "롤",
   "kind": "자재",
   "price": 19000,
   "group": "엑셀 품목"
  },
  {
   "id": "x268",
   "proc": "도배",
   "name": "초배지 (일반초배지320mm*320M)",
   "spec": "일반초배지320mm*320M / 벽지 전 바탕지",
   "unit": "롤",
   "kind": "자재",
   "price": 35000,
   "group": "엑셀 품목"
  },
  {
   "id": "x269",
   "proc": "도배",
   "name": "부직포 1200폭*84M",
   "spec": "도배용 / 벽면 상태 보정",
   "unit": "롤",
   "kind": "자재",
   "price": 48000,
   "group": "엑셀 품목"
  },
  {
   "id": "x270",
   "proc": "도배",
   "name": "네바리/조인트테이프 (균열)",
   "spec": "균열 / 폭100mm*150M / 석고 이음부·크랙 보강",
   "unit": "롤",
   "kind": "경비",
   "price": 5400,
   "group": "엑셀 품목"
  },
  {
   "id": "x271",
   "proc": "도배",
   "name": "도배풀 14kg",
   "spec": "가루풀/액상풀 / 벽지 접착",
   "unit": "봉",
   "kind": "자재",
   "price": 13000,
   "group": "엑셀 품목"
  },
  {
   "id": "x272",
   "proc": "도배",
   "name": "마법사 50mm*30M",
   "spec": "도배 보수재 / 벽면 보수·접착 보조",
   "unit": "롤",
   "kind": "자재",
   "price": 19000,
   "group": "엑셀 품목"
  },
  {
   "id": "x273",
   "proc": "도어",
   "name": "ABS도어 (기본사이즈기준)",
   "spec": "문짝/문틀 / 방문·욕실문",
   "unit": "EA",
   "kind": "자재",
   "price": 207000,
   "group": "엑셀 품목"
  },
  {
   "id": "x274",
   "proc": "도어",
   "name": "목문 (기본사이즈기준)",
   "spec": "도장/필름 마감 / 방문",
   "unit": "EA",
   "kind": "자재",
   "price": 261000,
   "group": "엑셀 품목"
  },
  {
   "id": "p0848",
   "proc": "욕실",
   "name": "도기세팅 인건비 (일반 타일 욕실)",
   "spec": "욕실 1칸 풀세팅 / 일반 타일 욕실",
   "unit": "칸",
   "kind": "노무",
   "price": 300000
  },
  {
   "id": "p0849",
   "proc": "도어",
   "name": "방문·욕실문 교체 세트 (ABS 기본 민자도어)",
   "spec": "문짝·문틀·경첩·손잡이·설치 포함 / 1~2틀은 틀당 50만 원, 3틀 이상은 틀당 40만 원 / 실측비 별도",
   "unit": "틀",
   "kind": "자재",
   "price": 400000,
   "group": "도어 (예림)",
   "tier": [
    [
     0,
     2,
     500000
    ],
    [
     3,
     999,
     400000
    ]
   ]
  },
  {
   "id": "p0850",
   "proc": "기타",
   "name": "마감 실리콘 작업 (40평대 이상)",
   "spec": "집 전체 실리콘 마감 / 40평 이상",
   "unit": "식",
   "kind": "노무",
   "price": 400000
  },
  {
   "id": "p0851",
   "proc": "목공",
   "name": "발코니 확장 공사 (1칸)",
   "spec": "단열·엑셀 난방배관 연장·미장 포함 / 확장부 목공 단열과 샷시는 별도",
   "unit": "칸",
   "kind": "노무",
   "price": 1000000
  },
  {
   "id": "p0852",
   "proc": "가구",
   "name": "신발장 중간 선반장 추가",
   "spec": "신발장 중간 선반장",
   "unit": "식",
   "kind": "자재",
   "price": 150000
  },
  {
   "id": "p0853",
   "proc": "도어",
   "name": "방문 교체 세트 (예림 슬림도어)",
   "spec": "예림 슬림도어 세트",
   "unit": "틀",
   "kind": "자재",
   "price": 485000,
   "group": "도어 (예림)"
  },
  {
   "id": "p0854",
   "proc": "도배",
   "name": "실크 벽지 베스트 (1롤·5평)",
   "spec": "일반 실크 / 1롤 약 5평",
   "unit": "롤",
   "kind": "자재",
   "price": 49000
  },
  {
   "id": "p0855",
   "proc": "도배",
   "name": "실크 벽지 테라피 (1롤·5평)",
   "spec": "일반 실크 / 1롤 약 5평",
   "unit": "롤",
   "kind": "자재",
   "price": 43000
  },
  {
   "id": "p0856",
   "proc": "도배",
   "name": "실크 벽지 디아망 (1롤·5평)",
   "spec": "고가 실크 / 1롤 약 5평",
   "unit": "롤",
   "kind": "자재",
   "price": 76000
  },
  {
   "id": "p0857",
   "proc": "도배",
   "name": "실크 벽지 포티스 (1롤·5평)",
   "spec": "고가 실크 / 1롤 약 5평",
   "unit": "롤",
   "kind": "자재",
   "price": 90000
  },
  {
   "id": "p0858",
   "proc": "도배",
   "name": "도배 부자재 (평당)",
   "spec": "도배 평수(평형×2.5) 기준 / 초배지·풀·테이프 등",
   "unit": "평",
   "kind": "자재",
   "price": 5400
  },
  {
   "id": "p0859",
   "proc": "목공",
   "name": "확장부 단열 목작업 (1칸)",
   "spec": "발코니 확장부 벽·천장 단열 목작업 / 1칸 90만 원",
   "unit": "칸",
   "kind": "노무",
   "price": 900000
  },
  {
   "id": "p0860",
   "proc": "도배",
   "name": "합지 벽지 소폭",
   "spec": "합지",
   "unit": "롤",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "p0861",
   "proc": "도배",
   "name": "합지 벽지 광폭",
   "spec": "합지",
   "unit": "롤",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "p0862",
   "proc": "전기",
   "name": "[메가맨] LED 사각방등 50W",
   "spec": "메가맨 LED PREMIUM / 4000K",
   "unit": "EA",
   "kind": "자재",
   "price": 25900,
   "group": "조명 · 메가맨"
  },
  {
   "id": "p0863",
   "proc": "전기",
   "name": "[메가맨] LED 거실4등 100W",
   "spec": "메가맨 LED PREMIUM / 4000K",
   "unit": "EA",
   "kind": "자재",
   "price": 73300,
   "group": "조명 · 메가맨"
  },
  {
   "id": "p0864",
   "proc": "전기",
   "name": "[메가맨] LED 거실6등",
   "spec": "메가맨 LED PREMIUM",
   "unit": "EA",
   "kind": "자재",
   "price": 138700,
   "group": "조명 · 메가맨"
  },
  {
   "id": "p0865",
   "proc": "전기",
   "name": "[메가맨] LED 주방1등 25W",
   "spec": "메가맨 LED PREMIUM / 4000K",
   "unit": "EA",
   "kind": "자재",
   "price": 25200,
   "group": "조명 · 메가맨"
  },
  {
   "id": "p0866",
   "proc": "전기",
   "name": "[메가맨] LED 주방2등 50W",
   "spec": "메가맨 LED PREMIUM / 4000K",
   "unit": "EA",
   "kind": "자재",
   "price": 36700,
   "group": "조명 · 메가맨"
  },
  {
   "id": "p0867",
   "proc": "전기",
   "name": "[메가맨] LED 리모컨방등 55W",
   "spec": "메가맨 LED PREMIUM / 색변환",
   "unit": "EA",
   "kind": "자재",
   "price": 49100,
   "group": "조명 · 메가맨"
  },
  {
   "id": "p0868",
   "proc": "도배",
   "name": "실크 도배 (평당)",
   "spec": "실크 벽지 · 부자재 · 시공 포함",
   "unit": "평",
   "kind": "자재",
   "price": 14000
  },
  {
   "id": "p0869",
   "proc": "도배",
   "name": "고급 실크 도배 (평당)",
   "spec": "디아망·포티스 등 고급 실크 · 부자재 · 시공 포함",
   "unit": "평",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "p0870",
   "proc": "도배",
   "name": "합지 도배 (평당)",
   "spec": "합지 벽지 · 부자재 · 시공 포함",
   "unit": "평",
   "kind": "자재",
   "price": 0
  },
  {
   "id": "p0871",
   "proc": "바닥",
   "name": "장판 시공비 (평당)",
   "spec": "장판 시공",
   "unit": "평",
   "kind": "노무",
   "price": 14000
  },
  {
   "id": "p0872",
   "proc": "바닥",
   "name": "장판 4.5T 시공비 (평당)",
   "spec": "두꺼운 장판 시공",
   "unit": "평",
   "kind": "노무",
   "price": 17000
  },
  {
   "id": "p0873",
   "proc": "바닥",
   "name": "장판 5T 시공비 (평당)",
   "spec": "두꺼운 장판 시공",
   "unit": "평",
   "kind": "노무",
   "price": 20000
  },
  {
   "id": "p0874",
   "proc": "욕실",
   "name": "인토 투피스 양변기 C-951",
   "spec": "인토 C-951 투피스 양변기",
   "unit": "EA",
   "kind": "자재",
   "price": 172000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "p0875",
   "proc": "욕실",
   "name": "에떼르노 샤워수전 E7-1005NB + 슬라이드바",
   "spec": "무광니켈 샤워수전 / 무광니켈 슬라이드바 포함",
   "unit": "EA",
   "kind": "자재",
   "price": 159000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "p0876",
   "proc": "욕실",
   "name": "욕실 악세서리 세트 (무광니켈)",
   "spec": "휴지걸이 · 라인유가 · 방우콘센트",
   "unit": "EA",
   "kind": "자재",
   "price": 98000,
   "group": "도기·수전 (림바스)"
  },
  {
   "id": "p0877",
   "proc": "목공",
   "name": "라운드 중천장 목작업",
   "spec": "라운드 중천장 (선택용 · 인원은 목수 작업비에 합산)",
   "unit": "식",
   "kind": "노무",
   "price": 0
  },
  {
   "id": "p0878",
   "proc": "목공",
   "name": "오징어 합판 (밴딩)",
   "spec": "라운드 작업용 밴딩 합판",
   "unit": "장",
   "kind": "자재",
   "price": 72000
  },
  {
   "id": "p0879",
   "proc": "목공",
   "name": "목자재 1식 (석고보드·각재·MDF)",
   "spec": "석고보드 1장 + 각재 1단 + MDF 9T 1장",
   "unit": "식",
   "kind": "자재",
   "price": 86000
  },
  {
   "id": "p0880",
   "proc": "목공",
   "name": "목자재 1식 · 라운드 (오징어 합판 추가)",
   "spec": "석고보드 1장 + 각재 1단 + MDF 9T 1장 + 오징어 합판 1장",
   "unit": "식",
   "kind": "자재",
   "price": 158000
  },
  {
   "id": "p0881",
   "proc": "목공",
   "name": "단열 목자재 1식 (석고보드·각재·단열재)",
   "spec": "석고보드 1장 + 각재 1단 + 단열재 50T 1장",
   "unit": "식",
   "kind": "자재",
   "price": 90000
  },
  {
   "id": "p0882",
   "proc": "목공",
   "name": "목공 부자재 1식",
   "spec": "우레탄폼 · 목공본드 · 타카핀 4종 · 실리콘 · 장갑 각 1개",
   "unit": "식",
   "kind": "자재",
   "price": 41300
  },
  {
   "id": "p0883",
   "proc": "도배",
   "name": "실크 벽지 베스트 (평당)",
   "spec": "일반 실크 / 도배 평수 1평당 벽지",
   "unit": "평",
   "kind": "자재",
   "price": 14000
  },
  {
   "id": "p0884",
   "proc": "도배",
   "name": "실크 벽지 테라피 (평당)",
   "spec": "일반 실크 / 도배 평수 1평당 벽지",
   "unit": "평",
   "kind": "자재",
   "price": 12300
  },
  {
   "id": "p0885",
   "proc": "도배",
   "name": "실크 벽지 디아망 (평당)",
   "spec": "고가 실크 / 도배 평수 1평당 벽지",
   "unit": "평",
   "kind": "자재",
   "price": 21700
  },
  {
   "id": "p0886",
   "proc": "도배",
   "name": "실크 벽지 포티스 (평당)",
   "spec": "고가 실크 / 도배 평수 1평당 벽지",
   "unit": "평",
   "kind": "자재",
   "price": 25700
  },
  {
   "id": "p0887",
   "proc": "도배",
   "name": "합지 벽지 (평당)",
   "spec": "합지 / 도배 평수 1평당 벽지 · 롤 단가를 실크와 같은 비율로 환산",
   "unit": "평",
   "kind": "자재",
   "price": 10900
  },
  {
   "id": "p0888",
   "proc": "전기",
   "name": "LED 직부등 15W",
   "spec": "다용도실·드레스룸·팬트리 등 / 인터넷 시세 기준 임시 단가",
   "unit": "EA",
   "kind": "자재",
   "price": 9100
  },
  {
   "id": "p0889",
   "proc": "전기",
   "name": "욕실 다운라이트 6인치 15W (방습)",
   "spec": "욕실 천장 매입등 / 인터넷 시세 기준 임시 단가",
   "unit": "EA",
   "kind": "자재",
   "price": 6000
  },
  {
   "id": "p0890",
   "proc": "철거",
   "name": "상부 몰딩 철거",
   "spec": "천장 몰딩 떼어 내기",
   "unit": "식",
   "kind": "노무",
   "price": 104000
  },
  {
   "id": "p0891",
   "proc": "철거",
   "name": "걸레받이 철거",
   "spec": "걸레받이 떼어 내기",
   "unit": "식",
   "kind": "노무",
   "price": 104000
  },
  {
   "id": "p0892",
   "proc": "바닥",
   "name": "장판 2.2T (평당)",
   "spec": "일반형",
   "unit": "평",
   "kind": "자재",
   "price": 48000
  },
  {
   "id": "p0893",
   "proc": "바닥",
   "name": "장판 1.8T (평당)",
   "spec": "저가형",
   "unit": "평",
   "kind": "자재",
   "price": 24000
  },
  {
   "id": "p0894",
   "proc": "바닥",
   "name": "장판 2.7T (평당)",
   "spec": "중급형",
   "unit": "평",
   "kind": "자재",
   "price": 77000
  },
  {
   "id": "p0895",
   "proc": "바닥",
   "name": "장판 3.2T (평당)",
   "spec": "고급형",
   "unit": "평",
   "kind": "자재",
   "price": 89000
  },
  {
   "id": "p0896",
   "proc": "바닥",
   "name": "장판 4.5T (평당)",
   "spec": "두꺼운 장판",
   "unit": "평",
   "kind": "자재",
   "price": 108000
  },
  {
   "id": "p0897",
   "proc": "바닥",
   "name": "장판 5T (평당)",
   "spec": "두꺼운 장판",
   "unit": "평",
   "kind": "자재",
   "price": 120000
  },
  {
   "id": "p0898",
   "proc": "바닥",
   "name": "강마루 (동화 나투스진 7T · 평당)",
   "spec": "평당 12만 원 (시공 인건비 포함)",
   "unit": "평",
   "kind": "자재",
   "price": 120000
  }
 ],
 "spaceTypes": {
  "현관": {
   "cats": [
    {
     "key": "jungmun",
     "label": "중문",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "초슬림 3연동",
       "lines": [
        {
         "item": "초슬림 3연동 중문",
         "qty": "1"
        }
       ]
      },
      {
       "label": "ㄱ자 3연동",
       "lines": [
        {
         "item": "ㄱ자 3연동 중문",
         "qty": "1"
        }
       ]
      },
      {
       "label": "원슬라이딩",
       "lines": [
        {
         "item": "원슬라이딩 중문",
         "qty": "1"
        }
       ]
      },
      {
       "label": "폴딩도어",
       "lines": [
        {
         "item": "폴딩도어",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "shoe",
     "label": "신발장",
     "opts": [
      {
       "label": "유지",
       "lines": []
      },
      {
       "label": "교체",
       "lines": [
        {
         "item": "신발장",
         "qty": "v"
        }
       ]
      }
     ],
     "def": 0,
     "num": {
      "label": "길이",
      "unit": "자",
      "def": 4
     }
    },
    {
     "key": "efloor",
     "label": "현관 바닥",
     "opts": [
      {
       "label": "유지",
       "lines": []
      },
      {
       "label": "600각 포세린 타일",
       "lines": [
        {
         "item": "600각 포세린 타일",
         "qty": "Math.ceil(A*1.08/1.44)",
         "note": "현관 바닥 / 1BOX 1.44㎡ / 로스 8%"
        }
       ]
      }
     ],
     "def": 1
    },
    {
     "key": "lock",
     "label": "도어락",
     "opts": [
      {
       "label": "유지",
       "lines": []
      },
      {
       "label": "지문 도어락 교체",
       "lines": [
        {
         "item": "도어락 교체 (지문)",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0
    }
   ]
  },
  "거실": {
   "cats": [
    {
     "key": "floor",
     "label": "바닥",
     "opts": [
      {
       "label": "기본 마감",
       "lines": [
        {
         "item": "@floor",
         "qty": "Math.round(A*(G.floorItem.includes('마루')?1.06:1.07)*10)/10",
         "note": "바닥 면적 + 로스"
        }
       ]
      },
      {
       "label": "공사 안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "paper",
     "label": "벽지",
     "opts": [
      {
       "label": "기본 마감",
       "lines": [
        {
         "item": "@paper",
         "qty": "Math.round(W*1.12*10)/10",
         "note": "벽+천장 면적 + 로스 12%"
        }
       ]
      },
      {
       "label": "공사 안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "mold",
     "label": "몰딩",
     "opts": [
      {
       "label": "교체",
       "lines": [
        {
         "item": "평몰딩 30mm",
         "qty": "Math.ceil(P*1.1/2.4)",
         "note": "천장 몰딩 / 2.4m 1EA / 로스 10%"
        },
        {
         "item": "평몰딩 40mm",
         "qty": "Math.ceil(P*1.1/2.4)",
         "note": "바닥 몰딩 / 2.4m 1EA / 로스 10%"
        }
       ]
      },
      {
       "label": "유지",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "ceil",
     "label": "천장",
     "opts": [
      {
       "label": "유지",
       "lines": []
      },
      {
       "label": "평천장 작업",
       "lines": [
        {
         "item": "평천장(중천장) 목작업",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "light",
     "label": "추가 조명",
     "opts": [
      {
       "label": "기본 조명만",
       "lines": []
      },
      {
       "label": "매입등 추가",
       "lines": [
        {
         "item": "3인치 COB 매입등",
         "qty": "v"
        }
       ]
      },
      {
       "label": "라인조명",
       "lines": [
        {
         "item": "라인조명",
         "qty": "v"
        }
       ]
      }
     ],
     "def": 0,
     "num": {
      "label": "수량",
      "unit": "개·m",
      "def": 8
     }
    },
    {
     "key": "fan",
     "label": "실링팬",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "설치",
       "lines": [
        {
         "item": "실링팬",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0
    }
   ]
  },
  "주방": {
   "cats": [
    {
     "key": "floor",
     "label": "바닥",
     "opts": [
      {
       "label": "기본 마감",
       "lines": [
        {
         "item": "@floor",
         "qty": "Math.round(A*(G.floorItem.includes('마루')?1.06:1.07)*10)/10",
         "note": "바닥 면적 + 로스"
        }
       ]
      },
      {
       "label": "공사 안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "paper",
     "label": "벽지",
     "opts": [
      {
       "label": "기본 마감",
       "lines": [
        {
         "item": "@paper",
         "qty": "Math.round(W*1.12*10)/10",
         "note": "벽+천장 면적 + 로스 12%"
        }
       ]
      },
      {
       "label": "공사 안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "sink",
     "label": "싱크대",
     "opts": [
      {
       "label": "유지",
       "lines": []
      },
      {
       "label": "교체",
       "lines": [
        {
         "item": "싱크대",
         "qty": "v"
        }
       ]
      },
      {
       "label": "필름 리폼",
       "lines": [
        {
         "item": "필름 자재",
         "qty": "Math.round(v*1.2)",
         "note": "싱크 도어 필름"
        }
       ]
      }
     ],
     "def": 0,
     "num": {
      "label": "길이",
      "unit": "자",
      "def": 10
     }
    },
    {
     "key": "fridge",
     "label": "냉장고장",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "설치",
       "lines": [
        {
         "item": "냉장고장",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "bowl",
     "label": "싱크볼·수전",
     "opts": [
      {
       "label": "유지",
       "lines": []
      },
      {
       "label": "사각 싱크볼 + 폭포수전",
       "lines": [
        {
         "item": "사각 싱크볼",
         "qty": "1"
        },
        {
         "item": "주방 수전 (폭포수전)",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0
    }
   ]
  },
  "방": {
   "cats": [
    {
     "key": "floor",
     "label": "바닥",
     "opts": [
      {
       "label": "기본 마감",
       "lines": [
        {
         "item": "@floor",
         "qty": "Math.round(A*(G.floorItem.includes('마루')?1.06:1.07)*10)/10",
         "note": "바닥 면적 + 로스"
        }
       ]
      },
      {
       "label": "공사 안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "paper",
     "label": "벽지",
     "opts": [
      {
       "label": "기본 마감",
       "lines": [
        {
         "item": "@paper",
         "qty": "Math.round(W*1.12*10)/10",
         "note": "벽+천장 면적 + 로스 12%"
        }
       ]
      },
      {
       "label": "공사 안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "mold",
     "label": "몰딩",
     "opts": [
      {
       "label": "교체",
       "lines": [
        {
         "item": "평몰딩 30mm",
         "qty": "Math.ceil(P*1.1/2.4)",
         "note": "천장 몰딩 / 2.4m 1EA / 로스 10%"
        },
        {
         "item": "평몰딩 40mm",
         "qty": "Math.ceil(P*1.1/2.4)",
         "note": "바닥 몰딩 / 2.4m 1EA / 로스 10%"
        }
       ]
      },
      {
       "label": "유지",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "door",
     "label": "방문",
     "opts": [
      {
       "label": "교체",
       "lines": [
        {
         "item": "예림 ABS 민자도어세트",
         "qty": "1"
        }
       ]
      },
      {
       "label": "유지",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "closet",
     "label": "붙박이장",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "여닫이",
       "lines": [
        {
         "item": "붙박이장 (여닫이)",
         "qty": "v"
        }
       ]
      },
      {
       "label": "슬라이딩",
       "lines": [
        {
         "item": "붙박이장 (슬라이딩)",
         "qty": "v"
        }
       ]
      }
     ],
     "def": 0,
     "num": {
      "label": "길이",
      "unit": "자",
      "def": 8
     }
    },
    {
     "key": "light",
     "label": "매입등",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "추가",
       "lines": [
        {
         "item": "3인치 COB 매입등",
         "qty": "v"
        }
       ]
      }
     ],
     "def": 0,
     "num": {
      "label": "개수",
      "unit": "개",
      "def": 4
     }
    }
   ]
  },
  "욕실": {
   "cats": [
    {
     "key": "scope",
     "label": "공사 범위",
     "opts": [
      {
       "label": "공사 안 함",
       "lines": []
      },
      {
       "label": "도기·수전 교체",
       "lines": []
      },
      {
       "label": "덧방 리모델링",
       "lines": []
      },
      {
       "label": "전체 리모델링",
       "lines": [
        {
         "item": "욕실 철거 (1칸)",
         "qty": "1"
        },
        {
         "item": "욕실 방수",
         "qty": "1",
         "note": "1차 액방 + 2·3차 도막방수 / 아덱스"
        }
       ]
      }
     ],
     "def": 3
    },
    {
     "key": "wtile",
     "label": "벽 타일",
     "opts": [
      {
       "label": "300×600",
       "lines": [
        {
         "item": "300×600 벽타일",
         "qty": "Math.ceil(WT*1.08/1.44)",
         "note": "벽 면적 / 1BOX 1.44㎡ / 로스 8%",
         "when": "S('공사 범위')=='덧방 리모델링'||S('공사 범위')=='전체 리모델링'"
        }
       ]
      },
      {
       "label": "600×600",
       "lines": [
        {
         "item": "600각 포세린 타일",
         "qty": "Math.ceil(WT*1.08/1.44)",
         "note": "벽 면적 / 1BOX 1.44㎡ / 로스 8%",
         "when": "S('공사 범위')=='덧방 리모델링'||S('공사 범위')=='전체 리모델링'"
        }
       ]
      },
      {
       "label": "600×1200 대형",
       "lines": [
        {
         "item": "600×1200 포세린 타일",
         "qty": "Math.ceil(WT*1.1/1.44)",
         "note": "벽 면적 / 1BOX 1.44㎡ / 로스 10%",
         "when": "S('공사 범위')=='덧방 리모델링'||S('공사 범위')=='전체 리모델링'"
        }
       ]
      }
     ],
     "def": 1
    },
    {
     "key": "ftile",
     "label": "바닥 타일",
     "opts": [
      {
       "label": "300×300 논슬립",
       "lines": [
        {
         "item": "300각 바닥·발코니 타일",
         "qty": "Math.ceil(A*1.08/1.44)",
         "note": "바닥 면적 / 로스 8%",
         "when": "S('공사 범위')=='덧방 리모델링'||S('공사 범위')=='전체 리모델링'"
        }
       ]
      },
      {
       "label": "600×600",
       "lines": [
        {
         "item": "600각 포세린 타일",
         "qty": "Math.ceil(A*1.1/1.44)",
         "note": "바닥 면적 / 로스 10%",
         "when": "S('공사 범위')=='덧방 리모델링'||S('공사 범위')=='전체 리모델링'"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "set",
     "label": "도기·수전",
     "opts": [
      {
       "label": "기본 세트",
       "lines": [
        {
         "item": "도기세팅 인건비",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        },
        {
         "item": "세면대 (사각 반다리)",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        },
        {
         "item": "세면수전 (원홀)",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        },
        {
         "item": "샤워수전 + 슬라이드바",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        },
        {
         "item": "양변기 (투피스 치마형)",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        },
        {
         "item": "욕실 악세서리 세트",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        },
        {
         "item": "청소스프레이건",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        },
        {
         "item": "SMC 돔천장",
         "qty": "1",
         "note": "조명 별도",
         "when": "S('공사 범위')=='덧방 리모델링'||S('공사 범위')=='전체 리모델링'"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "mirror",
     "label": "거울·수납",
     "opts": [
      {
       "label": "슬라이드 거울장",
       "lines": [
        {
         "item": "슬라이드 거울장",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        }
       ]
      },
      {
       "label": "LED 거울",
       "lines": [
        {
         "item": "LED 거울",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        }
       ]
      },
      {
       "label": "없음",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "fan",
     "label": "환풍기",
     "opts": [
      {
       "label": "힘펠 플렉스",
       "lines": [
        {
         "item": "환풍기 (힘펠 플렉스)",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        }
       ]
      },
      {
       "label": "휴젠트 온풍",
       "lines": [
        {
         "item": "환풍기 (휴젠트 온풍)",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        }
       ]
      },
      {
       "label": "유지",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "part",
     "label": "샤워 파티션",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "유리 파티션",
       "lines": [
        {
         "item": "유리 파티션 (일반)",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        }
       ]
      },
      {
       "label": "ㄱ자 젠다이 파티션",
       "lines": [
        {
         "item": "ㄱ자 젠다이 유리 파티션",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "tub",
     "label": "욕조",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "아크릴 욕조",
       "lines": [
        {
         "item": "아크릴 욕조 (이동식)",
         "qty": "1",
         "when": "S('공사 범위')!='공사 안 함'"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "door",
     "label": "욕실문",
     "opts": [
      {
       "label": "교체",
       "lines": [
        {
         "item": "욕실 ABS 민자도어세트",
         "qty": "1"
        }
       ]
      },
      {
       "label": "유지",
       "lines": []
      }
     ],
     "def": 0
    }
   ]
  },
  "발코니": {
   "cats": [
    {
     "key": "elastic",
     "label": "벽 탄성코트",
     "opts": [
      {
       "label": "시공",
       "lines": [
        {
         "item": "탄성코트",
         "qty": "1"
        }
       ]
      },
      {
       "label": "안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "btile",
     "label": "바닥 타일",
     "opts": [
      {
       "label": "유지",
       "lines": []
      },
      {
       "label": "300×300 타일",
       "lines": [
        {
         "item": "300각 바닥·발코니 타일",
         "qty": "Math.ceil(A*1.08/1.44)",
         "note": "발코니 바닥 / 로스 8%"
        }
       ]
      }
     ],
     "def": 0
    }
   ]
  },
  "공통": {
   "cats": [
    {
     "key": "protect",
     "label": "보양·공사신고",
     "opts": [
      {
       "label": "포함",
       "lines": [
        {
         "item": "보양작업",
         "qty": "1"
        },
        {
         "item": "공사동의서",
         "qty": "1"
        },
        {
         "item": "관리사무소 공사신고·엘베사용료",
         "qty": "1"
        }
       ]
      },
      {
       "label": "제외",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "demo",
     "label": "철거",
     "opts": [
      {
       "label": "부분 철거",
       "lines": [
        {
         "item": "부분 철거",
         "qty": "Math.round(exclM2)",
         "note": "전용면적 기준"
        }
       ]
      },
      {
       "label": "전체 철거",
       "lines": [
        {
         "item": "전체 철거",
         "qty": "Math.round(exclM2)",
         "note": "전용면적 기준"
        }
       ]
      },
      {
       "label": "없음",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "fdemo",
     "label": "기존 바닥 철거",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "철거·샌딩",
       "lines": [
        {
         "item": "바닥 철거 및 샌딩",
         "qty": "Math.round(FT*10)/10",
         "note": "바닥 시공 면적"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "elec",
     "label": "전기·조명",
     "opts": [
      {
       "label": "전체 (스위치·콘센트·조명기구)",
       "lines": [
        {
         "item": "전기 자재",
         "qty": "1"
        },
        {
         "item": "전기 부자재",
         "qty": "1"
        },
        {
         "item": "전체 조명 자재",
         "qty": "1"
        }
       ]
      },
      {
       "label": "조명 기구만",
       "lines": [
        {
         "item": "전체 조명 자재",
         "qty": "1"
        }
       ]
      },
      {
       "label": "안 함",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "window",
     "label": "창호",
     "opts": [
      {
       "label": "안 함",
       "lines": []
      },
      {
       "label": "업체 견적 반영",
       "lines": [
        {
         "item": "창호 (업체 견적)",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0,
     "num": {
      "label": "업체 견적 원가",
      "unit": "원",
      "def": 0,
      "var": "window"
     }
    },
    {
     "key": "film",
     "label": "필름 (문·문틀)",
     "opts": [
      {
       "label": "안 함",
       "lines": []
      },
      {
       "label": "시공",
       "lines": [
        {
         "item": "필름 자재",
         "qty": "Math.round(v*3.5)",
         "note": "문 1개당 3.5㎡"
        }
       ]
      }
     ],
     "def": 0,
     "num": {
      "label": "문 개수",
      "unit": "개",
      "def": 4
     }
    },
    {
     "key": "fire",
     "label": "자동확산 소화기",
     "opts": [
      {
       "label": "없음",
       "lines": []
      },
      {
       "label": "설치",
       "lines": [
        {
         "item": "자동확산 소화기 (연동)",
         "qty": "1"
        }
       ]
      }
     ],
     "def": 0
    },
    {
     "key": "clean",
     "label": "입주청소",
     "opts": [
      {
       "label": "포함",
       "lines": [
        {
         "item": "입주청소",
         "qty": "Math.round(supplyM2)",
         "note": "공급면적 기준"
        }
       ]
      },
      {
       "label": "제외",
       "lines": []
      }
     ],
     "def": 0
    },
    {
     "key": "finish",
     "label": "공정간 폐기물·마감 실리콘",
     "opts": [
      {
       "label": "포함",
       "lines": [
        {
         "item": "공정간 폐기물 처리",
         "qty": "1"
        },
        {
         "item": "마감 실리콘 작업",
         "qty": "1"
        }
       ]
      },
      {
       "label": "제외",
       "lines": []
      }
     ],
     "def": 0
    }
   ]
  }
 },
 "auto": [
  {
   "item": "철거 폐기물 (1톤)",
   "qty": "(C('demo')=='전체 철거'?Math.ceil(exclM2/40):C('demo')=='부분 철거'?1:0)+(T('욕실 철거 (1칸)')>0?1:0)",
   "note": "1톤 트럭",
   "when": "C('demo')!='없음'||T('욕실 철거 (1칸)')>0"
  },
  {
   "item": "내부 바닥 보양",
   "qty": "Math.round(FT)",
   "note": "바닥재 유지 공간 보양",
   "when": "C('protect')=='포함'&&FT==0"
  },
  {
   "item": "사다리차 (8층 이하)",
   "qty": "1",
   "when": "C('window')!='안 함'&&level<=8"
  },
  {
   "item": "사다리차 (10층 이상)",
   "qty": "1",
   "when": "C('window')!='안 함'&&level>8"
  },
  {
   "item": "상하부 몰딩 목작업",
   "qty": "Math.max(1,Math.ceil(T('평몰딩 30mm')/40))",
   "note": "상·하부 몰딩 시공",
   "when": "T('평몰딩 30mm')>0"
  },
  {
   "item": "목수 인건비",
   "qty": "0",
   "note": "목작업 여유 인원",
   "when": "T('평몰딩 30mm')+T('평천장(중천장) 목작업')+T('벽체 단열작업 (1면)')>0"
  },
  {
   "item": "목자재 납품",
   "qty": "1",
   "note": "각재, 석고보드, MDF, 합판",
   "when": "T('평몰딩 30mm')+T('평천장(중천장) 목작업')>0"
  },
  {
   "item": "부자재 및 장비대",
   "qty": "1",
   "note": "타카핀, 목공본드, 폼본드, 마대 등",
   "when": "T('평몰딩 30mm')+T('평천장(중천장) 목작업')>0"
  },
  {
   "item": "전기 인건비",
   "qty": "C('elec').startsWith('전체')?Math.max(2,Math.ceil(rooms/2)+1)+Math.floor((T('3인치 COB 매입등')+T('라인조명'))/20):1",
   "when": "C('elec')!='안 함'"
  },
  {
   "item": "타일 부자재",
   "qty": "Math.round(((T('300×600 벽타일')+T('600각 포세린 타일')+T('600×1200 포세린 타일')+T('300각 바닥·발코니 타일'))*1.44)/1.08)",
   "note": "코너비드, 에폭시, 아덱스 메지·실리콘",
   "when": "((T('300×600 벽타일')+T('600각 포세린 타일')+T('600×1200 포세린 타일')+T('300각 바닥·발코니 타일'))*1.44)>0"
  },
  {
   "item": "타일 인건비 (기공)",
   "qty": "Math.max(1,Math.ceil(((T('300×600 벽타일')+T('600각 포세린 타일')+T('600×1200 포세린 타일')+T('300각 바닥·발코니 타일'))*1.44)/9))",
   "note": "시공 면적 9㎡/인 기준",
   "when": "((T('300×600 벽타일')+T('600각 포세린 타일')+T('600×1200 포세린 타일')+T('300각 바닥·발코니 타일'))*1.44)>0"
  },
  {
   "item": "바닥 인건비",
   "qty": "Math.max(1,Math.ceil(FT/90))",
   "note": "장판 시공 90㎡/인 기준",
   "when": "G.floorItem.startsWith('장판')&&FT>0"
  },
  {
   "item": "바닥 부자재",
   "qty": "1",
   "note": "접착제, 프라이머, 실리콘",
   "when": "G.floorItem.startsWith('장판')&&FT>0"
  },
  {
   "item": "강마루 보양",
   "qty": "Math.round(FT*10)/10",
   "note": "종이 보양",
   "when": "G.floorItem.startsWith('강마루')&&FT>0"
  },
  {
   "item": "도배 부자재",
   "qty": "Math.round((T('실크 도배 (LX 베스띠급)')+T('합지 도배')+T('디아망 도배 (프리미엄)')))",
   "note": "초배지, 도배풀, 실리콘, 커버링테이프",
   "when": "(T('실크 도배 (LX 베스띠급)')+T('합지 도배')+T('디아망 도배 (프리미엄)'))>0"
  },
  {
   "item": "도배 인건비",
   "qty": "Math.max(2,Math.ceil((T('실크 도배 (LX 베스띠급)')+T('합지 도배')+T('디아망 도배 (프리미엄)'))/53))",
   "note": "53㎡/인 기준",
   "when": "(T('실크 도배 (LX 베스띠급)')+T('합지 도배')+T('디아망 도배 (프리미엄)'))>0"
  },
  {
   "item": "필름 인건비",
   "qty": "Math.max(1,Math.ceil(T('필름 자재')/20))",
   "note": "20㎡/인 기준",
   "when": "T('필름 자재')>0"
  },
  {
   "item": "필름 부자재",
   "qty": "1",
   "when": "T('필름 자재')>0"
  }
 ],
 "packages": [
  {
   "key": "protect",
   "label": "보양·공사신고",
   "group": "기본공사",
   "sets": [
    {
     "types": [
      "공통"
     ],
     "cat": "protect",
     "opt": "포함"
    }
   ],
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "protect",
     "opt": "제외"
    }
   ]
  },
  {
   "key": "demo",
   "label": "철거",
   "group": "기본공사",
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "demo",
     "opt": "없음"
    }
   ],
   "grades": [
    {
     "label": "부분 철거",
     "sets": [
      {
       "types": [
        "공통"
       ],
       "cat": "demo",
       "opt": "부분 철거"
      }
     ]
    },
    {
     "label": "전체 철거",
     "sets": [
      {
       "types": [
        "공통"
       ],
       "cat": "demo",
       "opt": "전체 철거"
      }
     ]
    }
   ]
  },
  {
   "key": "fdemo",
   "label": "기존 바닥 철거·샌딩",
   "group": "기본공사",
   "sets": [
    {
     "types": [
      "공통"
     ],
     "cat": "fdemo",
     "opt": "철거·샌딩"
    }
   ],
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "fdemo",
     "opt": "없음"
    }
   ]
  },
  {
   "key": "asbestos",
   "label": "석면 철거",
   "group": "기본공사",
   "items": [
    {
     "item": "석면 철거",
     "qty": "1"
    }
   ]
  },
  {
   "key": "expand",
   "label": "발코니 확장",
   "group": "기본공사",
   "num": {
    "label": "업체 견적 원가",
    "unit": "원",
    "def": 0,
    "var": "expand"
   },
   "items": [
    {
     "item": "발코니 확장 공사 (업체 견적)",
     "qty": "1"
    },
    {
     "item": "확장 행위허가 신고",
     "qty": "1"
    }
   ]
  },
  {
   "key": "floor",
   "label": "바닥재",
   "group": "바닥·벽·천장",
   "sets": [
    {
     "types": [
      "거실",
      "주방",
      "방"
     ],
     "cat": "floor",
     "opt": "기본 마감"
    }
   ],
   "off": [
    {
     "types": [
      "거실",
      "주방",
      "방"
     ],
     "cat": "floor",
     "opt": "공사 안 함"
    }
   ],
   "grades": [
    {
     "label": "장판 2.2T",
     "global": {
      "floorItem": "장판 2.2T (LX 자연애 등)"
     }
    },
    {
     "label": "장판 1.8T",
     "global": {
      "floorItem": "장판 1.8T"
     }
    },
    {
     "label": "장판 2.7T",
     "global": {
      "floorItem": "장판 2.7T"
     }
    },
    {
     "label": "장판 3.2T",
     "global": {
      "floorItem": "장판 3.2T"
     }
    },
    {
     "label": "장판 4.5T",
     "global": {
      "floorItem": "장판 4.5T"
     }
    },
    {
     "label": "장판 5T",
     "global": {
      "floorItem": "장판 5T"
     }
    },
    {
     "label": "강마루",
     "global": {
      "floorItem": "강마루 (동화 나투스진 7T)"
     }
    },
    {
     "label": "돌마루",
     "global": {
      "floorItem": "돌마루 (에디톤 스톤 5T)"
     }
    }
   ]
  },
  {
   "key": "paper",
   "label": "도배",
   "group": "바닥·벽·천장",
   "sets": [
    {
     "types": [
      "거실",
      "주방",
      "방"
     ],
     "cat": "paper",
     "opt": "기본 마감"
    }
   ],
   "off": [
    {
     "types": [
      "거실",
      "주방",
      "방"
     ],
     "cat": "paper",
     "opt": "공사 안 함"
    }
   ],
   "grades": [
    {
     "label": "실크",
     "global": {
      "paperItem": "실크 도배 (LX 베스띠급)"
     }
    },
    {
     "label": "합지",
     "global": {
      "paperItem": "합지 도배"
     }
    },
    {
     "label": "프리미엄 (디아망)",
     "global": {
      "paperItem": "디아망 도배 (프리미엄)"
     }
    }
   ]
  },
  {
   "key": "mold",
   "label": "몰딩·걸레받이 교체",
   "group": "바닥·벽·천장",
   "sets": [
    {
     "types": [
      "거실",
      "방"
     ],
     "cat": "mold",
     "opt": "교체"
    }
   ],
   "off": [
    {
     "types": [
      "거실",
      "방"
     ],
     "cat": "mold",
     "opt": "유지"
    }
   ]
  },
  {
   "key": "ceil",
   "label": "거실 평천장·우물천장",
   "group": "바닥·벽·천장",
   "sets": [
    {
     "types": [
      "거실"
     ],
     "cat": "ceil",
     "opt": "평천장 작업"
    }
   ],
   "off": [
    {
     "types": [
      "거실"
     ],
     "cat": "ceil",
     "opt": "유지"
    }
   ]
  },
  {
   "key": "insul",
   "label": "단열 작업",
   "group": "바닥·벽·천장",
   "num": {
    "label": "벽면",
    "unit": "면",
    "def": 2
   },
   "items": [
    {
     "item": "벽체 단열작업 (1면)",
     "qty": "v"
    }
   ]
  },
  {
   "key": "artwall",
   "label": "아트월",
   "group": "바닥·벽·천장",
   "items": [
    {
     "item": "아트월",
     "qty": "1"
    }
   ]
  },
  {
   "key": "paint",
   "label": "도장 (몰딩·문틀)",
   "group": "바닥·벽·천장",
   "items": [
    {
     "item": "도장 공사 (몰딩·문틀)",
     "qty": "1"
    }
   ]
  },
  {
   "key": "film",
   "label": "필름 (문·문틀)",
   "group": "바닥·벽·천장",
   "sets": [
    {
     "types": [
      "공통"
     ],
     "cat": "film",
     "opt": "시공"
    }
   ],
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "film",
     "opt": "안 함"
    }
   ],
   "num": {
    "label": "문",
    "unit": "개",
    "def": 4,
    "target": "film"
   }
  },
  {
   "key": "bath",
   "label": "욕실 공사",
   "group": "욕실",
   "off": [
    {
     "types": [
      "욕실"
     ],
     "cat": "scope",
     "opt": "공사 안 함"
    }
   ],
   "grades": [
    {
     "label": "전체 리모델링",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "scope",
       "opt": "전체 리모델링"
      }
     ]
    },
    {
     "label": "덧방 리모델링",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "scope",
       "opt": "덧방 리모델링"
      }
     ]
    },
    {
     "label": "도기·수전만",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "scope",
       "opt": "도기·수전 교체"
      }
     ]
    }
   ],
   "num": {
    "label": "욕실",
    "unit": "칸",
    "def": "baths",
    "first": "욕실"
   }
  },
  {
   "key": "btile",
   "label": "욕실 벽 타일",
   "group": "욕실",
   "grades": [
    {
     "label": "300×600",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "wtile",
       "opt": "300×600"
      }
     ]
    },
    {
     "label": "600×600",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "wtile",
       "opt": "600×600"
      }
     ]
    },
    {
     "label": "600×1200 대형",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "wtile",
       "opt": "600×1200 대형"
      }
     ]
    }
   ]
  },
  {
   "key": "part",
   "label": "샤워 파티션",
   "group": "욕실",
   "off": [
    {
     "types": [
      "욕실"
     ],
     "cat": "part",
     "opt": "없음"
    }
   ],
   "grades": [
    {
     "label": "유리 파티션",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "part",
       "opt": "유리 파티션"
      }
     ]
    },
    {
     "label": "ㄱ자 젠다이 파티션",
     "sets": [
      {
       "types": [
        "욕실"
       ],
       "cat": "part",
       "opt": "ㄱ자 젠다이 파티션"
      }
     ]
    }
   ]
  },
  {
   "key": "tub",
   "label": "욕조",
   "group": "욕실",
   "sets": [
    {
     "types": [
      "욕실"
     ],
     "cat": "tub",
     "opt": "아크릴 욕조"
    }
   ],
   "off": [
    {
     "types": [
      "욕실"
     ],
     "cat": "tub",
     "opt": "없음"
    }
   ],
   "num": {
    "label": "욕실",
    "unit": "칸",
    "def": 1,
    "first": "욕실"
   }
  },
  {
   "key": "zendai",
   "label": "젠다이 시공",
   "group": "욕실",
   "num": {
    "label": "욕실",
    "unit": "칸",
    "def": 1
   },
   "items": [
    {
     "item": "젠다이 시공",
     "qty": "v"
    }
   ]
  },
  {
   "key": "grout",
   "label": "줄눈 시공",
   "group": "욕실",
   "num": {
    "label": "욕실",
    "unit": "칸",
    "def": 2
   },
   "items": [
    {
     "item": "줄눈 시공",
     "qty": "v"
    }
   ]
  },
  {
   "key": "sink",
   "label": "싱크대",
   "group": "주방·가구",
   "off": [
    {
     "types": [
      "주방"
     ],
     "cat": "sink",
     "opt": "유지"
    }
   ],
   "grades": [
    {
     "label": "교체",
     "sets": [
      {
       "types": [
        "주방"
       ],
       "cat": "sink",
       "opt": "교체"
      }
     ]
    },
    {
     "label": "필름 리폼",
     "sets": [
      {
       "types": [
        "주방"
       ],
       "cat": "sink",
       "opt": "필름 리폼"
      }
     ]
    }
   ],
   "num": {
    "label": "길이",
    "unit": "자",
    "def": 10,
    "target": "sink"
   }
  },
  {
   "key": "top",
   "label": "주방 상판 교체",
   "group": "주방·가구",
   "items": [
    {
     "item": "주방 상판 교체 (인조대리석)",
     "qty": "1"
    }
   ]
  },
  {
   "key": "bowl",
   "label": "싱크볼·수전",
   "group": "주방·가구",
   "sets": [
    {
     "types": [
      "주방"
     ],
     "cat": "bowl",
     "opt": "사각 싱크볼 + 폭포수전"
    }
   ],
   "off": [
    {
     "types": [
      "주방"
     ],
     "cat": "bowl",
     "opt": "유지"
    }
   ]
  },
  {
   "key": "fridge",
   "label": "냉장고장",
   "group": "주방·가구",
   "sets": [
    {
     "types": [
      "주방"
     ],
     "cat": "fridge",
     "opt": "설치"
    }
   ],
   "off": [
    {
     "types": [
      "주방"
     ],
     "cat": "fridge",
     "opt": "없음"
    }
   ]
  },
  {
   "key": "shoe",
   "label": "신발장",
   "group": "주방·가구",
   "sets": [
    {
     "types": [
      "현관"
     ],
     "cat": "shoe",
     "opt": "교체"
    }
   ],
   "off": [
    {
     "types": [
      "현관"
     ],
     "cat": "shoe",
     "opt": "유지"
    }
   ],
   "num": {
    "label": "길이",
    "unit": "자",
    "def": 4,
    "target": "shoe"
   }
  },
  {
   "key": "closet",
   "label": "붙박이장",
   "group": "주방·가구",
   "off": [
    {
     "types": [
      "방"
     ],
     "cat": "closet",
     "opt": "없음"
    }
   ],
   "grades": [
    {
     "label": "여닫이",
     "sets": [
      {
       "types": [
        "방"
       ],
       "cat": "closet",
       "opt": "여닫이"
      }
     ]
    },
    {
     "label": "슬라이딩",
     "sets": [
      {
       "types": [
        "방"
       ],
       "cat": "closet",
       "opt": "슬라이딩"
      }
     ]
    }
   ],
   "num": {
    "label": "길이(안방)",
    "unit": "자",
    "def": 8,
    "target": "closet",
    "first": "방"
   }
  },
  {
   "key": "hanger",
   "label": "시스템 행거",
   "group": "주방·가구",
   "items": [
    {
     "item": "시스템 행거",
     "qty": "1"
    }
   ]
  },
  {
   "key": "desk",
   "label": "화장대·책장",
   "group": "주방·가구",
   "num": {
    "label": "길이",
    "unit": "자",
    "def": 4
   },
   "items": [
    {
     "item": "화장대·책장",
     "qty": "v"
    }
   ]
  },
  {
   "key": "door",
   "label": "방문·욕실문 교체",
   "group": "도어·창호",
   "sets": [
    {
     "types": [
      "방"
     ],
     "cat": "door",
     "opt": "교체"
    },
    {
     "types": [
      "욕실"
     ],
     "cat": "door",
     "opt": "교체"
    }
   ],
   "off": [
    {
     "types": [
      "방"
     ],
     "cat": "door",
     "opt": "유지"
    },
    {
     "types": [
      "욕실"
     ],
     "cat": "door",
     "opt": "유지"
    }
   ]
  },
  {
   "key": "jungmun",
   "label": "현관 중문",
   "group": "도어·창호",
   "off": [
    {
     "types": [
      "현관"
     ],
     "cat": "jungmun",
     "opt": "없음"
    }
   ],
   "grades": [
    {
     "label": "초슬림 3연동",
     "sets": [
      {
       "types": [
        "현관"
       ],
       "cat": "jungmun",
       "opt": "초슬림 3연동"
      }
     ]
    },
    {
     "label": "ㄱ자 3연동",
     "sets": [
      {
       "types": [
        "현관"
       ],
       "cat": "jungmun",
       "opt": "ㄱ자 3연동"
      }
     ]
    },
    {
     "label": "원슬라이딩",
     "sets": [
      {
       "types": [
        "현관"
       ],
       "cat": "jungmun",
       "opt": "원슬라이딩"
      }
     ]
    },
    {
     "label": "폴딩도어",
     "sets": [
      {
       "types": [
        "현관"
       ],
       "cat": "jungmun",
       "opt": "폴딩도어"
      }
     ]
    }
   ]
  },
  {
   "key": "lock",
   "label": "도어락 교체",
   "group": "도어·창호",
   "sets": [
    {
     "types": [
      "현관"
     ],
     "cat": "lock",
     "opt": "지문 도어락 교체"
    }
   ],
   "off": [
    {
     "types": [
      "현관"
     ],
     "cat": "lock",
     "opt": "유지"
    }
   ]
  },
  {
   "key": "firedoor",
   "label": "현관 방화문 시트",
   "group": "도어·창호",
   "items": [
    {
     "item": "현관 방화문 시트 작업",
     "qty": "1"
    }
   ]
  },
  {
   "key": "window",
   "label": "창호 (샷시)",
   "group": "도어·창호",
   "sets": [
    {
     "types": [
      "공통"
     ],
     "cat": "window",
     "opt": "업체 견적 반영"
    }
   ],
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "window",
     "opt": "안 함"
    }
   ],
   "num": {
    "label": "업체 견적 원가",
    "unit": "원",
    "def": 0,
    "var": "window"
   }
  },
  {
   "key": "screen",
   "label": "방충망 교체",
   "group": "도어·창호",
   "num": {
    "label": "수량",
    "unit": "EA",
    "def": 6
   },
   "items": [
    {
     "item": "방충망 교체",
     "qty": "v"
    }
   ]
  },
  {
   "key": "elec",
   "label": "전기·조명",
   "group": "전기·조명",
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "elec",
     "opt": "안 함"
    }
   ],
   "grades": [
    {
     "label": "전체 (스위치·콘센트·조명)",
     "sets": [
      {
       "types": [
        "공통"
       ],
       "cat": "elec",
       "opt": "전체 (스위치·콘센트·조명기구)"
      }
     ]
    },
    {
     "label": "조명 기구만",
     "sets": [
      {
       "types": [
        "공통"
       ],
       "cat": "elec",
       "opt": "조명 기구만"
      }
     ]
    }
   ]
  },
  {
   "key": "downlight",
   "label": "매입등 (다운라이트)",
   "group": "전기·조명",
   "num": {
    "label": "개수",
    "unit": "개",
    "def": 12
   },
   "items": [
    {
     "item": "3인치 COB 매입등",
     "qty": "v"
    }
   ]
  },
  {
   "key": "line",
   "label": "라인조명",
   "group": "전기·조명",
   "num": {
    "label": "길이",
    "unit": "m",
    "def": 6
   },
   "items": [
    {
     "item": "라인조명",
     "qty": "v"
    }
   ]
  },
  {
   "key": "t5",
   "label": "간접조명 (T5)",
   "group": "전기·조명",
   "items": [
    {
     "item": "T5 간접조명",
     "qty": "1"
    }
   ]
  },
  {
   "key": "fan",
   "label": "실링팬",
   "group": "전기·조명",
   "num": {
    "label": "수량",
    "unit": "EA",
    "def": 1
   },
   "items": [
    {
     "item": "실링팬",
     "qty": "v"
    }
   ]
  },
  {
   "key": "circuit",
   "label": "콘센트·전용회로 증설",
   "group": "전기·조명",
   "num": {
    "label": "개소",
    "unit": "개소",
    "def": 3
   },
   "items": [
    {
     "item": "콘센트·전용회로 증설",
     "qty": "v"
    }
   ]
  },
  {
   "key": "interphone",
   "label": "인터폰(월패드) 교체",
   "group": "전기·조명",
   "items": [
    {
     "item": "인터폰 7인치 교체",
     "qty": "1"
    }
   ]
  },
  {
   "key": "fire",
   "label": "자동확산 소화기",
   "group": "전기·조명",
   "sets": [
    {
     "types": [
      "공통"
     ],
     "cat": "fire",
     "opt": "설치"
    }
   ],
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "fire",
     "opt": "없음"
    }
   ]
  },
  {
   "key": "aircon",
   "label": "시스템에어컨",
   "group": "설비·냉난방",
   "num": {
    "label": "업체 견적 원가",
    "unit": "원",
    "def": 0,
    "var": "aircon"
   },
   "items": [
    {
     "item": "시스템에어컨 (업체 견적)",
     "qty": "1"
    }
   ]
  },
  {
   "key": "boiler",
   "label": "보일러 교체",
   "group": "설비·냉난방",
   "items": [
    {
     "item": "보일러 교체",
     "qty": "1"
    }
   ]
  },
  {
   "key": "dist",
   "label": "분배기 교체",
   "group": "설비·냉난방",
   "items": [
    {
     "item": "분배기 교체",
     "qty": "1"
    }
   ]
  },
  {
   "key": "thermo",
   "label": "각방 온도조절기",
   "group": "설비·냉난방",
   "items": [
    {
     "item": "각방 온도조절기 교체",
     "qty": "1"
    }
   ]
  },
  {
   "key": "xl",
   "label": "엑셀배관 증설 (확장부)",
   "group": "설비·냉난방",
   "items": [
    {
     "item": "엑셀배관 증설",
     "qty": "1"
    }
   ]
  },
  {
   "key": "level",
   "label": "바닥 수평 보정 (셀프레벨링)",
   "group": "설비·냉난방",
   "items": [
    {
     "item": "수평몰탈 시공",
     "qty": "1"
    }
   ]
  },
  {
   "key": "elastic",
   "label": "발코니 탄성코트",
   "group": "발코니·마감",
   "sets": [
    {
     "types": [
      "발코니"
     ],
     "cat": "elastic",
     "opt": "시공"
    }
   ],
   "off": [
    {
     "types": [
      "발코니"
     ],
     "cat": "elastic",
     "opt": "안 함"
    }
   ]
  },
  {
   "key": "baltile",
   "label": "발코니 바닥 타일",
   "group": "발코니·마감",
   "sets": [
    {
     "types": [
      "발코니"
     ],
     "cat": "btile",
     "opt": "300×300 타일"
    }
   ],
   "off": [
    {
     "types": [
      "발코니"
     ],
     "cat": "btile",
     "opt": "유지"
    }
   ]
  },
  {
   "key": "dryer",
   "label": "빨래건조대",
   "group": "발코니·마감",
   "items": [
    {
     "item": "빨래건조대",
     "qty": "1"
    }
   ]
  },
  {
   "key": "curtain",
   "label": "커튼박스",
   "group": "발코니·마감",
   "num": {
    "label": "길이",
    "unit": "m",
    "def": 8
   },
   "items": [
    {
     "item": "커튼박스",
     "qty": "v"
    }
   ]
  },
  {
   "key": "finish",
   "label": "공정간 폐기물·마감 실리콘",
   "group": "발코니·마감",
   "sets": [
    {
     "types": [
      "공통"
     ],
     "cat": "finish",
     "opt": "포함"
    }
   ],
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "finish",
     "opt": "제외"
    }
   ]
  },
  {
   "key": "clean",
   "label": "입주청소",
   "group": "발코니·마감",
   "sets": [
    {
     "types": [
      "공통"
     ],
     "cat": "clean",
     "opt": "포함"
    }
   ],
   "off": [
    {
     "types": [
      "공통"
     ],
     "cat": "clean",
     "opt": "제외"
    }
   ]
  },
  {
   "key": "outsource",
   "label": "기타 외주 공사",
   "group": "발코니·마감",
   "num": {
    "label": "업체 견적 원가",
    "unit": "원",
    "def": 0,
    "var": "outsource"
   },
   "items": [
    {
     "item": "기타 외주 공사 (업체 견적)",
     "qty": "1"
    }
   ]
  }
 ],
 "presets": [
  {
   "label": "전체 리모델링",
   "on": [
    "protect",
    "demo",
    "floor",
    "paper",
    "mold",
    "bath",
    "btile",
    "door",
    "elec",
    "elastic",
    "finish",
    "clean",
    "lock",
    "fire",
    "jungmun",
    "sink",
    "bowl",
    "shoe",
    "downlight",
    "part"
   ],
   "grades": {
    "demo": 1
   }
  },
  {
   "label": "기본 리모델링",
   "on": [
    "protect",
    "demo",
    "floor",
    "paper",
    "mold",
    "bath",
    "btile",
    "door",
    "elec",
    "elastic",
    "finish",
    "clean",
    "lock",
    "fire"
   ],
   "grades": {
    "demo": 0
   }
  },
  {
   "label": "도배·바닥만",
   "on": [
    "protect",
    "demo",
    "floor",
    "paper",
    "mold",
    "finish",
    "clean"
   ],
   "grades": {
    "demo": 0
   }
  },
  {
   "label": "욕실만",
   "on": [
    "protect",
    "bath",
    "btile",
    "finish"
   ],
   "grades": {
    "bath": 0
   }
  },
  {
   "label": "주방만",
   "on": [
    "protect",
    "sink",
    "top",
    "bowl",
    "fridge",
    "finish"
   ],
   "grades": {
    "sink": 0
   }
  },
  {
   "label": "직접 선택",
   "on": [],
   "grades": {}
  }
 ],
 "steps": [
  {
   "key": "s1",
   "label": "보양·철거",
   "procs": [
    "가설",
    "철거"
   ],
   "pk": [
    "protect",
    "demo",
    "fdemo",
    "asbestos"
   ]
  },
  {
   "key": "s2",
   "label": "창문·확장",
   "procs": [
    "창호"
   ],
   "pk": [
    "expand",
    "window",
    "screen"
   ]
  },
  {
   "key": "s3",
   "label": "배관·난방·에어컨",
   "procs": [
    "설비"
   ],
   "pk": [
    "aircon",
    "boiler",
    "dist",
    "thermo",
    "xl",
    "level"
   ]
  },
  {
   "key": "s4",
   "label": "몰딩·천장·벽",
   "procs": [
    "목공"
   ],
   "pk": [
    "mold",
    "ceil",
    "insul",
    "artwall",
    "curtain"
   ]
  },
  {
   "key": "s5",
   "label": "전기·조명",
   "procs": [
    "전기"
   ],
   "pk": [
    "elec",
    "downlight",
    "line",
    "t5",
    "fan",
    "circuit",
    "interphone",
    "fire"
   ]
  },
  {
   "key": "s6",
   "label": "문·중문",
   "procs": [
    "도어"
   ],
   "pk": [
    "door",
    "jungmun",
    "lock",
    "firedoor"
   ]
  },
  {
   "key": "s7",
   "label": "욕실·타일",
   "procs": [
    "욕실",
    "타일"
   ],
   "pk": [
    "bath",
    "btile",
    "part",
    "tub",
    "zendai",
    "grout"
   ]
  },
  {
   "key": "s8",
   "label": "바닥",
   "procs": [
    "바닥"
   ],
   "pk": [
    "floor"
   ]
  },
  {
   "key": "s9",
   "label": "벽지(도배)",
   "procs": [
    "도배"
   ],
   "pk": [
    "paper"
   ]
  },
  {
   "key": "s10",
   "label": "필름·페인트",
   "procs": [
    "필름"
   ],
   "pk": [
    "film",
    "paint"
   ]
  },
  {
   "key": "s11",
   "label": "주방·수납가구",
   "procs": [
    "가구"
   ],
   "pk": [
    "sink",
    "top",
    "bowl",
    "fridge",
    "shoe",
    "closet",
    "hanger",
    "desk"
   ]
  },
  {
   "key": "s12",
   "label": "발코니·마무리",
   "procs": [
    "기타"
   ],
   "pk": [
    "elastic",
    "baltile",
    "dryer",
    "finish",
    "clean",
    "outsource"
   ]
  }
 ],
 "global": {
  "floorOpts": [
   "장판 2.2T (LX 자연애 등)",
   "장판 1.8T",
   "장판 2.7T",
   "장판 3.2T",
   "장판 4.5T",
   "장판 5T",
   "강마루 (동화 나투스진 7T)",
   "돌마루 (에디톤 스톤 5T)"
  ],
  "paperOpts": [
   "실크 도배 (LX 베스띠급)",
   "합지 도배",
   "디아망 도배 (프리미엄)"
  ]
 },
 "layout": {
  "exclRatio": 0.76,
  "living": 0.3,
  "kitchen": 0.13,
  "entry": 3.5,
  "bath": 4.2,
  "balcony": 6,
  "masterShare": 0.36,
  "ceilH": 2.3,
  "openingCut": 0.88
 },
 "doc": {
  "validDays": 14,
  "payment": [
   [
    "계약금",
    10,
    "계약 체결 시"
   ],
   [
    "착수금",
    30,
    "착공일"
   ],
   [
    "1차 중도금",
    25,
    "공정 50% 확인 후"
   ],
   [
    "2차 중도금",
    25,
    "공정 80% 확인 후"
   ],
   [
    "잔금",
    10,
    "최종 확인 후"
   ]
  ],
  "include": [
   "공정별 보양 및 공용부 보양",
   "철거 폐기물 처리 (견적 범위 내)",
   "기본 색상·기본 사이즈 기준 자재",
   "공정별 감리 체크 및 공사 톡방 일일 보고",
   "준공 후 1년 무상 하자보수 · 하자이행보증증권 교부"
  ],
  "exclude": [
   "관리사무소 공사 예치금",
   "가전 설치 및 연결 (식기세척기·인덕션 등)",
   "커튼·블라인드, 에어컨 배관",
   "철거 후 드러난 구조적 변수 (바닥 수평 보정, 누수, 숨은 배관)",
   "견적서에 없는 고객 요청 추가·변경 공사"
  ],
  "terms": [
   "본 견적서 금액은 계약 금액이 되며, 추가 공사비는 청구하지 않습니다.",
   "예외: ① 철거 후 드러난 구조적 변수 ② 천재지변 ③ 고객 요청 추가·변경 공사 — 사진과 함께 먼저 안내하고 동의 후 진행합니다.",
   "자재는 견적 등급 안에서 계약 후 자재 미팅으로 확정하며, 상위 등급 선택 시 차액만 변경 견적으로 안내합니다.",
   "회사 사유(오철거·재시공·오발주)로 생긴 비용은 회사가 부담합니다."
  ],
  "profitDesc": "설계 도서 검토 / 공정 및 일정 관리 / 자재 및 시공 품질 관리 / 작업자 및 현장 안전 관리 / 최종 검수 및 하자 관리"
 },
 "staffOnly": true
};
