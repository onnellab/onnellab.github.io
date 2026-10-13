import type { AllSiteLocale } from './extended-site-i18n';

type Point = { title: string; body: string };
type Offer = { category: string; result: string };

export type ShowcaseCopy = {
  seoTitle: string;
  description: string;
  nav: { apps: string; about: string; blog: string; menu: string };
  carousel: { label: string; previous: string; next: string; choose: string; musicTag: string };
  eyebrow: string;
  heroTitle: string;
  heroIntro: string;
  browse: string;
  signatureLabel: string;
  signatureTitle: string;
  signatureBody: string;
  exploreApp: string;
  selectedLabel: string;
  selectedTitle: string;
  selectedIntro: string;
  offers: { quivra: Offer; melivra: Offer; papira: Offer };
  trustLabel: string;
  trustTitle: string;
  trustIntro: string;
  trust: [Point, Point, Point];
  trustQuestion: string;
  trustAnswer: string;
  releasedUnit: string;
  approachLabel: string;
  approachTitle: string;
  values: [Point, Point, Point];
  workflowsLabel: string;
  togetherTitle: string;
  togetherIntro: string;
  workflows: [Point, Point];
  latestLabel: string;
  latestTitle: string;
  latestIntro: string;
  closingTitle: string;
  closingBody: string;
  platformsLabel: string;
};

