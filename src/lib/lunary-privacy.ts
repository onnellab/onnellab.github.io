import type { AllSiteLocale } from './extended-site-i18n';

export type LunaryPrivacySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LunaryPrivacyCopy = {
  title: string;
  description: string;
  intro: string;
  updatedLabel: string;
  updatedValue: string;
  heading: string;
  opening: string;
  privacyHubLabel: string;
  sections: LunaryPrivacySection[];
};

const policies = {
  "en": {
    "title": "Lunary Privacy Policy",
    "description": "Privacy Policy for the Lunary calendar app and its optional Google Calendar connection.",
    "intro": "This Privacy Policy applies to the Lunary app provided by ONNELLAB.",
    "updatedLabel": "Last updated",
    "updatedValue": "2026-09-27",
    "heading": "Privacy Policy",
    "opening": "Lunary values your privacy. Local calendar and cover features work without sign-in; Google Calendar access is optional and user-initiated.",
    "privacyHubLabel": "All privacy policies",
    "sections": [
      {
        "title": "1. Accounts and direct identifiers",
        "paragraphs": [
          "Lunary’s local calendar and monthly cover features require no account. If you explicitly connect Google Calendar, Google Sign-In provides the basic account information needed to show which Google account is connected. Lunary stores the selected Google account ID and calendar ID needed for synchronization, but it does not store Google OAuth access or refresh tokens in its own app data or logs."
        ]
      },
      {
        "title": "2. Data accessed or stored on the device",
        "items": [
          "Local event data such as title, date, optional start and end time, note, edit state, and deletion state",
          "Monthly cover data such as selected background files, generated previews and widget posters, sticker files, positions, sizes, rotations, opacity, and layer order",
          "When Google Calendar is connected: synchronization metadata such as Google account, calendar and event identifiers, ETags, update timestamps, synchronization state, and the time of the last synchronization check"
        ],
        "paragraphs": [
          "Local events and monthly covers remain on the device. Cover images, stickers, and local event notes are not sent to Google Calendar or to an ONNELLAB server."
        ]
      },
      {
        "title": "3. Optional Google Calendar data transfer",
        "paragraphs": [
          "Only after you connect Google Calendar, Lunary communicates directly with Google Calendar APIs. It reads writable calendar identifiers and names plus event identifiers, titles, start/end values, update state, and synchronization metadata needed for two-way sync. Lunary may create, update, or delete event titles and date/time values in the selected calendar and uses private event identifiers to avoid duplicate events. Monthly cover images, stickers, and local event notes are not transmitted to Google. ONNELLAB does not operate an intermediary server for this synchronization."
        ]
      },
      {
        "title": "4. App store services and payment information",
        "paragraphs": [
          "Lunary Pro is an optional one-time, non-consumable purchase handled by Apple App Store or Google Play under their own policies. Downloads, purchases, refunds, restores, and related store-account information are processed by the platform store. Lunary keeps only the last store-verified Pro entitlement locally so verified Pro can remain available offline. Lunary and ONNELLAB do not access or store payment-card or bank-account details."
        ]
      },
      {
        "title": "5. Advertising, analytics, sharing, and Google user data",
        "paragraphs": [
          "Lunary does not use advertising SDKs, behavioral analytics SDKs, or third-party tracking tools, and it does not sell personal data. Google user data is used only to provide the Google Calendar connection and synchronization requested by the user. Lunary’s use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements."
        ]
      },
      {
        "title": "6. Retention, disconnection, and deletion",
        "paragraphs": [
          "App-managed local events, covers, stickers, previews, and synchronization metadata remain on the device until removed through the applicable app controls or by uninstalling the app. Disconnecting Google Calendar stops future calendar access and clears the connection-enabled and selected-calendar settings; locally stored Lunary events remain on the device. Data already stored in Google Calendar remains subject to the user’s Google account settings and Google’s retention rules. ONNELLAB does not keep copies of synchronized Google Calendar content on its own servers."
        ]
      },
      {
        "title": "7. Security and children's privacy",
        "paragraphs": [
          "Google authorization credentials are managed by Google Sign-In and are not stored directly by Lunary. Network requests to Google Calendar use HTTPS, and ONNELLAB applies reasonable technical and organizational safeguards to data the app must handle. Lunary is not directed to children under 13 and does not knowingly collect personal information from children."
        ]
      },
      {
        "title": "8. Changes and contact",
        "paragraphs": [
          "If Lunary functionality, Google integration, legal requirements, or store requirements change, this policy will be updated and the last-updated date will change.",
          "Privacy questions or deletion requests: onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "ko": {
    "title": "Lunary 개인정보 처리방침",
    "description": "Lunary 캘린더 앱과 선택적인 Google Calendar 연동에 관한 개인정보 처리방침입니다.",
    "intro": "이 개인정보 처리방침은 ONNELLAB이 제공하는 Lunary 앱에 적용됩니다.",
    "updatedLabel": "최종 업데이트",
    "updatedValue": "2026-09-27",
    "heading": "개인정보 처리방침",
    "opening": "Lunary는 사용자의 개인정보를 중요하게 생각합니다. 로컬 캘린더와 표지 기능은 로그인 없이 사용할 수 있고 Google Calendar 접근은 사용자가 직접 선택한 경우에만 활성화됩니다.",
    "privacyHubLabel": "모든 개인정보 처리방침",
    "sections": [
      {
        "title": "1. 계정 및 개인 식별 정보",
        "paragraphs": [
          "Lunary의 로컬 캘린더와 월별 표지 기능에는 계정이 필요하지 않습니다. 사용자가 Google Calendar를 직접 연결하면 Google Sign-In이 연결된 계정을 표시하고 식별하는 데 필요한 계정 정보를 제공합니다. Lunary는 동기화에 필요한 선택된 Google 계정 ID와 캘린더 ID를 기기에 저장하지만, Google OAuth 액세스 토큰 또는 리프레시 토큰을 Lunary가 관리하는 앱 데이터나 로그에 저장하지 않습니다."
        ]
      },
      {
        "title": "2. 앱이 접근하거나 기기에 저장하는 데이터",
        "items": [
          "제목, 날짜, 선택적인 시작·종료 시각, 메모, 수정 상태, 삭제 상태 등 로컬 일정 데이터",
          "선택한 배경 파일, 생성된 미리보기와 위젯 포스터, 스티커 파일, 위치·크기·회전·투명도·레이어 순서 등 월별 표지 데이터",
          "Google Calendar 연결 시 Google 계정·캘린더·일정 ID, ETag, 업데이트 시각, 동기화 상태, 마지막 동기화 확인 시각 등 동기화 메타데이터"
        ],
        "paragraphs": [
          "로컬 일정과 월별 표지는 기기에 저장됩니다. 표지 이미지, 스티커, 로컬 일정 메모는 Google Calendar나 ONNELLAB 서버로 전송하지 않습니다."
        ]
      },
      {
        "title": "3. 선택적인 Google Calendar 데이터 전송",
        "paragraphs": [
          "사용자가 Google Calendar를 연결한 뒤에만 Lunary가 Google Calendar API와 직접 통신합니다. 양방향 동기화에 필요한 편집 가능한 캘린더의 ID와 이름, 일정 ID·제목·시작/종료 값·업데이트 상태·동기화 메타데이터를 읽습니다. 선택한 캘린더에서 동기화 일정의 제목과 날짜·시간을 생성·수정·삭제할 수 있고, 중복 생성을 막기 위한 비공개 일정 식별 정보를 사용합니다. 월별 표지 이미지, 스티커, 로컬 일정 메모는 Google로 전송하지 않습니다. 이 동기화를 중계하는 ONNELLAB 서버는 없습니다."
        ]
      },
      {
        "title": "4. 앱 스토어 서비스 및 결제 정보",
        "paragraphs": [
          "Lunary Pro는 Apple App Store 또는 Google Play가 자체 정책에 따라 처리하는 선택형 1회성 비소모성 구매입니다. 다운로드, 구매, 환불, 복원 및 관련 스토어 계정 정보는 플랫폼 스토어가 처리합니다. Lunary는 스토어에서 확인된 마지막 Pro 권리 상태만 기기에 저장해, 확인된 Pro를 오프라인에서도 사용할 수 있게 합니다. Lunary와 ONNELLAB은 결제 카드 정보나 은행계좌 정보에 접근하거나 저장하지 않습니다."
        ]
      },
      {
        "title": "5. 광고, 분석, 제3자 제공 및 Google 사용자 데이터",
        "paragraphs": [
          "Lunary는 광고 SDK, 사용자 행동 분석 SDK, 제3자 추적 도구를 사용하지 않으며 개인정보를 판매하지 않습니다. Google 사용자 데이터는 사용자가 요청한 Google Calendar 연결 및 동기화 기능을 제공하는 목적으로만 사용합니다. Lunary가 Google API에서 받은 정보를 사용하거나 전송하는 방식은 Limited Use 요구사항을 포함한 Google API Services User Data Policy를 준수합니다."
        ]
      },
      {
        "title": "6. 보관, 연결 해제 및 삭제",
        "paragraphs": [
          "앱이 관리하는 로컬 일정, 표지, 스티커, 미리보기 및 동기화 메타데이터는 해당 앱 기능으로 삭제하거나 앱을 제거할 때까지 기기에 남을 수 있습니다. Google Calendar 연결을 해제하면 이후 캘린더 접근을 중지하고 연결 활성화 및 선택 캘린더 설정을 지우며, Lunary에 로컬로 저장된 일정은 기기에 남습니다. 이미 Google Calendar에 저장된 데이터에는 사용자의 Google 계정 설정과 Google의 보관 정책이 적용됩니다. ONNELLAB 서버는 동기화된 Google Calendar 콘텐츠의 사본을 보관하지 않습니다."
        ]
      },
      {
        "title": "7. 보안 및 아동의 개인정보",
        "paragraphs": [
          "Google 인증 정보는 Google Sign-In에서 관리하며 Lunary가 직접 저장하지 않습니다. Google Calendar 네트워크 요청은 HTTPS를 사용하며 ONNELLAB은 앱이 처리해야 하는 데이터에 합리적인 기술적·관리적 보호조치를 적용합니다. Lunary는 만 13세 미만 아동을 대상으로 설계되지 않았으며 아동의 개인정보를 고의로 수집하지 않습니다."
        ]
      },
      {
        "title": "8. 변경 및 문의",
        "paragraphs": [
          "Lunary 기능, Google 연동, 법적 요구사항 또는 스토어 요구사항이 변경되면 이 방침과 최종 업데이트일도 함께 갱신합니다.",
          "개인정보 관련 문의 또는 삭제 요청: onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "ja": {
    "title": "Lunary プライバシーポリシー",
    "description": "Lunaryカレンダーと任意のGoogleカレンダー連携に関するプライバシーポリシーです。",
    "intro": "本プライバシーポリシーは、ONNELLABが提供するLunaryアプリに適用されます。",
    "updatedLabel": "最終更新日",
    "updatedValue": "2026-09-27",
    "heading": "プライバシーポリシー",
    "opening": "Lunaryはプライバシーを大切にしています。ローカルカレンダーと表紙はログイン不要で、Googleカレンダーへのアクセスは利用者が接続した場合にだけ有効になります。",
    "privacyHubLabel": "すべてのプライバシーポリシー",
    "sections": [
      {
        "title": "1. アカウントと直接識別できる情報",
        "paragraphs": [
          "Lunaryのローカルカレンダーと月ごとの表紙にはアカウントは必要ありません。Googleカレンダーを明示的に接続した場合、Google Sign-Inが接続中のアカウントを表示・識別するための情報を提供します。Lunaryは同期に必要なGoogleアカウントIDと選択したカレンダーIDを端末に保存しますが、Google OAuthのアクセストークンやリフレッシュトークンをLunary自身のデータやログに保存しません。"
        ]
      },
      {
        "title": "2. 端末上でアクセスまたは保存するデータ",
        "items": [
          "タイトル、日付、任意の開始・終了時刻、メモ、編集状態、削除状態などのローカル予定データ",
          "選択した背景、生成したプレビューとウィジェット用ポスター、ステッカー、位置・サイズ・回転・透明度・重なり順などの月別表紙データ",
          "Googleカレンダー接続時のアカウント・カレンダー・予定ID、ETag、更新時刻、同期状態、最終同期確認時刻などの同期メタデータ"
        ],
        "paragraphs": [
          "ローカル予定と月ごとの表紙は端末に保存されます。表紙画像、ステッカー、ローカル予定のメモはGoogleカレンダーやONNELLABサーバーへ送信しません。"
        ]
      },
      {
        "title": "3. 任意のGoogleカレンダーデータ転送",
        "paragraphs": [
          "Googleカレンダーを接続した場合にのみ、LunaryはGoogle Calendar APIと直接通信します。双方向同期に必要な編集可能カレンダーのIDと名前、予定ID・タイトル・開始/終了値・更新状態・同期メタデータを読み取ります。選択したカレンダーで同期予定のタイトルと日付・時刻を作成・更新・削除し、重複を防ぐための非公開の予定識別情報を使用することがあります。月別の表紙画像、ステッカー、ローカル予定のメモはGoogleへ送信しません。ONNELLABはこの同期を中継するサーバーを運用しません。"
        ]
      },
      {
        "title": "4. App Storeサービスと支払い情報",
        "paragraphs": [
          "Lunary Pro は、Apple App Store または Google Play が各社のポリシーに従って処理する任意の買い切り型・非消耗型購入です。ダウンロード、購入、返金、復元、関連するストアアカウント情報はプラットフォームのストアが処理します。Lunary はストアで確認済みの最新の Pro 権利状態だけを端末に保存し、確認済みの Pro をオフラインでも利用できるようにします。Lunary と ONNELLAB は決済カード情報や銀行口座情報へアクセスせず、保存もしません。"
        ]
      },
      {
        "title": "5. 広告、分析、共有、Googleユーザーデータ",
        "paragraphs": [
          "Lunaryは広告SDK、行動分析SDK、第三者追跡ツールを使用せず、個人データを販売しません。Googleユーザーデータは利用者が要求したGoogleカレンダー接続と同期を提供する目的にのみ使用します。Google APIから受け取った情報の利用と転送は、Limited Use要件を含むGoogle API Services User Data Policyに従います。"
        ]
      },
      {
        "title": "6. 保存、接続解除、削除",
        "paragraphs": [
          "アプリが管理するローカル予定、表紙、ステッカー、プレビュー、同期メタデータは、該当する削除操作またはアプリのアンインストールまで端末に残る場合があります。Googleカレンダーの接続を解除すると今後のアクセスを停止し、接続有効状態と選択カレンダー設定を消去しますが、Lunaryにローカル保存された予定は端末に残ります。すでにGoogleカレンダーに保存されたデータにはGoogleアカウント設定とGoogleの保存方針が適用されます。ONNELLABサーバーは同期したGoogleカレンダー内容のコピーを保持しません。"
        ]
      },
      {
        "title": "7. セキュリティと子どものプライバシー",
        "paragraphs": [
          "Googleの認証情報はGoogle Sign-Inが管理し、Lunary自身は保存しません。Googleカレンダーへの通信にはHTTPSを使用し、ONNELLABは必要なデータに合理的な技術上・組織上の保護措置を適用します。Lunaryは13歳未満の子どもを対象としておらず、子どもの個人情報を意図的に収集しません。"
        ]
      },
      {
        "title": "8. 変更とお問い合わせ",
        "paragraphs": [
          "Lunaryの機能、Google連携、法令またはストア要件が変わった場合、本ポリシーと最終更新日を更新します。",
          "プライバシーに関するお問い合わせまたは削除依頼： onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "zh-Hans": {
    "title": "Lunary 隐私政策",
    "description": "Lunary 月度日历及可选 Google 日历连接的隐私政策。",
    "intro": "本隐私政策适用于 ONNELLAB 提供的 Lunary 应用。",
    "updatedLabel": "最后更新",
    "updatedValue": "2026-09-27",
    "heading": "隐私政策",
    "opening": "Lunary 重视用户的隐私。本地日历和封面无需登录即可使用，只有在用户主动连接时才会访问 Google 日历。",
    "privacyHubLabel": "全部隐私政策",
    "sections": [
      {
        "title": "1. 账号与直接身份信息",
        "paragraphs": [
          "Lunary 的本地日历和每月封面无需账号。仅当用户主动连接 Google 日历时，Google Sign-In 才会提供用于显示和识别已连接账号的信息。Lunary 会在设备上保存同步所需的 Google 账号 ID 和所选日历 ID，但不会把 Google OAuth 访问令牌或刷新令牌保存到 Lunary 自身的应用数据或日志中。"
        ]
      },
      {
        "title": "2. 应用在设备上访问或存储的数据",
        "items": [
          "标题、日期、可选开始与结束时间、备注、编辑状态和删除状态等本地日程数据",
          "所选背景、生成的预览和小组件海报、贴纸以及位置、大小、旋转、透明度和图层顺序等每月封面数据",
          "连接 Google 日历时使用的账号、日历和日程 ID、ETag、更新时间、同步状态和最后同步检查时间等同步元数据"
        ],
        "paragraphs": [
          "本地日程和每月封面保存在设备上。封面图片、贴纸和本地日程备注不会发送到 Google 日历或 ONNELLAB 服务器。"
        ]
      },
      {
        "title": "3. 可选的 Google 日历数据传输",
        "paragraphs": [
          "只有在用户连接 Google 日历后，Lunary 才会直接与 Google Calendar API 通信。它会读取双向同步所需的可编辑日历 ID 与名称，以及日程 ID、标题、开始/结束值、更新状态和同步元数据；也可以在所选日历中创建、更新或删除同步日程的标题和日期时间，并使用用于防止重复的私有事件标识。每月封面图片、贴纸和本地日程备注不会发送给 Google。ONNELLAB 不运行用于中转该同步的服务器。"
        ]
      },
      {
        "title": "4. 应用商店服务与支付信息",
        "paragraphs": [
          "Lunary Pro 是由 Apple App Store 或 Google Play 按其政策处理的可选一次性非消耗型购买。下载、购买、退款、恢复购买以及相关商店账号信息均由平台商店处理。Lunary 只在设备上保存最近一次经商店验证的 Pro 权限状态，以便已验证的 Pro 在离线时仍可使用。Lunary 与 ONNELLAB 不会访问或保存支付卡或银行账户信息。"
        ]
      },
      {
        "title": "5. 广告、分析、共享与 Google 用户数据",
        "paragraphs": [
          "Lunary 不使用广告 SDK、行为分析 SDK 或第三方跟踪工具，也不会出售个人数据。Google 用户数据仅用于提供用户主动请求的 Google 日历连接与同步。Lunary 对从 Google API 获取信息的使用和传输遵守 Google API Services User Data Policy，包括 Limited Use 要求。"
        ]
      },
      {
        "title": "6. 保留、断开连接与删除",
        "paragraphs": [
          "应用管理的本地日程、封面、贴纸、预览和同步元数据会保留在设备上，直到通过相应功能删除或卸载应用。断开 Google 日历后，Lunary 会停止后续日历访问并清除连接启用状态和所选日历设置，但已保存在 Lunary 本地的日程仍留在设备上。已存入 Google 日历的数据受用户的 Google 账号设置和 Google 保留规则约束。ONNELLAB 服务器不保存已同步 Google 日历内容的副本。"
        ]
      },
      {
        "title": "7. 安全与儿童隐私",
        "paragraphs": [
          "Google 授权凭据由 Google Sign-In 管理，Lunary 本身不保存这些凭据。访问 Google 日历的网络请求使用 HTTPS，ONNELLAB 对应用必须处理的数据采取合理的技术和组织保护措施。Lunary 并非面向 13 岁以下儿童，也不会故意收集儿童个人信息。"
        ]
      },
      {
        "title": "8. 变更与联系",
        "paragraphs": [
          "如果 Lunary 功能、Google 集成、法律或应用商店要求发生变化，本政策及最后更新日期也会更新。",
          "隐私问题或删除请求：onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "zh-Hant": {
    "title": "Lunary 隱私權政策",
    "description": "Lunary 月曆與選用 Google 日曆連接的隱私權政策。",
    "intro": "本隱私權政策適用於 ONNELLAB 提供的 Lunary 應用程式。",
    "updatedLabel": "最後更新",
    "updatedValue": "2026-09-27",
    "heading": "隱私權政策",
    "opening": "Lunary 重視使用者的隱私。本機月曆與封面不需登入即可使用，只有在使用者主動連接時才會存取 Google 日曆。",
    "privacyHubLabel": "全部隱私權政策",
    "sections": [
      {
        "title": "1. 帳號與直接識別資訊",
        "paragraphs": [
          "Lunary 的本機月曆與每月封面不需要帳號。只有在使用者主動連接 Google 日曆時，Google Sign-In 才會提供顯示與識別已連接帳號所需的資訊。Lunary 會在裝置上儲存同步所需的 Google 帳號 ID 與選取的日曆 ID，但不會把 Google OAuth 存取權杖或重新整理權杖儲存在 Lunary 自身的應用程式資料或記錄中。"
        ]
      },
      {
        "title": "2. 應用程式在裝置上存取或儲存的資料",
        "items": [
          "標題、日期、選用的開始與結束時間、備註、編輯狀態與刪除狀態等本機行程資料",
          "選取的背景、產生的預覽與小工具海報、貼紙，以及位置、大小、旋轉、透明度與圖層順序等每月封面資料",
          "連接 Google 日曆時使用的帳號、日曆與行程 ID、ETag、更新時間、同步狀態與最後同步檢查時間等同步中繼資料"
        ],
        "paragraphs": [
          "本機行程與每月封面儲存在裝置上。封面圖片、貼紙與本機行程備註不會傳送到 Google 日曆或 ONNELLAB 伺服器。"
        ]
      },
      {
        "title": "3. 選用的 Google 日曆資料傳輸",
        "paragraphs": [
          "只有在使用者連接 Google 日曆後，Lunary 才會直接與 Google Calendar API 通訊。它會讀取雙向同步所需的可編輯日曆 ID 與名稱，以及行程 ID、標題、開始/結束值、更新狀態與同步中繼資料；也能在選取的日曆中建立、更新或刪除同步行程的標題與日期時間，並使用防止重複的私有行程識別資訊。每月封面圖片、貼紙與本機行程備註不會傳送給 Google。ONNELLAB 不設置用來中介這項同步的伺服器。"
        ]
      },
      {
        "title": "4. 應用程式商店服務與付款資訊",
        "paragraphs": [
          "Lunary Pro 是由 Apple App Store 或 Google Play 依其政策處理的選用一次性非消耗型購買。下載、購買、退款、恢復購買及相關商店帳戶資訊均由平台商店處理。Lunary 只會在裝置上保留最近一次經商店驗證的 Pro 權利狀態，讓已驗證的 Pro 在離線時仍可使用。Lunary 與 ONNELLAB 不會存取或儲存支付卡或銀行帳戶資訊。"
        ]
      },
      {
        "title": "5. 廣告、分析、分享與 Google 使用者資料",
        "paragraphs": [
          "Lunary 不使用廣告 SDK、行為分析 SDK 或第三方追蹤工具，也不會出售個人資料。Google 使用者資料只用於提供使用者主動要求的 Google 日曆連接與同步。Lunary 對從 Google API 取得資訊的使用與傳輸遵守 Google API Services User Data Policy，包括 Limited Use 要求。"
        ]
      },
      {
        "title": "6. 保留、斷開連接與刪除",
        "paragraphs": [
          "應用程式管理的本機行程、封面、貼紙、預覽與同步中繼資料會保留在裝置上，直到透過相應功能刪除或解除安裝。斷開 Google 日曆後，Lunary 會停止後續日曆存取並清除連接啟用狀態與選取日曆設定，但已在 Lunary 本機儲存的行程仍留在裝置上。已存入 Google 日曆的資料受使用者的 Google 帳號設定與 Google 保留規則約束。ONNELLAB 伺服器不保存已同步 Google 日曆內容的副本。"
        ]
      },
      {
        "title": "7. 安全與兒童隱私",
        "paragraphs": [
          "Google 授權憑證由 Google Sign-In 管理，Lunary 本身不會儲存這些憑證。存取 Google 日曆的網路要求使用 HTTPS，ONNELLAB 對應用程式必須處理的資料採取合理的技術與組織保護措施。Lunary 並非針對 13 歲以下兒童，也不會刻意蒐集兒童個人資訊。"
        ]
      },
      {
        "title": "8. 變更與聯絡",
        "paragraphs": [
          "若 Lunary 功能、Google 整合、法律或應用程式商店要求有所變更，本政策與最後更新日期也會更新。",
          "隱私相關問題或刪除要求：onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "pt-BR": {
    "title": "Política de Privacidade do Lunary",
    "description": "Política de Privacidade do calendário Lunary e da conexão opcional com o Google Agenda.",
    "intro": "Esta Política de Privacidade se aplica ao app Lunary, fornecido pela ONNELLAB.",
    "updatedLabel": "Última atualização",
    "updatedValue": "2026-09-27",
    "heading": "Política de Privacidade",
    "opening": "O Lunary respeita a privacidade dos usuários. O calendário local e as capas funcionam sem login; o acesso ao Google Agenda é opcional e iniciado pelo usuário.",
    "privacyHubLabel": "Todas as políticas de privacidade",
    "sections": [
      {
        "title": "1. Contas e identificadores diretos",
        "paragraphs": [
          "O calendário local e as capas mensais do Lunary não exigem conta. Se o usuário conectar explicitamente o Google Agenda, o Google Sign-In fornece as informações necessárias para exibir e identificar a conta conectada. O Lunary armazena no dispositivo o ID da conta Google e o ID da agenda selecionada necessários à sincronização, mas não persiste tokens de acesso ou atualização do Google OAuth no SQLite, nas preferências, nos logs ou em arquivos próprios do app."
        ]
      },
      {
        "title": "2. Dados acessados ou armazenados no dispositivo",
        "items": [
          "Eventos locais: título, data, horários opcionais de início e fim, nota, estado de edição e exclusão",
          "Dados mensais de capa: fundo escolhido, prévias e pôsteres de widget, adesivos, posição, tamanho, rotação, opacidade e ordem de camadas",
          "Com Google Agenda conectado: IDs de conta, agenda e evento, ETags, datas de atualização, estado de sincronização e horário da última verificação de sincronização"
        ],
        "paragraphs": [
          "Eventos locais e capas mensais permanecem no dispositivo. Imagens de capa, adesivos e notas locais não são enviados ao Google Agenda nem a servidores da ONNELLAB."
        ]
      },
      {
        "title": "3. Transferência opcional de dados do Google Agenda",
        "paragraphs": [
          "Somente após a conexão, o Lunary se comunica diretamente com as APIs do Google Agenda. Ele lê IDs e nomes de agendas editáveis, além de IDs, títulos, início/fim, estado de atualização e metadados necessários à sincronização bidirecional. Pode criar, atualizar ou excluir títulos e datas/horários dos eventos sincronizados na agenda escolhida e usar identificadores privados de evento para evitar duplicatas. Capas, adesivos e notas locais não são enviados ao Google. A ONNELLAB não opera servidor intermediário para essa sincronização."
        ]
      },
      {
        "title": "4. Serviços das lojas e informações de pagamento",
        "paragraphs": [
          "O Lunary Pro é uma compra opcional, única e não consumível, processada pela Apple App Store ou pelo Google Play segundo as políticas de cada loja. Downloads, compras, reembolsos, restaurações e informações relacionadas à conta da loja são processados pela plataforma. O Lunary mantém no dispositivo apenas o último direito Pro verificado pela loja, para que um Pro já verificado continue disponível offline. Lunary e ONNELLAB não acessam nem armazenam dados de cartão ou conta bancária."
        ]
      },
      {
        "title": "5. Publicidade, análise, compartilhamento e dados do Google",
        "paragraphs": [
          "O Lunary não usa SDKs de publicidade, análise comportamental ou rastreamento de terceiros e não vende dados pessoais. Dados do Google são usados somente para fornecer a conexão e sincronização do Google Agenda solicitadas pelo usuário. O uso e a transferência de informações recebidas das APIs do Google seguem a Google API Services User Data Policy, inclusive os requisitos de Limited Use."
        ]
      },
      {
        "title": "6. Retenção, desconexão e exclusão",
        "paragraphs": [
          "Eventos, capas, adesivos, prévias e metadados de sincronização locais ficam no dispositivo até serem removidos pelos controles aplicáveis ou pela desinstalação. Desconectar o Google Agenda interrompe novos acessos e limpa a configuração de conexão e da agenda selecionada; eventos locais do Lunary permanecem no aparelho. Dados já presentes no Google Agenda seguem as configurações da conta e as regras de retenção do Google. A ONNELLAB não guarda cópias do conteúdo sincronizado em seus servidores."
        ]
      },
      {
        "title": "7. Segurança e privacidade de crianças",
        "paragraphs": [
          "As credenciais de autorização do Google são gerenciadas pelo Google Sign-In e não são armazenadas diretamente pelo Lunary. Requisições ao Google Agenda usam HTTPS, e a ONNELLAB aplica salvaguardas técnicas e organizacionais razoáveis aos dados necessários. O Lunary não é direcionado a menores de 13 anos e não coleta intencionalmente informações pessoais de crianças."
        ]
      },
      {
        "title": "8. Alterações e contato",
        "paragraphs": [
          "Se funções do Lunary, integração com o Google, requisitos legais ou das lojas mudarem, esta política e a data de atualização também serão revisadas.",
          "Dúvidas sobre privacidade ou solicitações de exclusão: onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "de": {
    "title": "Lunary Datenschutzerklärung",
    "description": "Datenschutzerklärung für den Lunary-Monatskalender und die optionale Google-Kalender-Verbindung.",
    "intro": "Diese Datenschutzerklärung gilt für die von ONNELLAB bereitgestellte App Lunary.",
    "updatedLabel": "Zuletzt aktualisiert",
    "updatedValue": "2026-09-27",
    "heading": "Datenschutzerklärung",
    "opening": "Lunary legt Wert auf Datenschutz. Der lokale Kalender und die Monatscover funktionieren ohne Anmeldung; der Zugriff auf Google Kalender ist optional und wird nur nach ausdrücklicher Verbindung aktiviert.",
    "privacyHubLabel": "Alle Datenschutzerklärungen",
    "sections": [
      {
        "title": "1. Konten und direkte Identifikatoren",
        "paragraphs": [
          "Der lokale Kalender und die Monatscover benötigen kein Konto. Wird Google Kalender ausdrücklich verbunden, stellt Google Sign-In die zur Anzeige und Identifikation des verbundenen Kontos erforderlichen Informationen bereit. Lunary speichert die für die Synchronisierung benötigte Google-Konto-ID und die ausgewählte Kalender-ID auf dem Gerät, speichert jedoch keine OAuth-Zugriffs- oder Refresh-Tokens in SQLite, Einstellungen, Logs oder app-eigenen Dateien."
        ]
      },
      {
        "title": "2. Auf dem Gerät verwendete oder gespeicherte Daten",
        "items": [
          "Lokale Termine mit Titel, Datum, optionaler Start- und Endzeit, Notiz sowie Bearbeitungs- und Löschstatus",
          "Monatscover mit ausgewähltem Hintergrund, Vorschauen und Widget-Postern, Stickern, Position, Größe, Drehung, Deckkraft und Ebenenreihenfolge",
          "Bei verbundener Google-Kalender-Funktion: Konto-, Kalender- und Termin-IDs, ETags, Aktualisierungszeiten, Synchronisierungsstatus und Zeitpunkt der letzten Synchronisierungsprüfung"
        ],
        "paragraphs": [
          "Lokale Termine und Monatscover bleiben auf dem Gerät. Coverbilder, Sticker und lokale Terminnotizen werden weder an Google Kalender noch an ONNELLAB-Server übertragen."
        ]
      },
      {
        "title": "3. Optionale Übertragung von Google-Kalender-Daten",
        "paragraphs": [
          "Erst nach dem Verbinden kommuniziert Lunary direkt mit den Google-Calendar-APIs. Es liest IDs und Namen bearbeitbarer Kalender sowie Termin-ID, Titel, Start/Ende, Aktualisierungsstatus und Synchronisierungsmetadaten, die für den bidirektionalen Abgleich nötig sind. Lunary kann Titel und Datum/Uhrzeit synchronisierter Termine im ausgewählten Kalender erstellen, ändern oder löschen und private Termin-IDs verwenden, um Duplikate zu vermeiden. Coverbilder, Sticker und lokale Notizen werden nicht an Google gesendet. ONNELLAB betreibt keinen Zwischenserver für diese Synchronisierung."
        ]
      },
      {
        "title": "4. App-Store-Dienste und Zahlungsinformationen",
        "paragraphs": [
          "Lunary Pro ist ein optionaler einmaliger, nicht verbrauchbarer Kauf, der vom Apple App Store oder von Google Play nach deren jeweiligen Richtlinien verarbeitet wird. Downloads, Käufe, Erstattungen, Wiederherstellungen und zugehörige Store-Kontodaten verarbeitet der Plattform-Store. Lunary speichert auf dem Gerät nur den zuletzt vom Store bestätigten Pro-Anspruch, damit bestätigtes Pro auch offline verfügbar bleibt. Lunary und ONNELLAB greifen nicht auf Karten- oder Bankdaten zu und speichern sie nicht."
        ]
      },
      {
        "title": "5. Werbung, Analyse, Weitergabe und Google-Nutzerdaten",
        "paragraphs": [
          "Lunary verwendet keine Werbe-SDKs, verhaltensbezogenen Analyse-SDKs oder Tracking-Werkzeuge Dritter und verkauft keine personenbezogenen Daten. Google-Nutzerdaten werden nur für die vom Nutzer angeforderte Google-Kalender-Verbindung und Synchronisierung verwendet. Nutzung und Übertragung von Informationen aus Google APIs entsprechen der Google API Services User Data Policy einschließlich der „Limited Use“-Anforderungen."
        ]
      },
      {
        "title": "6. Aufbewahrung, Trennung und Löschung",
        "paragraphs": [
          "Lokale Termine, Cover, Sticker, Vorschauen und Synchronisierungsmetadaten bleiben bis zur Löschung über die entsprechenden Funktionen oder bis zur Deinstallation auf dem Gerät. Das Trennen von Google Kalender beendet künftige Zugriffe und löscht Verbindungs- und Kalenderauswahl-Einstellungen; lokal in Lunary gespeicherte Termine bleiben erhalten. Bereits in Google Kalender gespeicherte Daten unterliegen den Kontoeinstellungen und Aufbewahrungsregeln von Google. ONNELLAB speichert keine Kopien synchronisierter Google-Kalender-Inhalte auf eigenen Servern."
        ]
      },
      {
        "title": "7. Sicherheit und Datenschutz von Kindern",
        "paragraphs": [
          "Google-Autorisierungsdaten werden von Google Sign-In verwaltet und nicht direkt von Lunary gespeichert. Anfragen an Google Kalender verwenden HTTPS; ONNELLAB setzt angemessene technische und organisatorische Schutzmaßnahmen ein. Lunary richtet sich nicht an Kinder unter 13 Jahren und sammelt wissentlich keine personenbezogenen Daten von Kindern."
        ]
      },
      {
        "title": "8. Änderungen und Kontakt",
        "paragraphs": [
          "Wenn sich Lunary-Funktionen, die Google-Integration oder rechtliche bzw. Store-Anforderungen ändern, werden diese Erklärung und das Aktualisierungsdatum angepasst.",
          "Datenschutzfragen oder Löschanfragen: onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "fr": {
    "title": "Politique de confidentialité de Lunary",
    "description": "Politique de confidentialité du calendrier Lunary et de sa connexion facultative à Google Agenda.",
    "intro": "La présente Politique de confidentialité s’applique à l’app Lunary fournie par ONNELLAB.",
    "updatedLabel": "Dernière mise à jour",
    "updatedValue": "2026-09-27",
    "heading": "Politique de confidentialité",
    "opening": "Lunary respecte votre vie privée. Le calendrier local et les couvertures fonctionnent sans connexion ; l’accès à Google Agenda est facultatif et déclenché par l’utilisateur.",
    "privacyHubLabel": "Toutes les politiques de confidentialité",
    "sections": [
      {
        "title": "1. Comptes et identifiants directs",
        "paragraphs": [
          "Le calendrier local et les couvertures mensuelles ne nécessitent aucun compte. Si vous connectez explicitement Google Agenda, Google Sign-In fournit les informations nécessaires pour afficher et identifier le compte connecté. Lunary enregistre sur l’appareil l’identifiant du compte Google et celui de l’agenda choisi nécessaires à la synchronisation, mais ne conserve aucun jeton OAuth d’accès ou d’actualisation dans SQLite, les préférences, les journaux ou les fichiers propres à l’app."
        ]
      },
      {
        "title": "2. Données consultées ou stockées sur l’appareil",
        "items": [
          "Événements locaux : titre, date, heures facultatives de début et de fin, note, état de modification et de suppression",
          "Couvertures mensuelles : fond choisi, aperçus et affiches du widget, autocollants, position, taille, rotation, opacité et ordre des calques",
          "Avec Google Agenda connecté : identifiants de compte, d’agenda et d’événement, ETags, dates de mise à jour, état de synchronisation et date de la dernière vérification de synchronisation"
        ],
        "paragraphs": [
          "Les événements locaux et couvertures mensuelles restent sur l’appareil. Images de couverture, autocollants et notes locales ne sont envoyés ni à Google Agenda ni aux serveurs ONNELLAB."
        ]
      },
      {
        "title": "3. Transfert facultatif de données Google Agenda",
        "paragraphs": [
          "Après connexion uniquement, Lunary communique directement avec les API Google Agenda. L’app lit les identifiants et noms des agendas modifiables ainsi que les identifiants, titres, valeurs de début/fin, états de mise à jour et métadonnées nécessaires à la synchronisation bidirectionnelle. Elle peut créer, modifier ou supprimer le titre et la date ou l’heure des événements synchronisés dans l’agenda choisi, et utiliser des identifiants privés d’événement pour éviter les doublons. Couvertures, autocollants et notes locales ne sont pas envoyés à Google. ONNELLAB n’exploite aucun serveur intermédiaire pour cette synchronisation."
        ]
      },
      {
        "title": "4. Services des boutiques et informations de paiement",
        "paragraphs": [
          "Lunary Pro est un achat facultatif, unique et non consommable, traité par l’Apple App Store ou Google Play selon leurs propres règles. Les téléchargements, achats, remboursements, restaurations et informations associées au compte de la boutique sont traités par la boutique de la plateforme. Lunary conserve uniquement sur l’appareil le dernier droit Pro vérifié par la boutique afin qu’un accès Pro déjà vérifié reste disponible hors ligne. Lunary et ONNELLAB n’accèdent pas aux données de carte ou de compte bancaire et ne les stockent pas."
        ]
      },
      {
        "title": "5. Publicité, analyse, partage et données utilisateur Google",
        "paragraphs": [
          "Lunary n’utilise aucun SDK publicitaire, d’analyse comportementale ou de suivi tiers et ne vend pas de données personnelles. Les données Google servent uniquement à fournir la connexion et la synchronisation Google Agenda demandées par l’utilisateur. L’utilisation et le transfert des informations reçues des API Google respectent la Google API Services User Data Policy, y compris les exigences Limited Use."
        ]
      },
      {
        "title": "6. Conservation, déconnexion et suppression",
        "paragraphs": [
          "Événements, couvertures, autocollants, aperçus et métadonnées de synchronisation restent sur l’appareil jusqu’à leur suppression par les commandes prévues ou la désinstallation. Déconnecter Google Agenda arrête les futurs accès et efface les réglages de connexion et d’agenda choisi ; les événements enregistrés localement dans Lunary restent sur l’appareil. Les données déjà présentes dans Google Agenda suivent les réglages du compte et les règles de conservation de Google. ONNELLAB ne conserve aucune copie du contenu Google Agenda synchronisé sur ses serveurs."
        ]
      },
      {
        "title": "7. Sécurité et confidentialité des enfants",
        "paragraphs": [
          "Les identifiants d’autorisation Google sont gérés par Google Sign-In et ne sont pas stockés directement par Lunary. Les requêtes Google Agenda utilisent HTTPS et ONNELLAB applique des mesures techniques et organisationnelles raisonnables. Lunary ne s’adresse pas aux enfants de moins de 13 ans et ne collecte pas sciemment leurs informations personnelles."
        ]
      },
      {
        "title": "8. Modifications et contact",
        "paragraphs": [
          "Si les fonctions de Lunary, l’intégration Google ou les exigences légales ou celles des boutiques d’applications évoluent, cette politique et sa date de mise à jour seront révisées.",
          "Questions de confidentialité ou demandes de suppression : onnellab.app@gmail.com"
        ]
      }
    ]
  },
  "es": {
    "title": "Política de privacidad de Lunary",
    "description": "Política de privacidad del calendario Lunary y su conexión opcional con Google Calendar.",
    "intro": "Esta Política de privacidad se aplica a la app Lunary, proporcionada por ONNELLAB.",
    "updatedLabel": "Última actualización",
    "updatedValue": "2026-09-27",
    "heading": "Política de privacidad",
    "opening": "Lunary respeta la privacidad de sus usuarios. El calendario local y las portadas funcionan sin iniciar sesión; el acceso a Google Calendar es opcional y solo se activa cuando el usuario decide conectarlo.",
    "privacyHubLabel": "Todas las políticas de privacidad",
    "sections": [
      {
        "title": "1. Cuentas e identificadores directos",
        "paragraphs": [
          "El calendario local y las portadas mensuales no requieren una cuenta. Cuando el usuario conecta Google Calendar de forma explícita, Google Sign-In proporciona la información necesaria para mostrar e identificar la cuenta conectada. Lunary guarda en el dispositivo el ID de la cuenta de Google y el ID del calendario elegido necesarios para sincronizar, pero no conserva tokens OAuth de acceso o actualización en SQLite, preferencias, registros ni archivos propios de la app."
        ]
      },
      {
        "title": "2. Datos a los que se accede o que se almacenan en el dispositivo",
        "items": [
          "Eventos locales: título, fecha, horas opcionales de inicio y fin, nota, estado de edición y eliminación",
          "Portadas mensuales: fondo elegido, vistas previas y pósteres del widget, pegatinas, posición, tamaño, rotación, opacidad y orden de capas",
          "Con Google Calendar conectado: IDs de cuenta, calendario y evento, ETags, fechas de actualización, estado de sincronización y momento de la última comprobación de sincronización"
        ],
        "paragraphs": [
          "Los eventos locales y las portadas mensuales permanecen en el dispositivo. Las imágenes de portada, pegatinas y notas locales no se envían a Google Calendar ni a servidores de ONNELLAB."
        ]
      },
      {
        "title": "3. Transferencia opcional de datos de Google Calendar",
        "paragraphs": [
          "Solo después de conectarlo, Lunary se comunica directamente con las API de Google Calendar. Lee IDs y nombres de calendarios editables, además de IDs, títulos, valores de inicio/fin, estado de actualización y metadatos necesarios para la sincronización bidireccional. Puede crear, actualizar o eliminar el título y la fecha u hora de eventos sincronizados en el calendario elegido y usar identificadores privados de eventos para evitar duplicados. Las portadas, pegatinas y notas locales no se envían a Google. ONNELLAB no opera un servidor intermediario para esta sincronización."
        ]
      },
      {
        "title": "4. Servicios de las tiendas e información de pago",
        "paragraphs": [
          "Lunary Pro es una compra opcional, única y no consumible, procesada por Apple App Store o Google Play según las políticas de cada tienda. Las descargas, compras, reembolsos, restauraciones y datos relacionados con la cuenta de la tienda los procesa la tienda de la plataforma. Lunary conserva en el dispositivo únicamente el último derecho Pro verificado por la tienda para que un Pro ya verificado siga disponible sin conexión. Lunary y ONNELLAB no acceden ni almacenan datos de tarjetas o cuentas bancarias."
        ]
      },
      {
        "title": "5. Publicidad, analítica, uso compartido y datos de Google",
        "paragraphs": [
          "Lunary no usa SDK de publicidad, analítica de comportamiento ni rastreo de terceros y no vende datos personales. Los datos de Google se usan únicamente para ofrecer la conexión y sincronización con Google Calendar solicitadas por el usuario. El uso y la transferencia de información recibida de las API de Google cumplen la Google API Services User Data Policy, incluidos los requisitos de Limited Use."
        ]
      },
      {
        "title": "6. Conservación, desconexión y eliminación",
        "paragraphs": [
          "Los eventos, portadas, pegatinas, vistas previas y metadatos de sincronización locales permanecen en el dispositivo hasta que se eliminan mediante los controles correspondientes o se desinstala la app. Desconectar Google Calendar detiene futuros accesos y borra la configuración de conexión y del calendario elegido; los eventos guardados localmente en Lunary permanecen en el dispositivo. Los datos ya presentes en Google Calendar se rigen por la configuración de la cuenta y las reglas de conservación de Google. ONNELLAB no guarda copias del contenido sincronizado de Google Calendar en sus servidores."
        ]
      },
      {
        "title": "7. Seguridad y privacidad infantil",
        "paragraphs": [
          "Las credenciales de autorización de Google las gestiona Google Sign-In y Lunary no las almacena directamente. Las solicitudes a Google Calendar usan HTTPS y ONNELLAB aplica medidas técnicas y organizativas razonables. Lunary no está dirigida a menores de 13 años y no recopila intencionadamente información personal de niños."
        ]
      },
      {
        "title": "8. Cambios y contacto",
        "paragraphs": [
          "Si cambian las funciones de Lunary, la integración con Google o los requisitos legales o de las tiendas, esta política y la fecha de actualización se revisarán.",
          "Consultas de privacidad o solicitudes de eliminación: onnellab.app@gmail.com"
        ]
      }
    ]
  }
} satisfies Record<AllSiteLocale, LunaryPrivacyCopy>;

export function getLunaryPrivacyCopy(locale: AllSiteLocale): LunaryPrivacyCopy {
  return policies[locale];
}
