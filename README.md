# Schiavo Bus Management System

## Descrizione del Progetto

Schiavo Bus Management System è un'applicazione web per la gestione di una flotta di autobus, autisti, tour e agenzie. L'applicazione permette di:

- Gestire autobus e autisti
- Pianificare e monitorare tour
- Gestire le relazioni con le agenzie
- Tenere traccia della manutenzione dei veicoli
- Visualizzare un calendario interattivo dei tour

## Struttura del Progetto

Il progetto è sviluppato con React, TypeScript e Vite, e utilizza Supabase come backend per l'autenticazione e il database.

### Struttura delle Cartelle

- `src/`: Contiene il codice sorgente dell'applicazione
  - `components/`: Componenti React riutilizzabili
    - `calendar/`: Componenti per il calendario dei tour
    - `layout/`: Componenti per il layout dell'applicazione
  - `lib/`: Librerie e utilità
    - `supabase.ts`: Configurazione e funzioni per Supabase
    - `store.ts`: Gestione dello stato dell'applicazione
  - `pages/`: Pagine dell'applicazione
  - `styles/`: Fogli di stile CSS
  - `types/`: Definizioni dei tipi TypeScript

- `public/`: File statici accessibili pubblicamente
- `database_structure.sql`: Schema del database
- `sample_data.sql`: Dati di esempio per il database
- `setup_security_policies.sql`: Politiche di sicurezza per Supabase
- `schema.sql`: Schema completo del database

## Configurazione di Supabase

L'applicazione utilizza Supabase come backend. Le credenziali di accesso sono:

- URL: https://vrgnppslfvfeimnwgasa.supabase.co
- API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZ25wcHNsZnZmZWltbndnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzc1MDQsImV4cCI6MjA1OTg1MzUwNH0.hPaZFaz3vYO4GJLbbSdnH_scIPiGrhluEUMjR8N8unM

## Avvio dell'Applicazione

Per avviare l'applicazione in modalità sviluppo:

```bash
npm run dev
```

Se riscontri problemi con il comando sopra, puoi utilizzare direttamente:

```bash
npx vite --force
```

L'applicazione sarà disponibile all'indirizzo http://localhost:3007
