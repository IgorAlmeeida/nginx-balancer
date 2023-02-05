 

CREATE TABLE
  public.marca (id serial NOT NULL, nome character varying(100) NULL);

ALTER TABLE
  public.marca
ADD
  CONSTRAINT marca_pkey PRIMARY KEY (id)
