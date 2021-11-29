window.onresize = redraw;
window.onload = init;
Chart.register(ChartDataLabels);

function redraw() {
  $(".canvas_resize").each(function (i, obj) {
    $(this).css("width", "100%");
  });
}

function init() {
  initPlainRect();
}

function initPlainRect() {
  let values = plainRect();
  let options = getDefaultOptions();

  options.plugins.annotation = {
    annotations: {
      annotation_at_period: {
        type: "line",
        scaleID: "x",
        value: Tin,
        borderColor: "black",
        borderWidth: 5,
        label: {
          backgroundColor: "red",
          content: "𝜏 = " + Tin,
          enabled: true,
        },
      },
    },
  };

  const ctx = $("#signal_plain_rect");
  rectChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: values[0],
      datasets: [
        {
          label: "Vout",
          data: values[1],
          borderColor: "rgb(75, 192, 192)",
          tension: 0,
        },
      ],
    },
    options: options,
  });
}

function getSignal(end = Tmeasuring) {
  let arr = new Array(end);

  for (t = 0; t < end; t += samplingInterval) {
    if (t % Tin < Tin / 2) {
      arr[t] = signalHeight;
    } else {
      arr[t] = 0;
    }
  }

  return arr;
}

function plainRect() {
  let label = new Array(Tmeasuring);
  let signal = getSignal(Tmeasuring);

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    label[t] = t;
  }

  $("#signal_plain_rect_period").text(formatFloat(Tin));
  $("#signal_plain_rect_amplitude").text(formatFloat(signalHeight));
  return [label, signal];
}

function fourierRect() {
  let arr = [];
  let ft = getSignal();
  let a = 0;
  let b = 0;
  let c = new Array(Tmeasuring);
  let phi = new Array(Tmeasuring);
  let k = 0;

  for (k = 0; k < numberOfHarmonics; k++) {
    a = 0;
    b = 0;

    for (t = 0; t < Tmeasuring; t++) {
      a +=
        (2 / Tmeasuring) * ft[t] * Math.cos(2 * Math.PI * k * t * Tresolution);
      b +=
        (2 / Tmeasuring) * ft[t] * Math.sin(2 * Math.PI * k * t * Tresolution);
      c[k] = Math.sqrt(a * a + b * b);
      phi[k] = Math.atan(a / b);
    }
  }

  for (k = 0; k < numberOfHarmonics; k++) {
    let value = c[k];
    let pos = k * Tresolution * 1000;
    let annotation = null;

    if (value > 1)
      annotation = "[" + formatFloat(pos) + "/" + formatFloat(value) + "]";

    arr.push([pos, value, annotation]);
  }

  $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

  return arr;
}

function drawFourierRect() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn({ role: "annotation" });

  data.addRows(fourierRect());

  let options = getDefaultOptionsCurveTypeNone("Fourier Analyse");

  let chart = new google.visualization.ColumnChart(
    document.getElementById("signal_fourier_rect")
  );

  chart.draw(data, options);
}

function drawPIDRegulator() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Rise");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Max");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Min");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "control deviation");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Target value");

  data.addRows(pidRegulator());

  let options = getDefaultOptions("PID-Regulator");
  options.series = {
    1: {
      pointSize: 5,
      visibleInLegend: false,
    },
    2: {
      pointSize: 5,
      visibleInLegend: false,
    },
    3: {
      pointSize: 5,
      visibleInLegend: false,
    },
    4: {
      pointSize: 5,
      visibleInLegend: false,
    },
  };

  options.annotations = {
    fontSize: 15,
  };

  let chart = new google.visualization.LineChart(
    document.getElementById("pid_regulator")
  );

  chart.draw(data, options);
}
