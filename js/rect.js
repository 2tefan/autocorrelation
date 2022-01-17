window.onresize = redraw;
window.onload = init;
Chart.register(ChartDataLabels);

function redraw() {
  $(".canvas_resize").each(function (i, obj) {
    $(this).css("width", "100%");
  });
}

function init() {
  let signalHeight = NUMBER;
  let tOn = 100 + 2 * NUMBER;
  let tOff = 2 * tOn;
  let signalLength = 15 * tOn;

  send = initSignalSend(signalHeight, tOn, tOff, signalLength);
  receive = initSignalReceive(signalHeight, tOn, tOff, signalLength);
  initAutocorrelcation(send, receive);
  initAutocorrelcationNormalized(send, receive);
}

function initSignalSend(signalHeight, tOn, tOff, signalLength) {
  const ctx = $("#signal_send");
  let signal = getRect(DELAY_SEND, signalHeight, tOn, tOff, signalLength);
  let values = labelSignal(signal);
  let options = getDefaultOptions("Zeit [ms]");
  prepareAnnotations(options);
  addAnnotationX(
    options,
    "End",
    DELAY_SEND + PULSE_LENGTH,
    "End = " + (DELAY_SEND + PULSE_LENGTH)
  );

  $("#signal_send_t_on").text(formatFloat(tOn));
  $("#signal_send_t_off").text(formatFloat(tOff));
  $("#signal_send_period").text(formatFloat(tOn + tOff));
  $("#signal_send_delay").text(formatFloat(DELAY_SEND));

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
  return signal;
}

function initSignalReceive(signalHeight, tOn, tOff, signalLength) {
  const ctx = $("#signal_receive");
  let signal = getRect(DELAY_RECEIVE, signalHeight, tOn, tOff, signalLength);
  let values = labelSignal(signal);
  let options = getDefaultOptions("Zeit [ms]");

  prepareAnnotations(options);
  addAnnotationX(options, "Start", DELAY_RECEIVE, "Start = " + DELAY_RECEIVE);
  addAnnotationX(
    options,
    "End",
    DELAY_RECEIVE + PULSE_LENGTH,
    "End = " + (DELAY_RECEIVE + PULSE_LENGTH)
  );

  $("#signal_receive_t_on").text(formatFloat(tOn));
  $("#signal_receive_t_off").text(formatFloat(tOff));
  $("#signal_receive_period").text(formatFloat(tOn + tOff));
  $("#signal_receive_delay").text(formatFloat(DELAY_RECEIVE));

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
