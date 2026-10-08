import type { AllSiteLocale } from './extended-site-i18n';

type BlogCopy = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  apps: string;
  blog: string;
  summary: string;
  relatedApps: string;
  relatedArticles: string;
  relatedArticleLabel: string;
  relatedGuides: string;
  contents: string;
  tags: string;
  published: string;
  updated: string;
  emptyTitle: string;
  emptyText: string;
  categoriesLabel: string;
  postsLabel: string;
  allCategories: string;
  categoryLabels: Record<string, string>;
  categoryDescriptions: Record<'reading' | 'music' | 'productivity' | 'media', string>;
  shortAnswerHeadings: readonly string[];
  faqHeadings: readonly string[];
  relatedTopicHeadings: readonly string[];
};

// One source of localized labels for all nine blog indices and article pages.
// Keep the names and section headers consistent with the real translated Markdown.
export const blogCopy: Record<AllSiteLocale, BlogCopy> = {
  en: {
    title: 'ONNELLAB Blog - Practical guides for calm digital workflows',
    description: 'Educational ONNELLAB articles about reading, music, productivity, media, craft, games, and research workflows.',
    heading: 'Practical Workflow Guides',
    intro: 'Focused articles for calmer reading, music, productivity, and media workflows.',
    apps: 'Apps', blog: 'Blog', summary: 'Summary',
    relatedApps: 'Related apps', relatedArticles: 'Next reading',
    relatedArticleLabel: 'Related article', relatedGuides: 'Related guides',
    contents: 'Contents', tags: 'Tags', published: 'Published', updated: 'Updated',
    emptyTitle: 'Articles are being prepared',
    emptyText: 'Practical guides for reading, music, productivity, and media workflows will appear here as they are published.',
    categoriesLabel: 'Planned topics', postsLabel: 'Published articles', allCategories: 'All',
    categoryLabels: { reading: 'Reading', music: 'Music', productivity: 'Productivity', media: 'Media', craft: 'Craft', games: 'Games', research: 'Research' },
    categoryDescriptions: {
      reading: 'Ways to handle large text and long-form documents calmly',
      music: 'Workflows for audio files and music metadata',
      productivity: 'Methods for reducing repeated file and text work',
      media: 'Practical organization for screenshots, clips, and references'
    },
    shortAnswerHeadings: ['short answer'], faqHeadings: ['faq', 'frequently asked questions'],
    relatedTopicHeadings: ['related topics']
  },
  ko: {
    title: 'ONNELLAB 블로그 - 차분한 디지털 워크플로 가이드',
    description: '읽기, 음악, 생산성, 미디어, 창작, 게임, 리서치 워크플로를 다루는 ONNELLAB 교육형 글입니다.',
    heading: '워크플로 가이드',
    intro: '읽기, 음악, 생산성, 미디어 작업을 차분하게 정리하는 실전 글입니다.',
    apps: '앱', blog: '블로그', summary: '요약',
    relatedApps: '관련 앱', relatedArticles: '다음에 읽을 글',
    relatedArticleLabel: '관련 글', relatedGuides: '관련 가이드',
    contents: '목차', tags: '태그', published: '게시', updated: '수정',
    emptyTitle: '첫 글을 준비하고 있습니다',
    emptyText: '읽기, 음악, 생산성, 미디어 작업을 더 차분하게 정리하는 실전 가이드를 곧 게시합니다.',
    categoriesLabel: '다룰 주제', postsLabel: '게시된 글', allCategories: '전체',
    categoryLabels: { reading: '읽기', music: '음악', productivity: '생산성', media: '미디어', craft: '창작', games: '게임', research: '리서치' },
    categoryDescriptions: {
      reading: '큰 텍스트와 긴 문서를 읽기 쉽게 다루는 방법',
      music: '오디오 파일과 음악 메타데이터를 정리하는 방법',
      productivity: '반복 작업을 줄이고 파일 흐름을 정돈하는 방법',
      media: '스크린샷, 클립, 자료를 잃어버리지 않게 관리하는 방법'
    },
    shortAnswerHeadings: ['짧은 답변', '요약 답변', '핵심 답변', '요약'],
    faqHeadings: ['faq', '자주 묻는 질문'], relatedTopicHeadings: ['관련 주제']
  },
  ja: {
    title: 'ONNELLABブログ - 落ち着いたデジタルワークフローの実践ガイド',
    description: '読書、音楽、生産性、メディア作業を扱うONNELLABの実践記事です。',
    heading: '実践ワークフローガイド',
    intro: '読書、音楽、ファイル、メディア作業を落ち着いて整理するための実用的な記事です。',
    apps: 'アプリ', blog: 'ブログ', summary: '要約',
    relatedApps: '関連アプリ', relatedArticles: '次に読む記事',
    relatedArticleLabel: '関連記事', relatedGuides: '関連ガイド',
    contents: '目次', tags: 'タグ', published: '公開', updated: '更新',
    emptyTitle: '記事を準備しています',
    emptyText: '読書や音楽、ファイル整理に役立つガイドを順次公開します。',
    categoriesLabel: '取り上げるテーマ', postsLabel: '公開済みの記事', allCategories: 'すべて',
    categoryLabels: { reading: '読書', music: '音楽', productivity: '生産性', media: 'メディア', craft: '制作', games: 'ゲーム', research: 'リサーチ' },
    categoryDescriptions: {
      reading: '長い文章や大きなテキストを扱いやすくする方法',
      music: '音声ファイルや音楽メタデータの整理術',
      productivity: '繰り返し作業を減らすファイル整理の工夫',
      media: 'スクリーンショットやクリップ、資料の管理方法'
    },
    shortAnswerHeadings: ['短い答え', '要約'],
    faqHeadings: ['faq', 'よくある質問'], relatedTopicHeadings: ['関連トピック']
  },
  'zh-Hans': {
    title: 'ONNELLAB 博客 - 平静数字工作流实用指南',
    description: '关于阅读、音乐、效率和媒体工作流的 ONNELLAB 实用文章。',
    heading: '实用工作流指南',
    intro: '帮助你更平静地处理阅读、音乐、文件和媒体工作的实用文章。',
    apps: '应用', blog: '博客', summary: '摘要',
    relatedApps: '相关应用', relatedArticles: '延伸阅读',
    relatedArticleLabel: '相关文章', relatedGuides: '相关指南',
    contents: '目录', tags: '标签', published: '发布', updated: '更新',
    emptyTitle: '文章正在准备中',
    emptyText: '更多关于阅读、音乐、文件和媒体的实用指南即将发布。',
    categoriesLabel: '涵盖主题', postsLabel: '已发布文章', allCategories: '全部',
    categoryLabels: { reading: '阅读', music: '音乐', productivity: '效率', media: '媒体', craft: '创作', games: '游戏', research: '研究' },
    categoryDescriptions: {
      reading: '轻松处理长文本和大型文档',
      music: '整理音频文件与音乐元数据',
      productivity: '减少重复操作，让文件井然有序',
      media: '管理截图、片段和参考资料'
    },
    shortAnswerHeadings: ['简短回答', '摘要'],
    faqHeadings: ['faq', '常见问题'], relatedTopicHeadings: ['相关主题']
  },
  'zh-Hant': {
    title: 'ONNELLAB 部落格 - 平靜數位工作流程實用指南',
    description: '關於閱讀、音樂、生產力與媒體工作流程的 ONNELLAB 實用文章。',
    heading: '實用工作流程指南',
    intro: '協助你更平靜地處理閱讀、音樂、檔案與媒體工作的實用文章。',
    apps: '應用程式', blog: '部落格', summary: '摘要',
    relatedApps: '相關應用程式', relatedArticles: '延伸閱讀',
    relatedArticleLabel: '相關文章', relatedGuides: '相關指南',
    contents: '目錄', tags: '標籤', published: '發布', updated: '更新',
    emptyTitle: '文章準備中',
    emptyText: '更多關於閱讀、音樂、檔案與媒體的實用指南即將發布。',
    categoriesLabel: '涵蓋主題', postsLabel: '已發布文章', allCategories: '全部',
    categoryLabels: { reading: '閱讀', music: '音樂', productivity: '生產力', media: '媒體', craft: '創作', games: '遊戲', research: '研究' },
    categoryDescriptions: {
      reading: '更輕鬆地閱讀長篇文字與大型文件',
      music: '整理音訊檔案與音樂中繼資料',
      productivity: '減少重複工作，讓檔案井然有序',
      media: '管理截圖、片段與參考資料'
    },
    shortAnswerHeadings: ['簡短回答', '摘要'],
    faqHeadings: ['faq', '常見問題'], relatedTopicHeadings: ['相關主題']
  },
  'pt-BR': {
    title: 'Blog ONNELLAB - Guias práticos para fluxos digitais mais calmos',
    description: 'Artigos práticos da ONNELLAB sobre leitura, música, produtividade e mídia.',
    heading: 'Guias práticos de fluxo de trabalho',
    intro: 'Artigos focados para organizar leitura, música, arquivos e tarefas de mídia com mais calma.',
    apps: 'Aplicativos', blog: 'Blog', summary: 'Resumo',
    relatedApps: 'Aplicativos relacionados', relatedArticles: 'Próximas leituras',
    relatedArticleLabel: 'Artigo relacionado', relatedGuides: 'Guias relacionados',
    contents: 'Sumário', tags: 'Tags', published: 'Publicado', updated: 'Atualizado',
    emptyTitle: 'Estamos preparando os artigos',
    emptyText: 'Em breve, novos guias sobre leitura, música, arquivos e mídia.',
    categoriesLabel: 'Temas abordados', postsLabel: 'Artigos publicados', allCategories: 'Todos',
    categoryLabels: { reading: 'Leitura', music: 'Música', productivity: 'Produtividade', media: 'Mídia', craft: 'Criação', games: 'Jogos', research: 'Pesquisa' },
    categoryDescriptions: {
      reading: 'Maneiras de lidar com textos e documentos extensos',
      music: 'Organização de arquivos de áudio e metadados musicais',
      productivity: 'Como reduzir tarefas repetitivas e organizar arquivos',
      media: 'Gestão prática de capturas de tela, clipes e referências'
    },
    shortAnswerHeadings: ['resposta curta', 'resumo'],
    faqHeadings: ['faq', 'perguntas frequentes'], relatedTopicHeadings: ['tópicos relacionados']
  },
  de: {
    title: 'ONNELLAB Blog - Praktische Leitfäden für ruhige digitale Abläufe',
    description: 'Praktische ONNELLAB-Artikel zu Lesen, Musik, Produktivität und Medien.',
    heading: 'Praktische Workflow-Leitfäden',
    intro: 'Fokussierte Artikel für ruhigere Abläufe bei Lesen, Musik, Dateien und Medien.',
    apps: 'Apps', blog: 'Blog', summary: 'Zusammenfassung',
    relatedApps: 'Passende Apps', relatedArticles: 'Weiterlesen',
    relatedArticleLabel: 'Passender Artikel', relatedGuides: 'Weitere Anleitungen',
    contents: 'Inhalt', tags: 'Schlagwörter', published: 'Veröffentlicht', updated: 'Aktualisiert',
    emptyTitle: 'Artikel sind in Vorbereitung',
    emptyText: 'Praktische Anleitungen zu Lesen, Musik, Dateien und Medien folgen in Kürze.',
    categoriesLabel: 'Themen', postsLabel: 'Veröffentlichte Artikel', allCategories: 'Alle',
    categoryLabels: { reading: 'Lesen', music: 'Musik', productivity: 'Produktivität', media: 'Medien', craft: 'Kreatives', games: 'Spiele', research: 'Recherche' },
    categoryDescriptions: {
      reading: 'Große Texte und lange Dokumente besser handhaben',
      music: 'Audiodateien und Musik-Metadaten organisieren',
      productivity: 'Wiederholte Arbeit reduzieren und Dateien ordnen',
      media: 'Screenshots, Clips und Referenzen im Blick behalten'
    },
    shortAnswerHeadings: ['kurzantwort', 'zusammenfassung'],
    faqHeadings: ['faq', 'häufige fragen'], relatedTopicHeadings: ['verwandte themen']
  },
  fr: {
    title: 'Blog ONNELLAB - Guides pratiques pour des flux numériques plus calmes',
    description: 'Articles pratiques ONNELLAB sur la lecture, la musique, la productivité et les médias.',
    heading: 'Guides pratiques de workflow',
    intro: 'Des articles ciblés pour organiser plus sereinement lecture, musique, fichiers et médias.',
    apps: 'Applications', blog: 'Blog', summary: 'En bref',
    relatedApps: 'Applications associées', relatedArticles: 'À lire ensuite',
    relatedArticleLabel: 'Article associé', relatedGuides: 'Guides associés',
    contents: 'Sommaire', tags: 'Mots-clés', published: 'Publié', updated: 'Mis à jour',
    emptyTitle: 'Les articles sont en préparation',
    emptyText: 'De nouveaux guides sur la lecture, la musique, les fichiers et les médias arrivent bientôt.',
    categoriesLabel: 'Sujets abordés', postsLabel: 'Articles publiés', allCategories: 'Tous',
    categoryLabels: { reading: 'Lecture', music: 'Musique', productivity: 'Productivité', media: 'Médias', craft: 'Création', games: 'Jeux', research: 'Recherche' },
    categoryDescriptions: {
      reading: 'Mieux gérer les longs textes et les documents volumineux',
      music: 'Organiser les fichiers audio et les métadonnées musicales',
      productivity: 'Limiter les tâches répétitives et classer ses fichiers',
      media: 'Gérer les captures, les extraits et les références'
    },
    shortAnswerHeadings: ['réponse courte', 'en bref'],
    faqHeadings: ['faq', 'questions fréquentes'], relatedTopicHeadings: ['sujets connexes']
  },
  es: {
    title: 'Blog de ONNELLAB - Guías prácticas para flujos digitales más tranquilos',
    description: 'Artículos prácticos de ONNELLAB sobre lectura, música, productividad y contenido multimedia.',
    heading: 'Guías prácticas de flujo de trabajo',
    intro: 'Artículos enfocados para organizar con más calma la lectura, la música, los archivos y las tareas multimedia.',
    apps: 'Aplicaciones', blog: 'Blog', summary: 'Resumen',
    relatedApps: 'Aplicaciones relacionadas', relatedArticles: 'Sigue leyendo',
    relatedArticleLabel: 'Artículo relacionado', relatedGuides: 'Guías relacionadas',
    contents: 'Contenido', tags: 'Etiquetas', published: 'Publicado', updated: 'Actualizado',
    emptyTitle: 'Estamos preparando los artículos',
    emptyText: 'Pronto publicaremos más guías sobre lectura, música, archivos y contenido multimedia.',
    categoriesLabel: 'Temas', postsLabel: 'Artículos publicados', allCategories: 'Todos',
    categoryLabels: { reading: 'Lectura', music: 'Música', productivity: 'Productividad', media: 'Multimedia', craft: 'Creación', games: 'Juegos', research: 'Investigación' },
    categoryDescriptions: {
      reading: 'Cómo trabajar con textos largos y documentos extensos',
      music: 'Organizar archivos de audio y metadatos musicales',
      productivity: 'Reducir tareas repetitivas y ordenar archivos',
      media: 'Gestionar capturas de pantalla, clips y referencias'
    },
    shortAnswerHeadings: ['respuesta breve', 'resumen'],
    faqHeadings: ['faq', 'preguntas frecuentes'], relatedTopicHeadings: ['temas relacionados']
  }
};
