# TeamRetro — AI Destekli Sprint Retrospektifi

Turkcell temalı, 9 aşamalı retrospektif yönetim aracı. Takım üyeleri isimleriyle giriş yapar, fikir yazar, AI ile gruplar, oy verir ve tartışır. İsteğe bağlı anonim mod ile kartlar isimsiz gönderilebilir.

## Özellikler

- **Giriş Ekranı** — İsim/soyad ile toplantıya katılım (kullanıcı dropdown yok)
- **9 Aşamalı Akış** — Icebreaker → Hoşgeldin → Açık Aksiyonlar → Beyin Fırtınası → Gruplama → Oylama → Tartışma → İnceleme → Kapanış
- **Anonim Kart Desteği** — Her kart eklerken "Anonim gönder" seçeneği
- **AI Gruplama** — Fikirleri semantik olarak otomatik kategorize eder
- **Zamanlayıcı** — Beyin fırtınası (5dk) ve oylama (2dk) için geri sayım
- **Ses Kaydı & Transkripsiyon** — Tartışma aşamasında sesli not ve AI transkript
- **AI Analiz** — Tartışma özetleri ve aksiyon önerileri
- **Oylama** — Kişi başı 6 oy limiti ile önceliklendirme
- **Turkcell Teması** — Kurumsal renk paleti (#ffc72c, #1a2b3c, #00a0d2)

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15, React 19, TypeScript |
| State | Zustand |
| Stil | Tailwind CSS 3 |
| Animasyon | Framer Motion |
| Ses | WaveSurfer.js |
| İkon | Lucide React |
| Sürükle-Bırak | dnd-kit |

## Proje Yapısı

```
src/
├── app/                  # Next.js App Router (page, layout, globals)
├── components/features/
│   ├── auth/             # LoginView (giriş ekranı)
│   ├── brainstorm/       # Beyin fırtınası kartları
│   ├── close/            # Kapanış & geri bildirim
│   ├── discuss/          # Tartışma & ses kaydı
│   ├── group/            # AI gruplama
│   ├── icebreaker/       # Isınma sorusu
│   ├── open-actions/     # Geçmiş aksiyonlar
│   ├── review/           # İnceleme & anlaşmalar
│   ├── vote/             # Oylama
│   ├── welcome/          # Hoşgeldin ekranı
│   └── workflow/         # StepIndicator, TimerBar
├── hooks/                # useAudioRecorder
├── lib/                  # AI mock (gruplama, transkripsiyon, analiz)
├── services/             # Mock API
├── store/                # Zustand store'ları (Card, Retro, Ai, Ui)
└── types/                # TypeScript tip tanımları
```

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın. İsminizi yazıp toplantıya katılın.

## Build

```bash
npm run build
npm start
```
