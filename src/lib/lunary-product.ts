import type { AllSiteLocale } from './extended-site-i18n';

export type LunaryProductCopy = {
  subtitle: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
};

const copy = {
  "en": {
    "subtitle": "An aesthetic calendar that turns each month into a cover worth keeping.",
    "body": "Lunary is a month-first calendar built for memory, atmosphere, and attachment rather than productivity overload.\n\nKeep events in a calm monthly view, then give each month its own cover with a background and stickers. Your finished month can also live on the Home Screen as a poster-style widget. Google Calendar is optional. Lunary's local calendar and cover tools work offline without sign-in. When you want to connect Google Calendar, you choose the editable calendar and can sync events in both directions.\n\n## Key features\n\n- A month-first calendar view\n- Local event create, edit, and delete without sign-in\n- A separate background-and-sticker cover for every month\n- Sticker position, size, rotation, and layer controls\n- Optional Google Calendar connection with two-way event sync\n- Poster-style Home Screen widget with the cover, monthly calendar, and event indicators\n- Animated GIF covers in the app with a stable still poster in widgets\n- UI in English, Korean, Japanese, Simplified and Traditional Chinese, Brazilian Portuguese, German, French, and Spanish\n\nGoogle Calendar is activated only when you explicitly connect it. Local events and monthly covers remain available without a Google connection.",
    "seoTitle": "Lunary - Aesthetic Monthly Calendar",
    "seoDescription": "Lunary is an aesthetic monthly calendar for local events, month-by-month covers, stickers, an optional Google Calendar sync, and a poster-style Home Screen widget.",
    "faqTitle": "Frequently asked questions",
    "faq": [
      {
        "question": "Do I need Google Calendar to use Lunary?",
        "answer": "No. Lunary’s local calendar and monthly covers work offline without sign-in. Google Calendar is optional and starts only when you choose to connect it."
      },
      {
        "question": "What does Lunary sync with Google Calendar?",
        "answer": "After you connect Google Calendar and choose a writable calendar, Lunary reads the calendar list and event changes needed for sync and can create, update, or delete synced event titles and date/time values. Monthly cover images, stickers, and local event notes are not sent to Google."
      },
      {
        "question": "Are monthly covers kept separate?",
        "answer": "Yes. Each month keeps its own background and sticker layout, including sticker position, size, rotation, and layer order."
      },
      {
        "question": "What happens to GIF covers in the Home Screen widget?",
        "answer": "GIF covers can animate inside Lunary. The Home Screen widget uses a stable still poster so the month remains readable and lightweight."
      }
    ]
  },
  "ko": {
    "subtitle": "한 달을 표지처럼 꾸미는 감성 캘린더",
    "body": "Lunary는 하루를 채우는 생산성 앱보다, 한 달의 분위기와 기억을 오래 남기는 데 집중한 월간 캘린더예요.\n\n월간 화면에서 일정을 기록하고, 달마다 배경과 스티커로 나만의 표지를 꾸며 보세요. 완성한 한 달은 홈 화면 위젯에서도 포스터처럼 확인할 수 있어요. Google Calendar 연결은 선택 사항이에요. 연결하지 않아도 Lunary의 로컬 캘린더와 표지 기능은 로그인 없이 오프라인에서 사용할 수 있어요. 원할 때만 Google Calendar를 연결하고 편집할 캘린더를 선택해 일정을 양방향으로 동기화할 수 있어요.\n\n## 주요 기능\n\n- 한 달이 주인공인 월간 캘린더\n- 로그인 없이 사용하는 로컬 일정 추가·수정·삭제\n- 달마다 독립적으로 저장되는 배경과 스티커 표지\n- 스티커 위치·크기·회전·레이어 편집\n- 선택형 Google Calendar 연결 및 일정 양방향 동기화\n- 표지와 월간 달력, 일정 표시를 담은 포스터형 홈 화면 위젯\n- GIF 표지는 앱 안에서 재생하고 위젯에서는 안정적인 정지 포스터로 표시\n- 한국어, 영어, 일본어, 중국어(간체/번체), 포르투갈어(브라질), 독일어, 프랑스어, 스페인어 지원\n\nGoogle Calendar 연결은 사용자가 직접 선택한 경우에만 활성화돼요. 연결하지 않아도 로컬 일정과 월별 표지를 계속 사용할 수 있어요.",
    "seoTitle": "Lunary - 한 달을 꾸미는 감성 캘린더",
    "seoDescription": "Lunary는 로컬 일정과 월별 표지·스티커, 선택형 Google Calendar 동기화, 포스터형 홈 화면 위젯을 제공하는 감성 월간 캘린더예요.",
    "faqTitle": "자주 묻는 질문",
    "faq": [
      {
        "question": "Google Calendar 없이도 Lunary를 쓸 수 있나요?",
        "answer": "네. Lunary의 로컬 캘린더와 월별 표지는 로그인 없이 오프라인으로 사용할 수 있어요. Google Calendar는 사용자가 직접 연결할 때만 활성화돼요."
      },
      {
        "question": "Google Calendar에는 무엇이 동기화되나요?",
        "answer": "Google Calendar를 연결하고 편집 가능한 캘린더를 선택하면 Lunary가 동기화에 필요한 캘린더 목록과 일정 변경을 읽고, 동기화된 일정의 제목과 날짜·시간을 생성·수정·삭제할 수 있어요. 월별 표지 이미지, 스티커, 로컬 일정 메모는 Google로 보내지 않아요."
      },
      {
        "question": "월별 표지는 서로 따로 저장되나요?",
        "answer": "네. 달마다 배경과 스티커 배치를 따로 저장하고 스티커의 위치·크기·회전·레이어 순서도 함께 보존해요."
      },
      {
        "question": "GIF 표지는 홈 화면 위젯에서 어떻게 보이나요?",
        "answer": "GIF 표지는 Lunary 앱 안에서 움직일 수 있지만 홈 화면 위젯에서는 읽기 쉽고 안정적인 정지 포스터로 표시해요."
      }
    ]
  },
  "ja": {
    "subtitle": "ひと月を表紙のように飾って残す、感性派の月間カレンダー。",
    "body": "Lunaryは、予定を詰め込む生産性アプリではなく、ひと月の空気や記憶を大切に残すための月間カレンダーです。\n\n月間画面で予定を記録し、月ごとに背景とステッカーで自分だけの表紙を飾れます。完成したひと月は、ホーム画面でもポスター風ウィジェットとして楽しめます。 Google カレンダーとの連携は任意です。連携しなくても、Lunary のローカルカレンダーと表紙機能はログイン不要・オフラインで使えます。必要なときだけ Google カレンダーを接続し、編集するカレンダーを選んで予定を双方向に同期できます。\n\n## 主な機能\n\n- ひと月を主役にした月間カレンダー\n- ログイン不要のローカル予定の追加・編集・削除\n- 月ごとに独立して保存される背景とステッカーの表紙\n- ステッカーの位置・サイズ・回転・重なり順の編集\n- 任意の Google カレンダー連携と予定の双方向同期\n- 表紙・月間カレンダー・予定マークをまとめたポスター風ホーム画面ウィジェット\n- GIF 表紙はアプリ内で再生し、ウィジェットでは安定した静止ポスターとして表示\n- 英語、韓国語、日本語、中国語（簡体字／繁体字）、ブラジルポルトガル語、ドイツ語、フランス語、スペイン語に対応\n\nGoogle カレンダーは、ユーザーが明示的に接続した場合にのみ有効になります。接続しなくても、ローカル予定と月ごとの表紙はそのまま使えます。",
    "seoTitle": "Lunary - ひと月を飾る月間カレンダー",
    "seoDescription": "Lunaryは、ローカル予定、月ごとの表紙とステッカー、任意のGoogleカレンダー同期、ポスター風ウィジェットを備えた月間カレンダーです。",
    "faqTitle": "よくある質問",
    "faq": [
      {
        "question": "Google カレンダーなしでも Lunary を使えますか？",
        "answer": "はい。Lunary のローカルカレンダーと月ごとの表紙は、ログインなしでオフライン利用できます。Google カレンダーは自分で接続した場合にだけ有効になります。"
      },
      {
        "question": "Google カレンダーとは何が同期されますか？",
        "answer": "Google カレンダーを接続して編集可能なカレンダーを選ぶと、Lunary は同期に必要なカレンダー一覧と予定の変更を読み取り、同期対象の予定のタイトルと日付・時刻を作成・更新・削除できます。月ごとの表紙画像、ステッカー、ローカル予定のメモは Google へ送信しません。"
      },
      {
        "question": "月ごとの表紙は別々に保存されますか？",
        "answer": "はい。各月に背景とステッカー配置を個別に保存し、位置・サイズ・回転・重なり順も保持します。"
      },
      {
        "question": "GIF の表紙はホーム画面ウィジェットでどう表示されますか？",
        "answer": "GIF の表紙は Lunary 内では動かせますが、ホーム画面ウィジェットでは読みやすく安定した静止ポスターとして表示します。"
      }
    ]
  },
  "zh-Hant": {
    "subtitle": "把每個月妝點成封面，留下值得珍藏的月曆。",
    "body": "Lunary 是一款以「一個月」為主角的月曆，比起堆滿待辦，更重視每個月的氛圍、記憶與留戀。\n\n在月曆畫面記錄行程，再用背景和貼紙為每個月打造專屬封面。完成後，也能把這個月以海報風格的小工具放在主畫面上欣賞。 Google 日曆連接完全由你決定。即使不登入、不連接 Google，Lunary 的本機行程與封面功能仍可離線使用。需要時再連接 Google 日曆，選擇允許編輯的日曆，並雙向同步行程。\n\n## 主要功能\n\n- 以一整個月為主角的月曆\n- 不用登入即可新增、編輯與刪除本機行程\n- 每個月獨立儲存背景與貼紙封面\n- 編輯貼紙位置、大小、旋轉與圖層順序\n- 選擇性連接 Google 日曆並雙向同步行程\n- 將封面、月曆與行程標記整合在海報風格的主畫面小工具\n- GIF 封面在 App 內播放，在小工具中顯示為穩定的靜態海報\n- 支援英文、韓文、日文、簡體中文、繁體中文、巴西葡萄牙文、德文、法文與西班牙文介面\n\n只有在你主動連接時，Google 日曆功能才會啟用。即使沒有 Google 連接，本機行程與每月封面仍可繼續使用。",
    "seoTitle": "Lunary - 把每個月妝點成封面的月曆",
    "seoDescription": "Lunary 是一款月曆，可記錄本機行程、裝飾每月封面與貼紙，並可選擇同步 Google 日曆與使用海報風格主畫面小工具。",
    "faqTitle": "常見問題",
    "faq": [
      {
        "question": "不連接 Google 日曆也能使用 Lunary 嗎？",
        "answer": "可以。Lunary 的本機月曆與每月封面不需登入即可離線使用。只有在你主動連接時，Google 日曆功能才會啟用。"
      },
      {
        "question": "Lunary 會與 Google 日曆同步哪些內容？",
        "answer": "連接 Google 日曆並選擇可編輯的日曆後，Lunary 會讀取同步所需的日曆清單與行程變更，並可建立、更新或刪除同步行程的標題與日期時間。每月封面圖片、貼紙與本機行程備註不會傳送給 Google。"
      },
      {
        "question": "每個月的封面會分開儲存嗎？",
        "answer": "會。每個月會獨立儲存背景與貼紙配置，包括貼紙的位置、大小、旋轉與圖層順序。"
      },
      {
        "question": "GIF 封面在主畫面小工具中如何顯示？",
        "answer": "GIF 封面可以在 Lunary App 內播放，但主畫面小工具會使用穩定的靜態海報，以保持清楚與輕量。"
      }
    ]
  },
  "zh-Hans": {
    "subtitle": "把每个月装点成封面，留下值得珍藏的月度日历。",
    "body": "Lunary 是一款以“一个月”为主角的月度日历。相比堆满待办事项，它更关注每个月的氛围、记忆与留恋。\n\n在月历视图中记录日程，再用背景和贴纸为每个月打造专属封面。完成后，还可以把这个月作为海报式小组件放在主屏幕上欣赏。 Google 日历连接完全可选。不登录、不连接 Google，也能离线使用 Lunary 的本地日程和封面功能。需要时再连接 Google 日历，选择允许编辑的日历，并双向同步日程。\n\n## 主要功能\n\n- 以整个月为主角的月度日历\n- 无需登录即可添加、编辑和删除本地日程\n- 每个月独立保存背景与贴纸封面\n- 编辑贴纸位置、大小、旋转和图层顺序\n- 可选 Google 日历连接与日程双向同步\n- 将封面、月历和日程标记整合在海报式主屏幕小组件中\n- GIF 封面在应用内播放，在小组件中显示为稳定的静态海报\n- 支持英语、韩语、日语、简体中文、繁体中文、巴西葡萄牙语、德语、法语和西班牙语界面\n\n只有在你主动连接时，Google 日历功能才会启用。即使没有 Google 连接，本地日程和每月封面仍可继续使用。",
    "seoTitle": "Lunary - 把每个月装点成封面的月历",
    "seoDescription": "Lunary 是一款月度日历，可记录本地日程、装饰每月封面与贴纸，并可选择同步 Google 日历和使用海报式主屏幕小组件。",
    "faqTitle": "常见问题",
    "faq": [
      {
        "question": "不连接 Google 日历也能使用 Lunary 吗？",
        "answer": "可以。Lunary 的本地日历和每月封面无需登录即可离线使用。只有当你主动连接时，Google 日历功能才会启用。"
      },
      {
        "question": "Lunary 会与 Google 日历同步哪些内容？",
        "answer": "连接 Google 日历并选择可编辑的日历后，Lunary 会读取同步所需的日历列表和日程变更，并可创建、更新或删除同步日程的标题和日期时间。每月封面图片、贴纸和本地日程备注不会发送给 Google。"
      },
      {
        "question": "每个月的封面会分别保存吗？",
        "answer": "会。每个月会独立保存背景和贴纸布局，包括贴纸的位置、大小、旋转和图层顺序。"
      },
      {
        "question": "GIF 封面在主屏幕小组件中如何显示？",
        "answer": "GIF 封面可以在 Lunary 应用内播放，但主屏幕小组件会使用稳定的静态海报，以保持清晰和轻量。"
      }
    ]
  },
  "pt-BR": {
    "subtitle": "Um calendário mensal para transformar cada mês em uma capa para guardar.",
    "body": "Lunary é um calendário que coloca o mês em primeiro plano, feito para guardar memórias, clima e carinho em vez de acumular tarefas de produtividade.\n\nRegistre eventos em uma visão mensal tranquila e dê a cada mês sua própria capa com fundo e adesivos. Quando terminar, você também pode manter o mês na tela inicial em um widget com visual de pôster. A conexão com o Google Agenda é opcional. O calendário local e as ferramentas de capa do Lunary funcionam offline e sem login. Quando quiser conectar o Google Agenda, você escolhe a agenda editável e pode sincronizar eventos nos dois sentidos.\n\n## Principais recursos\n\n- Calendário mensal com o mês como protagonista\n- Criar, editar e excluir eventos locais sem login\n- Uma capa com fundo e adesivos salva separadamente para cada mês\n- Controles de posição, tamanho, rotação e camada dos adesivos\n- Conexão opcional com o Google Agenda e sincronização bidirecional de eventos\n- Widget em estilo de pôster com capa, calendário mensal e indicadores de eventos\n- Capas em GIF animadas no app e exibidas como pôster estático e estável no widget\n- Interface em inglês, coreano, japonês, chinês simplificado e tradicional, português do Brasil, alemão, francês e espanhol\n\nO Google Agenda só é ativado quando você escolhe conectá-lo. Eventos locais e capas mensais continuam disponíveis sem uma conexão com o Google.",
    "seoTitle": "Lunary - Calendário mensal com capas",
    "seoDescription": "Lunary é um calendário mensal com eventos locais, capas e adesivos por mês, sincronização opcional com o Google Agenda e widget em estilo de pôster.",
    "faqTitle": "Perguntas frequentes",
    "faq": [
      {
        "question": "Posso usar o Lunary sem o Google Agenda?",
        "answer": "Sim. O calendário local e as capas mensais do Lunary funcionam offline e sem login. O Google Agenda só é ativado quando você decide conectá-lo."
      },
      {
        "question": "O que o Lunary sincroniza com o Google Agenda?",
        "answer": "Depois de conectar o Google Agenda e escolher uma agenda editável, o Lunary lê a lista de agendas e as alterações de eventos necessárias à sincronização e pode criar, atualizar ou excluir o título e a data/horário dos eventos sincronizados. Imagens de capa, adesivos e notas locais não são enviados ao Google."
      },
      {
        "question": "As capas de cada mês ficam separadas?",
        "answer": "Sim. Cada mês guarda seu próprio fundo e layout de adesivos, incluindo posição, tamanho, rotação e ordem das camadas."
      },
      {
        "question": "Como capas em GIF aparecem no widget da tela inicial?",
        "answer": "Capas em GIF podem ser animadas dentro do Lunary. No widget da tela inicial, elas usam um pôster estático e estável para manter o mês legível e leve."
      }
    ]
  },
  "de": {
    "subtitle": "Ein Monatskalender, der jeden Monat in ein Cover zum Behalten verwandelt.",
    "body": "Lunary ist ein Monatskalender, bei dem Erinnerungen, Stimmung und persönliche Verbundenheit wichtiger sind als möglichst viele Produktivitätsfunktionen.\n\nHalte Termine in einer ruhigen Monatsansicht fest und gestalte für jeden Monat ein eigenes Cover mit Hintergrund und Stickern. Den fertigen Monat kannst du auch als Poster-Widget auf dem Home-Bildschirm behalten. Die Verbindung mit Google Kalender ist optional. Der lokale Kalender und die Cover-Funktionen von Lunary funktionieren offline und ohne Anmeldung. Wenn du Google Kalender verbinden möchtest, wählst du den bearbeitbaren Kalender aus und kannst Termine in beide Richtungen synchronisieren.\n\n## Hauptfunktionen\n\n- Monatskalender, bei dem der Monat im Mittelpunkt steht\n- Lokale Termine ohne Anmeldung erstellen, bearbeiten und löschen\n- Für jeden Monat ein separat gespeichertes Cover mit Hintergrund und Stickern\n- Position, Größe, Drehung und Ebenenreihenfolge von Stickern bearbeiten\n- Optionale Verbindung mit Google Kalender und bidirektionale Terminsynchronisierung\n- Poster-Widget für den Home-Bildschirm mit Cover, Monatskalender und Terminmarkierungen\n- Animierte GIF-Cover in der App und ein stabiles Standbild im Widget\n- Oberfläche auf Englisch, Koreanisch, Japanisch, vereinfachtem und traditionellem Chinesisch, brasilianischem Portugiesisch, Deutsch, Französisch und Spanisch\n\nGoogle Kalender wird nur aktiviert, wenn du ihn ausdrücklich verbindest. Lokale Termine und Monatscover bleiben auch ohne Google-Verbindung verfügbar.",
    "seoTitle": "Lunary - Monatskalender mit gestaltbaren Covern",
    "seoDescription": "Lunary ist ein Monatskalender für lokale Termine, monatliche Cover und Sticker, optionale Google-Kalender-Synchronisierung und ein Poster-Widget.",
    "faqTitle": "Häufige Fragen",
    "faq": [
      {
        "question": "Kann ich Lunary ohne Google Kalender verwenden?",
        "answer": "Ja. Der lokale Kalender und die Monatscover funktionieren offline und ohne Anmeldung. Google Kalender wird nur aktiviert, wenn du ihn selbst verbindest."
      },
      {
        "question": "Was synchronisiert Lunary mit Google Kalender?",
        "answer": "Nach dem Verbinden und der Auswahl eines bearbeitbaren Kalenders liest Lunary die für die Synchronisierung nötige Kalenderliste und Terminänderungen und kann Titel sowie Datum und Uhrzeit synchronisierter Termine erstellen, ändern oder löschen. Coverbilder, Sticker und lokale Terminnotizen werden nicht an Google gesendet."
      },
      {
        "question": "Werden Monatscover getrennt gespeichert?",
        "answer": "Ja. Jeder Monat speichert seinen eigenen Hintergrund und sein Sticker-Layout einschließlich Position, Größe, Drehung und Ebenenreihenfolge."
      },
      {
        "question": "Wie erscheinen GIF-Cover im Home-Bildschirm-Widget?",
        "answer": "GIF-Cover können in Lunary animiert sein. Das Home-Bildschirm-Widget verwendet ein stabiles Standbild, damit der Monat gut lesbar und ressourcenschonend bleibt."
      }
    ]
  },
  "fr": {
    "subtitle": "Un calendrier mensuel pour transformer chaque mois en couverture à garder.",
    "body": "Lunary est un calendrier centré sur le mois, pensé pour conserver des souvenirs, une ambiance et un attachement plutôt que pour accumuler les fonctions de productivité.\n\nNotez vos événements dans une vue mensuelle apaisée, puis créez pour chaque mois une couverture avec un fond et des autocollants. Une fois terminé, votre mois peut aussi rester sur l’écran d’accueil sous la forme d’un widget façon affiche. La connexion à Google Agenda est facultative. Le calendrier local et les outils de couverture de Lunary fonctionnent hors ligne, sans connexion à un compte. Si vous souhaitez connecter Google Agenda, vous choisissez l’agenda modifiable et pouvez synchroniser les événements dans les deux sens.\n\n## Fonctions principales\n\n- Calendrier mensuel où le mois est au premier plan\n- Création, modification et suppression d’événements locaux sans connexion\n- Une couverture avec fond et autocollants enregistrée séparément pour chaque mois\n- Réglage de la position, de la taille, de la rotation et de l’ordre des calques des autocollants\n- Connexion facultative à Google Agenda avec synchronisation bidirectionnelle des événements\n- Widget façon affiche sur l’écran d’accueil avec couverture, calendrier mensuel et repères d’événements\n- Couvertures GIF animées dans l’app et affichées comme une image fixe stable dans le widget\n- Interface en anglais, coréen, japonais, chinois simplifié et traditionnel, portugais du Brésil, allemand, français et espagnol\n\nGoogle Agenda n’est activé que si vous choisissez explicitement de le connecter. Les événements locaux et les couvertures mensuelles restent disponibles sans connexion à Google.",
    "seoTitle": "Lunary - Calendrier mensuel à personnaliser",
    "seoDescription": "Lunary est un calendrier mensuel avec événements locaux, couvertures et autocollants par mois, synchronisation Google Agenda facultative et widget façon affiche.",
    "faqTitle": "Questions fréquentes",
    "faq": [
      {
        "question": "Puis-je utiliser Lunary sans Google Agenda ?",
        "answer": "Oui. Le calendrier local et les couvertures mensuelles de Lunary fonctionnent hors ligne et sans connexion. Google Agenda n’est activé que si vous choisissez de le connecter."
      },
      {
        "question": "Que synchronise Lunary avec Google Agenda ?",
        "answer": "Après connexion et choix d’un agenda modifiable, Lunary lit la liste des agendas et les changements d’événements nécessaires à la synchronisation, puis peut créer, modifier ou supprimer le titre et la date ou l’heure des événements synchronisés. Les images de couverture, autocollants et notes locales ne sont pas envoyés à Google."
      },
      {
        "question": "Les couvertures mensuelles sont-elles enregistrées séparément ?",
        "answer": "Oui. Chaque mois conserve son propre fond et sa disposition d’autocollants, y compris la position, la taille, la rotation et l’ordre des calques."
      },
      {
        "question": "Comment les couvertures GIF apparaissent-elles dans le widget ?",
        "answer": "Les couvertures GIF peuvent être animées dans Lunary. Le widget de l’écran d’accueil utilise une affiche fixe et stable pour rester lisible et léger."
      }
    ]
  },
  "es": {
    "subtitle": "Un calendario mensual para convertir cada mes en una portada para guardar.",
    "body": "Lunary es un calendario centrado en el mes, pensado para conservar recuerdos, ambiente y apego en lugar de acumular funciones de productividad.\n\nGuarda eventos en una vista mensual tranquila y dale a cada mes su propia portada con un fondo y pegatinas. Cuando termines, también puedes mantener ese mes en la pantalla de inicio como un widget con estilo de póster. La conexión con Google Calendar es opcional. El calendario local y las herramientas de portada de Lunary funcionan sin conexión y sin iniciar sesión. Cuando quieras conectar Google Calendar, eliges el calendario editable y puedes sincronizar eventos en ambas direcciones.\n\n## Funciones principales\n\n- Calendario mensual con el mes como protagonista\n- Crear, editar y eliminar eventos locales sin iniciar sesión\n- Una portada con fondo y pegatinas guardada por separado para cada mes\n- Controles de posición, tamaño, rotación y orden de capas de las pegatinas\n- Conexión opcional con Google Calendar y sincronización bidireccional de eventos\n- Widget tipo póster en la pantalla de inicio con portada, calendario mensual e indicadores de eventos\n- Portadas GIF animadas en la app y mostradas como una imagen fija estable en el widget\n- Interfaz en inglés, coreano, japonés, chino simplificado y tradicional, portugués de Brasil, alemán, francés y español\n\nGoogle Calendar solo se activa cuando eliges conectarlo explícitamente. Los eventos locales y las portadas mensuales siguen disponibles sin conexión con Google.",
    "seoTitle": "Lunary - Calendario mensual con portadas",
    "seoDescription": "Lunary es un calendario mensual con eventos locales, portadas y pegatinas por mes, sincronización opcional con Google Calendar y widget tipo póster.",
    "faqTitle": "Preguntas frecuentes",
    "faq": [
      {
        "question": "¿Puedo usar Lunary sin Google Calendar?",
        "answer": "Sí. El calendario local y las portadas mensuales de Lunary funcionan sin conexión y sin iniciar sesión. Google Calendar solo se activa cuando decides conectarlo."
      },
      {
        "question": "¿Qué sincroniza Lunary con Google Calendar?",
        "answer": "Después de conectar Google Calendar y elegir un calendario editable, Lunary lee la lista de calendarios y los cambios de eventos necesarios para sincronizar y puede crear, actualizar o eliminar el título y la fecha u hora de los eventos sincronizados. Las imágenes de portada, pegatinas y notas locales no se envían a Google."
      },
      {
        "question": "¿Las portadas de cada mes se guardan por separado?",
        "answer": "Sí. Cada mes conserva su propio fondo y diseño de pegatinas, incluida la posición, el tamaño, la rotación y el orden de capas."
      },
      {
        "question": "¿Cómo aparecen las portadas GIF en el widget de inicio?",
        "answer": "Las portadas GIF pueden animarse dentro de Lunary. El widget de la pantalla de inicio usa un póster fijo y estable para mantener el mes legible y ligero."
      }
    ]
  }
} satisfies Record<AllSiteLocale, LunaryProductCopy>;

export function getLunaryProductCopy(locale: AllSiteLocale): LunaryProductCopy {
  return copy[locale];
}
