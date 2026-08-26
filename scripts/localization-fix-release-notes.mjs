import { replaceExact } from './utils.mjs';

replaceExact(
  'src/lib/releaseNotes.ts',
  `    changes: [
      'Improved stability for the public iOS 2.2 release.',
      'Kept the notes scoped to App Store-visible stability fixes.',
      'Excluded private-test-only and local build metadata changes from the public notes.'
    ],
    changesKo: [
      '공개 iOS 2.2 릴리즈의 안정성을 개선했습니다.',
      'App Store에 공개된 안정성 수정 범위로 릴리즈 노트를 한정했습니다.',
      '비공개 테스트 전용 변경과 로컬 빌드 메타데이터 변경은 공개 노트에서 제외했습니다.'
    ]`,
  `    changes: [
      'Improved overall stability on iOS.',
      'Made everyday tag editing more reliable.'
    ],
    changesKo: [
      'iOS 전반의 안정성을 개선했습니다.',
      '일상적인 태그 편집이 더 안정적으로 동작하도록 다듬었습니다.'
    ]`
);

const localizedBlocks = [
  [
    "'tagweaver/2.2': { summary: 'TagWeaver 2.2 の公開 iOS ストアアップデートです。', changes: ['公開 iOS 2.2 リリースの安定性を改善しました。','リリースノートを App Store に公開される安定性修正の範囲に限定しました。','非公開テスト専用の変更とローカルビルドのメタデータ変更は公開ノートから除外しました。'] }",
    "'tagweaver/2.2': { summary: 'TagWeaver 2.2 の公開 iOS ストアアップデートです。', changes: ['iOS 全体の安定性を改善しました。','日常的なタグ編集をより安定して行えるよう調整しました。'] }"
  ],
  [
    "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公开 iOS 商店更新。', changes: ['提升了公开 iOS 2.2 版本的稳定性。','发布说明仅保留 App Store 可见的稳定性修复。','公开说明不包含仅用于私有测试的更改和本地构建元数据更改。'] }",
    "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公开 iOS 商店更新。', changes: ['提升了 iOS 版的整体稳定性。','让日常标签编辑更加稳定可靠。'] }"
  ],
  [
    "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公開 iOS 商店更新。', changes: ['提升公開 iOS 2.2 版本的穩定性。','版本說明僅保留 App Store 可見的穩定性修正。','公開說明不包含僅用於私人測試的變更與本機建置中繼資料變更。'] }",
    "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公開 iOS 商店更新。', changes: ['提升 iOS 版的整體穩定性。','讓日常標籤編輯更加穩定可靠。'] }"
  ],
  [
    "'tagweaver/2.2': { summary: 'Atualização pública do TagWeaver 2.2 na App Store para iOS.', changes: ['Melhoramos a estabilidade da versão pública 2.2 para iOS.','Mantivemos as notas restritas às correções de estabilidade visíveis na App Store.','Alterações exclusivas de testes privados e metadados de build local não foram incluídos nas notas públicas.'] }",
    "'tagweaver/2.2': { summary: 'Atualização pública do TagWeaver 2.2 na App Store para iOS.', changes: ['Melhoramos a estabilidade geral no iOS.','Deixamos a edição cotidiana de tags mais estável e confiável.'] }"
  ],
  [
    "'tagweaver/2.2': { summary: 'Öffentliches iOS-Store-Update für TagWeaver 2.2.', changes: ['Die Stabilität der öffentlichen iOS-Version 2.2 wurde verbessert.','Die Versionshinweise bleiben auf öffentlich sichtbare App-Store-Stabilitätskorrekturen beschränkt.','Änderungen nur für private Tests und lokale Build-Metadaten wurden aus den öffentlichen Hinweisen ausgeschlossen.'] }",
    "'tagweaver/2.2': { summary: 'Öffentliches iOS-Store-Update für TagWeaver 2.2.', changes: ['Die allgemeine Stabilität unter iOS wurde verbessert.','Die tägliche Tag-Bearbeitung wurde zuverlässiger gemacht.'] }"
  ],
  [
    "'tagweaver/2.2': { summary: 'Mise à jour publique iOS de TagWeaver 2.2 sur l’App Store.', changes: ['Amélioration de la stabilité de la version publique iOS 2.2.','Les notes restent limitées aux correctifs de stabilité visibles sur l’App Store.','Les changements réservés aux tests privés et les métadonnées de build local sont exclus des notes publiques.'] }",
    "'tagweaver/2.2': { summary: 'Mise à jour publique iOS de TagWeaver 2.2 sur l’App Store.', changes: ['Amélioration de la stabilité générale sur iOS.','L’édition courante des tags est désormais plus fiable.'] }"
  ],
  [
    "'tagweaver/2.2': { summary: 'Actualización pública de TagWeaver 2.2 para iOS en la App Store.', changes: ['Mejoramos la estabilidad de la versión pública 2.2 para iOS.','Limitamos las notas a las correcciones de estabilidad visibles en la App Store.','Los cambios exclusivos de pruebas privadas y los metadatos de compilación local no se incluyen en las notas públicas.'] }",
    "'tagweaver/2.2': { summary: 'Actualización pública de TagWeaver 2.2 para iOS en la App Store.', changes: ['Mejoramos la estabilidad general en iOS.','Hicimos más fiable la edición habitual de etiquetas.'] }"
  ]
];

for (const [from, to] of localizedBlocks) {
  replaceExact('src/lib/extended-release-localizations.ts', from, to);
}
