
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

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."CustomFieldTypes" AS ENUM (
    'INT',
    'DATE',
    'BOOLEAN',
    'STRING',
    'TEXT'
);

ALTER TYPE "public"."CustomFieldTypes" OWNER TO "postgres";

CREATE TYPE "public"."Role" AS ENUM (
    'AUTHOR',
    'ADMIN'
);

ALTER TYPE "public"."Role" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."Account" (
    "id" text NOT NULL,
    "userId" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "access_token" text,
    "expires_at" integer,
    "id_token" text,
    "provider" text NOT NULL,
    "refresh_token" text,
    "scope" text,
    "session_state" text,
    "token_type" text,
    "type" text NOT NULL
);

ALTER TABLE "public"."Account" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Collection" (
    "id" integer NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "topicId" integer NOT NULL,
    "imgageUrl" text,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "slug" text NOT NULL,
    "body" text,
    "fts" tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, ((title || ' '::text) || description))) STORED
);

ALTER TABLE "public"."Collection" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."Collection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."Collection_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."Collection_id_seq" OWNED BY "public"."Collection"."id";

CREATE TABLE IF NOT EXISTS "public"."Comment" (
    "id" text NOT NULL,
    "authorId" text NOT NULL,
    "itemId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "text" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "fts" tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, text)) STORED
);

ALTER TABLE "public"."Comment" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."CustomField" (
    "id" integer NOT NULL,
    "type" public."CustomFieldTypes" NOT NULL,
    "state" boolean DEFAULT true NOT NULL,
    "value" text NOT NULL,
    "collectionId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."CustomField" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."CustomFieldValue" (
    "id" integer NOT NULL,
    "customFieldId" integer NOT NULL,
    "itemId" integer NOT NULL,
    "intValue" integer,
    "booleanValue" boolean,
    "dateValue" timestamp(3) without time zone,
    "stringValue" text,
    "textValue" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."CustomFieldValue" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."CustomFieldValue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."CustomFieldValue_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."CustomFieldValue_id_seq" OWNED BY "public"."CustomFieldValue"."id";

CREATE SEQUENCE IF NOT EXISTS "public"."CustomField_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."CustomField_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."CustomField_id_seq" OWNED BY "public"."CustomField"."id";

CREATE TABLE IF NOT EXISTS "public"."Item" (
    "id" integer NOT NULL,
    "name" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "collectionId" integer NOT NULL,
    "slug" text NOT NULL,
    "fts" tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, name)) STORED
);

ALTER TABLE "public"."Item" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."Item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."Item_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."Item_id_seq" OWNED BY "public"."Item"."id";

CREATE TABLE IF NOT EXISTS "public"."Like" (
    "userId" text NOT NULL,
    "itemId" integer NOT NULL,
    "like" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."Like" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Session" (
    "id" text NOT NULL,
    "userId" text NOT NULL,
    "expires" timestamp(3) without time zone NOT NULL,
    "sessionToken" text NOT NULL
);

ALTER TABLE "public"."Session" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Tag" (
    "id" integer NOT NULL,
    "name" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "slug" text NOT NULL
);

ALTER TABLE "public"."Tag" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."Tag_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."Tag_id_seq" OWNED BY "public"."Tag"."id";

CREATE TABLE IF NOT EXISTS "public"."TagsOnItems" (
    "itemId" integer NOT NULL,
    "tagId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."TagsOnItems" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Topic" (
    "id" integer NOT NULL,
    "name" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "slug" text NOT NULL,
    "name_ru" text
);

ALTER TABLE "public"."Topic" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."Topic_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."Topic_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."Topic_id_seq" OWNED BY "public"."Topic"."id";

CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" text NOT NULL,
    "name" text,
    "email" text,
    "emailVerified" timestamp(3) without time zone,
    "image" text,
    "role" public."Role" DEFAULT 'AUTHOR'::public."Role" NOT NULL,
    "slug" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."User" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."VerificationToken" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."VerificationToken" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."fts" AS
SELECT
    NULL::integer AS "id",
    NULL::text AS "title",
    NULL::text AS "description",
    NULL::text AS "imgageUrl",
    NULL::timestamp(3) without time zone AS "createdAt",
    NULL::text AS "slug",
    NULL::text AS "authorname",
    NULL::text AS "authorslug",
    NULL::tsvector AS "fts";

ALTER TABLE "public"."fts" OWNER TO "postgres";

ALTER TABLE ONLY "public"."Collection" ALTER COLUMN "id" SET DEFAULT nextval('public."Collection_id_seq"'::regclass);

ALTER TABLE ONLY "public"."CustomField" ALTER COLUMN "id" SET DEFAULT nextval('public."CustomField_id_seq"'::regclass);

ALTER TABLE ONLY "public"."CustomFieldValue" ALTER COLUMN "id" SET DEFAULT nextval('public."CustomFieldValue_id_seq"'::regclass);

ALTER TABLE ONLY "public"."Item" ALTER COLUMN "id" SET DEFAULT nextval('public."Item_id_seq"'::regclass);

ALTER TABLE ONLY "public"."Tag" ALTER COLUMN "id" SET DEFAULT nextval('public."Tag_id_seq"'::regclass);

ALTER TABLE ONLY "public"."Topic" ALTER COLUMN "id" SET DEFAULT nextval('public."Topic_id_seq"'::regclass);

ALTER TABLE ONLY "public"."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Collection"
    ADD CONSTRAINT "Collection_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."CustomFieldValue"
    ADD CONSTRAINT "CustomFieldValue_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."CustomField"
    ADD CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("userId", "itemId");

ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."TagsOnItems"
    ADD CONSTRAINT "TagsOnItems_pkey" PRIMARY KEY ("itemId", "tagId");

ALTER TABLE ONLY "public"."Topic"
    ADD CONSTRAINT "Topic_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");

