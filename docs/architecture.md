## PersonalSkin Architecture

PersonalSkin is implemented as a modular monolith within a single repository.

- **Frontend (Mobile):** Flutter (Dart) app under `src/mobile`
- **Backend (API):** Node.js + TypeScript with Express and Sequelize under `src/backend`
- **Database:** PostgreSQL for relational data (users, profiles, routines, products)

Modules are organized by domain (auth, users, profiles, products, routines, community)
with strict boundaries between them.

