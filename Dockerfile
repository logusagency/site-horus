FROM nginx:alpine

# Remove a config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos do site
COPY HORUS.html /usr/share/nginx/html/index.html
COPY formulario.html medicos.html dev.html politica-privacidade.html /usr/share/nginx/html/
COPY public/ /usr/share/nginx/html/public/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
