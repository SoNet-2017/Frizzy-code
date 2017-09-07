'use strict';

//The service implemented in this module will save information about eventi
angular.module('myApp.evento.insertEventoService', [])

    .factory('InsertEventoService', function($firebaseArray) {
        var NewEventoService = {
            insertNewEvento: function (manager, nome_evento, //nome_organizzatore,
                                       data_evento, location_evento,
                                       min_invitati, max_invitati, prezzo, imgPath, lista_necessita) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("eventi");
                // create a synchronized array
                return $firebaseArray(ref).$add({
                    manager: manager,
                    nome_evento: nome_evento,
                    data_evento: data_evento.toString(),
                    location_evento: location_evento,
                    min_invitati: min_invitati,
                    max_invitati: max_invitati,
                    prezzo: prezzo,
                    img_url: imgPath,
                    img_alt: nome_evento+" "+manager,
                    lista_necessita: lista_necessita
                }).then(function (ref) {
                    console.log(ref);
                }, function (error){
                    console.log(error);
                });
            },
            updateEvento: function (eventoId) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("eventi").child(eventoId);
                // create a synchronized array
                ref.update({
                    id: eventoId
                });
            },
            updateImg: function (eventoId, imgPath) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("eventi").child(eventoId);
                // create a synchronized array
                ref.update({
                    img_url: imgPath
                });
            }
        };
        return NewEventoService;
    });
