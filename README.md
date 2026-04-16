# QuantityMeasurementApp

A modern, production-ready Angular 17 application for unit conversion and measurement operations.

---

## ✨ Features

- **4 Unit Categories**: Length, Temperature, Volume, Weight
- **5 Operations**: Convert, Add, Subtract, Compare, Divide
- **20+ Units** across all categories
- **Authentication**: Sign up / Login with localStorage persistence
- **History**: Per-user operation history with pagination & clear
- **Toast Notifications**: Success, error, info feedback
- **Fully Responsive**: Mobile, tablet, desktop
- **Dark theme** with glassmorphism UI

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17

```bash
npm install -g @angular/cli@17
```

### Install & Run

```bash
cd quantity-measurement-app
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

### Build for Production

```bash
ng build --configuration production
```

---

## 🏗 Project Structure

```
src/app/
├── components/
│   ├── navbar/           # Sticky top navigation
│   ├── home/             # Landing dashboard + hero
│   ├── converter/        # Main conversion tool
│   ├── history/          # User history page
│   ├── auth/             # Login & Signup
│   └── toast/            # Toast notification container
├── services/
│   ├── auth.service.ts       # Authentication (localStorage)
│   ├── conversion.service.ts # Unit math engine
│   ├── history.service.ts    # History CRUD
│   └── toast.service.ts      # Toast notifications
├── models/
│   └── models.ts         # Types, interfaces, unit definitions
├── guards/
│   └── auth.guard.ts     # Route protection
├── app.routes.ts         # Lazy-loaded routing
├── app.component.ts      # Root shell
└── app.config.ts         # App-level providers
```

---

## 🧮 Supported Units

| Category    | Units |
|-------------|-------|
| Length      | meter, cm, km, inch, foot, mile |
| Temperature | Celsius, Fahrenheit, Kelvin |
| Volume      | liter, mL, m³, gallon, fl oz, cup |
| Weight      | kg, gram, pound, ounce, metric ton |

---

## 🎨 Tech Stack

- **Angular 17** (standalone components, signals)
- **SCSS** (CSS custom properties, no UI framework needed)
- **Google Fonts**: Syne (headings) + DM Sans (body)
- **Angular Router** with lazy loading + view transitions
- **localStorage** for persistence (no backend required)

---

## 📋 Test Credentials

Register any account via the Sign Up page to get started. Credentials are stored in your browser's localStorage.

**Sample test flow:**
1. Sign up with any name/email/password
2. Go to Converter → Select "Length" → Operation "Convert"
3. Enter 100 in FROM, select `cm`, TO select `m`
4. Click Calculate → Result: `100 cm = 1 meter`
5. Go to History to see the saved record

---

## 🔒 Notes

- All data stored in browser localStorage — no backend/API required
- Passwords stored in plain text (demo only — use hashing in production)
- History is user-scoped by userId
