--
-- Database : 'proverby'
-- PostgreSQL
--

-- --------------------------------------------------------

--
-- Extension 'pg_trgm' for similarity
--
CREATE EXTENSION IF NOT EXISTS pg_trgm;

--
-- Table structure for table 'users'
--

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) NOT NULL,
  foto_profilo VARCHAR(255) NOT NULL,
  partite_giocate INT DEFAULT 0 NOT NULL,
  best_score INT DEFAULT 0 NOT NULL,
  miglior_posizione INT DEFAULT 0 NOT NULL,
  posizione_attuale INT DEFAULT 0 NOT NULL,
  score_week INT DEFAULT 0 NOT NULL,
  is_admin INT DEFAULT 0 NOT NULL
);

--
-- Table structure for table 'proverbi'
--

CREATE TABLE IF NOT EXISTS proverbi (
  id SERIAL PRIMARY KEY,
  proverbio VARCHAR(255) NOT NULL,
  spiegazione TEXT NOT NULL,
  esempi TEXT[],
  stato INT DEFAULT 0 NOT NULL,
  data_accettazione DATE NOT NULL DEFAULT CURRENT_DATE,
  username VARCHAR(50) NOT NULL,
  score_week INT DEFAULT 0 NOT NULL,
  proverbio_del_giorno INT DEFAULT 0 NOT NULL,
  seo_link VARCHAR(255) NOT NULL UNIQUE
);

--
-- Table structure for table 'salvati'
--

CREATE TABLE IF NOT EXISTS salvati (
  id SERIAL PRIMARY KEY,
  proverbio_seo_link VARCHAR(255) NOT NULL,
  uid VARCHAR(255) NOT NULL
);

--
-- Table structure for table 'likes'
--

CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  proverbio_id INT NOT NULL,
  fingerprint VARCHAR(255) NOT NULL,
  like_state INT DEFAULT 0 NOT NULL,
  data_like DATE NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT unique_proverbio_fingerprint UNIQUE (proverbio_id, fingerprint)
);