# Matomo

---

## Requirements

- Docker

- Docker Compose

- Traefik proxy (installed with docker-compose v1 or v2)

## Install Matomo

1) Update variables in `./docker/matomo/matomo.env`. It's very important you change the passwords.
   
   ![](/home/edmar/projetos/pece/d7-drupal-pece/src/docs/assets/matomo-variables.png)
   
   `MATOMO_BASE_URL` is the domain to access the Matomo, for example: analytics.yourdomain.com

2) Go to the matomo folder and run

 ```shell
   cd docker/matomo
   make run
   ```

3) Go to your MATOMO_BASE_URL in your browser and continue the wizard.

## PECE Settings to integrate with Matomo

1) You need restart PECE containers to get the MATOMO_BASE_URL.

2) Go to /admin/config/system/matomo in your PECE instance

3) Enable the modules: Matomo Analytics and Matomo Noscript
   ![](/home/edmar/projetos/pece/d7-drupal-pece/src/docs/assets/matomo-modules.png)

4) Go to /admin/config/system/matomo to start settings

5) Matomo Site ID is your id website in the Matomo
   
   ![](/home/edmar/projetos/pece/d7-drupal-pece/src/docs/assets/matomo-site-id.gif)

6) 