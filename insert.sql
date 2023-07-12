/*
Script d'insertion de données.
*/

/* La définition de la schéma */
use challenges;

create user IF NOT EXISTS 'challenge'@'%.%.%.%' identified by 'test123';
grant select, update, insert, delete on challenges.* to 'challenge'@'%.%.%.%';
flush privileges;

INSERT INTO profile (profileName, profileCode)
VALUES ('student', 1),
       ('prof', 2),
       ('admin', 3);

INSERT INTO user (email, givenName, familyName, profileId)
VALUES ('Florent.delobe@yahoo.fr', 'florent', 'delobe', 1);
INSERT INTO user (email, givenName, familyName, profileId)
VALUES ('florent.delobe02400@gmail.com', 'florent', 'delobe', 2);
INSERT INTO user (email, givenName, familyName, profileId)
VALUES ('bluesiders00@gmail.com', 'florent', 'delobe', 3);

INSERT INTO promo (promoName)
VALUES ('mt4'),
       ('mt5');

INSERT INTO test (testName, scoreMax, useBdd)
VALUES ('unix', 10, false),
       ('sgbd', 20, true);

INSERT INTO question (questionText, questionCode, score, testId, cmd, result, useBdd)
VALUES 
    ('Je doit avoir acces au serveur', 3, 3, 2, 'select testName from test where testId=1', '[{"testName":"unix"}]', true),
    ('Créer un user dans la base', 4, 5, 2, 'ls -l', 'total 8\ndrwxrwxr-x 2 challenge challenge 4096 Jul  7 06:40 test\ndrwxrwxrwx 2 root      root      4096 Jul  7 06:40 test2\n', false),
    ('Mettez en place les bons droits', 5, 5, 2, 'ls -l', '', false),
    ('Requetes doit faire moins de 6s', 6, 5, 2, 'ls -l', '', false),
    ('Trigger sur l''email', 7, 5, 2, 'ls -l', '', false),
    ('Service ouvert sur le port 8081', 1, 5, 1, 'ls -l', '', false),
    ('Le script doit retourner le factorielle du paramètre ?facto=', 2, 2, 1, 'ls -l', '', false);

INSERT INTO test_promo (testId, promoId)
VALUES (2, 1);
VALUES (1, 1);
VALUES (1, 2);
VALUES (2, 2);


INSERT INTO test_promo_user (testPromoId, userId, urlServer, userServer, passwordServer, bdUserServer, bdPasswordServer)
VALUES (1, 1, '51.159.171.194', 'challenge', '', 'challenge', 'test123');


/* ... */
