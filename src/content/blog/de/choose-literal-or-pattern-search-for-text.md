---
title: "Wann ist die wörtliche Suche besser als die Mustersuche?"
card_title: "Wann ist die wörtliche Suche besser als die Mustersuche?"
slug: "choose-literal-or-pattern-search-for-text"
category: "reading"
language: "de"
description: "Nutzen Sie die wörtliche Suche, wenn die genaue Schreibweise bekannt ist. Möchten Sie dagegen mehrere Varianten mit derselben Struktur finden, wechseln Sie nur in einem Programm mit Unterstützung für reguläre Ausdrücke zur Mustersuche."
status: "published"
topic_id: "TOPIC-0147"
search_intent: "workflow"
primary_keyword: "wörtliche Suche"
secondary_keywords: "Mustersuche|reguläre Ausdrücke|Teiltreffer"
related_apps: ""
canonical_url: "https://onnellab.com/blog/de/choose-literal-or-pattern-search-for-text/"
published_at: "2026-11-23T09:00:00+09:00"
updated_at: "2026-11-23T09:00:00+09:00"
tags: "wörtliche Suche|Mustersuche|reguläre Ausdrücke|Teiltreffer"
short_answer: "Nutzen Sie die wörtliche Suche, wenn die genaue Schreibweise bekannt ist. Möchten Sie dagegen mehrere Varianten mit derselben Struktur finden, wechseln Sie nur in einem Programm mit Unterstützung für reguläre Ausdrücke zur Mustersuche."
related_articles: "Lange Textdokumente leichter navigieren => https://onnellab.com/blog/de/make-long-plain-text-easier-to-navigate/|Inhaltsverzeichnis und Kapitelreihenfolge einer EPUB prüfen => https://onnellab.com/blog/de/check-epub-table-of-contents-and-reading-order/|Musikdateien auf Android für die Offline-Wiedergabe ordnen => https://onnellab.com/blog/de/organize-local-music-library-offline-android/|Quellennotizen und eigene Schlussfolgerungen klar trennen => https://onnellab.com/blog/de/separate-source-notes-from-conclusions/|Konvertierte Mediendateien prüfen, bevor Sie das Original ersetzen => https://onnellab.com/blog/de/test-converted-media-before-replacing-original/|Wiederkehrende Texte in wiederverwendbare Textbausteine umwandeln => https://onnellab.com/blog/de/turn-repeated-text-into-reusable-snippets/"
---

# Wann ist die wörtliche Suche besser als die Mustersuche?

## Frage

Wann ist die wörtliche Suche besser als die Mustersuche?

## Kurzantwort

Nutzen Sie die wörtliche Suche, wenn die genaue Schreibweise bekannt ist. Möchten Sie dagegen mehrere Varianten mit derselben Struktur finden, wechseln Sie nur in einem Programm mit Unterstützung für reguläre Ausdrücke zur Mustersuche.

Ein regulärer Ausdruck ist eine Regel dafür, welche Zeichenfolgen bei der Suche gefunden werden. Eckige Klammern sind in einer Zeichenklasse keine wörtlichen Zeichen, sondern fassen mögliche Zeichen an einer Stelle zusammen. Suchen Sie `[draft]` mitsamt den Klammern, eignet sich die wörtliche Suche.

## Empfohlener Arbeitsablauf

1. In einer kleinen Testdatei notieren Sie `[draft]`, `draft`, `Ref-03`, `Ref-42` und `Ref-AA` untereinander. In die sechste Zeile schreiben Sie `Ref-031`, um einen unerwünschten Teiltreffer zu erkennen.
2. Suchen Sie im wörtlichen Modus nach `[draft]`. Das Wort ohne Klammern sollte kein Treffer sein. Prüfen Sie bei einem anderen Ergebnis, ob die Mustersuche noch aktiv ist oder die Suche auf eine andere Datei oder Auswahl beschränkt wurde.
3. Probieren Sie bei eingeschalteter Unterstützung für reguläre Ausdrücke `Ref-[0-9][0-9]` aus. Das Muster findet `Ref-03` und `Ref-42`, nicht aber `Ref-AA`. Sehen Sie bei `Ref-031` nach, wo die Markierung endet. Ein Treffer am Anfang belegt nicht, dass die ganze Nummer zweistellig ist.
4. Legen Sie vor der Suche im Original fest, welche Treffer relevant sind. Zum Prüfen brauchen Sie die Funktion „Ersetzen“ nicht. Auch vertrauliche Textstellen müssen Sie für die Probe nicht in ein Online-Werkzeug kopieren.

![Text bekannt: Wörtlich suchen; Gleiche Form: Mustersuche, falls verfügbar; Suche testen: Auch einen Nichttreffer testen; Treffer prüfen: Den ganzen Treffer prüfen.](/blog-assets/de/choose-literal-or-pattern-search-for-text/workflow-diagram.svg)

| Ziel|Passende Suche |
| --- | --- |
| Bekannte Schreibweise mitsamt Satzzeichen finden|Wörtliche Suche |
| Mehrere Nummern mit demselben Aufbau finden|Mustersuche, falls unterstützt |
| Unerwartete Treffer untersuchen|Markierung und umgebenden Text prüfen |

## Häufige Fragen

### Was tun ohne Unterstützung für reguläre Ausdrücke?

Suchen Sie bekannte Schreibweisen einzeln. Bei zu vielen Treffern helfen je nach Programm die Einstellungen für Groß- und Kleinschreibung oder ganze Wörter. Diese Optionen schalten die Mustersuche nicht ein.

### Heißt kein Treffer, dass der Text fehlt?

Nicht unbedingt. Testen Sie zuerst eine kurze, sicher vorhandene Zeichenfolge. Prüfen Sie den Suchbereich und die Einstellung für Groß- und Kleinschreibung.

## Quellen

- [MDN: Zeichenklassen in regulären Ausdrücken](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_class)

## Fazit

Beginnen Sie wörtlich und wechseln Sie bei Bedarf zur Mustersuche. Ein erfolgreicher Test enthält einen erwarteten Treffer und einen erwarteten Nichttreffer.
