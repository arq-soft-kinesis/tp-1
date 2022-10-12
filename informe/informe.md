# Trabajo Práctico 1 - Arquitectura de Software

## 2° Cuatrimestre 2022

#### Integrantes

| Padrón  | Apellido y Nombre   |
|---------|---------------------|
| 99760   | Holota, Pavlo       | 
| 96454   | Caceres, Julieta    |
| 94165   | Prediger, Emiliano  |
| 98942   | Roselló, Jimena     |

## Sección 1

### Healthcheck básico

En esta primera instancia vamos a tratar de medir la performance de nuestro sistema realizando diferentes pruebas
de carga sobre el enpoint *ping* con el fin de someter al mismo a diferentes peticiones de requests y de esta manera 
comprender sus metricas y limites.

#### Escenario 1. Baseline - Un único nodo - Ping

En este primer escenario utilizamos una única instancia del sistema y el endpoint *ping* como baseline para consiguiente
análisis. Se pretende de esta forma, tener un caso base desde el cual luego ir desarrollando y comparando.

Para medir la performance del sistema se crea una prueba con la siguiente configuración:

***
![phases-baseline-ping.png](img/ping/phases-baseline-ping.png)
([Link a imagen](img/ping/phases-baseline-ping.png))


El objetivo de esta configuración fue tener un escenario sin sobrecarga, que pudiese simular un escenario aceptable
para el sistema. Es por ello que se configuró de manera de tener 3 etapas, con números bajos de arrival rate. Con esto se espera poder un escenario liviano en carga del cual poder obtener algunas métricas
iniciales.


Se ejecuta la siguiente prueba:
***
    sh run-scenario .\ping\baseline-ping.yml node

Y se obtienen los siguientes valores:
![img_10.png](img/ping/throughput-baseline-ping.png)

En la imagen podemos ver que el throughput fue del 100%, no perdimos ningun mensaje y el mismo fue creciendo junto con 
la cantidad de request tal y como esperabamos.

En cuanto a la latencia podemos ver en el siguiente gráfico que la misma creció en la fase de Ramp Up, pero
se volvio a estabilizar cuando los request tuvieron un arrival rate constante.

![img_10.png](img/ping/latencia-baseline-ping.png)

En cuanto al uso de los recursos del sistema, vemos que el isp de memoria es muy bajo y que el de CPU no supera en
en promedio el 8%.

![img_11.png](img/ping/resources-baseline-ping.png)

Debido a este aumento de latencia mencionado, nos preguntamos a partir de cuál valor de rate nuestro sistema comenzaría 
a quebrarse disminuyendo su throughput.

Para responder a esa pregunta, realizamos una prueba exploratoria de carga sobre este endpoint.

#### Escenario 2 - Búsqueda exploratoria de límite de carga Ping - Una única instancia

En este caso, como se mencionó en el escenario anterior, se realiza una prueba con una configuración diferente que
permita estimar a partir de que valores nuestro sistema comienza a empeorar su performance. 

La configuración propuesta para tal fin es la siguiente:

![img_11.png](img/ping/stress-explorative-1.png)

Con esta configuración se decide arrancar con un arrivalRate igual al maximo propuesto para el baseline, ya que sabemos
que el sistema pudo soportarlo. Luego, se va a ir incrementando gradualmente la cantidad de virtual users de manera de
que la carga vaya creciendo y podamos ver como esto afecta a las diferentes métricas progresivamente.

Se ejecuta el siguiente comando:
***
    sh run-scenario .\ping\explorative-stress-testing-ping.yml node

Los resultados obtenidos con esta configuración fueron:

![img_13.png](img/ping/Throughput-ping-stress-1.png)

Se puede ver que en el segundo Ramp Up pasamos el sistema comienza a fallar gracias al gráfico de *Request State*. Esto
también se ve reflejado si miramos el gráfico de *Throughput* donde el RPS Count iba creciendo junto con la curva de request
pero en el segundo que se alcanza el quiebre la curva baja porque el server comienza a arrojar errores y los requests o
mensajes recibidos son dropeados.

Estos errores *Server Address in Use*, tambien se ven reflejados en la Latencia y tiempo de respuesta:

![img_14.png](img/ping/latency-stress-1.png)
Fijarse como la latencia al final de la etapa de mayor carga habia llegado a su valor maximo. Y, el response time, tambien
fue creciendo en esta ultima etapa:
![img_15.png](img/ping/response_time_ping1.png)

En cuanto a los recursos tambien podemos ver que el consumo de CPU es significativamente mas grande que en el ejemplo 
baseline que tomamos. Alcanzando valores maximos cercanos al 30% y un 17.8% en promedio:
![img_16.png](img/resourse-ping-stress-1/img_16.png)

#### Escenario 2 - Refinamiento de Request threshold para Ping - Una única instancia.

Sabemos que comenzamos a tener errores en el segundo Rump Up de la prueba anterior, es por eso que para poder refinar, 
partiremos esa fase en fases de carga progresiva para refinar el límite.

La configuración de la prueba a usar es la siguiente:

![img_13.png](img/ping/refinamiento-stress-2.png)

Corriendo el comando:

***
    sh run-scenario .\ping\explorative-stress-testing-ping.yml node

Vemos entonces que el sistema comienza a fallar desde el segundo Ramp Up donde el throughput decae significativamente:

![img.png](img/trhoghput-stress-ping-2/img.png)

Podemos decir entonces que nuestro límite de cargas esta dentro del rango arrival de 150 a 200 en un minuto.

Para poder recibir mas requests al mismo tiempo que este limite estimado, vamos a testear el sistema si fuese escalado
horizontalmente, para ello levantaremos mas replicas del mismo.

#### Escenario 3 - Test de Carga sobre el endpoint Ping - 2 replicas

Comenzaremos levantando una replica extra y someteremos este cluster al mismo test anterior para poder comparar:

***
    sh run-scenario .\ping\explorative-stress-testing-ping.yml cluster

Los resu


Para entender cuanto mejora en nuestro sistema tener réplicas del cluster inicial se realiza la misma prueba hecha 
anteriormente sobre un cluster de 3 instancias.

El resultado es el siguiente:




### Enpoint Intensivo

Para el estudio de la performance del sistema bajo tareas más intensivas, es decir tareas con consumo de CPU alto, 
creamos pruebas sobre el endpoint *intensivo*


#### Un único nodo

Para testear este endpoint habíamos creado una configuración inicial por fases como la siguiente:

([Link a imagen](img/phases-load-testing-intesivo1.png))
![img1](img/phases-load-testing-intesivo1.png)

La intención de esta configuración era ir escalando gradualmente la cantidad de usuarios virtuales para determinar cual
sería el límite de carga sobre el cual el sistema comenzaría a fallar. Sin embargo, al ejecutar la prueba comenzamos a

Para ejecutarlo se realiza:



obtener errores de *ETIMEDOUT* tan solo en la primera fase y con un unico request completado, como se muestra a continuación:
![img.png](img/error-intensivo-un-solo-nodo-1.png)


Por ello se decide probar con cantidades menores por segundo:




Como no notamos ninguna mejora, creemos que es mejor opcion escalar horizontalmente nuestra arquitectura, creando replicas
del sistema y evaluando las mismas pruebas sobre el mismo para comprobar su mejora.


#### Replicas

Ejecutando las mismas pruebas realizadas anteriormente se obienten los siguientes resultados






