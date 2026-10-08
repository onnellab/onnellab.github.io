---
title: "Ein dauerhaft nutzbares Leseprotokoll für die Forschung führen"
card_title: "Ein dauerhaft nutzbares Leseprotokoll für die Forschung führen"
slug: "keep-durable-research-reading-log"
category: "research"
language: "de"
description: "So bleibt ein Forschungsleseprotokoll nutzbar: Quellen und Versionen eindeutig erfassen, Belege mit Aussagen verknüpfen, Kontext sichern und die Übergabe vorbereiten."
status: "draft"
topic_id: "TOPIC-0016"
search_intent: "workflow"
primary_keyword: "Leseprotokoll für die Forschung"
secondary_keywords: "Quellennotizen|Zitate nachverfolgen|Forschungsergebnisse zusammenführen|dauerhafte Notizen"
related_apps: ""
tags: "Forschungsleseprotokoll|Quellennotizen|Belegkette|Forschungssynthese|dauerhafte Notizen"
short_answer: "Erfassen Sie für jede Quelle Kennung, Version, Fundstelle und Zugriffsdatum. Trennen Sie Zitate von Paraphrasen und verknüpfen Sie Notizen mit Aussagen. Prüfen und überarbeiten Sie die Einträge, exportieren Sie die Einträge in offenen Formaten und bewahren Sie unabhängige Sicherungen auf."
canonical_url: "https://onnellab.com/blog/de/keep-durable-research-reading-log/"
published_at: "2026-08-26T09:00:00+09:00"
updated_at: "2026-08-26T09:00:00+09:00"
image_specs: "Arbeitsablauf vom Erfassen bis zur Durchsicht des Forschungsleseprotokolls|Minimalschema für dauerhaft nutzbare Einträge|Übergabepaket zum Projektabschluss"
related_articles: "TXT oder EPUB für langes Lesen? => https://onnellab.com/blog/de/txt-vs-epub-for-long-reading/|Audioaufnahmen ohne vollständigen Editor zuschneiden => https://onnellab.com/blog/de/trim-audio-recordings-without-full-editor/|Große TXT-Dateien ohne Ruckeln lesen => https://onnellab.com/blog/de/read-large-txt-files-without-lag/|Warum das Öffnen großer Textdateien lange dauert => https://onnellab.com/blog/de/large-text-file-slow-to-open/|Lokale Mediendateien privat konvertieren => https://onnellab.com/blog/de/convert-local-media-files-privately/|MP3-Metadaten vor dem Sortieren der Musiksammlung bereinigen => https://onnellab.com/blog/de/clean-up-mp3-metadata-before-organizing-music/"
---

# Ein dauerhaft nutzbares Leseprotokoll für die Forschung führen

Ein dauerhaft nutzbares Forschungsleseprotokoll macht Quellen identifizierbar, Belege auffindbar und Ihre Interpretation samt Aussageverknüpfung verständlich. PDFs und unstrukturierte Markierungen verlieren bei veränderten Links oder Zusammenhängen leicht ihren Sinn.

## Frage

Wie führe ich ein Leseprotokoll für die Forschung, das auch nach Projektende noch nützlich ist?

## Kurzantwort

Geben Sie jeder Quelle eine stabile Kennung und erfassen Sie Fundstelle und Zugriffsdatum. Unterscheiden Sie wörtliche Zitate von Paraphrasen und verknüpfen Sie Notizen mit konkreten Aussagen. Bewahren Sie genügend Kontext, um Fehlinterpretationen zu vermeiden. Führen Sie die Einträge durch Erfassung, Prüfung, Zusammenfassung, Synthese und Durchsicht. Erstellen Sie anschließend Exporte in offenen Formaten, unabhängige Sicherungen und eine Übergabenotiz.

Bewahren Sie statt einzelner Markierungen eine nachvollziehbare Beziehung:

**Quelle → Textstelle oder Ergebnis → Interpretation → Projektaussage → Prüfstatus**

## Warum Leseprotokolle ihren Nutzen verlieren

