
CREATE TABLE
  public.categoria (id serial NOT NULL, nome character varying(100) NULL);

ALTER TABLE
  public.categoria
ADD
  CONSTRAINT categoria_pkey PRIMARY KEY (id)
