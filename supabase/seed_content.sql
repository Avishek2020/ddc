-- ============================================================
--  DDC website — seed default content
--  Run AFTER schema.sql. Safe to re-run: existing keys are kept
--  (ON CONFLICT DO NOTHING), so it won't overwrite admin edits.
-- ============================================================

insert into public.site_content (key, value) values ('home_eyebrow', '{"de": "Produktentwicklung & Engineering", "en": "Product Development & Engineering"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('home_name', '"FJ Donner"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('home_tagline', '{"de": "Ideen. Entwicklung. Realisierung.<br/>Für eine bessere Zukunft.", "en": "Ideas. Development. Realization.<br/>For a better future."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('home_p1', '{"de": "DDC entwickelt innovative Lösungen und Produkte in den Bereichen Mechanik und Mechatronik, KI-basierte Anwendungen sowie digitale Systeme. Darüber hinaus unterstützt DDC Unternehmen bei der Vermarktung und dem Einsatz großformatiger Displays und Big-Screen-Lösungen.", "en": "DDC develops innovative solutions and products in mechanics and mechatronics, AI-based applications and digital systems. DDC also supports companies in marketing and deploying large-format displays and big-screen solutions."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('home_p2', '{"de": "Wir verbinden technisches Know-how, praktische Erfahrung und innovatives Denken, um komplexe Herausforderungen in zuverlässige und marktfähige Lösungen zu verwandeln.", "en": "We combine technical know-how, hands-on experience and innovative thinking to turn complex challenges into reliable, market-ready solutions."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('home_p3', '{"de": "Von der ersten Idee und Konzeption über die Entwicklung und Optimierung bis hin zur Umsetzung begleitet DDC seine Kunden ganzheitlich. Dabei helfen wir, interne Ressourcen zu entlasten, Entwicklungszeiten zu verkürzen und technische Herausforderungen effizient zu lösen – bei gleichzeitigem Fokus auf Qualität, Kosten und Time-to-Market.", "en": "From the initial idea and concept through development and optimization to implementation, DDC supports its clients end to end. In doing so, we help relieve internal resources, shorten development times and solve technical challenges efficiently — while keeping a clear focus on quality, cost and time-to-market."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('home_slogan', '{"de": "DDC – Innovative Technik. Intelligente Lösungen. Erfolgreiche Produkte.", "en": "DDC – Innovative technology. Intelligent solutions. Successful products."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_h2', '{"de": "Wer wir sind", "en": "Who we are"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_p1', '{"de": "[Platzhalter: Unternehmensgeschichte, Mission und Werte von DDC. Beschreibung des Teams und der Herangehensweise.]", "en": "[Placeholder: company history, mission and values of DDC. Description of the team and approach.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_p2', '{"de": "[Platzhalter: Zweiter Absatz — was DDC von anderen Anbietern unterscheidet.]", "en": "[Placeholder: second paragraph — what sets DDC apart from other providers.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_stat1_num', '"[00]"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_stat1_label', '{"de": "Jahre am Markt", "en": "Years in market"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_stat2_num', '"[00]"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_stat2_label', '{"de": "Mitarbeitende", "en": "Team members"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_stat3_num', '"[00]"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_stat3_label', '{"de": "Länder beliefert", "en": "Countries served"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about_image', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('prod_intro', '{"de": "[Platzhalter: kurze Beschreibung des Entwicklungsprozesses]", "en": "[Placeholder: short description of the development process]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_intro', '{"de": "[Platzhalter: kurze Einleitung zu den Leistungen]", "en": "[Placeholder: short intro to the services]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_1_title', '{"de": "[Leistung 1]", "en": "[Service 1]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_1_desc', '{"de": "[Platzhaltertext für Leistungsbeschreibung.]", "en": "[Placeholder text for service description.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_2_title', '{"de": "[Leistung 2]", "en": "[Service 2]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_2_desc', '{"de": "[Platzhaltertext für Leistungsbeschreibung.]", "en": "[Placeholder text for service description.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_3_title', '{"de": "[Leistung 3]", "en": "[Service 3]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_3_desc', '{"de": "[Platzhaltertext für Leistungsbeschreibung.]", "en": "[Placeholder text for service description.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_4_title', '{"de": "[Leistung 4]", "en": "[Service 4]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_4_desc', '{"de": "[Platzhaltertext für Leistungsbeschreibung.]", "en": "[Placeholder text for service description.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_5_title', '{"de": "[Leistung 5]", "en": "[Service 5]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_5_desc', '{"de": "[Platzhaltertext für Leistungsbeschreibung.]", "en": "[Placeholder text for service description.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_6_title', '{"de": "[Leistung 6]", "en": "[Service 6]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('serv_6_desc', '{"de": "[Platzhaltertext für Leistungsbeschreibung.]", "en": "[Placeholder text for service description.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_intro', '{"de": "[Platzhalter: kurze Einleitung zu aktuellen Projekten]", "en": "[Placeholder: short intro to current projects]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_1_cat', '{"de": "[Kategorie]", "en": "[Category]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_1_title', '{"de": "[Projekttitel 1]", "en": "[Project title 1]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_1_desc', '{"de": "[Platzhaltertext zur Projektbeschreibung.]", "en": "[Placeholder project description text.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_1_image', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_2_cat', '{"de": "[Kategorie]", "en": "[Category]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_2_title', '{"de": "[Projekttitel 2]", "en": "[Project title 2]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_2_desc', '{"de": "[Platzhaltertext zur Projektbeschreibung.]", "en": "[Placeholder project description text.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_2_image', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_3_cat', '{"de": "[Kategorie]", "en": "[Category]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_3_title', '{"de": "[Projekttitel 3]", "en": "[Project title 3]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_3_desc', '{"de": "[Platzhaltertext zur Projektbeschreibung.]", "en": "[Placeholder project description text.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_3_image', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_4_cat', '{"de": "[Kategorie]", "en": "[Category]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_4_title', '{"de": "[Projekttitel 4]", "en": "[Project title 4]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_4_desc', '{"de": "[Platzhaltertext zur Projektbeschreibung.]", "en": "[Placeholder project description text.]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('proj_4_image', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('ref_quote', '{"de": "„[Platzhalter: Kundenzitat / Testimonial, das später ersetzt wird.]“", "en": "\"[Placeholder: client quote / testimonial to be replaced later.]\""}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('ref_attr', '{"de": "[Name, Position, Unternehmen]", "en": "[Name, position, company]"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('ref_logo_1', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('ref_logo_2', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('ref_logo_3', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('ref_logo_4', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('ref_logo_5', '""'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('contact_intro', '{"de": "Haben Sie ein Projekt oder eine Idee? Schreiben Sie uns – wir melden uns kurzfristig bei Ihnen.", "en": "Have a project or an idea? Get in touch – we''ll get back to you shortly."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('contact_name', '"Franz Donner"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('contact_email', '"fj-donner@projecttechnic.de"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('contact_phone', '"+49 175 59 41 367"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('contact_address', '"Von-Bodelschwingh-Str. 14, 33175 Bad Lippspringe"'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('prod_phases', '[{"image": "", "title": {"de": "[Phase 1 — Platzhaltertitel]", "en": "[Phase 1 — placeholder title]"}, "desc": {"de": "[Platzhaltertext zur ersten Phase des Produktentwicklungsprozesses.]", "en": "[Placeholder text for the first phase of the product development process.]"}}, {"image": "", "title": {"de": "[Phase 2 — Platzhaltertitel]", "en": "[Phase 2 — placeholder title]"}, "desc": {"de": "[Platzhaltertext zur zweiten Phase.]", "en": "[Placeholder text for the second phase.]"}}, {"image": "", "title": {"de": "[Phase 3 — Platzhaltertitel]", "en": "[Phase 3 — placeholder title]"}, "desc": {"de": "[Platzhaltertext zur dritten Phase.]", "en": "[Placeholder text for the third phase.]"}}, {"image": "", "title": {"de": "[Phase 4 — Platzhaltertitel]", "en": "[Phase 4 — placeholder title]"}, "desc": {"de": "[Platzhaltertext zur vierten Phase.]", "en": "[Placeholder text for the fourth phase.]"}}]'::jsonb) on conflict (key) do nothing;
