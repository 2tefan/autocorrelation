window.onresize = redraw;
window.onload = init;
Chart.register(ChartDataLabels);

function redraw() {
  $(".canvas_resize").each(function (i, obj) {
    $(this).css("width", "100%");
  });
}

function init() {
  let pulseLength = PULSE_LENGTH + 50;
  send = initSignalSend(pulseLength);
  receive = initSignalReceive(pulseLength);
  initAutocorrelcation(send, receive);
  initAutocorrelcationNormalized(send, receive);
}

function initSignalSend(pulseLength) {
  const ctx = $("#signal_send");
  let signal = getNormalSignal(DELAY_SEND, pulseLength);
  let values = labelSignal(signal);
  let options = getDefaultOptions("Zeit [ms]");
  prepareAnnotations(options);
  addAnnotationX(
    options,
    "End",
    DELAY_SEND + pulseLength,
    "End = " + (DELAY_SEND + pulseLength)
  );

  $("#signal_send_start").text(formatFloat(DELAY_SEND));
  $("#signal_send_stop").text(formatFloat(DELAY_SEND + pulseLength));
  $("#signal_send_stop_amplitude").text(formatFloat(SIGNAL_HEIGHT));

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
  return signal;
}

function initSignalReceive(pulseLength) {
  const ctx = $("#signal_receive");
  let signal = getNormalSignal(DELAY_RECEIVE, pulseLength);
  let values = labelSignal(signal);
  let options = getDefaultOptions("Zeit [ms]");

  prepareAnnotations(options);
  addAnnotationX(options, "Start", DELAY_RECEIVE, "Start = " + DELAY_RECEIVE);
  addAnnotationX(
    options,
    "End",
    DELAY_RECEIVE + pulseLength,
    "End = " + (DELAY_RECEIVE + pulseLength)
  );

  $("#signal_receive_start").text(formatFloat(DELAY_RECEIVE));
  $("#signal_receive_stop").text(formatFloat(DELAY_RECEIVE + pulseLength));
  $("#signal_receive_stop_amplitude").text(formatFloat(SIGNAL_HEIGHT));

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
  return signal;
}

function initAutocorrelcation(send, receive) {
  const ctx = $("#signal_autocorrelation");
  let signal = getAutocorrelation(send, receive);
  let values = labelSignal(signal);
  let options = getDefaultOptionsAutocorrelcation("Zeit [ms]", signal);
  prepareAnnotations(options);

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
  return signal;
}

function initAutocorrelcationNormalized(send, receive) {
  const ctx = $("#signal_autocorrelation_normalized");
  let signal = getAutocorrelationNormalized(send, receive);
  let values = labelSignal(signal);
  let options = getDefaultOptionsAutocorrelcation("Zeit [ms]", signal);
  prepareAnnotations(options);

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
  return signal;
}