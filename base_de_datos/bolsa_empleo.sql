--
-- PostgreSQL database dump
--

\restrict fSkXpuEegV0qpumAp1wtm5TFUhVuNxlda4sEqcOs8Z5EtQvuLeaxjALpK1e3Gux

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

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
-- Name: enum_applications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_applications_status AS ENUM (
    'pendiente',
    'revisado',
    'entrevistado',
    'aceptado',
    'rechazado'
);


ALTER TYPE public.enum_applications_status OWNER TO postgres;

--
-- Name: enum_companies_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_companies_status AS ENUM (
    'pendiente',
    'activo',
    'inactivo',
    'rechazado'
);


ALTER TYPE public.enum_companies_status OWNER TO postgres;

--
-- Name: enum_files_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_files_type AS ENUM (
    'cv',
    'photo',
    'logo',
    'attachment'
);


ALTER TYPE public.enum_files_type OWNER TO postgres;

--
-- Name: enum_interviews_interviewType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_interviews_interviewType" AS ENUM (
    'presencial',
    'virtual'
);


ALTER TYPE public."enum_interviews_interviewType" OWNER TO postgres;

--
-- Name: enum_interviews_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_interviews_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'rescheduled'
);


ALTER TYPE public.enum_interviews_status OWNER TO postgres;

--
-- Name: enum_jobs_jobType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_jobs_jobType" AS ENUM (
    'full-time',
    'part-time',
    'contract',
    'internship',
    'temporary'
);


ALTER TYPE public."enum_jobs_jobType" OWNER TO postgres;

--
-- Name: enum_jobs_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_jobs_status AS ENUM (
    'borrador',
    'publicado',
    'cerrado',
    'pausado',
    'expirado'
);


ALTER TYPE public.enum_jobs_status OWNER TO postgres;

--
-- Name: enum_jobs_workMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_jobs_workMode" AS ENUM (
    'remote',
    'on-site',
    'hybrid'
);


ALTER TYPE public."enum_jobs_workMode" OWNER TO postgres;

--
-- Name: enum_notifications_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_notifications_type AS ENUM (
    'info',
    'success',
    'warning',
    'error'
);


ALTER TYPE public.enum_notifications_type OWNER TO postgres;

--
-- Name: enum_recruiter_requests_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_recruiter_requests_status AS ENUM (
    'pendiente',
    'aprobado',
    'rechazado'
);


ALTER TYPE public.enum_recruiter_requests_status OWNER TO postgres;

--
-- Name: enum_user_portfolios_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_user_portfolios_type AS ENUM (
    'github',
    'linkedin',
    'website',
    'behance',
    'dribbble',
    'other'
);


ALTER TYPE public.enum_user_portfolios_type OWNER TO postgres;

--
-- Name: enum_user_skills_proficiencyLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_user_skills_proficiencyLevel" AS ENUM (
    'principiante',
    'intermedio',
    'avanzado',
    'experto'
);


ALTER TYPE public."enum_user_skills_proficiencyLevel" OWNER TO postgres;

--
-- Name: enum_users_userType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_users_userType" AS ENUM (
    'graduate',
    'recruiter',
    'admin'
);


ALTER TYPE public."enum_users_userType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: UserRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRoles" (
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "userId" integer NOT NULL,
    "roleId" integer NOT NULL
);


ALTER TABLE public."UserRoles" OWNER TO postgres;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    "jobId" integer NOT NULL,
    "userId" integer NOT NULL,
    "coverLetter" text,
    status public.enum_applications_status DEFAULT 'pendiente'::public.enum_applications_status,
    "rejectionReason" text,
    "appliedAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: careers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.careers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "facultyId" integer,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.careers OWNER TO postgres;

--
-- Name: TABLE careers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.careers IS 'Tabla de carreras profesionales asociadas a facultades';


--
-- Name: COLUMN careers."facultyId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.careers."facultyId" IS 'FK a faculty - facultad a la que pertenece la carrera';


--
-- Name: careers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.careers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.careers_id_seq OWNER TO postgres;

