/*
Script de création de la base de données de test.
A noter, on utilise uns stratégie avec DROP et IF NOT EXISTS afin de rendre 
notre script réutilisable dans le future, même si la base existe déjà
*/
create database IF NOT EXISTS challenges;

/* Créer l'utilisateur API */
create user IF NOT EXISTS 'api-dev'@'%.%.%.%' identified by 'api-dev-password';
grant select, update, insert, delete on challenges.* to 'api-dev'@'%.%.%.%';
flush privileges;

/* La définition de la schéma */
use challenges;



create table if not exists profile (
  profileId int auto_increment not null,
  profileName varchar(256) unique not null,
  profileCode int unique not null,
  primary key(profileId)
);

/* user */
create table if not exists user (
  userId int auto_increment not null,
  email varchar(256) unique not null, 
  familyName varchar(256), 
  givenName varchar(256),
  profileId int default 1,
  primary key(userId),
  foreign key(profileId) references profile(profileId)
);

create table if not exists test(
  testId int auto_increment not null,
  testName varchar(256) unique not null,
  scoreMax int default 20,
  primary key(testId)
);

create table if not exists promo (
  promoId int auto_increment not null,
  promoName varchar(256) unique not null,
  primary key(promoId)
);

create table if not exists test_promo (
  testPromoId int auto_increment not null,
  testId int not null,
  promoId int not null,
  primary key(testPromoId),
  foreign key(testId) references test(testId)ON DELETE CASCADE,
  foreign key(promoId) references promo(promoId)ON DELETE CASCADE
);

create table if not exists question (
  questionId int auto_increment not null,
  questionText varchar(256) not null,
  questionCode int not null,
  score int not null default 1,
  testId int not null,
  cmd varchar(256) not null,
  result varchar(256) not null,
  useBdd boolean default false,
  primary key(questionId),
  foreign key(testId) references test(testId)ON DELETE CASCADE
);

create table if not exists test_promo_user (
  testPromoUserId int auto_increment not null,
  testPromoId int not null,
  userId int not null,
  urlServer varchar(256),
  userServer varchar(256),
  passwordServer varchar(256),
  bdUserServer varchar(256),
  bdPasswordServer varchar(256),
  primary key(testPromoUserId),
  foreign key(testPromoId) references test_promo(testPromoId)ON DELETE CASCADE,
  foreign key(userId) references user(userId)ON DELETE CASCADE
);

create table if not exists reponse (
  reponseId int auto_increment not null,
  questionId int not null,
  testPromoUserId int not null,
  score int default 0,
  primary key(reponseId),
  foreign key(questionId) references question(questionId)ON DELETE CASCADE,
  foreign key(testPromoUserId) references test_promo_user(testPromoUserId)ON DELETE CASCADE
);



drop trigger if exists before_insert_user;

create trigger before_insert_user
before insert
on user for each row set new.email = lower(trim(new.email));

/* ... */
