FROM node:18 as keycloakify_jar_builder

# RUN apt-get update && \
#     apt-get install -y openjdk-11-jdk && \
#     apt-get install -y maven;

COPY ./keycloakify-starter/package.json ./keycloakify-starter/yarn.lock /opt/app/

WORKDIR /opt/app

RUN yarn install --frozen-lockfile

COPY ./keycloakify-starter/ /opt/app/

RUN yarn build-keycloak-theme

FROM quay.io/keycloak/keycloak:21.1.2 as builder

WORKDIR /opt/keycloak

COPY --from=keycloakify_jar_builder /opt/app/build_keycloak/target/keycloakify-starter-keycloak-theme-4.7.0.jar /opt/keycloak/providers/
RUN /opt/keycloak/bin/kc.sh build


FROM quay.io/keycloak/keycloak:21.1.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/
# ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]