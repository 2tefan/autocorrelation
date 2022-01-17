const number = 10;

const pulseLength = 100 + 2 * number; // ms
const signalLength = 15 * pulseLength; // ms
const signalHeight = 1;

const delaySend = 0;
const delayReceive = 5 * pulseLength;

const samplingInterval = 1; // ms

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
    padding: 4,
    offset: 20,
    color: "#1E2C53",
    display: function (context) {
      return context.dataset.data[context.dataIndex] >= max;
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

function drawPoint(name, arr, time, pos = 3) {
  arr[time][pos] = name + " [" + time + "/" + formatFloat(arr[time][1]) + "]";
}

function formatFloat(f1) {
  return Math.round(f1 * 100) / 100;
}

function addPoint(arr, Ua, name, i, posInArr) {
  arr[i - 1][posInArr] = Ua;
  drawPoint(name, arr, i - 1, posInArr + 1);
}

function addOvershoot(name, Uamax, Ua) {
  $(name).text(formatFloat((Uamax / Ua - 1) * 100) + " %");
}

function getNormalSignal(delay = delaySend) {
  let arr = new Array(signalLength);

  for (t = 0; t < signalLength; t += samplingInterval) {
    if (delay <= t && t <= delay + pulseLength) {
      arr[t] = signalHeight;
    } else {
      arr[t] = 0;
    }
  }

  return arr;
}

function getAutocorrelation(send, receive) {
  let arr = new Array(signalLength);
  for (i = 0; i < send.length; i++) {
    arr[i] = 0;
    for (t = 0; t < send.length; t++) {
      arr[i] = arr[i] + send[t] * receive[(t + i) % receive.length];
    }
  }

  return arr;
}

function getAutocorrelationNormalized(send, receive) {
  let arr = new Array(signalLength);
  let sendSum = 0;
  let receiveSum = 0;
  for (i = 0; i < send.length; i++) {
    arr[i] = 0;
    sendSum += Math.sqrt(send[i]);
    receiveSum += Math.sqrt(receive[i]);

    for (t = 0; t < send.length; t++) {
      arr[i] = arr[i] + send[t] * receive[(t + i) % receive.length];
    }
  }
  for (i = 0; i < send.length; i++) {
    arr[i] = arr[i] / Math.sqrt(sendSum * receiveSum);
  }

  return arr;
}

function labelSignal(signal) {
  let label = new Array(signal.length);

  for (t = 0; t < signal.length; t += samplingInterval) {
    label[t] = t;
  }
  return [label, signal];
}