--
-- Name: careers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.careers_id_seq OWNED BY public.careers.id;


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certifications (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name character varying(255) NOT NULL,
    "issuingOrganization" character varying(255) NOT NULL,
    "issueDate" date NOT NULL,
    "expirationDate" date,
    "credentialId" character varying(255),
    "credentialUrl" character varying(500),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.certifications OWNER TO postgres;

--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certifications_id_seq OWNER TO postgres;

--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    industry character varying(255),
    size character varying(255),
    website character varying(255),
    location character varying(255),
    "logoId" integer,
    "logoUrl" character varying(255),
    "recruiterId" integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    status public.enum_companies_status DEFAULT 'activo'::public.enum_companies_status
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    "applicationId" integer,
    "graduateId" integer NOT NULL,
    "recruiterId" integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "lastMessageAt" timestamp with time zone
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversations_id_seq OWNER TO postgres;

--
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- Name: educations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.educations (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    institution character varying(255) NOT NULL,
    degree character varying(255) NOT NULL,
    "fieldOfStudy" character varying(255) NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date,
    "graduationYear" integer,
    gpa numeric(3,2),
    honors character varying(255),
    "isCurrent" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "facultyId" integer,
    "careerId" integer,
    "degreeType" character varying(50)
);


ALTER TABLE public.educations OWNER TO postgres;

--
-- Name: educations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.educations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.educations_id_seq OWNER TO postgres;

--
-- Name: educations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.educations_id_seq OWNED BY public.educations.id;


--
-- Name: faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculties (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "universityId" integer NOT NULL,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.faculties OWNER TO postgres;

--
-- Name: faculties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculties_id_seq OWNER TO postgres;

--
-- Name: faculties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculties_id_seq OWNED BY public.faculties.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    "originalName" character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    mimetype character varying(255),
    size integer,
    type public.enum_files_type NOT NULL,
    "userId" integer NOT NULL,
    "entityType" character varying(255),
    "entityId" integer,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: interviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interviews (
    id integer NOT NULL,
    "applicationId" integer NOT NULL,
    "proposedDates" timestamp with time zone[] DEFAULT ARRAY[]::timestamp with time zone[],
    "selectedDate" timestamp with time zone,
    status public.enum_interviews_status DEFAULT 'pending'::public.enum_interviews_status,
    "interviewType" public."enum_interviews_interviewType" DEFAULT 'virtual'::public."enum_interviews_interviewType",
    location character varying(500),
    "meetingLink" character varying(500),
    duration integer DEFAULT 60,
    notes text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.interviews OWNER TO postgres;

--
-- Name: interviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interviews_id_seq OWNER TO postgres;

--
-- Name: interviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interviews_id_seq OWNED BY public.interviews.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    requirements text,
    "jobType" public."enum_jobs_jobType" NOT NULL,
    "workMode" public."enum_jobs_workMode",
    location character varying(255),
    "salaryMin" integer,
    "salaryMax" integer,
    skills json DEFAULT '[]'::json,
    deadline timestamp with time zone,
    "publishedAt" timestamp with time zone,
    "expiresAt" timestamp with time zone,
    "companyId" integer NOT NULL,
    status public.enum_jobs_status DEFAULT 'borrador'::public.enum_jobs_status,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "createdBy" integer
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    "conversationId" integer NOT NULL,
    "senderId" integer NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "attachmentUrl" text,
    "readAt" timestamp with time zone
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    title character varying(255) NOT NULL,
    message text,
    type public.enum_notifications_type DEFAULT 'info'::public.enum_notifications_type,
    "eventType" character varying(255),
    "relatedId" integer,
    "isRead" boolean DEFAULT false,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "readAt" timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    module character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    description text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    technologies character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "projectUrl" character varying(500),
    "liveUrl" character varying(500),
    "thumbnailUrl" character varying(500),
    "startDate" date NOT NULL,
    "endDate" date,
    "isCurrent" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "repositoryUrl" character varying(500)
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: recruiter_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recruiter_requests (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    "position" character varying(255),
    "existingCompanyId" integer,
    "companyName" character varying(255),
    "companyIndustry" character varying(255),
    "companySize" character varying(255),
    "companyLocation" character varying(255),
    "companyWebsite" character varying(255),
    "companyDescription" text,
    "companyLogoPath" character varying(500),
    status public.enum_recruiter_requests_status DEFAULT 'pendiente'::public.enum_recruiter_requests_status NOT NULL,
    "rejectionReason" text,
    "activationToken" character varying(255),
    "tokenExpiresAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.recruiter_requests OWNER TO postgres;

--
-- Name: COLUMN recruiter_requests."position"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.recruiter_requests."position" IS 'Cargo del solicitante en la empresa';


--
-- Name: recruiter_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recruiter_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recruiter_requests_id_seq OWNER TO postgres;

--
-- Name: recruiter_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recruiter_requests_id_seq OWNED BY public.recruiter_requests.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    "roleId" integer NOT NULL,
    "permissionId" integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: saved_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saved_jobs (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "jobId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.saved_jobs OWNER TO postgres;

--
-- Name: saved_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.saved_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.saved_jobs_id_seq OWNER TO postgres;

--
-- Name: saved_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.saved_jobs_id_seq OWNED BY public.saved_jobs.id;


--
-- Name: universities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.universities (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255),
    description text,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.universities OWNER TO postgres;

--
-- Name: universities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.universities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.universities_id_seq OWNER TO postgres;

--
-- Name: universities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.universities_id_seq OWNED BY public.universities.id;


--
-- Name: user_portfolios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_portfolios (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    title character varying(255) NOT NULL,
    url character varying(255) NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    description character varying(200),
    type public.enum_user_portfolios_type DEFAULT 'website'::public.enum_user_portfolios_type
);


ALTER TABLE public.user_portfolios OWNER TO postgres;

--
-- Name: user_portfolios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_portfolios_id_seq OWNER TO postgres;

--
-- Name: user_portfolios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_portfolios_id_seq OWNED BY public.user_portfolios.id;


--
-- Name: user_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_skills (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "skillName" character varying(255) NOT NULL,
    "proficiencyLevel" public."enum_user_skills_proficiencyLevel" DEFAULT 'intermedio'::public."enum_user_skills_proficiencyLevel",
    "yearsExperience" integer DEFAULT 0,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.user_skills OWNER TO postgres;

--
-- Name: user_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_skills_id_seq OWNER TO postgres;

--
-- Name: user_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_skills_id_seq OWNED BY public.user_skills.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    phone character varying(255),
    bio text,
    "linkedinUrl" character varying(255),
    "cvFileId" integer,
    "cvUrl" character varying(255),
    "profilePhotoId" integer,
    "photoUrl" character varying(255),
    "userType" public."enum_users_userType" DEFAULT 'graduate'::public."enum_users_userType" NOT NULL,
    "companyId" integer,
    "isActive" boolean DEFAULT true,
    "availableForWork" boolean DEFAULT true,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "institutionalEmail" character varying(255),
    "facultyId" integer,
    cedula character varying(255),
    "universityId" integer,
    "careerId" integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: work_experiences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_experiences (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    company character varying(255) NOT NULL,
    "position" character varying(255) NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date,
    "isCurrent" boolean DEFAULT false,
    description text,
    achievements text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    location character varying(100)
);


ALTER TABLE public.work_experiences OWNER TO postgres;

--
-- Name: work_experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.work_experiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_experiences_id_seq OWNER TO postgres;

--
-- Name: work_experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.work_experiences_id_seq OWNED BY public.work_experiences.id;


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: careers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers ALTER COLUMN id SET DEFAULT nextval('public.careers_id_seq'::regclass);


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- Name: educations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educations ALTER COLUMN id SET DEFAULT nextval('public.educations_id_seq'::regclass);


--
-- Name: faculties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties ALTER COLUMN id SET DEFAULT nextval('public.faculties_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: interviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews ALTER COLUMN id SET DEFAULT nextval('public.interviews_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: recruiter_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recruiter_requests ALTER COLUMN id SET DEFAULT nextval('public.recruiter_requests_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: saved_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_jobs ALTER COLUMN id SET DEFAULT nextval('public.saved_jobs_id_seq'::regclass);


--
-- Name: universities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities ALTER COLUMN id SET DEFAULT nextval('public.universities_id_seq'::regclass);


--
-- Name: user_portfolios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_portfolios ALTER COLUMN id SET DEFAULT nextval('public.user_portfolios_id_seq'::regclass);


--
-- Name: user_skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills ALTER COLUMN id SET DEFAULT nextval('public.user_skills_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: work_experiences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_experiences ALTER COLUMN id SET DEFAULT nextval('public.work_experiences_id_seq'::regclass);


--
-- Data for Name: UserRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserRoles" ("createdAt", "updatedAt", "userId", "roleId") FROM stdin;
2026-01-01 13:07:06.113-05	2026-01-01 13:07:06.113-05	2	2
2026-01-01 13:07:06.19-05	2026-01-01 13:07:06.19-05	3	2
2026-02-18 14:01:47.984-05	2026-02-18 14:01:47.984-05	1	1
2026-02-20 10:47:27.016-05	2026-02-20 10:47:27.016-05	6	3
2026-02-22 20:27:44.792-05	2026-02-22 20:27:44.793-05	7	2
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, "jobId", "userId", "coverLetter", status, "rejectionReason", "appliedAt", "updatedAt", "createdAt") FROM stdin;
1	2	6	\N	revisado	\N	2026-02-20 12:45:55.123-05	2026-02-20 12:51:48.504-05	2026-02-20 12:45:55.124-05
\.


--
-- Data for Name: careers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.careers (id, name, description, "facultyId", "isActive", "createdAt", "updatedAt") FROM stdin;
1	Ingeniería en Sistemas	Programa de pregrado en Ingeniería en Sistemas	1	t	2026-02-18 14:04:02.002-05	2026-02-18 14:04:02.003-05
2	Ingeniería en Redes y Telecomunicaciones	Programa de pregrado en Ingeniería en Redes	1	t	2026-02-18 14:04:02.064-05	2026-02-18 14:04:02.064-05
3	Tecnología en Informática	Programa de tecnología en Informática	1	t	2026-02-18 14:04:02.07-05	2026-02-18 14:04:02.071-05
4	Administración de Empresas	Programa de pregrado en Administración	2	t	2026-02-18 14:04:02.077-05	2026-02-18 14:04:02.077-05
5	Contabilidad	Programa de pregrado en Contabilidad	2	t	2026-02-18 14:04:02.083-05	2026-02-18 14:04:02.084-05
6	Ingeniería Civil	Programa de pregrado en Ingeniería Civil	3	t	2026-02-18 14:04:02.091-05	2026-02-18 14:04:02.091-05
7	Ingeniería Industrial	Programa de pregrado en Ingeniería Industrial	3	t	2026-02-18 14:04:02.098-05	2026-02-18 14:04:02.098-05
\.


--
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certifications (id, "userId", name, "issuingOrganization", "issueDate", "expirationDate", "credentialId", "credentialUrl", "createdAt", "updatedAt") FROM stdin;
1	4	test	test	2026-01-22	\N	ABC123	https://portal.trabajo.gob.ec/setec-portal-web/pages/legitimidadCertificacion.jsf	2026-01-01 17:18:53.122-05	2026-01-01 17:18:53.122-05
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, description, industry, size, website, location, "logoId", "logoUrl", "recruiterId", "createdAt", "updatedAt", status) FROM stdin;
1	Sorti Tech Solutions	Empresa líder en soluciones tecnológicas y desarrollo de software	Tecnología	\N	https://sorti.tech	Manta, Ecuador	\N	\N	2	2026-01-01 13:07:06.194-05	2026-01-01 13:07:06.195-05	activo
2	ZGames Studio	Desarrollo de videojuegos y aplicaciones interactivas	Tecnología	small	https://zgames.studio	Portoviejo, Ecuador	\N	/uploads/logos/1771811782294-619013841.jpg	3	2026-01-01 13:07:06.201-05	2026-02-22 20:56:22.499-05	activo
3	La Fabril	empresa de productos varios	Otra	large	lafabril.com	Manta, Manabí	\N	/uploads/logos/1772036546783-7992200.png	1	2026-02-23 22:39:00.077-05	2026-02-25 11:22:26.868-05	activo
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, "applicationId", "graduateId", "recruiterId", "createdAt", "updatedAt", "lastMessageAt") FROM stdin;
3	\N	4	5	2026-02-19 17:57:21.468-05	2026-02-19 17:57:33.839-05	2026-02-19 17:57:33.839-05
1	\N	1	5	2026-02-18 19:01:51.658-05	2026-02-20 09:11:35.735-05	2026-02-20 09:11:35.734-05
4	\N	1	4	2026-02-20 09:12:13.601-05	2026-02-20 09:12:13.601-05	\N
6	\N	1	6	2026-02-20 13:30:02.181-05	2026-02-20 13:30:02.181-05	\N
7	\N	2	6	2026-02-23 22:36:36.488-05	2026-02-23 22:37:16.403-05	2026-02-23 22:37:16.402-05
\.


--
-- Data for Name: educations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.educations (id, "userId", institution, degree, "fieldOfStudy", "startDate", "endDate", "graduationYear", gpa, honors, "isCurrent", "createdAt", "updatedAt", "facultyId", "careerId", "degreeType") FROM stdin;
1	4	testeooo	tes	test	2026-02-03	\N	\N	\N	\N	t	2026-01-01 17:22:35.329-05	2026-01-01 17:22:35.329-05	\N	\N	\N
2	1	uleam	TI	Software	2021-12-12	\N	\N	\N	\N	t	2026-02-25 11:23:53.375-05	2026-02-25 11:23:53.375-05	\N	\N	Ingeniería
3	6	uleam	sistemas	software	2021-11-30	\N	\N	\N	\N	t	2026-02-25 11:25:26.586-05	2026-02-25 11:25:26.586-05	\N	\N	Ingeniería
\.


--
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculties (id, name, description, "universityId", "isActive", "createdAt", "updatedAt") FROM stdin;
1	Facultad de Ciencias Informáticas	\N	1	t	2026-01-01 13:07:06.023-05	2026-01-01 13:07:06.023-05
3	Facultad de Ingeniería	\N	1	t	2026-01-01 13:07:06.03-05	2026-01-01 13:07:06.03-05
4	Facultad de Ciencias de la Salud	\N	1	t	2026-01-01 13:07:06.033-05	2026-01-01 13:07:06.033-05
2	Facultad de Ciencias Administrativas	contabilidad	1	t	2026-01-01 13:07:06.027-05	2026-02-23 22:46:15.132-05
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, filename, "originalName", path, mimetype, size, type, "userId", "entityType", "entityId", "createdAt", "updatedAt") FROM stdin;
4	1767302580393-692689449.jpeg	005-2.jpeg	uploads\\photos\\1767302580393-692689449.jpeg	image/jpeg	133412	photo	4	user	4	2026-01-01 16:23:00.559-05	2026-01-01 16:23:00.56-05
5	1767305278790-882623862.pdf	ride_25744355189.pdf	uploads\\cvs\\1767305278790-882623862.pdf	application/pdf	21421	cv	4	user	4	2026-01-01 17:07:58.862-05	2026-01-01 17:07:58.865-05
6	1770044395377-510303903.jpeg	WhatsApp Image 2025-07-29 at 20.14.48.jpeg	uploads\\photos\\1770044395377-510303903.jpeg	image/jpeg	186633	photo	5	user	5	2026-02-02 09:59:55.556-05	2026-02-02 09:59:55.558-05
7	1771811782294-619013841.jpg	armazon-mujer.jpg	uploads\\logos\\1771811782294-619013841.jpg	image/jpeg	33369	logo	1	company	2	2026-02-22 20:56:22.468-05	2026-02-22 20:56:22.47-05
8	1771903711984-456236322.jpeg	jordan.jpeg	uploads\\photos\\1771903711984-456236322.jpeg	image/jpeg	65974	photo	6	user	6	2026-02-23 22:28:32.092-05	2026-02-23 22:28:32.093-05
9	1771903909133-3227018.pdf	manuel hoja de vida.pdf	uploads\\cvs\\1771903909133-3227018.pdf	application/pdf	205089	cv	6	user	6	2026-02-23 22:31:49.36-05	2026-02-23 22:31:49.361-05
10	1772036546783-7992200.png	la fabril.png	uploads\\logos\\1772036546783-7992200.png	image/png	3198	logo	1	company	3	2026-02-25 11:22:26.852-05	2026-02-25 11:22:26.853-05
\.


--
-- Data for Name: interviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interviews (id, "applicationId", "proposedDates", "selectedDate", status, "interviewType", location, "meetingLink", duration, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, title, description, requirements, "jobType", "workMode", location, "salaryMin", "salaryMax", skills, deadline, "publishedAt", "expiresAt", "companyId", status, "createdAt", "updatedAt", "createdBy") FROM stdin;
2	Analista de datos	necesitamos una persona que se encargue del manejo de:\npowerbi\nbases de datos relacionales y no relacionales\nconocimientos en backend	con ganas de aprender	full-time	on-site	manta	800	3000	["proactivo","empatico","comunicativo","chevere"]	2026-02-27 19:00:00-05	2026-02-20 11:29:21.26-05	\N	1	publicado	2026-02-20 11:28:25.413-05	2026-02-20 11:29:21.26-05	\N
1	full stack	este puesto es para personas que manejan backend y frontend con bd	se proactivo y dispuesto a aprender	full-time	remote	Manta, Manabí	1000	4000	["angular","nodejs","mongo","moongose","git"]	2026-03-05 19:00:00-05	2026-01-27 23:29:06.374-05	\N	1	publicado	2026-01-27 22:50:10.005-05	2026-02-23 22:21:36.82-05	\N
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, "conversationId", "senderId", content, "isRead", "createdAt", "updatedAt", "attachmentUrl", "readAt") FROM stdin;
1	3	5	hola soy fabricio con dos 3	f	2026-02-19 17:57:33.744-05	2026-02-19 17:57:33.745-05	\N	\N
2	1	1	hola fabricio	f	2026-02-20 09:11:35.685-05	2026-02-20 09:11:35.686-05	\N	\N
7	7	2	hola me interesó tu perfil de habilidades, te interesa un puesto de desarrollador?	f	2026-02-23 22:37:16.298-05	2026-02-23 22:37:16.298-05	\N	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", title, message, type, "eventType", "relatedId", "isRead", "createdAt", "updatedAt", "readAt") FROM stdin;
1	4	Nuevo mensaje	FABRICIO JOSUE ZAVALA REYES te ha enviado un mensaje	info	new_message	3	f	2026-02-19 17:57:33.843-05	2026-02-19 17:57:33.843-05	\N
2	5	Nuevo mensaje	Fabricio Zavala te ha enviado un mensaje	info	new_message	1	f	2026-02-20 09:11:35.738-05	2026-02-20 09:11:35.738-05	\N
4	6	Nuevo mensaje	Sofía Sorti te ha enviado un mensaje	info	new_message	5	t	2026-02-20 12:46:55.551-05	2026-02-20 12:47:06.208-05	2026-02-20 12:47:06.208-05
6	2	Nuevo mensaje	JORDAN ARMANDO MORAN ZAMBRANO te ha enviado un mensaje	info	new_message	5	t	2026-02-20 12:52:03.586-05	2026-02-20 12:52:10.235-05	2026-02-20 12:52:10.234-05
3	2	Nueva postulación	Tienes una nueva postulación para "Analista de datos"	info	new_application	1	t	2026-02-20 12:45:55.135-05	2026-02-20 12:52:17.114-05	2026-02-20 12:52:17.114-05
7	2	Nuevo mensaje	JORDAN ARMANDO MORAN ZAMBRANO te ha enviado un mensaje	info	new_message	5	t	2026-02-22 23:19:44.429-05	2026-02-22 23:19:49.765-05	2026-02-22 23:19:49.765-05
8	6	Nuevo mensaje	Sofía Sorti te ha enviado un mensaje	info	new_message	5	t	2026-02-22 23:20:02.811-05	2026-02-22 23:20:06.609-05	2026-02-22 23:20:06.609-05
5	6	Actualización de postulación	Tu postulación para "Analista de datos" ha sido revisada	info	application_revisado	1	t	2026-02-20 12:51:48.505-05	2026-02-22 23:20:12.212-05	2026-02-22 23:20:12.212-05
9	6	Nuevo mensaje	Sofía Sorti te ha enviado un mensaje	info	new_message	7	f	2026-02-23 22:37:16.413-05	2026-02-23 22:37:16.413-05	\N
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, module, action, description, "createdAt", "updatedAt") FROM stdin;
1	manage_users	usuarios	gestionar	\N	2026-01-01 13:07:05.886-05	2026-01-01 13:07:05.886-05
2	manage_companies	empresas	gestionar	\N	2026-01-01 13:07:05.891-05	2026-01-01 13:07:05.892-05
4	manage_applications	postulaciones	gestionar	\N	2026-01-01 13:07:05.898-05	2026-01-01 13:07:05.898-05
5	manage_roles	roles	gestionar	\N	2026-01-01 13:07:05.901-05	2026-01-01 13:07:05.901-05
8	manage_faculties	facultades	gestionar	\N	2026-02-22 22:12:04.579516-05	2026-02-22 22:12:04.579516-05
9	manage_careers	carreras	gestionar	\N	2026-02-22 22:12:04.579516-05	2026-02-22 22:12:04.579516-05
10	manage_universities	extensiones	gestionar	\N	2026-02-22 22:12:04.579516-05	2026-02-22 22:12:04.579516-05
11	view_dashboard	dashboard	ver	\N	2026-02-22 22:21:52.412427-05	2026-02-22 22:21:52.412427-05
12	view_job_offers	ofertas	ver	\N	2026-02-22 22:21:52.420571-05	2026-02-22 22:21:52.420571-05
13	view_saved_jobs	favoritos	ver	\N	2026-02-22 22:21:52.421831-05	2026-02-22 22:21:52.421831-05
14	view_graduates	graduados	ver	\N	2026-02-22 22:21:52.422949-05	2026-02-22 22:21:52.422949-05
15	view_messages	mensajes	ver	\N	2026-02-22 22:21:52.424145-05	2026-02-22 22:21:52.424145-05
16	manage_company_recruiters	reclutadores	gestionar	\N	2026-02-22 22:21:52.425495-05	2026-02-22 22:21:52.425495-05
17	manage_recruiter_requests	solicitudes	gestionar	\N	2026-02-22 22:21:52.427444-05	2026-02-22 22:21:52.427444-05
3	manage_jobs	crear_ofertas	gestionar	\N	2026-01-01 13:07:05.895-05	2026-01-01 13:07:05.895-05
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, "userId", name, description, technologies, "projectUrl", "liveUrl", "thumbnailUrl", "startDate", "endDate", "isCurrent", "createdAt", "updatedAt", "repositoryUrl") FROM stdin;
1	4	test	ffgggggggg	{angular}	https://www.sorti.ec/home	\N	\N	2026-01-16	\N	t	2026-01-01 17:36:02.136-05	2026-01-01 17:36:02.136-05	\N
2	6	proyecto tusa	tienda de articulos de pesca deportiva	{"angular,","nodejs,",postgres}	https://tusa.com	\N	\N	2026-01-31	\N	t	2026-02-25 11:45:03.203-05	2026-02-25 11:45:03.203-05	https://github.com/Fabricioz01/Tusa-Mexico
\.


--
-- Data for Name: recruiter_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recruiter_requests (id, "firstName", "lastName", email, phone, "position", "existingCompanyId", "companyName", "companyIndustry", "companySize", "companyLocation", "companyWebsite", "companyDescription", "companyLogoPath", status, "rejectionReason", "activationToken", "tokenExpiresAt", "createdAt", "updatedAt") FROM stdin;
2	irene	reyes	rrosareyes45@gmail.com	0998411681	CIO	2	\N	\N	\N	\N	\N	\N	\N	aprobado	\N	\N	\N	2026-02-22 20:16:21.74-05	2026-02-22 20:30:15.552-05
1	Test	Recruiter	test.recruiter.flow@example.com	0999999999	HR	\N	Empresa QA	technology	small	Manta	\N	\N	\N	rechazado	no me da buena espina\n	\N	\N	2026-02-22 13:02:43.363-05	2026-02-22 20:31:06.951-05
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions ("roleId", "permissionId", "createdAt", "updatedAt") FROM stdin;
1	11	2026-02-22 22:21:52.498993-05	2026-02-22 22:21:52.498993-05
1	12	2026-02-22 22:21:52.501992-05	2026-02-22 22:21:52.501992-05
1	13	2026-02-22 22:21:52.504197-05	2026-02-22 22:21:52.504197-05
1	14	2026-02-22 22:21:52.505925-05	2026-02-22 22:21:52.505925-05
1	15	2026-02-22 22:21:52.507544-05	2026-02-22 22:21:52.507544-05
1	3	2026-02-22 22:21:52.509304-05	2026-02-22 22:21:52.509304-05
1	4	2026-02-22 22:21:52.512624-05	2026-02-22 22:21:52.512624-05
1	2	2026-02-22 22:21:52.515434-05	2026-02-22 22:21:52.515434-05
1	16	2026-02-22 22:21:52.517566-05	2026-02-22 22:21:52.517566-05
1	1	2026-02-22 22:21:52.519153-05	2026-02-22 22:21:52.519153-05
1	17	2026-02-22 22:21:52.521071-05	2026-02-22 22:21:52.521071-05
1	5	2026-02-22 22:21:52.523286-05	2026-02-22 22:21:52.523286-05
1	8	2026-02-22 22:21:52.524711-05	2026-02-22 22:21:52.524711-05
1	9	2026-02-22 22:21:52.525988-05	2026-02-22 22:21:52.525988-05
1	10	2026-02-22 22:21:52.528111-05	2026-02-22 22:21:52.528111-05
3	12	2026-02-22 22:47:16.515-05	2026-02-22 22:47:16.515-05
3	14	2026-02-22 22:47:16.515-05	2026-02-22 22:47:16.515-05
3	15	2026-02-22 22:47:16.515-05	2026-02-22 22:47:16.515-05
3	4	2026-02-22 22:47:16.515-05	2026-02-22 22:47:16.515-05
3	13	2026-02-22 22:47:16.515-05	2026-02-22 22:47:16.515-05
2	11	2026-02-23 22:26:49.724-05	2026-02-23 22:26:49.723-05
2	12	2026-02-23 22:26:49.724-05	2026-02-23 22:26:49.723-05
2	13	2026-02-23 22:26:49.724-05	2026-02-23 22:26:49.723-05
2	14	2026-02-23 22:26:49.724-05	2026-02-23 22:26:49.723-05
2	15	2026-02-23 22:26:49.724-05	2026-02-23 22:26:49.723-05
2	3	2026-02-23 22:26:49.725-05	2026-02-23 22:26:49.723-05
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, "createdAt", "updatedAt") FROM stdin;
1	admin	Administrador del sistema	2026-01-01 13:07:05.861-05	2026-01-01 13:07:05.862-05
2	recruiter	Reclutador de empresa	2026-01-01 13:07:05.876-05	2026-01-01 13:07:05.876-05
3	graduate	Graduado/Alumno	2026-01-01 13:07:05.879-05	2026-01-01 13:07:05.879-05
\.


--
-- Data for Name: saved_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saved_jobs (id, "userId", "jobId", "createdAt", "updatedAt") FROM stdin;
5	1	2	2026-05-17 21:38:11.787-05	2026-05-17 21:38:11.787-05
6	1	1	2026-05-18 10:25:45.058-05	2026-05-18 10:25:45.058-05
\.


--
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.universities (id, name, code, description, "isActive", "createdAt", "updatedAt") FROM stdin;
1	Universidad Laica Eloy Alfaro de Manabí	ULEAM	Universidad pública de Manabí	t	2026-01-01 13:07:06.004-05	2026-01-01 13:07:06.004-05
4	Extensión chone	cn	extension de chone	t	2026-01-01 13:07:06.016-05	2026-02-23 22:47:24.719-05
3	Extension bahia de caraquez	bc	extension de bahia	t	2026-01-01 13:07:06.013-05	2026-02-23 22:48:01.99-05
2	Extensión el carmen	cr	extension del carmen\n	t	2026-01-01 13:07:06.009-05	2026-02-23 22:48:25.864-05
\.


--
-- Data for Name: user_portfolios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_portfolios (id, "userId", title, url, "createdAt", "updatedAt", description, type) FROM stdin;
1	4	testeo	https://portal.trabajo.gob.ec/setec-portal-web/pages/legitimidadCertificacion.jsf	2026-01-01 17:23:43.888-05	2026-01-01 17:23:43.889-05	\N	website
2	4	sdsd	https://portal.trabajo.gob.ec/setec-portal-web/pages/legitimidadCertificacion.jsf	2026-01-01 17:24:53.875-05	2026-01-01 17:24:53.876-05	\N	website
3	6	portafolio web	https://miportafolio.com	2026-02-25 11:43:27.519-05	2026-02-25 11:43:27.52-05	\N	website
\.


--
-- Data for Name: user_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_skills (id, "userId", "skillName", "proficiencyLevel", "yearsExperience", "createdAt", "updatedAt") FROM stdin;
2	4	leer	intermedio	0	2026-01-01 17:26:35.644-05	2026-01-01 17:26:35.644-05
3	4	hablar	intermedio	0	2026-01-01 17:26:44.563-05	2026-01-01 17:26:44.564-05
4	6	angular	intermedio	0	2026-02-25 11:43:01.02-05	2026-02-25 11:43:01.021-05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", phone, bio, "linkedinUrl", "cvFileId", "cvUrl", "profilePhotoId", "photoUrl", "userType", "companyId", "isActive", "availableForWork", "createdAt", "updatedAt", "institutionalEmail", "facultyId", cedula, "universityId", "careerId") FROM stdin;
1	admin@uleam.edu.ec	$2b$10$ZH0vECcSsopfMMlqaMn.RuzakGLuwTnuMRj5EhnGbyF9oKrwhysvO	Administrador	ULEAM				\N	\N	\N	\N	admin	3	t	f	2025-12-10 22:57:39.932-05	2026-02-25 18:22:52.916-05	admin@uleam.edu.ec	\N	\N	\N	\N
3	recruiter@zgames.studio	$2b$10$xgTlnjSjrwu6AOXibRg7W.iUfKtRBZuhHp49SrJ4yg2JVoh2MYoWq	Zoe	Games	\N	\N	\N	\N	\N	\N	\N	recruiter	2	t	t	2026-01-01 13:07:06.118-05	2026-02-25 21:07:49.721-05	\N	\N	\N	\N	\N
4	jony@gmail.com	$2b$10$4srB8jw/C9yD137onXi/nOA74UOMs0YGIujdHDnPSNo2m9fS6kQVm	jonathan	marin	1231231231	testeo	https://www.linkedin.com/in/fabricio-josu%C3%A9-zavala-reyes-42498a270/	\N	/uploads/cvs/1767305278790-882623862.pdf	\N	/uploads/photos/1767302580393-692689449.jpeg	graduate	1	t	t	2026-01-01 15:19:11.628-05	2026-01-01 17:43:15.074-05	e1327392239@live.uleam.edu.ec	\N	\N	\N	\N
5	fabriciozavala133@gmail.com	$2b$10$zCNJy5EZJhPV7w/FRKLrC.OWWNJ.sdaHsyRJdNgCXPQHpqFpwuSyq	FABRICIO JOSUE	ZAVALA REYES				\N	\N	\N	/uploads/photos/1770044395377-510303903.jpeg	graduate	\N	t	f	2026-02-02 00:01:40.198-05	2026-02-19 14:36:05.862-05	e1317392239@live.uleam.edu.ec	1	1317392239	\N	\N
2	recruiter@sorti.tech	$2b$10$g3LVaeWMCjSMgVc3B/HUSub6k1cU1i92H8HWS4bDOSaM3/Yl4K/mS	Sofía	Sorti	\N	\N	\N	\N	\N	\N	\N	recruiter	1	t	t	2026-01-01 13:07:06.038-05	2026-02-20 11:28:20.685-05	\N	\N	\N	\N	\N
7	rrosareyes45@gmail.com	$2b$10$7RfEJb8sy9zZzbnkjNrnTOfjI.0KIVeqQdxV2aDcBHmW0.EA/v74G	irene	reyes	0998411681	\N	\N	\N	\N	\N	\N	recruiter	2	t	t	2026-02-22 20:27:44.29-05	2026-02-22 20:30:15.228-05	\N	\N	\N	\N	\N
6	jordan@gmail.com	$2b$10$y2CxBhS8mIBroPN/ygAJAusAAxFFYC8fT0uzoeVSJiT2AJRIQ.EBO	JORDAN ARMANDO	MORAN ZAMBRANO	0994312472	soy un apasionado estudiante de TI	https://www.linkedin.com/in/jordan-moran-381902218/	\N	/uploads/cvs/1771903909133-3227018.pdf	\N	/uploads/photos/1771903711984-456236322.jpeg	graduate	\N	t	t	2026-02-20 10:47:26.819-05	2026-02-23 22:31:49.476-05	e1316839313@live.uleam.edu.ec	1	1316839313	1	3
\.


--
-- Data for Name: work_experiences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_experiences (id, "userId", company, "position", "startDate", "endDate", "isCurrent", description, achievements, "createdAt", "updatedAt", location) FROM stdin;
1	4	test	testt	2026-01-16	\N	t	gg	{}	2026-01-01 17:15:39.883-05	2026-01-01 17:15:58.757-05	\N
2	6	ULEAM	Docente de electronica	2024-04-12	2025-04-10	f	fui profesor durante mis practicas	{}	2026-02-23 22:32:44.474-05	2026-02-23 22:32:44.474-05	manta
\.


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_id_seq', 1, true);


--
-- Name: careers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.careers_id_seq', 7, true);


--
-- Name: certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certifications_id_seq', 1, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 3, true);


--
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_id_seq', 7, true);


--
-- Name: educations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.educations_id_seq', 3, true);


--
-- Name: faculties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculties_id_seq', 4, true);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_id_seq', 10, true);


