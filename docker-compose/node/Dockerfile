FROM ansible/ubuntu14.04-ansible

ADD ansible /opt/ansible
RUN ansible-galaxy install nodesource.node
RUN ansible-playbook /opt/ansible/node.yml -c local
