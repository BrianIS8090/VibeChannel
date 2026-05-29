# Graph Report - VibeChannel  (2026-05-29)

## Corpus Check
- 29 files · ~221,138 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 159 nodes · 164 edges · 23 communities (22 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b089d0a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `VibeChannel` - 7 edges
2. `Мокапы VibeChannel` - 6 edges
3. `VibeChannel — план реализации` - 6 edges
4. `buildServer()` - 5 edges
5. `Variant: Terminal CRT Radio` - 5 edges
6. `Variant: Pocket Night` - 5 edges
7. `Variant: Night Console` - 5 edges
8. `Variant: Terminal TUI Split` - 5 edges
9. `Variant: Terminal Command Deck` - 5 edges
10. `Variant: Cozy Radio` - 5 edges

## Surprising Connections (you probably didn't know these)
- `buildServer()` --calls--> `createStore()`  [EXTRACTED]
  src/server/app.ts → src/server/store.ts

## Communities (23 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (21): apiPath(), App(), audioRef, chooseStation(), [currentMood, setCurrentMood], [currentStation, setCurrentStation], [favorites, setFavorites], favoriteStations (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (12): getStationById(), moods, VibeStore, HistoryItem, Mood, Station, VibeState, navigation (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.23
Nodes (9): fallbackStations, getStationsByMood(), payload, buildServer(), BuildServerOptions, FastifyInstance, registerApi(), port (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (10): Статус, Что уже есть, Мокапы, Команды, Сервер, Принципы, code:bash (npm install), code:bash (/var/lib/vibechannel/vibechannel.sqlite) (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (6): Первый раунд, Терминальный раунд, Пиксель-арт раунд, Моё мнение, Настоящий TUI-радио раунд, Мокапы VibeChannel

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (6): Зафиксированные решения, Следующий шаг, Следующий шаг, MVP, TDD-правило, VibeChannel — план реализации

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (5): Best for, Design stance, Key choices, Trade-offs, Variant: Terminal CRT Radio

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (5): Best for, Design stance, Key choices, Trade-offs, Variant: Pocket Night

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (5): Best for, Design stance, Key choices, Trade-offs, Variant: Night Console

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): Best for, Design stance, Key choices, Trade-offs, Variant: Terminal TUI Split

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): Best for, Design stance, Key choices, Trade-offs, Variant: Terminal Command Deck

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (5): Best for, Design stance, Key choices, Trade-offs, Variant: Cozy Radio

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (4): Design stance, Key choices, Trade-offs, Variant: Radio Mixer TUI

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (4): Design stance, Key choices, Trade-offs, Variant: Pixel Night Room

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (4): Design stance, Key choices, Trade-offs, Variant: Pixel Pocket Radio

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (4): Design stance, Key choices, Trade-offs, Variant: Pixel Jukebox FM

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (4): Design stance, Key choices, Trade-offs, Variant: Pocket TUI Radio

### Community 17 - "Community 17"
Cohesion: 0.4
Nodes (4): Design stance, Key choices, Trade-offs, Variant: Radio TUI Classic

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (3): Варианты, Моё мнение, VibeChannel — настоящий TUI-раунд

### Community 19 - "Community 19"
Cohesion: 0.5
Nodes (3): Варианты, Моё мнение, VibeChannel — пиксель-арт раунд

## Knowledge Gaps
- **90 isolated node(s):** `Tab`, `Notice`, `audioRef`, `[stations, setStations]`, `[currentStation, setCurrentStation]` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `fallbackStations` connect `Community 2` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `Tab`, `Notice`, `audioRef` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._