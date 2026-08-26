import type { ReleaseNote } from './releaseNotes';
import type { TranslatedPrivacyLocale } from './app-privacy-localizations';
import { allLocaleDefinitions } from './extended-site-i18n';

export type ReleaseLocale = TranslatedPrivacyLocale;

type ReleaseCopy = {
  summary: string;
  changes: string[];
};

type ReleaseLabels = {
  titleSuffix: string;
  eyebrow: string;
  released: string;
  platform: string;
  previous: string;
  changed: string;
  compatibility: string;
  compatibilityText: (app: string) => string;
  upgrade: string;
  upgradeText: string;
  appPage: string;
};

const copy: Record<ReleaseLocale, Record<string, ReleaseCopy>> = {
  ja: {
    'clipnest/1.0.2': { summary: 'ClipNest 1.0.2 の公開 iOS ストアアップデートです。', changes: ['キーボードでの編集引き継ぎを改善しました。','クリップ操作メニューの動作を修正しました。','公開 1.0.2 リリースに App Store 向けの安定性修正を含めました。'] },
    'tagweaver/2.2': { summary: 'TagWeaver 2.2 の公開 iOS ストアアップデートです。', changes: ['iOS 全体の安定性を改善しました。','日常的なタグ編集をより安定して行えるよう調整しました。'] },
    'tagweaver/2.1.3': { summary: 'TagWeaver 2.1.3 の公開 Android ストアアップデートです。', changes: ['変更のない書き戻しを省略して Android のタグ保存性能を改善しました。','変更された基本タグの保存により高速な経路を使用しました。','大量ファイル向けに Android の書き込み時間チェックを追加しました。'] },
    'segra/1.0.2': { summary: 'Segra 1.0.2 の公開 Android ストアアップデートです。', changes: ['Audio Merge のリストレイアウトを改善しました。','結合項目の番号表示を修正しました。','Audio Merge のファイルリスト表示を安定化しました。','繰り返し使う流れが見やすくなるよう余白を調整しました。'] }
  },
  'zh-Hans': {
    'clipnest/1.0.2': { summary: 'ClipNest 1.0.2 的公开 iOS 商店更新。', changes: ['改进了键盘编辑交接流程。','修复了剪贴项操作菜单的行为。','公开 1.0.2 版本包含 App Store 稳定性修复。'] },
    'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公开 iOS 商店更新。', changes: ['提升了 iOS 版的整体稳定性。','让日常标签编辑更加稳定可靠。'] },
    'tagweaver/2.1.3': { summary: 'TagWeaver 2.1.3 的公开 Android 商店更新。', changes: ['跳过未更改数据的回写，提高了 Android 标签保存性能。','对已更改的基础标签保存采用更快的处理路径。','为大批量文件加入 Android 写入耗时检查。'] },
    'segra/1.0.2': { summary: 'Segra 1.0.2 的公开 Android 商店更新。', changes: ['改进了 Audio Merge 列表布局。','修复了合并项目编号。','提升了 Audio Merge 文件列表渲染的稳定性。','调整了间距，让重复操作流程更清晰。'] }
  },
  'zh-Hant': {
    'clipnest/1.0.2': { summary: 'ClipNest 1.0.2 的公開 iOS 商店更新。', changes: ['改善鍵盤編輯交接流程。','修正剪貼項目操作選單的行為。','公開 1.0.2 版本包含 App Store 穩定性修正。'] },
    'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公開 iOS 商店更新。', changes: ['提升 iOS 版的整體穩定性。','讓日常標籤編輯更加穩定可靠。'] },
    'tagweaver/2.1.3': { summary: 'TagWeaver 2.1.3 的公開 Android 商店更新。', changes: ['略過未變更資料的回寫，改善 Android 標籤儲存效能。','已變更的基本標籤儲存採用更快的處理路徑。','為大量檔案加入 Android 寫入耗時檢查。'] },
    'segra/1.0.2': { summary: 'Segra 1.0.2 的公開 Android 商店更新。', changes: ['改善 Audio Merge 清單版面。','修正合併項目的編號。','提升 Audio Merge 檔案清單呈現的穩定性。','調整間距，讓重複操作流程更清楚。'] }
  },
  'pt-BR': {
    'clipnest/1.0.2': { summary: 'Atualização pública do ClipNest 1.0.2 na App Store para iOS.', changes: ['Melhoramos a transição para edição pelo teclado.','Corrigimos o comportamento do menu de ações dos recortes.','Incluímos correções de estabilidade da App Store na versão pública 1.0.2.'] },
    'tagweaver/2.2': { summary: 'Atualização pública do TagWeaver 2.2 na App Store para iOS.', changes: ['Melhoramos a estabilidade geral no iOS.','Deixamos a edição cotidiana de tags mais estável e confiável.'] },
    'tagweaver/2.1.3': { summary: 'Atualização pública do TagWeaver 2.1.3 no Google Play para Android.', changes: ['Melhoramos o desempenho ao salvar tags no Android evitando regravações sem alteração.','Usamos um caminho mais rápido para salvar tags básicas modificadas.','Adicionamos verificações de tempo de gravação no Android para lotes grandes de arquivos.'] },
    'segra/1.0.2': { summary: 'Atualização pública do Segra 1.0.2 no Google Play para Android.', changes: ['Melhoramos o layout da lista do Audio Merge.','Corrigimos a numeração dos itens de combinação.','Estabilizamos a renderização da lista de arquivos do Audio Merge.','Ajustamos o espaçamento para deixar fluxos repetidos mais claros.'] }
  },
  de: {
    'clipnest/1.0.2': { summary: 'Öffentliches iOS-Store-Update für ClipNest 1.0.2.', changes: ['Die Übergabe zur Tastaturbearbeitung wurde verbessert.','Das Verhalten des Clip-Aktionsmenüs wurde korrigiert.','Stabilitätskorrekturen für die öffentliche App-Store-Version 1.0.2 wurden aufgenommen.'] },
    'tagweaver/2.2': { summary: 'Öffentliches iOS-Store-Update für TagWeaver 2.2.', changes: ['Die allgemeine Stabilität unter iOS wurde verbessert.','Die tägliche Tag-Bearbeitung wurde zuverlässiger gemacht.'] },
    'tagweaver/2.1.3': { summary: 'Öffentliches Android-Store-Update für TagWeaver 2.1.3.', changes: ['Die Leistung beim Speichern von Tags unter Android wurde verbessert, indem unveränderte Rückschreibungen übersprungen werden.','Für geänderte Basis-Tags wird ein schnellerer Speicherpfad verwendet.','Für große Dateistapel wurden Prüfungen der Schreibdauer unter Android ergänzt.'] },
    'segra/1.0.2': { summary: 'Öffentliches Android-Store-Update für Segra 1.0.2.', changes: ['Das Layout der Audio-Merge-Liste wurde verbessert.','Die Nummerierung der Zusammenführungselemente wurde korrigiert.','Die Darstellung der Audio-Merge-Dateiliste wurde stabilisiert.','Abstände wurden für klarere wiederholte Arbeitsabläufe angepasst.'] }
  },
  fr: {
    'clipnest/1.0.2': { summary: 'Mise à jour publique iOS de ClipNest 1.0.2 sur l’App Store.', changes: ['Amélioration du passage à l’édition via le clavier.','Correction du comportement du menu d’actions des extraits.','Ajout de correctifs de stabilité App Store pour la version publique 1.0.2.'] },
    'tagweaver/2.2': { summary: 'Mise à jour publique iOS de TagWeaver 2.2 sur l’App Store.', changes: ['Amélioration de la stabilité générale sur iOS.','L’édition courante des tags est désormais plus fiable.'] },
    'tagweaver/2.1.3': { summary: 'Mise à jour publique Android de TagWeaver 2.1.3.', changes: ['Amélioration des performances d’enregistrement des tags Android en évitant de réécrire les données inchangées.','Utilisation d’un chemin plus rapide pour l’enregistrement des tags de base modifiés.','Ajout de contrôles de temps d’écriture Android pour les lots volumineux.'] },
    'segra/1.0.2': { summary: 'Mise à jour publique Android de Segra 1.0.2.', changes: ['Amélioration de la disposition de la liste Audio Merge.','Correction de la numérotation des éléments fusionnés.','Stabilisation de l’affichage de la liste des fichiers Audio Merge.','Ajustement des espacements pour rendre les usages répétés plus clairs.'] }
  },
  es: {
    'clipnest/1.0.2': { summary: 'Actualización pública de ClipNest 1.0.2 para iOS en la App Store.', changes: ['Mejoramos la transición a la edición desde el teclado.','Corregimos el comportamiento del menú de acciones de los recortes.','Incluimos correcciones de estabilidad de la App Store en la versión pública 1.0.2.'] },
    'tagweaver/2.2': { summary: 'Actualización pública de TagWeaver 2.2 para iOS en la App Store.', changes: ['Mejoramos la estabilidad general en iOS.','Hicimos más fiable la edición habitual de etiquetas.'] },
    'tagweaver/2.1.3': { summary: 'Actualización pública de TagWeaver 2.1.3 para Android.', changes: ['Mejoramos el rendimiento del guardado de etiquetas en Android omitiendo reescrituras sin cambios.','Usamos una ruta más rápida para guardar etiquetas básicas modificadas.','Añadimos comprobaciones del tiempo de escritura en Android para lotes grandes.'] },
    'segra/1.0.2': { summary: 'Actualización pública de Segra 1.0.2 para Android.', changes: ['Mejoramos la disposición de la lista de Audio Merge.','Corregimos la numeración de los elementos combinados.','Estabilizamos la renderización de la lista de archivos de Audio Merge.','Ajustamos el espaciado para que los flujos repetidos sean más claros.'] }
  }
};

