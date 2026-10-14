# OnnelLab App Screenshot Workflow

이 저장소는 OnnelLab 메인 홈과 앱 상세 랜딩페이지 저장소이다.

- 원격: `https://github.com/onnellab/onnellab.github.io.git`
- 로컬 작업 경로: `onnellab.github.io` 체크아웃

## 고정 규칙

- 앱 저장소에서 홍보 이미지 편집본을 새로 만들면 이 저장소의 앱 상세 랜딩페이지와 메인 홈의 대표·추천 이미지도 같은 최신 편집본으로 교체한다.
- 앱별 편집본은 각 앱 저장소의 `tool/{app}_store_promo_template.py` 템플릿으로 만든다.
- 템플릿은 각 앱 저장소의 `tool/{app}_store_promo_template.py` 안에서 자체 완결된 형식으로 유지한다.
- 다른 앱 저장소나 Melivra 저장소를 참조해야만 재생성되는 템플릿 구조는 사용하지 않는다.
- 오른쪽 상단 장식은 ONNELLAB favicon 기반 OL 마크를 사용한다.
- 사이트 favicon도 ONNELLAB OL 마크 형태를 유지하며, 소프트피치/라일락/베이비블루 파스텔 포인트 컬러 계열로 관리한다.
- 스크린샷 교체 후 `npm run build`로 상세 페이지와 이미지 라우트 생성을 확인한다.

## 앱별 연결

| 앱 | 앱 저장소 | 랜딩 slug | 랜딩 스크린샷 경로 |
| --- | --- | --- | --- |
| Aligna | `aligna` | `aligna` | `src/content/apps/aligna/assets/screenshots/{en,ko}` |
| ClipNest | `clipnest` | `clipnest` | `src/content/apps/clipnest/assets/screenshots/{en,ko}` |
| Melivra | `melivra` | `melivra` | `src/content/apps/melivra/assets/screenshots/{en,ko,ja,zh-Hans,zh-Hant,pt-BR,de,fr,es}` |
| Quivra | `quivra` | `quivra` | `src/content/apps/quivra/assets/screenshots/{en,ko}` |
| Segra | `segra` | `segra` | `src/content/apps/segra/assets/screenshots/{en,ko,ja,zh-Hans,zh-Hant,pt-BR,de,fr,es}` (Android 1080×2168) |
| TagWeaver | `tagweaver` | `tagweaver` | `src/content/apps/tagweaver/assets/screenshots/{en,ko}` |
| VaultXT | `onnellab-text/vaultxt` | `vaultxt` | `src/content/apps/vaultxt/assets/screenshots/{en,ko}` |

## OnnelLab Text 메모

OnnelLab Text 저장소는 `onnellab-text` 이다.

하위 앱:

- `flomo`
- `heara`
- `nunote`
- `textoria`
- `vaultxt`

현재 이 랜딩페이지 저장소에 연결된 OnnelLab Text 앱은 `vaultxt`이다. 다른 OnnelLab Text 앱을 노출하려면 먼저 랜딩 slug, 앱 상세 콘텐츠, 원본 스크린샷 자산을 확정한다.

## 교체 절차

1. 앱 저장소에서 최신 편집본을 생성한다.
2. 편집본을 이 저장소의 `src/content/apps/{slug}/assets/screenshots/{locale}`로 복사한다.
3. `npm run build`를 실행한다.
4. 앱 저장소와 이 저장소를 각각 커밋/푸시한다.

## 릴리즈 노트 작성 규칙

- 버전을 올릴 때 앱 상세페이지의 릴리즈 노트와 각 공개 언어의 변경 내역도 함께 갱신한다.
- 릴리즈 노트에는 버전과 사용자에게 보이는 변경 내용만 쓴다. 준비 중·심사 중·출시 예정 등 배포 상태를 문구, 제목, 배지 또는 조건 분기에 넣지 않는다.
- 배포 상태는 작업 기록에서 별도로 관리한다. 공개 릴리즈 노트는 출시 후 상태 문구를 다시 수정할 필요가 없는 형태로 유지한다.
- 앱 상세페이지의 노트 링크는 상태에 따라 바꾸지 않고 공통 현지화된 릴리즈 노트 레이블을 사용한다.

## 검토된 편집본의 상세·메인 홈 공통 선택

- 앱별 `public/release-artwork/{slug}.json` 영수증은 하나의 검토 후보 버전과 소스 커밋을 식별한다. `staged_not_published`는 파일 준비 상태이며 배포 성공을 주장하지 않는다.
- `source_selection.policy`는 `android-edited-then-iphone-edited`이다. 검토된 Android 편집본이 있으면 전체 언어에 같은 Android 후보를 쓰고, 없을 때만 같은 후보의 `iphone_medium` 편집본을 사용한다. 앱 플랫폼 표시는 기존 앱 메타데이터를 유지한다.
- 상세 페이지와 메인 홈은 같은 영수증의 정확한 locale·index 순서를 읽는다. 메인 히어로는 index 1, 대표·추천 카드는 index 2를 사용하며, 하나뿐이면 index 1을 재사용한다. 다른 언어로 대체하지 않는다.
- 모든 파일 SHA-256, 실제 PNG 크기, 파일 목록, 연속 index, 언어별 동일 이미지 수, 플랫폼 종류를 검증한다. 영수증이 있는데 파일·언어·버전 식별 정보가 유효하지 않으면 빌드를 중단한다. 잘못된 편집본을 기존 원본으로 조용히 대체하지 않는다.
- `source_selection`이 없는 구형 영수증도 빌드를 중단한다. 게시 전에 공통 검토 게이트로 소스 선택을 명시한 새 영수증을 생성해야 하며, 영수증만 수동으로 보완하지 않는다.
- 영수증이 아직 없는 앱에만 기존 메인 홈 원본을 `data-home-artwork-source="legacy"`로 명시해서 유지한다. 이는 최신 검토 편집본 반영 완료를 뜻하지 않는다. 검토 편집본은 `reviewed`로 표시하고 전체 디자인이 잘리지 않게 표시한다.
- 이미지 URL의 `?v=`는 실제 이미지 SHA-256이며, HTML width/height도 같은 파일 바이트에서 읽는다. 같은 iPhone 등급 안에서 원본 크기가 달라도 상세 갤러리·썸네일·메인 홈에 이미지별 실제 크기를 사용한다. 정적 파일 경로에는 쿼리를 넣지 않는다.
- 검증: `npm run test:artwork`, `npm run build`, 관련 `tests/home-showcase.spec.ts` 브라우저 테스트. 배포 후에는 영수증·상세 갤러리·메인 홈의 표식과 이미지 바이트를 다시 확인한다.
