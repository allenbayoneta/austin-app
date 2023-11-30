from flask import Flask, request, jsonify, abort
import pandas as pd
import itertools
from statsmodels.tsa.statespace.sarimax import SARIMAX
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*" }})


def uploadCSV(csvFile):
    try:
        file = pd.read_csv(csvFile, index_col=0, parse_dates=True)
        data = file['Sales']
        return data
    except Exception as e:
        abort(400, description="Invalid CSV file format")

def getBestOrder(data):
    p_values = range(0, 3)
    d_values = range(0, 2)
    q_values = range(0, 3)

    best_aic = float("inf")
    best_order = None

    for p, d, q in itertools.product(p_values, d_values, q_values):
        try:
            model = SARIMAX(data, order=(p, d, q), seasonal_order=(1, 1, 1, 12))
            results = model.fit()
            aic = results.aic
            if aic < best_aic:
                best_aic = aic
                best_order = (p, d, q)
        except:
            continue

    if best_order is None:
        abort(400, description="Failed to determine the best order for SARIMA model")

    return best_order

def trainModel(data):
    best_order = getBestOrder(data)
    sarima = SARIMAX(data, order=best_order, seasonal_order=(1, 1, 1, 12))
    model = sarima.fit()
    return model

def getForecast(data, period):
    try:
        model = trainModel(data)
        forecast = model.forecast(steps=period)
        print("Forecasts for the next {} months:".format(period))
        print(forecast)
        return forecast.tolist()
    except Exception as e:
        abort(400, description="Failed to generate forecast")

@app.route('/')
def hello_world():
    return 'API Server is running! "NoKap"'

@app.route('/generate_forecast', methods=['POST'])
def generate_forecast():
    try:
        csvFile = request.files.get('csvFile', None)
        if csvFile is None:
            abort(400, description="CSV file is missing")

        data = uploadCSV(csvFile)

        period = int(request.form.get('period', 6))
        if period <= 0:
            abort(400, description="Invalid period value")

        forecast = getForecast(data, period)
        return jsonify({'data': forecast})
    except Exception as e:
        abort(500, description="Internal server error")

if __name__ == '__main__':
    app.run(debug=True)