--
-- Name: interviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interviews_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 2, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 7, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 9, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 17, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 2, true);


--
-- Name: recruiter_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recruiter_requests_id_seq', 2, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: saved_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.saved_jobs_id_seq', 6, true);


--
-- Name: universities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.universities_id_seq', 4, true);


--
-- Name: user_portfolios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_portfolios_id_seq', 3, true);


--
-- Name: user_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_skills_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: work_experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_experiences_id_seq', 2, true);


--
-- Name: UserRoles UserRoles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoles"
    ADD CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("userId", "roleId");


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: careers careers_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key UNIQUE (name);


--
-- Name: careers careers_name_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key1 UNIQUE (name);


--
-- Name: careers careers_name_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key10 UNIQUE (name);


--
-- Name: careers careers_name_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key11 UNIQUE (name);


--
-- Name: careers careers_name_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key12 UNIQUE (name);


--
-- Name: careers careers_name_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key13 UNIQUE (name);


--
-- Name: careers careers_name_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key14 UNIQUE (name);


--
-- Name: careers careers_name_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key15 UNIQUE (name);


--
-- Name: careers careers_name_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key16 UNIQUE (name);


--
-- Name: careers careers_name_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key17 UNIQUE (name);


--
-- Name: careers careers_name_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key18 UNIQUE (name);


