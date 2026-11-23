---
title: "Dans un texte, faut-il choisir la recherche littérale ou la recherche par motif ?"
card_title: "Dans un texte, faut-il choisir la recherche littérale ou la recherche par motif ?"
slug: "choose-literal-or-pattern-search-for-text"
category: "reading"
language: "fr"
description: "Utilisez la recherche littérale quand vous connaissez le texte exact, ponctuation comprise. Passez à la recherche par motif quand vous devez repérer plusieurs variantes de même forme et que l’outil prend en charge les expressions régulières."
status: "published"
topic_id: "TOPIC-0148"
search_intent: "workflow"
primary_keyword: "recherche littérale"
secondary_keywords: "recherche par motif|expressions régulières|surlignage"
related_apps: ""
canonical_url: "https://onnellab.com/blog/fr/choose-literal-or-pattern-search-for-text/"
published_at: "2026-11-23T09:00:00+09:00"
updated_at: "2026-11-23T09:00:00+09:00"
tags: "recherche littérale|recherche par motif|expressions régulières|surlignage"
short_answer: "Utilisez la recherche littérale quand vous connaissez le texte exact, ponctuation comprise. Passez à la recherche par motif quand vous devez repérer plusieurs variantes de même forme et que l’outil prend en charge les expressions régulières."
related_articles: "Se repérer plus facilement dans un long document texte => https://onnellab.com/blog/fr/make-long-plain-text-easier-to-navigate/|Vérifier la table des matières et l’ordre des chapitres d’un EPUB => https://onnellab.com/blog/fr/check-epub-table-of-contents-and-reading-order/|Transformer les textes répétitifs en extraits réutilisables => https://onnellab.com/blog/fr/turn-repeated-text-into-reusable-snippets/|Préparer une copie de travail avant de modifier un fichier audio => https://onnellab.com/blog/fr/choose-safe-audio-working-copy/|Indiquer clairement les incertitudes dans ses notes de recherche => https://onnellab.com/blog/fr/mark-uncertainty-clearly-in-research-notes/|Distinguer les fichiers musicaux en double des enregistrements différents => https://onnellab.com/blog/fr/distinguish-duplicate-music-files-from-different-recordings/"
---

# Dans un texte, faut-il choisir la recherche littérale ou la recherche par motif ?

## Question

Dans un texte, faut-il choisir la recherche littérale ou la recherche par motif ?

## Réponse courte

Utilisez la recherche littérale quand vous connaissez le texte exact, ponctuation comprise. Passez à la recherche par motif quand vous devez repérer plusieurs variantes de même forme et que l’outil prend en charge les expressions régulières.

Une expression régulière est une règle qui décrit les chaînes que la recherche doit trouver. Dans une classe de caractères, les crochets délimitent les caractères possibles à un emplacement donné. Si vous cherchez `[draft]` avec ses crochets, commencez plutôt par la recherche littérale.

## Méthode recommandée

1. Dans un document d’essai, placez `[draft]`, `draft`, `Ref-03`, `Ref-42` et `Ref-AA` sur cinq lignes distinctes. Ajoutez `Ref-031` sur une sixième ligne pour repérer un éventuel résultat partiel.
2. Cherchez `[draft]` en mode littéral. Le mot sans crochets ne doit pas remonter dans les résultats. Si le surlignage diffère de vos attentes, vérifiez que l’option d’expression régulière est désactivée et que la recherche porte sur le fichier ou la sélection voulus.
3. Si l’outil le permet, activez les expressions régulières et essayez `Ref-[0-9][0-9]`. Le motif retrouve `Ref-03` et `Ref-42`, mais pas `Ref-AA`. Dans `Ref-031`, regardez où le surlignage s’arrête. Trouver le début ne prouve pas que le numéro entier a deux chiffres.
4. Décidez quels résultats sont pertinents avant d’ouvrir le document réel. Il n’est pas nécessaire de remplacer du texte pour vérifier une recherche. Évitez aussi de coller du texte privé dans un outil en ligne : l’exemple fictif suffit.

![Texte connu: Mode littéral; Forme commune: Motif, si pris en charge; Tester la requête: Prévoir un cas à écarter; Voir la zone: Vérifier le résultat entier.](/blog-assets/fr/choose-literal-or-pattern-search-for-text/workflow-diagram.svg)

| Objectif|Mode adapté |
| --- | --- |
| Trouver un texte précis avec sa ponctuation|Recherche littérale |
| Repérer des codes de même structure|Motif, si l’outil le permet |
| Examiner un résultat inattendu|Contrôler le surlignage et le contexte |

## Questions fréquentes

### Mon lecteur n’a pas d’option d’expression régulière. Que faire ?

Cherchez séparément les variantes connues. Au besoin, réglez la sensibilité à la casse ou recherchez des mots entiers, si ces options existent. Elles ne transforment pas la recherche littérale en recherche par motif.

### Aucun résultat : le texte est-il absent ?

Pas forcément. Testez une courte séquence dont vous êtes sûr, puis vérifiez la zone de recherche et le réglage de la casse.

## Références

- [MDN : classes de caractères des expressions régulières](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_class)

## Conclusion

Commencez en mode littéral et changez de mode uniquement si le besoin le justifie. Testez un exemple qui doit correspondre et un autre qui doit être écarté.
