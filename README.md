# Das NWBib-NRW Städte-Quiz: http://labs.lobid.org/nwbib-quiz/

Das Quiz ist ein Beitrag zum [cdvwest 2019](https://codingdavinci.de/projects/2019_west/nwbiQuiz.html#project-name).
Es ist ein Beitrag von mir als Teil des [lobid-Teams](https://lobid.org/team).

Inspiriert von https://de.m.wikipedia.org/wiki/Das_NRW-Duell.

Die Datensets werden komplett automatisch erzeugt auf Grundlage der https://wikidata.org und https://lobid.org/resources.

Der Code basiert auf https://github.com/CodeforLeipzig/codingdavinciost2018. Danke @joergreichert !

Blogpost: [zur Datengrundlage](https://blog.lobid.org/2019/10/08/nwbib-at-cdv.html)

Blogpost: [Projektidee](https://blog.lobid.org/2019/10/22/nrw-quiz-idee.html)

[Präsentation vor der Jury](https://slides.lobid.org/nwbib-cdv-2019-jury)

 
# Hintergrund

Anhand der mehr als 400.000 bibliographischen Datensätzen zu NRW (https://nwbib.de/) werden automatisiert Bilder für die für einen Ort am häufigsten verwendeten Schlagworte (z.B. "Kölner Dom" für Köln) aus Wikidata geholt und der Spielerin präsentiert. Auf einer Karte von NRW ist eine Auswahl von größeren Städte mit anklickbaren Markern dargestellt. Die Aufgabe besteht in der Zuweisung der Abbildungen zum passenden Ort.
 
### Enstehung der Projektideen:
Es gibt ja mindestens drei Rollen bei codingDaVinci: **Datengeber**, **Projektideefindung** und **Entwickler**. Meine Rolle waren eigentlich die des Datengebers. Da keine Projektidee für unsere Daten zustande kam hab ich mir selber was überlegt. Ein [Twitterthread](https://twitter.com/dr0ide/status/1186279085166776320) zeigt, dass ich zuerst eine Kartenvisualisierung der Zeitzeugengeschichten von [euregio-history.net](https://euregio-history.ne/) umgesetzt hatte,und wie daraufhin dann auf der Zugrückfahrt die [Idee zum NRW-Städte-Quiz](https://blog.lobid.org/2019/10/22/nrw-quiz-idee.html) aufkam, und auf ein Nachfragen um Programmierunterstützung @joergreichert auf sein älteres daVinci Quiz [damals in Leipzig](https://github.com/CodeforLeipzig/codingdavinciost2018) verwies, das dann zur Codegrundlage für das NRW-Quiz wurde. Connecting the dots, danke an @cdvwest :+1: 

### Projektentwicklung
Aufbauend auf den Javascript-Erfahrungen des kleinen euregio-history.net Projekts und der Codegrundlage von @joergreichert konnte das NRW-Städte-Quiz entstehen. Das Design und die Spielmöglichkeiten hatten einen starken Rahmen durch "damals in Leipzig" vorgegeben, konnten aber im Verlaufe der Projektentwicklung durch verschiedene Schwierigkeitsgrade und Quiz-Sets interessanter gemacht werden.

Die github commit history zeigt den ersten Beitrag am 28.10. und den letzten am 9.12.

## Details aus dem Projekt
Die Daten sind bereits mit Wikidata verknüpft. Auch gibt es Verknüpfungen zu einer anderen Datenbank, der GND ("Gemeinsame Normdaten", z.B. Autoren, Orte, Schlagworte), die wiederum oft in Wikidata verzeichnet sind. Anders als bei euregio-history.net müssen nicht Literale (Ortsnamen) auf Wikidata gematched werden.

### Schnittstellen
Schnittstellen, die zur Erzeugung der Geodaten benutzt wurde:

- [Mittels SPARLQ die wikidata abfragen um alle Städte in NRW zu erhalten, die mehr als 100.000 Einwohner haben](https://github.com/dr0i/nwbib-quiz/blob/master/src/main/resources/sparqlGetBigCities.sparql)

- In [diesem Bash-Script in Zeile 9](https://github.com/dr0i/nwbib-quiz/blob/f8f9ca9a873c13dad5656da052ec179a2a09c2a8/src/main/resources/buildTopoiConcordanceWdNwbib.sh#L9) wird ein API-Aufruf an die lobid-resources-API durchgeführt, um die nach Häufigkeit sortierten Aggregationen (aka "Facetten" aka "Drill-Down" aka "Kategorisierungen") von Schlagworten von bibliographischen Ressourcen zu erhalten, die einen der Orte mit mehr als 100.000 Einwohner zum Thema haben. Diese Aggregationen sind GND-IDs, die dann in Zeile 18 gegen die GND-API von lobid abgefragt werden, um an Bilder zu gelangen, die diesem Schlagwort zugeordnet sind.
