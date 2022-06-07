const Alexa = require('ask-sdk-core');
const admin = require("firebase-admin");
//const i18n = require("i18next");
//const sprintf = require("i18next-sprintf-postprocessor");
const serviceAccount = require("firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});


const DB = admin.firestore()

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = `Buenas. Bienvenido al registro de constantes. Prueba a registrar tu medida de tensión`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const NewUserIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Newuser';
    },
    async handle(handlerInput) {
        
        const Nombre = Alexa.getSlotValue(handlerInput.requestEnvelope, 'nombre');
        const Apellido = Alexa.getSlotValue(handlerInput.requestEnvelope, 'apellido');
        var Email = Alexa.getSlotValue(handlerInput.requestEnvelope, 'email');//Email puedo quitarselo creo
        const Dominio = Alexa.getSlotValue(handlerInput.requestEnvelope, 'dominio');//Email puedo quitarselo creo
        const FechaNacimiento = Alexa.getSlotValue(handlerInput.requestEnvelope, 'fechaNacimiento');
        const Telefono = Alexa.getSlotValue(handlerInput.requestEnvelope, 'telefono');
        const DNI = Alexa.getSlotValue(handlerInput.requestEnvelope, 'DNI');
        const letraDni = Alexa.getSlotValue(handlerInput.requestEnvelope, 'letraDni');
        var letraDniM = String(letraDni);
        letraDniM = letraDni.toUpperCase();
        const dni = String(DNI) +String(letraDniM);
        Email = String(Email)+"@"+String(Dominio)+".com";
        //const dni = "49244662Z";
        
        var speakOutput=""; 
        /*
        speakOutput= speakOutput+`Su nombre es ${Nombre}`;
        speakOutput=speakOutput+`Su apellido es ${Apellido}`;
        speakOutput=speakOutput+`Su emial es ${Email}`;
        speakOutput=speakOutput+`Su fecha de nacimiento es ${FechaNacimiento}`;
        speakOutput=speakOutput+`Su telefono es ${Telefono}`;
        speakOutput=speakOutput+`Su DNI es ${DNI}`;
        speakOutput=speakOutput+`Su letra del dni es ${letraDni}`;
        
        */
        
        try{
            //Cogemos la fecha actual
            await DB.collection("usuarios").doc(dni).set({
                nombre: Nombre,
                apellidos:Apellido,
                email:Email,
                fechaNacimiento: FechaNacimiento,
                telefono: Telefono
            })
            speakOutput="Perfecto, su usuario se ha creado con éxito";
        }catch(e){
            console.log(e)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const PulsoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'registraPulso';
    },
    async handle(handlerInput) {
        const pulso = Alexa.getSlotValue(handlerInput.requestEnvelope, 'pulso');
        const user = Alexa.getSlotValue(handlerInput.requestEnvelope, 'usuarioID');
        const letra_user = Alexa.getSlotValue(handlerInput.requestEnvelope, 'letraID');
        var letra_userM = String(letra_user);
        letra_userM = letra_userM.toUpperCase();
        const UsuarioID = String(user) +String(letra_userM);
        
        //const letra_user = "Y";
        //var UsuarioID = user+String(letra_user);
        //const UsuarioID="56681918Y";
        //const UsuarioID="49244662Z";
        //const UsuarioID="00000001X"
        
        let speakOutput = ' ';
        
        
        try{
            const datosUsuario = await DB.collection("usuarios").doc(UsuarioID).get();
            if (String(datosUsuario.data())==="undefined") {
                speakOutput = "Intentas introducir un pulso para un usuario que no esta registrado. Primero debes registrarte, pideme que te cree un usuario nuevo";

            
            }
            else{
                var current = new Date();
                var actual = current.toLocaleDateString()+" "+current.toLocaleTimeString('en-GB');
                var tipoConstante = "constantes/pulso/pulsos recogidos";
                var rutadB =  "usuarios/"+String(UsuarioID)+"/"+tipoConstante;
                
                await DB.collection(rutadB).add({
                    fecha: actual,
                    valor: pulso
                })
                speakOutput =  `${pulso} de pulso fue añadido correctamente`;
            }
            
            
        }catch(e){
            console.log(e)
            speakOutput = speakOutput +`Ha habido un problema al guardar ${pulso}`
        }
        
        /*
        
        let speakOutput = '';
        try{
            //Cogemos la fecha actual
            var current = new Date();
            var actual = current.toLocaleDateString()+" "+current.toLocaleTimeString('it-IT');
            var tipoConstante = "constantes/pulso/pulsos recogidos";
            var rutadB =  "usuarios/"+String(UsuarioID)+"/"+tipoConstante;
            
            await DB.collection(rutadB).add({
                fecha: actual,
                valor: pulso
            })
            
            
            speakOutput = speakOutput + `${pulso} was added!`
        }catch(e){
            console.log(e)
            speakOutput = speakOutput +`There was a problem adding the ${pulso}`
        }
        */
    

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};






const TensionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'registraTension';
    },
    async handle(handlerInput) {
        const tension = Alexa.getSlotValue(handlerInput.requestEnvelope, 'tension');
        const user = Alexa.getSlotValue(handlerInput.requestEnvelope, 'dni');
        const letra_user = Alexa.getSlotValue(handlerInput.requestEnvelope, 'letra_dni');
        var letra_userM = String(letra_user);
        letra_userM = letra_userM.toUpperCase();
        const UsuarioID = String(user) +String(letra_userM);
        
        //const letra_user = "Y";
        //var UsuarioID = user+String(letra_user);
        //const UsuarioID="56681918Y";
        //const UsuarioID="49244662Z";
        //const UsuarioID="00000001X"
        
        let speakOutput = ' ';
        
        
        try{
            const datosUsuario = await DB.collection("usuarios").doc(UsuarioID).get();
            if (String(datosUsuario.data())==="undefined") {
                speakOutput = `Intentas introducir una tensión para el usuario ${UsuarioID}, pero no esta registrado. Primero debes registrarte, pideme que te cree un usuario nuevo`;

            
            }
            else{
                var current = new Date();
                var actual = current.toLocaleDateString()+" "+current.toLocaleTimeString('it-IT');
                var tipoConstante = "constantes/tension/tension recogida";
                var rutadB =  "usuarios/"+String(UsuarioID)+"/"+tipoConstante;
                
                await DB.collection(rutadB).add({
                    fecha: actual,
                    valor: tension
                })
                speakOutput =  `${tension} de tensión fue añadida correctamente`;
            }
            
            
        }catch(e){
            console.log(e)
            speakOutput = speakOutput +`Ha habido un problema al guardar ${tension}`
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '¿Como puedo ayudarte?, prueba a añadir una constante';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Adiós!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Perdona, intenteló de nuevo';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};


const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Ha ocurrido un error. Inténtelo de nuevo';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NewUserIntentHandler,
        TensionIntentHandler,
        PulsoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();