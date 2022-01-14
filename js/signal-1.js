window.onresize = redraw;
window.onload = init;
Chart.register(ChartDataLabels);

function redraw() {
  $(".canvas_resize").each(function (i, obj) {
    $(this).css("width", "100%");
  });
}

function init() {
  send = initSignalSend();
  receive = initSignalReceive();
  initAutocorrelcation(send, receive);
}

function initSignalSend() {
  const ctx = $("#signal_send");
  let signal = getNormalSignal();
  let values = labelSignal(signal);
  let options = getDefaultOptions("Zeit [ms]");

  prepareAnnotations(options);
  //addAnnotationX(options, "Start", delaySend, "Start = " + delaySend);
  addAnnotationX(
    options,
    "End",
    delaySend + pulseLength,
    "End = " + (delaySend + pulseLength)
  );

  $("#signal_send_start").text(formatFloat(delaySend));
  $("#signal_send_stop").text(formatFloat(delaySend + pulseLength));
  $("#signal_send_stop_amplitude").text(formatFloat(signalHeight));

  // $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
  return signal;
}

function initSignalReceive() {
  const ctx = $("#signal_receive");
  let signal = getNormalSignal(delayReceive);
  let values = labelSignal(signal);
  let options = getDefaultOptions("Zeit [ms]");

  prepareAnnotations(options);
  addAnnotationX(options, "Start", delayReceive, "Start = " + delayReceive);
  addAnnotationX(
    options,
    "End",
    delayReceive + pulseLength,
    "End = " + (delayReceive + pulseLength)
  );

  $("#signal_receive_start").text(formatFloat(delayReceive));
  $("#signal_receive_stop").text(formatFloat(delayReceive + pulseLength));
  $("#signal_receive_stop_amplitude").text(formatFloat(signalHeight));

  // $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

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
  let options = getDefaultOptions("Zeit [ms]");

  prepareAnnotations(options);
  //addAnnotationX(options, "Start", delaySend, "Start = " + delaySend);
  // addAnnotationX(
  //   options,
  //   "End",
  //   delaySend + pulseLength,
  //   "End = " + (delaySend + pulseLength)
  // );

  // $("#signal_send_start").text(formatFloat(delaySend));
  // $("#signal_send_stop").text(formatFloat(delaySend + pulseLength));
  // $("#signal_send_stop_amplitude").text(formatFloat(signalHeight));

  // $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
  return signal;
}