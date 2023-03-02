const express = require('express');
const { Client } = require("pg");
require('dotenv').config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, APP, PORT } = process.env;


const client = require('prom-client')

// Create a Registry which registers the metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: APP
})

// Enable the collection of default metrics
client.collectDefaultMetrics({ register })

app = express();


app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType)
    res.end(await register.metrics())
});



/** 
 * Cenário I - Requisição com retorno de dados vazio
 */
app.get('/route1', (req, res) => {
    res.status(200).send({})
});

/**
 * Cenário II - Requisição com retorno de dados de uma única entidade 
 * 
 * Entidade: Produto
 */

app.get('/route2', async(req, res) => {
    try {
        const client = new Client({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });
        client.connect();

        let { rows } = await client.query("SELECT * FROM produto limit 10000");

        client.end();
        res.status(200).send({ produtos: rows });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

/**
 * Cenário III - - Requisic ̧  ́ ao com retorno de duas entidades com relacionamentos de cardinalidade 1xN
 * 
 * Entidades: Marca -> Produto
 */

app.get('/route3', async(req, res) => {
    try {
        const client = new Client({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });
        client.connect();

        let { rows } = await client.query("SELECT * FROM marca limit 500");
        let marcas = rows;

        let tam = marcas.length;
        for (i = 0; i < tam; i++) {
            let { rows } = await client.query("SELECT * FROM produto WHERE id_marca = " + marcas[i].id);
            marcas[i]['produtos'] = rows || [];
        }
        client.end();
        res.status(200).send({ marcas });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

});

/**
 * Cenario IV - Requisic ̧  ́ ao com retorno de duas entidades com relacionamentos de cardinalidade NxN
 * 
 * Entidades: Produto -> Categoria
 */

app.get('/route4', async(req, res) => {
    try {
        const client = new Client({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });
        client.connect();

        let { rows } = await client.query("SELECT * FROM produto LIMIT 1000");
        let produtos = rows;

        let tam = produtos.length;
        for (let i = 0; i < tam; i++) {
            let { rows } = await client.query("SELECT * FROM produto_categoria WHERE id_produto = " + produtos[i].id);
            let produtos_categorias = rows;

            let tam2 = produtos_categorias.length;

            let categorias = new Array();
            for (let j = 0; j < tam2; j++) {
                let { rows } = await client.query("SELECT * FROM categoria WHERE id = " + produtos_categorias[j].id_categoria);
                categorias.push(rows);
            }
            produtos[i].categorias = categorias;
        }
        client.end();
        res.status(200).send({ produtos });
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

app.listen(PORT, (req, res) => {
    console.log("Server on")
});
