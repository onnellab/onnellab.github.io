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
  date: string;
  platform: string;
  changed: string;
  appPage: string;
};

const copy: Record<ReleaseLocale, Record<string, ReleaseCopy>> = {
  ja: {
    'tagweaver/2.3': {
      summary: 'TagWeaver 2.3（iOS / Android）の変更内容です。',
      changes: [
        'FLACファイルのカバー画像が保存されないことがある問題を修正しました。',
        '軽微な不具合を修正し、7言語を追加して、対応言語は合計9言語になりました。'
      ]
    },
    'clipnest/1.0.2': {
      summary: 'ClipNest 1.0.2（iOS）の変更内容です。',
      changes: [
        'キーボードでの編集引き継ぎを改善しました。',
        'クリップ操作メニューの動作を修正しました。',
        'バージョン1.0.2に安定性の修正を反映しました。'
      ]
    },
    'tagweaver/2.2': {
      summary: 'TagWeaver 2.2（iOS）の変更内容です。',
      changes: [
        'iOS 全体の安定性を改善しました。',
        '日常的なタグ編集をより安定して行えるよう調整しました。'
      ]
    },
    'tagweaver/2.1.3': {
      summary: 'TagWeaver 2.1.3（Android）の変更内容です。',
      changes: [
        '変更のない書き戻しを省略して Android のタグ保存性能を改善しました。',
        '変更された基本タグの保存により高速な経路を使用しました。',
        '大量ファイル向けに Android の書き込み時間チェックを追加しました。'
      ]
    },
    'segra/1.0.2': {
      summary: 'Segra 1.0.2（Android）の変更内容です。',
      changes: [
        'Audio Merge のリストレイアウトを改善しました。',
        '結合項目の番号表示を修正しました。',
        'Audio Merge のファイルリスト表示を安定化しました。',
        '繰り返し使う流れが見やすくなるよう余白を調整しました。'
      ]
    }
  },
  'zh-Hans': {
    'tagweaver/2.3': {
      summary: 'TagWeaver 2.3（iOS 和 Android）的变更内容。',
      changes: [
        '修复了 FLAC 文件的封面图片有时无法保存的问题。',
        '修复了若干小问题，并新增 7 种语言，目前共支持 9 种语言。'
      ]
    },
    'clipnest/1.0.2': {
      summary: 'ClipNest 1.0.2（iOS）的变更内容。',
      changes: [
        '改进了键盘编辑交接流程。',
        '修复了剪贴项操作菜单的行为。',
        '在 1.0.2 版本中加入了稳定性修复。'
      ]
    },
    'tagweaver/2.2': {
      summary: 'TagWeaver 2.2（iOS）的变更内容。',
      changes: [
        '提升了 iOS 版的整体稳定性。',
        '让日常标签编辑更加稳定可靠。'
      ]
    },
    'tagweaver/2.1.3': {
      summary: 'TagWeaver 2.1.3（Android）的变更内容。',
      changes: [
        '跳过未更改数据的回写，提高了 Android 标签保存性能。',
        '对已更改的基础标签保存采用更快的处理路径。',
        '为大批量文件加入 Android 写入耗时检查。'
      ]
    },
    'segra/1.0.2': {
      summary: 'Segra 1.0.2（Android）的变更内容。',
      changes: [
        '改进了 Audio Merge 列表布局。',
        '修复了合并项目编号。',
        '提升了 Audio Merge 文件列表渲染的稳定性。',
        '调整了间距，让重复操作流程更清晰。'
      ]
    }
  },
  'zh-Hant': {
    'tagweaver/2.3': {
      summary: 'TagWeaver 2.3（iOS 與 Android）的變更內容。',
      changes: [
        '修正 FLAC 檔案的封面圖片有時無法儲存的問題。',
        '修正一些小問題，並新增 7 種語言，目前共支援 9 種語言。'
      ]
    },
    'clipnest/1.0.2': {
      summary: 'ClipNest 1.0.2（iOS）的變更內容。',
      changes: [
        '改善鍵盤編輯交接流程。',
        '修正剪貼項目操作選單的行為。',
        '在 1.0.2 版本中加入穩定性修正。'
      ]
    },
    'tagweaver/2.2': {
      summary: 'TagWeaver 2.2（iOS）的變更內容。',
      changes: [
        '提升 iOS 版的整體穩定性。',
        '讓日常標籤編輯更加穩定可靠。'
      ]
    },
    'tagweaver/2.1.3': {
      summary: 'TagWeaver 2.1.3（Android）的變更內容。',
      changes: [
        '略過未變更資料的回寫，改善 Android 標籤儲存效能。',
        '已變更的基本標籤儲存採用更快的處理路徑。',
        '為大量檔案加入 Android 寫入耗時檢查。'
      ]
    },
    'segra/1.0.2': {
      summary: 'Segra 1.0.2（Android）的變更內容。',
      changes: [
        '改善 Audio Merge 清單版面。',
        '修正合併項目的編號。',
        '提升 Audio Merge 檔案清單呈現的穩定性。',
        '調整間距，讓重複操作流程更清楚。'
      ]
    }
  },
  'pt-BR': {
    'tagweaver/2.3': {
      summary: 'Alterações do TagWeaver 2.3 para iOS e Android.',
      changes: [
        'Corrigimos um problema que podia impedir o salvamento da capa em arquivos FLAC.',
        'Corrigimos pequenos problemas e adicionamos 7 idiomas, totalizando 9 idiomas compatíveis.'
      ]
    },
    'clipnest/1.0.2': {
      summary: 'Alterações do ClipNest 1.0.2 para iOS.',
      changes: [
        'Melhoramos a transição para edição pelo teclado.',
        'Corrigimos o comportamento do menu de ações dos recortes.',
        'Incluímos correções de estabilidade na versão 1.0.2.'
      ]
    },
    'tagweaver/2.2': {
      summary: 'Alterações do TagWeaver 2.2 para iOS.',
      changes: [
        'Melhoramos a estabilidade geral no iOS.',
        'Deixamos a edição cotidiana de tags mais estável e confiável.'
      ]
    },
    'tagweaver/2.1.3': {
      summary: 'Alterações do TagWeaver 2.1.3 para Android.',
      changes: [
        'Melhoramos o desempenho ao salvar tags no Android evitando regravações sem alteração.',
        'Usamos um caminho mais rápido para salvar tags básicas modificadas.',
        'Adicionamos verificações de tempo de gravação no Android para lotes grandes de arquivos.'
      ]
    },
    'segra/1.0.2': {
      summary: 'Alterações do Segra 1.0.2 para Android.',
      changes: [
        'Melhoramos o layout da lista do Audio Merge.',
        'Corrigimos a numeração dos itens de combinação.',
        'Estabilizamos a renderização da lista de arquivos do Audio Merge.',
        'Ajustamos o espaçamento para deixar fluxos repetidos mais claros.'
      ]
    }
  },
  de: {
    'tagweaver/2.3': {
      summary: 'Änderungen in TagWeaver 2.3 für iOS und Android.',
      changes: [
        'Ein Problem wurde behoben, durch das Coverbilder in FLAC-Dateien möglicherweise nicht gespeichert wurden.',
        'Kleinere Fehler wurden behoben und 7 Sprachen hinzugefügt. Damit werden insgesamt 9 Sprachen unterstützt.'
      ]
    },
    'clipnest/1.0.2': {
      summary: 'Änderungen in ClipNest 1.0.2 für iOS.',
      changes: [
        'Die Übergabe zur Tastaturbearbeitung wurde verbessert.',
        'Das Verhalten des Clip-Aktionsmenüs wurde korrigiert.',
        'In Version 1.0.2 wurden Stabilitätskorrekturen aufgenommen.'
      ]
    },
    'tagweaver/2.2': {
      summary: 'Änderungen in TagWeaver 2.2 für iOS.',
      changes: [
        'Die allgemeine Stabilität unter iOS wurde verbessert.',
        'Die tägliche Tag-Bearbeitung wurde zuverlässiger gemacht.'
      ]
    },
    'tagweaver/2.1.3': {
      summary: 'Änderungen in TagWeaver 2.1.3 für Android.',
      changes: [
        'Die Leistung beim Speichern von Tags unter Android wurde verbessert, indem unveränderte Rückschreibungen übersprungen werden.',
        'Für geänderte Basis-Tags wird ein schnellerer Speicherpfad verwendet.',
        'Für große Dateistapel wurden Prüfungen der Schreibdauer unter Android ergänzt.'
      ]
    },
    'segra/1.0.2': {
      summary: 'Änderungen in Segra 1.0.2 für Android.',
      changes: [
        'Das Layout der Audio-Merge-Liste wurde verbessert.',
        'Die Nummerierung der Zusammenführungselemente wurde korrigiert.',
        'Die Darstellung der Audio-Merge-Dateiliste wurde stabilisiert.',
        'Abstände wurden für klarere wiederholte Arbeitsabläufe angepasst.'
      ]
    }
  },
  fr: {
    'tagweaver/2.3': {
      summary: 'Modifications de TagWeaver 2.3 pour iOS et Android.',
      changes: [
        'Correction d’un problème pouvant empêcher l’enregistrement des pochettes dans les fichiers FLAC.',
        'Correction de problèmes mineurs et ajout de 7 langues, pour un total de 9 langues prises en charge.'
      ]
    },
    'clipnest/1.0.2': {
      summary: 'Modifications de ClipNest 1.0.2 pour iOS.',
      changes: [
        'Amélioration du passage à l’édition via le clavier.',
        'Correction du comportement du menu d’actions des extraits.',
        'La version 1.0.2 intègre des correctifs de stabilité.'
      ]
    },
    'tagweaver/2.2': {
      summary: 'Modifications de TagWeaver 2.2 pour iOS.',
      changes: [
        'Amélioration de la stabilité générale sur iOS.',
        'L’édition courante des tags est désormais plus fiable.'
      ]
    },
    'tagweaver/2.1.3': {
      summary: 'Modifications de TagWeaver 2.1.3 pour Android.',
      changes: [
        'Amélioration des performances d’enregistrement des tags Android en évitant de réécrire les données inchangées.',
        'Utilisation d’un chemin plus rapide pour l’enregistrement des tags de base modifiés.',
        'Ajout de contrôles de temps d’écriture Android pour les lots volumineux.'
      ]
    },
    'segra/1.0.2': {
      summary: 'Modifications de Segra 1.0.2 pour Android.',
      changes: [
        'Amélioration de la disposition de la liste Audio Merge.',
        'Correction de la numérotation des éléments fusionnés.',
        'Stabilisation de l’affichage de la liste des fichiers Audio Merge.',
        'Ajustement des espacements pour rendre les usages répétés plus clairs.'
      ]
    }
  },
  es: {
    'tagweaver/2.3': {
      summary: 'Cambios de TagWeaver 2.3 para iOS y Android.',
      changes: [
        'Corregimos un problema que podía impedir que se guardaran las carátulas en archivos FLAC.',
        'Corregimos problemas menores y añadimos 7 idiomas, para un total de 9 idiomas compatibles.'
      ]
    },
    'clipnest/1.0.2': {
      summary: 'Cambios de ClipNest 1.0.2 para iOS.',
      changes: [
        'Mejoramos la transición a la edición desde el teclado.',
        'Corregimos el comportamiento del menú de acciones de los recortes.',
        'Incluimos correcciones de estabilidad en la versión 1.0.2.'
      ]
    },
    'tagweaver/2.2': {
      summary: 'Cambios de TagWeaver 2.2 para iOS.',
      changes: [
        'Mejoramos la estabilidad general en iOS.',
        'Hicimos más fiable la edición habitual de etiquetas.'
      ]
    },
    'tagweaver/2.1.3': {
      summary: 'Cambios de TagWeaver 2.1.3 para Android.',
      changes: [
        'Mejoramos el rendimiento del guardado de etiquetas en Android omitiendo reescrituras sin cambios.',
        'Usamos una ruta más rápida para guardar etiquetas básicas modificadas.',
        'Añadimos comprobaciones del tiempo de escritura en Android para lotes grandes.'
      ]
    },
    'segra/1.0.2': {
      summary: 'Cambios de Segra 1.0.2 para Android.',
      changes: [
        'Mejoramos la disposición de la lista de Audio Merge.',
        'Corregimos la numeración de los elementos combinados.',
        'Estabilizamos la renderización de la lista de archivos de Audio Merge.',
        'Ajustamos el espaciado para que los flujos repetidos sean más claros.'
      ]
    }
  }
};