--
-- Name: careers careers_name_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key19 UNIQUE (name);


--
-- Name: careers careers_name_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key2 UNIQUE (name);


--
-- Name: careers careers_name_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key20 UNIQUE (name);


--
-- Name: careers careers_name_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key21 UNIQUE (name);


--
-- Name: careers careers_name_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key22 UNIQUE (name);


--
-- Name: careers careers_name_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key23 UNIQUE (name);


--
-- Name: careers careers_name_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key24 UNIQUE (name);


--
-- Name: careers careers_name_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key25 UNIQUE (name);


--
-- Name: careers careers_name_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key26 UNIQUE (name);


--
-- Name: careers careers_name_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key27 UNIQUE (name);


--
-- Name: careers careers_name_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key28 UNIQUE (name);


--
-- Name: careers careers_name_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key29 UNIQUE (name);


--
-- Name: careers careers_name_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key3 UNIQUE (name);


--
-- Name: careers careers_name_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key30 UNIQUE (name);


--
-- Name: careers careers_name_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key31 UNIQUE (name);


--
-- Name: careers careers_name_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key32 UNIQUE (name);


--
-- Name: careers careers_name_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key33 UNIQUE (name);


--
-- Name: careers careers_name_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key34 UNIQUE (name);


--
-- Name: careers careers_name_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key35 UNIQUE (name);


--
-- Name: careers careers_name_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key36 UNIQUE (name);


--
-- Name: careers careers_name_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key37 UNIQUE (name);


--
-- Name: careers careers_name_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key38 UNIQUE (name);


--
-- Name: careers careers_name_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key39 UNIQUE (name);


--
-- Name: careers careers_name_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key4 UNIQUE (name);


--
-- Name: careers careers_name_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key40 UNIQUE (name);


--
-- Name: careers careers_name_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key41 UNIQUE (name);


--
-- Name: careers careers_name_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key42 UNIQUE (name);


--
-- Name: careers careers_name_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key43 UNIQUE (name);


