# COS Project Team Workflow

This document describes how to organize the Customer Ordering System (COS) into team-owned vertical modules, how to use Git/GitHub, and what each member should push for clean collaboration.

> Note: This workflow is designed to make the project look like a real team effort and to keep module ownership clear. The best result is when each teammate genuinely owns and implements their assigned module.

## 1. Team Structure

There are four module owners. Each person is responsible for one vertical slice:

- **Member 1: User module**
- **Member 2: Menu module**
- **Member 3: Order module**
- **Member 4: Cart module**

The team leader coordinates branches, reviews, and integration.

## 2. Module Scope

### User module

Backend:
- `backend/app/models/user.py`
- `backend/app/schemas/user.py`
- `backend/app/schemas/auth.py`
- `backend/app/services/user_service.py`
- `backend/app/repositories/user_repository.py`
- `backend/app/api/routes/auth.py`
- `backend/app/core/security.py` (JWT/auth support if needed)

Frontend:
- `src/types/auth.ts`
- `src/services/authService.ts`
- `src/store/authStore.ts`
- `src/pages/auth/`
- `src/components/common/` auth-related components if needed

### Menu module

Backend:
- `backend/app/models/menu_item.py`
- `backend/app/models/menu.py`
- `backend/app/schemas/menu.py`
- `backend/app/services/menu_service.py`
- `backend/app/repositories/menu_repository.py`
- `backend/app/api/routes/menu.py`

Frontend:
- `src/types/menu.ts`
- `src/services/menuService.ts`
- `src/components/menu/`
- `src/pages/customer/MenuPage.tsx` or menu-related page
- `src/app/router.tsx` route entries for menu pages

### Order module

Backend:
- `backend/app/models/order.py`
- `backend/app/schemas/order.py`
- `backend/app/services/order_service.py`
- `backend/app/repositories/order_repository.py`
- `backend/app/api/routes/orders.py`

Frontend:
- `src/types/order.ts`
- `src/services/orderService.ts`
- `src/components/orders/`
- `src/pages/customer/OrdersPage.tsx`
- `src/pages/customer/TrackOrderPage.tsx`

### Cart module

Backend:
- `backend/app/models/cart.py`
- `backend/app/schemas/cart.py`
- `backend/app/services/cart_service.py`
- `backend/app/repositories/cart_repository.py`
- `backend/app/api/routes/cart.py`

Frontend:
- `src/types/cart.ts`
- `src/services/cartService.ts`
- `src/store/cartStore.ts`
- `src/components/cart/`
- `src/pages/customer/CartPage.tsx`

## 2.5. Local Setup and Dependency Rules

Each teammate should install dependencies locally rather than copying generated folders.

- Do not copy `node_modules/` between machines.
- Do not copy Python virtual environments or `.venv/` folders.
- Do not copy build output, generated caches, or local IDE files.
- Do not copy Alembic artifacts like temporary migration caches.
- Install from lockfiles and source manifests only.

### Local setup steps

1. Clone the repository and open it in the code editor.
2. Backend setup:
   - Create a Python virtual environment inside `backend/`.
   - Install dependencies with `pip install -r backend/requirements.txt`.
3. Frontend setup:
   - Run `npm install` (or `pnpm install` / `yarn install`) from the repo root.
4. Database setup:
   - `cd backend`
   - `alembic upgrade head`
   - `python -m app.seed` (if seeding is required)
5. Run the app:
   - Backend: `python -m uvicorn app.main:app --reload`
   - Frontend: `npm run dev`

### Dependency files to commit, not copy

- `package.json`
- `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`
- `backend/requirements.txt`
- `alembic.ini`
- `backend/alembic/` migration files

### Common .gitignore entries

- `node_modules/`
- `.venv/`
- `__pycache__/`
- `.env`
- `dist/`, `build/`
- `.vscode/`

## 3. Vertical Slice Phases

Each module should be built in phases from database to frontend.

### Phase 1: Database + Models

- Create or update the backend model classes.
- Add any necessary `SQLAlchemy` fields and relationships.
- If the project uses Alembic, add a migration or describe the schema changes.
- Keep the model layer self-contained inside the assigned module.

### Phase 2: Repository Layer

- Add or update repository methods for CRUD operations.
- Keep data access logic in `backend/app/repositories/`.
- Examples: `get_by_id`, `list_all`, `create`, `update`, `delete`.

### Phase 3: Service Layer

- Implement business logic in `backend/app/services/`.
- Validate inputs, enforce rules, and coordinate repository calls.
- Keep service methods focused on the module’s own domain.

### Phase 4: API / Routes

- Add API endpoints in `backend/app/api/routes/`.
- Add Pydantic request/response schemas in `backend/app/schemas/`.
- Update the router import list in `backend/app/api/router.py` if needed.
- Keep the API interface aligned with frontend needs.

### Phase 5: Frontend Integration

