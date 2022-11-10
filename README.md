# Kinesis: Trabajo Práctico 1

Arquitectura de Software - FIUBA - 2do cuatrimestre 2022

Integrantes:

| Padrón  | Apellido y Nombre   |
|---------|---------------------|
| 99760   | Holota, Pavlo       | 
| 96454   | Caceres, Julieta    |
| 94165   | Prediger, Emiliano  |

## Ejecutar servicios

```bash
$ docker-compose up -d --build --scale node=4 
```

El valor de `node` deben coincidir con los declarados en `nginx_reverse_proxy.conf` (`node` + `node/cluster`)

## Rutas (pasando por nginx reverse proxy)

- bbox0: `http://localhost:5555/bbox0`
- bbox1: `http://localhost:5555/bbox1`
- node: `http://localhost:5555/node`
- node (cluster): `http://localhost:5555/node/cluster`
