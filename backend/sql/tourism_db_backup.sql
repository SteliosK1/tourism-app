--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 17.0

-- Started on 2025-07-23 10:15:19 EEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: stelioskoutsioumaris
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO stelioskoutsioumaris;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16591)
-- Name: destinations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destinations (
    id integer NOT NULL,
    name text NOT NULL,
    tagline text,
    description text,
    attractions text[],
    rating real,
    cuisine text,
    trip_info jsonb,
    image text
);


ALTER TABLE public.destinations OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16590)
-- Name: destinations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.destinations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.destinations_id_seq OWNER TO postgres;

--
-- TOC entry 3785 (class 0 OID 0)
-- Dependencies: 209
-- Name: destinations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.destinations_id_seq OWNED BY public.destinations.id;


--
-- TOC entry 3635 (class 2604 OID 16594)
-- Name: destinations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinations ALTER COLUMN id SET DEFAULT nextval('public.destinations_id_seq'::regclass);


--
-- TOC entry 3778 (class 0 OID 16591)
-- Dependencies: 210
-- Data for Name: destinations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destinations (id, name, tagline, description, attractions, rating, cuisine, trip_info, image) FROM stdin;
1	Paris, France	The City of Light	Paris, the capital of France, is renowned for its art, fashion, gastronomy, and culture. The city is home to iconic landmarks like the Eiffel Tower, Notre-Dame Cathedral, and the Louvre Museum.	{"Eiffel Tower","Louvre Museum","Notre-Dame Cathedral",Champs-Élysées,Montmartre}	4.8	Experience authentic French cuisine including croissants, macarons, escargot, and world-class wines. Visit local bistros and patisseries for an authentic taste of Paris.	{"cost": "€80–120/day", "bestTime": "April to October", "currency": "Euro (€)", "language": "French"}	/images/paris.jpg
2	Tokyo, Japan	Tradition Meets Innovation	Tokyo is a bustling metropolis blending ancient temples with neon-lit skyscrapers. A city of contrasts, culture, and cutting-edge technology.	{"Shibuya Crossing","Tokyo Tower","Meiji Shrine",Akihabara,"Asakusa & Senso-ji Temple"}	4.9	Delight in sushi, ramen, tempura, and street snacks from Tsukiji Market and izakayas.	{"cost": "¥9000–15000/day", "bestTime": "March to May & October to November", "currency": "Japanese Yen (¥)", "language": "Japanese"}	/images/japan.jpg
3	New York, USA	The City That Never Sleeps	New York is a fast-paced, energetic city known for its skyline, culture, and diversity. From Central Park to Times Square, there's always something happening.	{"Statue of Liberty","Central Park","Times Square","Empire State Building","Broadway Theaters"}	4.6	Try New York-style pizza, bagels, international street food, and fine dining from every cuisine imaginable.	{"cost": "$150–250/day", "bestTime": "April to June & September to November", "currency": "US Dollar ($)", "language": "English"}	/images/new_york_city.jpg
4	Rome, Italy	The Eternal City	Rome is a historic city filled with ancient ruins, Renaissance art, and vibrant street life. It's a journey through time with every step you take.	{Colosseum,"Trevi Fountain",Pantheon,"Vatican Museums","Roman Forum"}	4.3	Indulge in traditional Italian dishes like pasta carbonara, pizza margherita, gelato, and espresso.	{"cost": "$120–200/day", "bestTime": "April to June & September to October", "currency": "Euro (€)", "language": "Italian"}	/images/rome.jpg
\.


--
-- TOC entry 3786 (class 0 OID 0)
-- Dependencies: 209
-- Name: destinations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.destinations_id_seq', 4, true);


--
-- TOC entry 3637 (class 2606 OID 16598)
-- Name: destinations destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_pkey PRIMARY KEY (id);


--
-- TOC entry 3784 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: stelioskoutsioumaris
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-07-23 10:15:19 EEST

--
-- PostgreSQL database dump complete
--

