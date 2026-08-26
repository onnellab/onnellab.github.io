import type { SiteLocale } from './site-i18n';
import {
  allProductLocaleAlternates,
  allRouteFor,
  isExtendedSiteLocale,
  type AllSiteLocale,
  type ExtendedSiteLocale
} from './extended-site-i18n';
import { getExtendedProductCopy } from './extended-product-localizations';
import { renderBlocks, type ProductCopy, type ProductPageData } from './products';

export type PapiraFaq = {
  question: string;
  answer: string;
};

export type PapiraCopy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  tagline: string;
  heroSignals: string[];
  screenshotAlts: [string, string, string, string, string];
  lead: string;
  statusLabel: string;
  statusValue: string;
  platformsLabel: string;
  platformsValue: string;
  modesTitle: string;
  modes: Array<{ title: string; body: string }>;
  featuresTitle: string;
  features: string[];
  privacyTitle: string;
  privacyItems: string[];
  faqTitle: string;
  faqs: PapiraFaq[];
  privacyLabel: string;
  contactLabel: string;
  homeLabel: string;
  appsLabel: string;
};

const extendedPapiraStatus: Record<ExtendedSiteLocale, string> = {
  'pt-BR': 'Em preparação',
  de: 'In Vorbereitung',
  fr: 'En préparation',
  es: 'En preparación'
};

const extendedPapiraScreenshotAlts: Record<
  ExtendedSiteLocale,
  [string, string, string, string, string]
> = {
  'pt-BR': [
    'Tela inicial do Papira para converter TXT em EPUB',
    'Tela do Papira para escolher o tipo de obra, a capa e a estrutura do texto',
    'Prévia do Papira com capa, sumário e dados do livro',
    'Tela do Papira com detecção de capítulos e prévia do sumário',
    'Tela do Papira para exportar o EPUB e salvá-lo no dispositivo'
  ],
  de: [
    'Papira-Startseite zur Umwandlung von TXT in EPUB',
    'Papira-Auswahl des Werktyps mit Cover- und Textaufbau',
    'Papira-Buchvorschau mit Cover, Inhaltsverzeichnis und Buchdaten',
    'Papira-Kapitelerkennung mit Vorschau des Inhaltsverzeichnisses',
    'Papira-EPUB-Export zum Speichern auf dem Gerät'
  ],
  fr: [
    'Écran d’accueil de Papira pour convertir un TXT en EPUB',
    'Écran Papira pour choisir le type de texte, la couverture et la structure',
    'Aperçu Papira du livre avec couverture, sommaire et informations',
    'Écran Papira de détection des chapitres et d’aperçu du sommaire',
    'Écran Papira d’exportation de l’EPUB vers l’appareil'
  ],
  es: [
    'Pantalla de inicio de Papira para convertir TXT a EPUB',
    'Pantalla de Papira para elegir el tipo de obra, la portada y la estructura del texto',
    'Vista previa de Papira con portada, índice y datos del libro',
    'Pantalla de Papira para detectar capítulos y previsualizar el índice',
    'Pantalla de Papira para exportar el EPUB y guardarlo en el dispositivo'
  ]
};

