# FilRouge
Fid'Artisan
Fid'Artisan est une plateforme web visant à faciliter la mise en relation entre artisans qualifiés et clients au Cameroun. L’objectif est de simplifier la recherche d’artisans par métier et localisation, et d’offrir un espace d’échange, de service et de visibilité pour les professionnels du secteur artisanal.

Sommaire
Présentation

Fonctionnalités principales

Architecture technique

Technologies utilisées

Installation

Structure des rôles

Exemples d'API


Présentation
La plateforme Fid'Artisan répond à une problématique concrète du marché camerounais : la difficulté de mise en relation entre artisans et clients. Elle permet :

Aux clients : de rechercher des artisans selon leur besoin (ville + métier), consulter les profils, envoyer des demandes de service, gérer leurs favoris, laisser des avis.

Aux artisans : de recevoir des demandes, présenter leurs services et projets réalisés, répondre aux clients, gérer leur calendrier.

À l’admin : de superviser la plateforme et gérer les utilisateurs.

Fonctionnalités principales
Côté Client :
Recherche d’artisans par métier et ville

Consultation de profils publics d’artisans

Envoi de demandes de service

Messagerie avec les artisans

Système de favoris

Système d’avis et de notation

Côté Artisan :
Réception et gestion des demandes

Présentation de profil professionnel (services, projets, compétences…)

Statistiques et tableau de bord

Profil public consultable par tous

Côté Admin :
Gestion des utilisateurs

Supervision des avis et des activités

Statistiques générales

Architecture technique
Frontend (React.js)

React avec JSX

React Router

Axios pour les requêtes API

Tailwind CSS pour le style

Framer Motion pour les animations

React Hook Form pour la gestion des formulaires

Backend (Laravel 9.5.2)

Laravel Sanctum pour l’authentification API

Laravel Fortify pour la gestion de session et sécurité

API RESTful avec validation des requêtes

Notifications par mail

Eloquent ORM pour la base de données

Base de données

MySQL

Relations : utilisateurs → artisans / clients, services, avis, favoris

Technologies utilisées
Frontend	Backend	Autres
React	Laravel	Git / GitHub
Tailwind CSS	MySQL	Postman
Axios	Sanctum	Laravel Fortify
Framer Motion	Eloquent ORM	Storage avec symlink

Installation
Prérequis :
PHP 8.0+

Node.js 18+

MySQL

Composer

NPM

Étapes :
Backend Laravel
bash
git clone https://github.com/votre-utilisateur/artisanconnect.git
cd FidArtisanBack
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
Frontend React
bash
cd frontend
npm install
npm run dev
Structure des rôles
users : table principale des utilisateurs (nom, email, mot de passe, rôle…)

clients : infos spécifiques aux clients

artisans : infos spécifiques aux artisans (profil public, services, projets…)

admins : accès total à la plateforme

Relations :

Un utilisateur peut être artisan ou client

Un client peut avoir plusieurs services, favoris, avis

Un artisan peut recevoir plusieurs services, avis

Exemples d'API
Authentification
http
POST /api/login
POST /api/register
GET /api/profile
Recherche
http
GET /api/artisans/search?ville=Douala&metier=menuisier
GET /api/professions
Artisan
http
GET /api/artisans/{id}/profil
POST /api/artisan/{id}/services
Client
http
GET /api/client/{id}
GET /api/client/{id}/favoris