export const labels: Record<ReleaseLocale, ReleaseLabels> = {
  ja: { titleSuffix:'リリースノート',eyebrow:'リリースノート',released:'公開日',platform:'プラットフォーム',previous:'前の公開バージョン',changed:'変更内容',compatibility:'互換性',compatibilityText:(a)=>`このアップデートは ${a} の公開アプリストア掲載を通じて配信されます。`,upgrade:'アップデートについて',upgradeText:'特別なアップデート手順は必要ありません。',appPage:'アプリページ' },
  'zh-Hans': { titleSuffix:'版本说明',eyebrow:'版本说明',released:'发布日期',platform:'平台',previous:'上一公开版本',changed:'变更内容',compatibility:'兼容性',compatibilityText:(a)=>`此更新通过 ${a} 的公开应用商店页面分发。`,upgrade:'更新说明',upgradeText:'无需特殊更新步骤。',appPage:'应用页面' },
  'zh-Hant': { titleSuffix:'版本說明',eyebrow:'版本說明',released:'發布日期',platform:'平台',previous:'上一公開版本',changed:'變更內容',compatibility:'相容性',compatibilityText:(a)=>`此更新透過 ${a} 的公開應用程式商店頁面提供。`,upgrade:'更新說明',upgradeText:'不需要特殊更新步驟。',appPage:'應用程式頁面' },
  'pt-BR': { titleSuffix:'Notas da versão',eyebrow:'Notas da versão',released:'Lançamento',platform:'Plataforma',previous:'Versão pública anterior',changed:'O que mudou',compatibility:'Compatibilidade',compatibilityText:(a)=>`Esta atualização é distribuída pela página pública de ${a} na loja de aplicativos.`,upgrade:'Como atualizar',upgradeText:'Não é necessário nenhum procedimento especial de atualização.',appPage:'Página do app' },
  de: { titleSuffix:'Versionshinweise',eyebrow:'Versionshinweise',released:'Veröffentlicht',platform:'Plattform',previous:'Vorherige öffentliche Version',changed:'Änderungen',compatibility:'Kompatibilität',compatibilityText:(a)=>`Dieses Update wird über den öffentlichen App-Store-Eintrag von ${a} verteilt.`,upgrade:'Update-Hinweise',upgradeText:'Es sind keine besonderen Update-Schritte erforderlich.',appPage:'App-Seite' },
  fr: { titleSuffix:'Notes de version',eyebrow:'Notes de version',released:'Publication',platform:'Plateforme',previous:'Version publique précédente',changed:'Modifications',compatibility:'Compatibilité',compatibilityText:(a)=>`Cette mise à jour est distribuée via la fiche publique de ${a} dans la boutique d’applications.`,upgrade:'Mise à jour',upgradeText:'Aucune procédure spéciale de mise à jour n’est nécessaire.',appPage:'Page de l’app' },
  es: { titleSuffix:'Notas de la versión',eyebrow:'Notas de la versión',released:'Publicación',platform:'Plataforma',previous:'Versión pública anterior',changed:'Cambios',compatibility:'Compatibilidad',compatibilityText:(a)=>`Esta actualización se distribuye mediante la ficha pública de ${a} en la tienda de aplicaciones.`,upgrade:'Cómo actualizar',upgradeText:'No se necesita ningún procedimiento especial de actualización.',appPage:'Página de la app' }
};

export function releaseNoteLocalePath(note: ReleaseNote, locale: ReleaseLocale): string {
  return `/release-notes/${note.appSlug}/${note.version}/${allLocaleDefinitions[locale].pathSegment}/`;
}

export function getExtendedReleaseCopy(note: ReleaseNote, locale: ReleaseLocale): ReleaseCopy {
  const result = copy[locale][`${note.appSlug}/${note.version}`];
  if (!result) throw new Error(`Missing release-note localization: ${locale}/${note.appSlug}/${note.version}`);
  return result;
}
