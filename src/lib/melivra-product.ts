import type { AllSiteLocale } from './extended-site-i18n';

export type MelivraProductCopy = {
  seoTitle: string;
  seoDescription: string;
  landingSubtitle: string;
  body: string;
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
};

const copy: Record<AllSiteLocale, MelivraProductCopy> = {
  en: {
    seoTitle: 'Melivra - Offline Music Player',
    seoDescription: 'Melivra is an offline MP3 and FLAC music player with folders, EQ, ReplayGain, gapless playback, playlists, and optional AI transcription and translation.',
    landingSubtitle: 'Offline Music Player',
    body: `Melivra is an offline music player for audio files you own. Organize MP3, FLAC, WAV, ALAC, AIFF, M4A, and OGG files in one local library and browse by album, artist, composer, genre, or folder.

There is no streaming service or cloud music-library sync. Your library and listening history stay managed on your device during normal playback.

## Key features

- Integrated search, list and album-grid views, and large local library browsing
- Resume playback, bookmarks, A-B repeat, playback speed, and embedded and local lyrics
- Built-in EQ presets and manual bands, embedded ReplayGain, and gapless playback
- Playlist management with M3U/M3U8 import and export
- Manual backup and restore of complete app data and listening history
- Basic all-time summary of plays, listening time, and unique tracks
- User-approved AI transcription and translation with TXT, SRT, LRC, and JSON export

## Melivra Pro

- Save custom EQ presets
- Automatically analyze loudness for tracks without ReplayGain
- View advanced weekly, monthly, and yearly listening statistics with CSV export
- Back up and restore playlists in Melivra's proprietary JSON format
- One purchase includes lifetime access to future Melivra Pro features

Only audio you select and approve for AI transcription or translation is processed by the server. AI Credits are consumable products sold separately from Melivra Pro.`,
    faqTitle: 'Frequently asked questions',
    faq: [
      { question: 'Are my music files uploaded to a server?', answer: 'Not during normal playback. Only audio you explicitly select and approve for AI transcription or translation is uploaded for that processing.' },
      { question: 'Which audio formats can Melivra play?', answer: 'Melivra supports MP3, FLAC, WAV, ALAC, AIFF, M4A, and OGG playback.' },
      { question: 'Is Melivra useful for long tracks or audiobooks?', answer: 'Yes. Resume playback, bookmarks, A-B repeat, and playback speed controls are designed for long-form and repeat listening.' },
      { question: 'How do AI transcription and translation work?', answer: 'After you approve selected audio, separately purchased AI Credits can be used for transcription or translation. Saved results can be exported as TXT, SRT, LRC, or JSON. Melivra Pro does not include AI Credits.' }
    ]
  },
  ko: {
    seoTitle: 'Melivra - 오프라인 음악 플레이어',
    seoDescription: 'Melivra는 MP3·FLAC 로컬 음악을 폴더·앨범별로 듣는 오프라인 플레이어예요. EQ, ReplayGain, 갭리스, AI 음성 전사·번역을 지원해요.',
    landingSubtitle: '오프라인 음악 플레이어',
    body: `Melivra는 직접 소장한 음악 파일을 위한 오프라인 음악 플레이어예요. MP3, FLAC, WAV, ALAC, AIFF, M4A, OGG 파일을 하나의 로컬 라이브러리로 정리하고 앨범, 아티스트, 작곡가, 장르, 폴더 기준으로 탐색할 수 있어요.

스트리밍 서비스나 클라우드 음악 라이브러리 동기화 없이 사용해요. 일반 재생 중에는 음악 라이브러리와 감상 기록을 기기 안에서 관리해요.

## 주요 기능

- 통합 검색, 목록·앨범 그리드 보기, 대용량 로컬 라이브러리 탐색
- 이어듣기, 북마크, A-B 반복, 재생 속도, 기기 내 가사
- 기본 EQ 프리셋과 수동 밴드, 파일에 저장된 ReplayGain 적용, 갭리스 재생
- 플레이리스트 관리와 M3U/M3U8 가져오기·내보내기
- 전체 앱 데이터와 감상 기록 수동 백업·복원
- 전체 기간 재생 횟수·감상 시간·서로 다른 곡 수 기본 요약
- 사용자가 승인한 오디오의 AI 음성 전사·번역 및 TXT, SRT, LRC, JSON 내보내기

## Melivra Pro

- 사용자 EQ 프리셋 저장
- ReplayGain이 없는 곡의 자동 음량 분석
- 주간·월간·연간 고급 감상 통계와 CSV 내보내기
- Melivra 전용 JSON 형식의 플레이리스트 백업·복원
- 한 번 구매하면 앞으로 추가되는 Melivra Pro 기능도 평생 이용

AI 음성 전사 또는 번역은 사용자가 직접 선택하고 승인한 오디오만 서버에서 처리해요. AI 크레딧은 Melivra Pro와 별도로 판매되는 소모성 상품이에요.`,
    faqTitle: '자주 묻는 질문',
    faq: [
      { question: '음악 파일을 서버로 업로드하나요?', answer: '일반 재생 중에는 업로드하지 않아요. AI 음성 전사 또는 번역을 위해 사용자가 직접 선택하고 승인한 오디오만 해당 처리에 업로드해요.' },
      { question: '어떤 오디오 파일을 재생할 수 있나요?', answer: 'MP3, FLAC, WAV, ALAC, AIFF, M4A, OGG 파일 재생을 지원해요.' },
      { question: '오디오북이나 긴 트랙에도 사용할 수 있나요?', answer: '네. 이어듣기, 북마크, A-B 반복, 재생 속도 조절을 제공해 긴 트랙과 반복 감상에도 사용할 수 있어요.' },
      { question: 'AI 음성 전사와 번역은 어떻게 사용하나요?', answer: '선택한 오디오의 처리를 승인한 뒤 별도로 구매한 AI 크레딧을 사용해 전사하거나 번역할 수 있어요. 저장된 결과는 TXT, SRT, LRC, JSON으로 내보낼 수 있고, Melivra Pro에는 AI 크레딧이 포함되지 않아요.' }
    ]
  },
  ja: {
    seoTitle: 'Melivra - オフライン音楽プレーヤー',
    seoDescription: 'MelivraはMP3・FLACなどをフォルダやアルバム別に楽しめるオフライン音楽プレーヤーです。EQ、ReplayGain、ギャップレス再生、AI文字起こし・翻訳に対応します。',
    landingSubtitle: 'オフライン音楽プレーヤー',
    body: `Melivraは、自分で所有している音楽ファイルを楽しむためのオフライン音楽プレーヤーです。MP3、FLAC、WAV、ALAC、AIFF、M4A、OGGを1つのローカルライブラリにまとめ、アルバム、アーティスト、作曲家、ジャンル、フォルダ別に探せます。

ストリーミングサービスやクラウド音楽ライブラリ同期はありません。通常の再生では、音楽ライブラリと再生履歴を端末内で管理します。

## 主な機能

- 統合検索、リスト表示・アルバムグリッド表示、大規模なローカルライブラリの閲覧
- 続きから再生、ブックマーク、A-Bリピート、再生速度、端末内の歌詞
- 内蔵EQプリセットと手動バンド調整、ファイル内ReplayGainの適用、ギャップレス再生
- プレイリスト管理、M3U/M3U8のインポート・エクスポート
- アプリ全体のデータと再生履歴の手動バックアップ・復元
- 累計再生回数、再生時間、再生した曲数の基本サマリー
- ユーザーが承認した音声のAI文字起こし・翻訳とTXT、SRT、LRC、JSON書き出し

## Melivra Pro

- カスタムEQプリセットを保存
- ReplayGainがない曲の音量を自動解析
- 週・月・年ごとの詳細な再生統計とCSV書き出し
- Melivra専用JSON形式でプレイリストをバックアップ・復元
- 1回の購入で、今後追加されるMelivra Pro機能もずっと利用可能

AI文字起こし・翻訳では、ユーザーが選択して承認した音声だけをサーバーで処理します。AIクレジットはMelivra Proとは別売りの消費型アイテムです。`,
    faqTitle: 'よくある質問',
    faq: [
      { question: '音楽ファイルはサーバーへアップロードされますか？', answer: '通常の再生ではアップロードされません。AI文字起こしまたは翻訳のためにユーザーが選択して承認した音声だけが、その処理のためにアップロードされます。' },
      { question: 'どの音声形式を再生できますか？', answer: 'MP3、FLAC、WAV、ALAC、AIFF、M4A、OGGに対応しています。' },
      { question: 'オーディオブックや長時間の音声にも使えますか？', answer: 'はい。続きから再生、ブックマーク、A-Bリピート、再生速度調整に対応しています。' },
      { question: 'AI文字起こし・翻訳はどのように使いますか？', answer: '選択した音声の処理を承認したあと、別途購入したAIクレジットを使って文字起こしや翻訳を行えます。保存した結果はTXT、SRT、LRC、JSONで書き出せます。Melivra ProにAIクレジットは含まれません。' }
    ]
  },
  'zh-Hans': {
    seoTitle: 'Melivra - 离线音乐播放器',
    seoDescription: 'Melivra 是支持 MP3、FLAC 与文件夹播放的离线音乐播放器，提供 EQ、ReplayGain、无缝播放，以及经用户确认的 AI 音频转文字与翻译。',
    landingSubtitle: '离线音乐播放器',
    body: `Melivra 是一款面向自有音频文件的离线音乐播放器。可将 MP3、FLAC、WAV、ALAC、AIFF、M4A 和 OGG 整理到一个本地音乐库中，并按专辑、艺人、作曲家、流派或文件夹浏览。

Melivra 不提供流媒体服务或云端音乐库同步。普通播放时，音乐库和收听记录都在设备上管理。

## 主要功能

- 综合搜索、列表与专辑网格视图，流畅浏览大型本地音乐库
- 续播、书签、A-B 循环、播放速度和本地歌词
- 内置 EQ 预设与手动频段调节、读取文件中的 ReplayGain、无缝播放
- 播放列表管理，以及 M3U/M3U8 导入与导出
- 手动备份和恢复完整应用数据与收听记录
- 提供累计播放次数、收听时长和已播放的不同曲目数
- 对用户明确批准的音频进行 AI 音频转文字与翻译，并支持导出 TXT、SRT、LRC、JSON

## Melivra Pro

- 保存自定义 EQ 预设
- 为没有 ReplayGain 的曲目自动分析响度
- 按周、月、年查看高级收听统计，并导出 CSV
- 使用 Melivra 专用 JSON 格式备份和恢复播放列表
- 一次购买，即可永久使用未来新增的 Melivra Pro 功能

只有你主动选择并确认用于 AI 音频转文字或翻译的音频才会发送到服务器处理。AI 积分是与 Melivra Pro 分开购买的消耗型商品。`,
    faqTitle: '常见问题',
    faq: [
      { question: '音乐文件会上传到服务器吗？', answer: '普通播放不会上传。只有你为 AI 音频转文字或翻译主动选择并确认的音频才会上传用于对应处理。' },
      { question: '支持哪些音频格式？', answer: '支持 MP3、FLAC、WAV、ALAC、AIFF、M4A 和 OGG 播放。' },
      { question: '适合有声书或长音频吗？', answer: '适合。续播、书签、A-B 循环和播放速度控制都可用于长音频和重复收听。' },
      { question: '如何使用 AI 音频转文字和翻译？', answer: '确认所选音频的处理后，可使用单独购买的 AI 积分进行音频转文字或翻译。保存的结果可导出为 TXT、SRT、LRC 或 JSON。Melivra Pro 不包含 AI 积分。' }
    ]
  },
  'zh-Hant': {
    seoTitle: 'Melivra - 離線音樂播放器',
    seoDescription: 'Melivra 是支援 MP3、FLAC 與資料夾播放的離線音樂播放器，提供 EQ、ReplayGain、無縫播放，以及經使用者確認的 AI 音訊轉文字與翻譯。',
    landingSubtitle: '離線音樂播放器',
    body: `Melivra 是為你自己擁有的音訊檔案打造的離線音樂播放器。可將 MP3、FLAC、WAV、ALAC、AIFF、M4A 與 OGG 整理到同一個本機音樂庫，並依專輯、藝人、作曲家、類型或資料夾瀏覽。

Melivra 不提供串流服務或雲端音樂庫同步。一般播放時，音樂庫與聆聽紀錄都在裝置上管理。

## 主要功能

- 整合搜尋、列表與專輯網格檢視，順暢瀏覽大型本機音樂庫
- 續播、書籤、A-B 循環、播放速度與裝置內歌詞
- 內建 EQ 預設與手動頻段調整、讀取檔案內 ReplayGain、無縫播放
- 播放清單管理，以及 M3U/M3U8 匯入與匯出
- 手動備份與還原完整 App 資料和聆聽紀錄
- 提供累計播放次數、聆聽時間與播放過的不同曲目數
- 對使用者明確核准的音訊進行 AI 音訊轉文字與翻譯，並可匯出 TXT、SRT、LRC、JSON

## Melivra Pro

- 儲存自訂 EQ 預設
- 為沒有 ReplayGain 的曲目自動分析響度
- 查看每週、每月、每年的進階聆聽統計並匯出 CSV
- 使用 Melivra 專用 JSON 格式備份與還原播放清單
- 一次購買即可永久使用未來新增的 Melivra Pro 功能

只有你主動選取並核准用於 AI 音訊轉文字或翻譯的音訊才會送到伺服器處理。AI 點數是與 Melivra Pro 分開購買的消耗型商品。`,
    faqTitle: '常見問題',
    faq: [
      { question: '音樂檔案會上傳到伺服器嗎？', answer: '一般播放不會上傳。只有你為 AI 音訊轉文字或翻譯主動選取並核准的音訊才會上傳以進行對應處理。' },
      { question: '支援哪些音訊格式？', answer: '支援 MP3、FLAC、WAV、ALAC、AIFF、M4A 與 OGG 播放。' },
      { question: '適合有聲書或長音訊嗎？', answer: '適合。續播、書籤、A-B 循環與播放速度控制都可用於長音訊與重複聆聽。' },
      { question: '如何使用 AI 音訊轉文字與翻譯？', answer: '核准所選音訊的處理後，可使用另外購買的 AI 點數進行音訊轉文字或翻譯。儲存的結果可匯出為 TXT、SRT、LRC 或 JSON。Melivra Pro 不包含 AI 點數。' }
    ]
  },
  'pt-BR': {
    seoTitle: 'Melivra - Player de música offline',
    seoDescription: 'Melivra é um player offline de MP3 e FLAC com pastas, EQ, ReplayGain, reprodução sem intervalos e transcrição ou tradução por IA sob aprovação.',
    landingSubtitle: 'Player de música offline',
    body: `Melivra é um player de música offline para os arquivos de áudio que você possui. Organize MP3, FLAC, WAV, ALAC, AIFF, M4A e OGG em uma única biblioteca local e navegue por álbum, artista, compositor, gênero ou pasta.

O Melivra não oferece streaming nem sincronização da biblioteca musical na nuvem. Durante a reprodução normal, a biblioteca e o histórico de audição são gerenciados no dispositivo.

## Principais recursos

- Busca integrada, visualização em lista e grade de álbuns e navegação em bibliotecas locais grandes
- Retomar reprodução, marcadores, repetição A-B, velocidade de reprodução e letras armazenadas localmente
- Predefinições de EQ e bandas manuais, ReplayGain incorporado ao arquivo e reprodução sem intervalos
- Gerenciamento de playlists com importação e exportação M3U/M3U8
- Backup e restauração manuais de todos os dados do app e do histórico de audição
- Resumo geral de reproduções, tempo de audição e faixas únicas
- Transcrição e tradução por IA apenas de áudios aprovados pelo usuário, com exportação em TXT, SRT, LRC e JSON

## Melivra Pro

- Salvar predefinições personalizadas de EQ
- Analisar automaticamente o volume de faixas sem ReplayGain
- Ver estatísticas avançadas semanais, mensais e anuais, com exportação CSV
- Fazer backup e restaurar playlists no formato JSON exclusivo do Melivra
- Uma única compra dá acesso vitalício aos futuros recursos do Melivra Pro

Somente o áudio que você selecionar e aprovar para transcrição ou tradução por IA é processado no servidor. Créditos de IA são itens consumíveis vendidos separadamente do Melivra Pro.`,
    faqTitle: 'Perguntas frequentes',
    faq: [
      { question: 'Meus arquivos de música são enviados para um servidor?', answer: 'Na reprodução normal, não. Apenas o áudio que você selecionar e aprovar para transcrição ou tradução por IA é enviado para esse processamento.' },
      { question: 'Quais formatos de áudio são suportados?', answer: 'MP3, FLAC, WAV, ALAC, AIFF, M4A e OGG.' },
      { question: 'O Melivra funciona bem com audiolivros ou faixas longas?', answer: 'Sim. Retomar reprodução, marcadores, repetição A-B e controle de velocidade ajudam na audição longa e repetida.' },
      { question: 'Como funcionam a transcrição e a tradução por IA?', answer: 'Depois de aprovar o áudio selecionado, você pode usar Créditos de IA comprados separadamente. Os resultados salvos podem ser exportados em TXT, SRT, LRC ou JSON. O Melivra Pro não inclui Créditos de IA.' }
    ]
  },
  de: {
    seoTitle: 'Melivra - Offline-Musikplayer',
    seoDescription: 'Melivra ist ein Offline-Musikplayer für MP3 und FLAC mit Ordnern, EQ, ReplayGain, Gapless-Wiedergabe sowie optionaler KI-Transkription und Übersetzung.',
    landingSubtitle: 'Offline-Musikplayer',
    body: `Melivra ist ein Offline-Musikplayer für deine eigenen Audiodateien. Organisiere MP3-, FLAC-, WAV-, ALAC-, AIFF-, M4A- und OGG-Dateien in einer lokalen Bibliothek und durchsuche sie nach Album, Künstler, Komponist, Genre oder Ordner.

Melivra bietet weder Streaming noch Cloud-Synchronisierung der Musikbibliothek. Bei normaler Wiedergabe werden Musikbibliothek und Hörverlauf auf deinem Gerät verwaltet.

## Hauptfunktionen

- Integrierte Suche, Listen- und Albumrasteransicht sowie flüssige Navigation in großen lokalen Bibliotheken
- Wiedergabe fortsetzen, Lesezeichen, A-B-Wiederholung, Wiedergabegeschwindigkeit und lokal gespeicherte Liedtexte
- Integrierte EQ-Presets und manuelle Bänder, in Dateien gespeichertes ReplayGain und Gapless-Wiedergabe
- Playlist-Verwaltung mit M3U/M3U8-Import und -Export
- Manuelle Sicherung und Wiederherstellung aller App-Daten und des Hörverlaufs
- Basisübersicht über Wiedergaben, Hörzeit und die Anzahl verschiedener Titel
- Vom Nutzer freigegebene KI-Transkription und Übersetzung mit Export als TXT, SRT, LRC und JSON

## Melivra Pro

- Eigene EQ-Presets speichern
- Lautstärke von Titeln ohne ReplayGain automatisch analysieren
- Erweiterte Hörstatistiken für Woche, Monat und Jahr mit CSV-Export
- Playlists im Melivra-eigenen JSON-Format sichern und wiederherstellen
- Einmal kaufen und auch künftige Melivra-Pro-Funktionen dauerhaft nutzen

Nur Audio, das du für KI-Transkription oder Übersetzung auswählst und bestätigst, wird auf dem Server verarbeitet. KI-Credits werden getrennt von Melivra Pro verkauft und bei der Nutzung verbraucht.`,
    faqTitle: 'Häufige Fragen',
    faq: [
      { question: 'Werden meine Musikdateien auf einen Server hochgeladen?', answer: 'Bei normaler Wiedergabe nicht. Nur Audio, das du ausdrücklich für KI-Transkription oder Übersetzung auswählst und bestätigst, wird für diese Verarbeitung hochgeladen.' },
      { question: 'Welche Audioformate werden unterstützt?', answer: 'Unterstützt werden MP3, FLAC, WAV, ALAC, AIFF, M4A und OGG.' },
      { question: 'Eignet sich Melivra für Hörbücher oder lange Titel?', answer: 'Ja. Wiedergabe fortsetzen, Lesezeichen, A-B-Wiederholung und Wiedergabegeschwindigkeit helfen bei langen und wiederholten Hörsessions.' },
      { question: 'Wie funktionieren KI-Transkription und Übersetzung?', answer: 'Nach deiner Bestätigung kannst du separat gekaufte KI-Credits verwenden. Gespeicherte Ergebnisse lassen sich als TXT, SRT, LRC oder JSON exportieren. Melivra Pro enthält keine KI-Credits.' }
    ]
  },
  fr: {
    seoTitle: 'Melivra - Lecteur de musique hors ligne',
    seoDescription: 'Melivra est un lecteur MP3/FLAC hors ligne avec dossiers, EQ, ReplayGain, lecture sans interruption et transcription ou traduction IA sur autorisation.',
    landingSubtitle: 'Lecteur de musique hors ligne',
    body: `Melivra est un lecteur de musique hors ligne conçu pour vos propres fichiers audio. Regroupez vos fichiers MP3, FLAC, WAV, ALAC, AIFF, M4A et OGG dans une bibliothèque locale et parcourez-les par album, artiste, compositeur, genre ou dossier.

Melivra ne propose ni streaming ni synchronisation cloud de la bibliothèque musicale. Lors d’une lecture normale, la bibliothèque et l’historique d’écoute restent gérés sur votre appareil.

## Fonctions principales

- Recherche intégrée, vues en liste et grille d’albums, navigation fluide dans les grandes bibliothèques locales
- Reprise de lecture, signets, répétition A-B, vitesse de lecture et paroles intégrées ou stockées localement
- Préréglages d’EQ et bandes manuelles, ReplayGain enregistré dans les fichiers et lecture sans interruption
- Gestion des playlists avec import et export M3U/M3U8
- Sauvegarde et restauration manuelles de toutes les données de l’app et de l’historique d’écoute
- Résumé global du nombre de lectures, du temps d’écoute et des titres uniques
- Transcription et traduction IA uniquement pour les fichiers audio autorisés par l’utilisateur, avec export TXT, SRT, LRC et JSON

## Melivra Pro

- Enregistrer des préréglages d’EQ personnalisés
- Analyser automatiquement le niveau sonore des morceaux sans ReplayGain
- Consulter des statistiques d’écoute avancées par semaine, mois et année, avec export CSV
- Sauvegarder et restaurer les playlists au format JSON propre à Melivra
- Un seul achat donne un accès à vie aux futures fonctions Melivra Pro

Seuls les fichiers audio que vous choisissez et autorisez pour une transcription ou une traduction IA sont traités sur le serveur. Les crédits IA sont des achats consommables vendus séparément de Melivra Pro.`,
    faqTitle: 'Questions fréquentes',
    faq: [
      { question: 'Mes fichiers audio sont-ils envoyés à un serveur ?', answer: 'Pas pendant la lecture normale. Seuls les fichiers audio que vous choisissez et autorisez pour une transcription ou une traduction IA sont envoyés pour ce traitement.' },
      { question: 'Quels formats audio sont pris en charge ?', answer: 'MP3, FLAC, WAV, ALAC, AIFF, M4A et OGG.' },
      { question: 'Melivra convient-il aux livres audio ou aux pistes longues ?', answer: 'Oui. La reprise de lecture, les signets, la répétition A-B et la vitesse de lecture facilitent l’écoute longue ou répétée.' },
      { question: 'Comment fonctionnent la transcription et la traduction IA ?', answer: 'Après avoir autorisé le fichier choisi, vous pouvez utiliser des crédits IA achetés séparément. Les résultats enregistrés peuvent être exportés en TXT, SRT, LRC ou JSON. Melivra Pro n’inclut pas de crédits IA.' }
    ]
  },
  es: {
    seoTitle: 'Melivra - Reproductor de música sin conexión',
    seoDescription: 'Melivra es un reproductor MP3/FLAC sin conexión con carpetas, EQ, ReplayGain, reproducción sin pausas y transcripción o traducción con IA autorizada.',
    landingSubtitle: 'Reproductor de música sin conexión',
    body: `Melivra es un reproductor de música sin conexión para tus propios archivos de audio. Organiza MP3, FLAC, WAV, ALAC, AIFF, M4A y OGG en una sola biblioteca local y explora por álbum, artista, compositor, género o carpeta.

Melivra no ofrece streaming ni sincronización de la biblioteca musical en la nube. Durante la reproducción normal, la biblioteca y el historial de escucha se gestionan en el dispositivo.

## Funciones principales

- Búsqueda integrada, vistas de lista y cuadrícula de álbumes y navegación por bibliotecas locales grandes
- Reanudar reproducción, marcadores, repetición A-B, velocidad de reproducción y letras integradas o guardadas localmente
- Preajustes de EQ y bandas manuales, ReplayGain integrado en el archivo y reproducción sin pausas
- Gestión de playlists con importación y exportación M3U/M3U8
- Copia de seguridad y restauración manual de todos los datos de la app y del historial de escucha
- Resumen general de reproducciones, tiempo de escucha y pistas únicas
- Transcripciones y traducciones con IA solo para audio aprobado por el usuario, con exportación TXT, SRT, LRC y JSON

## Melivra Pro

- Guardar preajustes de EQ personalizados
- Analizar automáticamente el volumen de pistas sin ReplayGain
- Consultar estadísticas avanzadas semanales, mensuales y anuales con exportación CSV
- Crear y restaurar copias de seguridad de playlists en el formato JSON propio de Melivra
- Una sola compra incluye acceso de por vida a futuras funciones de Melivra Pro

Solo se procesa en el servidor el audio que selecciones y apruebes para transcripción o traducción con IA. Los créditos de IA son productos consumibles que se venden por separado de Melivra Pro.`,
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { question: '¿Se suben mis archivos de música a un servidor?', answer: 'Durante la reproducción normal, no. Solo se sube el audio que selecciones y apruebes expresamente para una transcripción o traducción con IA.' },
      { question: '¿Qué formatos de audio se reproducen?', answer: 'Melivra admite MP3, FLAC, WAV, ALAC, AIFF, M4A y OGG.' },
      { question: '¿Sirve para audiolibros o pistas largas?', answer: 'Sí. Reanudar reproducción, marcadores, repetición A-B y velocidad de reproducción ayudan con el contenido largo y las escuchas repetidas.' },
      { question: '¿Cómo funcionan la transcripción y la traducción con IA?', answer: 'Después de aprobar el audio seleccionado, puedes usar créditos de IA comprados por separado. Los resultados guardados se pueden exportar en TXT, SRT, LRC o JSON. Melivra Pro no incluye créditos de IA.' }
    ]
  }
};

export function getMelivraProductCopy(locale: AllSiteLocale): MelivraProductCopy {
  return copy[locale];
}