--
-- Name: careers careers_name_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key44 UNIQUE (name);


--
-- Name: careers careers_name_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key45 UNIQUE (name);


--
-- Name: careers careers_name_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key46 UNIQUE (name);


--
-- Name: careers careers_name_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key47 UNIQUE (name);


--
-- Name: careers careers_name_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key48 UNIQUE (name);


--
-- Name: careers careers_name_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key49 UNIQUE (name);


--
-- Name: careers careers_name_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key5 UNIQUE (name);


--
-- Name: careers careers_name_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key50 UNIQUE (name);


--
-- Name: careers careers_name_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key51 UNIQUE (name);


--
-- Name: careers careers_name_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key52 UNIQUE (name);


--
-- Name: careers careers_name_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key53 UNIQUE (name);


--
-- Name: careers careers_name_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key54 UNIQUE (name);


--
-- Name: careers careers_name_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key55 UNIQUE (name);


--
-- Name: careers careers_name_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key56 UNIQUE (name);


--
-- Name: careers careers_name_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key57 UNIQUE (name);


--
-- Name: careers careers_name_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key58 UNIQUE (name);


--
-- Name: careers careers_name_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key59 UNIQUE (name);


--
-- Name: careers careers_name_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key6 UNIQUE (name);


--
-- Name: careers careers_name_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key60 UNIQUE (name);


--
-- Name: careers careers_name_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key61 UNIQUE (name);


--
-- Name: careers careers_name_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key62 UNIQUE (name);


--
-- Name: careers careers_name_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key63 UNIQUE (name);


--
-- Name: careers careers_name_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key64 UNIQUE (name);


--
-- Name: careers careers_name_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key65 UNIQUE (name);


--
-- Name: careers careers_name_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key66 UNIQUE (name);


--
-- Name: careers careers_name_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key67 UNIQUE (name);


--
-- Name: careers careers_name_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key68 UNIQUE (name);


--
-- Name: careers careers_name_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key69 UNIQUE (name);


--
-- Name: careers careers_name_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key7 UNIQUE (name);


--
-- Name: careers careers_name_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key70 UNIQUE (name);


--
-- Name: careers careers_name_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key71 UNIQUE (name);


--
-- Name: careers careers_name_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key72 UNIQUE (name);


--
-- Name: careers careers_name_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key73 UNIQUE (name);


--
-- Name: careers careers_name_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key74 UNIQUE (name);


--
-- Name: careers careers_name_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key75 UNIQUE (name);


--
-- Name: careers careers_name_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key76 UNIQUE (name);


--
-- Name: careers careers_name_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key77 UNIQUE (name);


--
-- Name: careers careers_name_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key8 UNIQUE (name);


--
-- Name: careers careers_name_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_name_key9 UNIQUE (name);


--
-- Name: careers careers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: companies companies_recruiterId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "companies_recruiterId_key" UNIQUE ("recruiterId");


--
-- Name: conversations conversations_applicationId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "conversations_applicationId_key" UNIQUE ("applicationId");


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: educations educations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_pkey PRIMARY KEY (id);


--
-- Name: faculties faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: interviews interviews_applicationId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT "interviews_applicationId_key" UNIQUE ("applicationId");


--
-- Name: interviews interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_name_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key1 UNIQUE (name);


--
-- Name: permissions permissions_name_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key10 UNIQUE (name);


--
-- Name: permissions permissions_name_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key100 UNIQUE (name);


--
-- Name: permissions permissions_name_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key101 UNIQUE (name);


--
-- Name: permissions permissions_name_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key102 UNIQUE (name);


--
-- Name: permissions permissions_name_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key103 UNIQUE (name);


--
-- Name: permissions permissions_name_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key104 UNIQUE (name);


--
-- Name: permissions permissions_name_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key105 UNIQUE (name);


--
-- Name: permissions permissions_name_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key106 UNIQUE (name);


--
-- Name: permissions permissions_name_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key107 UNIQUE (name);


--
-- Name: permissions permissions_name_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key108 UNIQUE (name);


--
-- Name: permissions permissions_name_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key109 UNIQUE (name);


--
-- Name: permissions permissions_name_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key11 UNIQUE (name);


--
-- Name: permissions permissions_name_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key110 UNIQUE (name);


--
-- Name: permissions permissions_name_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key111 UNIQUE (name);


--
-- Name: permissions permissions_name_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key112 UNIQUE (name);


--
-- Name: permissions permissions_name_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key113 UNIQUE (name);


--
-- Name: permissions permissions_name_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key114 UNIQUE (name);


--
-- Name: permissions permissions_name_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key115 UNIQUE (name);


--
-- Name: permissions permissions_name_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key116 UNIQUE (name);


--
-- Name: permissions permissions_name_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key117 UNIQUE (name);


--
-- Name: permissions permissions_name_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key118 UNIQUE (name);


--
-- Name: permissions permissions_name_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key119 UNIQUE (name);


--
-- Name: permissions permissions_name_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key12 UNIQUE (name);


--
-- Name: permissions permissions_name_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key120 UNIQUE (name);


--
-- Name: permissions permissions_name_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key121 UNIQUE (name);


--
-- Name: permissions permissions_name_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key122 UNIQUE (name);


--
-- Name: permissions permissions_name_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key123 UNIQUE (name);


--
-- Name: permissions permissions_name_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key124 UNIQUE (name);


--
-- Name: permissions permissions_name_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key125 UNIQUE (name);


--
-- Name: permissions permissions_name_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key126 UNIQUE (name);


--
-- Name: permissions permissions_name_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key127 UNIQUE (name);


--
-- Name: permissions permissions_name_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key128 UNIQUE (name);


--
-- Name: permissions permissions_name_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key129 UNIQUE (name);


--
-- Name: permissions permissions_name_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key13 UNIQUE (name);


--
-- Name: permissions permissions_name_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key130 UNIQUE (name);


--
-- Name: permissions permissions_name_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key131 UNIQUE (name);


--
-- Name: permissions permissions_name_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key132 UNIQUE (name);


--
-- Name: permissions permissions_name_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key133 UNIQUE (name);


--
-- Name: permissions permissions_name_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key134 UNIQUE (name);


--
-- Name: permissions permissions_name_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key135 UNIQUE (name);


--
-- Name: permissions permissions_name_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key136 UNIQUE (name);


--
-- Name: permissions permissions_name_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key14 UNIQUE (name);


--
-- Name: permissions permissions_name_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key15 UNIQUE (name);


--
-- Name: permissions permissions_name_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key16 UNIQUE (name);


--
-- Name: permissions permissions_name_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key17 UNIQUE (name);


--
-- Name: permissions permissions_name_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key18 UNIQUE (name);


--
-- Name: permissions permissions_name_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key19 UNIQUE (name);


--
-- Name: permissions permissions_name_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key2 UNIQUE (name);


--
-- Name: permissions permissions_name_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key20 UNIQUE (name);


--
-- Name: permissions permissions_name_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key21 UNIQUE (name);


--
-- Name: permissions permissions_name_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key22 UNIQUE (name);


--
-- Name: permissions permissions_name_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key23 UNIQUE (name);


--
-- Name: permissions permissions_name_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key24 UNIQUE (name);


--
-- Name: permissions permissions_name_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key25 UNIQUE (name);


--
-- Name: permissions permissions_name_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key26 UNIQUE (name);


--
-- Name: permissions permissions_name_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key27 UNIQUE (name);


--
-- Name: permissions permissions_name_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key28 UNIQUE (name);


--
-- Name: permissions permissions_name_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key29 UNIQUE (name);


--
-- Name: permissions permissions_name_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key3 UNIQUE (name);


--
-- Name: permissions permissions_name_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key30 UNIQUE (name);


--
-- Name: permissions permissions_name_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key31 UNIQUE (name);


--
-- Name: permissions permissions_name_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key32 UNIQUE (name);


--
-- Name: permissions permissions_name_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key33 UNIQUE (name);


--
-- Name: permissions permissions_name_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key34 UNIQUE (name);


--
-- Name: permissions permissions_name_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key35 UNIQUE (name);


--
-- Name: permissions permissions_name_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key36 UNIQUE (name);


--
-- Name: permissions permissions_name_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key37 UNIQUE (name);


--
-- Name: permissions permissions_name_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key38 UNIQUE (name);


--
-- Name: permissions permissions_name_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key39 UNIQUE (name);


--
-- Name: permissions permissions_name_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key4 UNIQUE (name);


--
-- Name: permissions permissions_name_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key40 UNIQUE (name);


--
-- Name: permissions permissions_name_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key41 UNIQUE (name);


--
-- Name: permissions permissions_name_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key42 UNIQUE (name);


--
-- Name: permissions permissions_name_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key43 UNIQUE (name);


--
-- Name: permissions permissions_name_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key44 UNIQUE (name);


--
-- Name: permissions permissions_name_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key45 UNIQUE (name);


--
-- Name: permissions permissions_name_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key46 UNIQUE (name);


--
-- Name: permissions permissions_name_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key47 UNIQUE (name);


--
-- Name: permissions permissions_name_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key48 UNIQUE (name);


--
-- Name: permissions permissions_name_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key49 UNIQUE (name);


--
-- Name: permissions permissions_name_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key5 UNIQUE (name);


--
-- Name: permissions permissions_name_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key50 UNIQUE (name);


--
-- Name: permissions permissions_name_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key51 UNIQUE (name);


--
-- Name: permissions permissions_name_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key52 UNIQUE (name);


--
-- Name: permissions permissions_name_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key53 UNIQUE (name);


--
-- Name: permissions permissions_name_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key54 UNIQUE (name);


--
-- Name: permissions permissions_name_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key55 UNIQUE (name);


--
-- Name: permissions permissions_name_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key56 UNIQUE (name);


--
-- Name: permissions permissions_name_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key57 UNIQUE (name);


--
-- Name: permissions permissions_name_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key58 UNIQUE (name);


--
-- Name: permissions permissions_name_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key59 UNIQUE (name);


--
-- Name: permissions permissions_name_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key6 UNIQUE (name);


--
-- Name: permissions permissions_name_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key60 UNIQUE (name);


--
-- Name: permissions permissions_name_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key61 UNIQUE (name);


--
-- Name: permissions permissions_name_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key62 UNIQUE (name);


--
-- Name: permissions permissions_name_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key63 UNIQUE (name);


--
-- Name: permissions permissions_name_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key64 UNIQUE (name);


--
-- Name: permissions permissions_name_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key65 UNIQUE (name);


