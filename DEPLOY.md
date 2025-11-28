# HTTPS & PWA Deployment Checklist

## 📋 Actions Immédiates

### 1. Tester HTTPS en Local

```bash
# Installer et configurer
./setup-https.sh

# Démarrer server HTTPS
npm run serve:https

# Ou manuellement
http-server -S -C localhost.pem -K localhost-key.pem -p 8443
```

**Accéder à** : https://localhost:8443

**Vérifier** :
- [ ] Page se charge sans erreur
- [ ] Console : "[PWA] Service Worker registered"
- [ ] DevTools > Application > Service Worker (Active)
- [ ] Manifest détecté
- [ ] Install button visible (⊕ dans URL bar)

---

### 2. Vérifier Hébergement Production

**Votre hébergeur** : (à confirmer, probablement O2Switch)

**Questions à poser** :
- SSL/HTTPS est-il activé sur mon domaine ?
- Certificat Let's Encrypt disponible ?
- Où placer le fichier `.htaccess` ?

**Test domaine** :
```bash
curl -I https://votre-domaine.com
# Doit retourner : HTTP/2 200 ou HTTP/1.1 200
```

---

### 3. Déployer

Le fichier `.htaccess` est **déjà créé** et sera déployé automatiquement via GitHub Actions.

**Contient** :
- ✅ Force HTTPS redirect
- ✅ Security headers
- ✅ Cache headers optimisés
- ✅ Service Worker config
- ✅ Error page 404

**Pour déployer** :
```bash
git add .
git commit -m "feat: add HTTPS config for PWA"
git push origin main

# GitHub Action déploie automatiquement
```

---

## ✅ Post-Déploiement

### Vérifications Essentielles

**1. HTTPS actif**
```bash
https://votre-domaine.com
# ✅ Cadenas vert dans navigateur
# ✅ Certificat valide
```

**2. Service Worker**
```
DevTools > Application > Service Workers
# ✅ Status: Activated and running
# ✅ Scope: https://votre-domaine.com/
```

**3. Manifest**
```
DevTools > Application > Manifest
# ✅ No errors
# ✅ Icons loaded (8 sizes)
# ✅ Installable: Yes
```

**4. PWA Install**
```
Desktop:
- ⊕ icon in URL bar
- Click > Install EgoCoach

Mobile Android:
- Banner "Add to Home screen" after 3 visits
- Or menu > Add to Home screen

Mobile iOS:
- Share button > Add to Home Screen
```

**5. Lighthouse**
```
DevTools > Lighthouse
Run audit:
- Performance: > 90 ✅
- PWA: 100 ✅
- Accessibility: > 95 ✅
- Best Practices: > 90 ✅
- SEO: > 90 ✅
```

---

## 🐛 Si Problème

### Service Worker not registered

**Cause** : Pas de HTTPS

**Solution** :
1. Vérifier `https://` dans URL
2. Check console errors
3. Vider cache navigateur

---

### Install prompt not showing

**Causes** :
- Déjà installé
- Moins de 3 visites
- Manifest invalide

**Debug** :
```javascript
// Console
localStorage.setItem('visit_count', '3');
location.reload();
```

---

### Offline doesn't work

**Solution** :
1. DevTools > Application > Service Workers
2. Click "Update"
3. Reload page
4. Test: DevTools > Network > Offline checkbox

---

## 📊 Métriques à Surveiller

```javascript
// Installations PWA
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed');
});

// Vérifier registrations
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('SW registrations:', regs.length);
});
```

---

## 🎯 Prochaines Étapes

1. [ ] Exécuter `./setup-https.sh` (local)
2. [ ] Tester https://localhost:8443
3. [ ] Vérifier install button
4. [ ] Confirmer SSL actif sur domaine
5. [ ] Push vers production
6. [ ] Tester PWA installation (desktop + mobile)
7. [ ] Run Lighthouse audit
8. [ ] Monitorer installations

---

**Questions ?** Voir guide complet : `https-pwa-guide.md`
