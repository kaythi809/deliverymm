--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.10.1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.10.1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: trust_admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO trust_admin;

--
-- Name: enum_Deliveries_paymentStatus; Type: TYPE; Schema: public; Owner: trust_admin
--

CREATE TYPE public."enum_Deliveries_paymentStatus" AS ENUM (
    'pending',
    'paid',
    'failed'
);


ALTER TYPE public."enum_Deliveries_paymentStatus" OWNER TO trust_admin;

--
-- Name: enum_Deliveries_status; Type: TYPE; Schema: public; Owner: trust_admin
--

CREATE TYPE public."enum_Deliveries_status" AS ENUM (
    'pending',
    'assigned',
    'picked_up',
    'delivered',
    'cancelled',
    'way_created',
    'on_the_way',
    'sent',
    'money_sent_to_shop',
    'wrong_contact',
    'returned_to_shop'
);


ALTER TYPE public."enum_Deliveries_status" OWNER TO trust_admin;

--
-- Name: enum_Riders_status; Type: TYPE; Schema: public; Owner: trust_admin
--

CREATE TYPE public."enum_Riders_status" AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public."enum_Riders_status" OWNER TO trust_admin;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: trust_admin
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'Administrator',
    'Rider',
    'admin',
    'shop_owner',
    'rider',
    'customer',
    'user',
    'manager'
);


ALTER TYPE public."enum_Users_role" OWNER TO trust_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Customers; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."Customers" (
    id integer NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    "receiptName" character varying(255) NOT NULL,
    "additionalPhones" jsonb,
    township character varying(255) NOT NULL,
    "fullAddress" text NOT NULL,
    comments text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Customers" OWNER TO trust_admin;

--
-- Name: Customers_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."Customers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Customers_id_seq" OWNER TO trust_admin;

--
-- Name: Customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."Customers_id_seq" OWNED BY public."Customers".id;


--
-- Name: Deliveries; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."Deliveries" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "riderId" integer,
    "pickupAddress" character varying(255) NOT NULL,
    "deliveryAddress" character varying(255) NOT NULL,
    status public."enum_Deliveries_status" DEFAULT 'pending'::public."enum_Deliveries_status",
    "scheduledTime" timestamp with time zone,
    "completedTime" timestamp with time zone,
    notes text,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    "paymentStatus" public."enum_Deliveries_paymentStatus" DEFAULT 'pending'::public."enum_Deliveries_paymentStatus",
    "paymentMethod" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    tracking_number character varying(255) NOT NULL,
    CONSTRAINT positive_price CHECK ((price >= (0)::numeric))
);


ALTER TABLE public."Deliveries" OWNER TO trust_admin;

--
-- Name: Deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."Deliveries_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Deliveries_id_seq" OWNER TO trust_admin;

--
-- Name: Deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."Deliveries_id_seq" OWNED BY public."Deliveries".id;


--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    "userId" integer,
    type character varying(50),
    message text,
    "isRead" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Notifications" OWNER TO trust_admin;

--
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notifications_id_seq" OWNER TO trust_admin;