Lückenhafte Protokolle erhalten Inhalte, aber nicht deren Herkunft: Bei einem Zitat fehlt die Seitenzahl, eine URL führt nur auf die Startseite des Verlags, eine Paraphrase wirkt wie der Originalwortlaut oder allgemeine Schlagwörter ersetzen die Verknüpfung mit einer Aussage. Auch eine DOI bewahrt keinen konkreten Kontext und garantiert keinen Volltextzugriff.

**Dauerhafte Identifizierbarkeit** macht Quellen trotz Ortswechsel eindeutig erkennbar. **Dauerhafte Nachvollziehbarkeit der Interpretation** bewahrt Beobachtung, Wiedergabe und Bedeutung. Eine stabile Kennung unterstützt das Erste; das Leseprotokoll leistet das Zweite.

## Das Minimalschema für dauerhaft nutzbare Einträge

Erstellen Sie pro Quellenversion einen Eintrag. Bei wesentlichen Änderungen legen Sie einen neuen Eintrag an und verknüpfen die Versionen, statt frühere Notizen zu überschreiben.

| Feld | Zu erfassende Angaben | Zweck |
| --- | --- | --- |
| `record_id` | Unveränderliche ID wie `RL-2026-0042` | Hält interne Verknüpfungen stabil |
| `source_identity` | Autor, Titel, übergeordnete Publikation, Datum und Version | Identifiziert die tatsächlich konsultierte Arbeit |
| `stable_identifier` | Vollständige URL `https://doi.org/...` oder eine andere registrierte Kennung | Trennt Identität und Speicherort |
| `locator` | Zugriffs-URL sowie Seite, Abschnitt, Abbildung, Zeitmarke oder Datensatzzeile | Macht den Beleg innerhalb der Quelle auffindbar |
| `accessed_at` | Vollständiges Datum im Format `YYYY-MM-DD` | Dokumentiert, wann eine veränderliche Webressource eingesehen wurde |
| `note_type` | `quote`, `paraphrase`, `summary` oder `observation` | Trennt eigene Formulierungen vom Wortlaut der Quelle |
| `evidence` | Kurzes Zitat, Paraphrase, Ergebnis oder Beobachtung | Bewahrt den relevanten Beleg |
| `context` | Untersuchte Population, Methode, Bedingungen und Ausnahmen | Verringert Fehler beim Übertragen auf andere Geltungsbereiche |
| `claim_link` | Zugehörige Aussage, Frage oder Aussage-ID | Macht die Belegkette überprüfbar |
| `relevance` | Warum der Beleg wichtig ist | Bewahrt die Überlegungen im Projekt |
| `status` | `captured`, `verified`, `summarized`, `synthesized`, `reviewed` oder `needs_review` | Zeigt, was geprüft wurde und was noch offen ist |
| `tags` | Kontrollierte Begriffe zu Thema, Methode, Population oder Projekt | Erleichtert das Wiederfinden |

Optionale Felder können Rechte, Sprache, Prüfsummen, Archivkopien, Widersprüche und verwandte Einträge abdecken. Ein kleines, vollständig ausgefülltes Schema ist besser als ein großes, meist leeres.

## Zitat, Paraphrase, Zusammenfassung und Beobachtung

Kennzeichnen Sie die Art der Wiedergabe bereits beim Erfassen ausdrücklich.

- Ein **Zitat** gibt den genauen Wortlaut wieder und braucht Anführungszeichen sowie eine präzise Fundstelle.
- Eine **Paraphrase** formuliert eine Passage um, benötigt aber weiterhin Quellenangabe und Fundstelle.
- Eine **Zusammenfassung** verdichtet einen größeren Bereich; halten Sie dessen Umfang fest.
- Eine **Beobachtung** ist Ihre eigene Analyse. Kennzeichnen Sie sie entsprechend und bewahren Sie die Fundstelle der zugrunde liegenden Daten.

Markieren Sie jede Auslassung oder Änderung in einem Zitat. Verwenden Sie nach Möglichkeit die aufgedruckten Seitenzahlen von PDFs, stabile HTML-Überschriften, Zeitintervalle bei Medien sowie bei Datensätzen die Version, Tabelle, Variablen und betreffenden Zeilen oder die Abfrage.

## Aussagen mit Belegen verknüpfen, nicht nur mit Quellen

