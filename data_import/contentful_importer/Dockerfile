FROM python:2

WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libffi-dev python-dev
COPY . ./
RUN pip install --no-cache-dir -r requirements.pip

CMD ["python", "/usr/src/app/pg_import.py"]

