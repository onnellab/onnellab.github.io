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
    heroTitle: 'Apps for files and media.',
    heroIntro: 'ONNELLAB develops apps for editing music tags, converting media, playing local audio and creating e-books. Each product page lists its features and supported platforms.',
    browse: 'Explore our apps',
    signatureLabel: 'Signature product',
    signatureTitle: 'Edit MP3 and FLAC tags.',
    signatureBody: 'Change song information, album artwork and lyrics with TagWeaver. Batch saving for multiple files is available with Pro.',
    exploreApp: 'Explore TagWeaver',
    selectedLabel: 'More apps',
    selectedTitle: 'Other ONNELLAB apps',
    selectedIntro: 'Explore media conversion, offline music playback and TXT-to-EPUB creation.',
    offers: {
      quivra: { category: 'Media conversion', result: 'Convert supported audio and video files into other formats.' },
      melivra: { category: 'Offline music player', result: 'Browse local music by album, artist or folder, and play it offline.' },
      papira: { category: 'E-book creator', result: 'Convert TXT files to EPUB e-books and customize the cover.' }
    },
    trustLabel: 'App information',
    trustTitle: 'What to check before installing',
    trustIntro: 'Find platform support, feature descriptions and update notes on each product page.',
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
    heroTitle: '파일·미디어 앱을 만들어요.',
    heroIntro: '음악 태그 편집, 파일 변환, 로컬 음악 재생, 전자책 제작에 필요한 앱을 개발해요. 각 앱의 기능과 지원 플랫폼은 제품 페이지에서 확인할 수 있어요.',
    browse: '앱 둘러보기',
    signatureLabel: '대표 제품',
    signatureTitle: 'MP3·FLAC 태그를 편집해요.',
    signatureBody: 'TagWeaver에서 곡 정보, 앨범 커버와 가사를 수정해요. Pro에서는 여러 곡의 태그를 한 번에 저장할 수 있어요.',
    exploreApp: 'TagWeaver 살펴보기',
    selectedLabel: '앱 더 보기',
    selectedTitle: '다른 ONNELLAB 앱',
    selectedIntro: '미디어 변환, 오프라인 음악 재생, TXT 파일의 EPUB 변환 기능을 제공하는 앱도 있어요.',
    offers: {
      quivra: { category: '미디어 파일 변환', result: '음원과 영상 파일을 선택해 지원되는 형식으로 변환해요.' },
      melivra: { category: '로컬 음악 플레이어', result: '기기에 저장한 음악을 앨범·아티스트·폴더별로 찾아 재생해요.' },
      papira: { category: '전자책 만들기', result: 'TXT 파일을 EPUB 전자책으로 변환하고 표지를 설정할 수 있어요.' }
    },
    trustLabel: '앱 이용 안내',
    trustTitle: '설치 전에 확인할 정보',
    trustIntro: '앱 스토어, 업데이트 내역, 개인정보 처리방침에서 필요한 정보를 확인할 수 있어요.',
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
    heroTitle: 'ファイル・メディア向けのアプリ。',
    heroIntro: 'ONNELLABは、音楽タグ編集、メディア変換、端末内の音楽再生、EPUB作成用のアプリを開発しています。機能や対応OSは各製品ページで確認できます。',
    browse: 'アプリを見る', signatureLabel: '代表プロダクト',
    signatureTitle: 'MP3・FLACのタグを編集。',
    signatureBody: 'TagWeaverでは曲名やアーティスト名、ジャケット、歌詞を編集できます。Proでは複数ファイルをまとめて保存できます。',
    exploreApp: 'TagWeaverを見る', selectedLabel: 'ほかのアプリ',
    selectedTitle: 'ONNELLABのアプリ一覧',
    selectedIntro: 'メディア変換、オフライン音楽再生、TXTからEPUBへの変換に対応するアプリです。',
    offers: {
      quivra: { category: 'メディア変換', result: '対応する音声・動画ファイルを別の形式に変換できます。' },
      melivra: { category: 'ローカル音楽プレーヤー', result: '端末内の音楽をアルバム、アーティスト、フォルダー別に探して再生できます。' },
      papira: { category: '電子書籍作成', result: 'TXTファイルをEPUBに変換し、表紙も設定できます。' }
    },
    trustLabel: 'アプリ情報',
    trustTitle: 'インストール前に確認できること',
    trustIntro: '各製品ページで機能、対応OS、更新履歴を確認できます。',
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
    eyebrow: '独立软件工作室', heroTitle: '文件与媒体处理应用',
    heroIntro: 'ONNELLAB 开发音乐标签编辑、音视频转换、本地音乐播放和 EPUB 制作等应用。每款应用的功能及支持平台都列在产品页面中。',
    browse: '浏览应用', signatureLabel: '代表产品',
    signatureTitle: '编辑 MP3 和 FLAC 标签',
    signatureBody: '使用 TagWeaver 修改歌曲信息、封面和歌词。Pro 支持批量保存多首歌曲的标签。',
    exploreApp: '了解 TagWeaver', selectedLabel: '更多应用',
    selectedTitle: '其他 ONNELLAB 应用',
    selectedIntro: '查看媒体转换、本地音乐播放和 TXT 转 EPUB 工具。',
    offers: {
      quivra: { category: '媒体格式转换', result: '将支持的音频和视频文件转换为其他格式。' },
      melivra: { category: '本地音乐播放器', result: '按专辑、艺术家或文件夹浏览并播放设备中的音乐。' },
      papira: { category: '电子书制作', result: '将 TXT 文件转换为 EPUB 电子书，并设置封面。' }
    },
    trustLabel: '应用信息',
    trustTitle: '安装前可以查看的信息',
    trustIntro: '产品页面列出了主要功能、支持平台和更新记录。',
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
    eyebrow: '獨立軟體工作室', heroTitle: '檔案與影音處理應用程式',
    heroIntro: 'ONNELLAB 開發音樂標籤編輯、影音格式轉換、本機音樂播放及 EPUB 製作等應用程式。各產品頁面均列出功能與支援平台。',
    browse: '瀏覽應用程式', signatureLabel: '代表產品',
    signatureTitle: '編輯 MP3 與 FLAC 標籤',
    signatureBody: '使用 TagWeaver 修改歌曲資訊、封面與歌詞。Pro 支援批次儲存多首歌曲的標籤。',
    exploreApp: '了解 TagWeaver', selectedLabel: '更多應用程式',
    selectedTitle: '其他 ONNELLAB 應用程式',
    selectedIntro: '查看影音格式轉換、本機音樂播放，以及 TXT 轉 EPUB 工具。',
    offers: {
      quivra: { category: '影音格式轉換', result: '將支援的音訊與影片檔案轉換為其他格式。' },
      melivra: { category: '本機音樂播放器', result: '依專輯、藝人或資料夾瀏覽並播放裝置中的音樂。' },
      papira: { category: '電子書製作', result: '將 TXT 檔案轉成 EPUB 電子書，並設定封面。' }
    },
    trustLabel: '應用程式資訊',
    trustTitle: '安裝前可查看的資訊',
    trustIntro: '產品頁面列出主要功能、支援平台與更新紀錄。',
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
    heroTitle: 'Apps para arquivos e mídia.',
    heroIntro: 'A ONNELLAB desenvolve apps para editar tags de músicas, converter mídia, ouvir áudios locais e criar e-books. Confira as funções e plataformas de cada app.',
    browse: 'Explorar os apps', signatureLabel: 'Produto em destaque',
    signatureTitle: 'Edite tags de MP3 e FLAC.',
    signatureBody: 'No TagWeaver, você edita informações das faixas, capas e letras. A versão Pro permite salvar alterações em vários arquivos de uma vez.',
    exploreApp: 'Conhecer o TagWeaver', selectedLabel: 'Mais apps',
    selectedTitle: 'Outros apps da ONNELLAB',
    selectedIntro: 'Apps para conversão de mídia, reprodução de música offline e criação de EPUB a partir de TXT.',
    offers: {
      quivra: { category: 'Conversão de mídia', result: 'Converta arquivos de áudio e vídeo compatíveis para outros formatos.' },
      melivra: { category: 'Player de música offline', result: 'Organize e reproduza músicas do aparelho por álbum, artista ou pasta.' },
      papira: { category: 'Criador de e-books', result: 'Converta arquivos TXT em e-books EPUB e defina a capa.' }
    },
    trustLabel: 'Informações dos apps',
    trustTitle: 'O que conferir antes de instalar',
    trustIntro: 'Consulte os recursos, as plataformas e o histórico de atualizações na página de cada app.',
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
    heroTitle: 'Apps für Dateien und Medien.',
    heroIntro: 'ONNELLAB entwickelt Apps zum Bearbeiten von Musiktags, Konvertieren von Mediendateien, Abspielen lokaler Musik und Erstellen von E-Books. Funktionen und unterstützte Plattformen stehen auf den jeweiligen Produktseiten.',
    browse: 'Apps entdecken', signatureLabel: 'Ausgewähltes Produkt',
    signatureTitle: 'MP3- und FLAC-Tags bearbeiten.',
    signatureBody: 'Mit TagWeaver bearbeitest du Titelangaben, Cover und Liedtexte. Mit Pro lassen sich Änderungen an mehreren Dateien zusammen speichern.',
    exploreApp: 'TagWeaver entdecken', selectedLabel: 'Weitere Apps',
    selectedTitle: 'Weitere Apps von ONNELLAB',
    selectedIntro: 'Tools für Medienkonvertierung, Offline-Musikwiedergabe und die Umwandlung von TXT in EPUB.',
    offers: {
      quivra: { category: 'Medienkonvertierung', result: 'Konvertiere unterstützte Audio- und Videodateien in andere Formate.' },
      melivra: { category: 'Offline-Musikplayer', result: 'Durchsuche lokale Musik nach Album, Interpret oder Ordner und spiele sie offline ab.' },
      papira: { category: 'E-Book-Erstellung', result: 'Wandle TXT-Dateien in EPUB-E-Books um und lege ein Cover fest.' }
    },
    trustLabel: 'App-Informationen',
    trustTitle: 'Informationen vor der Installation',
    trustIntro: 'Die Produktseiten zeigen Funktionen, unterstützte Plattformen und Versionshinweise.',
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
    heroTitle: 'Des apps pour les fichiers et les médias.',
    heroIntro: 'ONNELLAB développe des applications pour modifier les tags musicaux, convertir des médias, écouter des fichiers audio locaux et créer des livres numériques. Les fonctions et plateformes prises en charge sont indiquées sur chaque fiche.',
    browse: 'Explorer les apps', signatureLabel: 'Produit phare',
    signatureTitle: 'Modifiez les tags MP3 et FLAC.',
    signatureBody: 'Avec TagWeaver, modifiez les informations des morceaux, les pochettes et les paroles. La version Pro permet d’enregistrer des modifications sur plusieurs fichiers.',
    exploreApp: 'Découvrir TagWeaver', selectedLabel: 'Autres applications',
    selectedTitle: 'Les autres applications ONNELLAB',
    selectedIntro: 'Des outils pour convertir des médias, écouter sa musique hors ligne et transformer des fichiers TXT en EPUB.',
    offers: {
      quivra: { category: 'Conversion multimédia', result: 'Convertissez les fichiers audio et vidéo compatibles vers d’autres formats.' },
      melivra: { category: 'Lecteur musical hors ligne', result: 'Parcourez votre musique locale par album, artiste ou dossier et écoutez-la hors ligne.' },
      papira: { category: 'Création de livres numériques', result: 'Convertissez des fichiers TXT en EPUB et choisissez leur couverture.' }
    },
    trustLabel: 'Informations pratiques',
    trustTitle: 'À vérifier avant l’installation',
    trustIntro: 'Chaque fiche présente les fonctionnalités, les plateformes compatibles et les mises à jour.',
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
    heroTitle: 'Apps para archivos y multimedia.',
    heroIntro: 'ONNELLAB desarrolla apps para editar etiquetas musicales, convertir archivos multimedia, escuchar música local y crear libros electrónicos. Consulta las funciones y plataformas compatibles en cada página.',
    browse: 'Explorar las apps', signatureLabel: 'Producto destacado',
    signatureTitle: 'Edita las etiquetas MP3 y FLAC.',
    signatureBody: 'Con TagWeaver puedes modificar datos de las canciones, carátulas y letras. La versión Pro permite guardar cambios en varios archivos a la vez.',
    exploreApp: 'Conocer TagWeaver', selectedLabel: 'Más apps',
    selectedTitle: 'Otras apps de ONNELLAB',
    selectedIntro: 'Herramientas para convertir archivos, reproducir música sin conexión y crear EPUB a partir de TXT.',
    offers: {
      quivra: { category: 'Conversión multimedia', result: 'Convierte archivos de audio y vídeo compatibles a otros formatos.' },
      melivra: { category: 'Reproductor de música sin conexión', result: 'Explora tu música local por álbum, artista o carpeta y reprodúcela sin conexión.' },
      papira: { category: 'Creador de libros electrónicos', result: 'Convierte archivos TXT en libros EPUB y elige una portada.' }
    },
    trustLabel: 'Información de las apps',
    trustTitle: 'Qué comprobar antes de instalar',
    trustIntro: 'Cada página muestra las funciones, las plataformas compatibles y las notas de actualización.',
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

/**
 * Display the same brief category shown beneath the homepage Hero cards
 * and above the homepage selected-product cards, in all nine languages.
 * Products without a homepage category keep their existing index summaries.
 */
export function homeAppOneLine(locale: AllSiteLocale, slug: string): string | undefined {
  const copy = showcaseCopy[locale];
  if (slug === 'tagweaver') return copy.carousel.musicTag;
  if (slug === 'quivra' || slug === 'melivra' || slug === 'papira') {
    return copy.offers[slug].category;
  }
  return undefined;
}

/** Keep the previously displayed longer homepage wording searchable. */
export function homeAppSearchSupplement(locale: AllSiteLocale, slug: string): string | undefined {
  const copy = showcaseCopy[locale];
  if (slug === 'tagweaver') return copy.signatureTitle;
  if (slug === 'quivra' || slug === 'melivra' || slug === 'papira') {
    return copy.offers[slug].result;
  }
  return undefined;
}
