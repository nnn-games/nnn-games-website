# 프로젝트 관리 가이드

## 개요
이 가이드는 NNN Games 웹사이트에서 프로젝트를 쉽게 추가, 수정, 관리할 수 있도록 하는 방법을 설명합니다.

## 파일 구조
```
js/
├── projects-data.js      # 모든 프로젝트 데이터
├── project-renderer.js   # 프로젝트 렌더링 함수들
├── i18n.js              # 다국어 지원
└── main.js              # 메인 스크립트
```

## 1. 새로운 프로젝트 추가하기

### 1-1. projects-data.js 수정
`js/projects-data.js` 파일을 열고 다음 단계를 따르세요:

#### Step 1: 새 프로젝트 객체 생성
```javascript
{
    id: 'unique-project-id',           // 고유한 프로젝트 ID
    title: {
        ko: '한국어 제목',
        en: 'English Title',
        ja: '日本語タイトル'
    },
    description: {
        ko: '한국어 설명',
        en: 'English Description', 
        ja: '日本語説明'
    },
    image: 'images/project-preview.jpg',    // 프리뷰 이미지 경로
    detailPage: 'project-detail.html',      // 상세 페이지 경로
    category: 'zepeto|roblox|unity|other',  // 카테고리
    status: 'active|development|completed|paused', // 상태
    featured: true|false,                   // 메인 페이지 노출 여부
    launchDate: '2024-12',                 // 출시일
    platform: 'ZEPETO',                   // 플랫폼
    client: '클라이언트명',                 // 클라이언트
    technologies: ['기술1', '기술2']        // 사용 기술
}
```

#### Step 2: projectsData.all 배열에 추가
```javascript
projectsData.all.push(새프로젝트객체);
```

#### Step 3: 메인 페이지 노출을 원하는 경우
```javascript
// featured: true로 설정하고
projectsData.featured.push(새프로젝트객체);
```

### 1-2. 이미지 파일 추가
- `images/` 폴더에 프로젝트 프리뷰 이미지 추가
- 권장 크기: 800x600px
- 파일 형식: JPG, PNG, WebP

### 1-3. 상세 페이지 생성 (선택사항)
- `project-detail.html` 형식으로 상세 페이지 생성
- 기존 `project-alpha.html` 파일을 참고하여 작성

## 2. 기존 프로젝트 수정하기

### 2-1. 프로젝트 정보 수정
```javascript
// projects-data.js에서 해당 프로젝트 찾아서 수정
const project = projectsData.all.find(p => p.id === '프로젝트ID');
project.title.ko = '새로운 제목';
project.description.ko = '새로운 설명';
// 기타 필드 수정...
```

### 2-2. 프로그래밍 방식으로 수정
```javascript
// JavaScript 콘솔에서 실행 가능
ProjectManager.updateProject('프로젝트ID', {
    title: {
        ko: '새로운 제목',
        en: 'New Title'
    },
    status: 'completed'
});
```

## 3. 프로젝트 상태 관리

### 상태 종류
- `active`: 진행 중인 프로젝트
- `development`: 개발 중인 프로젝트  
- `completed`: 완료된 프로젝트
- `paused`: 일시 중단된 프로젝트

### 카테고리 종류
- `zepeto`: ZEPETO 플랫폼 프로젝트
- `roblox`: Roblox 플랫폼 프로젝트
- `unity`: Unity 엔진 프로젝트
- `other`: 기타 프로젝트

## 4. 다국어 지원

### 새로운 언어 추가 시
각 프로젝트의 `title`과 `description` 객체에 새 언어 코드 추가:

```javascript
title: {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文'  // 새 언어 추가
}
```

## 5. 메인 페이지 프로젝트 관리

### 메인 페이지에 표시할 프로젝트 선택
1. `featured: true` 설정
2. `projectsData.featured` 배열에 포함
3. 최대 3개 권장 (모바일 최적화)

### 표시 순서 변경
`projectsData.featured` 배열의 순서를 변경하면 메인 페이지 표시 순서가 변경됩니다.

## 6. 자동화 함수 사용법

### JavaScript 콘솔에서 사용 가능한 함수들

```javascript
// 새 프로젝트 추가
ProjectManager.addProject({
    id: 'new-project',
    title: { ko: '새 프로젝트' },
    description: { ko: '새 프로젝트 설명' },
    category: 'zepeto',
    status: 'development'
});

// 프로젝트 정보 가져오기
const project = ProjectManager.getProject('project-id');

// 카테고리별 프로젝트 가져오기
const zepetoProjects = ProjectManager.getProjectsByCategory('zepeto');

// 상태별 프로젝트 가져오기
const activeProjects = ProjectManager.getProjectsByStatus('active');

// 페이지 다시 렌더링
ProjectRenderer.renderFeaturedProjects();
ProjectRenderer.renderAllProjects();
```

## 7. 문제 해결

### 프로젝트가 표시되지 않는 경우
1. `projects-data.js` 문법 오류 확인
2. 이미지 경로 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. 캐시 삭제 후 새로고침

### 이미지가 로드되지 않는 경우
1. 이미지 파일 경로 확인
2. 파일 이름 대소문자 확인
3. 이미지 파일 존재 여부 확인

### 다국어가 표시되지 않는 경우
1. 언어 코드 확인 (ko, en, ja)
2. `i18n.js`의 언어 설정 확인
3. HTML의 `lang` 속성 확인

## 8. 베스트 프랙티스

### 프로젝트 ID 명명 규칙
- 소문자 사용
- 하이픈(-) 구분자 사용
- 의미있는 이름 사용
- 예: `zepeto-train-world`, `roblox-music-game`

### 이미지 최적화
- 적절한 크기로 리사이즈 (800x600px 권장)
- WebP 형식 사용 고려
- 파일 크기 최소화 (100KB 이하 권장)

### 설명 작성 가이드
- 간결하고 명확하게 작성
- 2-3줄 이내로 제한
- 프로젝트의 핵심 가치 강조

---

이 가이드를 따라하면 쉽게 프로젝트를 관리할 수 있습니다. 추가 질문이나 도움이 필요한 경우 개발팀에 문의해주세요.