--
-- Name: permissions permissions_name_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key66 UNIQUE (name);


--
-- Name: permissions permissions_name_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key67 UNIQUE (name);


--
-- Name: permissions permissions_name_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key68 UNIQUE (name);


--
-- Name: permissions permissions_name_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key69 UNIQUE (name);


--
-- Name: permissions permissions_name_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key7 UNIQUE (name);


--
-- Name: permissions permissions_name_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key70 UNIQUE (name);


--
-- Name: permissions permissions_name_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key71 UNIQUE (name);


--
-- Name: permissions permissions_name_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key72 UNIQUE (name);


--
-- Name: permissions permissions_name_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key73 UNIQUE (name);


--
-- Name: permissions permissions_name_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key74 UNIQUE (name);


--
-- Name: permissions permissions_name_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key75 UNIQUE (name);


--
-- Name: permissions permissions_name_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key76 UNIQUE (name);


--
-- Name: permissions permissions_name_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key77 UNIQUE (name);


--
-- Name: permissions permissions_name_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key78 UNIQUE (name);


--
-- Name: permissions permissions_name_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key79 UNIQUE (name);


--
-- Name: permissions permissions_name_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key8 UNIQUE (name);


--
-- Name: permissions permissions_name_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key80 UNIQUE (name);


--
-- Name: permissions permissions_name_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key81 UNIQUE (name);


--
-- Name: permissions permissions_name_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key82 UNIQUE (name);


--
-- Name: permissions permissions_name_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key83 UNIQUE (name);


--
-- Name: permissions permissions_name_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key84 UNIQUE (name);


--
-- Name: permissions permissions_name_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key85 UNIQUE (name);


--
-- Name: permissions permissions_name_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key86 UNIQUE (name);


--
-- Name: permissions permissions_name_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key87 UNIQUE (name);


--
-- Name: permissions permissions_name_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key88 UNIQUE (name);


--
-- Name: permissions permissions_name_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key89 UNIQUE (name);


--
-- Name: permissions permissions_name_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key9 UNIQUE (name);


--
-- Name: permissions permissions_name_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key90 UNIQUE (name);


--
-- Name: permissions permissions_name_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key91 UNIQUE (name);


--
-- Name: permissions permissions_name_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key92 UNIQUE (name);


--
-- Name: permissions permissions_name_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key93 UNIQUE (name);


--
-- Name: permissions permissions_name_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key94 UNIQUE (name);


--
-- Name: permissions permissions_name_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key95 UNIQUE (name);


--
-- Name: permissions permissions_name_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key96 UNIQUE (name);


--
-- Name: permissions permissions_name_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key97 UNIQUE (name);


--
-- Name: permissions permissions_name_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key98 UNIQUE (name);


--
-- Name: permissions permissions_name_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key99 UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: recruiter_requests recruiter_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recruiter_requests
    ADD CONSTRAINT recruiter_requests_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY ("roleId", "permissionId");


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_name_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key1 UNIQUE (name);


--
-- Name: roles roles_name_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key10 UNIQUE (name);


--
-- Name: roles roles_name_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key100 UNIQUE (name);


--
-- Name: roles roles_name_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key101 UNIQUE (name);


--
-- Name: roles roles_name_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key102 UNIQUE (name);


--
-- Name: roles roles_name_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key103 UNIQUE (name);


--
-- Name: roles roles_name_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key104 UNIQUE (name);


--
-- Name: roles roles_name_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key105 UNIQUE (name);


--
-- Name: roles roles_name_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key106 UNIQUE (name);


--
-- Name: roles roles_name_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key107 UNIQUE (name);


--
-- Name: roles roles_name_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key108 UNIQUE (name);


--
-- Name: roles roles_name_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key109 UNIQUE (name);


--
-- Name: roles roles_name_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key11 UNIQUE (name);


--
-- Name: roles roles_name_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key110 UNIQUE (name);


--
-- Name: roles roles_name_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key111 UNIQUE (name);


--
-- Name: roles roles_name_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key112 UNIQUE (name);


--
-- Name: roles roles_name_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key113 UNIQUE (name);


--
-- Name: roles roles_name_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key114 UNIQUE (name);


--
-- Name: roles roles_name_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key115 UNIQUE (name);


--
-- Name: roles roles_name_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key116 UNIQUE (name);


--
-- Name: roles roles_name_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key117 UNIQUE (name);


--
-- Name: roles roles_name_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key118 UNIQUE (name);


--
-- Name: roles roles_name_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key119 UNIQUE (name);


--
-- Name: roles roles_name_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key12 UNIQUE (name);


--
-- Name: roles roles_name_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key120 UNIQUE (name);


--
-- Name: roles roles_name_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key121 UNIQUE (name);


--
-- Name: roles roles_name_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key122 UNIQUE (name);


--
-- Name: roles roles_name_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key123 UNIQUE (name);


--
-- Name: roles roles_name_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key124 UNIQUE (name);


--
-- Name: roles roles_name_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key125 UNIQUE (name);


--
-- Name: roles roles_name_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key126 UNIQUE (name);


--
-- Name: roles roles_name_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key127 UNIQUE (name);


--
-- Name: roles roles_name_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key128 UNIQUE (name);


--
-- Name: roles roles_name_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key129 UNIQUE (name);


--
-- Name: roles roles_name_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key13 UNIQUE (name);


--
-- Name: roles roles_name_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key130 UNIQUE (name);


--
-- Name: roles roles_name_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key131 UNIQUE (name);


--
-- Name: roles roles_name_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key132 UNIQUE (name);


--
-- Name: roles roles_name_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key133 UNIQUE (name);


--
-- Name: roles roles_name_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key134 UNIQUE (name);


--
-- Name: roles roles_name_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key135 UNIQUE (name);


--
-- Name: roles roles_name_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key136 UNIQUE (name);


--
-- Name: roles roles_name_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key14 UNIQUE (name);


--
-- Name: roles roles_name_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key15 UNIQUE (name);


--
-- Name: roles roles_name_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key16 UNIQUE (name);


--
-- Name: roles roles_name_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key17 UNIQUE (name);


--
-- Name: roles roles_name_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key18 UNIQUE (name);


--
-- Name: roles roles_name_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key19 UNIQUE (name);


--
-- Name: roles roles_name_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key2 UNIQUE (name);


--
-- Name: roles roles_name_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key20 UNIQUE (name);


--
-- Name: roles roles_name_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key21 UNIQUE (name);


--
-- Name: roles roles_name_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key22 UNIQUE (name);


--
-- Name: roles roles_name_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key23 UNIQUE (name);


--
-- Name: roles roles_name_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key24 UNIQUE (name);


--
-- Name: roles roles_name_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key25 UNIQUE (name);


--
-- Name: roles roles_name_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key26 UNIQUE (name);


--
-- Name: roles roles_name_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key27 UNIQUE (name);


--
-- Name: roles roles_name_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key28 UNIQUE (name);


--
-- Name: roles roles_name_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key29 UNIQUE (name);


--
-- Name: roles roles_name_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key3 UNIQUE (name);


--
-- Name: roles roles_name_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key30 UNIQUE (name);


--
-- Name: roles roles_name_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key31 UNIQUE (name);


--
-- Name: roles roles_name_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key32 UNIQUE (name);


--
-- Name: roles roles_name_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key33 UNIQUE (name);


--
-- Name: roles roles_name_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key34 UNIQUE (name);


--
-- Name: roles roles_name_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key35 UNIQUE (name);


--
-- Name: roles roles_name_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key36 UNIQUE (name);


--
-- Name: roles roles_name_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key37 UNIQUE (name);


--
-- Name: roles roles_name_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key38 UNIQUE (name);


--
-- Name: roles roles_name_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key39 UNIQUE (name);


--
-- Name: roles roles_name_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key4 UNIQUE (name);


--
-- Name: roles roles_name_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key40 UNIQUE (name);


--
-- Name: roles roles_name_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key41 UNIQUE (name);


--
-- Name: roles roles_name_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key42 UNIQUE (name);


--
-- Name: roles roles_name_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key43 UNIQUE (name);


--
-- Name: roles roles_name_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key44 UNIQUE (name);


--
-- Name: roles roles_name_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key45 UNIQUE (name);


--
-- Name: roles roles_name_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key46 UNIQUE (name);


--
-- Name: roles roles_name_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key47 UNIQUE (name);


--
-- Name: roles roles_name_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key48 UNIQUE (name);


--
-- Name: roles roles_name_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key49 UNIQUE (name);


--
-- Name: roles roles_name_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key5 UNIQUE (name);


--
-- Name: roles roles_name_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key50 UNIQUE (name);


--
-- Name: roles roles_name_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key51 UNIQUE (name);


--
-- Name: roles roles_name_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key52 UNIQUE (name);


--
-- Name: roles roles_name_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key53 UNIQUE (name);


--
-- Name: roles roles_name_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key54 UNIQUE (name);


--
-- Name: roles roles_name_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key55 UNIQUE (name);


--
-- Name: roles roles_name_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key56 UNIQUE (name);


--
-- Name: roles roles_name_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key57 UNIQUE (name);


--
-- Name: roles roles_name_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key58 UNIQUE (name);


--
-- Name: roles roles_name_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key59 UNIQUE (name);


--
-- Name: roles roles_name_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key6 UNIQUE (name);


--
-- Name: roles roles_name_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key60 UNIQUE (name);


--
-- Name: roles roles_name_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key61 UNIQUE (name);


--
-- Name: roles roles_name_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key62 UNIQUE (name);


--
-- Name: roles roles_name_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key63 UNIQUE (name);


--
-- Name: roles roles_name_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key64 UNIQUE (name);


--
-- Name: roles roles_name_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key65 UNIQUE (name);


--
-- Name: roles roles_name_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key66 UNIQUE (name);


--
-- Name: roles roles_name_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key67 UNIQUE (name);


--
-- Name: roles roles_name_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key68 UNIQUE (name);


--
-- Name: roles roles_name_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key69 UNIQUE (name);


--
-- Name: roles roles_name_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key7 UNIQUE (name);


--
-- Name: roles roles_name_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key70 UNIQUE (name);


--
-- Name: roles roles_name_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key71 UNIQUE (name);


--
-- Name: roles roles_name_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key72 UNIQUE (name);


--
-- Name: roles roles_name_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key73 UNIQUE (name);


--
-- Name: roles roles_name_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key74 UNIQUE (name);


--
-- Name: roles roles_name_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key75 UNIQUE (name);


