FROM jenkins/jenkins:lts-jdk17

USER root

# Node.js 20, Git, client Docker, gosu (drop de privileges dans l'entrypoint)
RUN apt-get update \
 && apt-get install -y curl gnupg git docker.io gosu \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

# Groupe docker dans l'image (le GID hote est aligne au runtime, voir entrypoint)
RUN groupadd -f docker && usermod -aG docker jenkins

# Installation des plugins Jenkins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# URL publique Jenkins (sous-domaine Caddy)
COPY init.groovy.d/ /usr/share/jenkins/ref/init.groovy.d/

# Rester root : l'entrypoint aligne le GID du socket puis passe a jenkins
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
 && chmod 755 /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