Ein Literaturverzeichnis zeigt, was gelesen wurde; eine Aussage-Beleg-Verknüpfung zeigt, welchen Beitrag die Lektüre leistet. Geben Sie wichtigen Aussagen stabile interne IDs. Halten Sie für jeden Eintrag fest, ob der Beleg die verknüpfte Aussage **stützt** oder **einschränkt**, ihr **widerspricht** oder lediglich **Kontext dafür liefert**. So wirken mehrere Quellenangaben nicht als Belege, wenn nur eine die Aussage stützt.

Notieren Sie Einschränkungen direkt beim Beleg. Stichprobe, geografischer Raum, Zeitraum, Methode, Unsicherheit, Vergleichsgruppe und Vorbehalte der Autoren beeinflussen, ob sich ein Ergebnis übertragen lässt. „Derselbe Ergebnisparameter bei Erwachsenen, aber nur sieben Tage Nachbeobachtung“ ist hilfreicher als „wichtige Studie“.

## Empfohlener Arbeitsablauf

1. **Erfassen.** Halten Sie bei geöffneter Quelle die bibliografischen Angaben, Kennung, genaue Zugriffs-URL, Zugriffsdatum, Fundstelle, Notizart, den mindestens erforderlichen Beleg und eine interne ID fest.
2. **Prüfen.** Rufen Sie die Quelle über ihre Kennung auf und vergleichen Sie Autor, Titel, Datum, Version und übergeordnete Publikation mit einem offiziellen Datensatz. Öffnen Sie anschließend die Fundstelle erneut und prüfen Sie die Zitate. Eine erfolgreiche Auflösung der Kennung beweist allein noch nicht, dass die Version stimmt.
3. **Zusammenfassen.** Beschreiben Sie Fragestellung, Methode, Ergebnis und Einschränkungen in eigenen Worten, getrennt von Zitaten.
4. **Synthetisieren.** Verknüpfen Sie Einträge mit Aussagen und erläutern Sie, ob die Quellen übereinstimmen, voneinander abweichen oder sich widersprechen.
5. **Durchsehen.** Prüfen Sie vor Veröffentlichung oder Übergabe erneut Kennungen, Zitatgrenzen, Fundstellen, Rechte, personenbezogene Daten und Statusangaben. Verwenden Sie `reviewed` beziehungsweise `needs_review` entsprechend dem tatsächlichen Prüfstand.

![Vier Prüfpunkte für ein dauerhaft nutzbares Forschungsleseprotokoll](/blog-assets/de/keep-durable-research-reading-log/workflow-diagram.svg "Quelle identifizieren, Fundstelle festhalten, Zitat und Interpretation trennen und erneut prüfen")

Wiederholen Sie Erfassung oder Prüfung, wenn die Synthese eine Lücke aufzeigt oder eine neue Version erscheint. Der Status beschreibt den Bearbeitungsstand, nicht das Ansehen einer Quelle.

## Stabile Kennungen und die Grenzen von Links

Bevorzugen Sie eine DOI, sofern vorhanden, und zeigen Sie sie als vollständige URL an, etwa `https://doi.org/10.xxxx/xxxxx`. Bewahren Sie die genaue Zugriffs-URL separat auf, denn sie identifiziert die konsultierte Kopie, das Repositorium oder die Übersichtsseite.

Die Beständigkeit einer Kennung hängt von gepflegten Registrierungsdaten ab. Sie garantiert weder Zugriff noch unveränderte Zusatzdateien oder die Verfügbarkeit der zitierten Seite. Gibt es keine registrierte Kennung, erfassen Sie die vollständigen bibliografischen Angaben, Version, URL und Zugriffsdatum sowie gegebenenfalls eine zulässige Archivkopie.

Identifizieren und verknüpfen Sie Versionen; halten Sie die tatsächlich gelesene fest. Ersetzen Sie niemals eine Preprint-Notiz durch den endgültigen Artikel in der Annahme, Zitate, Seitenzahlen und Ergebnisse seien identisch.

## Grenzen durch Urheberrecht und Datenschutz

