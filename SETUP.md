# Parks 로컬 다이빙 - 설치 및 실행 가이드

## 📋 사전 요구사항

이 프로젝트를 실행하기 위해 필요한 소프트웨어:

- **Node.js** (v18 이상) - [다운로드](https://nodejs.org/)
- **npm** 또는 **yarn** 패키지 매니저

## 🔧 설치 단계

### 1. 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
npm install
```

또는 yarn 사용 시:

```bash
yarn install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

또는

```bash
yarn dev
```

서버가 실행되면 브라우저에서 `http://localhost:5173` 을 열어주세요.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 4. 빌드 미리보기

```bash
npm run preview
```

## 📁 이미지 파일 배치

`asset/` 폴더의 모든 이미지 파일이 `public/asset/` 경로에 복사되어야 합니다.

현재 필요한 이미지 파일:
- 1.png (세부 지점 히어로 이미지)
- 1 (2).png (보홀 지점 히어로 이미지)
- 2.png (리뷰 배경)
- 2 (2).png (리뷰 배경 대체)
- 4.png (Why Us 섹션)
- 5.png (타임라인)
- 5 (2).png (이벤트 섹션)
- 스크린샷 *.png (기타 섹션 이미지)

## 🎨 커스터마이징

### 색상 변경

[tailwind.config.ts](tailwind.config.ts:7)에서 브랜드 색상을 수정할 수 있습니다:

```typescript
colors: {
  'parks-yellow': '#FFE500',
  'parks-blue': '#5B9FFF',
  'ocean-blue': '#0EA5E9',
}
```

### 컴포넌트 수정

각 섹션은 독립적인 컴포넌트로 구성되어 있습니다:

- `src/components/HeroSection.tsx` - 히어로 섹션
- `src/components/ReviewsSection.tsx` - 리뷰 섹션
- `src/components/WhyUsSection.tsx` - Why Us 섹션
- `src/components/LocationsSection.tsx` - 지점 소개
- `src/components/TimelineSection.tsx` - 일정 및 포인트
- `src/components/PriceComparisonSection.tsx` - 가격 비교
- `src/components/EventsSection.tsx` - 이벤트 및 CTA
- `src/components/Footer.tsx` - 푸터

## 🚀 배포

### Vercel 배포

```bash
npm install -g vercel
vercel
```

### Netlify 배포

```bash
npm run build
# dist 폴더를 Netlify에 드래그 앤 드롭
```

## 🐛 문제 해결

### 포트 충돌

다른 포트를 사용하려면:

```bash
npm run dev -- --port 3000
```

### 이미지가 표시되지 않는 경우

1. `public/asset/` 폴더에 이미지가 있는지 확인
2. 이미지 경로가 `/asset/파일명.png` 형식인지 확인
3. 개발 서버 재시작

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

## 📞 지원

문제가 발생하면 다음으로 연락주세요:
- 이메일: parksdiving@gmail.com
- 인스타그램: @parks_diving
