# EventHub Deployment Rehberi

Production ortamına deployment için adım adım kılavuz.

## Gerekli Hazırlıklar

ÖNEMLI: Deployment öncesinde local'de tüm özelliklerin çalıştığından emin ol (npm run dev + npm run dev frontend).

## 1. PostgreSQL Database (Neon.tech)

Ücretsiz managed PostgreSQL için Neon kullanacağız:

1. https://neon.tech adresine git ve hesap oluştur (GitHub ile login yapabilirsin)
2. "Create Project" butonuna tıkla
3. Project ismi ver (örn: eventhub-db)
4. Region seç (en yakın: Europe - Frankfurt)
5. "Create Project" butonuna tıkla
6. Connection String'i kopyala (postgresql://... ile başlayan URL)
7. Bu URL'yi bir yere kaydet, birazdan kullanacağız

NOT: Neon otomatik olarak database oluşturur, manuel database oluşturmana gerek yok.

## 2. Backend Deployment (Railway.app)

Railway hem kolay hem ücretsiz tier'da kullanışlı:

### 2.1 Railway Projesi Oluştur

1. https://railway.app adresine git ve GitHub ile login yap
2. "New Project" butonuna tıkla
3. "Deploy from GitHub repo" seçeneğini seç
4. EventHub repository'ni seç
5. "Add variables" butonuna tıkla

### 2.2 Environment Variables Ekle

Aşağıdaki environment variable'ları ekle:

DATABASE_URL: (Neon'dan kopyaladığın PostgreSQL connection string)
JWT_SECRET: (güçlü bir random string, örn: openssl rand -base64 32 ile üret)
CORS_ORIGIN: (frontend URL'ini buraya ekleyeceğiz, şimdilik boş bırakabilirsin)
NODE_VERSION: 20

### 2.3 Build Ayarları

Root Directory: backend
Build Command: npm install && npm run prisma:generate:pg && npm run build
Start Command: npm run start:prod

### 2.4 Migration Çalıştır

Railway dashboard'da "Settings" → "Service" → kısmında deploy edilen service'i bul.
Terminal açmak için Railway CLI kullan veya web arayüzünden "Deploy Logs" izle.

Railway CLI kurulu değilse:

- npm i -g @railway/cli
- railway login
- railway link (projeyi seç)
- railway run npm run prisma:deploy:pg

VEYA deployment tamamlandıktan sonra Railway'in sağladığı shell'den:

- cd backend
- npm run prisma:deploy:pg
- npm run seed:pg

### 2.5 Public URL'i Kaydet

Railway otomatik olarak bir public URL verir (örn: eventhub-backend.up.railway.app)
Settings → Networking → Public URL kısmından kopyala.
Bu URL'yi kaydet: https://your-backend.up.railway.app

## 3. Frontend Deployment (Vercel)

### 3.1 Vercel Projesi Oluştur

1. https://vercel.com adresine git ve GitHub ile login yap
2. "Add New Project" butonuna tıkla
3. EventHub repository'ni seç
4. "Import" butonuna tıkla

### 3.2 Build Ayarları

Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install

### 3.3 Environment Variables Ekle

VITE_API_URL: (Railway'den aldığın backend URL'i buraya yapıştır)
Örnek: https://eventhub-backend.up.railway.app

### 3.4 Deploy

"Deploy" butonuna tıkla ve deployment'ın tamamlanmasını bekle (2-3 dakika).

### 3.5 Public URL'i Kaydet

Deployment tamamlandığında Vercel bir URL verir (örn: eventhub.vercel.app)
Bu URL'yi kaydet: https://eventhub.vercel.app

## 4. CORS Ayarını Tamamla

Şimdi frontend URL'ini bildiğimize göre backend CORS'u güncelle:

1. Railway dashboard'a dön
2. Variables kısmına git
3. CORS_ORIGIN variable'ını bul ve güncelle
4. Değer: https://eventhub.vercel.app (kendi Vercel URL'ini kullan)
5. Eğer www subdomain'i de varsa: https://eventhub.vercel.app,https://www.eventhub.vercel.app
6. Kaydet ve Railway otomatik olarak backend'i redeploy edecek

## 5. Production Test

### 5.1 Frontend'i Aç

Vercel URL'ine git (örn: https://eventhub.vercel.app)

### 5.2 Test Adımları

- Kayıt ol sayfasını aç ve yeni bir hesap oluştur
- Login yap
- Etkinlikler sayfasını kontrol et (backend API'den veri geliyor mu?)
- Admin hesabı oluşturmak için Railway terminal'den: railway run npm run seed:pg
- Admin olarak login yap ve CRUD işlemlerini test et

### 5.3 Swagger API Dökümantasyonu

Backend URL'ine /api ekleyerek Swagger arayüzüne eriş:
https://your-backend.up.railway.app/api

Swagger'da API endpoint'lerini test edebilirsin.

## 6. Final Public URL'ler

Deployment tamamlandıktan sonra aşağıdaki URL'lere sahip olacaksın:

FRONTEND (Vercel):
Ana sayfa: https://eventhub.vercel.app
Login: https://eventhub.vercel.app/login
Register: https://eventhub.vercel.app/register
Admin Panel: https://eventhub.vercel.app/admin

BACKEND (Railway):
API Base URL: https://eventhub-backend.up.railway.app
Health Check: https://eventhub-backend.up.railway.app
Swagger Docs: https://eventhub-backend.up.railway.app/api

DATABASE (Neon):
Admin Panel: https://console.neon.tech (dashboard'dan yönet)

## Troubleshooting

CORS HATASI: Backend CORS_ORIGIN'e frontend URL'ini ekle
DATABASE CONNECTION ERROR: Railway'de DATABASE_URL doğru mu kontrol et
BUILD FAILED: Railway'de build command ve root directory doğru mu kontrol et
API 404: Frontend'de VITE_API_URL doğru mu kontrol et (trailing slash olmadan)
MIGRATION ERROR: Railway terminal'den npm run prisma:deploy:pg çalıştır

## Deployment Sonrası Güncellemeler

FRONTEND Güncellemesi:

- GitHub'a push yap
- Vercel otomatik olarak deploy eder

BACKEND Güncellemesi:

- GitHub'a push yap
- Railway otomatik olarak deploy eder
- Eğer schema değişti ise: Railway terminal'den npm run prisma:deploy:pg

DATABASE Schema Değişikliği:

- Local'de migration oluştur: npm run prisma:migrate:pg
- Migration dosyalarını commit et
- GitHub'a push yap
- Railway deploy sonrası: railway run npm run prisma:deploy:pg

## Alternatif: Render.com Backend Deployment

Eğer Railway yerine Render kullanmak istersen:

1. https://render.com adresine git
2. "New +" → "Web Service" seç
3. GitHub repo'yu bağla
4. Root Directory: backend
5. Build Command: npm install && npm run prisma:generate:pg && npm run build
6. Start Command: npm run start:prod
7. Environment Variables: DATABASE_URL, JWT_SECRET, CORS_ORIGIN ekle
8. Create Web Service
9. Deploy sonrası shell'den: npm run prisma:deploy:pg

Render ücretsiz tier'da biraz daha yavaş ama stabil.

## Maliyet Özeti

NEON (Database): Ücretsiz tier 0.5GB storage, 1 project
RAILWAY (Backend): Ücretsiz tier $5 credit/month (hobby projeler için yeterli)
VERCEL (Frontend): Ücretsiz tier sınırsız deployment

Toplam Maliyet: $0 (ücretsiz tier'lar ile)
