import type { AllSiteLocale } from './extended-site-i18n';

/** Long-form product prose used by the Papira detail page. */
export const papiraDescription: Record<AllSiteLocale, string> = {
  en: `Papira assembles any finished TXT manuscript into a well-structured EPUB. It includes dedicated flows for fanfiction, serialized fiction, personal novels, digital zines, and TRPG scenarios, while other TXT content can also be converted to EPUB.

Choose the Quick EPUB flow to select TXT files and create EPUB files immediately, without cover or publishing metadata. When you want more control, start a book project and add a cover, title, author, publisher, and series information before exporting.

Papira can detect chapters automatically, use headings that begin with #, or keep the manuscript as a single chapter. The project flow also builds navigation and a table of contents from the structure you choose, so the finished book is ready to read. You can review the book details before exporting.

Existing files are preserved. When an output name is already in use, Papira adds a number automatically instead of overwriting the file. EPUB creation and project storage happen on the device.

There is no account, sign-in, advertising, behavioral analytics, or tracking SDK. TXT manuscripts, cover images, projects, previews, and generated EPUB files are processed locally and are not uploaded to an ONNELLAB server.`,
  ko: `Papira는 완성된 TXT 원고를 정돈된 책 파일(EPUB)로 만들어요. 팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오에 특화된 제작 흐름을 제공하지만, 그 밖의 TXT 콘텐츠도 EPUB으로 변환할 수 있어요.

빠르게 만들기에서는 TXT 파일을 골라 표지와 출판 정보 없이 바로 책 파일(EPUB)을 만들어요. 더 자세히 구성하고 싶다면 책 프로젝트를 시작해 표지, 제목, 저자, 출판사와 시리즈 정보를 정리한 뒤 내보낼 수 있어요.

챕터는 자동으로 감지하거나 # 제목 모드로 구성할 수 있고, 원고 전체를 단일 챕터로 만들 수도 있어요. 책 프로젝트에서는 선택한 구조에 맞춰 챕터를 오갈 수 있는 목차도 함께 만들어요. 내보내기 전에 책 정보도 확인할 수 있어요.

기존 파일은 보존해요. 저장하려는 이름이 이미 있으면 파일을 덮어쓰지 않고 번호를 자동으로 붙여요. EPUB 제작과 책 프로젝트 저장은 기기 안에서 이루어져요.

계정이나 로그인이 필요 없고, 광고·행동 분석·추적 SDK를 사용하지 않아요. TXT 원고, 표지 이미지, 책 프로젝트, 미리보기와 생성한 EPUB은 기기 안에서 처리하며 ONNELLAB 서버에 업로드하지 않아요.`,
  ja: `Papiraは完成したTXT原稿を整ったEPUBにまとめます。二次創作・連載小説・オリジナル小説・デジタル小冊子・TRPGシナリオに特化した作成フローを備えていますが、そのほかのTXTコンテンツもEPUBに変換できます。

「すぐにEPUB化」ではTXTファイルを選ぶだけで、表紙や書誌情報を付けずにEPUBをすぐ作成できます。より詳しく整えたいときは書籍プロジェクトを使い、表紙、タイトル、著者、出版社、シリーズ情報を追加してから書き出せます。

章は自動検出、「#」見出しモード、または1つの章として扱う方法から選べます。書籍プロジェクトでは、選んだ構成に合わせてナビゲーションと目次も作成します。書誌情報も書き出す前に確認できます。

既存のファイルは保持されます。同じ名前のファイルがある場合は上書きせず、自動で番号を付けて保存します。EPUBの作成とプロジェクトの保存は端末内で行われます。

アカウントやログインは不要で、広告、行動分析、トラッキングSDKも使用しません。TXT原稿、表紙画像、プロジェクト、プレビュー、作成したEPUBは端末内で処理され、ONNELLABのサーバーにはアップロードされません。`,
  'zh-Hant': `Papira 可將完成的 TXT 文稿整理成結構清楚的 EPUB。它特別適合同人文、連載小說、原創小說、數位小冊子與 TRPG 劇本，也能將其他 TXT 內容轉換為 EPUB。

使用「快速 EPUB」時，選取 TXT 檔案就能立即建立 EPUB，不必設定封面或出版資訊。需要更完整的編排時，可以建立書籍專案，在匯出前加入封面、標題、作者、出版者和系列資訊。

章節可以自動偵測，也可以使用以 # 開頭的標題模式，或將整份稿件設定為單一章節。書籍專案會依照你選擇的結構建立導覽和目錄，並讓你在匯出前確認書籍資訊。

現有檔案會保留。若輸出檔名已經存在，Papira 會自動加上編號另存，不會覆寫原檔。EPUB 建立和書籍專案儲存都在裝置上完成。

不需要帳戶或登入，也沒有廣告、行為分析或追蹤 SDK。TXT 稿件、封面圖片、專案、預覽和產生的 EPUB 都在裝置本機處理，不會上傳到 ONNELLAB 伺服器。`,
  'zh-Hans': `Papira 可将完成的 TXT 文稿整理成结构清晰的 EPUB。它特别适合同人文、连载小说、原创小说、数字小册子与 TRPG 剧本，也能将其他 TXT 内容转换为 EPUB。

使用“快速 EPUB”时，选择 TXT 文件即可立即创建 EPUB，无需设置封面或出版信息。需要更完整的编排时，可以创建书籍项目，在导出前加入封面、标题、作者、出版方和系列信息。

章节可以自动检测，也可以使用以 # 开头的标题模式，或将整份稿件设为单一章节。书籍项目会按照你选择的结构创建导航和目录，并让你在导出前确认书籍信息。

现有文件会保留。如果输出文件名已经存在，Papira 会自动添加编号另存，不会覆盖原文件。EPUB 创建和书籍项目保存都在设备上完成。

无需账户或登录，也没有广告、行为分析或跟踪 SDK。TXT 稿件、封面图片、项目、预览和生成的 EPUB 都在设备本地处理，不会上传到 ONNELLAB 服务器。`,
  'pt-BR': `Papira transforma manuscritos TXT finalizados em livros EPUB estruturados. O app oferece fluxos próprios para fanfics, ficção seriada, romances autorais, zines digitais e cenários de TRPG, além de aceitar outros conteúdos em TXT.

No EPUB rápido, selecione arquivos TXT e crie EPUBs imediatamente, sem capa nem metadados de publicação. Para uma preparação mais completa, crie um projeto de livro e adicione capa, título, autor, editora e informações de série antes de exportar.

Os capítulos podem ser detectados automaticamente, definidos por títulos que começam com # ou mantidos como um único capítulo. O projeto de livro também cria navegação e sumário conforme a estrutura escolhida e permite conferir os dados do livro antes da exportação.

Os arquivos existentes são preservados. Quando o nome de saída já existe, o Papira adiciona um número automaticamente e salva outro arquivo, sem substituir o original. A criação do EPUB e o armazenamento do projeto permanecem no dispositivo.

Não há conta nem login, publicidade, análise comportamental ou SDK de rastreamento. Manuscritos TXT, imagens de capa, projetos, prévias e EPUBs gerados são processados localmente e não são enviados para servidores da ONNELLAB.`,
  de: `Papira setzt fertige TXT-Manuskripte zu strukturierten EPUB-Büchern zusammen. Es gibt eigene Abläufe für Fanfiction, Fortsetzungsromane, eigene Romane, digitale Zines und TRPG-Szenarien; andere TXT-Inhalte lassen sich ebenfalls in EPUB umwandeln.

Mit Schnell-EPUB wählst du TXT-Dateien aus und erstellst sofort EPUB-Dateien, ohne Cover oder Veröffentlichungsmetadaten. Für eine vollständigere Vorbereitung legst du ein Buchprojekt an und ergänzt vor dem Export Cover, Titel, Autor, Verlag und Serieninformationen.

Kapitel können automatisch erkannt, über Überschriften mit # festgelegt oder als ein einziges Kapitel behandelt werden. Das Buchprojekt erstellt passend zu deiner Struktur außerdem Navigation und Inhaltsverzeichnis und zeigt die Buchdaten vor dem Export an.

Vorhandene Dateien bleiben erhalten. Wenn der Ausgabename bereits verwendet wird, ergänzt Papira automatisch eine Nummer und überschreibt die vorhandene Datei nicht. EPUB-Erstellung und Projektspeicherung bleiben auf dem Gerät.

Es gibt kein Konto und keine Anmeldung, keine Werbung, Verhaltensanalyse oder Tracking-SDKs. TXT-Manuskripte, Coverbilder, Projekte, Vorschauen und erzeugte EPUB-Dateien werden lokal verarbeitet und nicht auf einen ONNELLAB-Server hochgeladen.`,
  fr: `Papira assemble des manuscrits TXT finalisés en livres EPUB structurés. L’application propose des parcours dédiés aux fanfictions, romans-feuilletons, romans originaux, zines numériques et scénarios de JDR sur table, tout en acceptant d’autres contenus TXT.

Avec l’EPUB rapide, sélectionnez des fichiers TXT et créez immédiatement des EPUB, sans couverture ni métadonnées de publication. Pour préparer un livre plus en détail, créez un projet et ajoutez une couverture, un titre, un auteur, un éditeur et des informations de série avant l’exportation.

Les chapitres peuvent être détectés automatiquement, définis par des titres commençant par # ou regroupés en un seul chapitre. Le projet de livre crée aussi la navigation et la table des matières selon la structure choisie, avec vérification des informations du livre avant l’exportation.

Les fichiers existants sont conservés. Si le nom de sortie est déjà utilisé, Papira ajoute automatiquement un numéro et n’écrase pas le fichier. La création des EPUB et le stockage des projets restent sur l’appareil.

Aucun compte ni connexion n’est requis, et l’application n’utilise ni publicité, ni analyse comportementale, ni SDK de suivi. Manuscrits TXT, images de couverture, projets, aperçus et EPUB générés sont traités localement et ne sont pas envoyés vers un serveur ONNELLAB.`,
  es: `Papira convierte manuscritos TXT terminados en libros EPUB estructurados. Incluye flujos específicos para fanfiction, ficción por entregas, novelas originales, zines digitales y escenarios de TRPG, y también admite otros contenidos TXT.

Con EPUB rápido, selecciona archivos TXT y crea EPUB de inmediato, sin portada ni metadatos de publicación. Para preparar el libro con más detalle, crea un proyecto y añade portada, título, autor, editorial e información de serie antes de exportar.

Los capítulos pueden detectarse automáticamente, definirse mediante encabezados que empiezan por # o tratarse como un único capítulo. El proyecto también crea la navegación y la tabla de contenidos según la estructura elegida, y permite revisar los datos del libro antes de exportar.

Los archivos existentes se conservan. Si el nombre de salida ya está en uso, Papira añade un número automáticamente y no sobrescribe el archivo. La creación del EPUB y el almacenamiento de proyectos permanecen en el dispositivo.

No necesitas cuenta ni iniciar sesión, y no hay publicidad, analítica de comportamiento ni SDK de seguimiento. Los manuscritos TXT, las imágenes de portada, los proyectos, las vistas previas y los EPUB generados se procesan localmente y no se suben a servidores de ONNELLAB.`
};

export function getPapiraDescription(locale: AllSiteLocale): string {
  return papiraDescription[locale];
}
