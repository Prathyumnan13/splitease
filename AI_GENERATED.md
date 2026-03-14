# SplitEase — Home Expense Splitter

> **This entire application was AI-generated** using GitHub Copilot (Claude) in a single conversation session on **14 March 2026**.

---

## About

SplitEase is a home maintenance expense splitting app for 4 housemates. Built with Next.js, NeonDB (Postgres), and hosted on Vercel. Features phone-number-only authentication, monthly expense tracking, equal-split calculations, debt simplification, and GPay number copy for easy payments.

---

## Prompts Used (in order)

### Prompt 1 — Initial Requirements
> hey, i want to make a expense split app, we have only 4 users in our home, the thing is, we want to make a maintanance split app, this should support, in one page, it should show a table, like person,reason,amount, person who spent name, reason for spending, amount spent, now in same page we need a add button if add button is selected, we do a popup and then ask them to add expense, for authentication, we are just going to have simple phone number, otp also not necessary, after that, we are going to show how much each persons are yet to pay or receive, we are going to show another page, where we show a table persons, amount split, amount in persons column all users will be listed, and all amount to pay or recieve is shown, for example in one month 2 persons together spend 2000 and there are total 4 persons, persons will be all 4 persons name, amount split will be 500 because 2000 is total amount and 4 is total persons so 2000/4 = 500, for amount column lets name it "amount to recieve" for 2 users who spent 1000 each it will show -500 and for 2 it will show +500, also it should show who the person should pay and amount in a table. Also it should show who and howmuch the person logged in should pay, also it should display the gpay number of that person. make the number copyable. for this we are using next.js and neontech db and we will host it in vercel. give me a complete plan for this.

**Decisions made:** Per-month tracking, Mark as Settled feature, Add User flow, GPay = Phone number.

### Prompt 2 — DB Connection String
> postgresql://neondb_owner:npg_4W3EoAnxTYyw@ep-holy-star-amzbylwl-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
> use here for db. also our app is going to be present in splitApp folder.

### Prompt 3 — Use Neon Serverless Pattern
> Provided the `neon()` tagged template SQL pattern and `.env` format to follow.

### Prompt 4 — JavaScript Only
> have everything as javascript. no typescript file

### Prompt 5 — Mobile-First Design
> make it look so good, i'm planning it to embed it in android app and ios also, most of the users are mobile users, but it's not that nobody uses it in web, make it look good in both.

**This triggered the full implementation** — all files were created.

### Prompt 6 — Disk Space Error
> (Pasted Turbopack "No space left on device" error)

**Fix:** Cleaned Chrome cache (~3GB), Homebrew cache, npm cache. Freed 1.8GB.

### Prompt 7 — Hydration Error
> (Pasted React hydration mismatch error caused by Ember browser extension)

**Fix:** Added `suppressHydrationWarning` to `<html>` tag.

### Prompt 8 — Restrict Expense Adding
> here person who has logged in will only be able to add expense.

**Fix:** Removed Person dropdown, auto-set userId from session.

### Prompt 9 — Settlement Logic Review
> check logic for mark as settled, once marked as settled, it should show as paid right? and if someone pays in between the days like in mid of month, but then an expense is added, check what should happen.

**Fix:** Found and fixed inverted settlement direction in split-calculator.js.

### Prompt 10 — Stale Data Bug
> total expense is 0 why should i pay 500?

**Fix:** Added early-exit guard when totalSpent === 0. Verified DB had stale settlement records.

### Prompt 11 — Auto Month Redirect
> check which month it is and go to that month automatically while checking expense page.

**Fix:** Added server-side redirect to `?month=YYYY-MM` when no month param present.

### Prompt 12 — Push to Git
> can you help me push it to git?

**Action:** Created GitHub repo `Prathyumnan13/splitease`, initialized git, staged files.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: NeonDB (Postgres) via `@neondatabase/serverless`
- **Auth**: Phone-number lookup + JWT cookie via `jose`
- **Hosting**: Vercel

---

## Setup Steps

### 1. Clone the repo
```bash
git clone https://github.com/Prathyumnan13/splitease.git
cd splitease
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```bash
# Create .env in the project root
cat > .env << 'EOF'
# keep Neon credentials secure: do not expose them to client-side code