Ein Leseprotokoll berechtigt nicht dazu, eine Quelle zu vervielfältigen. Speichern Sie nur den kleinsten erforderlichen Auszug, bewahren Sie Quellenangabe und Fundstelle und verlinken Sie auf eine autorisierte Kopie, statt den Volltext weiterzuverbreiten. Urheberrechtliche Ausnahmen unterscheiden sich; das U.S. Copyright Office nennt keine feste Wortzahl oder Prozentgrenze, die stets unbedenklich wäre. Prüfen Sie vor dem Teilen die Lizenz, geltende Richtlinien und das anwendbare Recht.

Notizen können personenbezogene Daten enthalten. Begrenzen Sie die Erhebung auf das Nötige, trennen Sie Material mit Zugriffsbeschränkungen ab, verwenden Sie gegebenenfalls pseudonyme IDs und entfernen Sie geheime Informationen aus Exporten. Bewahren Sie nur Daten auf, die für den angegebenen Zweck angemessen, relevant und erforderlich sind.

## Export, Sicherung und Wiederherstellung

Exportieren Sie die Daten in dokumentierten Formaten, in festgelegten Abständen und an wichtigen Projektmeilensteinen.

| Format | Geeigneter Einsatz | Hinweis zur Erhaltung |
| --- | --- | --- |
| UTF-8-Text oder Markdown | Menschenlesbare Einträge | Links und Feldbezeichnungen ausdrücklich angeben |
| CSV | Austausch flacher Tabellen | Zeichenkodierung, Trennzeichen und Escape-Regeln dokumentieren |
| JSON | Strukturierte Felder und Arrays | Validieren und ein Datenwörterbuch aufbewahren |
| PDF/A oder durchsuchbares PDF | Unveränderliche Momentaufnahme für die Durchsicht | Nicht als einzige bearbeitbare Quelle verwenden |

Ein Export wird erst dann zur Sicherung, wenn eine Kopie unabhängig vom Arbeitssystem vorliegt. Bewahren Sie getrennte Kopien auf, nehmen Sie nur zulässige Anhänge auf und stellen Sie regelmäßig eine Stichprobe wieder her. Prüfen Sie Kennungen, Unicode-Zeichen, Zeilenumbrüche und Beziehungen. Eine Prüfsumme erkennt Dateiänderungen, aber keine ungenauen Zitate oder fehlenden Einträge.

Nutzen Sie ID-basierte Dateinamen wie `RL-2026-0042.md`. Ein Manifest nennt Eintragszahl, Exportdatum, Schemaversion, Anhänge, Ausschlüsse und Prüfsummenverfahren. Offene, dokumentierte Formate verringern die Anbieterabhängigkeit, benötigen aber weiterhin Überprüfung und Migration.

## Übergabe zum Projektabschluss

Erstellen Sie zum Projektende ein Übergabepaket, das ohne die ursprüngliche Software nutzbar ist:

1. das exportierte Leseprotokoll in mindestens einem menschenlesbaren und einem strukturierten Format;
2. eine README-Datei mit Forschungsfrage, Geltungsbereich, Zeitraum, Schema, Bedeutung der Statuswerte, Schlagwortvokabular und Ordnerstruktur;
3. einen Aussagenindex, der jede wichtige Aussage mit stützenden, einschränkenden und widersprechenden Einträgen verknüpft;
4. ein Manifest mit Dateien, Versionen, Prüfsummen, Lizenzen und Zugriffsbeschränkungen;
5. eine Liste der Einträge mit `needs_review`, defekter oder zugangsbeschränkter Links, fehlender Quellen und ungeklärter Widersprüche;
6. Datum und Vorgehensweise der letzten Wiederherstellungsprüfung sowie zuständige Person und Termin für die nächste Durchsicht.

Halten Sie Unsicherheit sichtbar: Ein als ungeklärt markierter Eintrag ist sicherer als eine geschliffene Aussage mit unauffindbaren Belegen.

## Anwendung bei ONNELLAB

Für diesen produktneutralen Arbeitsablauf ist derzeit keine ONNELLAB-App erforderlich oder speziell dokumentiert. Verwenden Sie ein beliebiges Werkzeug, das das beschriebene Schema, stabile Verknüpfungen, offene Exporte und Zugriffskontrollen erhält. Die Methode sollte auch bei einem Werkzeugwechsel übertragbar bleiben.

