FROM jenkins/jenkins:lts-jdk17

USER root

# Installation de Node.js 20, Git et du client Docker
RUN apt-get update \
 && apt-get install -y curl gnupg git docker.io \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

# Autoriser jenkins a utiliser le socket Docker
RUN groupadd -f docker && usermod -aG docker jenkins

# Installation des plugins Jenkins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

USER jenkins