--
-- Name: roles roles_name_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key76 UNIQUE (name);


--
-- Name: roles roles_name_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key77 UNIQUE (name);


--
-- Name: roles roles_name_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key78 UNIQUE (name);


--
-- Name: roles roles_name_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key79 UNIQUE (name);


--
-- Name: roles roles_name_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key8 UNIQUE (name);


--
-- Name: roles roles_name_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key80 UNIQUE (name);


--
-- Name: roles roles_name_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key81 UNIQUE (name);


--
-- Name: roles roles_name_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key82 UNIQUE (name);


--
-- Name: roles roles_name_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key83 UNIQUE (name);


--
-- Name: roles roles_name_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key84 UNIQUE (name);


--
-- Name: roles roles_name_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key85 UNIQUE (name);


--
-- Name: roles roles_name_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key86 UNIQUE (name);


--
-- Name: roles roles_name_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key87 UNIQUE (name);


--
-- Name: roles roles_name_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key88 UNIQUE (name);


--
-- Name: roles roles_name_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key89 UNIQUE (name);


--
-- Name: roles roles_name_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key9 UNIQUE (name);


--
-- Name: roles roles_name_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key90 UNIQUE (name);


--
-- Name: roles roles_name_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key91 UNIQUE (name);


--
-- Name: roles roles_name_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key92 UNIQUE (name);


--
-- Name: roles roles_name_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key93 UNIQUE (name);


--
-- Name: roles roles_name_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key94 UNIQUE (name);


--
-- Name: roles roles_name_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key95 UNIQUE (name);


--
-- Name: roles roles_name_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key96 UNIQUE (name);


--
-- Name: roles roles_name_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key97 UNIQUE (name);


--
-- Name: roles roles_name_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key98 UNIQUE (name);


--
-- Name: roles roles_name_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key99 UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: saved_jobs saved_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_jobs
    ADD CONSTRAINT saved_jobs_pkey PRIMARY KEY (id);


--
-- Name: universities universities_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key UNIQUE (code);


--
-- Name: universities universities_code_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key1 UNIQUE (code);


--
-- Name: universities universities_code_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key10 UNIQUE (code);


--
-- Name: universities universities_code_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key100 UNIQUE (code);


--
-- Name: universities universities_code_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key101 UNIQUE (code);


--
-- Name: universities universities_code_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key102 UNIQUE (code);


--
-- Name: universities universities_code_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key103 UNIQUE (code);


--
-- Name: universities universities_code_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key104 UNIQUE (code);


--
-- Name: universities universities_code_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key105 UNIQUE (code);


--
-- Name: universities universities_code_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key106 UNIQUE (code);


--
-- Name: universities universities_code_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key107 UNIQUE (code);


--
-- Name: universities universities_code_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key108 UNIQUE (code);


--
-- Name: universities universities_code_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key109 UNIQUE (code);


--
-- Name: universities universities_code_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key11 UNIQUE (code);


--
-- Name: universities universities_code_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key110 UNIQUE (code);


--
-- Name: universities universities_code_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key111 UNIQUE (code);


--
-- Name: universities universities_code_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key112 UNIQUE (code);


--
-- Name: universities universities_code_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key113 UNIQUE (code);


--
-- Name: universities universities_code_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key114 UNIQUE (code);


--
-- Name: universities universities_code_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key115 UNIQUE (code);


--
-- Name: universities universities_code_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key116 UNIQUE (code);


--
-- Name: universities universities_code_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key117 UNIQUE (code);


--
-- Name: universities universities_code_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key118 UNIQUE (code);


--
-- Name: universities universities_code_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key119 UNIQUE (code);


--
-- Name: universities universities_code_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key12 UNIQUE (code);


--
-- Name: universities universities_code_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key120 UNIQUE (code);


--
-- Name: universities universities_code_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key121 UNIQUE (code);


--
-- Name: universities universities_code_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key122 UNIQUE (code);


--
-- Name: universities universities_code_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key123 UNIQUE (code);


--
-- Name: universities universities_code_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key124 UNIQUE (code);


--
-- Name: universities universities_code_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key125 UNIQUE (code);


--
-- Name: universities universities_code_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key126 UNIQUE (code);


--
-- Name: universities universities_code_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key127 UNIQUE (code);


--
-- Name: universities universities_code_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key128 UNIQUE (code);


--
-- Name: universities universities_code_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key129 UNIQUE (code);


--
-- Name: universities universities_code_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key13 UNIQUE (code);


--
-- Name: universities universities_code_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key130 UNIQUE (code);


--
-- Name: universities universities_code_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key131 UNIQUE (code);


--
-- Name: universities universities_code_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key132 UNIQUE (code);


--
-- Name: universities universities_code_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key133 UNIQUE (code);


--
-- Name: universities universities_code_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key134 UNIQUE (code);


--
-- Name: universities universities_code_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key135 UNIQUE (code);


--
-- Name: universities universities_code_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key14 UNIQUE (code);


--
-- Name: universities universities_code_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key15 UNIQUE (code);


--
-- Name: universities universities_code_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key16 UNIQUE (code);


--
-- Name: universities universities_code_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key17 UNIQUE (code);


--
-- Name: universities universities_code_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key18 UNIQUE (code);


--
-- Name: universities universities_code_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key19 UNIQUE (code);


--
-- Name: universities universities_code_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key2 UNIQUE (code);


--
-- Name: universities universities_code_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key20 UNIQUE (code);


--
-- Name: universities universities_code_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key21 UNIQUE (code);


--
-- Name: universities universities_code_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key22 UNIQUE (code);


--
-- Name: universities universities_code_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key23 UNIQUE (code);


--
-- Name: universities universities_code_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key24 UNIQUE (code);


--
-- Name: universities universities_code_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key25 UNIQUE (code);


--
-- Name: universities universities_code_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key26 UNIQUE (code);


--
-- Name: universities universities_code_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key27 UNIQUE (code);


--
-- Name: universities universities_code_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key28 UNIQUE (code);


--
-- Name: universities universities_code_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key29 UNIQUE (code);


--
-- Name: universities universities_code_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key3 UNIQUE (code);


--
-- Name: universities universities_code_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key30 UNIQUE (code);


--
-- Name: universities universities_code_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key31 UNIQUE (code);


--
-- Name: universities universities_code_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key32 UNIQUE (code);


--
-- Name: universities universities_code_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key33 UNIQUE (code);


--
-- Name: universities universities_code_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key34 UNIQUE (code);


--
-- Name: universities universities_code_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key35 UNIQUE (code);


--
-- Name: universities universities_code_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key36 UNIQUE (code);


--
-- Name: universities universities_code_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key37 UNIQUE (code);


--
-- Name: universities universities_code_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key38 UNIQUE (code);


--
-- Name: universities universities_code_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key39 UNIQUE (code);


--
-- Name: universities universities_code_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key4 UNIQUE (code);


--
-- Name: universities universities_code_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key40 UNIQUE (code);


--
-- Name: universities universities_code_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key41 UNIQUE (code);


--
-- Name: universities universities_code_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key42 UNIQUE (code);


--
-- Name: universities universities_code_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key43 UNIQUE (code);


--
-- Name: universities universities_code_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key44 UNIQUE (code);


--
-- Name: universities universities_code_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key45 UNIQUE (code);


--
-- Name: universities universities_code_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key46 UNIQUE (code);


--
-- Name: universities universities_code_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key47 UNIQUE (code);


--
-- Name: universities universities_code_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key48 UNIQUE (code);


--
-- Name: universities universities_code_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key49 UNIQUE (code);


--
-- Name: universities universities_code_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key5 UNIQUE (code);


--
-- Name: universities universities_code_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key50 UNIQUE (code);


--
-- Name: universities universities_code_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key51 UNIQUE (code);


--
-- Name: universities universities_code_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key52 UNIQUE (code);


--
-- Name: universities universities_code_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key53 UNIQUE (code);


--
-- Name: universities universities_code_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key54 UNIQUE (code);


--
-- Name: universities universities_code_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key55 UNIQUE (code);


--
-- Name: universities universities_code_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key56 UNIQUE (code);


--
-- Name: universities universities_code_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key57 UNIQUE (code);


--
-- Name: universities universities_code_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key58 UNIQUE (code);


--
-- Name: universities universities_code_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key59 UNIQUE (code);


--
-- Name: universities universities_code_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key6 UNIQUE (code);


--
-- Name: universities universities_code_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key60 UNIQUE (code);


--
-- Name: universities universities_code_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key61 UNIQUE (code);


--
-- Name: universities universities_code_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key62 UNIQUE (code);


--
-- Name: universities universities_code_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key63 UNIQUE (code);


--
-- Name: universities universities_code_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key64 UNIQUE (code);


--
-- Name: universities universities_code_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key65 UNIQUE (code);


--
-- Name: universities universities_code_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key66 UNIQUE (code);


--
-- Name: universities universities_code_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key67 UNIQUE (code);


--
-- Name: universities universities_code_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key68 UNIQUE (code);


--
-- Name: universities universities_code_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key69 UNIQUE (code);


--
-- Name: universities universities_code_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key7 UNIQUE (code);


--
-- Name: universities universities_code_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key70 UNIQUE (code);


--
-- Name: universities universities_code_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key71 UNIQUE (code);


--
-- Name: universities universities_code_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key72 UNIQUE (code);


--
-- Name: universities universities_code_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key73 UNIQUE (code);


--
-- Name: universities universities_code_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key74 UNIQUE (code);


--
-- Name: universities universities_code_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key75 UNIQUE (code);


--
-- Name: universities universities_code_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key76 UNIQUE (code);


--
-- Name: universities universities_code_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key77 UNIQUE (code);


--
-- Name: universities universities_code_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key78 UNIQUE (code);


--
-- Name: universities universities_code_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key79 UNIQUE (code);


--
-- Name: universities universities_code_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key8 UNIQUE (code);


--
-- Name: universities universities_code_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key80 UNIQUE (code);


--
-- Name: universities universities_code_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key81 UNIQUE (code);


--
-- Name: universities universities_code_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key82 UNIQUE (code);


--
-- Name: universities universities_code_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key83 UNIQUE (code);


--
-- Name: universities universities_code_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key84 UNIQUE (code);


--
-- Name: universities universities_code_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key85 UNIQUE (code);


--
-- Name: universities universities_code_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key86 UNIQUE (code);


--
-- Name: universities universities_code_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key87 UNIQUE (code);


