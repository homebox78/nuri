# 누리 NURI

**실시간 번역 수업 시스템** UI.
선생님의 수업을, 학생의 언어로.

## 실행

서버·빌드·인터넷 없이 동작한다. 폴더를 받아 **index.html을 더블클릭**하면 바로 실행된다
(폰트·아이콘·이미지 전부 로컬, CDN 미사용).

## 페이지

| 파일 | 설명 |
|---|---|
| [index.html](index.html) | 로그인 (5개 언어 전환) — 시작 페이지 |
| [dashboard.html](dashboard.html) | 선생님 대시보드 — 라이브 수업·다시보기·용어집·학생 관리 |
| [design-system.html](design-system.html) | 디자인 시스템 문서 (컬러·타이포·컴포넌트) |

## 구조

```
├─ assets/fonts/   로컬 폰트 (CDN 미사용)
├─ uploads/        이미지 (로고·아이콘·일러스트·아바타)
├─ scss/           스타일 소스 (SCSS)
│  ├─ abstracts/   디자인 토큰 (색·그림자, 라이트/다크)
│  ├─ base/        폰트 선언·리셋·언어별 타이포그래피
│  ├─ components/  버튼·카드·배지·폼·드롭다운·모달 …
│  ├─ layout/      사이드바·톱바
│  └─ pages/       페이지 전용 스타일
├─ css/main.css    빌드 결과물 (커밋됨 — 서버는 빌드 없이 서빙)
├─ js/             페이지별 스크립트 (바닐라 JS)
└─ myDev/          개인 개발 노트 (git 서브모듈, 비공개)
```

## 언어별 폰트 (전부 로컬 서빙)

언어를 전환하면 JS가 `<html lang>`을 바꾸고, CSS가 본문 폰트를 자동 전환한다.

| 언어 | lang | 폰트 |
|---|---|---|
| 한국어 | `ko` | Noto Sans KR |
| English | `en` | Roboto |
| 日本語 | `ja` | M PLUS 1p |
| 简体中文 | `zh-Hans` | Noto Sans SC |
| 繁體中文 | `zh-Hant` | Noto Sans TC |

아이콘: Material Symbols Rounded (가변 폰트 1파일).
`<span class="msr msr-20">home</span>` 형태로 쓰며, 크기 유틸리티(`msr-{px}`)는
[scss/components/_icon.scss](scss/components/_icon.scss)의 목록에 있는 값만 생성된다 —
새 크기를 쓰려면 그 목록에 추가할 것.

## 개발

npm은 개발자가 스타일(SCSS)을 수정할 때만 필요하다. 고객 PC에는 아무것도 설치할 필요 없음.
`css/main.css`를 직접 수정하지 말 것 — 반드시 scss 수정 → 빌드 → 커밋.

```bash
npm install        # sass 설치
npm run build      # scss/main.scss → css/main.css (압축)
npm run watch      # 변경 감지 빌드
python -m http.server 8899   # 로컬 미리보기
```

## 납품

`assets/` `css/` `js/` `uploads/` + `index.html` `dashboard.html` `design-system.html` 만 전달하면 된다.
(`scss/` `node_modules/` `package*.json` `myDev/`는 개발용 — 포함해도 동작에는 지장 없음)

