ARG PYTHON_VERSION=3.13.1
FROM python:${PYTHON_VERSION}-slim
WORKDIR /app
COPY . /app
RUN mkdir -p ./models/logistic-regression
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
RUN python ./generateLogRegModel.py
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]
