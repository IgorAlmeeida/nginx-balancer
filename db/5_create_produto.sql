
CREATE TABLE
  public.produto (
    id serial NOT NULL,
    nome character varying(100) NULL,
    valor numeric(16, 2) NULL,
    id_marca integer NULL
  );

ALTER TABLE
  public.produto
ADD
  CONSTRAINT produto_pkey PRIMARY KEY (id)
