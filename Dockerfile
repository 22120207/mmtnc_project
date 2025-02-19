FROM python:3.7-alpine
EXPOSE 3000
WORKDIR /app 
COPY requirements.txt /app
RUN pip install -r requirements.txt --no-cache-dir --user
COPY . /app 
ENTRYPOINT ["python"] 
CMD ["manage.py", "runserver", "0.0.0.0:3000"]