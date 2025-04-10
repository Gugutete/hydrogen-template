# Configurazione di Supabase per Schiavo Bus

Questo documento contiene le istruzioni per configurare Supabase come database per l'applicazione Schiavo Bus.

## Passo 1: Creare un account Supabase

1. Vai su [https://supabase.com](https://supabase.com) e crea un account gratuito.
2. Dopo aver effettuato l'accesso, fai clic su "New Project".
3. Inserisci un nome per il progetto (ad esempio "Schiavo Bus").
4. Scegli una password per il database (prendine nota, ti servirà in seguito).
5. Scegli la regione più vicina a te.
6. Fai clic su "Create new project".

## Passo 2: Configurare il database

1. Una volta creato il progetto, vai alla sezione "SQL Editor" nel menu laterale.
2. Fai clic su "New Query".
3. Copia e incolla il contenuto del file `database_structure.sql` nell'editor.
4. Fai clic su "Run" per creare le tabelle.
5. Crea una nuova query e copia e incolla il contenuto del file `sample_data.sql`.
6. Fai clic su "Run" per inserire i dati di esempio.

## Passo 3: Configurare l'autenticazione

1. Vai alla sezione "Authentication" nel menu laterale.
2. Vai a "Settings" e assicurati che "Email auth" sia abilitato.
3. Vai a "Users" e fai clic su "Add User".
4. Inserisci l'email `admin@schiavobus.it` e la password `Admin123!`.
5. Fai clic su "Create User".

## Passo 4: Configurare l'applicazione

1. Vai alla sezione "Settings" nel menu laterale e poi a "API".
2. Copia l'URL del progetto (ad esempio `https://abcdefghijklm.supabase.co`).
3. Copia la "anon" key (chiave pubblica).
4. Apri il file `src/lib/supabaseClient.ts` nell'applicazione.
5. Sostituisci `https://your-project-url.supabase.co` con l'URL del tuo progetto.
6. Sostituisci `your-anon-key` con la chiave pubblica del tuo progetto.

## Passo 5: Testare l'applicazione

1. Avvia l'applicazione con `npm run dev`.
2. Accedi con le credenziali:
   - Email: `admin@schiavobus.it`
   - Password: `Admin123!`
3. Verifica che i dati vengano caricati correttamente dal database.

## Credenziali di accesso

- **Email**: `admin@schiavobus.it`
- **Password**: `Admin123!`

## Note

- Il piano gratuito di Supabase ha alcune limitazioni, ma dovrebbe essere sufficiente per lo sviluppo e il test dell'applicazione.
- Se hai bisogno di più risorse, puoi passare a un piano a pagamento in qualsiasi momento.
- Ricorda di non condividere le tue credenziali di accesso a Supabase con nessuno.
