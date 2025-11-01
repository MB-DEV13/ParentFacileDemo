-- parentfacile_seed.sql
-- Données initiales (INSERT). À exécuter après parentfacile_schema.sql.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

USE `parentfacile`;

START TRANSACTION;

-- ---------------------------------------------------------------------------
-- admin_users
-- ---------------------------------------------------------------------------
-- Le hash ci-dessous correspond à un exemple fourni dans le dump.
-- S'il existe déjà, la ligne n'est pas dupliquée (ON DUPLICATE KEY UPDATE).
INSERT INTO `admin_users` (`id`, `email`, `password_hash`, `created_at`) VALUES
(1, 'admin@parentfacile.fr', '$2b$10$KbqQ.2eJAVHYtcCnIfJO7eCblPIHk/1njc3xPzAij4q3MjvgCp0Ym', '2025-09-28 16:05:43')
ON DUPLICATE KEY UPDATE `email`=VALUES(`email`);

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------
INSERT INTO `documents` (`id`, `doc_key`, `label`, `tag`, `sort_order`, `file_name`, `file_size`, `mime_type`, `public_url`, `created_at`) VALUES
(9,  'projet-de-naissance', 'Modèle - Projet de Naissance', 'Grossesse', 3, 'Projet_de_Naissance_1759671189267.pdf', 245846, 'application/pdf', '/pdfs/Projet_de_Naissance_1759671189267.pdf', '2025-10-05 13:33:09'),
(10, 'declaration-sage-femme-referente', 'Déclaration Sage Femme Référente', 'Grossesse', 2, '02_Declaration_Sage_Femme_Referente_1759671367316.pdf', 726570, 'application/pdf', '/pdfs/02_Declaration_Sage_Femme_Referente_1759671367316.pdf', '2025-10-05 13:36:07'),
(11, 'conge-paternite-modele', 'Modèle - Congé Paternité', 'Naissance', 4, '03_Conge_Paternite_Modele_1759671399457.pdf', 2340, 'application/pdf', '/pdfs/03_Conge_Paternite_Modele_1759671399457.pdf', '2025-10-05 13:36:39'),
(13, 'declaration-de-grossesse', 'Déclaration de Grossesse', 'Grossesse', 1, 'Declaration_de_grossesse_1759671761262.pdf', 399979, 'application/pdf', '/pdfs/Declaration_de_grossesse_1759671761262.pdf', '2025-10-05 13:42:41'),
(15, 'rattachement-enfant-cpam', 'Rattachement Enfant CPAM', 'Naissance', 5, 'Rattachement_enfant_CPAM_1759676146562.pdf', 1759743, 'application/pdf', '/pdfs/Rattachement_enfant_CPAM_1759676146562.pdf', '2025-10-05 14:55:46'),
(16, 'liste-modele-des-fournitures-scolaires-pour-l-ecole-elementaire', 'Modèle - Fournitures Scolaires', '1–3 ans', 6, 'liste-modele-des-fournitures-scolaires-pour-l-ecole-elementaire_1760270518120.pdf', 123589, 'application/pdf', '/pdfs/liste-modele-des-fournitures-scolaires-pour-l-ecole-elementaire_1760270518120.pdf', '2025-10-12 12:01:58')
ON DUPLICATE KEY UPDATE `label`=VALUES(`label`), `public_url`=VALUES(`public_url`);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
INSERT INTO `messages` (`id`, `email`, `subject`, `message`, `email_sent`, `created_at`, `sent_at`) VALUES
(11, 'alexandre.martin@email.fr', 'Test mail', 'Bonjour, je réalise un test pour l\'envoie de mail via la page contact.\nMerci et bonne journée', 1, '2025-11-01 15:19:57', '2025-11-01 15:19:58'),
(12, 'sophie.dubois@email.fr', 'Test Numéro 2', 'Bonjour,\nceci est un deuxième test.\n\n\nCordialement !', 1, '2025-11-01 15:21:18', '2025-11-01 15:21:19')
ON DUPLICATE KEY UPDATE `subject`=VALUES(`subject`);

COMMIT;