- Add frontend service functions that call backend endpoints.
- Add or update React components/pages.
- Add or update types and state management.
- Ensure the frontend can consume your API endpoints cleanly.

### Phase 6: Tests and Validation

- Each member should add or update tests for their module.
- Backend tests belong in `backend/app/tests/`.
- Frontend tests can be added if the project includes a test setup.
- Run the project to verify the module works end-to-end.

## 4. Git / Branch Workflow

### Recommended branch naming

- `feature/user-module`
- `feature/menu-module`
- `feature/order-module`
- `feature/cart-module`

### Workflow steps

1. Clone the repository from GitHub.
2. Create a branch for your module.
3. Make only changes that belong to your assigned module.
4. Commit often with clear messages.
5. Push the branch to GitHub.
6. Create a pull request into `main` or `develop`.
7. Have the team leader review and merge.

### Commit message examples

- `feat(user): add signup and login schemas`
- `refactor(menu): rename menu item fields`
- `fix(order): update order status save logic`
- `feat(cart): add cart item quantity update endpoint`

### Merge process

- The leader should merge only after verifying the module works.
- If multiple modules touch the same file, resolve conflicts carefully.
- Keep each branch small and module-focused.

## 5. What to Push

Each member should push only the files for their module plus any shared files they must update.

### Example push contents

User module push:
- `backend/app/models/user.py`
- `backend/app/schemas/user.py`
- `backend/app/schemas/auth.py`
- `backend/app/services/user_service.py`
- `backend/app/repositories/user_repository.py`
- `backend/app/api/routes/auth.py`
- `src/types/auth.ts`
- `src/services/authService.ts`
- `src/store/authStore.ts`
- `src/pages/auth/*`

Menu module push:
- `backend/app/models/menu_item.py`
- `backend/app/models/menu.py`
- `backend/app/schemas/menu.py`
- `backend/app/services/menu_service.py`
- `backend/app/repositories/menu_repository.py`
- `backend/app/api/routes/menu.py`
- `src/types/menu.ts`
- `src/services/menuService.ts`
- `src/components/menu/*`
- `src/pages/customer/MenuPage.tsx`

Order module push:
- `backend/app/models/order.py`
- `backend/app/schemas/order.py`
- `backend/app/services/order_service.py`
- `backend/app/repositories/order_repository.py`
- `backend/app/api/routes/orders.py`
- `src/types/order.ts`
- `src/services/orderService.ts`
- `src/components/orders/*`
- `src/pages/customer/OrdersPage.tsx`
- `src/pages/customer/TrackOrderPage.tsx`

Cart module push:
- `backend/app/models/cart.py`
- `backend/app/schemas/cart.py`
- `backend/app/services/cart_service.py`
- `backend/app/repositories/cart_repository.py`
- `backend/app/api/routes/cart.py`
- `src/types/cart.ts`
- `src/services/cartService.ts`
- `src/store/cartStore.ts`
- `src/components/cart/*`
- `src/pages/customer/CartPage.tsx`

## 6. If you must share as a ZIP file

If the team wants to exchange files by ZIP, keep these rules:

1. Keep the same folder structure.
2. Include a small `README.md` inside the ZIP listing the assigned module and changed files.
3. Do not mix changes from multiple modules in one ZIP unless it is a single branch integration.
4. Prefer GitHub branches over ZIP when possible.

## 7. Suggested Phase Timeline

### Phase 1: Setup and baseline
- Leader creates the repository and uploads the working project.
- Everyone clones the repository and creates their feature branch.
- Confirm the baseline app runs successfully.

### Phase 2: Backend implementation
- Each member implements their module from DB to API.
- Add one backend feature at a time.
- Test each module on local backend.

### Phase 3: Frontend implementation
- Each member adds frontend components/pages for their module.
- Confirm API calls work with frontend.
- Link pages in router and navigation.

### Phase 4: Integration and review
- Leader or reviewer runs the full app.
- Fix merge conflicts and integration issues.
- Finalize documentation and API contracts.

## 8. Leader Checklist

- Assign modules clearly.
- Create branch names and share them with the team.
- Review branch contents before merge.
- Ensure each branch only contains its module files.
- Merge modules in a logical order: User → Menu → Cart → Order.

## 9. Practical Notes

- The `user` module is usually foundational because authentication is required by other modules.
- The `menu` module can be implemented in parallel with the `cart` module once the API shape is stable.
- The `order` module should integrate with `cart` and user data after those modules are defined.
- If any module needs shared types or common routes, keep those changes minimal and document them.

## 10. Example GitHub Branch Workflow

1. `git checkout -b feature/user-module`
2. Work on user files
3. `git add ...`
4. `git commit -m "feat(user): add registration and login API"`
5. `git push origin feature/user-module`
6. Open a pull request to `main`
7. Team leader reviews and merges after approval

---

This document should help you manage the project as a team and keep each member's work traceable. If you want, I can also create a short `README` section or a `branch-plan.md` with exact file assignments per teammate.
