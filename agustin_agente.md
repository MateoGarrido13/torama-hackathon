nace de un paper,traductor de google, maquina de predecir token
* poder tener propiedades (conectarse a db,ssh)
* que es un harness?
 porque harness <> agente?
 skill: cap

## harness <> agente

El **agente** es el modelo: predice el próximo token y, con eso, decide qué decir o qué tool pedir.

El **harness** es el programa alrededor: arma el contexto, llama al modelo, ejecuta la tool (db, ssh, skill), le devuelve el resultado y repite el bucle, con permisos y límites.

El agente elige. El harness hace que esa elección ocurra y tenga efecto. Una skill es una capacidad que el harness le pone a disposición.acidad de tarea rutinaria .
  
