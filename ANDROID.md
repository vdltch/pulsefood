# PULSE Android

L’application utilise Capacitor avec l’identifiant `fr.pulsefood.app` et charge la PWA sécurisée `https://pulsefood.fr`.

## APK locale

Avec JDK 21 et le SDK Android :

```bash
npm ci
npm run android:apk
```

Le fichier est produit dans `android/app/build/outputs/apk/debug/app-debug.apk`.

## GitHub Release

Le workflow `Android APK` construit une APK manuellement. Un tag `android-v*` publie aussi une Release avec l’APK et sa somme SHA-256.

Cette première APK est signée avec la clé de débogage Android. Une clé de signature stockée dans GitHub Secrets sera requise pour le Play Store.