export const labels: Record<ReleaseLocale, ReleaseLabels> = {
  ja: {
    titleSuffix: 'リリースノート',
    eyebrow: 'リリースノート',
    date: '日付',
    platform: 'プラットフォーム',
    changed: '変更内容',
    appPage: 'アプリページ'
  },
  'zh-Hans': {
    titleSuffix: '版本说明',
    eyebrow: '版本说明',
    date: '日期',
    platform: '平台',
    changed: '变更内容',
    appPage: '应用页面'
  },
  'zh-Hant': {
    titleSuffix: '版本說明',
    eyebrow: '版本說明',
    date: '日期',
    platform: '平台',
    changed: '變更內容',
    appPage: '應用程式頁面'
  },
  'pt-BR': {
    titleSuffix: 'Notas da versão',
    eyebrow: 'Notas da versão',
    date: 'Data',
    platform: 'Plataforma',
    changed: 'O que mudou',
    appPage: 'Página do app'
  },
  de: {
    titleSuffix: 'Versionshinweise',
    eyebrow: 'Versionshinweise',
    date: 'Datum',
    platform: 'Plattform',
    changed: 'Änderungen',
    appPage: 'App-Seite'
  },
  fr: {
    titleSuffix: 'Notes de version',
    eyebrow: 'Notes de version',
    date: 'Date',
    platform: 'Plateforme',
    changed: 'Modifications',
    appPage: 'Page de l’app'
  },
  es: {
    titleSuffix: 'Notas de la versión',
    eyebrow: 'Notas de la versión',
    date: 'Fecha',
    platform: 'Plataforma',
    changed: 'Cambios',
    appPage: 'Página de la app'
  }
};

export function releaseNoteLocalePath(note: ReleaseNote, locale: ReleaseLocale): string {
  return `/release-notes/${note.appSlug}/${note.version}/${allLocaleDefinitions[locale].pathSegment}/`;
}

export function getExtendedReleaseCopy(note: ReleaseNote, locale: ReleaseLocale): ReleaseCopy {
  const result = copy[locale][`${note.appSlug}/${note.version}`];
  if (!result) throw new Error(`Missing release-note localization: ${locale}/${note.appSlug}/${note.version}`);
  return result;
}
