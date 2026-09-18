import { getPapiraDescription } from './papira-description';
import type { ExtendedSiteLocale } from './extended-site-i18n';

export type ExtendedProductCopy = {
  subtitle: string;
  body: string;
  seoTitle?: string;
  seoDescription?: string;
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
};

const make = (subtitle: string, body: string, faqTitle: string, faq: ExtendedProductCopy['faq']): ExtendedProductCopy => ({ subtitle, body, faqTitle, faq });

export const extendedProductCopy: Record<ExtendedSiteLocale, Record<string, ExtendedProductCopy>> = {
  'pt-BR': {
    aligna: {
      "subtitle": "Renomeador de arquivos em lote",
      "body": "Aligna renomeia vários arquivos de uma vez usando regras claras e previsíveis.\n\nUse os mesmos padrões em fotos, músicas e documentos: adicione datas ou números sequenciais, troque espaços por sublinhados, remova caracteres inválidos e crie nomes de arquivos de música a partir das tags.\n\n## Principais recursos\n\n- Adicionar datas\n- Adicionar numeração sequencial\n- Trocar espaços por sublinhados\n- Remover caracteres inválidos\n- Organizar fotos pela data de captura\n- Criar nomes a partir de artista, número da faixa e título\n- Conferir uma prévia antes de aplicar\n\nAligna não é um gerenciador de arquivos nem um serviço em nuvem. Não exige conta, não tem anúncios e faz o processamento no dispositivo. No iOS, por limitações do sistema, o arquivo pode ser salvo como uma nova cópia com outro nome em vez de renomear o original diretamente.",
      "faqTitle": "Perguntas frequentes",
      "faq": [
        {
          "question": "Quais regras de nomeação posso usar?",
          "answer": "Adicione datas ou números sequenciais, ajuste espaços e caracteres inválidos ou use a data da foto e os dados de artista, faixa e título das músicas."
        },
        {
          "question": "O nome do arquivo original é alterado diretamente?",
          "answer": "No Android, arquivos selecionados podem ser renomeados. No iOS, por limitações do sistema, o resultado é salvo como um novo arquivo com o novo nome."
        },
        {
          "question": "Posso conferir os novos nomes antes de aplicar?",
          "answer": "Sim. A prévia mostra os nomes resultantes antes de qualquer alteração."
        },
        {
          "question": "Meus arquivos são enviados para um servidor?",
          "answer": "Não. O processamento é local e não exige conta nem armazenamento em nuvem."
        }
      ],
      "seoDescription": "Renomeie arquivos em lote com o Aligna. Adicione datas e números, use dados de fotos e músicas e confira os novos nomes antes de aplicar as alterações."
    },
    clipnest: {
      "subtitle": "Teclado com área de transferência",
      "body": "ClipNest é uma ferramenta local de área de transferência para iPhone e iPad.\n\nQuando o teclado ClipNest é aberto, ele verifica a área de transferência naquele momento e salva novos textos no dispositivo. Assim você pode reutilizar mensagens, endereços, e-mails, links e trechos frequentes sem procurar novamente em outros apps ou notas.\n\n## Principais recursos\n\n- Salvar o texto copiado ao abrir o teclado\n- Colar diretamente pelo teclado\n- Fixar itens usados com frequência\n- Reutilizar o histórico recente\n- Tratar entradas duplicadas\n- Armazenamento local no dispositivo\n\nClipNest não monitora a área de transferência continuamente. Os textos salvos não são enviados para servidores externos. Não há conta, anúncios nem assinatura.",
      "faqTitle": "Perguntas frequentes",
      "faq": [
        {
          "question": "Posso colar textos salvos diretamente pelo teclado?",
          "answer": "Sim. Abra o teclado ClipNest e escolha um texto salvo para colá-lo no app em que você está digitando."
        },
        {
          "question": "O ClipNest monitora a área de transferência o tempo todo?",
          "answer": "Não. Ele verifica o conteúdo atual uma vez quando o teclado é aberto."
        },
        {
          "question": "Os textos salvos são enviados para um servidor?",
          "answer": "Não. Eles permanecem armazenados localmente no dispositivo."
        },
        {
          "question": "Posso fixar textos que uso sempre?",
          "answer": "Sim. Itens importantes podem ser fixados para acesso rápido pelo teclado."
        }
      ],
      "seoDescription": "Salve textos ao abrir o teclado ClipNest, fixe frases frequentes e cole em outros apps. Os textos ficam no seu iPhone ou iPad, sem envio a servidores.",
      "seoTitle": "ClipNest - Teclado com área de transferência"
    },
    meriq: {
      "subtitle": "Crie adesivos e chaveiros de acrílico",
      "body": "O Meriq ajuda você a preparar arquivos para imprimir adesivos, chaveiros de acrílico e photocards. Escolha as medidas recomendadas para o produto ou informe o tamanho final desejado e posicione sua arte na frente ou no verso, tudo em um só projeto.\n\nNos projetos de chaveiros de acrílico transparente e adesivos com corte especial, o Meriq gera no dispositivo uma sugestão de remoção de fundo para imagens opacas que atendam aos critérios. Confira o resultado, aplique, ajuste a seleção ou mantenha a imagem original.\n\n## Principais recursos\n\n- Escolha medidas recomendadas por produto ou defina o tamanho final\n- Posicione imagens e edite as camadas de produção da frente e do verso\n- Confira a remoção de fundo antes de aplicar ou ajustar a seleção\n- Prepare linhas de corte vetoriais e uma camada de tinta branca sob a arte\n- Prepare e edite as camadas de acabamento compatíveis\n- Confira as dimensões reais e a resolução da imagem com uma verificação básica de produção\n- Exporte PNG transparente e PDF com o conteúdo de produção combinado\n- Transfira projetos editáveis em pacotes ZIP padrão\n\nO PDF combina o conteúdo de produção e não mantém camadas de produção editáveis separadamente. Antes de enviar à gráfica, confirme os formatos de arquivo e as medidas exigidos.\n\nOs projetos e as imagens importadas ficam armazenados no dispositivo. As prévias e exportações também são processadas localmente. Não é preciso criar conta nem fazer login, e não há anúncios ou sincronização em nuvem. Você escolhe os arquivos a importar; exportar, compartilhar e transferir projetos só acontece quando você inicia essas ações. O conteúdo de imagens e projetos não é gravado em logs de diagnóstico.\n\nPreparar e editar camadas de acabamento exige Meriq Pro.",
      "faqTitle": "Perguntas frequentes",
      "faq": [
        {
          "question": "Quais formatos posso exportar?",
          "answer": "Você pode exportar PNG transparente e PDF com o conteúdo de produção combinado. O PDF não mantém camadas de produção editáveis separadamente. Para transferir um projeto editável, use um pacote ZIP padrão."
        },
        {
          "question": "O Meriq envia projetos ou imagens para servidores?",
          "answer": "Não. Os projetos e as imagens importadas ficam no dispositivo, e as prévias e exportações são processadas localmente. Sua arte não é enviada aos servidores da ONNELLAB. Compras e restaurações são processadas pela App Store ou pelo Google Play sem enviar o conteúdo do projeto."
        },
        {
          "question": "O compartilhamento ou a exportação acontece automaticamente?",
          "answer": "Não. Exportar, compartilhar e transferir um pacote ZIP de projeto só acontece quando você inicia a ação."
        },
        {
          "question": "Os recursos de acabamento exigem Pro?",
          "answer": "Sim. Preparar e editar as camadas de acabamento compatíveis exige Meriq Pro."
        }
      ],
      "seoDescription": "Prepare arquivos de adesivos, chaveiros de acrílico e photocards com Meriq. Ajuste corte, tinta branca e tamanho, depois exporte em PNG ou PDF."
    },
    quivra: {
      "subtitle": "Conversor de mídia",
      "body": "Quivra é um conversor de mídia de compra única que transforma WAV, M4A, MP4 e MOV seguindo regras fixas. Não há anúncios nem assinatura.\n\nAo escolher um arquivo, o app seleciona automaticamente a conversão adequada ao formato de entrada. Você não precisa configurar o formato de saída antes de começar.\n\n## Principais recursos\n\n- WAV para MP3\n- M4A para MP3\n- Extrair áudio MP3 de MP4\n- MOV para vídeo MP4\n- Escolher a conversão automaticamente pelo formato de entrada\n- Lembrar o destino e tratar nomes duplicados automaticamente\n\nO local de saída escolhido é lembrado e conflitos de nome são tratados automaticamente. O arquivo original não é alterado; um novo arquivo convertido é criado.",
      "faqTitle": "Perguntas frequentes",
      "faq": [
        {
          "question": "Quais conversões são suportadas?",
          "answer": "WAV e M4A viram MP3, MP4 pode ter o áudio extraído para MP3 e MOV é convertido em vídeo MP4."
        },
        {
          "question": "Preciso escolher o formato de saída?",
          "answer": "Não. A conversão é escolhida automaticamente conforme o formato do arquivo de entrada."
        },
        {
          "question": "O arquivo original é modificado?",
          "answer": "Não. O original permanece intacto e o resultado é salvo como um novo arquivo."
        },
        {
          "question": "Preciso escolher o destino a cada conversão?",
          "answer": "Não. O Quivra lembra o local escolhido e trata nomes de arquivo duplicados automaticamente."
        }
      ],
      "seoDescription": "Converta WAV e M4A para MP3, extraia MP3 de MP4 ou transforme MOV em MP4 com Quivra. A conversão é escolhida automaticamente e o original é preservado."
    },
    segra: {
      "subtitle": "Cortar e combinar áudio",
      "body": "Segra é uma ferramenta simples para tarefas comuns com áudio. Você pode recortar partes de MP3 e WAV, combinar várias gravações e criar um vídeo MP4 a partir de áudio e imagem.\n\nO foco não é produção musical completa, e sim recortar gravações longas, juntar arquivos na ordem escolhida e preparar vídeos simples para narração, podcasts, audiolivros ou áudio TTS.\n\n## Principais recursos\n\n- Escolher ponto inicial e final para recortar\n- Combinar vários arquivos de áudio\n- Criar MP4 com áudio e imagem\n- Preservar os arquivos originais\n- Processar tudo localmente e offline\n\nNão há login, upload de arquivos, anúncios nem rastreamento.",
      "faqTitle": "Perguntas frequentes",
      "faq": [
        {
          "question": "Quais tarefas de áudio são suportadas?",
          "answer": "Recorte de MP3/WAV, combinação de arquivos e criação de MP4 com áudio e imagem."
        },
        {
          "question": "O arquivo de áudio original é alterado?",
          "answer": "Não. Recortes e combinações são salvos como novos arquivos."
        },
        {
          "question": "Posso transformar uma gravação em vídeo MP4?",
          "answer": "Sim. Combine um arquivo de áudio com uma imagem para criar um vídeo MP4 simples, por exemplo para narração, podcasts ou áudio TTS."
        },
        {
          "question": "Os arquivos são enviados para um servidor?",
          "answer": "Não. O processamento ocorre no dispositivo."
        }
      ],
      "seoDescription": "Recorte MP3 e WAV, junte gravações ou crie vídeos MP4 com áudio e imagem no Segra. Tudo é processado offline, sem alterar os arquivos originais."
    },
    tagweaver: {
      "subtitle": "Editor offline de tags MP3 e FLAC",
      "body": "TagWeaver é um editor offline para conferir e editar metadados, avaliações, capas e letras em arquivos MP3 e FLAC.\n\nEdite título, artista, álbum, artista do álbum, número da faixa e do disco, ano, gênero, compositor e avaliação. Capas e letras também fazem parte do mesmo fluxo de edição.\n\n## Principais recursos\n\n- Editar tags como título, artista e álbum\n- Editar a avaliação das faixas\n- Gerenciar capas de álbuns\n- Adicionar e editar letras\n- Ler e gravar tags ID3 em MP3 e Vorbis Comment em FLAC\n- Selecionar e editar vários arquivos juntos\n- Conferir as alterações antes de salvar\n\nA edição ocorre no dispositivo, sem login, envio de arquivos, anúncios ou rastreamento.\n\nO salvamento em lote de vários arquivos está disponível com o Pro.",
      "faqTitle": "Perguntas frequentes",
      "faq": [
        {
          "question": "Posso editar MP3 e FLAC?",
          "answer": "Sim. O TagWeaver suporta tags ID3 de MP3 e Vorbis Comment de FLAC."
        },
        {
          "question": "Também posso editar capas e letras?",
          "answer": "Sim. Além de tags e avaliações, você pode gerenciar as capas dos álbuns e adicionar ou editar letras."
        },
        {
          "question": "Os arquivos são enviados para um servidor?",
          "answer": "Não. A edição acontece localmente, sem login nem upload de arquivos."
        },
        {
          "question": "Posso salvar alterações em vários arquivos de uma vez?",
          "answer": "Sim. Seleção e edição em lote são suportadas; o salvamento em lote de vários arquivos está disponível no Pro."
        }
      ],
      "seoDescription": "Edite tags, avaliações, capas e letras de MP3 e FLAC com TagWeaver. Confira as alterações antes de salvar e trabalhe no dispositivo, sem enviar arquivos."
    },
    vaultxt: make('Editor para arquivos TXT grandes', `VaultXT é um editor de texto rápido e leve, projetado para arquivos grandes.\n\nAbra e edite documentos longos, logs, rascunhos e dados de texto que podem ficar pesados em apps de notas comuns. Os arquivos são abertos diretamente do dispositivo e salvos sem envio para serviços em nuvem.\n\n## Principais recursos\n\n- Abrir rapidamente arquivos TXT grandes\n- Ler e editar documentos longos\n- Salvamento automático\n- Recuperação com desfazer e snapshots\n- Armazenamento local e funcionamento offline\n\nNão há conta, anúncios nem rastreamento, e o conteúdo do arquivo não é enviado a servidores externos.`, 'Perguntas frequentes', [
      { question: 'Posso abrir arquivos TXT muito grandes?', answer: 'Sim. O VaultXT é voltado para TXT grandes, documentos longos, logs, rascunhos e dados exportados.' },
      { question: 'Como posso recuperar alterações?', answer: 'O design usa salvamento automático, desfazer e snapshots para oferecer caminhos de recuperação.' },
      { question: 'O conteúdo do arquivo é enviado para um servidor?', answer: 'Não. O processamento e o salvamento permanecem no dispositivo.' }
    ]),
    papira: make('Criador offline de EPUB a partir de TXT', getPapiraDescription('pt-BR'), 'Perguntas frequentes', [
      {
        "question": "Que tipos de obra posso preparar?",
        "answer": "Qualquer conteúdo TXT finalizado pode ser convertido em EPUB. As predefinições apenas agilizam fluxos criativos comuns."
      },
      {
        "question": "Posso editar o manuscrito no Papira?",
        "answer": "O Papira serve para montar um manuscrito finalizado em EPUB. Faça as alterações no TXT primeiro no editor de sua preferência."
      },
      {
        "question": "A exportação substitui arquivos existentes?",
        "answer": "Não. Se o nome de saída já estiver em uso, o Papira acrescenta um número automaticamente e salva outro arquivo."
      },
      {
        "question": "Os manuscritos são enviados para um servidor?",
        "answer": "Não. Arquivos TXT, capas, projetos, prévias e EPUBs gerados são processados no dispositivo."
      }
    ])
  },
  de: {
    aligna: {
      "subtitle": "Stapel-Umbenennung von Dateien",
      "body": "Aligna benennt mehrere Dateien mit klaren, vorhersehbaren Regeln um.\n\nWende einheitliche Namensmuster auf Fotos, Musik und Dokumente an: Datum oder laufende Nummer ergänzen, Leerzeichen ersetzen, unzulässige Zeichen entfernen oder Musikdateinamen aus Tags erzeugen.\n\n## Hauptfunktionen\n\n- Datumsangaben ergänzen\n- Laufende Nummern ergänzen\n- Leerzeichen durch Unterstriche ersetzen\n- Unzulässige Zeichen entfernen\n- Fotos nach Aufnahmedatum ordnen\n- Dateinamen aus Künstler, Tracknummer und Titel erzeugen\n- Änderungen vor dem Anwenden in der Vorschau prüfen\n\nAligna ist weder Dateimanager noch Cloud-Dienst. Es gibt kein Konto und keine Werbung; die Verarbeitung erfolgt auf dem Gerät. Unter iOS kann wegen Systembeschränkungen eine neu benannte Kopie gespeichert werden, statt die Originaldatei direkt umzubenennen.",
      "faqTitle": "Häufige Fragen",
      "faq": [
        {
          "question": "Welche Regeln kann ich für Dateinamen verwenden?",
          "answer": "Ergänze Datumsangaben oder laufende Nummern, bereinige Leerzeichen und unzulässige Zeichen oder nutze Aufnahmedaten und Musikmetadaten wie Künstler, Tracknummer und Titel."
        },
        {
          "question": "Wird die Originaldatei direkt umbenannt?",
          "answer": "Unter Android können ausgewählte Dateien umbenannt werden. Unter iOS wird wegen Systembeschränkungen eine neue Datei mit dem neuen Namen gespeichert."
        },
        {
          "question": "Kann ich die neuen Namen vorher prüfen?",
          "answer": "Ja. Eine Vorschau zeigt die neuen Dateinamen vor der Anwendung."
        },
        {
          "question": "Werden Dateien an einen Server gesendet?",
          "answer": "Nein. Die Verarbeitung erfolgt lokal auf dem Gerät."
        }
      ],
      "seoDescription": "Mit Aligna Dateien stapelweise umbenennen: Datum, Nummern, Foto- und Musikmetadaten nutzen und neue Dateinamen vor dem Anwenden in der Vorschau prüfen."
    },
    clipnest: {
      "subtitle": "Zwischenablage & Textbaustein-Tastatur",
      "body": "ClipNest ist ein lokal arbeitendes Zwischenablage-Werkzeug für iPhone und iPad.\n\nBeim Öffnen der ClipNest-Tastatur wird die aktuelle Zwischenablage einmal geprüft und neuer Text auf dem Gerät gespeichert. So lassen sich Nachrichten, Adressen, E-Mail-Adressen, Links und häufige Textbausteine schnell wiederverwenden.\n\n## Hauptfunktionen\n\n- Kopierten Text beim Öffnen der Tastatur speichern\n- Direkt über die Tastatur einfügen\n- Häufige Einträge anheften\n- Letzte Kopien wiederverwenden\n- Doppelte Einträge verwalten\n- Lokale Speicherung auf dem Gerät\n\nDie Zwischenablage wird nicht dauerhaft überwacht. Gespeicherte Texte werden nicht an externe Server gesendet. Es gibt kein Konto, keine Werbung und kein Abonnement.",
      "faqTitle": "Häufige Fragen",
      "faq": [
        {
          "question": "Kann ich gespeicherten Text direkt über die Tastatur einfügen?",
          "answer": "Ja. Öffne die ClipNest-Tastatur und wähle einen gespeicherten Text aus, um ihn in der App einzufügen, in der du gerade schreibst."
        },
        {
          "question": "Überwacht ClipNest die Zwischenablage ständig?",
          "answer": "Nein. Der aktuelle Inhalt wird einmal geprüft, wenn die Tastatur geöffnet wird."
        },
        {
          "question": "Werden gespeicherte Texte an einen Server gesendet?",
          "answer": "Nein. Sie bleiben lokal auf dem Gerät."
        },
        {
          "question": "Kann ich häufige Texte anheften?",
          "answer": "Ja. Wichtige Texte können für schnellen Zugriff über die Tastatur angeheftet werden."
        }
      ],
      "seoDescription": "ClipNest speichert kopierten Text beim Öffnen der Tastatur. Textbausteine anheften und in andere Apps einfügen – lokal auf deinem iPhone oder iPad.",
      "seoTitle": "ClipNest - Zwischenablage & Textbaustein-Tastatur"
    },
    meriq: {
      "subtitle": "Sticker & Acrylanhänger gestalten",
      "body": "Mit Meriq bereitest du Druckdaten für Aufkleber, Acryl-Schlüsselanhänger und Fotokarten vor. Wähle empfohlene Produktmaße oder gib eigene Endmaße ein und platziere dein Motiv auf der Vorder- oder Rückseite – alles in einem Projekt.\n\nBei Projekten für transparente Acryl-Schlüsselanhänger und formgeschnittene Aufkleber erstellt Meriq auf deinem Gerät einen Vorschlag zur Hintergrundentfernung für geeignete Bilder ohne Transparenz. Prüfe das Ergebnis, übernimm es, passe die Auswahl an oder behalte das Original.\n\n## Hauptfunktionen\n\n- Produktspezifische Maßempfehlungen nutzen oder eigene Endmaße festlegen\n- Bilder auf Vorder- und Rückseite platzieren und Produktionsebenen bearbeiten\n- Hintergrundentfernung prüfen und die Auswahl vor dem Anwenden anpassen\n- Vektor-Schnittkonturen und eine weiße Druckschicht unter dem Motiv vorbereiten\n- Unterstützte Veredelungsebenen vorbereiten und bearbeiten\n- Tatsächliche Abmessungen und Bildauflösung mit einer grundlegenden Produktionsprüfung kontrollieren\n- Transparente PNG-Dateien und PDF-Dateien mit zusammengeführten Produktionsinhalten exportieren\n- Bearbeitbare Projekte in Standard-ZIP-Paketen übertragen\n\nDer PDF-Export führt Produktionsinhalte zusammen und enthält keine einzeln bearbeitbaren Produktionsebenen. Prüfe vor der Abgabe die Datei- und Größenvorgaben deiner Druckerei.\n\nProjekte und importierte Bilder werden lokal auf deinem Gerät gespeichert. Auch Vorschau und Export werden dort verarbeitet. Du brauchst weder ein Konto noch eine Anmeldung; Werbung und Cloud-Synchronisierung gibt es nicht. Du wählst die Dateien zum Importieren selbst aus. Export, Teilen und Projektübertragung starten nur auf deine Anweisung. Bild- und Projektinhalte werden nicht in Diagnoseprotokolle geschrieben.\n\nDas Vorbereiten und Bearbeiten von Veredelungsebenen erfordert Meriq Pro.",
      "faqTitle": "Häufige Fragen",
      "faq": [
        {
          "question": "Welche Dateiformate kann ich exportieren?",
          "answer": "Du kannst transparente PNG-Dateien und PDF-Dateien mit zusammengeführten Produktionsinhalten exportieren. Die Produktionsebenen der PDF-Datei sind nicht einzeln bearbeitbar. Bearbeitbare Projekte kannst du als Standard-ZIP-Paket übertragen."
        },
        {
          "question": "Lädt Meriq Projekte oder Bilder auf einen Server hoch?",
          "answer": "Nein. Projekte und importierte Bilder bleiben auf deinem Gerät. Auch Vorschau und Export werden lokal verarbeitet. Deine Motive werden nicht auf ONNELLAB-Server hochgeladen. Käufe und Wiederherstellungen werden vom App Store oder von Google Play verarbeitet, ohne Projektinhalte hochzuladen."
        },
        {
          "question": "Werden Dateien automatisch exportiert oder geteilt?",
          "answer": "Nein. Export, Teilen und die Übertragung von ZIP-Projektpaketen starten nur auf deine Anweisung."
        },
        {
          "question": "Brauche ich Pro für Veredelungsfunktionen?",
          "answer": "Ja. Zum Vorbereiten und Bearbeiten der unterstützten Veredelungsebenen ist Meriq Pro erforderlich."
        }
      ],
      "seoDescription": "Mit Meriq Druckdaten für Aufkleber, Acrylanhänger und Fotokarten vorbereiten. Schnittkonturen, Weißdruck und Maße festlegen und als PNG oder PDF exportieren."
    },
    quivra: {
      "subtitle": "Medienkonverter",
      "body": "Quivra wandelt WAV-, M4A-, MP4- und MOV-Dateien nach festen Regeln um. Die App wird einmal gekauft und kommt ohne Werbung und Abonnement aus.\n\nNach der Dateiauswahl bestimmt das Eingabeformat automatisch die passende Konvertierung. Ein Ausgabeformat muss vorher nicht gewählt werden.\n\n## Hauptfunktionen\n\n- WAV zu MP3\n- M4A zu MP3\n- MP3-Audio aus MP4 extrahieren\n- MOV zu MP4-Video\n- Passende Konvertierung anhand des Eingabeformats wählen\n- Speicherort merken und Namenskonflikte automatisch lösen\n\nDer gewählte Ausgabeordner wird gemerkt und Namenskonflikte werden automatisch behandelt. Die Originaldatei bleibt unverändert; das Ergebnis wird als neue Datei erstellt.",
      "faqTitle": "Häufige Fragen",
      "faq": [
        {
          "question": "Welche Konvertierungen werden unterstützt?",
          "answer": "WAV und M4A zu MP3, MP4-Audio zu MP3 und MOV zu MP4-Video."
        },
        {
          "question": "Muss ich ein Ausgabeformat wählen?",
          "answer": "Nein. Die Konvertierung wird aus dem Eingabeformat abgeleitet."
        },
        {
          "question": "Wird die Originaldatei verändert?",
          "answer": "Nein. Das Original bleibt erhalten."
        },
        {
          "question": "Muss ich den Speicherort jedes Mal neu auswählen?",
          "answer": "Nein. Quivra merkt sich den gewählten Speicherort und löst Konflikte mit vorhandenen Dateinamen automatisch."
        }
      ],
      "seoDescription": "Quivra wandelt WAV und M4A in MP3 um, extrahiert MP3-Audio aus MP4 und konvertiert MOV in MP4. Die Konvertierung wird automatisch gewählt; das Original bleibt erhalten."
    },
    segra: {
      "subtitle": "Audio schneiden und zusammenfügen",
      "body": "Segra ist ein einfaches Werkzeug für häufige Audioarbeiten. Schneide Bereiche aus MP3/WAV, füge mehrere Aufnahmen zusammen oder erstelle ein MP4-Video aus Audio und Bild.\n\nIm Mittelpunkt steht nicht Musikproduktion, sondern das Kürzen langer Aufnahmen, das Zusammenfügen in gewünschter Reihenfolge und einfache Videos für Sprechertext, Podcasts, Hörbücher oder TTS-Audio.\n\n## Hauptfunktionen\n\n- Start- und Endpunkt zum Ausschneiden wählen\n- Mehrere Audiodateien zusammenfügen\n- MP4 aus Audio und Bild erstellen\n- Originaldateien erhalten\n- Komplett lokal und offline verarbeiten\n\nKein Login, kein Datei-Upload, keine Werbung und kein Tracking.",
      "faqTitle": "Häufige Fragen",
      "faq": [
        {
          "question": "Welche Audioarbeiten werden unterstützt?",
          "answer": "MP3/WAV schneiden, Dateien zusammenfügen und MP4 aus Audio plus Bild erstellen."
        },
        {
          "question": "Wird die Original-Audiodatei verändert?",
          "answer": "Nein. Ausschnitte und Zusammenführungen werden als neue Dateien gespeichert."
        },
        {
          "question": "Kann ich aus einer Aufnahme ein MP4-Video erstellen?",
          "answer": "Ja. Kombiniere eine Audiodatei mit einem Bild, um ein einfaches MP4-Video zu erstellen, etwa für Sprechertext, Podcasts oder TTS-Audio."
        },
        {
          "question": "Werden Dateien an einen Server gesendet?",
          "answer": "Nein. Die Verarbeitung erfolgt auf dem Gerät."
        }
      ],
      "seoDescription": "Mit Segra MP3 und WAV schneiden, Aufnahmen zusammenfügen oder MP4-Videos aus Audio und Bild erstellen. Alles offline, ohne die Originaldateien zu verändern."
    },
    tagweaver: {
      "subtitle": "Offline-Editor für MP3- und FLAC-Tags",
      "body": "TagWeaver ist ein Offline-Tag-Editor zum Prüfen und Bearbeiten von Metadaten, Bewertungen, Coverbildern und Liedtexten in MP3- und FLAC-Dateien.\n\nBearbeite Titel, Künstler, Album, Album-Künstler, Track- und Discnummer, Jahr, Genre, Komponist und Bewertung. Cover und Liedtexte gehören zum selben Bearbeitungsablauf.\n\n## Hauptfunktionen\n\n- Tag-Felder wie Titel, Künstler und Album bearbeiten\n- Bewertungen bearbeiten\n- Albumcover verwalten\n- Liedtexte hinzufügen und bearbeiten\n- MP3-ID3- und FLAC-Vorbis-Comment-Tags lesen und schreiben\n- Mehrere Dateien auswählen und gemeinsam bearbeiten\n- Änderungen vor dem Speichern prüfen\n\nDie Bearbeitung erfolgt auf deinem Gerät, ohne Anmeldung, Datei-Upload, Werbung oder Tracking.\n\nDas gemeinsame Speichern mehrerer Dateien ist mit Pro verfügbar.",
      "faqTitle": "Häufige Fragen",
      "faq": [
        {
          "question": "Kann ich MP3 und FLAC bearbeiten?",
          "answer": "Ja. Unterstützt werden MP3-ID3-Tags und FLAC-Vorbis-Comments."
        },
        {
          "question": "Kann ich auch Albumcover und Liedtexte bearbeiten?",
          "answer": "Ja. Neben Tag-Feldern und Bewertungen kannst du Albumcover verwalten und Liedtexte hinzufügen oder bearbeiten."
        },
        {
          "question": "Werden Dateien auf einen Server hochgeladen?",
          "answer": "Nein. Die Bearbeitung erfolgt lokal ohne Login oder Datei-Upload."
        },
        {
          "question": "Kann ich mehrere Dateien gemeinsam speichern?",
          "answer": "Mehrfachauswahl und Stapelbearbeitung werden unterstützt; das Stapelspeichern mehrerer Dateien ist in Pro verfügbar."
        }
      ],
      "seoDescription": "Mit TagWeaver MP3- und FLAC-Tags, Bewertungen, Cover und Liedtexte bearbeiten. Änderungen vor dem Speichern prüfen – lokal auf dem Gerät, ohne Datei-Upload."
    },
    vaultxt: make('Editor für große TXT-Dateien', `VaultXT ist ein schneller, leichter Texteditor für große Dateien.\n\nÖffne und bearbeite lange Dokumente, Logs, Entwürfe und exportierte Textdaten, die in gewöhnlichen Notiz-Apps schwerfällig werden können. Dateien werden direkt vom Gerät geöffnet und ohne Cloud-Upload gespeichert.\n\n## Hauptfunktionen\n\n- Große TXT-Dateien schnell öffnen\n- Lange Dokumente lesen und bearbeiten\n- Automatisch speichern\n- Wiederherstellung mit Rückgängig und Snapshots\n- Lokal und offline arbeiten\n\nKein Konto, keine Werbung, kein Tracking; Dateiinhalte werden nicht an externe Server gesendet.`, 'Häufige Fragen', [{ question: 'Kann VaultXT sehr große TXT-Dateien öffnen?', answer: 'Ja. Es ist für große TXT-Dateien, lange Dokumente, Logs, Entwürfe und exportierte Textdaten ausgelegt.' }, { question: 'Wie kann ich Änderungen wiederherstellen?', answer: 'Automatisches Speichern, Rückgängig und Snapshots bieten Wiederherstellungsmöglichkeiten.' }, { question: 'Werden Dateiinhalte an einen Server gesendet?', answer: 'Nein. Verarbeitung und Speicherung bleiben lokal.' }]),
    papira: make('Offline-TXT-zu-EPUB-Ersteller', getPapiraDescription('de'), 'Häufige Fragen', [
      {
        "question": "Welche Arten von Werken kann ich vorbereiten?",
        "answer": "Jeder fertige TXT-Inhalt kann in EPUB umgewandelt werden. Die Voreinstellungen beschleunigen lediglich häufige kreative Abläufe."
      },
      {
        "question": "Kann ich das Manuskript in Papira bearbeiten?",
        "answer": "Papira ist dafür gedacht, ein fertiges Manuskript als EPUB zusammenzusetzen. Bearbeite den TXT-Quelltext vorher in deinem bevorzugten Schreibprogramm."
      },
      {
        "question": "Werden beim Export vorhandene Dateien überschrieben?",
        "answer": "Nein. Ist der Ausgabename schon vergeben, ergänzt Papira automatisch eine Nummer und speichert eine neue Datei."
      },
      {
        "question": "Werden Manuskripte auf einen Server hochgeladen?",
        "answer": "Nein. TXT-Dateien, Coverbilder, Projekte, Vorschauen und erzeugte EPUB-Dateien werden auf dem Gerät verarbeitet."
      }
    ])
  },
  fr: {
    aligna: {
      "subtitle": "Renommage de fichiers par lot",
      "body": "Aligna renomme plusieurs fichiers avec des règles claires et prévisibles.\n\nAppliquez les mêmes conventions aux photos, musiques et documents : ajoutez une date ou une numérotation, remplacez les espaces, retirez les caractères interdits ou créez des noms de fichiers audio à partir des tags.\n\n## Fonctions principales\n\n- Ajouter des dates\n- Ajouter une numérotation\n- Remplacer les espaces par des tirets bas\n- Retirer les caractères interdits\n- Organiser les photos par date de prise de vue\n- Créer des noms à partir de l’artiste, du numéro de piste et du titre\n- Vérifier l’aperçu avant application\n\nAligna n’est ni un explorateur de fichiers ni un service cloud. Aucun compte, aucune publicité ; le traitement reste sur l’appareil. Sur iOS, les limites du système peuvent imposer l’enregistrement d’une nouvelle copie renommée plutôt que la modification directe de l’original.",
      "faqTitle": "Questions fréquentes",
      "faq": [
        {
          "question": "Quelles règles de nommage puis-je utiliser ?",
          "answer": "Ajoutez des dates ou des numéros, remplacez les espaces et retirez les caractères interdits. Vous pouvez aussi utiliser la date des photos ou l’artiste, le numéro de piste et le titre des morceaux."
        },
        {
          "question": "Le fichier original est-il renommé directement ?",
          "answer": "Sur Android, les fichiers choisis peuvent être renommés. Sur iOS, une nouvelle copie portant le nouveau nom est enregistrée en raison des limites du système."
        },
        {
          "question": "Puis-je vérifier les nouveaux noms avant de les appliquer ?",
          "answer": "Oui. L’aperçu montre les noms obtenus avant toute modification."
        },
        {
          "question": "Les fichiers sont-ils envoyés vers un serveur ?",
          "answer": "Non. Le traitement reste local."
        }
      ],
      "seoDescription": "Renommez vos fichiers par lot avec Aligna : dates, numéros, données des photos et tags musicaux. Vérifiez les nouveaux noms avant toute modification."
    },
    clipnest: {
      "subtitle": "Clavier avec presse-papiers",
      "body": "ClipNest est un outil de presse-papiers local pour iPhone et iPad.\n\nÀ l’ouverture du clavier ClipNest, le presse-papiers courant est vérifié une fois et les nouveaux textes sont enregistrés sur l’appareil. Messages, adresses, e-mails, liens et phrases fréquentes peuvent ainsi être réutilisés rapidement.\n\n## Fonctions principales\n\n- Enregistrer le texte copié à l’ouverture du clavier\n- Coller directement depuis le clavier\n- Épingler les éléments fréquents\n- Réutiliser l’historique récent\n- Gérer les doublons\n- Stockage local sur l’appareil\n\nLe presse-papiers n’est pas surveillé en permanence. Les textes enregistrés ne sont pas envoyés à un serveur externe. Aucun compte, aucune publicité ni abonnement.",
      "faqTitle": "Questions fréquentes",
      "faq": [
        {
          "question": "Puis-je coller un texte enregistré directement depuis le clavier ?",
          "answer": "Oui. Ouvrez le clavier ClipNest et choisissez un texte enregistré pour le coller dans l’application où vous écrivez."
        },
        {
          "question": "ClipNest surveille-t-il le presse-papiers en continu ?",
          "answer": "Non. Il vérifie le contenu actuel une seule fois lorsque le clavier s’ouvre."
        },
        {
          "question": "Les textes enregistrés sont-ils envoyés à un serveur ?",
          "answer": "Non. Ils restent sur l’appareil."
        },
        {
          "question": "Puis-je épingler les textes souvent utilisés ?",
          "answer": "Oui. Les éléments importants peuvent être épinglés pour un accès rapide."
        }
      ],
      "seoDescription": "ClipNest enregistre le texte copié à l’ouverture du clavier. Épinglez vos phrases et collez-les dans d’autres apps. Les textes restent sur votre appareil.",
      "seoTitle": "ClipNest - Clavier avec presse-papiers"
    },
    meriq: {
      "subtitle": "Créez vos stickers et porte-clés",
      "body": "Meriq vous aide à préparer les fichiers d’impression de vos autocollants, porte-clés en acrylique et cartes photo. Choisissez les dimensions recommandées pour le produit ou saisissez le format fini souhaité, puis placez votre visuel au recto ou au verso dans un même projet.\n\nPour les projets de porte-clés en acrylique transparent et d’autocollants découpés à la forme, Meriq propose un détourage sur votre appareil lorsque l’image opaque remplit les conditions. Vérifiez le résultat, appliquez-le, ajustez la sélection ou conservez l’image d’origine.\n\n## Fonctions principales\n\n- Choisir les dimensions recommandées par produit ou définir un format fini personnalisé\n- Placer des images au recto et au verso et modifier les calques de production\n- Vérifier le détourage avant de l’appliquer ou d’ajuster la sélection\n- Préparer des tracés de découpe vectoriels et une couche d’encre blanche sous le visuel\n- Préparer et modifier les calques de finition pris en charge\n- Vérifier les dimensions réelles et la résolution de l’image grâce à un contrôle de production de base\n- Exporter un PNG transparent ou un PDF regroupant les éléments de production\n- Transférer des projets modifiables dans des archives ZIP standard\n\nLe PDF regroupe les éléments de production et ne conserve pas de calques de production modifiables séparément. Avant l’envoi, vérifiez les formats de fichier et les dimensions exigés par votre imprimeur.\n\nLes projets et les images importées sont stockés sur votre appareil. Les aperçus et les exports y sont aussi traités. Aucun compte ni connexion ne sont nécessaires, et il n’y a ni publicité ni synchronisation cloud. Vous choisissez les fichiers à importer. L’exportation, le partage et le transfert de projets ne démarrent qu’à votre demande. Le contenu des images et des projets n’est pas écrit dans les journaux de diagnostic.\n\nLa préparation et la modification des calques de finition nécessitent Meriq Pro.",
      "faqTitle": "Questions fréquentes",
      "faq": [
        {
          "question": "Quels formats de fichier puis-je exporter ?",
          "answer": "Vous pouvez exporter un PNG transparent ou un PDF regroupant les éléments de production. Les calques de production du PDF ne sont pas modifiables séparément. Pour transférer un projet modifiable, utilisez une archive ZIP standard."
        },
        {
          "question": "Meriq envoie-t-il mes projets ou images à un serveur ?",
          "answer": "Non. Les projets et les images importées restent sur votre appareil. Les aperçus et les exports sont traités localement. Vos créations ne sont pas envoyées aux serveurs ONNELLAB. Les achats et leurs restaurations sont traités par l’App Store ou Google Play, sans envoi du contenu du projet."
        },
        {
          "question": "Le partage ou l’exportation se lance-t-il automatiquement ?",
          "answer": "Non. L’exportation, le partage et le transfert d’un projet en ZIP ne démarrent qu’à votre demande."
        },
        {
          "question": "Les fonctions de finition nécessitent-elles Pro ?",
          "answer": "Oui. La préparation et la modification des calques de finition pris en charge nécessitent Meriq Pro."
        }
      ],
      "seoDescription": "Préparez vos fichiers d’autocollants, porte-clés en acrylique et cartes photo avec Meriq. Réglez découpe, encre blanche et dimensions, puis exportez en PNG ou PDF."
    },
    quivra: {
      "subtitle": "Convertisseur multimédia",
      "body": "Quivra est un convertisseur multimédia à achat unique pour WAV, M4A, MP4 et MOV, sans publicité ni abonnement.\n\nAprès sélection d’un fichier, le format d’entrée détermine automatiquement la conversion. Aucun format de sortie n’est à configurer avant de commencer.\n\n## Fonctions principales\n\n- WAV vers MP3\n- M4A vers MP3\n- Extraire l’audio MP3 d’un MP4\n- MOV vers vidéo MP4\n- Choisir automatiquement la conversion selon le format d’entrée\n- Mémoriser le dossier de sortie et gérer les noms en double\n\nLe dossier de sortie choisi est mémorisé et les conflits de nom sont gérés automatiquement. L’original reste intact et un nouveau fichier est créé.",
      "faqTitle": "Questions fréquentes",
      "faq": [
        {
          "question": "Quelles conversions sont disponibles ?",
          "answer": "WAV/M4A vers MP3, extraction audio MP4 vers MP3 et MOV vers vidéo MP4."
        },
        {
          "question": "Dois-je choisir le format de sortie ?",
          "answer": "Non. La conversion est déterminée par le format d’entrée."
        },
        {
          "question": "Le fichier original est-il modifié ?",
          "answer": "Non."
        },
        {
          "question": "Dois-je choisir le dossier de sortie à chaque conversion ?",
          "answer": "Non. Quivra mémorise le dossier choisi et gère automatiquement les noms de fichiers en double."
        }
      ],
      "seoDescription": "Convertissez WAV et M4A en MP3, extrayez le son MP3 d’un MP4 ou passez de MOV à MP4 avec Quivra. La conversion est automatique et l’original est conservé."
    },
    segra: {
      "subtitle": "Découper et assembler de l’audio",
      "body": "Segra simplifie les tâches audio courantes : découper une partie d’un MP3/WAV, assembler plusieurs enregistrements ou créer une vidéo MP4 à partir d’un audio et d’une image.\n\nL’objectif n’est pas la production musicale complète, mais le découpage d’enregistrements longs, l’assemblage dans l’ordre choisi et les vidéos simples pour narration, podcasts, livres audio ou TTS.\n\n## Fonctions principales\n\n- Choisir début et fin d’un extrait\n- Assembler plusieurs fichiers audio\n- Créer un MP4 avec audio et image\n- Préserver les fichiers originaux\n- Tout traiter localement et hors ligne\n\nAucun compte requis, aucun envoi de fichier, aucune publicité ni suivi.",
      "faqTitle": "Questions fréquentes",
      "faq": [
        {
          "question": "Quelles tâches audio sont prises en charge ?",
          "answer": "Découpe MP3/WAV, assemblage de fichiers et création MP4 avec audio et image."
        },
        {
          "question": "Le fichier audio original est-il modifié ?",
          "answer": "Non. Les extraits et assemblages sont enregistrés comme nouveaux fichiers."
        },
        {
          "question": "Puis-je transformer un enregistrement en vidéo MP4 ?",
          "answer": "Oui. Associez un fichier audio à une image pour créer une vidéo MP4 simple, par exemple pour une narration, un podcast ou une voix TTS."
        },
        {
          "question": "Les fichiers sont-ils envoyés à un serveur ?",
          "answer": "Non."
        }
      ],
      "seoDescription": "Découpez des MP3 et WAV, assemblez des enregistrements ou créez des MP4 avec un fichier audio et une image dans Segra. Traitement local, originaux préservés."
    },
    tagweaver: {
      "subtitle": "Éditeur hors ligne de tags MP3/FLAC",
      "body": "TagWeaver permet de vérifier et modifier hors ligne métadonnées, notes, pochettes et paroles des fichiers MP3 et FLAC.\n\nModifiez titre, artiste, album, artiste de l’album, numéros de piste et de disque, année, genre, compositeur et note. Pochettes et paroles sont gérées dans le même flux.\n\n## Fonctions principales\n\n- Modifier les tags, dont le titre, l’artiste et l’album\n- Modifier les notes des morceaux\n- Gérer les pochettes d’album\n- Ajouter et modifier les paroles\n- Lire et enregistrer les tags ID3 des MP3 et Vorbis Comment des FLAC\n- Sélectionner et modifier plusieurs fichiers ensemble\n- Vérifier les modifications avant de les enregistrer\n\nLes modifications sont effectuées sur votre appareil, sans connexion à un compte, envoi de fichiers, publicité ni suivi.\n\nL’enregistrement de plusieurs fichiers à la fois est disponible avec Pro.",
      "faqTitle": "Questions fréquentes",
      "faq": [
        {
          "question": "Puis-je modifier MP3 et FLAC ?",
          "answer": "Oui. ID3 MP3 et Vorbis Comment FLAC sont pris en charge."
        },
        {
          "question": "Puis-je aussi modifier les pochettes et les paroles ?",
          "answer": "Oui. En plus des tags et des notes, vous pouvez gérer les pochettes d’album et ajouter ou modifier les paroles."
        },
        {
          "question": "Les fichiers sont-ils envoyés à un serveur ?",
          "answer": "Non. La modification est locale."
        },
        {
          "question": "Puis-je enregistrer plusieurs fichiers ensemble ?",
          "answer": "Oui. La sélection et l’édition en lot sont prises en charge ; l’enregistrement multiple est disponible avec Pro."
        }
      ],
      "seoDescription": "Modifiez les tags, notes, pochettes et paroles des MP3 et FLAC avec TagWeaver. Vérifiez vos modifications avant de les enregistrer, sans envoyer vos fichiers."
    },
    vaultxt: make('Éditeur de gros fichiers TXT', `VaultXT est un éditeur de texte rapide et léger conçu pour les gros fichiers.\n\nOuvrez et modifiez longs documents, journaux, brouillons et données texte exportées sans les envoyer vers un service cloud.\n\n## Fonctions principales\n\n- Ouvrir rapidement de gros TXT\n- Lire et modifier de longs documents\n- Sauvegarde automatique\n- Récupération avec annulation et snapshots\n- Travail local et hors ligne\n\nAucun compte, aucune publicité ni suivi ; le contenu n’est pas envoyé à un serveur externe.`, 'Questions fréquentes', [{ question: 'Puis-je ouvrir de très gros fichiers TXT ?', answer: 'Oui. VaultXT est conçu pour les gros TXT, longs documents, logs, brouillons et données exportées.' }, { question: 'Comment récupérer mes modifications ?', answer: 'Sauvegarde automatique, annulation et snapshots offrent des voies de récupération.' }, { question: 'Le contenu est-il envoyé à un serveur ?', answer: 'Non.' }]),
    papira: make('Créateur EPUB hors ligne à partir de TXT', getPapiraDescription('fr'), 'Questions fréquentes', [
      {
        "question": "Quels types d’œuvres puis-je préparer ?",
        "answer": "Tout contenu TXT finalisé peut être converti en EPUB. Les préréglages servent seulement à accélérer les flux créatifs courants."
      },
      {
        "question": "Puis-je modifier le manuscrit dans Papira ?",
        "answer": "Papira sert à assembler un manuscrit finalisé en EPUB. Modifiez d’abord le TXT source dans votre outil d’écriture habituel."
      },
      {
        "question": "L’exportation écrase-t-elle les fichiers existants ?",
        "answer": "Non. Si le nom de sortie est déjà utilisé, Papira ajoute automatiquement un numéro et enregistre un autre fichier."
      },
      {
        "question": "Les manuscrits sont-ils envoyés vers un serveur ?",
        "answer": "Non. Les fichiers TXT, couvertures, projets, aperçus et EPUB générés sont traités sur l’appareil."
      }
    ])
  },
  es: {
    aligna: {
      "subtitle": "Renombrador de archivos por lotes",
      "body": "Aligna cambia el nombre de varios archivos usando reglas claras y predecibles.\n\nAplica patrones uniformes a fotos, música y documentos: añade fechas o números correlativos, cambia espacios por guiones bajos, elimina caracteres no válidos y genera nombres de archivos de música a partir de sus etiquetas.\n\n## Funciones principales\n\n- Añadir fechas\n- Añadir numeración consecutiva\n- Sustituir espacios por guiones bajos\n- Eliminar caracteres no válidos\n- Organizar fotos por fecha de captura\n- Crear nombres con artista, número de pista y título\n- Revisar una vista previa antes de aplicar\n\nAligna no es un explorador de archivos ni un servicio en la nube. No requiere cuenta, no tiene anuncios y procesa todo en el dispositivo. En iOS, las restricciones del sistema pueden hacer que se guarde una copia con el nuevo nombre en vez de renombrar directamente el original.",
      "faqTitle": "Preguntas frecuentes",
      "faq": [
        {
          "question": "¿Qué reglas puedo usar para los nombres?",
          "answer": "Añade fechas o números, ajusta espacios y caracteres no válidos o usa la fecha de las fotos y los datos de artista, número de pista y título de la música."
        },
        {
          "question": "¿Se cambia directamente el nombre del archivo original?",
          "answer": "En Android se pueden renombrar los archivos seleccionados. En iOS se guarda una nueva copia con el nombre nuevo debido a las restricciones del sistema."
        },
        {
          "question": "¿Puedo revisar los nombres antes de aplicarlos?",
          "answer": "Sí. La vista previa muestra el resultado antes de modificar nada."
        },
        {
          "question": "¿Se envían archivos a un servidor?",
          "answer": "No. El procesamiento es local."
        }
      ],
      "seoDescription": "Renombra archivos por lotes con Aligna. Añade fechas y números, usa datos de fotos y música y revisa los nuevos nombres antes de aplicar los cambios."
    },
    clipnest: {
      "subtitle": "Teclado con portapapeles",
      "body": "ClipNest es una herramienta local de portapapeles para iPhone y iPad.\n\nAl abrir el teclado de ClipNest se revisa una vez el contenido actual del portapapeles y se guarda el texto nuevo en el dispositivo. Así puedes reutilizar mensajes, direcciones, correos, enlaces y frases frecuentes sin volver a buscarlos.\n\n## Funciones principales\n\n- Guardar texto copiado al abrir el teclado\n- Pegar directamente desde el teclado\n- Fijar elementos frecuentes\n- Reutilizar el historial reciente\n- Gestionar duplicados\n- Almacenamiento local\n\nClipNest no vigila el portapapeles continuamente. Los textos guardados no se envían a servidores externos. No hay cuenta, anuncios ni suscripción.",
      "faqTitle": "Preguntas frecuentes",
      "faq": [
        {
          "question": "¿Puedo pegar textos guardados directamente desde el teclado?",
          "answer": "Sí. Abre el teclado de ClipNest y elige un texto guardado para pegarlo en la app en la que estás escribiendo."
        },
        {
          "question": "¿ClipNest vigila el portapapeles todo el tiempo?",
          "answer": "No. Comprueba el contenido actual una sola vez al abrir el teclado."
        },
        {
          "question": "¿Los textos guardados se envían a un servidor?",
          "answer": "No. Permanecen en el dispositivo."
        },
        {
          "question": "¿Puedo fijar textos de uso frecuente?",
          "answer": "Sí. Puedes fijarlos para acceder rápidamente desde el teclado."
        }
      ],
      "seoDescription": "ClipNest guarda el texto copiado al abrir su teclado. Fija frases y pégalas en otras apps. Los textos se guardan en tu iPhone o iPad, sin subirlos a servidores.",
      "seoTitle": "ClipNest - Teclado con portapapeles"
    },
    meriq: {
      "subtitle": "Crea pegatinas y llaveros acrílicos",
      "body": "Meriq te ayuda a preparar archivos para imprimir pegatinas, llaveros acrílicos y tarjetas fotográficas. Elige las medidas recomendadas para el producto o introduce el tamaño final que necesitas y coloca tu diseño en la cara delantera o trasera, todo en un solo proyecto.\n\nEn los proyectos de llaveros de acrílico transparente y pegatinas troqueladas, Meriq genera en tu dispositivo una propuesta para quitar el fondo de las imágenes opacas que cumplan los criterios. Revisa el resultado, aplícalo, ajusta la selección o conserva la imagen original.\n\n## Funciones principales\n\n- Elegir medidas recomendadas por producto o definir un tamaño final personalizado\n- Colocar imágenes y editar las capas de producción de ambas caras\n- Revisar el resultado de quitar el fondo antes de aplicarlo o ajustar la selección\n- Preparar líneas de corte vectoriales y una capa de tinta blanca bajo el diseño\n- Preparar y editar las capas de acabado compatibles\n- Comprobar las dimensiones reales y la resolución de la imagen con una revisión básica de producción\n- Exportar PNG transparente y PDF con el contenido de producción combinado\n- Transferir proyectos editables en paquetes ZIP estándar\n\nEl PDF combina el contenido de producción y no conserva capas de producción editables por separado. Antes de enviarlo a imprimir, confirma los formatos de archivo y las medidas que exige tu imprenta.\n\nLos proyectos y las imágenes importadas se guardan en el dispositivo. Las vistas previas y las exportaciones también se procesan localmente. No necesitas una cuenta ni iniciar sesión, y no hay anuncios ni sincronización en la nube. Tú eliges qué archivos importar. La exportación, el uso compartido y la transferencia de proyectos solo empiezan cuando eliges esas acciones. El contenido de imágenes y proyectos no se escribe en los registros de diagnóstico.\n\nPreparar y editar las capas de acabado requiere Meriq Pro.",
      "faqTitle": "Preguntas frecuentes",
      "faq": [
        {
          "question": "¿Qué formatos de archivo puedo exportar?",
          "answer": "Puedes exportar PNG transparente y PDF con el contenido de producción combinado. Las capas de producción del PDF no se pueden editar por separado. Para transferir un proyecto editable, utiliza un paquete ZIP estándar."
        },
        {
          "question": "¿Meriq sube mis proyectos o imágenes a un servidor?",
          "answer": "No. Los proyectos y las imágenes importadas se quedan en tu dispositivo. Las vistas previas y las exportaciones se procesan localmente. Tus diseños no se suben a los servidores de ONNELLAB. App Store o Google Play procesa las compras y sus restauraciones sin subir el contenido del proyecto."
        },
        {
          "question": "¿La exportación o el uso compartido se inicia automáticamente?",
          "answer": "No. La exportación, el uso compartido y la transferencia de paquetes ZIP de proyecto solo empiezan cuando tú lo decides."
        },
        {
          "question": "¿Las funciones de acabado requieren Pro?",
          "answer": "Sí. Preparar y editar las capas de acabado compatibles requiere Meriq Pro."
        }
      ],
      "seoDescription": "Prepara archivos de pegatinas, llaveros acrílicos y tarjetas fotográficas con Meriq. Ajusta corte, tinta blanca y tamaño y exporta en PNG o PDF."
    },
    quivra: {
      "subtitle": "Conversor multimedia",
      "body": "Quivra es un conversor multimedia de pago único para WAV, M4A, MP4 y MOV. No tiene anuncios ni suscripción.\n\nAl elegir un archivo, el formato de entrada determina automáticamente la conversión. No necesitas configurar el formato de salida.\n\n## Funciones principales\n\n- WAV a MP3\n- M4A a MP3\n- Extraer audio MP3 de MP4\n- MOV a vídeo MP4\n- Elegir la conversión automáticamente según el formato de entrada\n- Recordar el destino y resolver automáticamente los nombres repetidos\n\nSe recuerda la ubicación de salida y los conflictos de nombre se gestionan automáticamente. El original no se modifica; se crea un archivo nuevo.",
      "faqTitle": "Preguntas frecuentes",
      "faq": [
        {
          "question": "¿Qué conversiones admite?",
          "answer": "WAV/M4A a MP3, extracción de audio MP4 a MP3 y MOV a vídeo MP4."
        },
        {
          "question": "¿Tengo que elegir el formato de salida?",
          "answer": "No. Se determina según el formato de entrada."
        },
        {
          "question": "¿Se modifica el original?",
          "answer": "No."
        },
        {
          "question": "¿Tengo que elegir el destino en cada conversión?",
          "answer": "No. Quivra recuerda la ubicación elegida y resuelve automáticamente los nombres de archivo repetidos."
        }
      ],
      "seoDescription": "Convierte WAV y M4A a MP3, extrae MP3 de MP4 o pasa de MOV a MP4 con Quivra. La conversión se elige automáticamente y el archivo original se conserva."
    },
    segra: {
      "subtitle": "Cortar y unir audio",
      "body": "Segra simplifica tareas comunes de audio: recortar una parte de MP3/WAV, unir varias grabaciones o crear un vídeo MP4 con audio e imagen.\n\nNo pretende ser una suite de producción musical. Se centra en recortar grabaciones largas, unir archivos en el orden elegido y preparar vídeos sencillos para narración, podcasts, audiolibros o TTS.\n\n## Funciones principales\n\n- Elegir inicio y final del recorte\n- Unir varios archivos de audio\n- Crear MP4 con audio e imagen\n- Conservar originales\n- Procesar todo localmente y sin conexión\n\nNo hay inicio de sesión, subida de archivos, anuncios ni seguimiento.",
      "faqTitle": "Preguntas frecuentes",
      "faq": [
        {
          "question": "¿Qué tareas admite?",
          "answer": "Recorte de MP3/WAV, unión de archivos y creación de MP4 con audio e imagen."
        },
        {
          "question": "¿Se modifica el audio original?",
          "answer": "No. Los recortes y uniones se guardan como archivos nuevos."
        },
        {
          "question": "¿Puedo convertir una grabación en un vídeo MP4?",
          "answer": "Sí. Combina un archivo de audio con una imagen para crear un vídeo MP4 sencillo, por ejemplo para narraciones, podcasts o voces TTS."
        },
        {
          "question": "¿Se envían los archivos a un servidor?",
          "answer": "No."
        }
      ],
      "seoDescription": "Recorta MP3 y WAV, une grabaciones o crea vídeos MP4 con audio e imagen en Segra. Todo se procesa sin conexión y los archivos originales se conservan."
    },
    tagweaver: {
      "subtitle": "Editor sin conexión de etiquetas MP3/FLAC",
      "body": "TagWeaver permite revisar y editar sin conexión metadatos, puntuaciones, carátulas y letras en archivos MP3 y FLAC.\n\nEdita título, artista, álbum, artista del álbum, números de pista y disco, año, género, compositor y puntuación. Las carátulas y letras se gestionan en el mismo flujo.\n\n## Funciones principales\n\n- Editar etiquetas como título, artista y álbum\n- Editar las puntuaciones de las pistas\n- Gestionar las carátulas de los álbumes\n- Añadir y editar letras\n- Leer y guardar etiquetas ID3 en MP3 y Vorbis Comment en FLAC\n- Seleccionar y editar varios archivos juntos\n- Revisar los cambios antes de guardarlos\n\nLa edición se realiza en tu dispositivo, sin inicio de sesión, subida de archivos, anuncios ni seguimiento.\n\nEl guardado por lotes de varios archivos está disponible con Pro.",
      "faqTitle": "Preguntas frecuentes",
      "faq": [
        {
          "question": "¿Puedo editar MP3 y FLAC?",
          "answer": "Sí. Se admiten ID3 de MP3 y Vorbis Comment de FLAC."
        },
        {
          "question": "¿También puedo editar carátulas y letras?",
          "answer": "Sí. Además de las etiquetas y puntuaciones, puedes gestionar las carátulas y añadir o editar las letras."
        },
        {
          "question": "¿Se suben los archivos a un servidor?",
          "answer": "No. La edición es local."
        },
        {
          "question": "¿Puedo guardar varios archivos a la vez?",
          "answer": "Sí. Hay selección y edición por lotes; el guardado múltiple forma parte de Pro."
        }
      ],
      "seoDescription": "Edita etiquetas, puntuaciones, carátulas y letras de MP3 y FLAC con TagWeaver. Revisa los cambios antes de guardarlos, sin subir tus archivos a servidores."
    },
    vaultxt: make('Editor de archivos TXT grandes', `VaultXT es un editor de texto rápido y ligero diseñado para archivos grandes.\n\nAbre y edita documentos largos, registros, borradores y datos exportados sin enviarlos a servicios en la nube.\n\n## Funciones principales\n\n- Abrir rápidamente TXT grandes\n- Leer y editar documentos largos\n- Guardado automático\n- Recuperación con deshacer y snapshots\n- Trabajo local y sin conexión\n\nNo hay cuenta, anuncios ni seguimiento; el contenido no se envía a servidores externos.`, 'Preguntas frecuentes', [{ question: '¿Puedo abrir archivos TXT muy grandes?', answer: 'Sí. VaultXT está diseñado para TXT grandes, documentos largos, logs, borradores y datos exportados.' }, { question: '¿Cómo puedo recuperar cambios?', answer: 'Guardado automático, deshacer y snapshots ofrecen opciones de recuperación.' }, { question: '¿Se envía el contenido a un servidor?', answer: 'No.' }]),
    papira: make('Creador de EPUB sin conexión a partir de TXT', getPapiraDescription('es'), 'Preguntas frecuentes', [
      {
        "question": "¿Qué tipos de obras puedo preparar?",
        "answer": "Cualquier contenido TXT terminado puede convertirse en EPUB. Los ajustes específicos solo agilizan flujos creativos habituales."
      },
      {
        "question": "¿Puedo editar el manuscrito en Papira?",
        "answer": "Papira está pensado para montar un manuscrito terminado como EPUB. Edita primero el TXT original en tu herramienta de escritura habitual."
      },
      {
        "question": "¿La exportación sobrescribe archivos existentes?",
        "answer": "No. Si el nombre de salida ya está en uso, Papira añade un número automáticamente y guarda otro archivo."
      },
      {
        "question": "¿Los manuscritos se suben a un servidor?",
        "answer": "No. Los archivos TXT, portadas, proyectos, vistas previas y EPUB generados se procesan en el dispositivo."
      }
    ])
  }
};

export function getExtendedProductCopy(slug: string, locale: ExtendedSiteLocale): ExtendedProductCopy {
  const copy = extendedProductCopy[locale][slug];
  if (!copy) throw new Error(`Missing extended product localization: ${locale}/${slug}`);
  return copy;
}
