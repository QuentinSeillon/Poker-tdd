# Poker TDD (Texas Hold'em)

Bibliothèque TypeScript d’évaluation de mains **Texas Hold’em**, développée en **TDD (Vitest)**.

Objectifs :
- évaluer une main de **5 cartes** (`rank5`)
- trouver la meilleure main de **5 cartes parmi 7** (`bestOf7`)
- comparer des mains (`compareHandRank`)
- évaluer un joueur avec **board(5) + hole(2)** (`evaluatePlayer`)
- déterminer le(s) gagnant(s) parmi plusieurs joueurs (`winners`)

---

## Format des cartes

Les cartes sont fournies sous forme de code à 2 caractères :

- Rang : `2 3 4 5 6 7 8 9 T J Q K A`
- Couleur : `S H D C`
  - `S` = Spades (Piques)
  - `H` = Hearts (Cœurs)
  - `D` = Diamonds (Carreaux)
  - `C` = Clubs (Trèfles)

Exemples : `AS` (As de pique), `TD` (10 de carreau), `7H`, `KC`.

La fonction `analyzeCard(code)` convertit un code en objet `Card`.

---

## Sortie `HandRank`

Toutes les évaluations retournent un objet :

- `category` : catégorie de main (enum `Category`)
- `tiebreak` : tableau de nombres utilisé pour départager deux mains de même catégorie
- `chosen5` : les **5 cartes exactes** retenues, dans un ordre déterministe

### Ordre des catégories (`Category`)
De la plus faible à la plus forte :
1. HighCard
2. OnePair
3. TwoPair
4. ThreeKind
5. Straight
6. Flush
7. FullHouse
8. FourKind
9. StraightFlush

---

## Convention d’ordre déterministe pour `chosen5`

`chosen5` est ordonné de manière stable pour que les tests soient reproductibles :

- **Straight / StraightFlush** : carte haute → carte basse  
  - exception **wheel** `A-2-3-4-5` : ordre `5-4-3-2-A`
- **FourKind** : `quad quad quad quad kicker`
- **FullHouse** : `trip trip trip pair pair`
- **ThreeKind** : `trip trip trip kicker kicker` (kickers décroissants)
- **TwoPair** : `highPair highPair lowPair lowPair kicker`
- **OnePair** : `pair pair kicker kicker kicker` (kickers décroissants)
- **Flush / HighCard** : cartes triées par rang décroissant

En cas d’égalité parfaite, les couleurs ne départagent pas la main ; elles servent uniquement à détecter une flush / straight flush.

---

## Hypothèses / Validations

- Les fonctions attendent des entrées au bon format :
  - `rank5` : exactement 5 cartes
  - `bestOf7` : exactement 7 cartes
  - `evaluatePlayer` : `board` = 5 cartes, `hole` = 2 cartes
- Gestion des doublons :
  - **Hypothèse** : les entrées ne contiennent pas de carte dupliquée (même code) entre board et joueurs.
  - (Optionnel) Une validation peut être ajoutée si souhaité.

---

## Structure du dépôt

```
src/
  poker/
    types.ts           # définitions Card, Suit…
    parse.ts           # conversion code → Card
    rank5.ts           # évaluation d’une main de 5 cartes
    compare.ts         # comparaison de deux HandRank
    bestOf7.ts         # meilleure main parmi 7 cards
    evaluatePlayer.ts  # combine board + hole et évalue le joueur
    winners.ts         # détermine les gagnants parmi plusieurs joueurs

test/
  parse.test.ts             # validité du parsing
  rank5.*.test.ts           # scénarios par catégorie (high‑card, pair, …)
  compareHandRank.test.ts   # comparaison / tiebreaks
  bestOf7.test.ts           # logique best‑of‑7
  evaluatePlayer.test.ts    # combinaisons board + hole
  winners.test.ts           # détermination des vainqueurs
  tiebreakers.test.ts       # cas particuliers de tiebreak
  …                         # autres tests selon catégories
```

## Exemples d’utilisation

### Parser une carte

```ts
import { analyzeCard } from "./src/poker/parse";

const card = analyzeCard("QS");
// -> { rank: 12, suit: "S", code: "QS" }
```

### Évaluer une main de 5 cartes

```ts
import { analyzeCard } from "./src/poker/parse";
import { rank5, Category } from "./src/poker/rank5";

const hand = ["AS","KD","QH","JC","TD"].map(analyzeCard);
const rank = rank5(hand);
console.log(Category[rank.category]); // "Straight"
console.log(rank.tiebreak);          // [14]
```

### Comparer deux mains

```ts
import { compareHandRank } from "./src/poker/compare";

// a et b sont des HandRank obtenus via rank5 ou bestOf7
const result = compareHandRank(a, b);
if (result > 0) console.log("a gagne");
else if (result < 0) console.log("b gagne");
else console.log("égalité");
```

### Tests

Pour lancer l’intégralité de la suite :

```
npm install
npm run test
```

Les tests sont répartis par fichier selon les fonctionnalités (parsing,
classement, comparaison, etc.). Ils servent de documentation et garantissent
le comportement attendu lors des évolutions.