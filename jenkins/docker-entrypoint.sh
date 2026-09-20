#!/bin/bash
set -euo pipefail

# Le socket Docker de l'hôte est souvent root:docker (GID 988/998/999…),
# alors que le groupe "docker" dans l'image a un autre GID.
# Sans cet alignement : permission denied sur /var/run/docker.sock.
if [ -S /var/run/docker.sock ]; then
  sock_gid="$(stat -c '%g' /var/run/docker.sock)"
  if [ -n "${sock_gid}" ]; then
    if ! getent group "${sock_gid}" >/dev/null 2>&1; then
      groupadd --gid "${sock_gid}" docker-host
    fi
    sock_group="$(getent group "${sock_gid}" | cut -d: -f1)"
    usermod -aG "${sock_group}" jenkins
  fi
fi

exec /usr/bin/tini -- gosu jenkins /usr/local/bin/jenkins.sh "$@"