export function getPapiraProductPageData(locale: AllSiteLocale): ProductPageData {
  if (isExtendedSiteLocale(locale)) {
    const text = getExtendedProductCopy('papira', locale);
    const platformCopy = {
      name: text.subtitle,
      landingSubtitle: text.subtitle,
      landingDescription: text.body,
      description: text.body,
      faq: { title: text.faqTitle, items: text.faq }
    };
    const copy: ProductCopy = { locale, android: platformCopy, ios: platformCopy };
    const meta = {
      title: 'Papira',
      status: extendedPapiraStatus[locale],
      platforms: ['iOS', 'Android'],
      privacy: allRouteFor('papiraPrivacy', locale),
      supportEmail: 'onnellab.app@gmail.com',
      icon: 'assets/icon/Papira.png'
    };
    const featureList =
      (renderBlocks(text.body).find((block) => block.type === 'ul')?.value as string[] | undefined) ?? [];
    return {
      locale,
      source: { slug: 'papira', contentDir: '', meta },
      meta,
      copy,
      canonicalPath: allRouteFor('papira', locale),
      alternates: allProductLocaleAlternates('papira'),
      seoTitle: `Papira - ${text.subtitle}`,
      seoDescription: text.body.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? text.subtitle,
      iconPath: '/app-assets/papira/icon.png',
      socialImagePath: '/app-assets/papira/social-card.png',
      screenshotPaths: ['01', '02', '03', '04', '05'].map(
        (name) => `/app-assets/papira/assets/screenshots/${locale}/${name}.png`
      ),
      screenshotAlts: extendedPapiraScreenshotAlts[locale],
      screenshotDimensions: { width: 1080, height: 2168 },
      schemaFeatureList: featureList,
      accent: { border: '#d7cfdb', background: '#f4eff5', text: '#614f68' }
    };
  }

  const baseLocale = locale as SiteLocale;
  const text = papiraCopy[baseLocale];
  const description = [
    text.lead,
    '',
    `## ${text.modesTitle}`,
    '',
    ...text.modes.flatMap((mode, index) => [`### ${index + 1}. ${mode.title}`, '', mode.body, '']),
    `## ${text.featuresTitle}`,
    '',
    ...text.features.map((feature) => `- ${feature}`),
    '',
    `## ${text.privacyTitle}`,
    '',
    ...text.privacyItems.map((item) => `- ${item}`)
  ].join('\n');
  const platformCopy = {
    name: text.tagline,
    landingSubtitle: text.tagline,
    landingDescription: description,
    description,
    faq: { title: text.faqTitle, items: text.faqs }
  };
  const copy: ProductCopy = { locale: baseLocale, android: platformCopy, ios: platformCopy };
  const meta = {
    title: 'Papira',
    status: text.statusValue,
    platforms: ['iOS', 'Android'],
    privacy: allRouteFor('papiraPrivacy', baseLocale),
    supportEmail: 'onnellab.app@gmail.com',
    icon: 'assets/icon/Papira.png'
  };
  return {
    locale: baseLocale,
    source: { slug: 'papira', contentDir: '', meta },
    meta,
    copy,
    canonicalPath: allRouteFor('papira', baseLocale),
    alternates: allProductLocaleAlternates('papira'),
    seoTitle: text.seoTitle,
    seoDescription: text.seoDescription,
    iconPath: '/app-assets/papira/icon.png',
    socialImagePath: '/app-assets/papira/social-card.png',
    eyebrow: text.eyebrow,
    heroSignals: text.heroSignals,
    screenshotPaths: ['01', '02', '03', '04', '05'].map(
      (name) => `/app-assets/papira/assets/screenshots/${baseLocale}/${name}.png`
    ),
    screenshotAlts: text.screenshotAlts,
    screenshotDimensions: { width: 1080, height: 2168 },
    schemaFeatureList: text.features,
    accent: { border: '#d7cfdb', background: '#f4eff5', text: '#614f68' }
  };
}