--
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- Name: OnlineShops; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."OnlineShops" (
    id integer NOT NULL,
    "osName" character varying(255) NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    township character varying(255) NOT NULL,
    email character varying(255),
    "accountId" character varying(255),
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "contactPersons" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "bankAccounts" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "paymentMethods" jsonb DEFAULT '[]'::jsonb,
    "bankInfo" jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public."OnlineShops" OWNER TO trust_admin;

--
-- Name: OnlineShops_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."OnlineShops_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OnlineShops_id_seq" OWNER TO trust_admin;

--
-- Name: OnlineShops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."OnlineShops_id_seq" OWNED BY public."OnlineShops".id;


--
-- Name: Parcels; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."Parcels" (
    id integer NOT NULL,
    "deliveryId" integer,
    weight numeric(10,2),
    dimensions jsonb,
    "isFragile" boolean DEFAULT false,
    "deliveryCharges" numeric(10,2),
    "codAmount" numeric(10,2),
    "itemValue" numeric(10,2),
    "customerFee" numeric(10,2),
    "shopPrepayment" numeric(10,2),
    "transportCost" numeric(10,2),
    "photoUrl" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Parcels" OWNER TO trust_admin;

--
-- Name: Parcels_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."Parcels_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Parcels_id_seq" OWNER TO trust_admin;

--
-- Name: Parcels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."Parcels_id_seq" OWNED BY public."Parcels".id;


--
-- Name: RiderStats; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."RiderStats" (
    id integer NOT NULL,
    "riderId" integer,
    "totalParcels" integer DEFAULT 0,
    "activeParcels" integer DEFAULT 0,
    "deliveredParcels" integer DEFAULT 0,
    "cashOnHand" numeric(10,2) DEFAULT 0,
    "lastUpdated" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."RiderStats" OWNER TO trust_admin;

--
-- Name: RiderStats_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."RiderStats_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RiderStats_id_seq" OWNER TO trust_admin;

--
-- Name: RiderStats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."RiderStats_id_seq" OWNED BY public."RiderStats".id;


--
-- Name: Riders; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."Riders" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name character varying(255) NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    township character varying(255) NOT NULL,
    "fullAddress" text NOT NULL,
    nrc character varying(255),
    "joinedDate" date,
    "emergencyContact" character varying(255),
    "vehicleType" character varying(255),
    photo character varying(255),
    status public."enum_Riders_status" DEFAULT 'active'::public."enum_Riders_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Riders" OWNER TO trust_admin;

--
-- Name: Riders_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."Riders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Riders_id_seq" OWNER TO trust_admin;

--
-- Name: Riders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."Riders_id_seq" OWNED BY public."Riders".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO trust_admin;

--
-- Name: Transactions; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."Transactions" (
    id integer NOT NULL,
    "deliveryId" integer,
    "riderId" integer,
    "shopId" integer,
    "transactionType" character varying(50),
    amount numeric(10,2),
    "transactionStatus" character varying(50),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT positive_amount CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public."Transactions" OWNER TO trust_admin;

--
-- Name: Transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."Transactions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Transactions_id_seq" OWNER TO trust_admin;

--
-- Name: Transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."Transactions_id_seq" OWNED BY public."Transactions".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" NOT NULL,
    status boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "lastLogin" timestamp with time zone,
    "passwordResetToken" character varying(255),
    "passwordResetExpires" timestamp with time zone,
    "failedLoginAttempts" integer DEFAULT 0,
    "accountLocked" boolean DEFAULT false,
    "lockUntil" timestamp with time zone
);


ALTER TABLE public."Users" OWNER TO trust_admin;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO trust_admin;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: trust_admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "resetToken" character varying(255),
    "resetTokenExpiry" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    isactive boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO trust_admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: trust_admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO trust_admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trust_admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Customers id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Customers" ALTER COLUMN id SET DEFAULT nextval('public."Customers_id_seq"'::regclass);


--
-- Name: Deliveries id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Deliveries" ALTER COLUMN id SET DEFAULT nextval('public."Deliveries_id_seq"'::regclass);


--
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- Name: OnlineShops id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."OnlineShops" ALTER COLUMN id SET DEFAULT nextval('public."OnlineShops_id_seq"'::regclass);


--
-- Name: Parcels id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Parcels" ALTER COLUMN id SET DEFAULT nextval('public."Parcels_id_seq"'::regclass);


--
-- Name: RiderStats id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."RiderStats" ALTER COLUMN id SET DEFAULT nextval('public."RiderStats_id_seq"'::regclass);


--
-- Name: Riders id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Riders" ALTER COLUMN id SET DEFAULT nextval('public."Riders_id_seq"'::regclass);


--
-- Name: Transactions id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Transactions" ALTER COLUMN id SET DEFAULT nextval('public."Transactions_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: Customers Customers_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Customers"
    ADD CONSTRAINT "Customers_pkey" PRIMARY KEY (id);


--
-- Name: Deliveries Deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Deliveries"
    ADD CONSTRAINT "Deliveries_pkey" PRIMARY KEY (id);


--
-- Name: Deliveries Deliveries_tracking_number_key; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Deliveries"
    ADD CONSTRAINT "Deliveries_tracking_number_key" UNIQUE (tracking_number);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: OnlineShops OnlineShops_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."OnlineShops"
    ADD CONSTRAINT "OnlineShops_pkey" PRIMARY KEY (id);


--
-- Name: Parcels Parcels_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Parcels"
    ADD CONSTRAINT "Parcels_pkey" PRIMARY KEY (id);


--
-- Name: RiderStats RiderStats_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."RiderStats"
    ADD CONSTRAINT "RiderStats_pkey" PRIMARY KEY (id);


--
-- Name: Riders Riders_phoneNumber_key; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Riders"
    ADD CONSTRAINT "Riders_phoneNumber_key" UNIQUE ("phoneNumber");


--
-- Name: Riders Riders_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Riders"
    ADD CONSTRAINT "Riders_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_username_key; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key" UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: deliveries_rider_id; Type: INDEX; Schema: public; Owner: trust_admin
--

CREATE INDEX deliveries_rider_id ON public."Deliveries" USING btree ("riderId");


--
-- Name: deliveries_status; Type: INDEX; Schema: public; Owner: trust_admin
--

CREATE INDEX deliveries_status ON public."Deliveries" USING btree (status);


--
-- Name: deliveries_user_id; Type: INDEX; Schema: public; Owner: trust_admin
--

CREATE INDEX deliveries_user_id ON public."Deliveries" USING btree ("userId");


--
-- Name: idx_deliveries_tracking_number; Type: INDEX; Schema: public; Owner: trust_admin
--

CREATE INDEX idx_deliveries_tracking_number ON public."Deliveries" USING btree (tracking_number);


--
-- Name: idx_riders_status; Type: INDEX; Schema: public; Owner: trust_admin
--

CREATE INDEX idx_riders_status ON public."Riders" USING btree (status);


--
-- Name: idx_transactions_date; Type: INDEX; Schema: public; Owner: trust_admin
--

CREATE INDEX idx_transactions_date ON public."Transactions" USING btree ("createdAt");


--
-- Name: Deliveries Deliveries_riderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Deliveries"
    ADD CONSTRAINT "Deliveries_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES public."Riders"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Deliveries Deliveries_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Deliveries"
    ADD CONSTRAINT "Deliveries_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notifications Notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: Parcels Parcels_deliveryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Parcels"
    ADD CONSTRAINT "Parcels_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES public."Deliveries"(id);


--
-- Name: RiderStats RiderStats_riderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."RiderStats"
    ADD CONSTRAINT "RiderStats_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES public."Riders"(id);


--
-- Name: Riders Riders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Riders"
    ADD CONSTRAINT "Riders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Transactions Transactions_deliveryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES public."Deliveries"(id);


--
-- Name: Transactions Transactions_riderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES public."Riders"(id);


--
-- Name: Transactions Transactions_shopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trust_admin
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES public."OnlineShops"(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: trust_admin
--

GRANT ALL ON SCHEMA public TO trust_delivery;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO trust_admin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO trust_admin;


--
-- PostgreSQL database dump complete
--

