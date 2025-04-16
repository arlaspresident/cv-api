# cv api

detta är en rest baserad webbtjänst som hanterar arbetserfarenheter. api:t är byggt med node.js, express och mysql och innehåller fullständig crud funktionalitet.

## teknik

- node.js
- express
- mysql
- dotenv
- cors

## databasstruktur

databasen heter `cv` och tabellen heter `workexperience`.

fält:
- id (int, auto_increment, primärnyckel)
- companyname (varchar)
- jobtitle (varchar)
- location (varchar)
- startdate (date)
- enddate (date)
- description (text)

## installation

1. klona projektet

git clone https://github.com/arlaspresident/cv-api.git cd cv-api

2. installera beroenden

npm install

3. skapa en `.env`-fil i projektets rot med följande innehåll

DB_HOST=localhost DB_USER=root DB_PASSWORD= DB_NAME=cv DB_PORT=3306

4. starta servern

node index.js

servern körs på http://localhost:3000

## api endpoints

### skapa erfarenhet
post /api/workexperience

body (json):
{ "companyname": "twelve rentals", "jobtitle": "airbnb-värd", "location": "cypern", "startdate": "2023-04-01", "enddate": "2023-10-01", "description": "ansvarade för bokningar och gästkontakt" }

### hämta alla erfarenheter

get /api/workexperience

### uppdatera erfarenhet

put /api/workexperience/:id

body (json): samma som post

### ta bort erfarenhet

delete /api/workexperience/:id

## testning

du kan testa api:t med postman eller thunder client.
