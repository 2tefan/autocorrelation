const NUMBER = 10;

const PULSE_LENGTH = 100 + 2 * NUMBER; // ms
const SIGNAL_LENGTH = 15 * PULSE_LENGTH; // ms
const SIGNAL_HEIGHT = 1;

const DELAY_SEND = 0;
const DELAY_RECEIVE = 5 * PULSE_LENGTH;

const SAMPLING_INTERVAL = 1; // ms

function getDefaultOptions(titleX) {
  return {
    aspectRatio: 5,
    radius: 0,
    scales: {
      x: {
        title: {
          display: true,
          text: titleX,
        },
      },
      y: {
        title: {
          display: true,
          text: "Spannung [V]",
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };
}

function getDefaultOptionsAutocorrelcation(titleX, data) {
  let options = getDefaultOptions(titleX);
  let max = Math.max.apply(Math, data);

  options.scales.x.ticks = {
    callback: function (val, index) {
      return formatFloat(this.getLabelForValue(index)) + " ms";
    },
  };

  options.scales.x.grid = {
    display: true,
    drawBorder: false,
    drawOnChartArea: true,
    drawTicks: true,
    tickLength: 10,
  };

  options.scales.y.max = max * 1.5;

  options.plugins.datalabels = {
    formatter: function (value, context) {
      return (
        formatFloat(context.chart.data.labels[context.dataIndex]) +
        " ms\n" +
        formatFloat(value)
      );
    },
    align: "end",
    anchor: "end",
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#1E2C53",
    padding: 2,
    rotation: 270,
    offset: 18,
    color: "#1E2C53",
    display: function (context) {
      return (
        context.dataset.data[context.dataIndex] >= max &&
        (context.dataset.data[context.dataIndex - 1] < max ||
          context.dataset.data[context.dataIndex + 1] < max)
      );
    },
  };
  return options;
}

function prepareAnnotations(options) {
  options.plugins.annotation = {
    annotations: {},
  };
}

function addAnnotationX(options, name, value, text) {
  options.plugins.annotation.annotations[name] = {
    type: "line",
    scaleID: "x",
    value: value,
    borderColor: "black",
    borderWidth: 5,
    label: {
      backgroundColor: "red",
      content: text,
      enabled: true,
    },
  };
}

function getData(label, values) {
  return {
    labels: label,
    datasets: [
      {
        label: "Vout",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        tension: 0,
      },
    ],
  };
}

function formatFloat(f1) {
  return Math.round(f1 * 100) / 100;
}

function getNormalSignal(delay = DELAY_SEND, length = PULSE_LENGTH) {
  let arr = new Array(SIGNAL_LENGTH);

  for (t = 0; t < SIGNAL_LENGTH; t += SAMPLING_INTERVAL) {
    if (delay <= t && t <= delay + length) {
      arr[t] = SIGNAL_HEIGHT;
    } else {
      arr[t] = 0;
    }
  }

  return arr;
}

function getRect(delay, signalHeight, tOn, tOff, signalLength) {
  let arr = new Array(signalLength);
  let period = tOn + tOff;

  for (t = 0; t < signalLength; t += SAMPLING_INTERVAL) {
    if (delay <= t && (t - delay) % period <= tOn) {
      arr[t] = signalHeight;
    } else {
      arr[t] = 0;
    }
  }

  return arr;
}

function getAutocorrelation(send, receive) {
  let arr = new Array(send.length);
  for (i = 0; i < send.length; i++) {
    arr[i] = 0;
    for (t = 0; t < send.length; t += SAMPLING_INTERVAL) {
      arr[i] += +send[t] * receive[(t + i) % receive.length]; // TODO
    }
  }

  return arr;
}

function getAutocorrelationNormalized(send, receive) {
  let arr = new Array(send.length);
  let sendSum = 0;
  let receiveSum = 0;
  for (i = 0; i < send.length; i++) {
    arr[i] = 0;
    sendSum += Math.pow(send[i], 2);
    receiveSum += Math.pow(receive[i], 2);

    for (t = 0; t < send.length; t += SAMPLING_INTERVAL) {
      arr[i] += +send[t] * receive[(t + i) % receive.length];
    }
  }
  for (i = 0; i < send.length; i++) {
    arr[i] /= Math.sqrt(sendSum * receiveSum);
  }

  return arr;
}

function labelSignal(signal) {
  let label = new Array(signal.length);

  for (t = 0; t < signal.length; t += SAMPLING_INTERVAL) {
    label[t] = t;
  }
  return [label, signal];
}