export const papiraCopy: Record<SiteLocale, PapiraCopy> = {
  en: {
    seoTitle: 'Papira - Offline TXT to EPUB Maker',
    seoDescription:
      'Turn finished TXT manuscripts into structured EPUB books with a cover, metadata, chapters, and a table of contents. Papira works entirely on your device.',
    eyebrow: 'Offline EPUB maker for writers',
    tagline: 'Turn your manuscript into a book.',
    heroSignals: ['Finished TXT → EPUB', 'Cover, chapters, and TOC', 'Entirely on device'],
    screenshotAlts: [
      'Papira home screen for converting TXT to EPUB',
      'Papira work type screen with cover and body setup',
      'Papira book preview with cover, table of contents, and book details',
      'Papira chapter detection and table of contents preview',
      'Papira EPUB export screen for saving to the device'
    ],
    lead:
      'Papira assembles any finished TXT manuscript into a well-structured EPUB. It includes dedicated flows for fanfiction, serialized fiction, personal novels, digital zines, and TRPG scenarios, while other TXT content can also be converted to EPUB.',
    statusLabel: 'Status',
    statusValue: 'Preparing for release',
    platformsLabel: 'Platforms',
    platformsValue: 'iOS and Android',
    modesTitle: 'Two focused ways to create',
    modes: [
      {
        title: 'Quick EPUB',
        body: 'Choose TXT files and create EPUB files immediately, without cover or publishing metadata.'
      },
      {
        title: 'Book project',
        body: 'Add a cover, title, author, publisher, series information, chapter rules, and a table of contents before export.'
      }
    ],
    featuresTitle: 'Built for finished manuscripts',
    features: [
      'Dedicated presets for fanfiction, serialized fiction, personal novels, digital zines, and TRPG scenarios, with support for other TXT content',
      'Automatic chapter detection, # heading mode, or a single-chapter option',
      'Cover image, book metadata, series information, navigation, and EPUB packaging',
      'Existing files are preserved; name conflicts receive an automatic number',
      'EPUB creation and project storage stay on the device'
    ],
    privacyTitle: 'Your manuscript stays with you',
    privacyItems: [
      'No account or sign-in',
      'No advertising, behavioral analytics, or tracking SDKs',
      'TXT manuscripts and cover images are processed locally',
      'Projects and generated EPUB files are not uploaded to an ONNELLAB server'
    ],
    faqTitle: 'FAQ',
    faqs: [
      {
        question: 'Are manuscripts uploaded to a server?',
        answer: 'No. TXT files, cover images, projects, previews, and generated EPUB files are handled on the device.'
      },
      {
        question: 'Can I edit the manuscript in Papira?',
        answer: 'Papira is for assembling a finished manuscript into EPUB. Edit the source TXT in your preferred writing tool first.'
      },
      {
        question: 'What kinds of works can I prepare?',
        answer: 'Any finished TXT content can be converted to EPUB. The dedicated presets simply make common creative workflows faster.'
      }
    ],
    privacyLabel: 'Privacy Policy',
    contactLabel: 'Contact',
    homeLabel: 'ONNELLAB',
    appsLabel: 'All apps'
  },
  ko: {
    seoTitle: 'Papira - 오프라인 TXT EPUB 제작 도구',
    seoDescription:
      '완성된 TXT 원고를 표지, 책 정보, 챕터와 목차가 있는 EPUB 전자책으로 만들어요. Papira의 모든 작업은 기기 안에서 이루어져요.',
    eyebrow: '작가를 위한 오프라인 EPUB 제작 도구',
    tagline: '원고를 한 권의 책으로 만들어요.',
    heroSignals: ['완성된 TXT → EPUB', '표지·챕터·목차 구성', '모든 작업은 기기 안에서'],
    screenshotAlts: [
      'Papira 홈 화면, TXT 원고를 EPUB으로 변환',
      'Papira 작품 종류 화면, 표지와 본문 구성 선택',
      'Papira 책 미리보기, 표지·목차·책 정보 확인',
      'Papira 챕터 감지와 목차 미리보기 화면',
      'Papira EPUB 내보내기 화면, 기기에 저장'
    ],
    lead:
      'Papira는 완성된 TXT 원고를 정돈된 EPUB 파일로 만들어요. 팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오에 특화된 제작 흐름을 제공하지만, 그 밖의 TXT 콘텐츠도 EPUB으로 변환할 수 있어요.',
    statusLabel: '상태',
    statusValue: '출시 준비 중',
    platformsLabel: '지원 기기',
    platformsValue: 'iOS · Android',
    modesTitle: '두 가지 제작 흐름',
    modes: [
      {
        title: '빠르게 만들기',
        body: 'TXT 파일을 골라 표지와 출판 정보 없이 바로 EPUB 파일로 만들어요.'
      },
      {
        title: '책 프로젝트',
        body: '표지, 제목, 저자, 발행 정보, 시리즈, 챕터 규칙과 목차를 정리한 뒤 내보내요.'
      }
    ],
    featuresTitle: '완성된 원고에 필요한 것만 담았어요',
    features: [
      '팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오에 특화된 작품 유형과 그 밖의 TXT 콘텐츠 지원',
      '자동 챕터 감지, # 제목 모드, 단일 챕터 방식',
      '표지 이미지, 책 정보, 시리즈 정보, 목차와 EPUB 패키징',
      '기존 파일을 덮어쓰지 않고 이름이 겹치면 번호를 자동으로 붙여요',
      'EPUB 제작과 책 프로젝트 저장이 모두 기기 안에서 이루어져요'
    ],
    privacyTitle: '원고는 기기 안에 남아요',
    privacyItems: [
      '계정과 로그인 없이 사용해요',
      '광고·행동 분석·추적 SDK를 사용하지 않아요',
      'TXT 원고와 표지 이미지를 기기 안에서 처리해요',
      '책 프로젝트와 생성한 EPUB을 ONNELLAB 서버에 업로드하지 않아요'
    ],
    faqTitle: '자주 묻는 질문',
    faqs: [
      {
        question: '원고가 서버로 올라가나요?',
        answer: '아니요. TXT, 표지, 책 프로젝트, 미리보기와 생성한 EPUB은 기기 안에서 처리해요.'
      },
      {
        question: 'Papira에서 원고를 수정할 수 있나요?',
        answer: 'Papira는 완성된 원고를 EPUB으로 조립하는 도구예요. 원문 수정은 평소 쓰는 편집기에서 먼저 해요.'
      },
      {
        question: '어떤 작품을 만들 수 있나요?',
        answer: '완성된 TXT 콘텐츠라면 EPUB으로 변환할 수 있어요. 특화된 작품 유형은 자주 쓰는 창작 흐름을 더 빠르게 시작하도록 도와줘요.'
      }
    ],
    privacyLabel: '개인정보 처리방침',
    contactLabel: '문의',
    homeLabel: 'ONNELLAB',
    appsLabel: '모든 앱'
  },
  ja: {
    seoTitle: 'Papira - オフラインTXT・EPUB作成ツール',
    seoDescription:
      '完成したTXT原稿を、表紙・書誌情報・章・目次を備えたEPUBにまとめます。処理はすべて端末内で完結します。',
    eyebrow: '創作者のためのオフラインEPUB作成ツール',
    tagline: '原稿を、一冊の本へ。',
    heroSignals: ['完成したTXT → EPUB', '表紙・章・目次を整理', 'すべて端末内で処理'],
    screenshotAlts: [
      'Papiraのホーム画面、TXT原稿をEPUBに変換',
      'Papiraの作品種類選択画面で、表紙と本文を設定',
      'Papiraで表紙・目次・本の情報を確認するプレビュー画面',
      'Papiraの章タイトル検出と目次プレビュー画面',
      'PapiraでEPUBを書き出して端末に保存する画面'
    ],
    lead:
      'Papiraは完成したTXT原稿を整ったEPUBにまとめます。二次創作・連載小説・オリジナル小説・デジタル小冊子・TRPGシナリオに特化した作成フローを備えていますが、そのほかのTXTコンテンツもEPUBに変換できます。',
    statusLabel: 'ステータス',
    statusValue: 'リリース準備中',
    platformsLabel: '対応端末',
    platformsValue: 'iOS・Android',
    modesTitle: '目的に合わせた二つの作成方法',
    modes: [
      {
        title: 'すぐにEPUB化',
        body: 'TXTファイルを選び、表紙や書誌情報を付けずに、そのままEPUBを作成します。'
      },
      {
        title: '作品EPUBを作成',
        body: '表紙、タイトル、著者、書誌情報、シリーズ、章のルール、目次を整えてから書き出します。'
      }
    ],
    featuresTitle: '完成原稿に必要なものだけ',
    features: [
      '二次創作・連載小説・オリジナル小説・デジタル小冊子・TRPGシナリオに特化した作品タイプと、そのほかのTXTコンテンツへの対応',
      '章の自動検出、「#」見出しモード、単一章モード',
      '表紙画像、書誌情報、シリーズ情報、目次、EPUBパッケージ',
      '既存ファイルを上書きせず、同名の場合は番号を自動付与',
      'EPUB作成とプロジェクト保存は端末内で完結'
    ],
    privacyTitle: '原稿は端末の中に',
    privacyItems: [
      'アカウントやログインは不要',
      '広告・行動分析・追跡SDKは不使用',
      'TXT原稿と表紙画像を端末内で処理',
      'プロジェクトやEPUBをONNELLABのサーバーへ送信しません'
    ],
    faqTitle: 'よくある質問',
    faqs: [
      {
        question: '原稿はサーバーへアップロードされますか？',
        answer: 'いいえ。TXT、表紙、プロジェクト、プレビュー、生成したEPUBは端末内で扱います。'
      },
      {
        question: 'Papiraで原稿を編集できますか？',
        answer: 'Papiraは完成原稿をEPUBにまとめるためのツールです。本文の編集は使い慣れた執筆ツールで先に行ってください。'
      },
      {
        question: 'どのような作品に使えますか？',
        answer: '完成したTXTコンテンツであればEPUBに変換できます。専用プリセットは、よく使う創作フローをすばやく始めるためのものです。'
      }
    ],
    privacyLabel: 'プライバシーポリシー',
    contactLabel: 'お問い合わせ',
    homeLabel: 'ONNELLAB',
    appsLabel: 'すべてのアプリ'
  },
  'zh-Hans': {
    seoTitle: 'Papira - 离线 TXT 转 EPUB 制作工具',
    seoDescription:
      '把完成的 TXT 文稿整理成带封面、书籍信息、章节与目录的 EPUB。所有处理都在设备本地完成。',
    eyebrow: '面向创作者的离线 EPUB 制作工具',
    tagline: '把文稿做成一本书。',
    heroSignals: ['完成的 TXT → EPUB', '整理封面、章节与目录', '全程在设备本地处理'],
    screenshotAlts: [
      'Papira 首页，将 TXT 原稿转换为 EPUB',
      'Papira 作品类型选择界面，用于设置封面与正文',
      'Papira 电子书预览界面，用于查看封面、目录和书籍信息',
      'Papira 章节识别与目录预览界面',
      'Papira EPUB 导出界面，用于保存到设备'
    ],
    lead:
      'Papira 可将完成的 TXT 文稿整理成结构清晰的 EPUB。它特别适合同人文、连载小说、原创小说、数字小册子与 TRPG 剧本，也能将其他 TXT 内容转换为 EPUB。',
    statusLabel: '状态',
    statusValue: '准备发布',
    platformsLabel: '支持平台',
    platformsValue: 'iOS 与 Android',
    modesTitle: '两种简洁的制作方式',
    modes: [
      {
        title: '快速制作',
        body: '选择 TXT 文件，不添加封面与出版信息，直接生成 EPUB。'
      },
      {
        title: '制作作品 EPUB',
        body: '整理封面、标题、作者、出版信息、系列、章节规则与目录后再导出。'
      }
    ],
    featuresTitle: '只保留完成稿真正需要的功能',
    features: [
      '特别适合同人文、连载小说、原创小说、数字小册子与 TRPG 剧本，也支持其他 TXT 内容',
      '自动识别章节、# 标题模式或单章节模式',
      '封面、书籍信息、系列信息、目录与 EPUB 打包',
      '不覆盖已有文件；重名时自动添加编号',
      'EPUB 制作与项目保存均在设备本地完成'
    ],
    privacyTitle: '原稿始终留在你的设备里',
    privacyItems: [
      '无需账号或登录',
      '不使用广告、行为分析或追踪 SDK',
      'TXT 文稿与封面图片在设备本地处理',
      '项目与生成的 EPUB 不会上传到 ONNELLAB 服务器'
    ],
    faqTitle: '常见问题',
    faqs: [
      {
        question: '稿件会上传到服务器吗？',
        answer: '不会。TXT、封面、项目、预览与生成的 EPUB 都在设备本地处理。'
      },
      {
        question: '可以在 Papira 里编辑文稿吗？',
        answer: 'Papira 用于把完成稿整理成 EPUB。请先在常用写作工具中完成正文编辑。'
      },
      {
        question: '适合制作哪些作品？',
        answer: '任何完成的 TXT 内容都可以转换为 EPUB。专用预设只是帮助你更快开始常见的创作流程。'
      }
    ],
    privacyLabel: '隐私政策',
    contactLabel: '联系我们',
    homeLabel: 'ONNELLAB',
    appsLabel: '全部应用'
  },
  'zh-Hant': {
    seoTitle: 'Papira - 離線 TXT 轉 EPUB 製作工具',
    seoDescription:
      '把完成的 TXT 文稿整理成含封面、書籍資訊、章節與目錄的 EPUB。所有處理都在裝置本機完成。',
    eyebrow: '面向創作者的離線 EPUB 製作工具',
    tagline: '把文稿做成一本書。',
    heroSignals: ['完成的 TXT → EPUB', '整理封面、章節與目錄', '全程在裝置本機處理'],
    screenshotAlts: [
      'Papira 首頁，將 TXT 原稿轉換為 EPUB',
      'Papira 作品類型選擇畫面，用於設定封面與內文',
      'Papira 電子書預覽畫面，用於查看封面、目錄與書籍資訊',
      'Papira 章節辨識與目錄預覽畫面',
      'Papira EPUB 匯出畫面，用於儲存到裝置'
    ],
    lead:
      'Papira 可將完成的 TXT 文稿整理成結構清楚的 EPUB。它特別適合同人文、連載小說、原創小說、數位小冊子與 TRPG 劇本，也能將其他 TXT 內容轉換為 EPUB。',
    statusLabel: '狀態',
    statusValue: '準備發布',
    platformsLabel: '支援平台',
    platformsValue: 'iOS 與 Android',
    modesTitle: '兩種簡潔的製作方式',
    modes: [
      {
        title: '快速製作',
        body: '選擇 TXT 檔案，不加入封面與出版資訊，直接產生 EPUB。'
      },
      {
        title: '製作作品 EPUB',
        body: '整理封面、標題、作者、出版資訊、系列、章節規則與目錄後再匯出。'
      }
    ],
    featuresTitle: '只保留完成稿真正需要的功能',
    features: [
      '特別適合同人文、連載小說、原創小說、數位小冊子與 TRPG 劇本，也支援其他 TXT 內容',
      '自動辨識章節、# 標題模式或單章節模式',
      '封面、書籍資訊、系列資訊、目錄與 EPUB 封裝',
      '不覆寫既有檔案；同名時自動加入編號',
      'EPUB 製作與專案儲存都在裝置本機完成'
    ],
    privacyTitle: '原稿始終留在你的裝置裡',
    privacyItems: [
      '不需要帳號或登入',
      '不使用廣告、行為分析或追蹤 SDK',
      'TXT 文稿與封面圖片在裝置本機處理',
      '專案與產生的 EPUB 不會上傳到 ONNELLAB 伺服器'
    ],
    faqTitle: '常見問題',
    faqs: [
      {
        question: '稿件會上傳到伺服器嗎？',
        answer: '不會。TXT、封面、專案、預覽與產生的 EPUB 都在裝置本機處理。'
      },
      {
        question: '可以在 Papira 裡編輯文稿嗎？',
        answer: 'Papira 用來把完成稿整理成 EPUB。請先在慣用的寫作工具中完成正文編輯。'
      },
      {
        question: '適合製作哪些作品？',
        answer: '任何完成的 TXT 內容都可以轉換為 EPUB。專用預設只是協助你更快開始常見的創作流程。'
      }
    ],
    privacyLabel: '隱私權政策',
    contactLabel: '聯絡我們',
    homeLabel: 'ONNELLAB',
    appsLabel: '全部應用程式'
  }
};