DATABASE_URL='postgresql://neondb_owner:npg_4W3EoAnxTYyw@ep-holy-star-amzbylwl-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
JWT_SECRET='splitapp_s3cure_jwt_k3y_2026_x7m9'
EOF
```

### 4. Create database tables
Go to [Neon SQL Editor](https://console.neon.tech) and run the contents of `src/db/setup.sql`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  month TEXT NOT NULL,
  settled_at TIMESTAMP DEFAULT now()
);
```

### 5. Run the dev server
```bash
npm run dev
```
Open http://localhost:3000

### 6. Add users
- Go to http://localhost:3000/admin/users
- Add up to 4 housemates (Name + Phone number)
- Phone number doubles as GPay number

### 7. Login
- Go to http://localhost:3000/login
- Enter any registered phone number
- No OTP — just phone number match

### 8. Use the app
- **Expenses tab**: View monthly expenses, tap "Add Expense" to add one (auto-assigned to you)
- **Summary tab**: See equal split, who owes whom, copyable GPay numbers, mark debts as settled
- **Users tab**: Manage housemates (max 4)

### 9. Deploy to Vercel
1. Push to GitHub (already done)
2. Go to [vercel.com](https://vercel.com), import the `splitease` repo
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL` = your Neon connection string
   - `JWT_SECRET` = your JWT secret
4. Deploy

---

## Project Structure

```
splitApp/
├── .env                          # Database + JWT credentials (gitignored)
├── src/
│   ├── middleware.js              # Auth middleware — protects routes
│   ├── app/
│   │   ├── layout.js             # Root layout with nav
│   │   ├── page.js               # Redirect to /expenses or /login
│   │   ├── login/page.jsx        # Phone number login
│   │   ├── expenses/page.jsx     # Monthly expense list + add modal
│   │   ├── summary/page.jsx      # Split overview + settlements
│   │   └── admin/users/page.jsx  # User management
│   ├── actions/
│   │   ├── auth.js               # login(), logout()
│   │   ├── expenses.js           # getExpenses(), addExpense(), deleteExpense()
│   │   ├── settlements.js        # getSettlements(), markSettled(), undoSettlement()
│   │   └── users.js              # getUsers(), addUser(), deleteUser()
│   ├── components/
│   │   ├── add-expense-modal.jsx # Bottom-sheet modal for adding expenses
│   │   ├── bottom-nav.jsx        # Mobile bottom tabs + desktop top nav
│   │   ├── copy-button.jsx       # Copy GPay number to clipboard
│   │   ├── expense-table.jsx     # Card-based expense list
│   │   ├── month-selector.jsx    # Prev/next month navigation
│   │   ├── my-balance-card.jsx   # Logged-in user's balance summary
│   │   ├── summary-table.jsx     # Per-person split overview
│   │   └── who-pays-whom-table.jsx # Settlement cards with GPay copy
│   ├── db/
│   │   └── setup.sql             # Database table creation SQL
│   └── lib/
│       ├── session.js            # JWT create/verify/destroy
│       └── split-calculator.js   # Core split logic + debt simplification
```

---

## Core Logic (split-calculator.js)

1. **Total spent** = sum of all expenses for the month
2. **Per person share** = total / number of users
3. **Balance per user** = share - what they spent + settlement adjustments
   - Positive = they owe money
   - Negative = they are owed money
4. **Debt simplification** = greedy algorithm matching largest debtor with largest creditor to minimize number of transactions

---

## Features

- Phone-only auth (no OTP, no passwords)
- Monthly expense tracking with prev/next navigation
- Equal split calculation across all users
- Greedy debt simplification (minimizes transactions)
- Mark as Settled with settlement history
- Copyable GPay numbers for easy payments
- Mobile-first design with bottom tab navigation
- iOS safe-area support
- Bottom-sheet modals on mobile, centered on desktop
- Dark mode support

---

## AI Generation Details

- **AI Model**: GitHub Copilot (Claude Opus 4.6)
- **Date**: 14 March 2026
- **Session**: Single continuous conversation
- **Total prompts**: 12+
- **Files created**: 17 source files + config
- **Dependencies**: `@neondatabase/serverless`, `jose` (+ Next.js defaults)
- **Bugs found & fixed during session**: 3 (settlement direction, stale data guard, hydration mismatch)
