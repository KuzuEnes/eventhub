# EventHub QA Checklist

Demo günü için manuel test adımları ve kontrol listesi.

## 1. Öğrenci Akışı

### 1.1 Kayıt ve Giriş

- [ ] Ana sayfayı aç (http://localhost:5173)
- [ ] "Kayıt Ol" butonuna tıkla
- [ ] Geçerli bir email ve şifre ile kayıt ol (örn: student@test.com / 123456)
- [ ] Başarılı kayıt sonrası otomatik yönlendirme kontrolü
- [ ] Çıkış yap
- [ ] Login sayfasından aynı bilgilerle giriş yap
- [ ] Başarılı giriş sonrası dashboard'a yönlendirildiğini kontrol et

### 1.2 Etkinlik Listesi

- [ ] Öğrenci menüsünden "Etkinlikler" sayfasını aç
- [ ] Tüm etkinliklerin listelendiğini kontrol et
- [ ] Arama kutusuna bir kelime yaz ve filtreleme çalıştığını gör
- [ ] Kategori filtresini kullan ve sonuçları kontrol et
- [ ] Mekan filtresini kullan ve sonuçları kontrol et
- [ ] Tarih filtrelerini (Başlangıç/Bitiş) kullan
- [ ] "Filtreleri Temizle" butonunun çalıştığını kontrol et
- [ ] Her etkinlik kartında başlık, açıklama, tarih, mekan, kategori bilgilerini gör

### 1.3 Etkinlik Detayı ve Kayıt

- [ ] Bir etkinliğe tıkla ve detay sayfasını aç
- [ ] Etkinlik detaylarının tam göründüğünü kontrol et (başlık, açıklama, tarih, mekan, kategori, kapasite)
- [ ] "Kaydol" butonuna tıkla
- [ ] Başarı mesajının göründüğünü kontrol et
- [ ] Butonun "Kaydı İptal Et" olarak değiştiğini gör
- [ ] "Kaydı İptal Et" butonuna tıkla
- [ ] Onay dialogunun açıldığını kontrol et
- [ ] Onaylayınca kaydın iptal olduğunu ve butonun tekrar "Kaydol" olduğunu gör
- [ ] Tekrar kaydol ve kayıtlı durumda kal

### 1.4 Kayıtlarım Sayfası

- [ ] Öğrenci menüsünden "Kayıtlarım" sayfasını aç
- [ ] Kayıtlı olduğun etkinliklerin listelendiğini kontrol et
- [ ] Her kayıt için etkinlik adı, tarih, mekan bilgilerini gör
- [ ] Bir kaydın yanındaki "Kaydı İptal Et" butonuna tıkla
- [ ] Onay dialogunun açıldığını kontrol et
- [ ] Onaylayınca kaydın listeden kaldırıldığını gör
- [ ] Başarı mesajının göründüğünü kontrol et

## 2. Admin Akışı

### 2.1 Admin Girişi

- [ ] Çıkış yap
- [ ] Admin hesabıyla giriş yap (örn: admin@test.com / admin123)
- [ ] Admin menüsünün göründüğünü kontrol et (Mekanlar, Kategoriler, Etkinlikler, Kullanıcılar)

### 2.2 Mekan Yönetimi (CRUD)

- [ ] "Mekanlar" sayfasını aç
- [ ] Mevcut mekanların listelendiğini kontrol et
- [ ] "Yeni Mekan Ekle" butonuna tıkla
- [ ] Form dialogunun açıldığını kontrol et
- [ ] Tüm alanları doldur (İsim, Adres, Kapasite)
- [ ] "Kaydet" butonuna tıkla
- [ ] Başarı mesajı ve tabloda yeni mekanın göründüğünü kontrol et
- [ ] Bir mekanın "Düzenle" butonuna tıkla
- [ ] Mevcut değerlerin formda göründüğünü kontrol et
- [ ] Bir alanı değiştir ve kaydet
- [ ] Güncellemenin tabloya yansıdığını kontrol et
- [ ] Bir mekanın "Sil" butonuna tıkla
- [ ] Onay dialogunun açıldığını kontrol et
- [ ] Onaylayınca mekanın silindiğini gör

### 2.3 Kategori Yönetimi (CRUD)

- [ ] "Kategoriler" sayfasını aç
- [ ] Mevcut kategorilerin listelendiğini kontrol et
- [ ] "Yeni Kategori Ekle" butonuna tıkla
- [ ] Kategori adı gir ve kaydet
- [ ] Başarı mesajı ve tabloda yeni kategorinin göründüğünü kontrol et
- [ ] Bir kategorinin "Düzenle" butonuna tıkla
- [ ] Kategori adını değiştir ve kaydet
- [ ] Güncellemenin tabloya yansıdığını kontrol et
- [ ] Bir kategorinin "Sil" butonuna tıkla
- [ ] Onay dialogunun açıldığını kontrol et
- [ ] Onaylayınca kategorinin silindiğini gör
- [ ] Aynı isimde kategori eklemeyi dene ve 409 hatasını kontrol et

### 2.4 Etkinlik Yönetimi (CRUD)

- [ ] "Etkinlikler" sayfasını aç
- [ ] Mevcut etkinliklerin listelendiğini kontrol et
- [ ] Tabloda ID, Başlık, Başlangıç, Mekan, Kategori, Kapasite kolonlarını gör
- [ ] Filtrelerin çalıştığını kontrol et (Arama, Kategori, Mekan, Tarih aralığı)
- [ ] "Yeni Etkinlik Ekle" butonuna tıkla
- [ ] Form dialogunun açıldığını kontrol et
- [ ] Tüm alanları doldur (Başlık, Açıklama, Başlangıç, Bitiş, Kapasite, Mekan, Kategori)
- [ ] Mekan ve Kategori dropdown'larının dolu geldiğini kontrol et
- [ ] "Kaydet" butonuna tıkla
- [ ] Başarı mesajı ve tabloda yeni etkinliğin göründüğünü kontrol et
- [ ] Bir etkinliğin "Düzenle" butonuna tıkla
- [ ] Mevcut değerlerin formda doğru göründüğünü kontrol et (datetime-local formatında)
- [ ] Birkaç alanı değiştir ve kaydet
- [ ] Güncellemenin tabloya yansıdığını kontrol et
- [ ] Bir etkinliğin "Sil" butonuna tıkla
- [ ] Onay dialogunun açıldığını kontrol et
- [ ] Onaylayınca etkinliğin silindiğini gör

### 2.5 Kullanıcı Yönetimi

- [ ] "Kullanıcılar" sayfasını aç
- [ ] Tüm kullanıcıların listelendiğini kontrol et (ID, E-posta, Rol, Kayıt Tarihi)
- [ ] Rollerin renkli chip olarak göründüğünü kontrol et (Admin: kırmızı, Öğrenci: mavi)
- [ ] Bir öğrencinin rolünü Select ile "Admin" olarak değiştir
- [ ] Onay dialogunun açıldığını kontrol et
- [ ] Dialog mesajında email ve yeni rolün göründüğünü gör
- [ ] "Değiştir" butonuna tıkla
- [ ] Loading spinner göründüğünü ve tamamlandığında rolün güncellendiğini kontrol et
- [ ] Başarı mesajının göründüğünü kontrol et
- [ ] Aynı kullanıcının rolünü tekrar "Öğrenci" yap

## 3. Auth ve Session Kontrolleri

### 3.1 Çıkış İşlemi

- [ ] Header'daki kullanıcı email'ini gör
- [ ] "Çıkış" butonuna tıkla
- [ ] Login sayfasına yönlendirildiğini kontrol et
- [ ] Tarayıcı console'da token'ın temizlendiğini kontrol et (localStorage)
- [ ] Korumalı bir sayfaya manuel link ile gitmeyi dene (örn: /admin/venues)
- [ ] Login sayfasına yönlendirildiğini kontrol et

### 3.2 401 Hatası Handling

- [ ] Giriş yap
- [ ] DevTools > Application > Local Storage'dan token'ı manuel sil
- [ ] Bir API isteği gerektirecek aksiyona tıkla (örn: etkinlik listesi yenile)
- [ ] Otomatik olarak login sayfasına yönlendirildiğini kontrol et
- [ ] Hata mesajının göründüğünü kontrol et

### 3.3 Rol Bazlı Erişim

- [ ] Öğrenci hesabıyla giriş yap
- [ ] Browser'da manuel olarak /admin/venues adresine gitmeyi dene
- [ ] Erişim engellendi sayfasının veya yönlendirmenin olduğunu kontrol et
- [ ] Çıkış yap ve admin hesabıyla giriş yap
- [ ] /admin/venues adresine erişebildiğini kontrol et

## 4. Genel UI/UX Kontrolleri

### 4.1 Responsive Tasarım

- [ ] Tarayıcı penceresini küçült
- [ ] Mobil görünümde layout'un düzgün kaldığını kontrol et
- [ ] Menülerin, butonların ve tabloların responsive çalıştığını gör

### 4.2 Loading States

- [ ] Her sayfada ilk yüklenirken loading spinner'ın göründüğünü kontrol et
- [ ] Form submit sırasında butonlarda loading göründüğünü kontrol et
- [ ] Form submit sırasında butonların disabled olduğunu kontrol et

### 4.3 Hata Mesajları

- [ ] Form validation hatalarının göründüğünü kontrol et (boş alan, min karakter vb.)
- [ ] API hatalarında snackbar ile bildirim göründüğünü kontrol et
- [ ] Başarılı işlemlerde yeşil snackbar göründüğünü kontrol et
- [ ] Hata durumlarında kırmızı snackbar göründüğünü kontrol et

### 4.4 Dialog ve Onay Ekranları

- [ ] Tüm silme işlemlerinde onay dialogu göründüğünü kontrol et
- [ ] Dialog başlık ve mesajlarının açıklayıcı olduğunu kontrol et
- [ ] "İptal" butonunun dialogu kapatıp işlemi iptal ettiğini kontrol et
- [ ] Loading sırasında dialog butonlarının disabled olduğunu kontrol et

## 5. Edge Cases ve Validasyon

### 5.1 Form Validasyonları

- [ ] Etkinlik formu: Başlık minimum 2 karakter kontrolü
- [ ] Mekan formu: İsim minimum 3, Adres minimum 5 karakter, Kapasite minimum 1 kontrolü
- [ ] Kategori formu: İsim minimum 2 karakter kontrolü
- [ ] Kayıt formu: Email format ve şifre minimum uzunluk kontrolü

### 5.2 Tarih İşlemleri

- [ ] Etkinlik oluştururken başlangıç ve bitiş tarihlerinin datetime-local formatında olduğunu kontrol et
- [ ] Kayıtlı etkinliği düzenlerken tarihlerin doğru göründüğünü kontrol et
- [ ] Geçmiş tarihli etkinlik oluşturulabildiğini kontrol et (backend izin veriyorsa)

### 5.3 Boş Listeler

- [ ] Hiç kayıt olmadığında "Henüz kayıt bulunmuyor" mesajının göründüğünü kontrol et
- [ ] Filtre sonucunda hiç sonuç yoksa "Henüz ... bulunmuyor" mesajının göründüğünü kontrol et

## Demo Günü Senaryosu

SIRA: Aşağıdaki akışı tam olarak takip et

1. Uygulamayı başlat (backend + frontend)
2. Öğrenci kaydı oluştur ve giriş yap
3. Etkinlik listesini göster ve filtrele
4. Bir etkinliğe kaydol
5. Kayıtlarım sayfasını göster
6. Çıkış yap
7. Admin olarak giriş yap
8. Yeni mekan ekle
9. Yeni kategori ekle
10. Yeni etkinlik oluştur (az önce eklediğin mekan ve kategori ile)
11. Kullanıcı listesinde bir öğrencinin rolünü değiştir
12. Çıkış yap ve demo tamamla

NOTLAR:

- Her adımda başarı mesajlarının göründüğünden emin ol
- Loading state'lerini göster
- Onay dialoglarını göster
- Responsive tasarımı demo et
