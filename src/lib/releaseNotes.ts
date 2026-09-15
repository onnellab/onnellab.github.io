export type ReleaseNote = {
  appSlug: string;
  appName: string;
  version: string;
  tag: string;
  platform: string;
  releasedDate: string;
  title: string;
  summary: string;
  summaryKo: string;
  changes: string[];
  changesKo: string[];
  internalGitHubUrl: string;
};

export const releaseNotes: ReleaseNote[] = [
  {
    appSlug: 'vaultxt',
    appName: 'VaultXT',
    version: '2.0.0',
    tag: 'v2.0.0',
    platform: 'iOS · Android',
    releasedDate: '2026-09-15',
    title: 'VaultXT v2.0.0 (Android 65 · iOS 64)',
    summary: 'Changes in VaultXT 2.0.0 for iOS and Android.',
    summaryKo: 'VaultXT 2.0.0 iOS·Android 버전의 변경 사항이에요.',
    internalGitHubUrl: 'https://github.com/onnellab/onnellab-text/releases/tag/v2.0.0',
    changes: [
      "Added folders, subfolders and folder colors.",
      "Added tools to split and merge documents.",
      "Now supports nine languages, with easier-to-use Settings.",
      "Fixed some cursor and typing issues in large files, and improved saving when switching documents.",
      "Free: 10 Library documents, 10 open documents, 10 snapshots per document, splits into up to 10 parts and merges of up to 10 documents.",
      "Smaller Android app download.",
      "Requires iOS 15 or later."
    ],
    changesKo: [
      "폴더와 하위 폴더를 만들고 폴더 색상으로 문서를 구분해요.",
      "문서를 나누거나 하나로 합치는 기능을 추가했어요.",
      "9개 언어를 지원하고, 작은 화면이나 큰 글씨에서도 설정을 쓰기 편하게 다듬었어요.",
      "큰 파일에서 커서와 글자 입력에 생기던 일부 문제를 고치고, 문서를 바꿀 때 더 안정적으로 저장하도록 개선했어요.",
      "무료로 문서함 문서와 열린 문서를 각각 10개, 문서별 스냅샷 10개, 최대 10조각 나누기와 문서 10개 합치기를 지원해요.",
      "Android 앱의 다운로드 크기를 줄였어요.",
      "iOS 15 이상에서 사용할 수 있어요."
    ]
  },
  {
    "appSlug": "tagweaver",
    "appName": "TagWeaver",
    "version": "2.5",
    "tag": "v2.5.0",
    "platform": "iOS · Android",
    "releasedDate": "2026-09-07",
    "title": "TagWeaver v2.5",
    "summary": "Changes in TagWeaver 2.5 for iOS and Android.",
    "summaryKo": "TagWeaver 2.5 iOS·Android 버전의 변경 사항이에요.",
    "internalGitHubUrl": "https://github.com/onnellab/tagweaver/commit/d48776bb3942532ea6a6f413494111bb311c70d4",
    "changes": [
      "Find added files by relative folder, local search, path sorting, quick index, or manual order.",
      "Collapse or expand folder sections, preview changes before saving, and number selected tracks sequentially."
    ],
    "changesKo": [
      "직접 추가한 파일을 상대 폴더, 로컬 검색, 경로 정렬, 빠른 색인과 수동 순서로 찾아보세요.",
      "폴더를 접거나 펼치고, 저장 전에 변경 사항을 미리 보고 선택한 트랙 번호를 순서대로 적용할 수 있어요."
    ]
  },
  {
    appSlug: 'tagweaver',
    appName: 'TagWeaver',
    version: '2.3',
    tag: 'v2.3.0',
    platform: 'iOS · Android',
    releasedDate: '2026-08-27',
    title: 'TagWeaver v2.3',
    summary: 'Changes in TagWeaver 2.3 for iOS and Android.',
    summaryKo: 'TagWeaver 2.3 iOS·Android 버전의 변경 사항이에요.',
    internalGitHubUrl: 'https://github.com/onnellab/tagweaver/commit/b58791c056bf811cb30bc9fe32966901a9f39202',
    changes: [
      'Fixed an issue where FLAC cover images might not be saved.',
      'Fixed minor issues and added 7 languages, bringing support to 9 languages in total.'
    ],
    changesKo: [
      'FLAC 파일의 커버 이미지가 저장되지 않을 수 있던 문제를 해결했어요.',
      '사소한 오류를 수정하고 7개 언어를 추가해 총 9개 언어를 지원해요.'
    ]
  },
  {
    appSlug: 'clipnest',
    appName: 'ClipNest',
    version: '1.0.2',
    tag: 'v1.0.2',
    platform: 'iOS',
    releasedDate: '2026-07-13',
    title: 'ClipNest v1.0.2',
    summary: 'Changes in ClipNest 1.0.2 for iOS.',
    summaryKo: 'ClipNest 1.0.2 iOS 버전의 변경 사항이에요.',
    internalGitHubUrl: 'https://github.com/onnellab/clipnest/releases/tag/v1.0.2',
    changes: [
      'Improved keyboard editing handoff.',
      'Fixed clip action menu behavior.',
      'Included stability fixes in version 1.0.2.'
    ],
    changesKo: [
      '키보드 편집 전환 흐름을 개선했습니다.',
      '클립 작업 메뉴 동작을 수정했습니다.',
      '1.0.2 버전에 안정성 수정 사항을 반영했습니다.'
    ]
  },
  {
    appSlug: 'tagweaver',
    appName: 'TagWeaver',
    version: '2.2',
    tag: 'v2.2',
    platform: 'iOS',
    releasedDate: '2026-07-12',
    title: 'TagWeaver v2.2',
    summary: 'Changes in TagWeaver 2.2 for iOS.',
    summaryKo: 'TagWeaver 2.2 iOS 버전의 변경 사항이에요.',
    internalGitHubUrl: 'https://github.com/onnellab/tagweaver/releases/tag/v2.2',
    changes: [
      'Improved overall stability on iOS.',
      'Made everyday tag editing more reliable.'
    ],
    changesKo: [
      'iOS 전반의 안정성을 개선했습니다.',
      '일상적인 태그 편집이 더 안정적으로 동작하도록 다듬었습니다.'
    ]
  },
  {
    appSlug: 'tagweaver',
    appName: 'TagWeaver',
    version: '2.1.3',
    tag: 'v2.1.3',
    platform: 'Android',
    releasedDate: '2026-07-12',
    title: 'TagWeaver v2.1.3',
    summary: 'Changes in TagWeaver 2.1.3 for Android.',
    summaryKo: 'TagWeaver 2.1.3 Android 버전의 변경 사항이에요.',
    internalGitHubUrl: 'https://github.com/onnellab/tagweaver/releases/tag/v2.1.3',
    changes: [
      'Improved Android tag save performance by skipping unchanged writebacks.',
      'Used a faster path for changed basic tag saves.',
      'Added Android write timing checks for large file batches.'
    ],
    changesKo: [
      '변경되지 않은 태그 저장을 건너뛰어 Android 태그 저장 성능을 개선했습니다.',
      '변경된 기본 태그 저장에 더 빠른 경로를 사용했습니다.',
      '대량 파일 작업을 위한 Android 쓰기 시간 점검을 추가했습니다.'
    ]
  },
  {
    appSlug: 'segra',
    appName: 'Segra',
    version: '1.0.2',
    tag: 'v1.0.2',
    platform: 'Android',
    releasedDate: '2026-07-10',
    title: 'Segra v1.0.2',
    summary: 'Changes in Segra 1.0.2 for Android.',
    summaryKo: 'Segra 1.0.2 Android 버전의 변경 사항이에요.',
    internalGitHubUrl: 'https://github.com/onnellab/segra/releases/tag/v1.0.2',
    changes: [
      'Improved Audio Merge list layout.',
      'Fixed merge item numbering.',
      'Stabilized Audio Merge file list rendering.',
      'Adjusted spacing for clearer repeated-use workflows.'
    ],
    changesKo: [
      'Audio Merge 목록 레이아웃을 개선했습니다.',
      '병합 항목 번호 표시를 수정했습니다.',
      'Audio Merge 파일 목록 렌더링을 안정화했습니다.',
      '반복 사용 흐름이 더 명확하게 보이도록 간격을 조정했습니다.'
    ]
  }
];

export function releaseNotePath(note: ReleaseNote): string {
  return `/release-notes/${note.appSlug}/${note.version}/`;
}

export function releaseNoteKoPath(note: ReleaseNote): string {
  return `/release-notes/${note.appSlug}/${note.version}/ko/`;
}

export function getReleaseNote(appSlug: string, version: string): ReleaseNote | undefined {
  return releaseNotes.find((note) => note.appSlug === appSlug && note.version === version);
}

export function latestReleaseNoteForApp(appSlug: string): ReleaseNote | undefined {
  return releaseNotes
    .filter((note) => note.appSlug === appSlug)
    .sort((a, b) => b.releasedDate.localeCompare(a.releasedDate))[0];
}