CREATE UNIQUE INDEX "Collection_slug_key" ON public."Collection" USING btree (slug);

CREATE UNIQUE INDEX "Item_slug_key" ON public."Item" USING btree (slug);

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);

CREATE UNIQUE INDEX "Topic_name_key" ON public."Topic" USING btree (name);

CREATE UNIQUE INDEX "Topic_slug_key" ON public."Topic" USING btree (slug);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_slug_key" ON public."User" USING btree (slug);

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);

CREATE INDEX collection_fts ON public."Collection" USING gin (fts);

CREATE OR REPLACE VIEW "public"."fts" AS
 SELECT c.id,
    c.title,
    c.description,
    c."imgageUrl",
    c."createdAt",
    c.slug,
    u.name AS authorname,
    u.slug AS authorslug,
    to_tsvector(((((((((((c.title || ' '::text) || c.description) || ' '::text) || u.name) || ' '::text) || COALESCE(string_agg(items.name, ' '::text), ''::text)) || ' '::text) || COALESCE(string_agg(items.tags, ' '::text), ''::text)) || ' '::text) || COALESCE(string_agg(items.comments, ' '::text), ''::text))) AS fts
   FROM ((public."Collection" c
     LEFT JOIN ( SELECT i.id,
            i.name,
            i."collectionId",
            COALESCE(string_agg(tags.name, ' '::text), ''::text) AS tags,
            COALESCE(string_agg(com.text, ' '::text), ''::text) AS comments
           FROM ((public."Item" i
             LEFT JOIN ( SELECT toi."itemId",
                    t.name
                   FROM (public."TagsOnItems" toi
                     LEFT JOIN public."Tag" t ON ((toi."tagId" = t.id)))) tags ON ((i.id = tags."itemId")))
             LEFT JOIN public."Comment" com ON ((i.id = com."itemId")))
          GROUP BY i.id) items ON ((items."collectionId" = c.id)))
     LEFT JOIN public."User" u ON ((c."authorId" = u.id)))
  GROUP BY c.id, u.id;

ALTER TABLE ONLY "public"."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Collection"
    ADD CONSTRAINT "Collection_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Collection"
    ADD CONSTRAINT "Collection_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "Comment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."CustomFieldValue"
    ADD CONSTRAINT "CustomFieldValue_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES public."CustomField"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."CustomFieldValue"
    ADD CONSTRAINT "CustomFieldValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."CustomField"
    ADD CONSTRAINT "CustomField_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Item"
    ADD CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Like"
    ADD CONSTRAINT "Like_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."TagsOnItems"
    ADD CONSTRAINT "TagsOnItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."TagsOnItems"
    ADD CONSTRAINT "TagsOnItems_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."Account" TO "anon";
GRANT ALL ON TABLE "public"."Account" TO "authenticated";
GRANT ALL ON TABLE "public"."Account" TO "service_role";

GRANT ALL ON TABLE "public"."Collection" TO "anon";
GRANT ALL ON TABLE "public"."Collection" TO "authenticated";
GRANT ALL ON TABLE "public"."Collection" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Collection_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Collection_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Collection_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Comment" TO "anon";
GRANT ALL ON TABLE "public"."Comment" TO "authenticated";
GRANT ALL ON TABLE "public"."Comment" TO "service_role";

GRANT ALL ON TABLE "public"."CustomField" TO "anon";
GRANT ALL ON TABLE "public"."CustomField" TO "authenticated";
GRANT ALL ON TABLE "public"."CustomField" TO "service_role";

GRANT ALL ON TABLE "public"."CustomFieldValue" TO "anon";
GRANT ALL ON TABLE "public"."CustomFieldValue" TO "authenticated";
GRANT ALL ON TABLE "public"."CustomFieldValue" TO "service_role";

GRANT ALL ON SEQUENCE "public"."CustomFieldValue_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."CustomFieldValue_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."CustomFieldValue_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."CustomField_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."CustomField_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."CustomField_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Item" TO "anon";
GRANT ALL ON TABLE "public"."Item" TO "authenticated";
GRANT ALL ON TABLE "public"."Item" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Item_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Item_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Item_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Like" TO "anon";
GRANT ALL ON TABLE "public"."Like" TO "authenticated";
GRANT ALL ON TABLE "public"."Like" TO "service_role";

GRANT ALL ON TABLE "public"."Session" TO "anon";
GRANT ALL ON TABLE "public"."Session" TO "authenticated";
GRANT ALL ON TABLE "public"."Session" TO "service_role";

GRANT ALL ON TABLE "public"."Tag" TO "anon";
GRANT ALL ON TABLE "public"."Tag" TO "authenticated";
GRANT ALL ON TABLE "public"."Tag" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Tag_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tag_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tag_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."TagsOnItems" TO "anon";
GRANT ALL ON TABLE "public"."TagsOnItems" TO "authenticated";
GRANT ALL ON TABLE "public"."TagsOnItems" TO "service_role";

GRANT ALL ON TABLE "public"."Topic" TO "anon";
GRANT ALL ON TABLE "public"."Topic" TO "authenticated";
GRANT ALL ON TABLE "public"."Topic" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Topic_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Topic_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Topic_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";

GRANT ALL ON TABLE "public"."VerificationToken" TO "anon";
GRANT ALL ON TABLE "public"."VerificationToken" TO "authenticated";
GRANT ALL ON TABLE "public"."VerificationToken" TO "service_role";

GRANT ALL ON TABLE "public"."fts" TO "anon";
GRANT ALL ON TABLE "public"."fts" TO "authenticated";
GRANT ALL ON TABLE "public"."fts" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
