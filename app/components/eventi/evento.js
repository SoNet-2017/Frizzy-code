'use strict';

//declare the module that will act as parent of all the services dedicated to retrieve/save information about the eventi
angular.module('myApp.evento', [
    'myApp.evento.eventoService',
    'myApp.evento.singleEventoService',
    'myApp.evento.insertEventoService'
])

.value('version', '0.1');
