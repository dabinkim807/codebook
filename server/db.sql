--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Homebrew)
-- Dumped by pg_dump version 14.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: category; Type: TYPE; Schema: public; Owner: danakim
--

CREATE TYPE public.category AS ENUM (
    'Algorithms',
    'Data Structures'
);


ALTER TYPE public.category OWNER TO danakim;

--
-- Name: day; Type: TYPE; Schema: public; Owner: danakim
--

CREATE TYPE public.day AS ENUM (
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
);


ALTER TYPE public.day OWNER TO danakim;

--
-- Name: difficulty; Type: TYPE; Schema: public; Owner: danakim
--

CREATE TYPE public.difficulty AS ENUM (
    'Beginner',
    'Intermediate',
    'Professional',
    'Expert'
);


ALTER TYPE public.difficulty OWNER TO danakim;

--
-- Name: e_freq; Type: TYPE; Schema: public; Owner: danakim
--

CREATE TYPE public.e_freq AS ENUM (
    'Every Day'
);


ALTER TYPE public.e_freq OWNER TO danakim;

--
-- Name: freq; Type: TYPE; Schema: public; Owner: danakim
--

CREATE TYPE public.freq AS ENUM (
    'Every Week'
);


ALTER TYPE public.freq OWNER TO danakim;

--
-- Name: state; Type: TYPE; Schema: public; Owner: danakim
--

CREATE TYPE public.state AS ENUM (
    'Passed',
    'Failed',
    'In Progress'
);


ALTER TYPE public.state OWNER TO danakim;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: code_challenges; Type: TABLE; Schema: public; Owner: danakim
--

CREATE TABLE public.code_challenges (
    challenge text NOT NULL,
    category text NOT NULL,
    rank public.difficulty NOT NULL
);


ALTER TABLE public.code_challenges OWNER TO danakim;

--
-- Name: users; Type: TABLE; Schema: public; Owner: danakim
--

CREATE TABLE public.users (
    user_id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    test_challenge text,
    test_created timestamp with time zone,
    validated boolean DEFAULT false NOT NULL,
    cc_category public.category,
    cc_rank public.difficulty,
    cc_frequency public.freq,
    cc_day public.day,
    name text,
    e_frequency public.e_freq
);


ALTER TABLE public.users OWNER TO danakim;

--
-- Name: users_code_challenges; Type: TABLE; Schema: public; Owner: danakim
--

CREATE TABLE public.users_code_challenges (
    user_id text NOT NULL,
    challenge text NOT NULL,
    cc_state public.state DEFAULT 'In Progress'::public.state NOT NULL,
    deadline timestamp with time zone NOT NULL
);


ALTER TABLE public.users_code_challenges OWNER TO danakim;

--
-- Data for Name: code_challenges; Type: TABLE DATA; Schema: public; Owner: danakim
--

INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5c374b346a5d0f77af500a5a', 'Algorithms', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5b68c7029756802aa2000176', 'Algorithms', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5b4e779c578c6a898e0005c5', 'Algorithms', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5b86a6d7a4dcc13cd900000b', 'Algorithms', 'Expert');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('545af3d185166a3dec001190', 'Data Structures', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('542ebbdb494db239f8000046', 'Data Structures', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63d33dac08a4830443075c23', 'Data Structures', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63d1ba782de94107abbf85c3', 'Data Structures', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5eaf798e739e39001218a2f4', 'Data Structures', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('60ca2ce44875c5004cda5c74', 'Data Structures', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63899c352412a30063e1e1b3', 'Data Structures', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63879b6208488f20befe8cc9', 'Data Structures', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5fee4559135609002c1a1841', 'Data Structures', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5eecd4a5e5d13e000150e249', 'Data Structures', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5c80b55e95eba7650dc671ea', 'Data Structures', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('609243c36e796b003e79e6b5', 'Data Structures', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5f134651bc9687000f8022c4', 'Data Structures', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5877e7d568909e5ff90017e6', 'Data Structures', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('59669eba1b229e32a300001a', 'Data Structures', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('58905bfa1decb981da00009e', 'Data Structures', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('54f1b7b3f58ba8ee720005a8', 'Data Structures', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('6425a1463b7dd0001c95fad4', 'Data Structures', 'Expert');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('6411b91a5e71b915d237332d', 'Algorithms', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('6409aa6df4a0b773ce29cc3d', 'Algorithms', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('64060d8ab2dd990058b7f8ee', 'Algorithms', 'Beginner');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('643d7ef9cfac31000fee198b', 'Algorithms', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('643869cb0e7a563b722d50ad', 'Algorithms', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63fb421be6be1f57ad81809e', 'Algorithms', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('6408ba54babb196a61d66a65', 'Algorithms', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63ca4b3af1504e005da0f25c', 'Algorithms', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63ada5a5779bac0066143fa0', 'Algorithms', 'Intermediate');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('62e068c14129156a2e0df46a', 'Algorithms', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('621f89cc94d4e3001bb99ef4', 'Algorithms', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('617ae98d26537f000e04a863', 'Algorithms', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63b71bc0834251098ca84b05', 'Algorithms', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5b98dfa088d44a8b000001c1', 'Algorithms', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5b5fe164b88263ad3d00250b', 'Algorithms', 'Professional');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('625c70f8a071210030c8e22a', 'Algorithms', 'Expert');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5ec9e176721b990029ebce83', 'Algorithms', 'Expert');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('63022799acfb8d00285b4ea0', 'Algorithms', 'Expert');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5aaa1aa8fd577723a3000049', 'Algorithms', 'Expert');
INSERT INTO public.code_challenges (challenge, category, rank) VALUES ('5a667236145c462103000091', 'Algorithms', 'Expert');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: danakim
--

INSERT INTO public.users (user_id, username, email, test_challenge, test_created, validated, cc_category, cc_rank, cc_frequency, cc_day, name, e_frequency) VALUES ('1', 'codebook1238u', 'techtonica.codebook@gmail.com', '5b68c7029756802aa2000176', '2023-05-15 21:26:25.807865-04', true, 'Algorithms', 'Beginner', 'Every Week', 'Monday', 'CodeBook', 'Every Day');
INSERT INTO public.users (user_id, username, email, test_challenge, test_created, validated, cc_category, cc_rank, cc_frequency, cc_day, name, e_frequency) VALUES ('google-oauth2|115940204927970477883', 'dabinkim807', 'dabinkim807@gmail.com', '5c374b346a5d0f77af500a5a', '2023-05-18 17:13:53.691-04', true, 'Data Structures', 'Intermediate', 'Every Week', 'Thursday', 'Dana Kim', 'Every Day');


--
-- Data for Name: users_code_challenges; Type: TABLE DATA; Schema: public; Owner: danakim
--

INSERT INTO public.users_code_challenges (user_id, challenge, cc_state, deadline) VALUES ('1', '5c374b346a5d0f77af500a5a', 'In Progress', '2023-05-22 22:31:00.927-04');


--
-- Name: code_challenges cc_unique; Type: CONSTRAINT; Schema: public; Owner: danakim
--

ALTER TABLE ONLY public.code_challenges
    ADD CONSTRAINT cc_unique UNIQUE (challenge, category, rank);


--
-- Name: code_challenges code_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: danakim
--

ALTER TABLE ONLY public.code_challenges
    ADD CONSTRAINT code_challenges_pkey PRIMARY KEY (challenge);


--
-- Name: users email_unique; Type: CONSTRAINT; Schema: public; Owner: danakim
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: users username_unique; Type: CONSTRAINT; Schema: public; Owner: danakim
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT username_unique UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: danakim
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: cc_state_index; Type: INDEX; Schema: public; Owner: danakim
--

CREATE INDEX cc_state_index ON public.users_code_challenges USING btree (cc_state);


--
-- Name: code_challenges_index; Type: INDEX; Schema: public; Owner: danakim
--

CREATE INDEX code_challenges_index ON public.code_challenges USING btree (category, rank);


--
-- Name: user_id_index; Type: INDEX; Schema: public; Owner: danakim
--

CREATE INDEX user_id_index ON public.users USING btree (user_id);


--
-- Name: validated_index; Type: INDEX; Schema: public; Owner: danakim
--

CREATE INDEX validated_index ON public.users USING btree (validated);


--
-- Name: users_code_challenges fk_code_challenges; Type: FK CONSTRAINT; Schema: public; Owner: danakim
--

ALTER TABLE ONLY public.users_code_challenges
    ADD CONSTRAINT fk_code_challenges FOREIGN KEY (challenge) REFERENCES public.code_challenges(challenge);


--
-- Name: users_code_challenges fk_users; Type: FK CONSTRAINT; Schema: public; Owner: danakim
--

ALTER TABLE ONLY public.users_code_challenges
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

