'use strict';

//The service implemented in this module will save information about eventi
angular.module('myApp.evento.insertEventoService', [])

    .factory('InsertEventoService', function($firebaseArray) {
        var NewEventoService = {
            insertNewEvento: function (nome_evento, //nome_organizzatore,
                                       data_evento, location_evento,
                                       min_invitati, max_invitati, prezzo) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("eventi");
                // create a synchronized array
                return $firebaseArray(ref).$add({
                    nome_evento: nome_evento,
                    data_evento: data_evento.toString(),
                    location_evento: location_evento,
                    //nome_organizzatore: nome_organizzatore,
                    min_invitati: min_invitati,
                    max_invitati: max_invitati,
                    prezzo: prezzo
                    //img_url: imgPath,
                    //img_alt: nome_organizzatore+" "+nome_evento
                });
            },
            updateEvento: function (eventoId) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("eventi").child(eventoId);
                // create a synchronized array
                ref.update({
                    id: eventoId
                });
            }
        };
        return NewEventoService;
    });