export const showcaseCopy: Record<AllSiteLocale, ShowcaseCopy> = {
  en: {
    seoTitle: 'ONNELLAB - Focused apps for files and creative work',
    description: 'ONNELLAB makes focused apps for managing files, media, creative work, and everyday tasks.',
    nav: { apps: 'Apps', about: 'About', blog: 'Blog', menu: 'Open menu' },
    carousel: { label: 'Featured apps', previous: 'Previous app', next: 'Next app', choose: 'Choose an app', musicTag: 'Music tag editor' },
    eyebrow: 'Independent software studio',
    heroTitle: 'Small tools. Calmly made.',
    heroIntro: 'Thoughtful apps for music, files, media and creative work. Less friction, fewer unnecessary steps, and control where it belongs: with you.',
    browse: 'Explore our apps',
    signatureLabel: 'Signature product',
    signatureTitle: 'Make your music collection your own.',
    signatureBody: 'Bring order to song information, cover art and lyrics, and keep the music files you own organized your way.',
    exploreApp: 'Explore TagWeaver',
    selectedLabel: 'Selected apps',
    selectedTitle: 'The right tool for the task.',
    selectedIntro: 'Convert media, enjoy your own music, and turn text into books. Each app has a job to do.',
    offers: {
      quivra: { category: 'Media conversion', result: 'Turn audio and video into the file format you need, without a complicated workflow.' },
      melivra: { category: 'Offline music player', result: 'Find and enjoy the music you own, and pick up where you left off.' },
      papira: { category: 'E-book creator', result: 'Give plain text the shape of an e-book you can keep and read.' }
    },
    trustLabel: 'Trust & confidence',
    trustTitle: 'Small studio. Thoughtful products.',
    trustIntro: 'We prefer working software and visible improvements to grand promises.',
    trust: [
      { title: 'Released apps', body: 'Explore products published through official app stores.' },
      { title: 'Visible improvements', body: 'See what changed in product updates and release notes.' },
      { title: 'Respect for your files', body: 'We favor local processing when possible and explain when a feature uses a server.' }
    ],
    trustQuestion: 'New to ONNELLAB?',
    trustAnswer: 'Check each app’s supported platforms, capabilities and store listing before deciding if it fits your needs.',
    releasedUnit: 'released apps',
    approachLabel: 'Our approach',
    approachTitle: 'Less complexity. More care.',
    values: [
      { title: 'One clear job', body: 'Each app begins with a specific task, rather than a growing list of distractions.' },
      { title: 'Calm by default', body: 'Readable interfaces and considered defaults make it easier to get things done.' },
      { title: 'User-controlled', body: 'Your decisions and files remain central to how the product works.' }
    ],
    workflowsLabel: 'Workflows',
    togetherTitle: 'Good tools fit your workflow.',
    togetherIntro: 'Independent apps, with complementary jobs. Use them together when it makes sense.',
    workflows: [
      { title: 'Organize, then listen', body: 'Edit the tags in your music files with TagWeaver, then enjoy your collection in Melivra.' },
      { title: 'Convert, then trim', body: 'Prepare a media file with Quivra, then keep the audio segment you need with Segra.' }
    ],
    latestLabel: 'Product updates',
    latestTitle: 'Refined beyond release.',
    latestIntro: 'A few recent changes from products already available.',
    closingTitle: 'Tools to reach for when you need them.',
    closingBody: 'Simple, dependable apps for the work you do every day.',
    platformsLabel: 'Available platforms'
  },
  ko: {
    seoTitle: 'ONNELLAB - 파일과 창작 작업을 위한 앱',
    description: 'ONNELLAB은 파일과 미디어를 관리하고 창작 작업과 일상의 일을 돕는 목적이 분명한 앱을 만들어요.',
    nav: { apps: '앱', about: '소개', blog: '블로그', menu: '메뉴 열기' },
    carousel: { label: '대표 앱 미리보기', previous: '이전 앱', next: '다음 앱', choose: '앱 선택', musicTag: '음악 태그 편집' },
    eyebrow: '독립 소프트웨어 스튜디오',
    heroTitle: '작은 도구를, 세심하게 만들어요.',
    heroIntro: '음악, 문서, 미디어와 창작 작업을 위한 목적이 분명한 앱을 만들어요. 불필요한 단계는 줄이고, 가능한 작업은 기기 안에서 처리해 사용자의 선택과 파일을 존중해요.',
    browse: '앱 둘러보기',
    signatureLabel: '대표 제품',
    signatureTitle: '소장한 음악을, 원하는 모습으로 정리해요.',
    signatureBody: '흩어진 음악 정보와 커버, 가사를 가지런히 정리해 나만의 음악 컬렉션을 편리하게 관리해요.',
    exploreApp: 'TagWeaver 살펴보기',
    selectedLabel: '엄선한 앱',
    selectedTitle: '필요한 일을, 더 간단하게.',
    selectedIntro: '미디어를 변환하고, 음악을 감상하고, 텍스트를 전자책으로 만들어요. 각자의 일에 집중하는 도구들이에요.',
    offers: {
      quivra: { category: '미디어 파일 변환', result: '음원과 영상을 필요한 형식으로 바꿔 다른 작업에도 편리하게 활용해요.' },
      melivra: { category: '로컬 음악 플레이어', result: '소장한 음악을 한곳에서 찾고, 듣던 순간부터 자연스럽게 이어 들어요.' },
      papira: { category: '전자책 만들기', result: '일반 텍스트를 읽기 좋은 전자책으로 완성해 오래 간직해요.' }
    },
    trustLabel: '신뢰와 투명성',
    trustTitle: '작지만, 믿고 사용할 수 있도록.',
    trustIntro: '화려한 약속보다 실제로 작동하는 제품과 꾸준한 개선을 중요하게 생각해요.',
    trust: [
      { title: '출시한 앱', body: '공식 앱 스토어에서 직접 확인할 수 있는 제품을 만들어요.' },
      { title: '공개된 개선 이력', body: '제품별 업데이트 내역에서 어떤 점을 다듬었는지 확인할 수 있어요.' },
      { title: '사용자 데이터 존중', body: '가능한 작업은 기기 안에서 처리하고 서버 처리가 필요한 기능은 따로 안내해요.' }
    ],
    trustQuestion: '처음 사용하는 앱이라 망설여지나요?',
    trustAnswer: '지원 기능과 플랫폼, 구매 조건은 각 제품 페이지와 공식 앱 스토어에서 확인할 수 있어요.',
    releasedUnit: '개의 출시 앱',
    approachLabel: '만드는 원칙',
    approachTitle: '복잡한 기능보다, 편안한 사용 경험을.',
    values: [
      { title: '한 가지 분명한 일', body: '각 앱은 목적이 명확한 작업에 집중하고 불필요한 기능을 줄여요.' },
      { title: '기본값부터 차분하게', body: '읽기 쉬운 화면과 자연스러운 흐름으로 사용자의 수고를 덜어요.' },
      { title: '사용자가 통제해요', body: '자동화가 편리함을 주더라도 중요한 선택과 파일은 사용자를 중심에 두어요.' }
    ],
    workflowsLabel: '함께 쓰는 도구',
    togetherTitle: '각자의 역할에 집중하고, 함께 사용해요.',
    togetherIntro: '서로 다른 작업에 맞는 앱을 필요에 따라 이어서 사용할 수 있어요.',
    workflows: [
      { title: '정리하고, 감상해요', body: 'TagWeaver에서 음악 정보를 다듬고 Melivra에서 컬렉션을 감상해요.' },
      { title: '변환하고, 필요한 부분만 남겨요', body: 'Quivra로 파일 형식을 바꾸고 Segra에서 원하는 오디오 구간을 추출해요.' }
    ],
    latestLabel: '제품 업데이트',
    latestTitle: '출시 이후에도, 계속 다듬어요.',
    latestIntro: '이미 출시된 앱의 최근 개선 내용을 살펴보세요.',
    closingTitle: '필요한 순간에, 믿고 꺼내는 도구.',
    closingBody: '일상의 작고 반복적인 작업이 조금 더 편리해지도록 만들어요.',
    platformsLabel: '지원 플랫폼'
  },
  ja: {
    seoTitle: 'ONNELLAB - ファイル管理と創作のためのアプリ',
    description: 'ONNELLABは、ファイルやメディアの管理、創作、日々の作業に役立つ、目的の明確なアプリをつくります。',
    nav: { apps: 'アプリ', about: '紹介', blog: 'ブログ', menu: 'メニューを開く' },
    carousel: { label: 'おすすめアプリのプレビュー', previous: '前のアプリ', next: '次のアプリ', choose: 'アプリを選択', musicTag: '音楽タグ編集' },
    eyebrow: 'インディーソフトウェアスタジオ',
    heroTitle: '小さな道具を、丁寧に。',
    heroIntro: '音楽やファイル、メディア、創作のために、役割の明確なアプリをつくっています。余計な手順を減らし、できる限り自分の端末で、自分のデータを扱えるように。',
    browse: 'アプリを見る', signatureLabel: '代表プロダクト',
    signatureTitle: '音楽コレクションを、自分らしく整える。',
    signatureBody: '曲の情報やジャケット、歌詞を整理して、大切な音楽ファイルを自分の思いどおりに管理できます。',
    exploreApp: 'TagWeaverを見る', selectedLabel: 'おすすめアプリ',
    selectedTitle: 'やりたいことに、ちょうどいい道具を。',
    selectedIntro: 'メディアの変換から音楽の再生、電子書籍づくりまで。役割のはっきりしたアプリを揃えています。',
    offers: {
      quivra: { category: 'メディア変換', result: '音声や動画を必要な形式に変えて、次の作業へスムーズにつなげます。' },
      melivra: { category: 'ローカル音楽プレーヤー', result: '手元の音楽を探しやすく整理し、続きから心地よく聴けます。' },
      papira: { category: '電子書籍作成', result: 'プレーンテキストを読みやすい電子書籍に仕上げて保存できます。' }
    },
    trustLabel: '信頼と安心',
    trustTitle: '小さなスタジオだからこそ、誠実に。',
    trustIntro: '大きな約束より、きちんと動く製品と着実な改善を大切にしています。',
    trust: [
      { title: '公開中のアプリ', body: '公式ストアで製品の内容を確認できます。' },
      { title: '公開された更新履歴', body: '製品ごとの更新内容を確認できます。' },
      { title: 'データへの配慮', body: '可能な処理は端末内で行い、サーバーが必要な機能は明示します。' }
    ],
    trustQuestion: '初めてのアプリで迷っていますか？',
    trustAnswer: '対応環境や機能、購入条件は製品ページと公式ストアでご確認いただけます。',
    releasedUnit: '公開中のアプリ', approachLabel: 'ものづくりの原則',
    approachTitle: '複雑さより、使い心地を。',
    values: [
      { title: '明確な役割', body: '一つの作業に集中し、余計な機能を増やしません。' },
      { title: '静かな使い心地', body: '読みやすい画面と自然な操作の流れを整えます。' },
      { title: '使う人の手に', body: '大切な選択とファイルの扱いは利用者を中心に考えます。' }
    ],
    workflowsLabel: '組み合わせて使う',
    togetherTitle: '道具を組み合わせて、もっと快適に。',
    togetherIntro: 'それぞれ独立したアプリを、必要な流れで使えます。',
    workflows: [
      { title: '整えてから聴く', body: 'TagWeaverで楽曲情報を整理し、Melivraでコレクションを楽しめます。' },
      { title: '変換してから切り出す', body: 'Quivraで形式を変え、Segraで必要な音声区間を残せます。' }
    ],
    latestLabel: 'アップデート', latestTitle: '公開後も、少しずつ磨く。',
    latestIntro: '公開中のアプリの最近の改善内容です。',
    closingTitle: '必要なときに、頼れる道具。',
    closingBody: '日々の小さな作業を、少しだけ使いやすく。',
    platformsLabel: '対応プラットフォーム'
  },
  'zh-Hans': {
    seoTitle: 'ONNELLAB - 专注于文件与创作的应用',
    description: 'ONNELLAB 打造用途明确的应用，帮助你管理文件与媒体，完成创作和日常任务。',
    nav: { apps: '应用', about: '关于', blog: '博客', menu: '打开菜单' },
    carousel: { label: '精选应用预览', previous: '上一个应用', next: '下一个应用', choose: '选择应用', musicTag: '音乐标签编辑' },
    eyebrow: '独立软件工作室', heroTitle: '小工具，用心做。',
    heroIntro: '为音乐、文件、媒体与创作打造目标明确的应用。减少不必要的步骤，尽可能让文件留在设备上，由你掌控。',
    browse: '浏览应用', signatureLabel: '代表产品',
    signatureTitle: '让音乐收藏井井有条。',
    signatureBody: '整理歌曲信息、封面和歌词，让自己的音乐文件始终按自己的方式管理。',
    exploreApp: '了解 TagWeaver', selectedLabel: '精选应用',
    selectedTitle: '恰好解决眼前的事。',
    selectedIntro: '转换媒体、聆听自己的音乐、把文字制作成电子书。每款工具都有明确的任务。',
    offers: {
      quivra: { category: '媒体格式转换', result: '将音视频转换为需要的格式，轻松用于下一步工作。' },
      melivra: { category: '本地音乐播放器', result: '轻松找到自己收藏的音乐，并从上次中断的地方继续播放。' },
      papira: { category: '电子书制作', result: '把普通文本整理成适合阅读和保存的电子书。' }
    },
    trustLabel: '信任与透明',
    trustTitle: '小团队，也认真对待每一款产品。',
    trustIntro: '比起夸大的承诺，我们更重视可靠的产品和持续的改进。',
    trust: [
      { title: '已发布应用', body: '可在官方应用商店查看已经发布的产品。' },
      { title: '公开更新记录', body: '了解每个版本实际改进了什么。' },
      { title: '尊重用户数据', body: '能够本地处理的任务优先在设备上完成，需要服务器的功能会另行说明。' }
    ],
    trustQuestion: '第一次接触 ONNELLAB？',
    trustAnswer: '购买前可在产品页面和官方商店确认功能、设备支持与购买条件。',
    releasedUnit: '款已发布应用', approachLabel: '我们的原则',
    approachTitle: '少一些复杂，多一分用心。',
    values: [
      { title: '专注一件事', body: '每款应用都围绕明确的任务设计。' },
      { title: '从容易用', body: '清晰的界面和自然的操作减少干扰。' },
      { title: '由用户掌控', body: '重要的选择和文件处理方式始终以用户为中心。' }
    ],
    workflowsLabel: '使用流程',
    togetherTitle: '工具各司其职，也能顺畅衔接。',
    togetherIntro: '根据自己的工作流程，组合使用独立应用。',
    workflows: [
      { title: '先整理，再聆听', body: '使用 TagWeaver 整理歌曲信息，再用 Melivra 欣赏收藏的音乐。' },
      { title: '先转换，再截取', body: '使用 Quivra 转换格式，再用 Segra 提取所需的音频片段。' }
    ],
    latestLabel: '产品更新', latestTitle: '发布之后，继续打磨。',
    latestIntro: '查看已发布应用近期的改进。',
    closingTitle: '需要的时候，顺手就能用。',
    closingBody: '为日常的小事，做更好用的工具。',
    platformsLabel: '支持平台'
  },
  'zh-Hant': {
    seoTitle: 'ONNELLAB - 專注於檔案與創作的應用程式',
    description: 'ONNELLAB 打造用途明確的應用程式，幫助你管理檔案與媒體，完成創作與日常工作。',
    nav: { apps: '應用程式', about: '關於', blog: '部落格', menu: '開啟選單' },
    carousel: { label: '精選應用程式預覽', previous: '上一個應用程式', next: '下一個應用程式', choose: '選擇應用程式', musicTag: '音樂標籤編輯' },
    eyebrow: '獨立軟體工作室', heroTitle: '小工具，用心做。',
    heroIntro: '為音樂、檔案、影音與創作打造目標明確的應用程式。減少不必要的步驟，盡可能讓檔案留在裝置上，由你掌控。',
    browse: '瀏覽應用程式', signatureLabel: '代表產品',
    signatureTitle: '讓音樂收藏井然有序。',
    signatureBody: '整理歌曲資訊、封面與歌詞，以自己的方式管理珍藏的音樂檔案。',
    exploreApp: '了解 TagWeaver', selectedLabel: '精選應用程式',
    selectedTitle: '剛剛好，完成需要的事。',
    selectedIntro: '轉換影音、聆聽自己的音樂、把文字製作成電子書。每款工具都有清楚的用途。',
    offers: {
      quivra: { category: '影音格式轉換', result: '將音訊與影片轉成需要的格式，方便接續其他工作。' },
      melivra: { category: '本機音樂播放器', result: '輕鬆找到珍藏的音樂，從上次停下的地方繼續聆聽。' },
      papira: { category: '電子書製作', result: '把一般文字整理成適合閱讀與保存的電子書。' }
    },
    trustLabel: '信任與透明',
    trustTitle: '小小工作室，認真看待每款產品。',
    trustIntro: '比起華麗承諾，我們更重視可靠的產品與持續改善。',
    trust: [
      { title: '已上架應用程式', body: '可在官方商店查看已推出的產品。' },
      { title: '公開更新紀錄', body: '了解每個版本實際改善了什麼。' },
      { title: '尊重使用者資料', body: '能在裝置上完成的工作優先在本機處理，需要伺服器的功能會另行說明。' }
    ],
    trustQuestion: '第一次認識 ONNELLAB？',
    trustAnswer: '購買前可在產品頁面與官方商店確認功能、支援裝置及購買條件。',
    releasedUnit: '款已上架應用程式', approachLabel: '設計原則',
    approachTitle: '少一點複雜，多一點用心。',
    values: [
      { title: '專注一件事', body: '每款應用程式都圍繞明確的工作設計。' },
      { title: '從容好用', body: '清晰畫面與自然操作，減少使用干擾。' },
      { title: '由使用者掌控', body: '重要的選擇與檔案處理始終以使用者為中心。' }
    ],
    workflowsLabel: '使用流程',
    togetherTitle: '工具各司其職，也能順暢搭配。',
    togetherIntro: '依自己的工作流程搭配使用獨立的應用程式。',
    workflows: [
      { title: '先整理，再聆聽', body: '用 TagWeaver 整理歌曲資訊，再用 Melivra 欣賞音樂收藏。' },
      { title: '先轉換，再擷取', body: '用 Quivra 轉換格式，再用 Segra 擷取需要的音訊片段。' }
    ],
    latestLabel: '產品更新', latestTitle: '推出之後，持續打磨。',
    latestIntro: '查看已上架應用程式近期的改善。',
    closingTitle: '需要時，隨手就能使用。',
    closingBody: '讓日常的小事，多一分便利。',
    platformsLabel: '支援平台'
  },
  'pt-BR': {
    seoTitle: 'ONNELLAB - Apps focados em arquivos e criação',
    description: 'A ONNELLAB cria apps focados para organizar arquivos, mídia, trabalhos criativos e tarefas do dia a dia.',
    nav: { apps: 'Apps', about: 'Sobre', blog: 'Blog', menu: 'Abrir menu' },
    carousel: { label: 'Prévia dos apps em destaque', previous: 'App anterior', next: 'Próximo app', choose: 'Escolher um app', musicTag: 'Editor de tags musicais' },
    eyebrow: 'Estúdio independente de software',
    heroTitle: 'Ferramentas pequenas. Feitas com cuidado.',
    heroIntro: 'Criamos apps focados em música, arquivos, mídia e criação. Menos etapas desnecessárias e mais controle sobre o que é seu.',
    browse: 'Explorar os apps', signatureLabel: 'Produto em destaque',
    signatureTitle: 'Organize sua coleção musical do seu jeito.',
    signatureBody: 'Organize informações, capas e letras para cuidar melhor dos arquivos de música que você possui.',
    exploreApp: 'Conhecer o TagWeaver', selectedLabel: 'Apps selecionados',
    selectedTitle: 'A ferramenta certa para cada tarefa.',
    selectedIntro: 'Converta mídia, ouça sua coleção e transforme textos em livros digitais.',
    offers: {
      quivra: { category: 'Conversão de mídia', result: 'Converta áudio e vídeo para o formato necessário, sem complicações.' },
      melivra: { category: 'Player de música offline', result: 'Encontre suas músicas e continue ouvindo de onde parou.' },
      papira: { category: 'Criador de e-books', result: 'Transforme texto simples em um e-book para ler e guardar.' }
    },
    trustLabel: 'Confiança e transparência',
    trustTitle: 'Um estúdio pequeno. Produtos feitos com atenção.',
    trustIntro: 'Preferimos apps úteis e melhorias visíveis a grandes promessas.',
    trust: [
      { title: 'Apps publicados', body: 'Conheça produtos disponíveis nas lojas oficiais.' },
      { title: 'Melhorias transparentes', body: 'Consulte o histórico de atualizações de cada produto.' },
      { title: 'Respeito pelos seus arquivos', body: 'Priorizamos o processamento local e explicamos quando um recurso usa servidores.' }
    ],
    trustQuestion: 'Ainda não conhece a ONNELLAB?',
    trustAnswer: 'Confira funções, plataformas e condições de compra nas páginas dos produtos e nas lojas oficiais.',
    releasedUnit: 'apps publicados', approachLabel: 'Nossa abordagem',
    approachTitle: 'Menos complexidade. Mais cuidado.',
    values: [
      { title: 'Uma tarefa clara', body: 'Cada app nasce para resolver uma necessidade específica.' },
      { title: 'Calma por padrão', body: 'Interfaces legíveis e escolhas cuidadosas facilitam a rotina.' },
      { title: 'Sob seu controle', body: 'Seus arquivos e decisões orientam a experiência.' }
    ],
    workflowsLabel: 'Fluxos de trabalho',
    togetherTitle: 'Ferramentas que combinam com seu fluxo.',
    togetherIntro: 'Apps independentes para etapas complementares do seu trabalho.',
    workflows: [
      { title: 'Organize e depois ouça', body: 'Ajuste tags no TagWeaver e aproveite sua coleção no Melivra.' },
      { title: 'Converta e depois recorte', body: 'Prepare o arquivo no Quivra e extraia o trecho necessário no Segra.' }
    ],
    latestLabel: 'Atualizações', latestTitle: 'Melhoramos mesmo depois de lançar.',
    latestIntro: 'Novidades recentes de apps disponíveis.',
    closingTitle: 'Ferramentas para quando você precisar.',
    closingBody: 'Mais facilidade nas pequenas tarefas do dia a dia.',
    platformsLabel: 'Plataformas'
  },
  de: {
    seoTitle: 'ONNELLAB - Fokussierte Apps für Dateien und kreative Arbeit',
    description: 'ONNELLAB entwickelt fokussierte Apps für Dateien, Medien, kreative Arbeit und alltägliche Aufgaben.',
    nav: { apps: 'Apps', about: 'Über uns', blog: 'Blog', menu: 'Menü öffnen' },
    carousel: { label: 'Ausgewählte Apps in der Vorschau', previous: 'Vorherige App', next: 'Nächste App', choose: 'App auswählen', musicTag: 'Musik-Tags bearbeiten' },
    eyebrow: 'Unabhängiges Softwarestudio',
    heroTitle: 'Kleine Werkzeuge. Mit Sorgfalt gemacht.',
    heroIntro: 'Wir entwickeln klare, fokussierte Apps für Musik, Dateien, Medien und Kreatives. Weniger unnötige Schritte und mehr Kontrolle über die eigenen Dateien.',
    browse: 'Apps entdecken', signatureLabel: 'Ausgewähltes Produkt',
    signatureTitle: 'Deine Musiksammlung. Deine Ordnung.',
    signatureBody: 'Bring Titelinformationen, Cover und Liedtexte in Ordnung und verwalte deine Musikdateien so, wie du es möchtest.',
    exploreApp: 'TagWeaver entdecken', selectedLabel: 'Ausgewählte Apps',
    selectedTitle: 'Das passende Werkzeug für jede Aufgabe.',
    selectedIntro: 'Medien umwandeln, eigene Musik hören und Texte als E-Books aufbereiten.',
    offers: {
      quivra: { category: 'Medienkonvertierung', result: 'Wandle Audio und Video ohne umständliche Abläufe ins benötigte Format um.' },
      melivra: { category: 'Offline-Musikplayer', result: 'Finde deine Musik und höre genau dort weiter, wo du aufgehört hast.' },
      papira: { category: 'E-Book-Erstellung', result: 'Mach aus einfachem Text ein E-Book zum Lesen und Aufbewahren.' }
    },
    trustLabel: 'Vertrauen und Transparenz',
    trustTitle: 'Kleines Studio. Sorgfältige Produkte.',
    trustIntro: 'Wir setzen auf funktionierende Software und nachvollziehbare Verbesserungen statt großer Versprechen.',
    trust: [
      { title: 'Veröffentlichte Apps', body: 'Unsere Produkte findest du in den offiziellen App-Stores.' },
      { title: 'Offene Update-Historie', body: 'Sieh nach, was sich in den einzelnen Versionen geändert hat.' },
      { title: 'Respekt vor deinen Daten', body: 'Wo möglich, werden Dateien lokal verarbeitet. Servernutzung erklären wir gesondert.' }
    ],
    trustQuestion: 'Du kennst ONNELLAB noch nicht?',
    trustAnswer: 'Prüfe Funktionen, unterstützte Plattformen und Kaufbedingungen auf den Produktseiten und im Store.',
    releasedUnit: 'veröffentlichte Apps', approachLabel: 'Unser Ansatz',
    approachTitle: 'Weniger Komplexität. Mehr Sorgfalt.',
    values: [
      { title: 'Eine klare Aufgabe', body: 'Jede App konzentriert sich auf einen konkreten Zweck.' },
      { title: 'Von Anfang an ruhig', body: 'Lesbare Oberflächen und durchdachte Standards erleichtern die Arbeit.' },
      { title: 'Du entscheidest', body: 'Deine Dateien und Entscheidungen stehen im Mittelpunkt.' }
    ],
    workflowsLabel: 'Arbeitsabläufe',
    togetherTitle: 'Gute Werkzeuge passen zusammen.',
    togetherIntro: 'Eigenständige Apps für aufeinanderfolgende Arbeitsschritte.',
    workflows: [
      { title: 'Ordnen und genießen', body: 'Bearbeite Musik-Tags mit TagWeaver und höre deine Sammlung mit Melivra.' },
      { title: 'Konvertieren und schneiden', body: 'Wandle die Datei mit Quivra um und schneide mit Segra den gewünschten Audioteil aus.' }
    ],
    latestLabel: 'Produkt-Updates', latestTitle: 'Auch nach dem Start verbessert.',
    latestIntro: 'Jüngste Verbesserungen unserer veröffentlichten Apps.',
    closingTitle: 'Werkzeuge, auf die du zurückgreifen kannst.',
    closingBody: 'Für die kleinen Aufgaben des Alltags.',
    platformsLabel: 'Plattformen'
  },
  fr: {
    seoTitle: 'ONNELLAB - Des apps ciblées pour les fichiers et la création',
    description: 'ONNELLAB crée des apps ciblées pour gérer fichiers, médias, travaux créatifs et tâches du quotidien.',
    nav: { apps: 'Apps', about: 'À propos', blog: 'Blog', menu: 'Ouvrir le menu' },
    carousel: { label: 'Aperçu des applications phares', previous: 'Application précédente', next: 'Application suivante', choose: 'Choisir une application', musicTag: 'Éditeur de tags musicaux' },
    eyebrow: 'Studio logiciel indépendant',
    heroTitle: 'De petits outils, conçus avec soin.',
    heroIntro: 'Des applications ciblées pour la musique, les fichiers, les médias et la création. Moins d’étapes superflues, plus de maîtrise sur ce qui vous appartient.',
    browse: 'Explorer les apps', signatureLabel: 'Produit phare',
    signatureTitle: 'Votre bibliothèque musicale, à votre image.',
    signatureBody: 'Organisez les informations, pochettes et paroles pour gérer vos fichiers musicaux comme vous le souhaitez.',
    exploreApp: 'Découvrir TagWeaver', selectedLabel: 'Applications sélectionnées',
    selectedTitle: 'Le bon outil pour la bonne tâche.',
    selectedIntro: 'Convertir un média, écouter sa musique ou transformer un texte en livre numérique.',
    offers: {
      quivra: { category: 'Conversion multimédia', result: 'Convertissez audio et vidéo au format voulu, sans parcours compliqué.' },
      melivra: { category: 'Lecteur musical hors ligne', result: 'Retrouvez votre musique et reprenez l’écoute là où vous l’aviez laissée.' },
      papira: { category: 'Création de livres numériques', result: 'Transformez un texte simple en livre numérique agréable à lire et à conserver.' }
    },
    trustLabel: 'Confiance et transparence',
    trustTitle: 'Un petit studio. Des produits soignés.',
    trustIntro: 'Nous privilégions des outils fiables et des améliorations concrètes aux grandes promesses.',
    trust: [
      { title: 'Applications publiées', body: 'Retrouvez nos produits sur les boutiques officielles.' },
      { title: 'Améliorations visibles', body: 'Consultez les changements apportés à chaque version.' },
      { title: 'Respect des données', body: 'Nous privilégions le traitement local et expliquons les fonctions qui utilisent un serveur.' }
    ],
    trustQuestion: 'Vous découvrez ONNELLAB ?',
    trustAnswer: 'Vérifiez les fonctions, les plateformes prises en charge et les modalités d’achat sur chaque fiche produit.',
    releasedUnit: 'applications publiées', approachLabel: 'Notre approche',
    approachTitle: 'Moins de complexité. Plus d’attention.',
    values: [
      { title: 'Un rôle précis', body: 'Chaque application répond à une tâche clairement définie.' },
      { title: 'Du calme par défaut', body: 'Des interfaces lisibles et des choix réfléchis facilitent le travail.' },
      { title: 'Vous gardez la main', body: 'Vos fichiers et vos décisions restent au centre du produit.' }
    ],
    workflowsLabel: 'Flux de travail',
    togetherTitle: 'De bons outils, au bon moment.',
    togetherIntro: 'Des applications indépendantes qui peuvent se compléter.',
    workflows: [
      { title: 'Organiser puis écouter', body: 'Corrigez les tags avec TagWeaver, puis écoutez votre collection dans Melivra.' },
      { title: 'Convertir puis découper', body: 'Préparez le fichier avec Quivra, puis extrayez un passage audio avec Segra.' }
    ],
    latestLabel: 'Mises à jour', latestTitle: 'Peaufinées après leur sortie.',
    latestIntro: 'Quelques améliorations récentes des applications disponibles.',
    closingTitle: 'Des outils utiles au bon moment.',
    closingBody: 'Pour faciliter les petites tâches du quotidien.',
    platformsLabel: 'Plateformes'
  },
  es: {
    seoTitle: 'ONNELLAB - Apps enfocadas en archivos y trabajo creativo',
    description: 'ONNELLAB crea apps enfocadas para gestionar archivos, contenido multimedia, trabajo creativo y tareas cotidianas.',
    nav: { apps: 'Apps', about: 'Acerca de', blog: 'Blog', menu: 'Abrir menú' },
    carousel: { label: 'Vista previa de apps destacadas', previous: 'App anterior', next: 'Siguiente app', choose: 'Elegir una app', musicTag: 'Editor de etiquetas musicales' },
    eyebrow: 'Estudio de software independiente',
    heroTitle: 'Herramientas pequeñas, hechas con cuidado.',
    heroIntro: 'Creamos apps enfocadas en música, archivos, contenido multimedia y creación. Menos pasos innecesarios y más control sobre tus propios archivos.',
    browse: 'Explorar las apps', signatureLabel: 'Producto destacado',
    signatureTitle: 'Tu colección musical, a tu manera.',
    signatureBody: 'Ordena la información, las carátulas y las letras para gestionar tu música como prefieras.',
    exploreApp: 'Conocer TagWeaver', selectedLabel: 'Apps seleccionadas',
    selectedTitle: 'La herramienta adecuada para cada tarea.',
    selectedIntro: 'Convierte archivos, escucha tu música y transforma textos en libros electrónicos.',
    offers: {
      quivra: { category: 'Conversión multimedia', result: 'Convierte audio y vídeo al formato que necesitas, sin complicaciones.' },
      melivra: { category: 'Reproductor de música sin conexión', result: 'Encuentra tu música y sigue escuchando donde lo dejaste.' },
      papira: { category: 'Creador de libros electrónicos', result: 'Convierte texto sencillo en un libro electrónico para leer y conservar.' }
    },
    trustLabel: 'Confianza y transparencia',
    trustTitle: 'Un estudio pequeño. Productos cuidados.',
    trustIntro: 'Preferimos productos que funcionan y mejoras visibles a las grandes promesas.',
    trust: [
      { title: 'Apps publicadas', body: 'Consulta nuestros productos en las tiendas oficiales.' },
      { title: 'Mejoras transparentes', body: 'Revisa qué ha cambiado en cada actualización.' },
      { title: 'Respeto por tus archivos', body: 'Priorizamos el procesamiento local cuando es posible y explicamos qué funciones usan servidores.' }
    ],
    trustQuestion: '¿Aún no conoces ONNELLAB?',
    trustAnswer: 'Antes de decidir, revisa las funciones, plataformas y condiciones de compra en cada ficha oficial.',
    releasedUnit: 'apps publicadas', approachLabel: 'Nuestro enfoque',
    approachTitle: 'Menos complejidad. Más cuidado.',
    values: [
      { title: 'Una tarea clara', body: 'Cada app se centra en una necesidad concreta.' },
      { title: 'Calma por defecto', body: 'Interfaces legibles y ajustes pensados para facilitar el trabajo.' },
      { title: 'Bajo tu control', body: 'Tus archivos y decisiones son lo primero.' }
    ],
    workflowsLabel: 'Flujos de trabajo',
    togetherTitle: 'Herramientas que encajan en tu flujo.',
    togetherIntro: 'Apps independientes para tareas complementarias.',
    workflows: [
      { title: 'Organiza y luego escucha', body: 'Edita las etiquetas con TagWeaver y disfruta de tu colección en Melivra.' },
      { title: 'Convierte y luego recorta', body: 'Prepara el archivo con Quivra y extrae el fragmento de audio que necesites con Segra.' }
    ],
    latestLabel: 'Actualizaciones', latestTitle: 'Seguimos mejorando después del lanzamiento.',
    latestIntro: 'Algunas mejoras recientes de las apps disponibles.',
    closingTitle: 'Herramientas para cuando las necesites.',
    closingBody: 'Un poco más de comodidad en las tareas de cada día.',
    platformsLabel: 'Plataformas'
  }
};
