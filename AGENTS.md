# Project: Motiv — Inventory Application

### Introduction

Build an inventory management app — in this case for vehicle parts. The app should have categories and items, so a user visiting the home page can choose a category and see every item in it. Full CRUD (Create, Read, Update, Delete) for both Items and Categories.

### Assignment

1. Set up an Express project (API only) and a new PostgreSQL database (Supabase), with a separate React frontend consuming it.
2. Before writing code, define the database tables/fields and relations between them. Entities for Motiv: Category, Item, Supplier, Vehicle (many-to-many with Item for compatibility).
3. Set up the routes and controllers you'll need on the Express side.
4. Build all the "READ" views in React (view category, view item).
5. Build the forms and API endpoints for create and update actions — forms live in React, submit to Express endpoints.
6. Figure out delete behavior. What happens deleting a category with items in it? Delete the items too, orphan them, or block the delete? Decide Motiv's rule.
7. Add dummy data via a seed script to your local database. Repeat on deploy.
8. Deploy it and show off what you've done.

#### Extra credit

1. Make it pretty.
2. Protect destructive actions (delete/update) — require login before write actions are allowed.