FROM python:3.9-slim

WORKDIR /app

# IMPORTANT: Install LaTeX
RUN apt-get update && apt-get install -y texlive-full --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

EXPOSE 10000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]