--
-- Name: universities universities_code_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key88 UNIQUE (code);


--
-- Name: universities universities_code_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key89 UNIQUE (code);


--
-- Name: universities universities_code_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key9 UNIQUE (code);


--
-- Name: universities universities_code_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key90 UNIQUE (code);


--
-- Name: universities universities_code_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key91 UNIQUE (code);


--
-- Name: universities universities_code_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key92 UNIQUE (code);


--
-- Name: universities universities_code_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key93 UNIQUE (code);


--
-- Name: universities universities_code_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key94 UNIQUE (code);


--
-- Name: universities universities_code_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key95 UNIQUE (code);


--
-- Name: universities universities_code_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key96 UNIQUE (code);


--
-- Name: universities universities_code_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key97 UNIQUE (code);


--
-- Name: universities universities_code_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key98 UNIQUE (code);


--
-- Name: universities universities_code_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_code_key99 UNIQUE (code);


--
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (id);


--
-- Name: user_portfolios user_portfolios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_portfolios
    ADD CONSTRAINT user_portfolios_pkey PRIMARY KEY (id);


--
-- Name: user_skills user_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key100 UNIQUE (email);


--
-- Name: users users_email_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key101 UNIQUE (email);


--
-- Name: users users_email_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key102 UNIQUE (email);


--
-- Name: users users_email_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key103 UNIQUE (email);


--
-- Name: users users_email_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key104 UNIQUE (email);


--
-- Name: users users_email_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key105 UNIQUE (email);


--
-- Name: users users_email_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key106 UNIQUE (email);


--
-- Name: users users_email_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key107 UNIQUE (email);


--
-- Name: users users_email_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key108 UNIQUE (email);


--
-- Name: users users_email_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key109 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key110 UNIQUE (email);


--
-- Name: users users_email_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key111 UNIQUE (email);


--
-- Name: users users_email_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key112 UNIQUE (email);


--
-- Name: users users_email_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key113 UNIQUE (email);


--
-- Name: users users_email_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key114 UNIQUE (email);


--
-- Name: users users_email_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key115 UNIQUE (email);


--
-- Name: users users_email_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key116 UNIQUE (email);


--
-- Name: users users_email_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key117 UNIQUE (email);


--
-- Name: users users_email_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key118 UNIQUE (email);


--
-- Name: users users_email_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key119 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key120 UNIQUE (email);


--
-- Name: users users_email_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key121 UNIQUE (email);


--
-- Name: users users_email_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key122 UNIQUE (email);


--
-- Name: users users_email_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key123 UNIQUE (email);


--
-- Name: users users_email_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key124 UNIQUE (email);


--
-- Name: users users_email_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key125 UNIQUE (email);


--
-- Name: users users_email_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key126 UNIQUE (email);


--
-- Name: users users_email_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key127 UNIQUE (email);


--
-- Name: users users_email_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key128 UNIQUE (email);


--
-- Name: users users_email_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key129 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key130 UNIQUE (email);


--
-- Name: users users_email_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key131 UNIQUE (email);


--
-- Name: users users_email_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key132 UNIQUE (email);


--
-- Name: users users_email_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key133 UNIQUE (email);


--
-- Name: users users_email_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key134 UNIQUE (email);


--
-- Name: users users_email_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key135 UNIQUE (email);


--
-- Name: users users_email_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key136 UNIQUE (email);


--
-- Name: users users_email_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key137 UNIQUE (email);


--
-- Name: users users_email_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key138 UNIQUE (email);


--
-- Name: users users_email_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key139 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- Name: users users_email_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key64 UNIQUE (email);


--
-- Name: users users_email_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key65 UNIQUE (email);


--
-- Name: users users_email_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key66 UNIQUE (email);


--
-- Name: users users_email_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key67 UNIQUE (email);


--
-- Name: users users_email_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key68 UNIQUE (email);


--
-- Name: users users_email_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key69 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key70 UNIQUE (email);


--
-- Name: users users_email_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key71 UNIQUE (email);


--
-- Name: users users_email_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key72 UNIQUE (email);


--
-- Name: users users_email_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key73 UNIQUE (email);


--
-- Name: users users_email_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key74 UNIQUE (email);


--
-- Name: users users_email_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key75 UNIQUE (email);


--
-- Name: users users_email_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key76 UNIQUE (email);


--
-- Name: users users_email_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key77 UNIQUE (email);


--
-- Name: users users_email_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key78 UNIQUE (email);


--
-- Name: users users_email_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key79 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key80 UNIQUE (email);


--
-- Name: users users_email_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key81 UNIQUE (email);


--
-- Name: users users_email_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key82 UNIQUE (email);


--
-- Name: users users_email_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key83 UNIQUE (email);


--
-- Name: users users_email_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key84 UNIQUE (email);


--
-- Name: users users_email_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key85 UNIQUE (email);


--
-- Name: users users_email_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key86 UNIQUE (email);


--
-- Name: users users_email_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key87 UNIQUE (email);


--
-- Name: users users_email_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key88 UNIQUE (email);


--
-- Name: users users_email_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key89 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_email_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key90 UNIQUE (email);


--
-- Name: users users_email_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key91 UNIQUE (email);


--
-- Name: users users_email_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key92 UNIQUE (email);


--
-- Name: users users_email_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key93 UNIQUE (email);


--
-- Name: users users_email_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key94 UNIQUE (email);


--
-- Name: users users_email_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key95 UNIQUE (email);


--
-- Name: users users_email_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key96 UNIQUE (email);


--
-- Name: users users_email_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key97 UNIQUE (email);


--
-- Name: users users_email_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key98 UNIQUE (email);


--
-- Name: users users_email_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key99 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_experiences work_experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_experiences
    ADD CONSTRAINT work_experiences_pkey PRIMARY KEY (id);


--
-- Name: applications_job_id_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX applications_job_id_user_id ON public.applications USING btree ("jobId", "userId");


--
-- Name: conversations_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_application_id ON public.conversations USING btree ("applicationId");


--
-- Name: conversations_graduate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_graduate_id ON public.conversations USING btree ("graduateId");


--
-- Name: conversations_last_message_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_last_message_at ON public.conversations USING btree ("lastMessageAt");


--
-- Name: conversations_recruiter_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_recruiter_id ON public.conversations USING btree ("recruiterId");


--
-- Name: files_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_type ON public.files USING btree (type);


--
-- Name: files_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_user_id ON public.files USING btree ("userId");


--
-- Name: idx_careers_facultyid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_careers_facultyid ON public.careers USING btree ("facultyId");


--
-- Name: idx_careers_isactive; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_careers_isactive ON public.careers USING btree ("isActive");


--
-- Name: idx_conversations_last_message; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversations_last_message ON public.conversations USING btree ("lastMessageAt");


--
-- Name: idx_educations_careerid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_educations_careerid ON public.educations USING btree ("careerId");


--
-- Name: idx_educations_degreetype; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_educations_degreetype ON public.educations USING btree ("degreeType");


--
-- Name: idx_educations_facultyid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_educations_facultyid ON public.educations USING btree ("facultyId");


--
-- Name: idx_jobs_createdby; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jobs_createdby ON public.jobs USING btree ("createdBy");


--
-- Name: idx_messages_readat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_readat ON public.messages USING btree ("readAt");


--
-- Name: idx_notifications_readat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_readat ON public.notifications USING btree ("readAt");


--
-- Name: idx_user_roles_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_roles_role_id ON public."UserRoles" USING btree ("roleId");


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_roles_user_id ON public."UserRoles" USING btree ("userId");


--
-- Name: idx_users_career; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_career ON public.users USING btree ("careerId");


--
-- Name: idx_users_cedula; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_cedula ON public.users USING btree (cedula);


--
-- Name: idx_users_facultyid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_facultyid ON public.users USING btree ("facultyId");


--
-- Name: idx_users_university; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_university ON public.users USING btree ("universityId");


--
-- Name: idx_work_experiences_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_experiences_location ON public.work_experiences USING btree (location);


--
-- Name: messages_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_conversation_id ON public.messages USING btree ("conversationId");


--
-- Name: messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_created_at ON public.messages USING btree ("createdAt");


--
-- Name: messages_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_sender_id ON public.messages USING btree ("senderId");


--
-- Name: notifications_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_created_at ON public.notifications USING btree ("createdAt");


--
-- Name: notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_user_id ON public.notifications USING btree ("userId");


--
-- Name: permissions_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX permissions_action ON public.permissions USING btree (action);


--
-- Name: permissions_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX permissions_module ON public.permissions USING btree (module);


--
-- Name: saved_jobs_user_id_job_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX saved_jobs_user_id_job_id ON public.saved_jobs USING btree ("userId", "jobId");


--
-- Name: user_portfolios_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_portfolios_user_id ON public.user_portfolios USING btree ("userId");


--
-- Name: user_skills_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_skills_user_id ON public.user_skills USING btree ("userId");


--
-- Name: applications applications_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- Name: applications applications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: careers careers_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT "careers_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: certifications certifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT "certifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: companies companies_recruiterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "companies_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: conversations conversations_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "conversations_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: conversations conversations_graduateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "conversations_graduateId_fkey" FOREIGN KEY ("graduateId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: conversations conversations_recruiterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "conversations_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: educations educations_careerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT "educations_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES public.careers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: educations educations_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT "educations_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: educations educations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT "educations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: faculties faculties_universityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT "faculties_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES public.universities(id) ON UPDATE CASCADE;


--
-- Name: files files_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: interviews interviews_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT "interviews_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobs jobs_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE;


--
-- Name: jobs jobs_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public.conversations(id) ON UPDATE CASCADE;


--
-- Name: messages messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: projects projects_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recruiter_requests recruiter_requests_existingCompanyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recruiter_requests
    ADD CONSTRAINT "recruiter_requests_existingCompanyId_fkey" FOREIGN KEY ("existingCompanyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE;


--
-- Name: saved_jobs saved_jobs_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_jobs
    ADD CONSTRAINT "saved_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: saved_jobs saved_jobs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_jobs
    ADD CONSTRAINT "saved_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_portfolios user_portfolios_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_portfolios
    ADD CONSTRAINT "user_portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: user_skills user_skills_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT "user_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: users users_careerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES public.careers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_universityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES public.universities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_experiences work_experiences_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_experiences
    ADD CONSTRAINT "work_experiences_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict fSkXpuEegV0qpumAp1wtm5TFUhVuNxlda4sEqcOs8Z5EtQvuLeaxjALpK1e3Gux

