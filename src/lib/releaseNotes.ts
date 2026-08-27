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
