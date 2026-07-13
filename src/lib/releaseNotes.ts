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
  previousVersion: string;
  internalGitHubUrl: string;
};

export const releaseNotes: ReleaseNote[] = [
  {
    appSlug: 'tagweaver',
    appName: 'TagWeaver',
    version: '2.1.3',
    tag: 'v2.1.3',
    platform: 'Android',
    releasedDate: '2026-07-12',
    title: 'TagWeaver v2.1.3',
    summary: 'Public Android store update for TagWeaver 2.1.3.',
    summaryKo: 'TagWeaver 2.1.3 공개 Android 스토어 업데이트입니다.',
    previousVersion: '2.1',
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
    summary: 'Public Android store update for Segra 1.0.2.',
    summaryKo: 'Segra 1.0.2 공개 Android 스토어 업데이트입니다.',
    previousVersion: '1.0.1',
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
