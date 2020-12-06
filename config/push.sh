. config/deploy.sh

echo -e "\e[34m-------------------------------\e[0m"
echo -e "\e[34m-----------Deployment----------\e[0m"
echo -e "\e[34m-------------------------------\e[0m"

rsync -avz0 -r \
--filter='- /node_modules/' \
--filter='- /dist/' \
--filter='- /temp/' \
--filter='- /config/' \
--filter='- /docs/' \
--filter='- /*.env' \
--filter='- .DS_Store' \
--filter='- npm-debug.log' \
--filter='- .git' \
--filter='- .gitignore' \
--filter='- /src/' \
-e "ssh -p $port_ssh" ./ $user_ssh:$root_path/

rsync -avz0 -r --delete \
-e "ssh -p $port_ssh" ./src/ $user_ssh:$root_path/src/