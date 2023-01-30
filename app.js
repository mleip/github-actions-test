/***************************************************************************************************
    Abhängige Pakete die in der package.json definiert sind
*****************************************************************************************************/
const express = require('express')                  // http-server framework
const cors = require('cors')                        // CORS deaktivieren
const csv = require('csv-parser');                  // handler für CSV Dateien
const fs = require('fs');                           // handler zum lesen/schreiben von Dateien
const ObjectsToCsv = require('objects-to-csv')      // Wandlet CSV Zeilen in JSON-Objekte um

/***************************************************************************************************
    Konfigurationen
*****************************************************************************************************/
const port = process.env.PORT || 5000               // Konfiguration des Webserver-Ports
let morgan = require('morgan')                      // http-zugriff logging auf der CLI
let bodyParser = require('body-parser');            // einfacher handler für POST/PUT payloads
const corsOptions = {                               // CORS-Optionen definieren
    origin: '*'
}

/***************************************************************************************************
    express framework initialisieren
****************************************************************************************************/
const app = express()                               // express app erstellen
app.use(bodyParser.json());                         // den body-parser übergeben
app.use(morgan('combined'))                         // den http-logger übergeben
app.use(cors(corsOptions))                          // CORS-Einstellungen übergeben

/***************************************************************************************************
    todo liste
****************************************************************************************************/
let todoListe = []                                  // Array Liste der todo-Einträge

/***************************************************************************************************
    CSV Datei lesen und zur Liste hinzufügen
****************************************************************************************************/
fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
        todoListe.push(row)
    })

/***************************************************************************************************
    Standard-Route, ohne funktion
****************************************************************************************************/
app.get("/", (request, response) => {
    response.json({
        greeting: "Hello World of Techstarter!"
    })
});

/***************************************************************************************************
    Ausgabe aller Objekte als Array
****************************************************************************************************/
app.get('/todos', (request, response) => {
    // respone muss das array als json zurück geben
    response.json(todoListe)
})

/***************************************************************************************************
    Erstellen eines neuen Eintrags
    Übertragen wird der payload in der form
    ```
    {
        "name": "Ein neuer Eintrag"
    }
    ```
****************************************************************************************************/
app.post('/todos', function(request, response) {

    // größte ID ermitteln
    let lastId = 0;

    // alle Elemente durch gehen und prüfen welche ID größer ist
    for(let i=0; i<todoListe.length; i++){
        let currentId = parseInt(todoListe[i]['id']);

        if(currentId > lastId){
            lastId = currentId;
        }
    }

    // Neues CSV Element anlegen (id, name, done)
    // Payload auslesen
    let item = {
        id: lastId + 1,
        name: request.body['name'],
        done: "false"
    }

    // Element an die Liste anfügen
    todoListe.push(item);

    // Liste in CSV um wandeln und speichern über `ObjectsToCsv`
    const csv = new ObjectsToCsv(todoListe);
    csv.toDisk("./data.csv");

    // neue Liste zurück geben
    response.json(todoListe)
});

/***************************************************************************************************
    Aktualisieren eines bestehenden Eintrags
    Übertragen wird der payload in der form
    ```
    {
        "id": 1,
        "done": true
    }
    ```
****************************************************************************************************/
app.put('/todos', function(request, response) {
    // Payload auslesen
    let id = request.body['id']

    for(let i=0; i<todoListe.length; i++){
        // Element in der Liste finden anhand der übertragenen ID
        if(todoListe[i]['id'] == id){
            // Element aktualisieren, passend zum `done` Status
            todoListe[i]['done'] = request.body['done'].toString();

            // Liste in CSV um wandeln und speichern über `ObjectsToCsv`
            const csv = new ObjectsToCsv(todoListe);
            csv.toDisk("./data.csv");
        }
    }

    // neue Liste zurück geben
    response.json(todoListe)
});

/***************************************************************************************************
    Löschen eines bestehenden Eintrags
****************************************************************************************************/
app.delete('/todos/:id', function(request, response) {
    // ID aus der URL auslesen
    let id = request.params['id']

    for(let i=0; i<todoListe.length; i++){
        // Element in der Liste finden anhand der übertragenen ID
        if(todoListe[i]['id'] == id){

            // Element aus der Liste löschen
            todoListe.splice(i, 1)
            // Liste in CSV um wandeln und speichern über `ObjectsToCsv`
            const csv = new ObjectsToCsv(todoListe);
            csv.toDisk("./data.csv");
        }
    }

    // neue Liste zurück geben
    response.json(todoListe)
});


/***************************************************************************************************
    Starten der express Anwendung
****************************************************************************************************/
app.listen(port, () => console.log(`Techstarter Todo App listening on port ${port}!`))