## Quellen

- [DOI Foundation: DOI-Handbuch](https://www.doi.org/doi-handbook/html/) definiert DOI-Namen, Auflösung, Metadaten und Verantwortlichkeiten für die Beständigkeit der Kennungen.
- [Crossref: Darstellungsrichtlinien](https://www.crossref.org/display-guidelines/) empfiehlt, Crossref-DOIs als vollständige, auflösbare DOI-Links darzustellen.
- [Crossref: Metadaten abrufen](https://www.crossref.org/documentation/retrieve-metadata/) dokumentiert offizielle Methoden zur Prüfung der bei Crossref hinterlegten Metadaten.
- [DataCite: Versionen verknüpfen](https://support.datacite.org/docs/connecting-versions) erläutert, wie sich registrierte Ressourcenversionen und Formate miteinander verbinden lassen, ohne sie gleichzusetzen.
- [Library of Congress: Empfehlungen zu Dateiformaten](https://www.loc.gov/preservation/resources/rfs/) beschreibt Formateigenschaften, die langfristige Erhaltung und Zugänglichkeit unterstützen.
- [IETF RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) und [IETF RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) dokumentieren interoperable Darstellungen für CSV und JSON.
- [U.S. Copyright Office: Fair-Use-Index](https://www.copyright.gov/fair-use/) erläutert, dass Fair Use von den Umständen des Einzelfalls abhängt.
- [EUR-Lex: Verordnung (EU) 2016/679, Artikel 5](https://eur-lex.europa.eu/eli/reg/2016/679/oj) nennt unter anderem die Grundsätze Zweckbindung, Datenminimierung und Richtigkeit.

## Fazit

Ein dauerhaft nutzbares Leseprotokoll für die Forschung bewahrt mehr als Literaturangaben. Es identifiziert die genaue Quelle und Version, trennt den Quellenwortlaut von Ihrer Interpretation, hält Belege auffindbar, verbindet sie mit Aussagen, dokumentiert Einschränkungen und zeigt den Prüfstand. Offene Exporte, getestete Sicherungen und klare Übergabepakete erhalten diese Überlegungen über Projektende und Softwarewechsel hinaus.

## Häufige Fragen

### Reicht eine DOI aus, damit eine Lesenotiz dauerhaft nutzbar bleibt?

Nein. Eine DOI verbessert die Identifizierung und das Auffinden der Quelle. Die Notiz braucht dennoch Version, Fundstelle des Belegs, Zugriffsdatum, Kontext, Aussageverknüpfung und Prüfstatus. Eine DOI ersetzt auch keine rechtlich zulässige Sicherung und garantiert keinen Volltextzugriff.

### Sollte jede Markierung zu einem Protokolleintrag werden?

Nein. Erfassen Sie Belege, die für eine Forschungsfrage, eine Methodenentscheidung oder eine Aussage relevant sind. Ungefilterte Markierungen häufen unerledigte Prüfarbeit an und erschweren das Auffinden wichtiger Belege.

### Kann ich paraphrasieren, ohne Seite oder Abschnitt zu notieren?

Auch eine Paraphrase beruht auf einer Quelle. Erfassen Sie die präziseste verfügbare Fundstelle, damit eine prüfende Person Ihre Formulierung mit dem ursprünglichen Kontext vergleichen kann.

### Was soll ich tun, wenn ein Link nicht mehr funktioniert?

Rufen Sie die stabile Kennung auf, suchen Sie in den Registrierungsmetadaten oder im offiziellen Repositorium und erfassen Sie die Ersatzfundstelle, ohne den bisherigen Zugriffsverlauf zu löschen. Lässt sich die Quelle nicht wiederfinden, markieren Sie den Eintrag mit `needs_review` und verwenden Sie ihn nicht als Grundlage für eine entscheidende Aussage.

### Wie oft sollte ich das Protokoll durchsehen?

Prüfen Sie es vor der Synthese, vor einer Veröffentlichung mit weitreichenden Folgen und vor der Übergabe. Kontrollieren Sie veränderliche Webquellen und laufend aktualisierte Datensätze außerdem regelmäßig.
