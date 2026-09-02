create table public.projects (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,
  title text not null,
  year text,

  featured boolean not null default false,
  featured_order integer,
  project_order integer not null default 0,

  has_case_study boolean not null default false,

  confidentiality text not null default 'public'
    check (confidentiality in ('public', 'limited', 'private')),

  initials text not null,

  tone text not null default 'accent'
    check (tone in ('accent', 'amber')),

  -- Mirrors CaseStudyContent from app/types/project.ts.
  case_study jsonb,

  published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create table public.project_translations (
  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  locale text not null
    check (locale in ('en', 'ja')),

  role text,
  summary text not null,

  primary key (project_id, locale)
);


create table public.project_fields (
  name text primary key,
  sort_order integer not null default 0
);


create table public.project_field_relations (
  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  field_name text not null
    references public.project_fields(name)
    on delete cascade,

  primary key (project_id, field_name)
);


create table public.project_technologies (
  id uuid primary key default gen_random_uuid(),

  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  technology text not null,
  sort_order integer not null default 0
);


create table public.project_links (
  id uuid primary key default gen_random_uuid(),

  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  type text not null
    check (type in ('demo', 'github', 'figma', 'article', 'other')),

  label_en text not null,
  label_ja text not null,

  url text not null,
  sort_order integer not null default 0
);


create table public.project_media (
  id uuid primary key default gen_random_uuid(),

  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  type text not null
    check (type in ('image', 'video')),

  -- New uploaded files use storage_path.
  storage_path text,

  -- Existing /public paths or external assets use external_src.
  external_src text,

  alt_en text not null,
  alt_ja text not null,

  caption_en text,
  caption_ja text,

  is_cover boolean not null default false,
  sort_order integer not null default 0,

  constraint project_media_source_check
    check (num_nonnulls(storage_path, external_src) = 1)
);


create unique index project_single_cover
on public.project_media(project_id)
where is_cover = true;


insert into public.project_fields (name, sort_order)
values
  ('Frontend', 1),
  ('AI / ML', 2),
  ('Data / Optimization', 3),
  ('UI / UX', 4),
  ('Visual Design', 5)
on conflict (name)
do update set sort_order = excluded.sort_order;