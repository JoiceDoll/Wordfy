# Wordfy

Dicionário em React Native (offline-first) para listar palavras em inglês, ver significados/fonética, favoritar e consultar o histórico — consumindo a [Free Dictionary API](https://dictionaryapi.dev/).

## Stack

- React Native CLI, TypeScript, StyleSheet
- TanStack Query + Axios · Redux Toolkit · Context API (tema)
- SQLite (`op-sqlite`) · Keychain · React Navigation
- TTS: `react-native-tts` · Testes: Jest + RNTL

## O que o app faz

- Lista infinita (Word list / Histórico / Favoritos)
- Detalhe com meanings, fonética e pronúncia (TTS)
- Favoritar / desfavoritar por usuário
- Offline-first: cache SQLite das respostas da API (hit local antes da rede; stale offline)
- Login/registro local (favoritos e histórico por `userId`)

## Arquitetura e patterns

```
View → ViewModel → Port → Repository/Service → SQLite / API / nativo
```

| Pattern | Uso |
|---------|-----|
| **MVVM** | Screens + `use*ViewModel` |
| **Ports & Adapters** | Contratos em `domain/ports`; implementações em `data` / `services` |
| **Repository** | Persistência e API encapsuladas |
| **DI (Composition Root)** | `di/container.ts` no bootstrap |
| **Factory + Adapter** | TTS atrás de `ITtsService` (`createTtsService`) |
| **Cache-aside** | SQLite antes da API; TTL + stale offline |

Pasta principal: `src/` (`app`, `di`, `domain`, `data`, `features`, `store`, `services`, `shared`).

## Instalação

Node `>= 22.11` + ambiente [React Native](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install
bundle install && cd ios && bundle exec pod install && cd ..

npm start
npm run ios    # ou: npm run android
```

Crie uma conta no app (e-mail + senha, mín. 6 caracteres). Sessão no Keychain; dados por usuário no SQLite.

| Comando | Uso |
|---------|-----|
| `npm test` | Testes unitários |
| `npm run lint` | ESLint |
| `npm run seed:words` | Regenera o seed de palavras |

## Decisões

- **Seed ~9k** (dwyl ∩ [google-10000-english](https://github.com/first20hours/google-10000-english)), não o JSON completo (~370k): o arquivo exigido pelo challenge começa com termos raros que a API quase não resolve; priorizar palavras comuns deixa a demo do detalhe funcional.
- **Auth local** (SQLite + hash SHA-256+salt): atende o diferencial de login e offline-first; a porta `IAuthRepository` permite trocar por Firebase/Supabase depois.
- **DI manual** em vez de tsyringe: menos overhead e fácil de mockar nos testes.
- **Unit tests** (repositories, mappers, Redux, tabs, factory TTS) em vez de E2E no prazo do challenge.

This is a challenge by [Coodesh](https://coodesh.com/)
