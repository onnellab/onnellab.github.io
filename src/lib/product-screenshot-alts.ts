import type { AllSiteLocale } from './extended-site-i18n';

const screenshotAltCopy = {
  aligna: {
    en: [
      'Aligna batch rename rule setup with a preview of new file names',
      'Aligna local file selection screen for batch renaming',
      'Aligna renamed-file preview before any changes are applied',
      'Aligna batch rename confirmation screen before applying changes'
    ],
    ko: [
      'Aligna 새 파일명을 미리보는 일괄 이름 변경 규칙 설정 화면',
      'Aligna 일괄 이름 변경을 위한 로컬 파일 선택 화면',
      'Aligna 변경을 적용하기 전에 새 파일명을 확인하는 미리보기 화면',
      'Aligna 파일명 변경을 적용하기 전 일괄 변경 확인 화면'
    ],
    ja: [
      'Alignaで新しいファイル名をプレビューする一括リネーム設定画面',
      'Alignaで一括リネームするローカルファイルを選択する画面',
      'Alignaで変更前に新しいファイル名を確認するプレビュー画面',
      'Alignaで一括リネームを適用する前の確認画面'
    ],
    'zh-Hans': [
      'Aligna 批量重命名规则设置与新文件名预览界面',
      'Aligna 批量重命名的本地文件选择界面',
      'Aligna 应用更改前查看新文件名的预览界面',
      'Aligna 应用批量重命名前的确认界面'
    ],
    'zh-Hant': [
      'Aligna 批次重新命名規則設定與新檔名預覽畫面',
      'Aligna 批次重新命名的本機檔案選擇畫面',
      'Aligna 套用變更前查看新檔名的預覽畫面',
      'Aligna 套用批次重新命名前的確認畫面'
    ],
    'pt-BR': [
      'Tela do Aligna para configurar a renomeação em lote e pré-visualizar os novos nomes',
      'Tela do Aligna para selecionar arquivos locais para renomeação em lote',
      'Prévia do Aligna com os novos nomes antes de aplicar qualquer alteração',
      'Tela de confirmação do Aligna antes de aplicar a renomeação em lote'
    ],
    de: [
      'Aligna-Einstellungen für Stapelumbenennung mit Vorschau der neuen Dateinamen',
      'Aligna-Dateiauswahl für die Stapelumbenennung lokaler Dateien',
      'Aligna-Vorschau der neuen Dateinamen vor dem Anwenden von Änderungen',
      'Aligna-Bestätigung vor dem Anwenden der Stapelumbenennung'
    ],
    fr: [
      'Écran Aligna de réglage du renommage par lot avec aperçu des nouveaux noms',
      'Écran Aligna de sélection des fichiers locaux à renommer par lot',
      'Aperçu Aligna des nouveaux noms avant toute modification',
      'Écran de confirmation Aligna avant d’appliquer le renommage par lot'
    ],
    es: [
      'Pantalla de Aligna para configurar el renombrado por lotes y previsualizar los nuevos nombres',
      'Pantalla de Aligna para seleccionar archivos locales para renombrarlos por lotes',
      'Vista previa de Aligna con los nuevos nombres antes de aplicar cambios',
      'Pantalla de confirmación de Aligna antes de aplicar el renombrado por lotes'
    ]
  },
  clipnest: {
    en: [
      'ClipNest home screen with the saved clips list',
      'ClipNest pinned clips screen for frequently reused text',
      'ClipNest snippet editing screen for saved text',
      'ClipNest settings screen for clipboard and app options',
      'ClipNest clipboard history screen with recent copied text'
    ],
    ko: [
      '저장한 클립 목록을 보여주는 ClipNest 홈 화면',
      '자주 다시 쓰는 텍스트를 모아 둔 ClipNest 고정 클립 화면',
      '저장한 텍스트를 수정하는 ClipNest 문구 편집 화면',
      '클립보드와 앱 옵션을 설정하는 ClipNest 설정 화면',
      '최근 복사한 텍스트를 보여주는 ClipNest 클립보드 기록 화면'
    ],
    ja: [
      '保存したクリップ一覧を表示するClipNestホーム画面',
      'よく再利用するテキストをまとめたClipNestのピン留め画面',
      '保存したテキストを編集するClipNestのスニペット編集画面',
      'クリップボードとアプリ設定を管理するClipNest設定画面',
      '最近コピーしたテキストを表示するClipNest履歴画面'
    ],
    'zh-Hans': [
      '显示已保存文本片段列表的 ClipNest 首页',
      '用于快速复用常用文本的 ClipNest 置顶片段界面',
      '编辑已保存文本的 ClipNest 片段编辑界面',
      '管理剪贴板与应用选项的 ClipNest 设置界面',
      '显示最近复制文本的 ClipNest 剪贴板历史界面'
    ],
    'zh-Hant': [
      '顯示已儲存文字片段清單的 ClipNest 首頁',
      '方便快速重複使用常用文字的 ClipNest 釘選片段畫面',
      '編輯已儲存文字的 ClipNest 片段編輯畫面',
      '管理剪貼簿與應用程式選項的 ClipNest 設定畫面',
      '顯示最近複製文字的 ClipNest 剪貼簿記錄畫面'
    ],
    'pt-BR': [
      'Tela inicial do ClipNest com a lista de textos salvos',
      'Tela do ClipNest com textos fixados para reutilização frequente',
      'Tela do ClipNest para editar um texto salvo',
      'Tela de configurações do ClipNest para opções da área de transferência e do app',
      'Tela de histórico do ClipNest com textos copiados recentemente'
    ],
    de: [
      'ClipNest-Startseite mit der Liste gespeicherter Textausschnitte',
      'ClipNest-Ansicht mit angehefteten häufig verwendeten Textbausteinen',
      'ClipNest-Editor für gespeicherte Textbausteine',
      'ClipNest-Einstellungen für Zwischenablage und App-Optionen',
      'ClipNest-Zwischenablageverlauf mit zuletzt kopierten Texten'
    ],
    fr: [
      'Écran d’accueil de ClipNest avec la liste des extraits enregistrés',
      'Écran ClipNest des extraits épinglés pour les textes souvent réutilisés',
      'Écran ClipNest de modification d’un extrait enregistré',
      'Écran des réglages ClipNest pour le presse-papiers et les options de l’application',
      'Historique ClipNest affichant les textes copiés récemment'
    ],
    es: [
      'Pantalla de inicio de ClipNest con la lista de textos guardados',
      'Pantalla de ClipNest con textos fijados para reutilizarlos con frecuencia',
      'Pantalla de ClipNest para editar un texto guardado',
      'Pantalla de ajustes de ClipNest para el portapapeles y las opciones de la aplicación',
      'Historial de ClipNest con los textos copiados recientemente'
    ]
  },
  melivra: {
    en: [
      'Melivra home screen with recent albums and resume playback',
      'Melivra local music library with song lists and album covers',
      'Melivra long-track playback screen with bookmarks and resume controls',
      'Melivra playlist management screen for organizing local music',
      'Melivra theme and playback settings screen'
    ],
    ko: [
      '최근 앨범과 이어듣기를 보여주는 Melivra 홈 화면',
      '곡 목록과 앨범 커버를 보여주는 Melivra 로컬 음악 라이브러리 화면',
      '북마크와 이어듣기 기능이 있는 Melivra 긴 트랙 재생 화면',
      '로컬 음악을 정리하는 Melivra 플레이리스트 관리 화면',
      '테마와 재생 옵션을 관리하는 Melivra 설정 화면'
    ],
    ja: [
      '最近のアルバムと再開再生を表示するMelivraホーム画面',
      '曲リストとアルバムカバーを表示するMelivraローカル音楽ライブラリ画面',
      'ブックマークと再開再生を使えるMelivra長時間トラック再生画面',
      'ローカル音楽を整理するMelivraプレイリスト管理画面',
      'テーマと再生オプションを管理するMelivra設定画面'
    ],
    'zh-Hans': [
      '显示最近专辑与继续播放的 Melivra 首页',
      '以歌曲列表和专辑封面浏览本地音乐的 Melivra 音乐库界面',
      '带书签和继续播放控制的 Melivra 长音轨播放界面',
      '整理本地音乐的 Melivra 播放列表管理界面',
      '管理主题和播放选项的 Melivra 设置界面'
    ],
    'zh-Hant': [
      '顯示最近專輯與繼續播放的 Melivra 首頁',
      '以歌曲清單和專輯封面瀏覽本機音樂的 Melivra 音樂庫畫面',
      '具備書籤與繼續播放控制的 Melivra 長音軌播放畫面',
      '整理本機音樂的 Melivra 播放清單管理畫面',
      '管理主題與播放選項的 Melivra 設定畫面'
    ],
    'pt-BR': [
      'Tela inicial do Melivra com álbuns recentes e retomada da reprodução',
      'Biblioteca local do Melivra com listas de músicas e capas de álbuns',
      'Tela de reprodução de faixas longas do Melivra com marcadores e retomada',
      'Tela do Melivra para criar e organizar playlists locais',
      'Tela de configurações do Melivra para tema e reprodução'
    ],
    de: [
      'Melivra-Startseite mit zuletzt verwendeten Alben und Wiedergabefortsetzung',
      'Lokale Melivra-Musikbibliothek mit Titellisten und Albumcovern',
      'Melivra-Wiedergabe langer Tracks mit Lesezeichen und Fortsetzen-Funktion',
      'Melivra-Playlistverwaltung zum Organisieren lokaler Musik',
      'Melivra-Einstellungen für Darstellung und Wiedergabe'
    ],
    fr: [
      'Écran d’accueil de Melivra avec albums récents et reprise de lecture',
      'Bibliothèque musicale locale de Melivra avec listes de titres et pochettes',
      'Lecture de piste longue dans Melivra avec marque-pages et reprise',
      'Écran Melivra de gestion des playlists de musique locale',
      'Écran des réglages Melivra pour le thème et la lecture'
    ],
    es: [
      'Pantalla de inicio de Melivra con álbumes recientes y reanudación de reproducción',
      'Biblioteca de música local de Melivra con listas de canciones y portadas',
      'Pantalla de Melivra para pistas largas con marcadores y reanudación',
      'Pantalla de Melivra para crear y organizar listas de reproducción locales',
      'Pantalla de ajustes de Melivra para tema y reproducción'
    ]
  },
  meriq: {
    en: [
      'Meriq merchandise production workspace with artwork and production layers',
      'Meriq product preview screen showing the prepared merchandise result',
      'Meriq export screen for creating production-ready output files'
    ],
    ko: [
      '아트워크와 제작 레이어를 편집하는 Meriq 굿즈 제작 작업공간 화면',
      '준비한 굿즈 결과를 확인하는 Meriq 제품 미리보기 화면',
      '제작용 결과 파일을 만드는 Meriq 내보내기 화면'
    ],
    ja: [
      'アートワークと制作レイヤーを編集するMeriqグッズ制作ワークスペース画面',
      '準備したグッズの仕上がりを確認するMeriq製品プレビュー画面',
      '入稿用の出力ファイルを作成するMeriq書き出し画面'
    ],
    'zh-Hans': [
      '编辑图稿与制作图层的 Meriq 周边制作工作区界面',
      '查看已准备周边效果的 Meriq 产品预览界面',
      '生成生产用输出文件的 Meriq 导出界面'
    ],
    'zh-Hant': [
      '編輯圖稿與製作圖層的 Meriq 周邊製作工作區畫面',
      '查看已準備周邊成品效果的 Meriq 產品預覽畫面',
      '產生製作用輸出檔案的 Meriq 匯出畫面'
    ],
    'pt-BR': [
      'Área de trabalho do Meriq para editar arte e camadas de produção de produtos',
      'Prévia do Meriq mostrando o resultado do produto preparado',
      'Tela de exportação do Meriq para gerar arquivos prontos para produção'
    ],
    de: [
      'Meriq-Arbeitsbereich zum Bearbeiten von Motiv und Produktionslayern für Merchandise',
      'Meriq-Produktvorschau des vorbereiteten Merchandise-Ergebnisses',
      'Meriq-Exportansicht zum Erstellen produktionsfertiger Ausgabedateien'
    ],
    fr: [
      'Espace de travail Meriq pour modifier l’illustration et les calques de production',
      'Aperçu produit Meriq montrant le résultat du produit préparé',
      'Écran d’exportation Meriq pour générer les fichiers prêts pour la production'
    ],
    es: [
      'Espacio de trabajo de Meriq para editar el diseño y las capas de producción',
      'Vista previa de Meriq con el resultado del producto preparado',
      'Pantalla de exportación de Meriq para generar archivos listos para producción'
    ]
  },
  quivra: {
    en: [
      'Quivra media conversion start screen after selecting a source file',
      'Quivra conversion settings screen showing the selected conversion path',
      'Quivra conversion progress screen while processing the media file',
      'Quivra converted-file result screen for saving the finished output'
    ],
    ko: [
      '원본 파일을 선택한 뒤 변환을 시작하는 Quivra 미디어 변환 화면',
      '선택된 변환 방식을 확인하는 Quivra 변환 설정 화면',
      '미디어 파일 처리 상태를 보여주는 Quivra 변환 진행 화면',
      '완성된 변환 파일을 저장하는 Quivra 결과 화면'
    ],
    ja: [
      '元ファイルを選択して変換を開始するQuivraメディア変換画面',
      '選択された変換方法を確認するQuivra変換設定画面',
      'メディア処理の進行状況を表示するQuivra変換画面',
      '完成した変換ファイルを保存するQuivra結果画面'
    ],
    'zh-Hans': [
      '选择源文件后开始处理的 Quivra 媒体转换界面',
      '显示已选转换方式的 Quivra 转换设置界面',
      '显示媒体文件处理进度的 Quivra 转换界面',
      '保存已完成转换文件的 Quivra 结果界面'
    ],
    'zh-Hant': [
      '選擇來源檔案後開始處理的 Quivra 媒體轉換畫面',
      '顯示已選轉換方式的 Quivra 轉換設定畫面',
      '顯示媒體檔案處理進度的 Quivra 轉換畫面',
      '儲存已完成轉換檔案的 Quivra 結果畫面'
    ],
    'pt-BR': [
      'Tela do Quivra para iniciar a conversão após escolher o arquivo de origem',
      'Tela de configurações do Quivra com o caminho de conversão selecionado',
      'Tela do Quivra mostrando o progresso do processamento do arquivo',
      'Tela de resultado do Quivra para salvar o arquivo convertido'
    ],
    de: [
      'Quivra-Startansicht der Medienkonvertierung nach Auswahl der Quelldatei',
      'Quivra-Konvertierungseinstellungen mit dem ausgewählten Konvertierungsweg',
      'Quivra-Fortschrittsanzeige während der Verarbeitung der Mediendatei',
      'Quivra-Ergebnisansicht zum Speichern der fertig konvertierten Datei'
    ],
    fr: [
      'Écran Quivra de démarrage de la conversion après sélection du fichier source',
      'Écran des réglages Quivra indiquant le type de conversion sélectionné',
      'Écran Quivra montrant la progression du traitement du fichier multimédia',
      'Écran de résultat Quivra pour enregistrer le fichier converti'
    ],
    es: [
      'Pantalla de Quivra para iniciar la conversión tras seleccionar el archivo de origen',
      'Pantalla de ajustes de Quivra con la ruta de conversión seleccionada',
      'Pantalla de Quivra con el progreso del procesamiento del archivo multimedia',
      'Pantalla de resultado de Quivra para guardar el archivo convertido'
    ]
  },
  segra: {
    en: [
      'Segra home screen for choosing common audio editing tasks',
      'Segra trim timeline for selecting the audio range to keep',
      'Segra merge screen for arranging multiple audio files in order',
      'Segra video input screen for combining audio with an image',
      'Segra video creation options before exporting the MP4 result',
      'Segra settings screen for audio editing preferences'
    ],
    ko: [
      '자주 쓰는 오디오 편집 작업을 고르는 Segra 홈 화면',
      '남길 오디오 구간을 지정하는 Segra 자르기 타임라인 화면',
      '여러 오디오 파일의 결합 순서를 정하는 Segra 합치기 화면',
      '오디오와 이미지를 결합하는 Segra 비디오 입력 화면',
      'MP4 결과를 내보내기 전 설정하는 Segra 비디오 제작 옵션 화면',
      '오디오 편집 환경을 관리하는 Segra 설정 화면'
    ],
    ja: [
      'よく使う音声編集作業を選ぶSegraホーム画面',
      '残す音声範囲を指定するSegraトリミングタイムライン画面',
      '複数の音声ファイルの結合順を並べるSegraマージ画面',
      '音声と画像を組み合わせるSegra動画入力画面',
      'MP4を書き出す前に設定するSegra動画作成オプション画面',
      '音声編集の設定を管理するSegra設定画面'
    ],
    'zh-Hans': [
      '选择常用音频编辑任务的 Segra 首页',
      '选择要保留音频区间的 Segra 裁剪时间线界面',
      '排列多个音频文件合并顺序的 Segra 合并界面',
      '组合音频与图片的 Segra 视频输入界面',
      '导出 MP4 前设置的 Segra 视频制作选项界面',
      '管理音频编辑偏好的 Segra 设置界面'
    ],
    'zh-Hant': [
      '選擇常用音訊編輯工作的 Segra 首頁',
      '選擇要保留音訊區間的 Segra 裁剪時間軸畫面',
      '排列多個音訊檔案合併順序的 Segra 合併畫面',
      '組合音訊與圖片的 Segra 影片輸入畫面',
      '匯出 MP4 前設定的 Segra 影片製作選項畫面',
      '管理音訊編輯偏好的 Segra 設定畫面'
    ],
    'pt-BR': [
      'Tela inicial do Segra para escolher tarefas comuns de edição de áudio',
      'Linha do tempo do Segra para selecionar o trecho de áudio que será mantido',
      'Tela do Segra para ordenar e combinar vários arquivos de áudio',
      'Tela do Segra para escolher áudio e imagem para criar um vídeo',
      'Opções do Segra para criar o vídeo antes de exportar o MP4',
      'Tela de configurações do Segra para preferências de edição de áudio'
    ],
    de: [
      'Segra-Startseite zur Auswahl häufiger Audiobearbeitungen',
      'Segra-Zeitleiste zum Auswählen des Audiobereichs, der erhalten bleiben soll',
      'Segra-Ansicht zum Anordnen und Zusammenführen mehrerer Audiodateien',
      'Segra-Eingabeansicht zum Kombinieren von Audio und Bild für ein Video',
      'Segra-Optionen für die Videoerstellung vor dem MP4-Export',
      'Segra-Einstellungen für Audiobearbeitungsoptionen'
    ],
    fr: [
      'Écran d’accueil de Segra pour choisir les tâches courantes de montage audio',
      'Timeline Segra pour sélectionner la partie audio à conserver',
      'Écran Segra pour ordonner et fusionner plusieurs fichiers audio',
      'Écran d’entrée Segra pour associer un audio et une image dans une vidéo',
      'Options de création vidéo Segra avant l’exportation en MP4',
      'Écran des réglages Segra pour les préférences de montage audio'
    ],
    es: [
      'Pantalla de inicio de Segra para elegir tareas habituales de edición de audio',
      'Línea de tiempo de Segra para seleccionar el tramo de audio que se conservará',
      'Pantalla de Segra para ordenar y unir varios archivos de audio',
      'Pantalla de entrada de Segra para combinar audio e imagen en un vídeo',
      'Opciones de Segra para crear el vídeo antes de exportar el MP4',
      'Pantalla de ajustes de Segra para las preferencias de edición de audio'
    ]
  },
  tagweaver: {
    en: [
      'TagWeaver MP3 and FLAC tag editor for title, artist, and album metadata',
      'TagWeaver selected-file library screen for batch metadata editing',
      'TagWeaver extra metadata fields screen for extended audio tags',
      'TagWeaver lyrics editor for lyrics stored in an audio file',
      'TagWeaver album artwork editor for adding or removing cover art',
      'TagWeaver settings screen showing single-file and batch-save feature scope'
    ],
    ko: [
      '제목 아티스트 앨범 정보를 수정하는 TagWeaver MP3 FLAC 태그 편집 화면',
      '여러 파일의 메타데이터를 편집하기 위해 선택한 TagWeaver 라이브러리 화면',
      '확장 오디오 태그를 수정하는 TagWeaver 추가 메타데이터 필드 화면',
      '오디오 파일에 저장할 가사를 수정하는 TagWeaver 가사 편집 화면',
      '앨범 커버를 추가하거나 제거하는 TagWeaver 아트워크 편집 화면',
      '단일 파일과 일괄 저장 기능 범위를 보여주는 TagWeaver 설정 화면'
    ],
    ja: [
      'タイトル・アーティスト・アルバム情報を編集するTagWeaverのMP3・FLACタグ編集画面',
      '複数ファイルのメタデータ編集用に選択したTagWeaverライブラリ画面',
      '拡張音声タグを編集するTagWeaver追加メタデータ画面',
      '音声ファイルに保存する歌詞を編集するTagWeaver歌詞画面',
      'アルバムカバーを追加・削除するTagWeaverアートワーク編集画面',
      '単一ファイルと一括保存の機能範囲を示すTagWeaver設定画面'
    ],
    'zh-Hans': [
      '编辑标题艺人和专辑信息的 TagWeaver MP3 FLAC 标签编辑界面',
      '为批量编辑元数据选择多个文件的 TagWeaver 音乐库界面',
      '编辑扩展音频标签的 TagWeaver 额外元数据字段界面',
      '编辑音频文件内歌词的 TagWeaver 歌词界面',
      '添加或移除专辑封面的 TagWeaver 封面编辑界面',
      '说明单文件与批量保存功能范围的 TagWeaver 设置界面'
    ],
    'zh-Hant': [
      '編輯標題藝人與專輯資訊的 TagWeaver MP3 FLAC 標籤編輯畫面',
      '為批次編輯中繼資料選取多個檔案的 TagWeaver 音樂庫畫面',
      '編輯延伸音訊標籤的 TagWeaver 額外中繼資料欄位畫面',
      '編輯音訊檔案內歌詞的 TagWeaver 歌詞畫面',
      '新增或移除專輯封面的 TagWeaver 封面編輯畫面',
      '說明單一檔案與批次儲存功能範圍的 TagWeaver 設定畫面'
    ],
    'pt-BR': [
      'Editor do TagWeaver para tags MP3 e FLAC como título, artista e álbum',
      'Biblioteca do TagWeaver com arquivos selecionados para editar metadados em lote',
      'Tela do TagWeaver para editar campos adicionais de metadados de áudio',
      'Editor de letras do TagWeaver para letras armazenadas no arquivo de áudio',
      'Editor de capa do TagWeaver para adicionar ou remover a arte do álbum',
      'Tela de configurações do TagWeaver com o escopo de arquivo único e salvamento em lote'
    ],
    de: [
      'TagWeaver-Editor für MP3- und FLAC-Tags wie Titel, Interpret und Album',
      'TagWeaver-Bibliothek mit ausgewählten Dateien für die Stapelbearbeitung von Metadaten',
      'TagWeaver-Ansicht zum Bearbeiten zusätzlicher Audio-Metadatenfelder',
      'TagWeaver-Lyrics-Editor für im Audiofile gespeicherte Liedtexte',
      'TagWeaver-Covereditor zum Hinzufügen oder Entfernen von Albumcovern',
      'TagWeaver-Einstellungen zum Funktionsumfang von Einzeldatei und Stapelspeicherung'
    ],
    fr: [
      'Éditeur TagWeaver des tags MP3 et FLAC pour le titre, l’artiste et l’album',
      'Bibliothèque TagWeaver avec fichiers sélectionnés pour modifier les métadonnées par lot',
      'Écran TagWeaver des champs de métadonnées audio supplémentaires',
      'Éditeur de paroles TagWeaver pour les paroles enregistrées dans le fichier audio',
      'Éditeur de pochette TagWeaver pour ajouter ou retirer l’illustration de l’album',
      'Réglages TagWeaver indiquant la portée du fichier unique et de l’enregistrement par lot'
    ],
    es: [
      'Editor de TagWeaver para etiquetas MP3 y FLAC como título, artista y álbum',
      'Biblioteca de TagWeaver con archivos seleccionados para editar metadatos por lotes',
      'Pantalla de TagWeaver para editar campos adicionales de metadatos de audio',
      'Editor de letras de TagWeaver para letras guardadas en el archivo de audio',
      'Editor de portada de TagWeaver para añadir o quitar la carátula del álbum',
      'Pantalla de ajustes de TagWeaver con el alcance de archivo único y guardado por lotes'
    ]
  },
  vaultxt: {
    en: [
      'VaultXT large TXT document open in the lightweight editor',
      'VaultXT responsive long-text editing screen',
      'VaultXT in-document search screen for finding text in a large file',
      'VaultXT distraction-free editing screen focused on the document',
      'VaultXT local save workflow for keeping edited text on the device'
    ],
    ko: [
      '가벼운 편집기에서 대용량 TXT 문서를 연 VaultXT 화면',
      '긴 텍스트를 부드럽게 편집하는 VaultXT 편집 화면',
      '대용량 파일 안에서 문장을 찾는 VaultXT 문서 내 검색 화면',
      '문서에 집중해 편집하는 VaultXT 방해 없는 편집 화면',
      '수정한 텍스트를 기기에 보관하는 VaultXT 로컬 저장 화면'
    ],
    ja: [
      '軽量エディターで大容量TXT文書を開いたVaultXT画面',
      '長いテキストを軽快に編集するVaultXT編集画面',
      '大容量ファイル内の文字列を探すVaultXT文書内検索画面',
      '文書に集中して編集するVaultXTのシンプルな編集画面',
      '編集したテキストを端末に保存するVaultXTローカル保存画面'
    ],
    'zh-Hans': [
      '在轻量编辑器中打开大型 TXT 文档的 VaultXT 界面',
      '流畅编辑长文本的 VaultXT 编辑界面',
      '在大型文件中查找文字的 VaultXT 文档内搜索界面',
      '专注于文档内容的 VaultXT 简洁编辑界面',
      '将编辑后的文本保存在设备上的 VaultXT 本地保存界面'
    ],
    'zh-Hant': [
      '在輕量編輯器中開啟大型 TXT 文件的 VaultXT 畫面',
      '流暢編輯長篇文字的 VaultXT 編輯畫面',
      '在大型檔案中尋找文字的 VaultXT 文件內搜尋畫面',
      '專注於文件內容的 VaultXT 簡潔編輯畫面',
      '將編輯後文字儲存在裝置上的 VaultXT 本機儲存畫面'
    ],
    'pt-BR': [
      'Tela do VaultXT com um documento TXT grande aberto no editor leve',
      'Tela do VaultXT para edição responsiva de textos longos',
      'Busca do VaultXT dentro de um arquivo grande para localizar texto',
      'Tela de edição do VaultXT com foco no documento e poucas distrações',
      'Fluxo de salvamento local do VaultXT para manter o texto editado no dispositivo'
    ],
    de: [
      'VaultXT mit einer großen TXT-Datei im schlanken Texteditor',
      'VaultXT-Ansicht für reaktionsschnelle Bearbeitung langer Texte',
      'VaultXT-Dokumentsuche zum Finden von Text in einer großen Datei',
      'VaultXT-Bearbeitungsansicht mit Fokus auf das Dokument',
      'VaultXT-Ablauf zum lokalen Speichern des bearbeiteten Textes auf dem Gerät'
    ],
    fr: [
      'Écran VaultXT avec un grand document TXT ouvert dans l’éditeur léger',
      'Écran VaultXT pour modifier de longs textes de manière réactive',
      'Recherche VaultXT dans le document pour retrouver du texte dans un gros fichier',
      'Écran de modification VaultXT centré sur le document avec peu de distractions',
      'Flux d’enregistrement local VaultXT pour conserver le texte modifié sur l’appareil'
    ],
    es: [
      'Pantalla de VaultXT con un documento TXT grande abierto en el editor ligero',
      'Pantalla de VaultXT para editar textos largos con respuesta fluida',
      'Búsqueda de VaultXT dentro del documento para encontrar texto en un archivo grande',
      'Pantalla de edición de VaultXT centrada en el documento y sin distracciones',
      'Flujo de guardado local de VaultXT para conservar el texto editado en el dispositivo'
    ]
  }
} satisfies Record<string, Record<AllSiteLocale, readonly string[]>>;

export function getProductScreenshotAlts(
  slug: string,
  locale: AllSiteLocale,
  screenshotCount: number
): string[] {
  if (screenshotCount === 0) return [];
  const appCopy = screenshotAltCopy[slug];
  const localized = appCopy?.[locale];
  if (!localized) {
    throw new Error(`Missing localized screenshot alt copy: ${slug}/${locale}`);
  }
  if (localized.length !== screenshotCount) {
    throw new Error(
      `Screenshot alt count mismatch for ${slug}/${locale}: expected ${screenshotCount}, found ${localized.length}`
    );
  }
  return [...localized];
}
