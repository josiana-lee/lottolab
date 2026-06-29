---
name: dev-check
description: 확인! 입력 시 dev 서버 실행
trigger: 확인!
---

**모든 작업은 DESIGN.md 기준으로 진행한다.**
구현 전 DESIGN.md를 확인하여 디자인 원칙, 컬러 시스템, 컴포넌트 규칙을 따른다.

**커밋 메시지 규칙**
커밋 시 반드시 작업한 내역을 간단하게 한 줄 이상 포함한다.
- 형식: `type: 작업 내용 요약`
- type 예시: feat(기능 추가), fix(버그 수정), refactor(리팩토링), design(디자인), docs(문서), chore(기타)
- 예시: `feat: 번호쌍 동반 출현 차트 추가 (TOP 10)`

1. 3000번 포트 기존 프로세스 종료: `lsof -ti:3000 | xargs kill -9 2>/dev/null || true`
2. `npm run dev` 백그라운드 실행
