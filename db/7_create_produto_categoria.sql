
CREATE TABLE
  public.produto_categoria (
    id serial NOT NULL,
    id_categoria integer NULL,
    id_produto integer NULL
  );

ALTER TABLE
  public.produto_categoria
ADD
  CONSTRAINT produto_categoria_pkey PRIMARY KEY (id)
